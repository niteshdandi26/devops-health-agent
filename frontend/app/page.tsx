'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface HealthCheck {
  timestamp: string;
  status: string;
  analysis: {
    error: string;
    cause: string;
    solution: string;
    severity: string;
  };
}

export default function Dashboard() {
  const [latestCheck, setLatestCheck] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHealth = async () => {
    try {
      const res = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logs: '[2024-12-10] ERROR: Database connection timeout\n[2024-12-10] Max connections reached: 100/100'
        })
      });
      const data = await res.json();
      setLatestCheck(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch health data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  const isHealthy = latestCheck?.analysis?.severity === 'LOW';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                DevOps Health Monitor
              </h1>
              <p className="text-gray-500 mt-1">
                AI-powered autonomous monitoring
              </p>
            </div>
            <button
              onClick={fetchHealth}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Status</span>
              {isHealthy ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <p className="text-2xl font-bold">
              {isHealthy ? 'Healthy' : 'Issues Found'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Last Check</span>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">Just now</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Severity</span>
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">
              {latestCheck?.analysis?.severity || 'UNKNOWN'}
            </p>
          </div>
        </div>

        {latestCheck?.analysis && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI Agent Analysis
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">❌ Error:</h3>
                <p className="text-gray-900">{latestCheck.analysis.error}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-1">🔍 Cause:</h3>
                <p className="text-gray-900">{latestCheck.analysis.cause}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-1">💡 Solution:</h3>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {latestCheck.analysis.solution}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by GROQ AI • Orchestrated by Kestra • Built for Hackathon</p>
        </div>
      </div>
    </div>
  );
}
