from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import datetime

router = APIRouter()

class SOSRequest(BaseModel):
    lat: float
    lon: float
    message: str = "EMERGENCY: Assistance Required!"
    user_id: str = "guest"

@router.post("/sos")
async def trigger_sos(request: SOSRequest):
    """
    Trigger an emergency SOS alert.
    """
    # In a real app, this would send SMS via Twilio or push notification
    timestamp = datetime.datetime.now().isoformat()
    print(f"[{timestamp}] SOS ALERT from {request.user_id} at {request.lat}, {request.lon}: {request.message}")
    
    return {
        "status": "alert_sent",
        "timestamp": timestamp,
        "location": {"lat": request.lat, "lon": request.lon},
        "message": "Emergency signal received. Help is on the way."
    }
