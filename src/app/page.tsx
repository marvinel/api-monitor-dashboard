"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import AddEndpointForm from "@/components/AddEndpointForm";
import EndpointCard from "@/components/EndpointCard";

interface Check {
  id: string;
  status: number;
  latency: number;
  isUp: boolean;
  checkedAt: string;
}

interface Endpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  group: string;
  checks: Check[];
}

export default function Home() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [checking, setChecking] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchEndpoints = useCallback(async () => {
    const res = await fetch("/api/endpoints");
    const data = await res.json();
    setEndpoints(data);
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchEndpoints();
  }, [fetchEndpoints]);

  // Group endpoints by their group field
  const groupedEndpoints = useMemo(() => {
    const groups: Record<string, Endpoint[]> = {};
    endpoints.forEach((ep) => {
      const group = ep.group || "Default";
      if (!groups[group]) groups[group] = [];
      groups[group].push(ep);
    });
    return groups;
  }, [endpoints]);

  const existingGroups = useMemo(
    () => [...new Set(endpoints.map((ep) => ep.group || "Default"))],
    [endpoints]
  );

  if (!mounted) return null;

  const runCheck = async () => {
    setChecking(true);
    await fetch("/api/check", { method: "POST" });
    await fetchEndpoints();
    setChecking(false);
  };

  const deleteEndpoint = async (id: string) => {
    await fetch(`/api/endpoints/${id}`, { method: "DELETE" });
    await fetchEndpoints();
  };

  const checkEndpoint = async (id: string) => {
    await fetch(`/api/check/${id}`, { method: "POST" });
    await fetchEndpoints();
  };

  const totalUp = endpoints.filter((e) => e.checks[0]?.isUp).length;
  const totalDown = endpoints.filter(
    (e) => e.checks.length > 0 && !e.checks[0]?.isUp
  ).length;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">API Monitor</h1>
            <p className="text-gray-400 mt-1">
              Track the health and performance of your API integrations
            </p>
          </div>
          <button
            onClick={runCheck}
            disabled={checking || endpoints.length === 0}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            {checking ? "Checking..." : "Run All Checks"}
          </button>
        </div>

        {/* Stats summary */}
        {endpoints.length > 0 && (
          <div className="flex gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
              <span className="text-gray-400 text-sm">Total</span>
              <p className="text-xl font-bold">{endpoints.length}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
              <span className="text-gray-400 text-sm">Up</span>
              <p className="text-xl font-bold text-green-400">{totalUp}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
              <span className="text-gray-400 text-sm">Down</span>
              <p className="text-xl font-bold text-red-400">{totalDown}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
              <span className="text-gray-400 text-sm">Groups</span>
              <p className="text-xl font-bold">{Object.keys(groupedEndpoints).length}</p>
            </div>
          </div>
        )}

        {/* Add endpoint form */}
        <div className="mb-8">
          <AddEndpointForm onAdd={fetchEndpoints} existingGroups={existingGroups} />
        </div>

        {/* Grouped endpoint cards */}
        {Object.entries(groupedEndpoints).map(([group, groupEndpoints]) => (
          <div key={group} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-semibold text-gray-200">{group}</h2>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                {groupEndpoints.length} endpoint{groupEndpoints.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid gap-4">
              {groupEndpoints.map((endpoint) => (
                <EndpointCard
                  key={endpoint.id}
                  endpoint={endpoint}
                  onDelete={deleteEndpoint}
                  onCheck={checkEndpoint}
                />
              ))}
            </div>
          </div>
        ))}

        {endpoints.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-lg">No endpoints yet.</p>
            <p className="text-sm mt-1">
              Add an API URL above to start monitoring.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
