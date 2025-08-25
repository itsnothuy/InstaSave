"use client";

import { useState } from "react";
import { InstagramMedia, MediaDownloadOption } from "@/types";
import { formatFileSize, copyToClipboard, generateSafeFilename } from "@/lib/utils";

interface MediaResultProps {
  media: InstagramMedia;
}

export default function MediaResult({ media }: MediaResultProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (option: MediaDownloadOption) => {
    setDownloadingId(option.id);
    
    try {
      // Create a download link
      const filename = generateSafeFilename(
        media.url, 
        option.format ? `.${option.format}` : (option.type === 'video' ? '.mp4' : '.jpg')
      );
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = option.url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyLink = async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      alert('Link copied to clipboard!');
    } else {
      alert('Failed to copy link');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Download Options</h3>
        <p className="text-white/80">Choose your preferred quality and format</p>
      </div>

      {/* Media Preview */}
      {media.thumbnail && (
        <div className="mb-6 text-center">
          <img
            src={media.thumbnail}
            alt="Preview"
            className="max-w-full max-h-48 mx-auto rounded-lg shadow-lg"
          />
          {media.caption && (
            <p className="mt-3 text-white/80 text-sm line-clamp-2">{media.caption}</p>
          )}
          {media.username && (
            <p className="mt-2 text-white/90 font-medium">@{media.username}</p>
          )}
        </div>
      )}

      {/* Download Options */}
      <div className="space-y-3">
        {media.downloadUrls.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {option.type === 'video' ? '🎥' : '📸'}
                </span>
                <div>
                  <p className="text-white font-medium">{option.label}</p>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <span className="capitalize">{option.quality}</span>
                    {option.width && option.height && (
                      <span>• {option.width}x{option.height}</span>
                    )}
                    {option.fileSize && (
                      <span>• {formatFileSize(option.fileSize)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopyLink(option.url)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors duration-200"
                title="Copy download link"
              >
                📋 Copy Link
              </button>
              
              <button
                onClick={() => handleDownload(option)}
                disabled={downloadingId === option.id}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors duration-200 min-w-[100px]"
              >
                {downloadingId === option.id ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                    ...
                  </div>
                ) : (
                  "⬇️ Download"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-200 text-sm">
          <span className="font-medium">Important:</span> Please ensure you have the right to download this content. 
          InstaSave is intended for downloading your own content or content you have permission to save.
        </p>
      </div>

      {/* Try Another */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors duration-200"
        >
          Download Another
        </button>
      </div>
    </div>
  );
}
