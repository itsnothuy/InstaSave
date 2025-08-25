import { NextRequest, NextResponse } from 'next/server';
import { isValidInstagramURL, normalizeInstagramURL } from '@/lib/utils';
import { InstagramResolver, InstagramAPIError, RateLimitError, ContentNotFoundError, PrivateContentError } from '@/lib/instagram';
import { InstagramMedia, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // Validate input
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' } as ApiResponse,
        { status: 400 }
      );
    }

    if (!isValidInstagramURL(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Instagram URL. Please provide a valid Instagram post, reel, or story URL.' } as ApiResponse,
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeInstagramURL(url);

    // Validate access to the content
    const hasAccess = await InstagramResolver.validateAccess(normalizedUrl);
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Content is not accessible or may be private' } as ApiResponse,
        { status: 403 }
      );
    }

    // Resolve the Instagram content
    const media = await InstagramResolver.resolve(normalizedUrl, {
      includeMetadata: true,
      includeThumbnails: true,
      maxQuality: 'original',
      timeout: 15000
    });

    return NextResponse.json({
      success: true,
      data: media,
      message: 'Content resolved successfully'
    } as ApiResponse<InstagramMedia>);

  } catch (error) {
    console.error('Resolve API error:', error);

    // Handle specific Instagram API errors
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          message: 'Too many requests'
        } as ApiResponse,
        { status: 429 }
      );
    }

    if (error instanceof ContentNotFoundError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Content not found or not accessible',
          message: 'The Instagram content could not be found or may have been deleted'
        } as ApiResponse,
        { status: 404 }
      );
    }

    if (error instanceof PrivateContentError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This content is private',
          message: 'You need to be logged in and have access to this private content'
        } as ApiResponse,
        { status: 403 }
      );
    }

    if (error instanceof InstagramAPIError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          message: 'Instagram API error'
        } as ApiResponse,
        { status: error.statusCode || 500 }
      );
    }

    // Generic error handling
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process Instagram content',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
