# Polaris Data Whisperer - Project Launcher Script
# Simple and reliable version

Write-Host "===============================================" -ForegroundColor Magenta
Write-Host "    POLARIS DATA WHISPERER" -ForegroundColor Magenta
Write-Host "    LLM-Powered Data Analysis Platform" -ForegroundColor Magenta
Write-Host "    Project Launcher" -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Magenta

Write-Host ""
Write-Host "Starting Polaris Data Whisperer..." -ForegroundColor Cyan
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "app.py")) {
    Write-Host "ERROR: app.py not found. Please run this script from the project directory." -ForegroundColor Red
    pause
    exit
}

if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found. Please run this script from the project directory." -ForegroundColor Red
    pause
    exit
}

# Check Python
Write-Host "Checking Python..." -ForegroundColor Cyan
$pythonVersion = python --version 2>&1
if ($pythonVersion -match "Python (\d+\.\d+)") {
    $version = $matches[1]
    Write-Host "Python $version found" -ForegroundColor Green
} else {
    Write-Host "ERROR: Python not found. Please install Python 3.8+" -ForegroundColor Red
    pause
    exit
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>&1
if ($nodeVersion -match "v(\d+)") {
    $version = $matches[1]
    Write-Host "Node.js v$version found" -ForegroundColor Green
} else {
    Write-Host "ERROR: Node.js not found. Please install Node.js 16+" -ForegroundColor Red
    pause
    exit
}

Write-Host ""
Write-Host "All dependencies are available" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan

Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install fastapi uvicorn pandas python-multipart --quiet

Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install --silent

Write-Host ""
Write-Host "Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Start services
Write-Host "Starting services..." -ForegroundColor Cyan

Write-Host "Starting Python backend..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "python app.py" -WindowStyle Normal

Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host "Starting React frontend..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "npm run dev" -WindowStyle Normal

Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if frontend is running
Write-Host "Checking if frontend is running..." -ForegroundColor Yellow
$frontendRunning = $false
$frontendPorts = @(8080, 5173, 3000)

foreach ($port in $frontendPorts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "Frontend detected on port $port" -ForegroundColor Green
            $frontendRunning = $true
            break
        }
    }
    catch {
        continue
    }
}

if (-not $frontendRunning) {
    Write-Host "Warning: Frontend may still be starting. Check the terminal windows." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Polaris Data Whisperer is now running!" -ForegroundColor Green
Write-Host ""
Write-Host "Services Status:" -ForegroundColor Cyan
Write-Host "   Backend API:  http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs:     http://localhost:8000/docs" -ForegroundColor White
Write-Host "   Frontend:     http://localhost:8080 (or 5173)" -ForegroundColor White
Write-Host ""
Write-Host "How to use:" -ForegroundColor Cyan
Write-Host "   1. Open the frontend URL in your browser" -ForegroundColor White
Write-Host "   2. Upload a CSV file" -ForegroundColor White
Write-Host "   3. Ask questions about your data in natural language" -ForegroundColor White
Write-Host "   4. Get AI-powered insights instantly!" -ForegroundColor White
Write-Host ""

# Open browser
Write-Host "Opening application in browser..." -ForegroundColor Yellow
if ($frontendRunning) {
    Start-Process "http://localhost:$port"
} else {
    Write-Host "Please manually open: http://localhost:8080 or check the terminal windows" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To stop the project, close the terminal windows that opened" -ForegroundColor Yellow
Write-Host "Press any key to exit this launcher..." -ForegroundColor Gray
pause
