"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Instagram Connected Successfully!
        </h1>
        <p className="text-white/90 mb-6">
          Your Instagram account has been connected to InstaSave. You can now download your own Instagram content.
        </p>
        
        {userId && (
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <p className="text-white/70 text-sm mb-2">Connected Account:</p>
            <p className="text-white font-mono">User ID: {userId}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <Link 
            href="/private"
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Browse Your Instagram Content
          </Link>
          
          <Link 
            href="/"
            className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-200 text-sm">
            <strong>Note:</strong> This demo stores your access token temporarily. 
            In a production app, tokens would be stored securely and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
