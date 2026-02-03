from fastapi import APIRouter, File, UploadFile
import random

router = APIRouter()

@router.post("/analyze-surface")
async def analyze_surface(file: UploadFile = File(...)):
    """
    Mock Computer Vision API.
    Analyzes an uploaded image and classifies surface quality.
    """
    # Simulate processing delay
    # In production, this would call tensorflow/pytorch model
    
    classes = [
        {"status": "Safe", "confidence": 0.95, "desc": "Smooth concrete surface."},
        {"status": "Warning", "confidence": 0.75, "desc": "Uneven paving stones detected."},
        {"status": "Danger", "confidence": 0.88, "desc": "Stairs detected without ramp."}
    ]
    
    # Random prediction for prototype
    result = random.choice(classes)
    
    return {
        "filename": file.filename,
        "prediction": result["status"],
        "confidence": result["confidence"],
        "description": result["desc"]
    }
