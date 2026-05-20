from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import sqlite3
import json
import time
from urllib import request, parse
from io import StringIO
from typing import Optional

app = FastAPI(title="LLM-Based Data Analyst Assistant")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Gemini API Configuration ───────────────────────────────────────────────
GEMINI_API_KEY = " "

def call_gemini(prompt, model="gemini-1.5-flash-latest"):
    """Calls the Gemini API to generate content based on the prompt."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "topK": 1,
            "topP": 0.8,
            "maxOutputTokens": 1024,
        }
    }
    data_str = json.dumps(data)
    req = request.Request(url, data=data_str.encode('utf-8'), method="POST")
    req.add_header("Content-Type", "application/json")
    try:
        with request.urlopen(req) as response:
            response_body = response.read().decode('utf-8')
            result = json.loads(response_body)
            if 'candidates' in result and len(result['candidates']) > 0:
                candidate = result['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content'] and len(candidate['content']['parts']) > 0:
                    return candidate['content']['parts'][0]['text']
                else:
                    return "Error: Invalid candidate structure in response."
            elif 'error' in result:
                return f"Error: {result['error'].get('message', 'Unknown API error')}"
            else:
                return "Error: No candidates in response."
    except Exception as e:
        return f"Error: {str(e)}"


# ─── Ollama (Local LLM) Configuration ──────────────────────────────────────
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_SQL_MODEL = "sqlcoder"       # Text-to-SQL model
OLLAMA_EXPLAIN_MODEL = "llama3.1"   # Explanation model

def check_ollama_health():
    """Check if Ollama is running and accessible."""
    try:
        req = request.Request(OLLAMA_BASE_URL, method="GET")
        with request.urlopen(req, timeout=3) as response:
            return response.status == 200
    except Exception:
        return False

def call_ollama(prompt, model=None):
    """Calls the local Ollama API to generate content."""
    if model is None:
        model = OLLAMA_SQL_MODEL
    url = f"{OLLAMA_BASE_URL}/api/generate"
    data = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 1024,
        }
    }
    data_str = json.dumps(data)
    req = request.Request(url, data=data_str.encode('utf-8'), method="POST")
    req.add_header("Content-Type", "application/json")
    try:
        with request.urlopen(req, timeout=120) as response:
            response_body = response.read().decode('utf-8')
            result = json.loads(response_body)
            return result.get("response", "Error: No response from Ollama")
    except Exception as e:
        return f"Error: {str(e)}"


# ─── Shared Utilities ───────────────────────────────────────────────────────

def setup_db(csv_content: str):
    """Loads CSV content into an in-memory SQLite database."""
    conn = sqlite3.connect(':memory:')
    df = pd.read_csv(StringIO(csv_content))
    df.to_sql('data', conn, if_exists='replace', index=False)
    return conn

def get_schema(conn):
    """Retrieves the schema of the 'data' table."""
    schema_df = pd.read_sql("PRAGMA table_info(data);", conn)
    return schema_df.to_string()

def get_columns(conn):
    """Get column names from the data table."""
    schema_df = pd.read_sql("PRAGMA table_info(data);", conn)
    return schema_df['name'].tolist()

def extract_sql_from_response(response_text):
    """Extract SQL query from an LLM response (works for both Gemini and Ollama)."""
    sql_query = None
    try:
        # Method 1: ```sql markers
        if '```sql' in response_text:
            sql_query = response_text.split('```sql')[1].split('```')[0].strip()
        # Method 2: ``` markers
        elif '```' in response_text:
            parts = response_text.split('```')
            if len(parts) >= 2:
                sql_query = parts[1].strip()
        # Method 3: SELECT directly
        elif 'SELECT' in response_text.upper():
            lines = response_text.split('\n')
            sql_lines = []
            in_sql = False
            for line in lines:
                if 'SELECT' in line.upper():
                    in_sql = True
                if in_sql:
                    sql_lines.append(line)
                    if line.strip().endswith(';'):
                        break
            sql_query = '\n'.join(sql_lines).strip()
        # Method 4: Pure SQL response
        elif response_text.strip().upper().startswith('SELECT'):
            sql_query = response_text.strip()

        # Clean up
        if sql_query:
            sql_query = sql_query.replace('```sql', '').replace('```', '').strip()
            sql_query = sql_query.strip('"\'')
            # Remove trailing semicolons for SQLite compatibility
            sql_query = sql_query.rstrip(';')

        # Validate
        if sql_query:
            sql_upper = sql_query.upper().strip()
            if not (sql_upper.startswith('SELECT') or sql_upper.startswith('WITH')):
                return None

    except Exception:
        return None

    return sql_query

def generate_fallback_sql(question: str, columns: list) -> str:
    """Generate a basic SQL query as fallback when LLM fails."""
    question_lower = question.lower()

    if any(word in question_lower for word in ['average', 'mean', 'avg']):
        numeric_cols = [col for col in columns if any(kw in col.lower() for kw in ['salary', 'price', 'amount', 'value', 'cost', 'revenue', 'income', 'age', 'count', 'number'])]
        if numeric_cols:
            group_cols = [col for col in columns if any(kw in col.lower() for kw in ['department', 'category', 'region', 'type', 'group', 'class'])]
            if any(word in question_lower for word in ['by', 'group', 'per', 'each']) and group_cols:
                return f"SELECT {group_cols[0]}, AVG({numeric_cols[0]}) as average_{numeric_cols[0]} FROM data GROUP BY {group_cols[0]}"
            return f"SELECT AVG({numeric_cols[0]}) as average_{numeric_cols[0]} FROM data"

    elif any(word in question_lower for word in ['sum', 'total']):
        numeric_cols = [col for col in columns if any(kw in col.lower() for kw in ['salary', 'price', 'amount', 'value', 'cost', 'revenue', 'income', 'count', 'number'])]
        if numeric_cols:
            group_cols = [col for col in columns if any(kw in col.lower() for kw in ['department', 'category', 'region', 'type', 'group', 'class'])]
            if any(word in question_lower for word in ['by', 'group', 'per', 'each']) and group_cols:
                return f"SELECT {group_cols[0]}, SUM({numeric_cols[0]}) as total_{numeric_cols[0]} FROM data GROUP BY {group_cols[0]}"
            return f"SELECT SUM({numeric_cols[0]}) as total_{numeric_cols[0]} FROM data"

    elif any(word in question_lower for word in ['count', 'how many', 'number of']):
        group_cols = [col for col in columns if any(kw in col.lower() for kw in ['department', 'category', 'region', 'type', 'group', 'class'])]
        if any(word in question_lower for word in ['by', 'group', 'per', 'each']) and group_cols:
            return f"SELECT {group_cols[0]}, COUNT(*) as count FROM data GROUP BY {group_cols[0]}"
        return "SELECT COUNT(*) as total_count FROM data"

    elif any(word in question_lower for word in ['max', 'maximum', 'highest']):
        numeric_cols = [col for col in columns if any(kw in col.lower() for kw in ['salary', 'price', 'amount', 'value', 'cost', 'revenue', 'income', 'age', 'count', 'number'])]
        if numeric_cols:
            return f"SELECT MAX({numeric_cols[0]}) as max_{numeric_cols[0]} FROM data"

    elif any(word in question_lower for word in ['min', 'minimum', 'lowest']):
        numeric_cols = [col for col in columns if any(kw in col.lower() for kw in ['salary', 'price', 'amount', 'value', 'cost', 'revenue', 'income', 'age', 'count', 'number'])]
        if numeric_cols:
            return f"SELECT MIN({numeric_cols[0]}) as min_{numeric_cols[0]} FROM data"

    return "SELECT * FROM data LIMIT 10"

def generate_fallback_explanation(question: str, sql_query: str, result: list) -> str:
    """Generate a basic explanation when LLM fails."""
    if not result:
        return "No data was returned from the query."
    num_results = len(result)
    if "AVG" in sql_query.upper():
        return f"The analysis shows the average values across {num_results} records."
    elif "SUM" in sql_query.upper():
        return f"The analysis shows the total values across {num_results} records."
    elif "COUNT" in sql_query.upper():
        return f"The count query returned {num_results} records."
    elif "MAX" in sql_query.upper():
        return f"The analysis shows the maximum values across {num_results} records."
    elif "MIN" in sql_query.upper():
        return f"The analysis shows the minimum values across {num_results} records."
    else:
        return f"The analysis returned {num_results} records based on your question."


# ─── SQL Prompt Builder ─────────────────────────────────────────────────────

def build_sql_prompt(schema: str, question: str):
    """Build the SQL generation prompt (shared by both engines)."""
    return f"""You are an expert data analyst. The database has a single table named 'data'.
Schema:
{schema}

User question: "{question}"

Translate this to a precise SQL query that answers the question.

IMPORTANT: You must respond with ONLY the SQL query wrapped in ```sql and ``` markers. Do not include any other text.

Example format:
```sql
SELECT column1, column2 FROM data WHERE condition;
```

Your response:"""

def build_explain_prompt(question: str, sql_query: str, result: list):
    """Build the explanation prompt (shared by both engines)."""
    return f"""You are an expert data analyst.
User question: "{question}"
SQL query used: {sql_query}
Query results:
{json.dumps(result)}

Provide a clear natural language explanation of the results, including key insights, trends, and any caveats. Keep it concise and understandable to a non-technical person."""


# ─── Engine Pipelines ───────────────────────────────────────────────────────

def run_gemini_pipeline(conn, question: str):
    """Run the full analysis pipeline using Gemini API."""
    start_time = time.time()
    schema = get_schema(conn)
    columns = get_columns(conn)

    # Step 1: Generate SQL
    sql_prompt = build_sql_prompt(schema, question)
    sql_response = call_gemini(sql_prompt)

    if sql_response.startswith("Error:"):
        sql_query = generate_fallback_sql(question, columns)
    else:
        sql_query = extract_sql_from_response(sql_response)
        if not sql_query:
            sql_query = generate_fallback_sql(question, columns)

    # Step 2: Execute SQL
    try:
        result = pd.read_sql(sql_query, conn).to_dict(orient='records')
    except Exception as e:
        elapsed = int((time.time() - start_time) * 1000)
        return {"error": f"Error executing SQL: {str(e)}", "sql_query": sql_query, "result": None, "explanation": None, "time_ms": elapsed, "engine": "gemini"}

    # Step 3: Generate explanation
    explain_prompt = build_explain_prompt(question, sql_query, result)
    explanation = call_gemini(explain_prompt)
    if explanation.startswith("Error:"):
        explanation = generate_fallback_explanation(question, sql_query, result)

    elapsed = int((time.time() - start_time) * 1000)
    return {"explanation": explanation, "result": result, "sql_query": sql_query, "time_ms": elapsed, "engine": "gemini", "error": None}


def run_ollama_pipeline(conn, question: str):
    """Run the full analysis pipeline using Ollama (local LLM)."""
    start_time = time.time()
    schema = get_schema(conn)
    columns = get_columns(conn)

    # Step 1: Generate SQL using SQLCoder
    sql_prompt = build_sql_prompt(schema, question)
    sql_response = call_ollama(sql_prompt, model=OLLAMA_SQL_MODEL)

    if sql_response.startswith("Error:"):
        sql_query = generate_fallback_sql(question, columns)
    else:
        sql_query = extract_sql_from_response(sql_response)
        if not sql_query:
            sql_query = generate_fallback_sql(question, columns)

    # Step 2: Execute SQL
    try:
        result = pd.read_sql(sql_query, conn).to_dict(orient='records')
    except Exception as e:
        elapsed = int((time.time() - start_time) * 1000)
        return {"error": f"Error executing SQL: {str(e)}", "sql_query": sql_query, "result": None, "explanation": None, "time_ms": elapsed, "engine": "ollama"}

    # Step 3: Generate explanation using Llama
    explain_prompt = build_explain_prompt(question, sql_query, result)
    explanation = call_ollama(explain_prompt, model=OLLAMA_EXPLAIN_MODEL)
    if explanation.startswith("Error:"):
        explanation = generate_fallback_explanation(question, sql_query, result)

    elapsed = int((time.time() - start_time) * 1000)
    return {"explanation": explanation, "result": result, "sql_query": sql_query, "time_ms": elapsed, "engine": "ollama", "error": None}


# ─── API Endpoints ──────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """Check health of all services."""
    ollama_healthy = check_ollama_health()
    return {
        "status": "ok",
        "gemini": True,  # Gemini is always available (cloud API)
        "ollama": ollama_healthy
    }

@app.post("/analyze")
async def analyze_csv(
    file: UploadFile = File(...),
    question: str = Form(...),
    engine: str = Form("gemini")
):
    """
    Analyze CSV data with a question.
    engine: "gemini" | "ollama" | "compare"
    """
    try:
        csv_content = await file.read()
        csv_str = csv_content.decode('utf-8')

        # ── Single engine: Gemini ──
        if engine == "gemini":
            conn = setup_db(csv_str)
            response = run_gemini_pipeline(conn, question)
            conn.close()
            return response

        # ── Single engine: Ollama (with fallback to Gemini) ──
        elif engine == "ollama":
            ollama_available = check_ollama_health()
            conn = setup_db(csv_str)

            if ollama_available:
                response = run_ollama_pipeline(conn, question)
            else:
                # Fallback to Gemini
                response = run_gemini_pipeline(conn, question)
                response["fallback"] = True
                response["fallback_reason"] = "Ollama is not running. Fell back to Gemini."

            conn.close()
            return response

        # ── Compare mode: Run both engines ──
        elif engine == "compare":
            ollama_available = check_ollama_health()

            # Run Gemini
            conn_gemini = setup_db(csv_str)
            gemini_result = run_gemini_pipeline(conn_gemini, question)
            conn_gemini.close()

            # Run Ollama (or fallback)
            if ollama_available:
                conn_ollama = setup_db(csv_str)
                ollama_result = run_ollama_pipeline(conn_ollama, question)
                conn_ollama.close()
            else:
                ollama_result = {
                    "error": "Ollama is not running",
                    "sql_query": None,
                    "result": None,
                    "explanation": None,
                    "time_ms": 0,
                    "engine": "ollama",
                    "fallback": True,
                    "fallback_reason": "Ollama is not running. Only Gemini results are available."
                }

            # Build comparison metrics
            comparison = build_comparison_metrics(gemini_result, ollama_result)

            return {
                "mode": "compare",
                "gemini": gemini_result,
                "ollama": ollama_result,
                "comparison": comparison
            }

        else:
            return {"error": f"Unknown engine: {engine}. Use 'gemini', 'ollama', or 'compare'."}

    except Exception as e:
        return {"error": str(e)}


def build_comparison_metrics(gemini_result: dict, ollama_result: dict) -> dict:
    """Build comparison metrics between the two engine results."""
    metrics = {}

    # Response time
    gemini_time = gemini_result.get("time_ms", 0)
    ollama_time = ollama_result.get("time_ms", 0)
    metrics["response_time"] = {
        "gemini_ms": gemini_time,
        "ollama_ms": ollama_time,
        "faster": "gemini" if gemini_time < ollama_time else "ollama" if ollama_time > 0 else "gemini",
        "difference_ms": abs(gemini_time - ollama_time)
    }

    # SQL match
    gemini_sql = (gemini_result.get("sql_query") or "").strip().upper()
    ollama_sql = (ollama_result.get("sql_query") or "").strip().upper()
    metrics["sql_match"] = gemini_sql == ollama_sql

    # Result match
    gemini_rows = gemini_result.get("result") or []
    ollama_rows = ollama_result.get("result") or []
    metrics["result_match"] = gemini_rows == ollama_rows
    metrics["gemini_row_count"] = len(gemini_rows)
    metrics["ollama_row_count"] = len(ollama_rows)

    # Errors
    metrics["gemini_error"] = gemini_result.get("error") is not None
    metrics["ollama_error"] = ollama_result.get("error") is not None

    # Engine type info
    metrics["gemini_type"] = "Cloud API (Google)"
    metrics["ollama_type"] = "Local LLM (Ollama)"

    return metrics


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
