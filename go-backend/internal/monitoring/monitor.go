package monitoring

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/SecOpsGrogu1/cloud-cost-optimizer/go-backend/internal/cloud"
)

type ResourceMetrics struct {
	ResourceID   string
	Metrics      map[string]float64
	LastUpdated  time.Time
	AlertHistory []Alert
}

type Alert struct {
	Timestamp   time.Time
	ResourceID  string
	MetricName  string
	Value       float64
	Threshold   float64
	Description string
}

type Monitor struct {
	providers     []cloud.Provider
	metrics      map[string]*ResourceMetrics
	alertRules   []AlertRule
	mu           sync.RWMutex
	updatePeriod time.Duration
}

type AlertRule struct {
	MetricName string
	Threshold  float64
	Condition  string // "above" or "below"
}

func NewMonitor(providers []cloud.Provider) *Monitor {
	return &Monitor{
		providers:     providers,
		metrics:      make(map[string]*ResourceMetrics),
		updatePeriod: 5 * time.Minute,
		alertRules: []AlertRule{
			{MetricName: "CPUUtilization", Threshold: 80, Condition: "above"},
			{MetricName: "MemoryUtilization", Threshold: 80, Condition: "above"},
			{MetricName: "CostPerDay", Threshold: 100, Condition: "above"},
		},
	}
}

func (m *Monitor) Start(ctx context.Context) {
	ticker := time.NewTicker(m.updatePeriod)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			m.updateMetrics(ctx)
			m.checkAlerts()
		}
	}
}

func (m *Monitor) updateMetrics(ctx context.Context) {
	for _, provider := range m.providers {
		resources, err := provider.GetResources(ctx)
		if err != nil {
			continue
		}

		for _, resource := range resources {
			metrics, err := provider.GetResourceMetrics(ctx, resource.ID)
			if err != nil {
				continue
			}

			m.mu.Lock()
			m.metrics[resource.ID] = &ResourceMetrics{
				ResourceID:  resource.ID,
				Metrics:    metrics,
				LastUpdated: time.Now(),
			}
			m.mu.Unlock()
		}
	}
}

func (m *Monitor) checkAlerts() {
	m.mu.RLock()
	defer m.mu.RUnlock()

	for resourceID, resourceMetrics := range m.metrics {
		for _, rule := range m.alertRules {
			if value, ok := resourceMetrics.Metrics[rule.MetricName]; ok {
				if m.shouldAlert(value, rule) {
					alert := Alert{
						Timestamp:   time.Now(),
						ResourceID:  resourceID,
						MetricName:  rule.MetricName,
						Value:       value,
						Threshold:   rule.Threshold,
						Description: generateAlertDescription(resourceID, rule.MetricName, value, rule.Threshold),
					}
					resourceMetrics.AlertHistory = append(resourceMetrics.AlertHistory, alert)
				}
			}
		}
	}
}

func (m *Monitor) shouldAlert(value float64, rule AlertRule) bool {
	switch rule.Condition {
	case "above":
		return value > rule.Threshold
	case "below":
		return value < rule.Threshold
	default:
		return false
	}
}

func generateAlertDescription(resourceID, metricName string, value, threshold float64) string {
	return "Resource " + resourceID + " has " + metricName + " of " + 
		   string(value) + " which is outside the threshold of " + string(threshold)
}

func (m *Monitor) GetMetrics(resourceID string) (*ResourceMetrics, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	
	metrics, ok := m.metrics[resourceID]
	return metrics, ok
}

func (m *Monitor) GetAllMetrics() map[string]*ResourceMetrics {
	m.mu.RLock()
	defer m.mu.RUnlock()

	// Create a copy to avoid concurrent access issues
	metricsCopy := make(map[string]*ResourceMetrics)
	for k, v := range m.metrics {
		metricsCopy[k] = v
	}
	
	return metricsCopy
}
