import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    INSTAGRAM_APP_ID: process.env.INSTAGRAM_APP_ID ? '✅ Set' : '❌ Missing',
    INSTAGRAM_APP_SECRET: process.env.INSTAGRAM_APP_SECRET ? '✅ Set' : '❌ Missing',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? '✅ Set' : '❌ Missing',
    INSTAGRAM_WEBHOOK_VERIFY_TOKEN: process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN ? '✅ Set' : '❌ Missing',
    INSTAGRAM_REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI ? '✅ Set' : '❌ Missing',
    NODE_ENV: process.env.NODE_ENV,
    // Don't expose actual values for security
    app_id_length: process.env.INSTAGRAM_APP_ID?.length || 0,
    secret_length: process.env.INSTAGRAM_APP_SECRET?.length || 0
  };

  return NextResponse.json({
    environment: envCheck,
    timestamp: new Date().toISOString(),
    message: 'Environment variables check'
  });
}
