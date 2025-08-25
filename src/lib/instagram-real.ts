/**
 * Real Instagram API Integration
 * This file contains the actual implementation for Instagram Basic Display API
 * and Instagram Graph API integration
 */

import { InstagramMedia, InstagramPost, ResolverOptions, ApiResponse } from '@/types';

// Instagram API Configuration (Updated for Instagram API with Instagram Login)
const INSTAGRAM_CONFIG = {
  // Instagram Graph API (replaces Basic Display API)
  GRAPH_API_URL: 'https://graph.facebook.com',
  GRAPH_API_VERSION: process.env.INSTAGRAM_GRAPH_API_VERSION || 'v19.0',
  
  // OAuth URLs for Instagram Business Login
  OAUTH_URL: 'https://api.instagram.com/oauth/authorize',
  TOKEN_URL: 'https://graph.facebook.com/v19.0/oauth/access_token',
  REFRESH_TOKEN_URL: 'https://graph.facebook.com/v19.0/oauth/access_token',
  
  // oEmbed API (still available for public content)
  OEMBED_URL: 'https://graph.facebook.com/v19.0/instagram_oembed',
  
  // App credentials
  APP_ID: process.env.INSTAGRAM_APP_ID,
  APP_SECRET: process.env.INSTAGRAM_APP_SECRET,
  REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  
  // Updated scopes for Instagram API with Instagram Login
  SCOPES: ['instagram_graph_user_profile', 'instagram_graph_user_media'].join(','),
  
  // Rate limits
  RATE_LIMITS: {
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
   * Exchange authorization code for short-lived access token
   */
  static async exchangeCodeForToken(code: string): Promise<{ access_token: string; token_type: string; expires_in: number }> {
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
      throw new Error(`Token exchange failed: ${error.error_description || error.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  /**
   * Exchange short-lived token for long-lived token (60 days)
   */
  static async getLongLivedToken(shortLivedToken: string): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    const url = `${INSTAGRAM_CONFIG.GRAPH_API_URL}/${INSTAGRAM_CONFIG.GRAPH_API_VERSION}/oauth/access_token`;
    
    const params = new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: INSTAGRAM_CONFIG.APP_SECRET!,
      access_token: shortLivedToken
    });

    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Long-lived token exchange failed: ${error.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  /**
   * Refresh long-lived token (must be at least 24h old)
   */
  static async refreshLongLivedToken(longLivedToken: string): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    const url = `${INSTAGRAM_CONFIG.GRAPH_API_URL}/${INSTAGRAM_CONFIG.GRAPH_API_VERSION}/oauth/access_token`;
    
    const params = new URLSearchParams({
      grant_type: 'ig_refresh_token',
      access_token: longLivedToken
    });

    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token refresh failed: ${error.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  /**
   * Get Instagram Business Account ID first (required for Graph API)
   */
  static async getInstagramBusinessAccountId(accessToken: string): Promise<string> {
    const url = `${INSTAGRAM_CONFIG.GRAPH_API_URL}/${INSTAGRAM_CONFIG.GRAPH_API_VERSION}/me/accounts`;
    const params = new URLSearchParams({
      fields: 'instagram_business_account',
      access_token: accessToken
    });

    const response = await fetch(`${url}?${params.toString()}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get Instagram Business Account: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Find the page with Instagram Business Account
    const pageWithIG = data.data?.find((page: any) => page.instagram_business_account);
    
    if (!pageWithIG?.instagram_business_account?.id) {
      throw new Error('No Instagram Business Account found. Please ensure your Instagram account is connected to a Facebook Page and is set to Business/Creator.');
    }

    return pageWithIG.instagram_business_account.id;
  }

  /**
   * Get user's media using Instagram Graph API
   */
  static async getUserMedia(accessToken: string): Promise<InstagramMedia[]> {
    try {
      // First get the Instagram Business Account ID
      const igUserId = await this.getInstagramBusinessAccountId(accessToken);
      
      // Then fetch media using Graph API
      const url = `${INSTAGRAM_CONFIG.GRAPH_API_URL}/${INSTAGRAM_CONFIG.GRAPH_API_VERSION}/${igUserId}/media`;
      const params = new URLSearchParams({
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_url,media_type}',
        limit: '25',
        access_token: accessToken
      });

      const response = await fetch(`${url}?${params.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch user media: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return data.data?.map((item: any) => this.transformGraphAPIMediaToInstagramMedia(item)) || [];
      
    } catch (error) {
      console.error('Error fetching user media:', error);
      throw error;
    }
  }

  /**
   * Transform Instagram Graph API response to our format
   */
  private static transformGraphAPIMediaToInstagramMedia(item: any): InstagramMedia {
    const isVideo = item.media_type === 'VIDEO';
    const isCarousel = item.media_type === 'CAROUSEL_ALBUM';
    
    // Handle carousel posts (multiple media items)
    const downloadUrls = [];
    
    if (isCarousel && item.children?.data) {
      // For carousel posts, include all child media
      item.children.data.forEach((child: any, index: number) => {
        const childIsVideo = child.media_type === 'VIDEO';
        downloadUrls.push({
          id: `${item.id}_child_${index}`,
          type: (childIsVideo ? 'video' : 'image') as 'video' | 'image',
          quality: 'original' as const,
          url: child.media_url,
          width: undefined,
          height: undefined,
          fileSize: undefined,
          format: childIsVideo ? 'mp4' : 'jpg',
          label: `${childIsVideo ? 'Video' : 'Image'} ${index + 1} - Original Quality`
        });
      });
    } else {
      // Single media item
      downloadUrls.push({
        id: `${item.id}_original`,
        type: (isVideo ? 'video' : 'image') as 'video' | 'image',
        quality: 'original' as const,
        url: item.media_url,
        width: undefined,
        height: undefined,
        fileSize: undefined,
        format: isVideo ? 'mp4' : 'jpg',
        label: `Original ${isVideo ? 'Video' : 'Image'}`
      });
    }
    
    return {
      id: item.id,
      type: isCarousel ? 'carousel' : (isVideo ? 'video' : 'image'),
      url: item.permalink,
      thumbnail: item.thumbnail_url || item.media_url,
      caption: item.caption,
      username: undefined, // Would need separate API call to get user info
      displayUrl: item.permalink,
      downloadUrls,
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
