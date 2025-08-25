import { NextRequest, NextResponse } from 'next/server';
import { InstagramOAuth, InstagramOAuthError } from '@/lib/instagram-real';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Get current token from cookie (in production, use proper session management)
    const currentToken = request.cookies.get('instagram_demo_token')?.value;
    const tokenExpiry = request.cookies.get('instagram_token_expiry')?.value;
    
    if (!currentToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No token found',
          message: 'Please log in again'
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Check if token needs refresh (should refresh before expiry)
    if (tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      const now = new Date();
      const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      
      // Only refresh if token is at least 24h old and less than 10 days until expiry
      if (daysUntilExpiry > 10) {
        return NextResponse.json({
          success: true,
          message: 'Token is still fresh, no refresh needed',
          daysUntilExpiry: Math.round(daysUntilExpiry)
        } as ApiResponse);
      }
    }

    // Refresh the long-lived token
    const refreshedTokenData = await InstagramOAuth.refreshLongLivedToken(currentToken);
    
    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      expiresIn: refreshedTokenData.expires_in
    } as ApiResponse);
    
    // Update the stored token and expiry
    response.cookies.set('instagram_demo_token', refreshedTokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshedTokenData.expires_in || 5184000 // 60 days default
    });
    
    const newExpiryDate = new Date(Date.now() + (refreshedTokenData.expires_in * 1000));
    response.cookies.set('instagram_token_expiry', newExpiryDate.toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshedTokenData.expires_in || 5184000
    });
    
    return response;
    
  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error instanceof InstagramOAuthError) {
      // Token might be expired or invalid, require re-authentication
      const response = NextResponse.json(
        { 
          success: false, 
          error: 'Token refresh failed',
          message: 'Please reconnect your Instagram account',
          requiresReauth: true
        } as ApiResponse,
        { status: 401 }
      );
      
      // Clear invalid tokens
      response.cookies.delete('instagram_demo_token');
      response.cookies.delete('instagram_token_expiry');
      
      return response;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to refresh token',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      } as ApiResponse,
      { status: 500 }
    );
  }
}
