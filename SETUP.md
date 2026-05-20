# 🚀 Polaris Data Whisperer - Setup Guide

## Quick Start (Recommended)

### Option 1: PowerShell Script (Windows)
```powershell
# Navigate to project directory
cd polaris-data-whisperer-main

# Run the launcher script
.\run-project.ps1

# Or skip dependency checks if you're sure they're installed
.\run-project.ps1 -SkipChecks

# Show help
.\run-project.ps1 -Help
```

### Option 2: Batch File (Windows)
```cmd
# Navigate to project directory
cd polaris-data-whisperer-main

# Run the batch file
run-project.bat
```

### Option 3: Manual Setup
Follow the detailed steps below if you prefer manual setup.

## 📋 Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** (for cloning)
- **Internet connection** for package installation

## 🔧 Manual Setup Steps

### Step 1: Clone and Navigate
```bash
git clone <your-repo-url>
cd polaris-data-whisperer-main
```

### Step 2: Install Python Dependencies
```bash
# Install required Python packages
pip install fastapi uvicorn pandas python-multipart

# Or install from requirements.txt
pip install -r requirements.txt
```

### Step 3: Install Node.js Dependencies
```bash
# Install frontend dependencies
npm install
```

### Step 4: Start Backend Server
```bash
# Start Python FastAPI backend
python app.py

# Or using uvicorn directly
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Step 5: Start Frontend Server
```bash
# In a new terminal, start React frontend
npm run dev
```

### Step 6: Access the Application
- **Frontend**: http://localhost:8080 (or 5173)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎯 How to Use

1. **Upload CSV File**: Drag and drop a CSV file onto the upload area
2. **Ask Questions**: Type natural language questions about your data
3. **Get Insights**: Receive AI-generated SQL queries and explanations
4. **View Results**: See analysis results in interactive tables

## 📁 Project Structure

```
polaris-data-whisperer-main/
├── app.py                 # Python FastAPI backend
├── server.js              # Alternative Node.js backend
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── src/                  # React frontend source code
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── lib/             # API services and utilities
│   └── main.tsx         # Main entry point
├── run-project.ps1      # PowerShell launcher script
├── run-project.bat      # Batch file launcher
└── README.md            # Project documentation
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :8000
netstat -ano | findstr :8080

# Kill the process using the port
taskkill /PID <PID> /F
```

#### 2. Python Dependencies Not Found
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies with specific versions
pip install fastapi==0.104.1 uvicorn[standard]==0.24.0 pandas==2.1.3 python-multipart==0.0.6
```

#### 3. Node.js Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
del package-lock.json
npm install
```

#### 4. Backend Not Starting
```bash
# Check Python version
python --version

# Verify app.py exists
dir app.py

# Check for syntax errors
python -m py_compile app.py
```

#### 5. Frontend Not Starting
```bash
# Check Node.js version
node --version

# Verify package.json exists
dir package.json

# Check for build errors
npm run build
```

### Environment Variables

The backend uses a Google Gemini API key. If you need to use your own key:

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Replace the API_KEY in `app.py`:
```python
API_KEY = "your-api-key-here"
```

## 🚀 Production Deployment

### Frontend (React)
```bash
# Build for production
npm run build

# Deploy the dist/ folder to any static hosting service
# - Vercel
# - Netlify
# - GitHub Pages
# - AWS S3
```

### Backend (FastAPI)
```bash
# Install production dependencies
pip install gunicorn

# Run with gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker

# Deploy to:
# - Heroku
# - Railway
# - DigitalOcean App Platform
# - AWS/GCP/Azure
```

## 📊 Testing the Application

### Sample CSV Data
Create a sample CSV file to test the application:

```csv
Name,Age,City,Salary
John Doe,30,New York,75000
Jane Smith,25,Los Angeles,65000
Bob Johnson,35,Chicago,80000
Alice Brown,28,Boston,70000
```

### Test Questions
Try these natural language questions:
- "What is the average salary?"
- "How many people are over 30 years old?"
- "What is the highest salary in the dataset?"
- "Show me all people from New York"

## 🔐 Security Notes

- The application uses in-memory SQLite for security
- No data is persisted to disk
- CORS is configured for development
- File uploads are validated for CSV format

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check the console/terminal for error messages
4. Ensure ports 8000 and 8080 are available

## 🎉 Success!

Once everything is running, you should see:
- ✅ Backend API responding at http://localhost:8000
- ✅ Frontend accessible at http://localhost:8080
- ✅ Ability to upload CSV files
- ✅ Natural language question processing
- ✅ AI-generated insights and SQL queries

Happy analyzing! 🚀
