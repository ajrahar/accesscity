from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from ..logic.route_engine import RouteEngine

router = APIRouter()
engine = RouteEngine()

class Coordinate(BaseModel):
    lat: float
    lon: float

class RouteRequest(BaseModel):
    origin: Coordinate
    destination: Coordinate
    mode: Optional[str] = "wheelchair"
    avoid_stairs: Optional[bool] = True

@router.post("/route")
async def calculate_route(request: RouteRequest):
    """
    Calculate a safe route based on accessibility preferences.
    """
    try:
        route = engine.find_safe_route(
            (request.origin.lat, request.origin.lon),
            (request.destination.lat, request.destination.lon)
        )
        return {
            "status": "success",
            "request_data": request,
            "geometry": route
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
