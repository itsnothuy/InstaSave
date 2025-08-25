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
    
    // Exchange code for short-lived access token
    const shortLivedTokenData = await InstagramOAuth.exchangeCodeForToken(code);
    
    // Exchange short-lived token for long-lived token (60 days)
    const longLivedTokenData = await InstagramOAuth.getLongLivedToken(shortLivedTokenData.access_token);
    
    // In a real application, you would:
    // 1. Store the long-lived access token securely (encrypted in database)
    // 2. Associate it with the user's session/account
    // 3. Set up automatic token refresh (before 60 days)
    // 4. Store token expiry time for refresh scheduling
    
    // For this demo, we'll redirect to a success page
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/success?token_type=long_lived&expires_in=${longLivedTokenData.expires_in}`
    );
    
    // Clear the state cookie
    response.cookies.delete('instagram_oauth_state');
    
    // In production, store access token securely in database
    // For demo purposes only - DO NOT store tokens in cookies in production!
    response.cookies.set('instagram_demo_token', longLivedTokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: longLivedTokenData.expires_in || 5184000 // 60 days default
    });
    
    // Store token expiry for refresh logic
    const expiryDate = new Date(Date.now() + (longLivedTokenData.expires_in * 1000));
    response.cookies.set('instagram_token_expiry', expiryDate.toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: longLivedTokenData.expires_in || 5184000
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
