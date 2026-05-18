"use client";

import { useState } from "react";

interface AddEndpointFormProps {
  onAdd: () => void;
  existingGroups: string[];
}

export default function AddEndpointForm({ onAdd, existingGroups }: AddEndpointFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [group, setGroup] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    setLoading(true);
    await fetch("/api/endpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        url,
        method,
        group: group || "Default",
        headers: headers || null,
        requestBody: body || null,
      }),
    });

    setName("");
    setUrl("");
    setMethod("GET");
    setGroup("");
    setHeaders("");
    setBody("");
    setShowAdvanced(false);
    setLoading(false);
    onAdd();
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Add New Endpoint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Name, URL, Method */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-gray-400">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="GitHub API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="url" className="text-sm text-gray-400">
              URL
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://api.github.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="method" className="text-sm text-gray-400">
              Method
            </label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>

        {/* Row 2: Group */}
        <div className="flex flex-col gap-1">
          <label htmlFor="group" className="text-sm text-gray-400">
            Group
          </label>
          <div className="flex gap-2 items-center">
            <input
              id="group"
              type="text"
              placeholder="e.g. Payment APIs, Internal Services..."
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              list="group-suggestions"
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 flex-1 max-w-sm"
            />
            <datalist id="group-suggestions">
              {existingGroups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
            <span className="text-xs text-gray-500">
              Leave empty for &quot;Default&quot;
            </span>
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          {showAdvanced ? "▾ Hide" : "▸ Advanced"} (headers, body)
        </button>

        {/* Advanced fields */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-800">
            <div className="flex flex-col gap-1">
              <label htmlFor="headers" className="text-sm text-gray-400">
                Headers (JSON)
              </label>
              <textarea
                id="headers"
                placeholder={'{"Authorization": "Bearer your-token"}'}
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                rows={3}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="body" className="text-sm text-gray-400">
                Body (for POST/PUT)
              </label>
              <textarea
                id="body"
                placeholder={'{"key": "value"}'}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            {loading ? "Adding..." : "Add Endpoint"}
          </button>
        </div>
      </form>
    </div>
  );
}
