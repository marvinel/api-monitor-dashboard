"use client";

import { useState } from "react";

interface AddEndpointFormProps {
  onAdd: () => void;
}

export default function AddEndpointForm({ onAdd }: AddEndpointFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
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
        headers: headers || null,
        requestBody: body || null,
      }),
    });

    setName("");
    setUrl("");
    setMethod("GET");
    setHeaders("");
    setBody("");
    setShowAdvanced(false);
    setLoading(false);
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Basic fields */}
      <div className="flex gap-3 items-end">
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
        <div className="flex flex-col gap-1 flex-1">
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
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Toggle advanced options */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
      >
        {showAdvanced ? "▾ Hide" : "▸ Show"} advanced options (headers, body)
      </button>

      {/* Advanced fields */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
    </form>
  );
}
