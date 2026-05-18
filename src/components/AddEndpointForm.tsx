"use client";

import { useState } from "react";

interface AddEndpointFormProps {
  onAdd: () => void; // callback to refresh the list after adding
}

export default function AddEndpointForm({ onAdd }: AddEndpointFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    setLoading(true);
    await fetch("/api/endpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url }),
    });

    setName("");
    setUrl("");
    setLoading(false);
    onAdd(); // tell parent to refresh
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
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
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
