from fastapi import APIRouter

router = APIRouter()

@router.get("/routes")
async def get_transit_routes():
    """
    Mock Transit API. Returns nearby accessible bus stops and routes.
    """
    return {
        "status": "success",
        "agency": "TransJogja Accessible",
        "stops": [
            {"name": "Halte Malioboro 1", "lat": -7.792, "lon": 110.365, "accessible": True},
            {"name": "Halte UGM", "lat": -7.775, "lon": 110.378, "accessible": True},
            {"name": "Stasiun Tugu", "lat": -7.789, "lon": 110.363, "accessible": True}
        ],
        "routes": [
             {
                "id": "1A",
                "name": "Prambanan - Malioboro",
                "frequency_min": 10
             }
        ]
    }
