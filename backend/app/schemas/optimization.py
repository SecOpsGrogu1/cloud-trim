from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class ResourceMetrics(BaseModel):
    cpu_utilization: Dict[str, float]
    memory_utilization: Optional[Dict[str, float]]
    storage_utilization: Optional[Dict[str, float]]

class OptimizationResponse(BaseModel):
    resource_id: str
    resource_type: str
    current_config: str
    recommended_config: str
    reason: str
    estimated_savings: float
    metrics: ResourceMetrics

class CostBreakdown(BaseModel):
    service: str
    cost: float
    usage: float

class CostAnalysisResponse(BaseModel):
    total_cost: float
    start_date: datetime
    end_date: datetime
    currency: str = "USD"
    breakdown_by_service: List[CostBreakdown]
    breakdown_by_tag: Dict[str, float]

class SavingsForecast(BaseModel):
    total_potential_savings: float
    recommendations_count: int
    breakdown_by_service: Dict[str, float]
    implementation_timeline: Dict[str, float]

class UnderutilizedResource(BaseModel):
    resource_id: str
    resource_type: str
    average_utilization: float
    peak_utilization: float
    cost_per_month: float
    last_used: datetime
