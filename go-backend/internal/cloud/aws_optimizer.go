package cloud

import (
	"context"
	"fmt"
	"sort"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/cloudwatch"
	"github.com/aws/aws-sdk-go-v2/aws"
)

// getResourceUsage fetches detailed usage metrics for a resource
func (p *AWSProvider) getResourceUsage(ctx context.Context, resourceID string, period int) (*ResourceUsage, error) {
	endTime := time.Now()
	startTime := endTime.AddDate(0, 0, -period)

	metrics := []struct {
		name      string
		namespace string
		stat      string
	}{
		{"CPUUtilization", "AWS/EC2", "Average"},
		{"MemoryUtilization", "System/Linux", "Average"},
		{"NetworkIn", "AWS/EC2", "Sum"},
		{"NetworkOut", "AWS/EC2", "Sum"},
		{"DiskReadOps", "AWS/EC2", "Sum"},
		{"DiskWriteOps", "AWS/EC2", "Sum"},
	}

	usage := &ResourceUsage{}

	for _, metric := range metrics {
		input := &cloudwatch.GetMetricStatisticsInput{
			Namespace:  aws.String(metric.namespace),
			MetricName: aws.String(metric.name),
			Dimensions: []cloudwatch.Dimension{
				{
					Name:  aws.String("InstanceId"),
					Value: aws.String(resourceID),
				},
			},
			StartTime: aws.Time(startTime),
			EndTime:   aws.Time(endTime),
			Period:    aws.Int32(3600), // 1 hour periods
			Statistics: []string{
				metric.stat,
			},
		}

		output, err := p.cloudWatchClient.GetMetricStatistics(ctx, input)
		if err != nil {
			return nil, fmt.Errorf("failed to get %s metric: %v", metric.name, err)
		}

		if len(output.Datapoints) > 0 {
			// Sort datapoints by timestamp
			sort.Slice(output.Datapoints, func(i, j int) bool {
				return output.Datapoints[i].Timestamp.Before(
					*output.Datapoints[j].Timestamp,
				)
			})

			// Get the average of all datapoints
			var sum float64
			for _, dp := range output.Datapoints {
				sum += *dp.Average
			}
			avg := sum / float64(len(output.Datapoints))

			// Assign to the appropriate field
			switch metric.name {
			case "CPUUtilization":
				usage.CPUUtilization = avg
			case "MemoryUtilization":
				usage.MemoryUtilization = avg
			case "NetworkIn":
				usage.NetworkIn = avg
			case "NetworkOut":
				usage.NetworkOut = avg
			case "DiskReadOps":
				usage.DiskReadOps = avg
			case "DiskWriteOps":
				usage.DiskWriteOps = avg
			}
		}
	}

	return usage, nil
}

// analyzeResourceOptimization generates optimization recommendations based on usage
func (p *AWSProvider) analyzeResourceOptimization(
	ctx context.Context,
	resource Resource,
	usage *ResourceUsage,
	rules RightSizingRule,
) (*OptimizationRecommendation, error) {
	// Find current instance type in our known types
	var currentInstance InstanceTypeInfo
	for _, instance := range CommonInstanceTypes {
		if instance.Name == resource.Type {
			currentInstance = instance
			break
		}
	}

	// If instance type not found, skip optimization
	if currentInstance.Name == "" {
		return nil, nil
	}

	var recommendation *OptimizationRecommendation

	// Check for underutilization
	if usage.CPUUtilization < rules.MinCPUUtilization &&
		usage.MemoryUtilization < rules.MinMemoryUtilization {
		// Find a smaller instance type
		for _, instance := range CommonInstanceTypes {
			if instance.VCPU < currentInstance.VCPU &&
				instance.MemoryGB >= (usage.MemoryUtilization/100)*currentInstance.MemoryGB {
				
				savings := (currentInstance.PricePerHour - instance.PricePerHour) * 24 * 30 // Monthly savings
				
				recommendation = &OptimizationRecommendation{
					ResourceID:      resource.ID,
					ResourceType:    resource.Type,
					CurrentCost:     currentInstance.PricePerHour * 24 * 30,
					ProjectedSaving: savings,
					Action:         "Downsize",
					Reason:         fmt.Sprintf("Low utilization: CPU %.1f%%, Memory %.1f%%", usage.CPUUtilization, usage.MemoryUtilization),
					Priority:       getPriority(savings),
					CurrentSpec: ResourceSpec{
						InstanceType:  currentInstance.Name,
						VCPU:         currentInstance.VCPU,
						MemoryGB:     currentInstance.MemoryGB,
						PricePerHour: currentInstance.PricePerHour,
					},
					RecommendedSpec: ResourceSpec{
						InstanceType:  instance.Name,
						VCPU:         instance.VCPU,
						MemoryGB:     instance.MemoryGB,
						PricePerHour: instance.PricePerHour,
					},
				}
				break
			}
		}
	}

	// Check for overutilization
	if usage.CPUUtilization > rules.MaxCPUUtilization ||
		usage.MemoryUtilization > rules.MaxMemoryUtilization {
		// Find a larger instance type
		for _, instance := range CommonInstanceTypes {
			if instance.VCPU > currentInstance.VCPU {
				additionalCost := (instance.PricePerHour - currentInstance.PricePerHour) * 24 * 30
				
				recommendation = &OptimizationRecommendation{
					ResourceID:      resource.ID,
					ResourceType:    resource.Type,
					CurrentCost:     currentInstance.PricePerHour * 24 * 30,
					ProjectedSaving: -additionalCost, // Negative savings (cost increase)
					Action:         "Upsize",
					Reason:         fmt.Sprintf("High utilization: CPU %.1f%%, Memory %.1f%%", usage.CPUUtilization, usage.MemoryUtilization),
					Priority:       "HIGH",
					CurrentSpec: ResourceSpec{
						InstanceType:  currentInstance.Name,
						VCPU:         currentInstance.VCPU,
						MemoryGB:     currentInstance.MemoryGB,
						PricePerHour: currentInstance.PricePerHour,
					},
					RecommendedSpec: ResourceSpec{
						InstanceType:  instance.Name,
						VCPU:         instance.VCPU,
						MemoryGB:     instance.MemoryGB,
						PricePerHour: instance.PricePerHour,
					},
				}
				break
			}
		}
	}

	return recommendation, nil
}

func getPriority(monthlySavings float64) string {
	switch {
	case monthlySavings > 100:
		return "HIGH"
	case monthlySavings > 50:
		return "MEDIUM"
	default:
		return "LOW"
	}
}
