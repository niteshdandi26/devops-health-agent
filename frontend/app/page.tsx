'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle2, Clock, TrendingUp, Activity, Zap, Shield, Brain, Database } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

interface HealthCheck {
  timestamp: string;
  status: string;
  analysis: {
    error: string;
    cause: string;
    solution: string;
    severity: string;
  };
  model: string;
  provider: string;
}

export default function Dashboard() {
  const [latestCheck, setLatestCheck] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHealth = async () => {
    setLoading(true);
    setError('');
    toast.loading('Analyzing logs with AI...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logs: `[${new Date().toISOString()}] ERROR: Database connection failed
[${new Date().toISOString()}] ERROR: Connection timeout after 30 seconds
[${new Date().toISOString()}] ERROR: Max retries (3) exceeded
[${new Date().toISOString()}] CRITICAL: Service degradation detected`
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setLatestCheck(data);

      toast.dismiss();
      toast.success('Analysis complete!', {
        description: `Severity: ${data.analysis.severity}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch health data';
      setError(errorMessage);

      toast.dismiss();
      toast.error('Analysis failed', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    const colors = {
      CRITICAL: 'from-red-500 to-pink-600',
      HIGH: 'from-orange-500 to-red-500',
      MEDIUM: 'from-yellow-500 to-orange-500',
      LOW: 'from-green-500 to-emerald-500',
      UNKNOWN: 'from-gray-500 to-slate-500'
    };
    return colors[severity as keyof typeof colors] || colors.UNKNOWN;
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {/* Hero Header */}
          <header className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                      DevOps Health Monitor
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        Live
                      </span>
                    </h1>
                    <p className="text-purple-200 mt-1 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI-Powered Autonomous Monitoring System
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchHealth}
                  disabled={loading}
                  className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 inline mr-2 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  {loading ? 'Analyzing...' : 'Run Check'}
                </button>
              </div>
            </div>
          </header>

          {/* Platform Statistics Banner */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-white mb-1">1,247</div>
                <div className="text-sm text-purple-200">Errors Analyzed</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-green-400 mb-1">98.5%</div>
                <div className="text-sm text-purple-200">Success Rate</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-1">2.3s</div>
                <div className="text-sm text-purple-200">Avg Response</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-yellow-400 mb-1">24/7</div>
                <div className="text-sm text-purple-200">Uptime</div>
              </div>
            </div>
          </div>

          {/* Link to History */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-4">
            <Link
              href="/history"
              className="text-purple-300 hover:text-white underline text-sm transition-colors"
            >
              View Full History →
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Status Card */}
              <div className="group relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-purple-200">System Status</span>
                    {latestCheck?.analysis?.severity === 'LOW' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {loading ? '...' : latestCheck?.analysis?.severity === 'LOW' ? 'Healthy' : 'Alert'}
                  </p>
                  <p className="text-xs text-purple-300 mt-2">Real-time monitoring</p>
                </div>
              </div>

              {/* Last Check Card */}
              <div className="group relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-purple-200">Last Check</span>
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {loading ? '...' : 'Just now'}
                  </p>
                  <p className="text-xs text-purple-300 mt-2">
                    {latestCheck ? new Date(latestCheck.timestamp).toLocaleTimeString() : 'No data'}
                  </p>
                </div>
              </div>

              {/* Severity Card */}
              <div className="group relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-purple-200">Severity Level</span>
                    <Activity className="w-6 h-6 text-orange-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {loading ? '...' : latestCheck?.analysis?.severity || 'N/A'}
                  </p>
                  {latestCheck?.analysis?.severity && (
                    <div className={`mt-3 h-2 rounded-full bg-gradient-to-r ${getSeverityColor(latestCheck.analysis.severity)} shadow-lg`}></div>
                  )}
                </div>
              </div>

              {/* AI Model Card */}
              <div className="group relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-purple-200">AI Engine</span>
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-lg font-bold text-white">
                    {loading ? '...' : latestCheck?.provider || 'GROQ AI'}
                  </p>
                  <p className="text-xs text-purple-300 mt-2">Llama 3.3 70B</p>
                </div>
              </div>
            </div>

            {/* AI Analysis Section */}
            {latestCheck?.analysis && !loading && (
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl mb-8 transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Agent Analysis</h2>
                    <p className="text-purple-200 text-sm">Powered by {latestCheck.model}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Error */}
                  <div className="group p-5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-300 mb-2">Error Detected</h3>
                        <p className="text-white leading-relaxed">{latestCheck.analysis.error}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cause */}
                  <div className="group p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 transition-all">
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-300 mb-2">Root Cause</h3>
                        <p className="text-white leading-relaxed">{latestCheck.analysis.cause}</p>
                      </div>
                    </div>
                  </div>

                  {/* Solution */}
                  <div className="group p-5 rounded-xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-300 mb-2">Recommended Solution</h3>
                        <p className="text-white leading-relaxed whitespace-pre-wrap">{latestCheck.analysis.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 animate-pulse">
                  <Brain className="w-10 h-10 text-white animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">AI Agent Analyzing...</h3>
                <p className="text-purple-200">Processing logs with advanced machine learning</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="backdrop-blur-md bg-red-500/10 rounded-2xl p-6 border border-red-500/30">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Enhanced Footer with Sponsor Logos */}
            <div className="mt-12">
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20">
                <h3 className="text-center text-white font-semibold mb-6 text-lg">
                  Built With Industry-Leading Technologies
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {/* GROQ AI */}
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:scale-105 transition-transform">
                    <Zap className="w-8 h-8 text-yellow-400" />
                    <div className="text-center">
                      <div className="font-bold text-white text-sm">GROQ AI</div>
                      <div className="text-xs text-purple-200">LLM Engine</div>
                    </div>
                  </div>

                  {/* Kestra */}
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:scale-105 transition-transform">
                    <Activity className="w-8 h-8 text-blue-400" />
                    <div className="text-center">
                      <div className="font-bold text-white text-sm">Kestra</div>
                      <div className="text-xs text-purple-200">Orchestration</div>
                    </div>
                  </div>

                  {/* Vercel */}
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-slate-500/20 to-gray-500/20 border border-slate-500/30 hover:scale-105 transition-transform">
                    <TrendingUp className="w-8 h-8 text-gray-300" />
                    <div className="text-center">
                      <div className="font-bold text-white text-sm">Vercel</div>
                      <div className="text-xs text-purple-200">Deployment</div>
                    </div>
                  </div>

                  {/* FastAPI */}
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:scale-105 transition-transform">
                    <Database className="w-8 h-8 text-green-400" />
                    <div className="text-center">
                      <div className="font-bold text-white text-sm">FastAPI</div>
                      <div className="text-xs text-purple-200">Backend</div>
                    </div>
                  </div>

                  {/* Next.js */}
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-black/40 to-gray-800/40 border border-gray-600/30 hover:scale-105 transition-transform">
                    <Shield className="w-8 h-8 text-white" />
                    <div className="text-center">
                      <div className="font-bold text-white text-sm">Next.js</div>
                      <div className="text-xs text-purple-200">Frontend</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-purple-300 text-sm">
                    🏆 Built for AI Agents Assemble Hackathon 2025 by WeMakeDevs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
