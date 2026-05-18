"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import LatencyChart from "@/components/LatencyChart";

interface Check {
  id: string;
  status: number;
  latency: number;
  isUp: boolean;
  checkedAt: string;
}

interface EndpointDetail {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  checks: Check[];
  stats: {
    totalChecks: number;
    upChecks: number;
    uptimePercentage: number;
    avgLatency: number;
  };
}

export default function EndpointDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [endpoint, setEndpoint] = useState<EndpointDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchEndpoint = useCallback(async () => {
    const res = await fetch(`/api/endpoints/${params.id}/checks`);
    if (!res.ok) {
      router.push("/");
      return;
    }
    const data = await res.json();
    setEndpoint(data);
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => {
    fetchEndpoint();
  }, [fetchEndpoint]);

  const runCheck = async () => {
    setChecking(true);
    await fetch(`/api/check/${params.id}`, { method: "POST" });
    await fetchEndpoint();
    setChecking(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (!endpoint) return null;

  const latestCheck = endpoint.checks[0];
  const isUp = latestCheck?.isUp ?? null;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full ${
                isUp === null
                  ? "bg-gray-500"
                  : isUp
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            <div>
              <h1 className="text-2xl font-bold">{endpoint.name}</h1>
              <p className="text-gray-400 text-sm">{endpoint.url}</p>
            </div>
          </div>
          <button
            onClick={runCheck}
            disabled={checking}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            {checking ? "Checking..." : "Run Check"}
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <span className="text-gray-400 text-sm">Status</span>
            <p
              className={`text-xl font-bold ${
                isUp === null
                  ? "text-gray-500"
                  : isUp
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {isUp === null ? "No data" : isUp ? "Up" : "Down"}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <span className="text-gray-400 text-sm">Uptime</span>
            <p className="text-xl font-bold text-white">
              {endpoint.stats.uptimePercentage}%
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <span className="text-gray-400 text-sm">Avg Latency</span>
            <p className="text-xl font-bold text-white">
              {endpoint.stats.avgLatency}ms
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <span className="text-gray-400 text-sm">Total Checks</span>
            <p className="text-xl font-bold text-white">
              {endpoint.stats.totalChecks}
            </p>
          </div>
        </div>

        {/* Latency chart */}
        {endpoint.checks.length > 1 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Response Time</h2>
            <div className="h-64">
              <LatencyChart checks={endpoint.checks} />
            </div>
          </div>
        )}

        {/* Check history table */}
        {endpoint.checks.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Check History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left py-2 pr-4">Time</th>
                    <th className="text-left py-2 pr-4">Status</th>
                    <th className="text-left py-2 pr-4">Latency</th>
                    <th className="text-left py-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.checks.map((check) => (
                    <tr
                      key={check.id}
                      className="border-b border-gray-800/50"
                    >
                      <td className="py-2 pr-4 text-gray-300">
                        {new Date(check.checkedAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4">
                        {check.status === 0 ? (
                          <span className="text-red-400">Timeout</span>
                        ) : (
                          <span className="text-white">{check.status}</span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-white">
                        {check.latency}ms
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            check.isUp
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {check.isUp ? "UP" : "DOWN"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
