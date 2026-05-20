# System Design: AI-Powered CSV Data Analyst

> A locally-hosted, API-key-free tool that lets users upload CSV files, ask questions in natural language, and receive SQL-backed answers with human-readable insights.

---

## 1. Architecture Overview

```mermaid
graph TB
    subgraph Frontend ["Frontend (React + Vite)"]
        UI["User Interface"]
        Upload["CSV Upload"]
        QInput["Question Input"]
        Results["Results Display"]
    end

    subgraph Backend ["Backend (Python FastAPI)"]
        API["FastAPI Server :8000"]
        CSV_Loader["CSV → MySQL Loader"]
        SQL_Gen["Ollama + SQLCoder (Text-to-SQL)"]
        Executor["SQL Executor"]
        Explainer["Explanation Generator (Hybrid)"]
    end

    subgraph Database ["Database Layer"]
        MySQL["MySQL Server"]
    end

    subgraph ML ["ML Layer (Local, No API Keys)"]
        SQLCoder["Ollama + SQLCoder 7B (Text → SQL)"]
        Llama["Ollama + Llama 3.1 8B (Result → Explanation)"]
        Templates["Template Engine (Fast Path)"]
    end

    UI --> Upload --> API
    UI --> QInput --> API
    API --> CSV_Loader --> MySQL
    API --> SQL_Gen --> SQLCoder
    SQLCoder -->|"Generated SQL"| Executor
    Executor --> MySQL
    MySQL -->|"Raw Results"| Explainer
    Explainer --> Templates
    Explainer --> Llama
    Explainer -->|"Human-readable insight"| Results
```

---

## 2. Tech Stack

| Layer | Technology | Why Chosen |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite 5 | Fast dev server, type safety, modern tooling |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS, accessible component primitives |
| **Backend** | Python FastAPI | Async, high-performance, native ML ecosystem |
| **Database** | MySQL | Production-grade, handles concurrent users, persistent storage, full SQL |
| **Text-to-SQL** | Ollama + SQLCoder 7B | Best open-source Text-to-SQL model, no API key, runs locally via Ollama |
| **Explanation** | Hybrid (Templates + Ollama/Llama 3.1) | Instant for simple queries, rich for complex ones |
| **ML Runtime** | Ollama | Unified local runtime for both SQLCoder and Llama 3.1 |
| **Package Manager** | npm (frontend), pip + venv (backend) | Standard tooling |

---

## 3. Data Flow Pipeline

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant API as FastAPI Backend
    participant DB as MySQL
    participant SC as Ollama SQLCoder
    participant EXP as Explanation Engine

    User->>FE: Upload CSV + Ask question
    FE->>API: POST /analyze (file + question)
    
    API->>DB: pd.read_csv() → INSERT INTO temp table
    Note over DB: CSV loaded as MySQL table

    API->>SC: question + column names
    SC-->>API: Generated SQL query

    API->>DB: cursor.execute(sql)
    DB-->>API: Raw results

    API->>EXP: question + sql + results
    
    alt Simple result (single value, small group)
        EXP-->>API: Template-based explanation (instant)
    else Complex result
        EXP-->>API: Ollama/Llama 3.1 explanation (5-15s)
    end

    API-->>FE: { sql, results, explanation }
    FE-->>User: Display insights + data table
```

---

## 4. Database Design Decisions

### Why MySQL

| Factor | MySQL | PostgreSQL | SQLite | MongoDB |
|---|---|---|---|---|
| **Type** | Relational (SQL) | Relational (SQL) | Embedded (SQL) | Document (NoSQL) |
| **Multi-user** | ✅ Built for it | ✅ Built for it | ❌ Single-writer | ✅ Built for it |
| **Concurrent writes** | ★★★★★ | ★★★★★ | ★ | ★★★★★ |
| **Persistent storage** | ✅ Disk-based | ✅ Disk-based | ⚠️ In-memory = volatile | ✅ Disk-based |
| **SQL compatibility** | ✅ Full SQL | ✅ Full SQL + extras | ✅ Basic SQL | ❌ No SQL |
| **LLM-generated SQL** | ✅ Works | ✅ Works | ✅ Works | ❌ Breaks pipeline |
| **Setup** | Install MySQL Server | Install PostgreSQL | Built into Python | Install MongoDB |
| **Ecosystem** | Largest (Laravel, WordPress, etc.) | Most powerful | Simplest | Flexible schema |
| **Learning curve** | ★★★★ Easy | ★★★ Moderate | ★★★★★ Easiest | ★★★★ Easy |

### MySQL Setup for This Project

```python
import mysql.connector

# Connection to MySQL server
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="your_password",
    database="csv_analyzer"
)

# Load CSV into a temporary MySQL table
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("mysql+mysqlconnector://root:password@localhost/csv_analyzer")
df = pd.read_csv(uploaded_file)
df.to_sql("data", engine, if_exists="replace", index=False)

# Execute generated SQL
cursor = conn.cursor()
cursor.execute(sql_query)
results = cursor.fetchall()
```

### Why Not the Others?

- **SQLite:** No concurrent users, data lost on restart — fine for prototyping but not for deployment
- **PostgreSQL:** More powerful but overkill for this project's query complexity; heavier to set up
- **MongoDB:** Doesn't support SQL — would break the entire Text-to-SQL pipeline

---

## 5. ML Model Design

### Component 1: Text-to-SQL (Ollama + SQLCoder)

**Purpose:** Convert natural language → executable SQL

```
Input:  "columns: name, department, salary | question: average salary by department?"
Output: "SELECT department, AVG(salary) FROM data GROUP BY department"
```

| Spec | Detail |
|---|---|
| **Model** | SQLCoder 7B (by Defog) — best open-source Text-to-SQL model |
| **Runtime** | Ollama (local HTTP server at `localhost:11434`) |
| **Size** | ~4GB on disk |
| **Training** | Pre-trained by Defog on massive SQL datasets — no custom training needed |
| **Inference speed** | 3-15 seconds depending on hardware |
| **Hardware** | 8GB+ RAM minimum, 16GB recommended |

**Setup:**
```bash
# Install Ollama from https://ollama.com
ollama pull sqlcoder       # Download the model (~4GB, one-time)
```

**Integration in `app.py`:**
```python
import requests

def generate_sql(question, columns):
    prompt = f"""Given a table 'data' with columns: {', '.join(columns)}
    Generate a MySQL-compatible SQL query for: {question}
    Return ONLY the SQL query, nothing else."""
    
    response = requests.post("http://localhost:11434/api/generate", json={
        "model": "sqlcoder",
        "prompt": prompt,
        "stream": False
    })
    return response.json()["response"].strip()
```

### Component 2: Explanation Generator (Hybrid)

**Purpose:** Convert raw SQL results → human-readable insight

```mermaid
flowchart TD
    A["SQL Results"] --> B{"Result type?"}
    B -->|"Single value (COUNT, AVG)"| C["Template Engine"]
    B -->|"Small grouped result"| C
    B -->|"Complex / multi-row"| D["Ollama + Llama 3.1"]
    C -->|"Instant"| E["Human-readable explanation"]
    D -->|"5-15 seconds"| E
```

**Fast Path — Template Engine (no AI):**
```python
# Single value: "The average salary is ₹75,000"
# Grouped: "Engineering (₹85K) is highest, HR (₹62K) is lowest, 37% gap"
# List: "Top 5 results: ..."
```

**Rich Path — Local LLM (Ollama + Llama 3.1):**
```python
def explain_results(question, sql, results):
    prompt = f"""User asked: "{question}"
    SQL: {sql}
    Results: {results}
    Explain in simple, non-technical language with key insights."""
    
    response = requests.post("http://localhost:11434/api/generate", json={
        "model": "llama3.1",
        "prompt": prompt,
        "stream": False
    })
    return response.json()["response"]
```

### Why Two Models via Ollama?

| Model | Purpose | Why not one model for both? |
|---|---|---|
| **SQLCoder 7B** | Question → SQL | Specialized for SQL — far more accurate than general models |
| **Llama 3.1 8B** | Results → Explanation | Better at natural language writing and reasoning |

Ollama manages both models and swaps them in/out of memory automatically.

---

## 6. Frontend Architecture

```
src/
├── App.tsx                    # Root — React Router, QueryClient, TooltipProvider
├── main.tsx                   # Entry point — renders App into DOM
├── pages/
│   ├── Index.tsx              # Landing page (hero, features, CTA)
│   ├── Analyze.tsx            # Core feature — CSV upload + analysis
│   ├── Datasets.tsx           # Sample datasets (placeholder)
│   ├── Pricing.tsx            # Pricing tiers (placeholder)
│   └── NotFound.tsx           # 404 page
├── components/
│   ├── ResizableNavbarDemo.tsx    # Navigation bar
│   ├── HeroScrollDemo.tsx         # Landing page hero
│   ├── HowItWorks.tsx             # Feature explanation
│   ├── Footer.tsx                 # Site footer
│   ├── StickyScrollRevealDemo.tsx # Scroll animation
│   └── ui/                        # shadcn/ui primitives
├── lib/
│   ├── apiService.ts          # HTTP client → FastAPI backend
│   └── utils.ts               # cn() class name merger
└── hooks/
    └── use-toast.ts           # Toast notification hook
```

### Key Design Decisions
- **No auth system** — Supabase removed; app is open-access
- **State management** — Local `useState` per component; no global store needed
- **API layer** — Thin wrapper in `apiService.ts` calling `POST /analyze`
- **Routing** — React Router v6 with 5 routes

---

## 7. Backend Architecture

```python
# app.py — Single-file FastAPI server

from sqlalchemy import create_engine
import mysql.connector
import requests

MYSQL_URL = "mysql+mysqlconnector://root:password@localhost/csv_analyzer"
engine = create_engine(MYSQL_URL)

@app.post("/analyze")
async def analyze(file: UploadFile, question: str):
    # 1. LOAD: CSV → pandas DataFrame → MySQL table
    df = pd.read_csv(file.file)
    df.to_sql("data", engine, if_exists="replace", index=False)
    
    # 2. GENERATE: Question → SQL (Ollama + SQLCoder)
    columns = df.columns.tolist()
    sql = generate_sql(question, columns)  # calls localhost:11434
    
    # 3. EXECUTE: Run SQL against MySQL
    with engine.connect() as conn:
        result = conn.execute(text(sql))
        results = result.fetchall()
    
    # 4. EXPLAIN: Results → Human-readable insight (hybrid)
    explanation = generate_explanation(question, sql, results)
    
    # 5. RESPOND: Return everything to frontend
    return {"sql": sql, "results": results, "explanation": explanation}
```

### API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/analyze` | Upload CSV + question → SQL + results + explanation |
| `GET` | `/health` | Server status check |

---

## 8. Scaling Strategy

### Current: Single-User Local

```
[Browser] → [Vite :8080] → [FastAPI :8000] → [MySQL localhost]
                                             → [Ollama :11434 (SQLCoder + Llama)]
```

### Future: Multi-User Deployed

```
[Users] → [Nginx/CDN] → [React Static Build]
                       → [FastAPI (multiple workers via Gunicorn)]
                           → [MySQL (persistent, shared)]
                           → [Redis (session cache)]
                           → [Ollama (separate service, GPU)]
                           → [S3/Cloud Storage (uploaded files)]
```

| Scale Level | What Changes |
|---|---|
| **1-5 users** | Nothing. Current setup works. |
| **10-50 users** | Gunicorn for multiple FastAPI workers, MySQL connection pooling |
| **100+ users** | Add Redis caching, load balancer, GPU for Ollama inference |
| **1000+ users** | Kubernetes, horizontal scaling, dedicated ML serving (vLLM) |

---

## 9. Key Design Principles

| Principle | How It's Applied |
|---|---|
| **No external API dependencies** | All AI runs locally via Ollama (SQLCoder + Llama 3.1). No API keys. |
| **Data privacy** | CSV data stored in local MySQL only, not sent to any cloud service |
| **Separation of concerns** | Frontend (display) → API (orchestration) → ML (intelligence) → DB (storage) |
| **Fail gracefully** | Template explanations as fallback when Ollama is slow/unavailable |
| **Keep it simple** | Single `app.py`, Ollama manages both models, MySQL handles all SQL |

---

## 10. What Was Removed and Why

| Removed Component | What It Was | Why Removed |
|---|---|---|
| **Supabase Auth** | User login/signup via Supabase | User wanted zero external dependencies |
| **Supabase Client** | Auto-generated Supabase SDK client | No longer needed without auth |
| **server.js** | Node.js Express backend (HuggingFace + Supabase) | Dead code — abandoned approach |
| **analyzeService.ts** | Alternative frontend analysis pipeline | Dead code — `apiService.ts` is the active one |
| **db.ts** | PostgreSQL connection pool | Dead code — can't run in browser |
| **Navbar.tsx** | Old navbar with auth buttons | Dead code — replaced by ResizableNavbarDemo |
| **Auth.tsx** | Login/signup page | Depended on Supabase Auth |
| **Gemini API** | Cloud LLM for SQL + explanation generation | Replaced by local models (T5 + Ollama) |

---

## 11. Ollama Model Setup

```bash
# 1. Install Ollama from https://ollama.com (Windows/Mac/Linux)

# 2. Pull both models (one-time download)
ollama pull sqlcoder        # ~4GB — Text-to-SQL
ollama pull llama3.1        # ~4.5GB — Explanations

# 3. Verify they're running
ollama list                 # Should show both models
curl http://localhost:11434  # Should respond
```

Ollama runs as a background service on `localhost:11434` and automatically loads/unloads models based on usage.

---

## 12. Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| **Frontend only** | Any modern browser | — |
| **Backend (FastAPI + MySQL + Templates)** | 4GB RAM | 8GB RAM |
| **+ Ollama SQLCoder (Text-to-SQL)** | 8GB RAM | 16GB RAM |
| **+ Ollama Llama 3.1 (Explanations)** | 16GB RAM | 16GB RAM + GPU (6GB+ VRAM) |
| **MySQL Server** | 512MB RAM | 1GB RAM |
| **Disk** | 15GB (MySQL + both models) | 25GB |

---

## 13. Services To Run

| Service | Command | Port | Required |
|---|---|---|---|
| **Frontend** | `npm run dev` | 8080 | ✅ |
| **Backend** | `python app.py` | 8000 | ✅ |
| **MySQL** | `mysqld` (system service) | 3306 | ✅ |
| **Ollama** | `ollama serve` (auto-starts) | 11434 | ✅ |
