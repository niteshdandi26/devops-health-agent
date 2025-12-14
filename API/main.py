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

@app.get("/generate-logs")
def generate_logs():
    """Generate realistic, varying log data for real-time monitoring"""
    import random
    from datetime import datetime
    
    errors = [
        {
            "type": "Database",
            "logs": [
                f"[{datetime.now().isoformat()}] ERROR: Database connection timeout",
                f"[{datetime.now().isoformat()}] ERROR: Max connections reached: 100/100",
                f"[{datetime.now().isoformat()}] CRITICAL: Connection pool exhausted"
            ]
        },
        {
            "type": "API",
            "logs": [
                f"[{datetime.now().isoformat()}] ERROR: API request timeout after 30s",
                f"[{datetime.now().isoformat()}] ERROR: Rate limit exceeded: 1000 req/min",
                f"[{datetime.now().isoformat()}] WARNING: High latency detected: 2.5s"
            ]
        },
        {
            "type": "Memory",
            "logs": [
                f"[{datetime.now().isoformat()}] ERROR: Memory usage critical: 95%",
                f"[{datetime.now().isoformat()}] WARNING: Heap size exceeded threshold",
                f"[{datetime.now().isoformat()}] CRITICAL: Out of memory exception"
            ]
        },
        {
            "type": "Disk",
            "logs": [
                f"[{datetime.now().isoformat()}] ERROR: Disk space low: 98% used",
                f"[{datetime.now().isoformat()}] CRITICAL: Unable to write to disk",
                f"[{datetime.now().isoformat()}] ERROR: I/O operation failed"
            ]
        },
        {
            "type": "Network",
            "logs": [
                f"[{datetime.now().isoformat()}] ERROR: Network connection lost",
                f"[{datetime.now().isoformat()}] ERROR: DNS resolution failed",
                f"[{datetime.now().isoformat()}] WARNING: High packet loss: 15%"
            ]
        }
    ]
    
    # Randomly select an error scenario
    selected = random.choice(errors)
    
    return {
        "logs": "\n".join(selected["logs"]),
        "source": selected["type"],
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 API starting at http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)