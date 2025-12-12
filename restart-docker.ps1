# Docker Desktop Restart Script
# Run this to fix Docker issues

Write-Host "🐳 Docker Desktop Restart Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop Docker Desktop
Write-Host "⏹️  Stopping Docker Desktop..." -ForegroundColor Yellow
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "com.docker.backend" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "com.docker.proxy" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Docker Desktop stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Wait
Write-Host "⏳ Waiting 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Step 3: Start Docker Desktop
Write-Host "▶️  Starting Docker Desktop..." -ForegroundColor Yellow

$dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerPath) {
    Start-Process $dockerPath
    Write-Host "✅ Docker Desktop started" -ForegroundColor Green
} else {
    Write-Host "❌ Docker Desktop not found at: $dockerPath" -ForegroundColor Red
    Write-Host "Please start Docker Desktop manually" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "⏳ Waiting for Docker to initialize (30 seconds)..." -ForegroundColor Yellow
Write-Host "   Please wait while Docker starts up..." -ForegroundColor Gray

# Wait and show progress
for ($i = 1; $i -le 30; $i++) {
    Write-Progress -Activity "Waiting for Docker" -Status "$i/30 seconds" -PercentComplete (($i / 30) * 100)
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "🔍 Testing Docker connection..." -ForegroundColor Yellow

# Test Docker
$maxRetries = 5
$retryCount = 0
$dockerReady = $false

while ($retryCount -lt $maxRetries -and -not $dockerReady) {
    try {
        $result = docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            $dockerReady = $true
            Write-Host "✅ Docker is ready!" -ForegroundColor Green
        } else {
            throw "Docker not ready yet"
        }
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "⏳ Docker not ready yet, retrying ($retryCount/$maxRetries)..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
    }
}

Write-Host ""

if ($dockerReady) {
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "🎉 Docker is running successfully!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run: docker-compose up -d" -ForegroundColor White
    Write-Host "2. Open: http://localhost:8080" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "⚠️  Docker may still be starting" -ForegroundColor Yellow
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Check Docker Desktop system tray icon" -ForegroundColor White
    Write-Host "2. Wait until it shows 'Docker Desktop is running'" -ForegroundColor White
    Write-Host "3. Then run: docker info" -ForegroundColor White
    Write-Host ""
    Write-Host "If problems persist, see: DOCKER_FIX_GUIDE.md" -ForegroundColor Cyan
}
