from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from health_agent import DevOpsHealthAgent

app = FastAPI(title="DevOps Health Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://*.vercel.app",    # All Vercel deployments
        "*"                        # Allow all (for hackathon demo)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = DevOpsHealthAgent()

class LogAnalysisRequest(BaseModel):
    logs: str

@app.get("/")
def read_root():
    return {"message": "DevOps Health Monitor API is running!", "status": "healthy"}

@app.post("/analyze")
def analyze_logs(request: LogAnalysisRequest):
    try:
        result = agent.analyze_logs(request.logs)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 API starting at http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)