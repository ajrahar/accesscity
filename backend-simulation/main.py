from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes

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

@app.get("/")
def read_root():
    return {"message": "AccessCity Backend is Running! 🚀"}

@app.get("/status")
def check_status():
    return {"service": "simulation-engine", "status": "active", "wcag_compliant": True}
