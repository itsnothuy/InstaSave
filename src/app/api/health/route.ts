import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'InstaSave API',
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
}
