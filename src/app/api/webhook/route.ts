/**
 * Instagram Webhooks Endpoint
 * Based on Meta's official documentation: https://developers.facebook.com/docs/instagram-platform/webhooks
 * Handles verification requests and event notifications from Instagram
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Configuration from environment variables
const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'instasave_webhook_2024';
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

/**
 * GET - Webhook Verification Request Handler
 * Called by Meta to verify webhook endpoint during setup
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract verification parameters
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    console.log('Webhook verification request:', { mode, token, challenge });

    // Verify the request
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully');
      // Respond with the challenge to complete verification
      return new NextResponse(challenge, { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      console.log('❌ Webhook verification failed:', { 
        expectedToken: VERIFY_TOKEN, 
        receivedToken: token,
        mode 
      });
      return new NextResponse('Forbidden', { status: 403 });
    }
  } catch (error) {
    console.error('Webhook verification error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * POST - Event Notification Handler
 * Receives and processes Instagram webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    
    console.log('📨 Webhook event received');
    
    // Verify payload signature for security (required in production)
    if (APP_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', APP_SECRET)
        .update(body)
        .digest('hex');
      
      const providedSignature = signature.replace('sha256=', '');
      
      if (expectedSignature !== providedSignature) {
        console.log('❌ Invalid webhook signature');
        console.log('Expected:', expectedSignature);
        console.log('Provided:', providedSignature);
        return new NextResponse('Unauthorized', { status: 401 });
      }
      console.log('✅ Webhook signature verified');
    } else if (APP_SECRET) {
      console.log('⚠️ Missing signature header');
      return new NextResponse('Missing signature', { status: 400 });
    } else {
      console.log('⚠️ APP_SECRET not configured - skipping signature verification');
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(body);
    console.log('📋 Webhook data:', JSON.stringify(webhookData, null, 2));

    // Process each entry in the webhook
    if (webhookData.entry && Array.isArray(webhookData.entry)) {
      for (const entry of webhookData.entry) {
        await processWebhookEntry(entry, webhookData.object);
      }
    }

    // Always respond with 200 OK to acknowledge receipt
    return new NextResponse('OK', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Process individual webhook entry
 */
async function processWebhookEntry(entry: any, objectType: string) {
  console.log(`🔄 Processing ${objectType} webhook entry:`, entry);

  // Handle different types of changes
  if (entry.changes && Array.isArray(entry.changes)) {
    for (const change of entry.changes) {
      await processWebhookChange(change, entry, objectType);
    }
  }

  // Handle messaging events (for Instagram Business accounts)
  if (entry.messaging && Array.isArray(entry.messaging)) {
    for (const messaging of entry.messaging) {
      await processMessagingEvent(messaging, entry);
    }
  }
}

/**
 * Process webhook field changes
 */
async function processWebhookChange(change: any, entry: any, objectType: string) {
  const { field, value } = change;
  
  console.log(`📝 Processing ${field} change:`, value);

  switch (field) {
    case 'comments':
      await handleCommentEvent(value, entry);
      break;
    case 'live_comments':
      await handleLiveCommentEvent(value, entry);
      break;
    case 'mentions':
      await handleMentionEvent(value, entry);
      break;
    case 'story_insights':
      await handleStoryInsightsEvent(value, entry);
      break;
    default:
      console.log(`ℹ️ Unhandled webhook field: ${field}`);
  }
}

/**
 * Process Instagram messaging events
 */
async function processMessagingEvent(messaging: any, entry: any) {
  console.log('💬 Processing messaging event:', messaging);

  if (messaging.message) {
    await handleDirectMessage(messaging, entry);
  }

  if (messaging.postback) {
    await handlePostback(messaging, entry);
  }

  if (messaging.read) {
    await handleMessageRead(messaging, entry);
  }
}

/**
 * Handle Instagram comment events
 */
async function handleCommentEvent(value: any, entry: any) {
  console.log('💬 Comment event:', value);
  
  // For InstaSave: Could track which posts are being commented on
  // to understand popular content types
  
  // Example: Log comment activity
  if (value.verb === 'add') {
    console.log(`➕ New comment on media ${value.object_id}`);
  } else if (value.verb === 'remove') {
    console.log(`➖ Comment removed from media ${value.object_id}`);
  }
}

/**
 * Handle Instagram live comment events
 */
async function handleLiveCommentEvent(value: any, entry: any) {
  console.log('🔴 Live comment event:', value);
  // Handle live video comments during broadcast
}

/**
 * Handle Instagram mention events
 */
async function handleMentionEvent(value: any, entry: any) {
  console.log('📢 Mention event:', value);
  // Handle when the Instagram account is mentioned
}

/**
 * Handle Instagram story insights events
 */
async function handleStoryInsightsEvent(value: any, entry: any) {
  console.log('📊 Story insights event:', value);
  // Handle story metrics and insights
}

/**
 * Handle Instagram direct messages
 */
async function handleDirectMessage(messaging: any, entry: any) {
  console.log('📩 Direct message received:', messaging.message);
  
  // For InstaSave: Could automatically respond with help information
  // or usage instructions when users message the account
}

/**
 * Handle Instagram postback events
 */
async function handlePostback(messaging: any, entry: any) {
  console.log('🔄 Postback received:', messaging.postback);
  // Handle button clicks or quick replies
}

/**
 * Handle Instagram message read events
 */
async function handleMessageRead(messaging: any, entry: any) {
  console.log('👁️ Message read:', messaging.read);
  // Handle message read receipts
}
