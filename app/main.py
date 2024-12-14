from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import os
from dotenv import load_dotenv

from cloud_providers.aws_provider import AWSProvider
from cloud_providers.gcp_provider import GCPProvider
from cloud_providers.azure_provider import AzureProvider

load_dotenv()

app = FastAPI(title="Cloud Cost Optimizer", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize cloud providers
aws = AWSProvider()
gcp = GCPProvider()
azure = AzureProvider()

@app.get("/")
async def root():
    return {"message": "Cloud Cost Optimizer API"}

@app.get("/optimize/all")
async def get_all_optimizations() -> Dict:
    """Get optimization recommendations for all cloud providers."""
    try:
        results = {
            "aws": aws.get_unused_resources(),
            "gcp": gcp.get_unused_resources(),
            "azure": azure.get_unused_resources()
        }
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/costs/all")
async def get_all_costs() -> Dict:
    """Get cost analysis from all cloud providers."""
    try:
        results = {
            "aws": aws.get_cost_analysis(),
            "gcp": gcp.get_cost_analysis(),
            "azure": azure.get_cost_analysis()
        }
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/optimize/{provider}")
async def get_provider_optimizations(provider: str) -> List[Dict]:
    """Get optimization recommendations for a specific cloud provider."""
    try:
        if provider == "aws":
            return aws.get_unused_resources()
        elif provider == "gcp":
            return gcp.get_unused_resources()
        elif provider == "azure":
            return azure.get_unused_resources()
        else:
            raise HTTPException(status_code=400, detail="Invalid provider specified")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/costs/{provider}")
async def get_provider_costs(provider: str) -> Dict:
    """Get cost analysis for a specific cloud provider."""
    try:
        if provider == "aws":
            return aws.get_cost_analysis()
        elif provider == "gcp":
            return gcp.get_cost_analysis()
        elif provider == "azure":
            return azure.get_cost_analysis()
        else:
            raise HTTPException(status_code=400, detail="Invalid provider specified")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
