"use client";

import { useState } from "react";
import { isValidInstagramURL } from "@/lib/utils";

interface URLInputProps {
  onSubmit: (url: string) => void;
  loading?: boolean;
}

export default function URLInput({ onSubmit, loading = false }: URLInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter an Instagram URL");
      return;
    }

    if (!isValidInstagramURL(url)) {
      setError("Please enter a valid Instagram URL");
      return;
    }

    setError("");
    onSubmit(url.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError("");
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            placeholder="Paste Instagram URL here..."
            className="w-full px-4 py-4 text-lg rounded-lg border border-gray-300 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
          
          {/* Paste Button */}
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm text-gray-600 transition-colors duration-200"
            disabled={loading}
          >
            📋 Paste
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            "Download"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* URL Examples */}
      <div className="mt-4 text-center">
        <p className="text-white/80 text-sm mb-2">Example URLs:</p>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="bg-white/10 px-2 py-1 rounded text-white/70">
            https://instagram.com/p/...
          </span>
          <span className="bg-white/10 px-2 py-1 rounded text-white/70">
            https://www.instagram.com/reel/...
          </span>
          <span className="bg-white/10 px-2 py-1 rounded text-white/70">
            https://instagram.com/stories/...
          </span>
        </div>
      </div>
    </div>
  );
}
