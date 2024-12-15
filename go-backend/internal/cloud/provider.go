package cloud

import (
	"context"
	"time"
)

// Resource represents a cloud resource with its cost and usage data
type Resource struct {
	ID           string
	Name         string
	Type         string
	Region       string
	Cost         float64
	Usage        float64
	LastAccessed time.Time
	Tags         map[string]string
	Provider     string
}

// CostData represents cost information for a resource or service
type CostData struct {
	Amount     float64
	Currency   string
	StartTime  time.Time
	EndTime    time.Time
	ResourceID string
	Service    string
}

// Provider defines the interface that all cloud providers must implement
type Provider interface {
	// GetResources returns all resources for the account
	GetResources(ctx context.Context) ([]Resource, error)

	// GetCostData returns cost data for a specific time range
	GetCostData(ctx context.Context, startTime, endTime time.Time) ([]CostData, error)

	// GetResourceMetrics returns real-time metrics for a resource
	GetResourceMetrics(ctx context.Context, resourceID string) (map[string]float64, error)

	// OptimizeResource attempts to optimize a resource based on its usage patterns
	OptimizeResource(ctx context.Context, resourceID string) error

	// GetName returns the provider name (AWS, Azure, GCP)
	GetName() string
}
