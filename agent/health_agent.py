# This is the main AI agent that analyzes error logs using GROQ
from dotenv import load_dotenv
load_dotenv()
import os
import sys
# Force UTF-8 encoding for Windows terminals
sys.stdout.reconfigure(encoding='utf-8')
from groq import Groq
from typing import Dict, Any
from datetime import datetime, timezone
import json
from .prompt_templates import SYSTEM_PROMPT, ANALYSIS_PROMPT

class DevOpsHealthAgent:
    """
    AI Agent that analyzes application logs and suggests fixes
    Think of this as a robot engineer that reads error messages
    Uses GROQ - the fastest AI inference in the world!
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize the agent - this runs when we create the agent
        api_key: Your GROQ API secret key
        """
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found! Please set it in your .env file.")
        
        # Connect to GROQ service
        self.client = Groq(api_key=self.api_key)
        
        # Which AI model to use (Llama 3.1 70B - very smart and SUPER FAST on Groq!)
        self.model = "llama-3.3-70b-versatile"
    
    def analyze_logs(self, log_content: str) -> Dict[str, Any]:
        """
        Main method: Takes error logs, sends to AI, gets back analysis
        
        log_content: The error message you want analyzed
        Returns: A dictionary with the AI's analysis
        """
        try:
            # Step 1: Prepare the question for the AI
            user_prompt = ANALYSIS_PROMPT.format(log_content=log_content)
            
            # Step 2: Send the question to the AI model via GROQ
            print("🤖 Sending logs to GROQ AI for analysis...")
            print("⚡ Using the world's fastest AI inference...")
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=512,
                temperature=0.3,
            )
            
            # Step 3: Get the AI's response
            ai_response = response.choices[0].message.content
            print("✅ AI analysis complete!")
            
            # Step 4: Parse the response into organized sections
            parsed = self._parse_response(ai_response)
            
            # Step 5: Package everything nicely
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
            print(f"❌ Error: {str(e)}")
            return {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "status": "error",
                "error": str(e),
                "analysis": None
            }
    
    def _parse_response(self, response: str) -> Dict[str, str]:
        """
        Parse the AI's text response into organized fields
        Like sorting mail into different boxes
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


# TEST SECTION - This runs when you execute this file
if __name__ == "__main__":
    print("="*60)
    print("🚀 DEVOPS HEALTH AGENT - DAY 1 TEST")
    print("⚡ Powered by GROQ - The World's Fastest AI")
    print("="*60)
    print()
    
    # Sample error log for testing (fake error message)
    sample_log = """
    [2024-12-08 14:32:15] ERROR: Database connection failed
    [2024-12-08 14:32:15] psycopg2.OperationalError: FATAL: remaining connection slots are reserved
    [2024-12-08 14:32:15] could not connect to server: Connection refused
    [2024-12-08 14:32:15] Is the server running on host "db.example.com" (10.0.1.5) and accepting TCP/IP connections on port 5432?
    """
    
    print("📋 Sample Error Log:")
    print(sample_log)
    print()
    
    # Create the AI agent
    print("🔧 Creating AI agent with GROQ...")
    agent = DevOpsHealthAgent()
    print("✅ Agent created!")
    print()
    
    # Analyze the error
    print("🔍 Analyzing error with AI...")
    result = agent.analyze_logs(sample_log)
    print()
    
    # Display results nicely
    print("="*60)
    print("📊 ANALYSIS RESULTS")
    print("="*60)
    print()
    
    if result["status"] == "success":
        analysis = result["analysis"]
        print(f"❌ ERROR DETECTED:")
        print(f"   {analysis['error']}")
        print()
        print(f"🔍 ROOT CAUSE:")
        print(f"   {analysis['cause']}")
        print()
        print(f"💡 RECOMMENDED SOLUTION:")
        print(f"   {analysis['solution']}")
        print()
        print(f"⚠️  SEVERITY: {analysis['severity']}")
        print()
        print(f"🕐 Analysis completed at: {result['timestamp']}")
        print(f"🤖 AI Model used: {result['model']}")
        print(f"⚡ Powered by: {result['provider']}")
    else:
        print(f"❌ Analysis failed: {result['error']}")
    
    print()
    print("="*60)
    print("🎉 DAY 1 COMPLETE! Your AI agent works!")
    print("⚡ GROQ made it lightning fast!")
    print("="*60)