# Polaris Data Whisperer - LLM-Based Data Analysis

A modern web application for AI-powered data analysis using CSV files and natural language queries.

## Features

- **CSV Upload & Analysis**: Upload CSV files and ask questions in natural language
- **AI-Powered Insights**: Uses Google Gemini API for SQL generation and data insights
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Real-time Processing**: Fast in-memory data processing with SQLite

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd polaris-data-whisperer-main
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install Python backend dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

#### Option 1: Run both frontend and backend together
```bash
npm run dev:python
```

#### Option 2: Run separately

**Backend (Python FastAPI)**
```bash
# Using npm script
npm run backend

# Or directly
python app.py

# Or using the provided scripts
./run-backend.bat    # Windows
./run-backend.ps1    # PowerShell
```

**Frontend (React/Vite)**
```bash
npm run dev
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## How to Use

1. **Upload a CSV file** by dragging and dropping or clicking the upload area
2. **Ask a question** about your data in natural language (e.g., "What is the average sales by region?")
3. **View results** including:
   - AI-generated insights
   - Generated SQL query
   - Query results in a table format

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router

### Backend
- FastAPI (Python)
- Pandas for data processing
- SQLite for in-memory database
- Google Gemini API for AI analysis

## API Endpoints

- `POST /analyze` - Upload CSV and analyze with a question
  - Parameters: `file` (CSV file), `question` (string)
  - Returns: Analysis results with insights, SQL query, and data

## Development

### Project Structure
```
src/
├── components/     # React components
├── pages/         # Page components
├── lib/           # API services and utilities
└── ui/            # shadcn/ui components
```

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run backend` - Start Python FastAPI backend
- `npm run dev:python` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Environment Variables

The backend uses a Google Gemini API key. Make sure to set up your API key in the `app.py` file or use environment variables for production.

## Deployment

### Frontend
The frontend can be deployed to any static hosting service (Vercel, Netlify, etc.)

### Backend
The FastAPI backend can be deployed to:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS/GCP/Azure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
