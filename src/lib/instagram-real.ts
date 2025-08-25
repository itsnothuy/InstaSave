/**
 * Real Instagram API Integration
 * This file contains the actual implementation for Instagram Basic Display API
 * and Instagram Graph API integration
 */

import { InstagramMedia, InstagramPost, ResolverOptions, ApiResponse } from '@/types';

// Instagram API Configuration
const INSTAGRAM_CONFIG = {
  // Basic Display API
  BASIC_DISPLAY_API_URL: 'https://graph.instagram.com',
  OAUTH_URL: 'https://api.instagram.com/oauth/authorize',
  TOKEN_URL: 'https://api.instagram.com/oauth/access_token',
  
  // Graph API  
  GRAPH_API_URL: 'https://graph.facebook.com',
  GRAPH_API_VERSION: process.env.INSTAGRAM_GRAPH_API_VERSION || 'v19.0',
  
  // oEmbed API
  OEMBED_URL: 'https://graph.facebook.com/v19.0/instagram_oembed',
  
  // App credentials
  APP_ID: process.env.INSTAGRAM_APP_ID,
  APP_SECRET: process.env.INSTAGRAM_APP_SECRET,
  REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  
  // Scopes
  SCOPES: ['user_profile', 'user_media'].join(','),
  
  // Rate limits
  RATE_LIMITS: {
    BASIC_DISPLAY: 200, // per hour
    GRAPH_API: 200, // per hour
    OEMBED: 5000, // per hour
  }
};

/**
 * Real Instagram API Resolver
 */
export class RealInstagramResolver {
  
  /**
   * Get Instagram oEmbed data for public posts
   * This is the recommended way to get Instagram content metadata
   */
  static async getPublicPostData(url: string): Promise<InstagramMedia> {
    if (!INSTAGRAM_CONFIG.APP_ID || !INSTAGRAM_CONFIG.APP_SECRET) {
      throw new Error('Instagram API credentials not configured. Please set INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET in your environment variables.');
    }

    try {
      // Get app access token for oEmbed API
      const appAccessToken = await this.getAppAccessToken();
      
      // Call Instagram oEmbed API
      const oembedData = await this.fetchOEmbedData(url, appAccessToken);
      
      // Parse and return structured data
      return this.parseOEmbedResponse(oembedData, url);
      
    } catch (error) {
      console.error('Failed to fetch Instagram content:', error);
      throw new Error(`Unable to fetch Instagram content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get app access token for Instagram oEmbed API
   */
  private static async getAppAccessToken(): Promise<string> {
    const response = await fetch(`${INSTAGRAM_CONFIG.GRAPH_API_URL}/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_CONFIG.APP_ID!,
        client_secret: INSTAGRAM_CONFIG.APP_SECRET!,
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get app access token: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Fetch oEmbed data from Instagram
   */
  private static async fetchOEmbedData(url: string, accessToken: string): Promise<any> {
    const oembedUrl = new URL(INSTAGRAM_CONFIG.OEMBED_URL);
    oembedUrl.searchParams.set('url', url);
    oembedUrl.searchParams.set('access_token', accessToken);
    oembedUrl.searchParams.set('maxwidth', '1080');
    oembedUrl.searchParams.set('omitscript', 'true');

    const response = await fetch(oembedUrl.toString(), {
      headers: {
        'User-Agent': 'InstaSave/1.0',
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`oEmbed API error (${response.status}): ${error}`);
    }

    return await response.json();
  }

  /**
   * Parse oEmbed response into our InstagramMedia format
   */
  private static parseOEmbedResponse(oembedData: any, originalUrl: string): InstagramMedia {
    const shortcode = this.extractShortcodeFromUrl(originalUrl);
    const isVideo = oembedData.type === 'video';
    
    // Extract media URLs from oEmbed HTML
    const mediaUrls = this.extractMediaUrlsFromOEmbed(oembedData.html);
    
    return {
      id: shortcode || Date.now().toString(),
      type: isVideo ? 'video' : 'image',
      url: originalUrl,
      thumbnail: oembedData.thumbnail_url,
      caption: this.extractCaptionFromOEmbed(oembedData.html),
      username: oembedData.author_name?.replace('@', ''),
      displayUrl: originalUrl,
      downloadUrls: this.generateDownloadOptions(mediaUrls, isVideo, shortcode || 'unknown'),
      metadata: {
        width: oembedData.thumbnail_width || 1080,
        height: oembedData.thumbnail_height || 1080,
        duration: isVideo ? undefined : undefined, // oEmbed doesn't provide video duration
        fileSize: undefined // Will be determined from actual media
      }
    };
  }

  /**
   * Extract shortcode from Instagram URL
   */
  private static extractShortcodeFromUrl(url: string): string | null {
    const patterns = [
      /\/p\/([A-Za-z0-9_-]+)/,
      /\/reel\/([A-Za-z0-9_-]+)/,
      /\/tv\/([A-Za-z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * Extract media URLs from oEmbed HTML
   * Note: This is a simplified approach. In production, you might need more sophisticated parsing
   */
  private static extractMediaUrlsFromOEmbed(html: string): string[] {
    const urls: string[] = [];
    
    // Look for image sources
    const imgMatches = html.matchAll(/src="([^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/gi);
    for (const match of imgMatches) {
      urls.push(match[1]);
    }
    
    // Look for video sources
    const videoMatches = html.matchAll(/src="([^"]*\.(?:mp4|webm|mov)[^"]*)"/gi);
    for (const match of videoMatches) {
      urls.push(match[1]);
    }
    
    return urls;
  }

  /**
   * Extract caption from oEmbed HTML
   */
  private static extractCaptionFromOEmbed(html: string): string | undefined {
    // Try to extract caption from various possible locations in the HTML
    const captionPatterns = [
      /<p[^>]*>(.*?)<\/p>/i,
      /alt="([^"]*?)"/i,
      /title="([^"]*?)"/i,
    ];

    for (const pattern of captionPatterns) {
      const match = html.match(pattern);
      if (match && match[1] && match[1].trim()) {
        return match[1].replace(/<[^>]*>/g, '').trim();
      }
    }
    
    return undefined;
  }

  /**
   * Generate download options from media URLs
   */
  private static generateDownloadOptions(mediaUrls: string[], isVideo: boolean, shortcode: string) {
    const options = [];
    
    // If we have media URLs, create options for them
    if (mediaUrls.length > 0) {
      mediaUrls.forEach((url, index) => {
        options.push({
          id: `${shortcode}_option_${index}`,
          type: (isVideo ? 'video' : 'image') as 'video' | 'image',
          quality: 'high' as const,
          url: url,
          width: 1080, // Default, would need to fetch actual dimensions
          height: 1080,
          fileSize: undefined, // Would need to fetch from URL
          format: isVideo ? 'mp4' : 'jpg',
          label: `${isVideo ? 'Video' : 'Image'} - High Quality`
        });
      });
    } else {
      // Fallback: create a single option
      options.push({
        id: `${shortcode}_fallback`,
        type: (isVideo ? 'video' : 'image') as 'video' | 'image',
        quality: 'medium' as const,
        url: '#', // Placeholder - would need alternative method to get actual media
        width: 640,
        height: 640,
        fileSize: undefined,
        format: isVideo ? 'mp4' : 'jpg',
        label: `${isVideo ? 'Video' : 'Image'} - Standard Quality`
      });
    }
    
    return options;
  }
}

/**
 * Instagram OAuth Handler
 */
export class InstagramOAuth {
  
  /**
   * Generate OAuth authorization URL
   */
  static getAuthorizationUrl(state?: string): string {
    if (!INSTAGRAM_CONFIG.APP_ID || !INSTAGRAM_CONFIG.REDIRECT_URI) {
      throw new Error('Instagram OAuth not configured properly');
    }

    const params = new URLSearchParams({
      client_id: INSTAGRAM_CONFIG.APP_ID,
      redirect_uri: INSTAGRAM_CONFIG.REDIRECT_URI,
      scope: INSTAGRAM_CONFIG.SCOPES,
      response_type: 'code',
      ...(state && { state })
    });

    return `${INSTAGRAM_CONFIG.OAUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string): Promise<{ access_token: string; user_id: string }> {
    const response = await fetch(INSTAGRAM_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_CONFIG.APP_ID!,
        client_secret: INSTAGRAM_CONFIG.APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: INSTAGRAM_CONFIG.REDIRECT_URI!,
        code
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
    }

    return await response.json();
  }

  /**
   * Get user's media using access token
   */
  static async getUserMedia(accessToken: string): Promise<InstagramMedia[]> {
    const url = `${INSTAGRAM_CONFIG.BASIC_DISPLAY_API_URL}/me/media`;
    const params = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
      access_token: accessToken
    });

    const response = await fetch(`${url}?${params.toString()}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch user media: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return data.data.map((item: any) => this.transformUserMediaToInstagramMedia(item));
  }

  /**
   * Transform Instagram Basic Display API response to our format
   */
  private static transformUserMediaToInstagramMedia(item: any): InstagramMedia {
    const isVideo = item.media_type === 'VIDEO';
    
    return {
      id: item.id,
      type: (isVideo ? 'video' : 'image') as 'video' | 'image',
      url: item.permalink,
      thumbnail: item.thumbnail_url || item.media_url,
      caption: item.caption,
      username: undefined, // Would need separate API call to get user info
      displayUrl: item.permalink,
      downloadUrls: [{
        id: `${item.id}_original`,
        type: (isVideo ? 'video' : 'image') as 'video' | 'image',
        quality: 'original',
        url: item.media_url,
        width: undefined, // Not provided by Basic Display API
        height: undefined,
        fileSize: undefined,
        format: isVideo ? 'mp4' : 'jpg',
        label: `Original ${isVideo ? 'Video' : 'Image'}`
      }],
      metadata: {
        width: undefined,
        height: undefined,
        duration: undefined,
        fileSize: undefined
      }
    };
  }
}

/**
 * Error types for real Instagram API
 */
export class InstagramRealAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'InstagramRealAPIError';
  }
}

export class InstagramOAuthError extends InstagramRealAPIError {
  constructor(message: string, details?: any) {
    super(message, 'OAUTH_ERROR', 401, details);
  }
}

export class InstagramRateLimitError extends InstagramRealAPIError {
  constructor(retryAfter?: number) {
    super(
      `Instagram API rate limit exceeded${retryAfter ? `, retry after ${retryAfter} seconds` : ''}`,
      'RATE_LIMIT_EXCEEDED',
      429
    );
  }
}
