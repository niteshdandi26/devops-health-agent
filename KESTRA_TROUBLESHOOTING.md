# Kestra Workflow Troubleshooting Guide

## Common Errors and Solutions

### ❌ Error 1: "Connection refused" or "Cannot connect to host.docker.internal"

**Problem:** Kestra container cannot reach your API on the host machine.

**Solutions:**

#### Option A: Use Windows Host IP (Recommended for Windows)
1. Find your Windows IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (usually something like `192.168.x.x`)

2. Update the workflow URI to use your IP:
   ```yaml
   uri: "http://192.168.x.x:8000/analyze"
   ```

#### Option B: Update Docker Compose (Better for Docker Desktop)
Add this to your Kestra service in `docker-compose.yml`:
```yaml
services:
  kestra:
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Then restart:
```powershell
docker-compose down
docker-compose up -d
```

---

### ❌ Error 2: "Plugin not found" or "Class not found"

**Problem:** HTTP plugin is not available in Kestra.

**Solution:** The `io.kestra.plugin.core.http.Request` task is built-in, but if you get this error, try using the full plugin:

```yaml
tasks:
  - id: analyze
    type: io.kestra.core.tasks.scripts.Bash
    script: |
      curl -X POST http://host.docker.internal:8000/analyze \
        -H "Content-Type: application/json" \
        -d '{"logs": "[ERROR] Database connection failed"}'
```

---

### ❌ Error 3: "Invalid JSON" or "Bad Request"

**Problem:** JSON body is malformed.

**Solution:** Use proper JSON escaping:

```yaml
body: |
  {
    "logs": "[2024-12-10 08:32:54] ERROR: Database connection failed\\n[2024-12-10 08:32:54] ERROR: Connection timeout"
  }
```

Note the double backslash `\\n` for newlines.

---

### ❌ Error 4: "Template error" or "Cannot access outputs.analyze.body"

**Problem:** The HTTP response is not being parsed correctly.

**Solution:** Add response parsing:

```yaml
tasks:
  - id: analyze
    type: io.kestra.plugin.core.http.Request
    uri: "http://host.docker.internal:8000/analyze"
    method: POST
    contentType: application/json
    body: |
      {"logs": "[ERROR] Test error"}
    
  - id: parse_response
    type: io.kestra.plugin.core.log.Log
    message: "Raw response: {{ outputs.analyze.body }}"
    
  - id: show_results
    type: io.kestra.plugin.core.log.Log
    message: "Status: {{ outputs.analyze.body.status }}"
```

---

## 🔍 How to Debug

### 1. Check Kestra Logs
```powershell
docker logs -f kestra
```

### 2. Check API Logs
Make sure your API is running:
```powershell
cd C:\Users\HP\OneDrive\Desktop\devops-health-agent\API
python main.py
```

### 3. Test API Manually
```powershell
curl -X POST http://localhost:8000/analyze -H "Content-Type: application/json" -d '{\"logs\": \"[ERROR] Test\"}'
```

### 4. View Execution Logs in Kestra
1. Go to http://localhost:8080
2. Click on "Executions"
3. Click on your failed execution
4. Check the "Logs" tab for detailed error messages

---

## ✅ Working Workflow (Simplified for Testing)

```yaml
id: devops-health-test
namespace: production

tasks:
  - id: test_api_connection
    type: io.kestra.plugin.core.http.Request
    uri: "http://host.docker.internal:8000"
    method: GET
    
  - id: show_connection_result
    type: io.kestra.plugin.core.log.Log
    message: "API Connection: {{ outputs.test_api_connection.body }}"
```

Start with this simple test first. If this works, then add the POST request.

---

## 🚀 Step-by-Step Testing

1. **Test 1: API is running**
   ```powershell
   curl http://localhost:8000
   ```
   Should return: `{"message":"DevOps Health Monitor API is running!","status":"healthy"}`

2. **Test 2: API analyze endpoint works**
   ```powershell
   curl -X POST http://localhost:8000/analyze -H "Content-Type: application/json" -d "{\"logs\": \"[ERROR] Test\"}"
   ```

3. **Test 3: Create simple Kestra workflow** (use the test workflow above)

4. **Test 4: Run the full workflow** (use `kestra-workflow.yml`)

---

## 📝 What Error Are You Seeing?

Please check the Kestra UI at http://localhost:8080 and look for:
- Execution status (Failed, Success, Running)
- Error message in the logs
- Which task is failing

Common error messages and what they mean:
- `Connection refused` → API not running or wrong host
- `404 Not Found` → Wrong endpoint URL
- `500 Internal Server Error` → API error (check API logs)
- `Template error` → Issue with `{{ }}` variables
- `Invalid JSON` → Body formatting issue
