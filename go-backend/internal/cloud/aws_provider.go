package cloud

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cloudwatch"
	"github.com/aws/aws-sdk-go-v2/service/costexplorer"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
)

type AWSProvider struct {
	costExplorerClient *costexplorer.Client
	ec2Client          *ec2.Client
	cloudWatchClient   *cloudwatch.Client
	config             aws.Config
	rules              RightSizingRule
}

func NewAWSProvider(cfg aws.Config) *AWSProvider {
	return &AWSProvider{
		costExplorerClient: costexplorer.NewFromConfig(cfg),
		ec2Client:          ec2.NewFromConfig(cfg),
		cloudWatchClient:   cloudwatch.NewFromConfig(cfg),
		config:             cfg,
		rules:              DefaultRightSizingRules,
	}
}

func (p *AWSProvider) GetResources(ctx context.Context) ([]Resource, error) {
	resp, err := p.ec2Client.DescribeInstances(ctx, &ec2.DescribeInstancesInput{})
	if err != nil {
		return nil, err
	}

	var resources []Resource
	for _, reservation := range resp.Reservations {
		for _, instance := range reservation.Instances {
			tags := make(map[string]string)
			for _, tag := range instance.Tags {
				tags[*tag.Key] = *tag.Value
			}

			resources = append(resources, Resource{
				ID:       *instance.InstanceId,
				Name:     tags["Name"],
				Type:     string(instance.InstanceType),
				Region:   p.config.Region,
				Provider: "AWS",
				Tags:     tags,
			})
		}
	}

	return resources, nil
}

func (p *AWSProvider) GetCostData(ctx context.Context, startTime, endTime time.Time) ([]CostData, error) {
	input := &costexplorer.GetCostAndUsageInput{
		TimePeriod: &costexplorer.DateInterval{
			Start: aws.String(startTime.Format("2006-01-02")),
			End:   aws.String(endTime.Format("2006-01-02")),
		},
		Granularity: "DAILY",
		Metrics:     []string{"UnblendedCost"},
		GroupBy: []costexplorer.GroupDefinition{
			{
				Type: "DIMENSION",
				Key:  aws.String("SERVICE"),
			},
		},
	}

	resp, err := p.costExplorerClient.GetCostAndUsage(ctx, input)
	if err != nil {
		return nil, err
	}

	var costData []CostData
	for _, result := range resp.ResultsByTime {
		for _, group := range result.Groups {
			amount := 0.0
			if cost := group.Metrics["UnblendedCost"].Amount; cost != nil {
				amount = aws.ToFloat64(cost)
			}

			costData = append(costData, CostData{
				Amount:   amount,
				Currency: *group.Metrics["UnblendedCost"].Unit,
				Service:  *group.Keys[0],
			})
		}
	}

	return costData, nil
}

func (p *AWSProvider) GetResourceMetrics(ctx context.Context, resourceID string) (map[string]float64, error) {
	usage, err := p.getResourceUsage(ctx, resourceID, 1) // Get last 24 hours of metrics
	if err != nil {
		return nil, err
	}

	return map[string]float64{
		"CPUUtilization":    usage.CPUUtilization,
		"MemoryUtilization": usage.MemoryUtilization,
		"NetworkIn":         usage.NetworkIn,
		"NetworkOut":        usage.NetworkOut,
		"DiskReadOps":       usage.DiskReadOps,
		"DiskWriteOps":      usage.DiskWriteOps,
	}, nil
}

func (p *AWSProvider) OptimizeResource(ctx context.Context, resourceID string) error {
	// Get resource details
	resources, err := p.GetResources(ctx)
	if err != nil {
		return err
	}

	var targetResource Resource
	for _, r := range resources {
		if r.ID == resourceID {
			targetResource = r
			break
		}
	}

	if targetResource.ID == "" {
		return fmt.Errorf("resource not found: %s", resourceID)
	}

	// Get resource usage
	usage, err := p.getResourceUsage(ctx, resourceID, p.rules.ObservationPeriod)
	if err != nil {
		return err
	}

	// Analyze and get recommendations
	recommendation, err := p.analyzeResourceOptimization(ctx, targetResource, usage, p.rules)
	if err != nil {
		return err
	}

	// If there's a recommendation, implement it
	if recommendation != nil {
		// For now, just log the recommendation
		// In the future, we could automatically apply the changes
		log.Printf("Optimization recommendation for %s: %s - %s",
			resourceID,
			recommendation.Action,
			recommendation.Reason,
		)
	}

	return nil
}

func (p *AWSProvider) GetName() string {
	return "AWS"
}
