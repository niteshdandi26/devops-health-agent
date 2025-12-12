"""
Vercel Serverless Entry Point for DevOps Health Monitor API
This file is specifically for Vercel deployment
"""
from main import app

# Vercel will automatically detect and use this
# No need to run uvicorn here - Vercel handles it!
