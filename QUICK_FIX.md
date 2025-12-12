# 🔧 Quick Fix for Docker 500 Error

## ✅ Current Status:
- Docker Desktop IS installed ✅
- Docker Desktop IS running ✅  
- Docker Engine has 500 Internal Server Error ❌

## 🛠️ Fix Steps (Do in Order):

### **OPTION 1: Factory Reset Docker (5 minutes - Try This First!)**

1. **Open Docker Desktop**
   - Press Windows key
   - Type "Docker Desktop"
   - Click to open (even if you don't see a window, it's running in background)

2. **Access Settings**
   - Look for Docker whale icon in system tray (bottom-right)
   - Right-click the whale icon
   - Click "Dashboard" or "Settings"
   - If you can't find it, press `Ctrl + ,` while Docker Desktop window is focused

3. **Factory Reset**
   - In Docker Desktop, click the **gear icon** ⚙️ (top-right)
   - Click **"Troubleshoot"** tab (left sidebar)
   - Click **"Clean / Purge data"** button
   - Click **"Reset to factory defaults"**
   - Confirm the reset
   - Wait for Docker to restart (2-3 minutes)

4. **Test Docker**
   ```powershell
   docker ps
   ```
   Should show empty list (no error)

---

### **OPTION 2: Command Line Reset (If Option 1 doesn't work)**

Run these commands one by one:

```powershell
# Stop Docker
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue

# Wait
Start-Sleep -Seconds 5

# Delete Docker data (this fixes the 500 error)
Remove-Item -Path "$env:APPDATA\Docker" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:LOCALAPPDATA\Docker" -Recurse -Force -ErrorAction SilentlyContinue

# Start Docker again
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Wait 60 seconds for Docker to initialize
Start-Sleep -Seconds 60

# Test
docker ps
```

---

### **OPTION 3: Reinstall (Last Resort - 15-20 minutes)**

Only do this if Options 1 and 2 fail.

1. **Uninstall Docker Desktop**
   - Windows Settings → Apps → Docker Desktop → Uninstall
   - Restart computer

2. **Download Latest Version**
   - Go to: https://www.docker.com/products/docker-desktop
   - Download Docker Desktop for Windows

3. **Install**
   - Run installer
   - Follow prompts
   - Restart computer when done

4. **Test**
   ```powershell
   docker ps
   ```

---

## 🎯 What's Causing This?

The **500 Internal Server Error** means Docker's internal database or configuration is corrupted. This happens when:
- Docker was force-closed while running
- Windows update interrupted Docker
- Disk space issues
- WSL 2 backend issues

**Factory reset fixes this 95% of the time without reinstalling!**

---

## ⏱️ Time Estimates:

- **Option 1 (Factory Reset)**: 5 minutes ⭐ **Try this first!**
- **Option 2 (Command Reset)**: 3 minutes
- **Option 3 (Reinstall)**: 15-20 minutes

---

## 📞 After You Fix It:

Once `docker ps` works without errors, run:

```powershell
cd C:\Users\HP\OneDrive\Desktop\devops-health-agent
docker-compose up -d
```

Then open: http://localhost:8080

---

## ✅ You'll Know It's Fixed When:

```powershell
docker ps
```

Shows this (or similar):
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

Instead of:
```
Error response from daemon: 500 Internal Server Error
```
