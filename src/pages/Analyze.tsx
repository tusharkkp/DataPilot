
import React, { useState, useRef } from 'react';
import ResizableNavbarDemo from '@/components/ResizableNavbarDemo';
import Footer from '@/components/Footer';
import StickyScrollRevealDemo from '@/components/StickyScrollRevealDemo';
import { Tiles } from '@/components/ui/tiles';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, FileText, Sparkles, Loader2, MessageSquare, AlertCircle, Gem, Server, GitCompare, Clock, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react';
import {
  uploadDataset,
  analyzeData,
  checkServerHealth,
  type DatasetInfo,
  type AnalysisResult,
  type EngineResult,
  type ComparisonResult,
  type ComparisonMetrics,
  type EngineType,
  type HealthStatus,
} from '@/lib/apiService';

// ─── Helper: Check if result is comparison mode ────────────────────────────
function isComparisonResult(result: AnalysisResult): result is ComparisonResult {
  return 'mode' in result && result.mode === 'compare';
}

function isEngineResult(result: AnalysisResult): result is EngineResult {
  return 'engine' in result && !('mode' in result);
}

// ─── Single Engine Result Card ─────────────────────────────────────────────
function EngineResultCard({ result, label, accentColor }: { result: EngineResult; label: string; accentColor: string }) {
  if (result.error && !result.sql) {
    return (
      <Card className={`glass-morphic border-red-500/30 shadow-xl shadow-red-500/20`}>
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            {label} — Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{result.error}</p>
          {result.fallback && (
            <p className="text-yellow-400 text-sm mt-2">⚠️ {result.fallback_reason}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Fallback notice */}
      {result.fallback && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {result.fallback_reason}
        </div>
      )}

      {/* Insights */}
      <Card className={`glass-morphic border-${accentColor}/30 shadow-xl shadow-${accentColor}/20`} style={{ borderColor: `var(--${accentColor}-border, hsl(var(--polaris-purple) / 0.3))` }}>
        <CardHeader>
          <CardTitle className={`text-polaris-purple flex items-center justify-between`}>
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {label} — AI Insights
            </span>
            <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {result.time_ms}ms
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{result.insight}</p>
        </CardContent>
      </Card>

      {/* SQL */}
      <Card className="glass-morphic border-polaris-purple/30 shadow-xl shadow-polaris-purple/20">
        <CardHeader>
          <CardTitle className="text-polaris-purple text-sm">Generated SQL</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-background/50 p-4 rounded-lg text-sm text-foreground overflow-x-auto border border-polaris-purple/20">
            {result.sql}
          </pre>
        </CardContent>
      </Card>

      {/* Results Table */}
      {result.rows && result.rows.length > 0 && (
        <Card className="glass-morphic border-polaris-purple/30 shadow-xl shadow-polaris-purple/20">
          <CardHeader>
            <CardTitle className="text-polaris-purple text-sm">Query Results ({result.rows.length} rows)</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={result.rows} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Comparison Metrics Table ──────────────────────────────────────────────
function ComparisonTable({ comparison }: { comparison: ComparisonMetrics }) {
  return (
    <Card className="glass-morphic border-polaris-purple/30 shadow-2xl shadow-polaris-purple/20">
      <CardHeader>
        <CardTitle className="text-polaris-purple flex items-center gap-2">
          <GitCompare className="w-5 h-5" />
          Comparison Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-polaris-purple/20">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Metric</th>
                <th className="text-center py-3 px-4 text-blue-400 font-medium">
                  <span className="flex items-center justify-center gap-1"><Gem className="w-4 h-4" /> Gemini</span>
                </th>
                <th className="text-center py-3 px-4 text-green-400 font-medium">
                  <span className="flex items-center justify-center gap-1"><Server className="w-4 h-4" /> Ollama</span>
                </th>
                <th className="text-center py-3 px-4 text-polaris-purple font-medium">Winner</th>
              </tr>
            </thead>
            <tbody>
              {/* Engine Type */}
              <tr className="border-b border-polaris-purple/10">
                <td className="py-3 px-4 text-muted-foreground">Engine Type</td>
                <td className="py-3 px-4 text-center text-foreground">{comparison.gemini_type}</td>
                <td className="py-3 px-4 text-center text-foreground">{comparison.ollama_type}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">—</td>
              </tr>

              {/* Response Time */}
              <tr className="border-b border-polaris-purple/10">
                <td className="py-3 px-4 text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Response Time</td>
                <td className={`py-3 px-4 text-center font-mono ${comparison.response_time.faster === 'gemini' ? 'text-green-400 font-bold' : 'text-foreground'}`}>
                  {comparison.response_time.gemini_ms}ms
                </td>
                <td className={`py-3 px-4 text-center font-mono ${comparison.response_time.faster === 'ollama' ? 'text-green-400 font-bold' : 'text-foreground'}`}>
                  {comparison.response_time.ollama_ms > 0 ? `${comparison.response_time.ollama_ms}ms` : 'N/A'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${comparison.response_time.faster === 'gemini' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                    <Zap className="w-3 h-3" />
                    {comparison.response_time.faster === 'gemini' ? 'Gemini' : 'Ollama'}
                    {comparison.response_time.difference_ms > 0 && ` (-${comparison.response_time.difference_ms}ms)`}
                  </span>
                </td>
              </tr>

              {/* SQL Match */}
              <tr className="border-b border-polaris-purple/10">
                <td className="py-3 px-4 text-muted-foreground">SQL Queries Match</td>
                <td colSpan={2} className="py-3 px-4 text-center">
                  {comparison.sql_match ? (
                    <span className="inline-flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4" /> Identical</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-yellow-400"><XCircle className="w-4 h-4" /> Different</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center text-muted-foreground">—</td>
              </tr>

              {/* Result Match */}
              <tr className="border-b border-polaris-purple/10">
                <td className="py-3 px-4 text-muted-foreground">Results Match</td>
                <td colSpan={2} className="py-3 px-4 text-center">
                  {comparison.result_match ? (
                    <span className="inline-flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4" /> Identical</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-yellow-400"><XCircle className="w-4 h-4" /> Different</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center text-muted-foreground">—</td>
              </tr>

              {/* Row Count */}
              <tr className="border-b border-polaris-purple/10">
                <td className="py-3 px-4 text-muted-foreground">Rows Returned</td>
                <td className="py-3 px-4 text-center text-foreground font-mono">{comparison.gemini_row_count}</td>
                <td className="py-3 px-4 text-center text-foreground font-mono">{comparison.ollama_row_count}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">—</td>
              </tr>

              {/* Errors */}
              <tr className="border-b border-polaris-purple/10">
                <td className="py-3 px-4 text-muted-foreground">Status</td>
                <td className="py-3 px-4 text-center">
                  {comparison.gemini_error ? (
                    <span className="text-red-400 flex items-center justify-center gap-1"><XCircle className="w-3 h-3" /> Error</span>
                  ) : (
                    <span className="text-green-400 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> Success</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {comparison.ollama_error ? (
                    <span className="text-red-400 flex items-center justify-center gap-1"><XCircle className="w-3 h-3" /> Error</span>
                  ) : (
                    <span className="text-green-400 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> Success</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center text-muted-foreground">—</td>
              </tr>

              {/* Cost */}
              <tr>
                <td className="py-3 px-4 text-muted-foreground">Cost</td>
                <td className="py-3 px-4 text-center text-yellow-400">API usage (paid)</td>
                <td className="py-3 px-4 text-center text-green-400">Free (local)</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                    Ollama
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Analyze Component ────────────────────────────────────────────────
const Analyze = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dataset, setDataset] = useState<DatasetInfo | null>(null);
  const [question, setQuestion] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<EngineType>('gemini');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check server health on mount
  React.useEffect(() => {
    checkServerHealth().then(setHealthStatus);
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file || (!file.type.includes('csv') && !file.name.endsWith('.csv'))) {
      alert('Please upload a CSV file');
      return;
    }
    setIsUploading(true);
    try {
      setUploadedFile(file);
      setDataset({
        table: 'data',
        columns: [],
        rows: 0,
        originalName: file.name,
      });
      setAnalysisResult(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (event: React.DragEvent) => event.preventDefault();

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile || !question.trim()) {
      alert('Please upload a file and enter a question');
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeData(uploadedFile, question, selectedEngine);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult({
        ok: false,
        sql: '',
        rows: [],
        fields: [],
        insight: '',
        error: error instanceof Error ? error.message : 'Analysis failed',
        time_ms: 0,
        engine: selectedEngine,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const engineOptions: { key: EngineType; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'gemini', label: 'Gemini', icon: <Gem className="w-4 h-4" />, desc: 'Cloud API' },
    { key: 'ollama', label: 'Ollama', icon: <Server className="w-4 h-4" />, desc: 'Local LLM' },
    { key: 'compare', label: 'Compare', icon: <GitCompare className="w-4 h-4" />, desc: 'Side by Side' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ResizableNavbarDemo />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Tiles rows={50} cols={20} tileSize="md" className="opacity-40" tileClassName="border-polaris-purple/20 shadow-sm shadow-polaris-purple/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-polaris-purple/20 via-lightyear-lavender/10 to-galactic-green/15"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-background/20"></div>
      </div>

      <main className="pt-28 relative z-10 min-h-screen">
        <StickyScrollRevealDemo />

        <div className="container mx-auto px-4 pb-16 space-y-8">
          {/* Server Health */}
          {healthStatus === null && (
            <div className="flex items-center justify-center">
              <div className="glass-morphic rounded-xl p-4 border border-red-500/30 shadow-xl shadow-red-500/20 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>Backend server is not running. Start it with: <code className="bg-background/50 px-2 py-1 rounded">python app.py</code></span>
                </div>
              </div>
            </div>
          )}

          {healthStatus && !healthStatus.ollama && selectedEngine !== 'gemini' && (
            <div className="flex items-center justify-center">
              <div className="glass-morphic rounded-xl p-4 border border-yellow-500/30 shadow-xl shadow-yellow-500/20 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-yellow-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>Ollama is not running. {selectedEngine === 'ollama' ? 'Will fall back to Gemini.' : 'Compare mode will only show Gemini results.'} Start Ollama at <code className="bg-background/50 px-2 py-1 rounded">ollama serve</code></span>
                </div>
              </div>
            </div>
          )}

          {/* File Upload */}
          <div className="flex items-center justify-center">
            <div className="glass-morphic rounded-2xl p-12 max-w-2xl w-full text-center border border-polaris-purple/30 shadow-2xl shadow-polaris-purple/25 hover:shadow-polaris-purple/40 hover:scale-[1.02] hover:border-polaris-purple/50 transition-all duration-500 ease-out backdrop-blur-xl">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-polaris-purple/20 flex items-center justify-center border border-polaris-purple/30 shadow-lg shadow-polaris-purple/20">
                {uploadedFile ? <FileText className="w-12 h-12 text-polaris-purple" /> : <Upload className="w-12 h-12 text-polaris-purple" />}
              </div>

              {isUploading ? (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Uploading and Processing...</h2>
                  <div className="flex items-center justify-center mb-6"><Loader2 className="w-8 h-8 animate-spin text-polaris-purple" /></div>
                  <p className="text-muted-foreground">Creating table and importing data...</p>
                </div>
              ) : dataset ? (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Dataset Ready for Analysis!</h2>
                  <div className="text-left bg-background/50 rounded-lg p-4 mb-6 border border-polaris-purple/20">
                    <p className="text-sm text-muted-foreground mb-2">File: <span className="text-foreground">{dataset.originalName}</span></p>
                  </div>
                  <div className="text-left bg-background/50 rounded-lg p-4 mb-6 border border-polaris-purple/20">
                    <p className="text-sm font-medium text-foreground mb-3">Suggested prompts</p>
                    <div className="flex flex-wrap gap-2">
                      {['Show summary statistics for this dataset.', 'What are the top-performing categories?', 'What is the average value per category?', 'Show the total count by group.'].map((p) => (
                        <button key={p} onClick={() => setQuestion(p)} className="text-xs px-3 py-1 rounded-full border border-polaris-purple/30 hover:border-polaris-purple/60 hover:bg-polaris-purple/10 text-foreground transition-colors">{p}</button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => { setUploadedFile(null); setDataset(null); setAnalysisResult(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} variant="outline" className="border-polaris-purple/50 text-polaris-purple hover:bg-polaris-purple/10">Upload Different File</Button>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Upload your dataset here</h1>
                  <p className="text-xl text-muted-foreground mb-8">AI will analyze it</p>
                  <div className="border-2 border-dashed border-polaris-purple/40 rounded-xl p-8 hover:border-polaris-purple/60 hover:bg-polaris-purple/5 transition-all duration-300 cursor-pointer group" onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                    <p className="text-foreground group-hover:text-polaris-purple transition-colors duration-300">Drop your CSV files here or click to browse</p>
                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question + Engine Selector */}
          {dataset && (
            <div className="flex items-center justify-center">
              <div className="glass-morphic rounded-2xl p-8 max-w-4xl w-full border border-polaris-purple/30 shadow-xl shadow-polaris-purple/20 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-polaris-purple/20 flex items-center justify-center border border-polaris-purple/30">
                    <MessageSquare className="w-6 h-6 text-polaris-purple" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Ask a Question</h2>
                </div>

                {/* Engine Selector */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {engineOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSelectedEngine(opt.key)}
                      className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border text-sm transition-all duration-300 ${
                        selectedEngine === opt.key
                          ? 'border-polaris-purple bg-polaris-purple/15 shadow-lg shadow-polaris-purple/20 scale-[1.02]'
                          : 'border-polaris-purple/20 hover:border-polaris-purple/50 hover:bg-polaris-purple/5'
                      }`}
                    >
                      <span className={`flex items-center gap-2 font-medium ${selectedEngine === opt.key ? 'text-polaris-purple' : 'text-foreground'}`}>
                        {opt.icon} {opt.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="What insights would you like from your data?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="bg-background/50 border-polaris-purple/30 focus:border-polaris-purple/60 text-lg py-6"
                    onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  />
                  <Button onClick={handleAnalyze} disabled={!question.trim() || isAnalyzing} className="w-full bg-polaris-purple hover:bg-polaris-purple/90 text-white py-6 text-lg">
                    {isAnalyzing ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {selectedEngine === 'compare' ? 'Running both engines...' : 'Analyzing...'}</>
                    ) : (
                      <><Sparkles className="w-5 h-5 mr-2" /> {selectedEngine === 'compare' ? 'Compare Engines' : 'Analyze Data'}</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {analysisResult && (
            <div className="space-y-8">
              {/* Compare Mode: Side by Side */}
              {isComparisonResult(analysisResult) ? (
                <>
                  {/* Side by Side Results */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gemini Column */}
                    <div>
                      <div className="flex items-center gap-2 mb-4 px-2">
                        <Gem className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold text-blue-400">Gemini (Cloud)</h3>
                        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {analysisResult.gemini.time_ms}ms
                        </span>
                      </div>
                      <EngineResultCard result={analysisResult.gemini} label="Gemini" accentColor="blue-400" />
                    </div>

                    {/* Ollama Column */}
                    <div>
                      <div className="flex items-center gap-2 mb-4 px-2">
                        <Server className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-bold text-green-400">Ollama (Local)</h3>
                        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {analysisResult.ollama.time_ms}ms
                        </span>
                      </div>
                      <EngineResultCard result={analysisResult.ollama} label="Ollama" accentColor="green-400" />
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <ComparisonTable comparison={analysisResult.comparison} />
                </>
              ) : isEngineResult(analysisResult) ? (
                /* Single Engine Result */
                analysisResult.error && !analysisResult.sql ? (
                  <Card className="glass-morphic border-red-500/30 shadow-xl shadow-red-500/20">
                    <CardHeader><CardTitle className="text-red-400">Analysis Error</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-red-300">{analysisResult.error}</p>
                      {analysisResult.fallback && <p className="text-yellow-400 text-sm mt-2">⚠️ {analysisResult.fallback_reason}</p>}
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {analysisResult.fallback && (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {analysisResult.fallback_reason}
                      </div>
                    )}

                    <Card className="glass-morphic border-polaris-purple/30 shadow-xl shadow-polaris-purple/20">
                      <CardHeader>
                        <CardTitle className="text-polaris-purple flex items-center justify-between">
                          <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> AI Insights</span>
                          <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                            {analysisResult.engine === 'gemini' ? <Gem className="w-3 h-3" /> : <Server className="w-3 h-3" />}
                            {analysisResult.engine} • <Clock className="w-3 h-3" /> {analysisResult.time_ms}ms
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent><p className="text-foreground text-lg leading-relaxed">{analysisResult.insight}</p></CardContent>
                    </Card>

                    <Card className="glass-morphic border-polaris-purple/30 shadow-xl shadow-polaris-purple/20">
                      <CardHeader><CardTitle className="text-polaris-purple">Generated SQL Query</CardTitle></CardHeader>
                      <CardContent>
                        <pre className="bg-background/50 p-4 rounded-lg text-sm text-foreground overflow-x-auto border border-polaris-purple/20">{analysisResult.sql}</pre>
                      </CardContent>
                    </Card>

                    {analysisResult.rows && analysisResult.rows.length > 0 && (
                      <Card className="glass-morphic border-polaris-purple/30 shadow-xl shadow-polaris-purple/20">
                        <CardHeader><CardTitle className="text-polaris-purple">Query Results</CardTitle></CardHeader>
                        <CardContent><DataTable data={analysisResult.rows} /></CardContent>
                      </Card>
                    )}
                  </>
                )
              ) : null}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analyze;
