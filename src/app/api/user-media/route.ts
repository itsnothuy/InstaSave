import { NextRequest, NextResponse } from 'next/server';
import { InstagramOAuth, InstagramOAuthError } from '@/lib/instagram-real';
import { ApiResponse, InstagramMedia } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookie (in production, use proper session management)
    const accessToken = request.cookies.get('instagram_demo_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Not authenticated',
          message: 'Please connect your Instagram account first'
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Fetch user's Instagram media
    const media = await InstagramOAuth.getUserMedia(accessToken);
    
    return NextResponse.json({
      success: true,
      data: media,
      message: `Found ${media.length} media items`
    } as ApiResponse<InstagramMedia[]>);
    
  } catch (error) {
    console.error('User media API error:', error);
    
    if (error instanceof InstagramOAuthError) {
      // Token might be expired or invalid
      const response = NextResponse.json(
        { 
          success: false, 
          error: 'Authentication expired',
          message: 'Please reconnect your Instagram account'
        } as ApiResponse,
        { status: 401 }
      );
      
      // Clear invalid token
      response.cookies.delete('instagram_demo_token');
      
      return response;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch media',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      } as ApiResponse,
      { status: 500 }
    );
  }
}
