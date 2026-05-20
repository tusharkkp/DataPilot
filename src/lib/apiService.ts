// API service for communicating with the FastAPI backend server
const API_BASE_URL = 'http://localhost:8000';

export interface DatasetInfo {
  table: string;
  columns: Array<{ name: string; type: string }>;
  rows: number;
  originalName: string;
}

export type EngineType = 'gemini' | 'ollama' | 'compare';

export interface EngineResult {
  ok: boolean;
  sql: string;
  rows: any[];
  fields: string[];
  insight: string;
  error?: string;
  time_ms: number;
  engine: string;
  fallback?: boolean;
  fallback_reason?: string;
}

export interface ComparisonMetrics {
  response_time: {
    gemini_ms: number;
    ollama_ms: number;
    faster: string;
    difference_ms: number;
  };
  sql_match: boolean;
  result_match: boolean;
  gemini_row_count: number;
  ollama_row_count: number;
  gemini_error: boolean;
  ollama_error: boolean;
  gemini_type: string;
  ollama_type: string;
}

export interface ComparisonResult {
  mode: 'compare';
  gemini: EngineResult;
  ollama: EngineResult;
  comparison: ComparisonMetrics;
}

export type AnalysisResult = EngineResult | ComparisonResult;

function transformEngineResponse(data: any): EngineResult {
  return {
    ok: !data.error,
    sql: data.sql_query || '',
    rows: data.result || [],
    fields: data.result && data.result.length > 0 ? Object.keys(data.result[0]) : [],
    insight: data.explanation || '',
    error: data.error || undefined,
    time_ms: data.time_ms || 0,
    engine: data.engine || 'unknown',
    fallback: data.fallback,
    fallback_reason: data.fallback_reason,
  };
}

export async function uploadDataset(file: File): Promise<DatasetInfo> {
  return {
    table: 'data',
    columns: [],
    rows: 0,
    originalName: file.name,
  };
}

export async function analyzeData(file: File, question: string, engine: EngineType = 'gemini'): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('question', question);
  formData.append('engine', engine);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Analysis failed');
  }

  // Compare mode returns a different shape
  if (data.mode === 'compare') {
    return {
      mode: 'compare',
      gemini: transformEngineResponse(data.gemini),
      ollama: transformEngineResponse(data.ollama),
      comparison: data.comparison,
    } as ComparisonResult;
  }

  // Single engine result
  return transformEngineResponse(data);
}

export interface HealthStatus {
  status: string;
  gemini: boolean;
  ollama: boolean;
}

export async function checkServerHealth(): Promise<HealthStatus | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}
