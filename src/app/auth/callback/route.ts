import { NextRequest, NextResponse } from 'next/server';
import { InstagramOAuth, InstagramOAuthError } from '@/lib/instagram-real';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=oauth_denied&message=${encodeURIComponent(
          errorDescription || 'Authorization denied'
        )}`
      );
    }
    
    // Verify required parameters
    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=missing_code&message=${encodeURIComponent(
          'Authorization code not received'
        )}`
      );
    }
    
    // Verify state parameter (CSRF protection)
    const storedState = request.cookies.get('instagram_oauth_state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=invalid_state&message=${encodeURIComponent(
          'Invalid state parameter - possible CSRF attack'
        )}`
      );
    }
    
    // Exchange code for access token
    const tokenData = await InstagramOAuth.exchangeCodeForToken(code);
    
    // In a real application, you would:
    // 1. Store the access token securely (encrypted in database)
    // 2. Associate it with the user's session
    // 3. Set up token refresh logic
    
    // For this demo, we'll redirect to a success page with limited token info
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/success?user_id=${tokenData.user_id}`
    );
    
    // Clear the state cookie
    response.cookies.delete('instagram_oauth_state');
    
    // In production, store access token securely
    // For demo purposes only - DO NOT store tokens in cookies in production!
    response.cookies.set('instagram_demo_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour for demo
    });
    
    return response;
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    
    if (error instanceof InstagramOAuthError) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=oauth_error&message=${encodeURIComponent(error.message)}`
      );
    }
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=callback_failed&message=${encodeURIComponent(
        'Failed to complete authorization'
      )}`
    );
  }
}
