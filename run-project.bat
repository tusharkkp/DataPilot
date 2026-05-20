@echo off
title Polaris Data Whisperer - Project Launcher
color 0B

echo.
echo ========================================
echo    POLARIS DATA WHISPERER
echo    LLM-Powered Data Analysis Platform
echo ========================================
echo.

echo Starting Polaris Data Whisperer...
echo Current directory: %CD%
echo.

echo Checking dependencies...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found! Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

echo Dependencies check passed!
echo.

echo Installing Python dependencies...
pip install fastapi uvicorn pandas python-multipart --quiet
if %errorlevel% neq 0 (
    echo WARNING: Some Python dependencies may not have installed properly.
)

echo Installing Node.js dependencies...
npm install --silent
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies.
    pause
    exit /b 1
)

echo Dependencies installed successfully!
echo.

echo Starting Python backend...
start "Polaris Backend" cmd /k "python app.py"
timeout /t 3 /nobreak >nul

echo Starting React frontend...
start "Polaris Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    SERVICES STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo Frontend:     http://localhost:8080 (or 5173)
echo.
echo Opening application in browser...
echo.

start http://localhost:8080

echo.
echo ========================================
echo    HOW TO USE:
echo ========================================
echo 1. Upload a CSV file
echo 2. Ask questions about your data
echo 3. Get AI-powered insights instantly!
echo.
echo To stop the project, close the terminal windows.
echo.
pause
