import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'InstaSave API',
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    instagram_api: {
      app_id_configured: process.env.INSTAGRAM_APP_ID ? '✅' : '❌',
      app_secret_configured: process.env.INSTAGRAM_APP_SECRET ? '✅' : '❌',
      webhook_token_configured: process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN ? '✅' : '❌',
      redirect_uri_configured: process.env.INSTAGRAM_REDIRECT_URI ? '✅' : '❌',
      app_url_configured: process.env.NEXT_PUBLIC_APP_URL ? '✅' : '❌'
    }
  });
}
