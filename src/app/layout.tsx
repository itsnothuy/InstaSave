import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstaSave - Instagram Photo & Video Downloader",
  description: "Download photos, videos, reels, and stories from Instagram easily and safely",
  keywords: "instagram downloader, instagram video downloader, instagram photo downloader, instagram reels downloader",
  authors: [{ name: "InstaSave" }],
  openGraph: {
    title: "InstaSave - Instagram Photo & Video Downloader",
    description: "Download photos, videos, reels, and stories from Instagram easily and safely",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaSave - Instagram Photo & Video Downloader",
    description: "Download photos, videos, reels, and stories from Instagram easily and safely",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600">
          {children}
        </div>
      </body>
    </html>
  );
}
