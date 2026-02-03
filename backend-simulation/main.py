from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes, sos, obstacles, ai_vision, transit

app = FastAPI(title="AccessCity Simulation Service", version="2.0")

# Fix CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(routes.router, prefix="/api/v1/simulation", tags=["simulation"])
app.include_router(sos.router, prefix="/api/v1/safety", tags=["safety"])
app.include_router(obstacles.router, prefix="/api/v1/community", tags=["community"])
app.include_router(ai_vision.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(transit.router, prefix="/api/v1/transit", tags=["transit"])

@app.get("/")
def read_root():
    return {"message": "AccessCity Backend is Running! 🚀"}

@app.get("/status")
def check_status():
    return {"service": "simulation-engine", "status": "active", "wcag_compliant": True}
