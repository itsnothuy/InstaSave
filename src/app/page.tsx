"use client";

import { useState } from "react";
import Header from "@/components/Header";
import URLInput from "@/components/URLInput";
import MediaResult from "@/components/MediaResult";
import Footer from "@/components/Footer";
import { InstagramMedia } from "@/types";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InstagramMedia | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resolve URL');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto text-center">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Instagram Photo, Video Downloader
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Download Photos, Videos, Reels, Stories and Profile from Instagram
              </p>
            </div>

            {/* URL Input */}
            <div className="mb-8">
              <URLInput onSubmit={handleSubmit} loading={loading} />
            </div>

            {/* Results */}
            {error && (
              <div className="mb-8">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200">
                  <p className="font-medium">Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="mb-8">
                <MediaResult media={result} />
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                    <p className="text-white text-lg">Retrieving data, please wait a few seconds!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        {!result && !loading && (
          <div className="bg-white/5 backdrop-blur-md py-16">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Features of InstaSave
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">📸</div>
                  <h3 className="text-xl font-semibold text-white mb-2">High Quality Downloads</h3>
                  <p className="text-white/80">Download photos and videos in original quality - Full HD, 1080p, 2K, 4K</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Private & Secure</h3>
                  <p className="text-white/80">We don't store your data or download history. Completely anonymous usage</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold text-white mb-2">All Devices</h3>
                  <p className="text-white/80">Works perfectly on PC, Mac, iPhone, Android - no app installation needed</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Fast & Easy</h3>
                  <p className="text-white/80">Just paste the URL and download - simple 3-step process</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🆓</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Completely Free</h3>
                  <p className="text-white/80">No hidden fees, no registration required - forever free to use</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🎬</div>
                  <h3 className="text-xl font-semibold text-white mb-2">All Content Types</h3>
                  <p className="text-white/80">Support for photos, videos, reels, stories, and profile pictures</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How to Use Section */}
        {!result && !loading && (
          <div className="py-16">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  How to use InstaSave?
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Copy URL</h3>
                  <p className="text-white/80">Open Instagram and copy the link of the post, reel, or story you want to download</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Paste & Process</h3>
                  <p className="text-white/80">Paste the URL into our input box above and click the Download button</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Download</h3>
                  <p className="text-white/80">Choose your preferred quality and save the photo or video to your device</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
