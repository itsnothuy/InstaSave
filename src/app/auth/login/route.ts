import { NextRequest, NextResponse } from 'next/server';
import { InstagramOAuth } from '@/lib/instagram-real';

export async function GET(request: NextRequest) {
  try {
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in session/cookie for verification (in production, use proper session management)
    const response = NextResponse.redirect(InstagramOAuth.getAuthorizationUrl(state));
    
    // Set state cookie for verification
    response.cookies.set('instagram_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    });
    
    return response;
    
  } catch (error) {
    console.error('OAuth login error:', error);
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=oauth_setup_failed&message=${encodeURIComponent(
        error instanceof Error ? error.message : 'OAuth configuration error'
      )}`
    );
  }
}
