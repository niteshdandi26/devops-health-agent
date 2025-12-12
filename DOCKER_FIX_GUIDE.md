# 🐳 Docker Issues - Complete Fix Guide

## 🔴 Current Problems

1. **Docker API Error**: `500 Internal Server Error` when trying to pull images
2. **Docker Desktop not responding**: `docker info` command hangs
3. **Corrupted docker-compose.yml files** (✅ FIXED!)

---

## ✅ What I've Already Fixed

- ✅ Created clean `docker-compose.yml` files (removed deprecated `version` field)
- ✅ Fixed YAML formatting issues from Windows `echo` commands
- ✅ Both files are now in proper format

---

## 🛠️ Step-by-Step Fix Instructions

### **Step 1: Restart Docker Desktop**

**Option A: Using GUI**
1. Right-click the Docker whale icon in system tray (bottom-right corner)
2. Click "Quit Docker Desktop"
3. Wait 10 seconds
4. Open Docker Desktop again from Start Menu
5. Wait until the whale icon is steady (not animated)

**Option B: Using PowerShell (Recommended)**
```powershell
# Stop Docker Desktop
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 5

# Start Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

### **Step 2: Verify Docker is Running**

Wait 30-60 seconds after starting Docker Desktop, then run:

```powershell
docker info
```

**Expected output**: Should show Docker system information (not hang or error)

If it still hangs or errors, proceed to Step 3.

---

### **Step 3: Reset Docker Desktop (If Step 1 Didn't Work)**

⚠️ **Warning**: This will remove all containers, images, and volumes!

1. Open Docker Desktop
2. Click the gear icon (Settings)
3. Go to "Troubleshoot" tab
4. Click "Clean / Purge data"
5. Click "Reset to factory defaults"
6. Restart Docker Desktop

---

### **Step 4: Test Docker with Simple Command**

```powershell
docker run hello-world
```

**Expected**: Should download and run a test container successfully.

---

### **Step 5: Start Your DevOps Health Agent**

Once Docker is working, navigate to your project and run:

```powershell
cd C:\Users\HP\OneDrive\Desktop\devops-health-agent
docker-compose up -d
```

**Expected output**:
```
[+] Running 3/3
 ✔ Network devops-health-agent_default  Created
 ✔ Container kestra-postgres            Started
 ✔ Container kestra                     Started
```

---

## 🔍 Verify Everything is Running

### Check running containers:
```powershell
docker ps
```

**Expected**: Should show 2 containers:
- `kestra` (ports 8080, 8081)
- `kestra-postgres` (port 5432)

### Check Kestra UI:
Open browser and go to: http://localhost:8080

**Expected**: Kestra dashboard should load

---

## 🆘 Common Issues & Solutions

### Issue: "Docker Desktop is starting..." forever

**Solution**:
1. Check if WSL 2 is installed and updated:
   ```powershell
   wsl --update
   wsl --set-default-version 2
   ```
2. Restart computer
3. Start Docker Desktop again

### Issue: "Error response from daemon: Get https://registry-1.docker.io/v2/..."

**Solution**: Network/firewall issue
1. Disable VPN if running
2. Check Windows Firewall settings
3. Try using Docker Desktop settings → Resources → Network → Enable "Use kernel networking for UDP"

### Issue: Port conflicts (8080 already in use)

**Solution**:
```powershell
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## 📊 Current Project Status

### ✅ Completed (Day 1)
- AI Health Agent working perfectly
- GROQ integration successful
- Dependencies installed

### 🔄 In Progress (Day 2)
- Setting up Kestra for workflow orchestration
- Docker environment configuration

### 📋 Next Steps
1. Get Docker running
2. Start Kestra containers
3. Create first workflow
4. Test hourly health checks

---

## 🎯 Quick Commands Reference

```powershell
# Check Docker status
docker info

# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View container logs
docker logs kestra
docker logs kestra-postgres

# Restart containers
docker-compose restart

# Remove everything and start fresh
docker-compose down -v
docker-compose up -d
```

---

## 📞 Need More Help?

If Docker still doesn't work after trying all steps:

1. **Check Docker Desktop logs**:
   - Open Docker Desktop
   - Click the bug icon (top-right)
   - View diagnostics

2. **System Requirements**:
   - Windows 10/11 Pro, Enterprise, or Education
   - WSL 2 enabled
   - Virtualization enabled in BIOS
   - At least 4GB RAM available

3. **Reinstall Docker Desktop**:
   - Uninstall Docker Desktop
   - Download latest version from docker.com
   - Install and restart computer
