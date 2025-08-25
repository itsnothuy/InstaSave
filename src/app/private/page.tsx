"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaResult from "@/components/MediaResult";
import { InstagramMedia } from "@/types";

export default function PrivatePage() {
  const [userMedia, setUserMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<InstagramMedia | null>(null);

  useEffect(() => {
    fetchUserMedia();
  }, []);

  const fetchUserMedia = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user-media');
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please connect your Instagram account to access your content.');
          return;
        }
        throw new Error(data.error || 'Failed to fetch media');
      }

      setUserMedia(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectInstagram = () => {
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Private Instagram Downloader
            </h1>
            <p className="text-xl text-white/90">
              Download photos, videos, Stories, Reels, and Profile from your Instagram account
            </p>
          </div>

          {/* Connection Status */}
          {loading ? (
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading your Instagram content...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-2xl mx-auto">
                <div className="text-6xl mb-6">🔐</div>
                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Instagram Account</h2>
                <p className="text-white/80 mb-6">{error}</p>
                
                <div className="bg-white/5 rounded-lg p-6 mb-6 text-left">
                  <h3 className="text-lg font-semibold text-white mb-3">How it works:</h3>
                  <ol className="text-white/80 space-y-2">
                    <li><span className="font-medium text-white">1.</span> Click "Connect Instagram" below</li>
                    <li><span className="font-medium text-white">2.</span> You'll be redirected to Instagram's secure login</li>
                    <li><span className="font-medium text-white">3.</span> Grant permission to access your media</li>
                    <li><span className="font-medium text-white">4.</span> Download your own content safely</li>
                  </ol>
                </div>

                <button
                  onClick={handleConnectInstagram}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  🔗 Connect Instagram Account
                </button>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    <strong>Privacy:</strong> We only request permission to view your own media. 
                    We don't store your content or access your followers/following.
                  </p>
                </div>
              </div>
            </div>
          ) : selectedMedia ? (
            <div>
              <div className="mb-6 text-center">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  ← Back to Your Media
                </button>
              </div>
              <MediaResult media={selectedMedia} />
            </div>
          ) : userMedia.length > 0 ? (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Your Instagram Content ({userMedia.length} items)
                </h2>
                <p className="text-white/80">
                  Click on any item to see download options
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userMedia.map((media) => (
                  <div
                    key={media.id}
                    onClick={() => setSelectedMedia(media)}
                    className="bg-white/10 backdrop-blur-md rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
                  >
                    {media.thumbnail && (
                      <img
                        src={media.thumbnail}
                        alt={media.caption || 'Instagram content'}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {media.type === 'video' ? '🎥 Video' : '📸 Photo'}
                      </span>
                      <span className="text-white/70 text-sm">
                        {media.downloadUrls.length} option{media.downloadUrls.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {media.caption && (
                      <p className="text-white/80 text-sm line-clamp-2 mb-3">
                        {media.caption}
                      </p>
                    )}
                    
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
                      View Download Options
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={fetchUserMedia}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  🔄 Refresh Media
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-2xl mx-auto">
                <div className="text-6xl mb-6">📱</div>
                <h2 className="text-2xl font-bold text-white mb-4">No Media Found</h2>
                <p className="text-white/80 mb-6">
                  We couldn't find any media in your Instagram account, or you haven't posted anything yet.
                </p>
                <button
                  onClick={fetchUserMedia}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mr-4"
                >
                  🔄 Refresh
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          {!error && (
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-200 mb-3">🔒 Your Privacy & Security</h3>
                <ul className="text-green-200/80 space-y-2 text-sm">
                  <li>✅ We only access content you explicitly grant permission for</li>
                  <li>✅ Your Instagram login credentials are handled securely by Instagram</li>
                  <li>✅ We don't store your media files on our servers</li>
                  <li>✅ You can revoke access anytime from your Instagram settings</li>
                  <li>✅ All connections are encrypted and secure</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
