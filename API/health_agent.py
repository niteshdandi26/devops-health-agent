# DevOps Health Agent - Vercel Compatible Version
from dotenv import load_dotenv
load_dotenv()
import os
from groq import Groq
from typing import Dict, Any
from datetime import datetime, timezone
from prompt_templates import SYSTEM_PROMPT, ANALYSIS_PROMPT

class DevOpsHealthAgent:
    """
    AI Agent that analyzes application logs and suggests fixes
    Uses GROQ - the fastest AI inference in the world!
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize the agent
        api_key: Your GROQ API secret key
        """
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found! Please set it in environment variables.")
        
        # Connect to GROQ service
        self.client = Groq(api_key=self.api_key)
        
        # Which AI model to use
        self.model = "llama-3.3-70b-versatile"
    
    def analyze_logs(self, log_content: str) -> Dict[str, Any]:
        """
        Main method: Takes error logs, sends to AI, gets back analysis
        
        log_content: The error message you want analyzed
        Returns: A dictionary with the AI's analysis
        """
        try:
            # Prepare the question for the AI
            user_prompt = ANALYSIS_PROMPT.format(log_content=log_content)
            
            # Send to AI model via GROQ
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=512,
                temperature=0.3,
            )
            
            # Get the AI's response
            ai_response = response.choices[0].message.content
            
            # Parse the response
            parsed = self._parse_response(ai_response)
            
            # Package everything nicely
            result = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "status": "success",
                "analysis": parsed,
                "raw_response": ai_response,
                "model": self.model,
                "provider": "GROQ (Lightning Fast!)"
            }
            
            return result
            
        except Exception as e:
            # If something goes wrong, return error info
            return {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "status": "error",
                "error": str(e),
                "analysis": None
            }
    
    def _parse_response(self, response: str) -> Dict[str, str]:
        """
        Parse the AI's text response into organized fields
        """
        lines = response.split('\n')
        parsed = {
            "error": "",
            "cause": "",
            "solution": "",
            "severity": "UNKNOWN"
        }
        
        current_field = None
        
        for line in lines:
            line = line.strip()
            if line.startswith("ERROR:"):
                current_field = "error"
                parsed["error"] = line.replace("ERROR:", "").strip()
            elif line.startswith("CAUSE:"):
                current_field = "cause"
                parsed["cause"] = line.replace("CAUSE:", "").strip()
            elif line.startswith("SOLUTION:"):
                current_field = "solution"
                parsed["solution"] = line.replace("SOLUTION:", "").strip()
            elif line.startswith("SEVERITY:"):
                current_field = "severity"
                parsed["severity"] = line.replace("SEVERITY:", "").strip()
            elif current_field and line:
                parsed[current_field] += " " + line
        
        return parsed
