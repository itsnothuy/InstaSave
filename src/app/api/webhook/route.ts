import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Instagram Webhook Verification Token (set in environment)
const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'your_verify_token';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Webhook verification challenge
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  console.log('Webhook verification failed');
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    
    // Verify webhook signature (recommended for production)
    if (process.env.INSTAGRAM_APP_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.INSTAGRAM_APP_SECRET)
        .update(body)
        .digest('hex');
      
      if (signature !== `sha256=${expectedSignature}`) {
        console.log('Invalid webhook signature');
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    const data = JSON.parse(body);
    console.log('Webhook received:', JSON.stringify(data, null, 2));

    // Handle webhook events here
    // For InstaSave, you might want to:
    // - Update user permissions
    // - Handle account deauthorizations
    // - Process media updates

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
