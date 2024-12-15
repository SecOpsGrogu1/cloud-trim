package cloud

// ResourceUsage represents the usage metrics of an AWS resource
type ResourceUsage struct {
	CPUUtilization    float64
	MemoryUtilization float64
	NetworkIn         float64
	NetworkOut        float64
	DiskReadOps       float64
	DiskWriteOps      float64
}

// OptimizationRecommendation represents a cost-saving recommendation
type OptimizationRecommendation struct {
	ResourceID      string
	ResourceType    string
	CurrentCost     float64
	ProjectedSaving float64
	Action         string
	Reason         string
	Priority       string // "HIGH", "MEDIUM", "LOW"
	CurrentSpec    ResourceSpec
	RecommendedSpec ResourceSpec
}

// ResourceSpec represents the specifications of a resource
type ResourceSpec struct {
	InstanceType     string
	VCPU            int
	MemoryGB        float64
	StorageGB       float64
	PricePerHour    float64
}

// RightSizingRule defines when to recommend instance type changes
type RightSizingRule struct {
	MaxCPUUtilization    float64
	MaxMemoryUtilization float64
	MinCPUUtilization    float64
	MinMemoryUtilization float64
	ObservationPeriod    int // days
}

// InstanceTypeInfo contains pricing and specifications for EC2 instance types
type InstanceTypeInfo struct {
	Name         string
	VCPU         int
	MemoryGB     float64
	PricePerHour float64
	Generation   string // "current" or "previous"
}

var (
	// Default rules for resource optimization
	DefaultRightSizingRules = RightSizingRule{
		MaxCPUUtilization:    80.0,
		MaxMemoryUtilization: 80.0,
		MinCPUUtilization:    20.0,
		MinMemoryUtilization: 20.0,
		ObservationPeriod:    14,
	}

	// Common instance types and their specifications
	CommonInstanceTypes = []InstanceTypeInfo{
		{Name: "t3.micro", VCPU: 2, MemoryGB: 1, PricePerHour: 0.0104, Generation: "current"},
		{Name: "t3.small", VCPU: 2, MemoryGB: 2, PricePerHour: 0.0208, Generation: "current"},
		{Name: "t3.medium", VCPU: 2, MemoryGB: 4, PricePerHour: 0.0416, Generation: "current"},
		{Name: "t3.large", VCPU: 2, MemoryGB: 8, PricePerHour: 0.0832, Generation: "current"},
		{Name: "t3.xlarge", VCPU: 4, MemoryGB: 16, PricePerHour: 0.1664, Generation: "current"},
		{Name: "t3.2xlarge", VCPU: 8, MemoryGB: 32, PricePerHour: 0.3328, Generation: "current"},
	}
)
