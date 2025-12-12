# ✅ Kestra Workflow - Quick Start Guide

## 🎯 What You Have

1. **API Running**: Your FastAPI is working at `http://localhost:8000`
2. **Kestra Running**: Kestra UI at `http://localhost:8080`
3. **Workflow File**: `kestra-workflow.yml` (ready to use)

---

## 🚀 How to Use the Workflow in Kestra

### Step 1: Open Kestra UI
Go to: **http://localhost:8000**

### Step 2: Create the Flow
1. Click **"Flows"** in the left sidebar
2. Click **"Create"** button (top right)
3. Copy and paste the content from `kestra-workflow.yml`
4. Click **"Save"**

### Step 3: Test the Flow
1. Click **"Execute"** button (top right)
2. Watch it run!
3. Check the **"Logs"** tab to see the AI analysis results

---

## ⚠️ If You Get an Error

### Most Common Issue: Connection Error

**Error Message:** `Connection refused` or `Cannot connect to host.docker.internal`

**Quick Fix:**

1. Find your Windows IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.100`)

2. In the workflow, change this line:
   ```yaml
   uri: "http://host.docker.internal:8000/analyze"
   ```
   
   To use your IP:
   ```yaml
   uri: "http://192.168.1.100:8000/analyze"
   ```

3. Save and try again!

---

## 📋 What the Workflow Does

1. **Every 10 minutes** (or when you click Execute):
   - Sends a sample error log to your API
   - AI analyzes the error using GROQ
   - Displays the results with:
     - ❌ Error description
     - 🔍 Root cause
     - 💡 Solution
     - ⚠️ Severity level

---

## 🔍 Viewing Results

After execution:
1. Go to **"Executions"** tab
2. Click on the latest execution
3. Click on **"Logs"** tab
4. Scroll to the `show_results` task
5. You'll see the beautiful formatted AI analysis!

---

## 🎨 Example Output

```
╔════════════════════════════════════════════════════════════╗
║           🤖 AI AGENT ANALYSIS RESULTS                    ║
╚════════════════════════════════════════════════════════════╝

📊 STATUS: success
🤖 MODEL: llama-3.3-70b-versatile
⚡ PROVIDER: GROQ (Lightning Fast!)

❌ ERROR DETECTED:
   Database connection failed

🔍 ROOT CAUSE:
   Incorrect database credentials or network issue

💡 RECOMMENDED SOLUTION:
   Check database credentials and verify server status

⚠️  SEVERITY LEVEL: CRITICAL
```

---

## 🛠️ Troubleshooting

If something doesn't work, check:

1. ✅ **Is your API running?**
   ```powershell
   # In API folder
   python main.py
   ```

2. ✅ **Is Kestra running?**
   ```powershell
   docker ps
   ```
   Should show `kestra` and `kestra-postgres` containers

3. ✅ **Can you access the API?**
   Open browser: http://localhost:8000

4. ✅ **Check detailed troubleshooting**
   See `KESTRA_TROUBLESHOOTING.md` for more help

---

## 📞 Need More Help?

Tell me:
1. What error message you see in Kestra
2. Which task is failing (check the Logs tab)
3. Screenshot if possible

I'll help you fix it! 🚀
