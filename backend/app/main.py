from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List, Dict
import logging

from app.services.aws_service import AWSService
from app.core.config import Settings
from app.core.security import get_current_user
from app.schemas.optimization import OptimizationResponse, CostAnalysisResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load settings
settings = Settings()

# Initialize FastAPI app
app = FastAPI(
    title="AWS Cost Optimizer",
    description="AI-powered AWS cost optimization service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AWS service
aws_service = AWSService()

@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/api/v1/costs/current", response_model=CostAnalysisResponse)
async def get_current_costs(current_user: dict = Depends(get_current_user)):
    """Get current month's cost analysis."""
    try:
        end_date = datetime.utcnow()
        start_date = end_date.replace(day=1)  # Start of current month
        
        cost_data = await aws_service.get_cost_and_usage(start_date, end_date)
        return cost_data
    except Exception as e:
        logger.error(f"Error getting current costs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/costs/historical")
async def get_historical_costs(
    days: int = 30,
    current_user: dict = Depends(get_current_user)
):
    """Get historical cost data."""
    try:
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        cost_data = await aws_service.get_cost_and_usage(start_date, end_date)
        return cost_data
    except Exception as e:
        logger.error(f"Error getting historical costs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/optimization/recommendations", response_model=List[OptimizationResponse])
async def get_optimization_recommendations(current_user: dict = Depends(get_current_user)):
    """Get cost optimization recommendations."""
    try:
        recommendations = await aws_service.get_optimization_recommendations()
        return recommendations
    except Exception as e:
        logger.error(f"Error getting optimization recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/resources/underutilized")
async def get_underutilized_resources(current_user: dict = Depends(get_current_user)):
    """Get list of underutilized resources."""
    try:
        resources = await aws_service.get_underutilized_resources()
        return resources
    except Exception as e:
        logger.error(f"Error getting underutilized resources: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/savings/forecast")
async def get_savings_forecast(current_user: dict = Depends(get_current_user)):
    """Get savings forecast based on optimization recommendations."""
    try:
        forecast = await aws_service.get_savings_forecast()
        return forecast
    except Exception as e:
        logger.error(f"Error getting savings forecast: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
