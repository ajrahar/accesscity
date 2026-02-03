from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import datetime

router = APIRouter()

# In-memory storage for obstacles (Prototype only)
# In production, use PostGIS: INSERT INTO obstacles (geom, type) ...
OBSTACLE_DB = []

class ObstacleReport(BaseModel):
    lat: float
    lon: float
    type: str # e.g., "construction", "broken_curb", "stairs", "flooding"
    description: Optional[str] = None
    reporter_id: str = "guest"

class ObstacleResponse(BaseModel):
    id: int
    lat: float
    lon: float
    type: str
    timestamp: str

@router.post("/report")
async def report_obstacle(report: ObstacleReport):
    """
    Submit a new obstacle report.
    """
    new_obstacle = {
        "id": len(OBSTACLE_DB) + 1,
        "lat": report.lat,
        "lon": report.lon,
        "type": report.type,
        "description": report.description,
        "timestamp": datetime.datetime.now().isoformat()
    }
    OBSTACLE_DB.append(new_obstacle)
    return {"status": "success", "data": new_obstacle}

@router.get("/")
async def get_obstacles():
    """
    Get all reported obstacles.
    """
    return {"status": "success", "count": len(OBSTACLE_DB), "data": OBSTACLE_DB}
