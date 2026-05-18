"use client";

import Link from "next/link";
import LatencyChart from "./LatencyChart";

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
  checks: Check[];
}

interface EndpointCardProps {
  endpoint: Endpoint;
  onDelete: (id: string) => void;
  onCheck: (id: string) => void;
}

export default function EndpointCard({ endpoint, onDelete, onCheck }: EndpointCardProps) {
  const latestCheck = endpoint.checks[0]; // most recent check
  const isUp = latestCheck?.isUp ?? null; // null if no checks yet

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Status indicator dot */}
          <div
            className={`w-3 h-3 rounded-full ${
              isUp === null
                ? "bg-gray-500"
                : isUp
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <div>
            <h3 className="text-white font-semibold">
              <Link
                href={`/endpoints/${endpoint.id}`}
                className="hover:text-blue-400 transition-colors"
              >
                {endpoint.name}
              </Link>
            </h3>
            <p className="text-gray-500 text-sm truncate max-w-xs">
              <span className="text-gray-400 font-mono text-xs mr-2">
                {endpoint.method}
              </span>
              {endpoint.url}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCheck(endpoint.id)}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm cursor-pointer"
            aria-label={`Check ${endpoint.name}`}
          >
            Check
          </button>
          <button
            onClick={() => onDelete(endpoint.id)}
            className="text-gray-500 hover:text-red-400 transition-colors text-sm cursor-pointer"
            aria-label={`Delete ${endpoint.name}`}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Stats */}
      {latestCheck && (
        <div className="flex gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-400">Status: </span>
            <span
              className={isUp ? "text-green-400" : "text-red-400"}
            >
              {latestCheck.status === 0 ? "Timeout" : latestCheck.status}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Latency: </span>
            <span className="text-white">{latestCheck.latency}ms</span>
          </div>
        </div>
      )}

      {/* Chart */}
      {endpoint.checks.length > 1 && (
        <div className="h-40 w-full" style={{ minWidth: "100px" }}>
          <LatencyChart checks={endpoint.checks} />
        </div>
      )}

      {endpoint.checks.length === 0 && (
        <p className="text-gray-600 text-sm italic">
          No checks yet. Click &quot;Run Check&quot; to start monitoring.
        </p>
      )}
    </div>
  );
}
