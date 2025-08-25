import { InstagramMedia, InstagramPost, ResolverOptions } from '@/types';

/**
 * Instagram API service for resolving public content
 * This implementation uses public endpoints and follows Instagram's robots.txt
 */

export class InstagramResolver {
  private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  private static readonly TIMEOUT = 10000; // 10 seconds

  /**
   * Resolves Instagram URL to media information
   * Note: This is a demo implementation. For production use:
   * 1. Use Instagram's official oEmbed API (requires app registration)
   * 2. Implement proper rate limiting
   * 3. Respect robots.txt and ToS
   */
  static async resolve(url: string, options: ResolverOptions = {}): Promise<InstagramMedia> {
    const {
      includeMetadata = true,
      includeThumbnails = true,
      maxQuality = 'original',
      timeout = InstagramResolver.TIMEOUT
    } = options;

    try {
      // Extract shortcode from URL
      const shortcode = InstagramResolver.extractShortcode(url);
      if (!shortcode) {
        throw new Error('Invalid Instagram URL - cannot extract shortcode');
      }

      // For demo purposes, we'll return mock data
      // In a real implementation, you would:
      // 1. Use Instagram oEmbed API: https://graph.facebook.com/v18.0/instagram_oembed
      // 2. Parse the public page content (respecting robots.txt)
      // 3. Use Instagram Basic Display API for owned content

      return InstagramResolver.createMockMedia(url, shortcode, maxQuality);

    } catch (error) {
      console.error('Instagram resolve error:', error);
      throw new Error(`Failed to resolve Instagram content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extracts shortcode from Instagram URL
   */
  private static extractShortcode(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;
      
      // Match different Instagram URL patterns
      const patterns = [
        /\/p\/([A-Za-z0-9_-]+)/, // Regular posts
        /\/reel\/([A-Za-z0-9_-]+)/, // Reels
        /\/tv\/([A-Za-z0-9_-]+)/, // IGTV
      ];

      for (const pattern of patterns) {
        const match = path.match(pattern);
        if (match) {
          return match[1];
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Creates mock media data for demo purposes
   * In production, this would be replaced with actual API calls
   */
  private static createMockMedia(url: string, shortcode: string, maxQuality: string): InstagramMedia {
    const isVideo = url.includes('/reel/') || url.includes('/tv/');
    const baseWidth = 1080;
    const baseHeight = 1080;

    // Generate different quality options based on maxQuality
    const qualityOptions = [];
    
    if (maxQuality === 'original' || maxQuality === 'high') {
      qualityOptions.push({
        id: `${shortcode}_high`,
        type: (isVideo ? 'video' : 'image') as 'video' | 'image',
        quality: 'high' as const,
        url: `https://picsum.photos/${baseWidth}/${baseHeight}?random=${shortcode}`,
        width: baseWidth,
        height: baseHeight,
        fileSize: isVideo ? 5242880 : 524288, // 5MB for video, 512KB for image
        format: isVideo ? 'mp4' : 'jpg',
        label: `High Quality ${isVideo ? 'Video' : 'Image'} (${baseWidth}x${baseHeight})`
      });
    }

    if (maxQuality === 'original' || maxQuality === 'high' || maxQuality === 'medium') {
      qualityOptions.push({
        id: `${shortcode}_medium`,
        type: (isVideo ? 'video' : 'image') as 'video' | 'image',
        quality: 'medium' as const,
        url: `https://picsum.photos/${Math.floor(baseWidth * 0.67)}/${Math.floor(baseHeight * 0.67)}?random=${shortcode}`,
        width: Math.floor(baseWidth * 0.67),
        height: Math.floor(baseHeight * 0.67),
        fileSize: isVideo ? 2621440 : 262144, // 2.5MB for video, 256KB for image
        format: isVideo ? 'mp4' : 'jpg',
        label: `Medium Quality ${isVideo ? 'Video' : 'Image'} (${Math.floor(baseWidth * 0.67)}x${Math.floor(baseHeight * 0.67)})`
      });
    }

    // Always include low quality option
    qualityOptions.push({
      id: `${shortcode}_low`,
      type: (isVideo ? 'video' : 'image') as 'video' | 'image',
      quality: 'low' as const,
      url: `https://picsum.photos/${Math.floor(baseWidth * 0.44)}/${Math.floor(baseHeight * 0.44)}?random=${shortcode}`,
      width: Math.floor(baseWidth * 0.44),
      height: Math.floor(baseHeight * 0.44),
      fileSize: isVideo ? 1048576 : 131072, // 1MB for video, 128KB for image
      format: isVideo ? 'mp4' : 'jpg',
      label: `Low Quality ${isVideo ? 'Video' : 'Image'} (${Math.floor(baseWidth * 0.44)}x${Math.floor(baseHeight * 0.44)})`
    });

    return {
      id: shortcode,
      type: (isVideo ? 'video' : 'image') as 'video' | 'image',
      url: url,
      thumbnail: `https://picsum.photos/400/400?random=${shortcode}`,
      caption: `Demo content for ${shortcode}. This is a demo version of InstaSave. In production, real Instagram content would be displayed here.`,
      username: 'demo_user',
      displayUrl: url,
      downloadUrls: qualityOptions,
      metadata: {
        width: baseWidth,
        height: baseHeight,
        duration: isVideo ? 30 : undefined,
        fileSize: qualityOptions[0]?.fileSize || 524288
      }
    };
  }

  /**
   * Validates Instagram content access
   * This would check if content is public and accessible
   */
  static async validateAccess(url: string): Promise<boolean> {
    try {
      // In a real implementation, this would:
      // 1. Check if the content is public
      // 2. Verify the URL is accessible
      // 3. Ensure compliance with Instagram's ToS
      
      // For demo, we'll assume all URLs are accessible
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets Instagram oEmbed data (requires app registration)
   * This is a placeholder for the official oEmbed implementation
   */
  static async getOEmbedData(url: string, accessToken?: string): Promise<any> {
    if (!accessToken) {
      throw new Error('Access token required for oEmbed API');
    }

    // Official Instagram oEmbed endpoint
    const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed`;
    const params = new URLSearchParams({
      url: url,
      access_token: accessToken,
      maxwidth: '640',
      omitscript: 'true'
    });

    try {
      const response = await fetch(`${oembedUrl}?${params}`, {
        headers: {
          'User-Agent': InstagramResolver.USER_AGENT
        },
        signal: AbortSignal.timeout(InstagramResolver.TIMEOUT)
      });

      if (!response.ok) {
        throw new Error(`oEmbed API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('oEmbed API error:', error);
      throw error;
    }
  }
}

/**
 * Configuration for Instagram API integration
 */
export const InstagramConfig = {
  // These would be your actual Instagram app credentials
  APP_ID: process.env.INSTAGRAM_APP_ID,
  APP_SECRET: process.env.INSTAGRAM_APP_SECRET,
  REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI,
  
  // API endpoints
  OEMBED_URL: 'https://graph.facebook.com/v18.0/instagram_oembed',
  BASIC_DISPLAY_URL: 'https://graph.instagram.com',
  
  // Scopes for Instagram Basic Display API
  SCOPES: ['user_profile', 'user_media'].join(','),
  
  // Rate limiting
  RATE_LIMIT: {
    requests: 200, // per hour
    window: 3600000 // 1 hour in milliseconds
  }
};

/**
 * Error types for Instagram API
 */
export class InstagramAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'InstagramAPIError';
  }
}

export class RateLimitError extends InstagramAPIError {
  constructor(retryAfter?: number) {
    super(
      `Rate limit exceeded${retryAfter ? `, retry after ${retryAfter} seconds` : ''}`,
      'RATE_LIMIT_EXCEEDED',
      429
    );
  }
}

export class ContentNotFoundError extends InstagramAPIError {
  constructor(url: string) {
    super(`Content not found or not accessible: ${url}`, 'CONTENT_NOT_FOUND', 404);
  }
}

export class PrivateContentError extends InstagramAPIError {
  constructor() {
    super('This content is private and requires authentication', 'PRIVATE_CONTENT', 403);
  }
}
