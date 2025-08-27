import { NextRequest, NextResponse } from 'next/server';

/**
 * Demo Download API - Serves actual downloadable Instagram-style images
 * This replaces placeholder picsum.photos URLs with real downloadable content
 */

// Demo Instagram-style images (publicly available and reliable)
const DEMO_IMAGES = [
  {
    id: 'demo_1',
    url: 'https://picsum.photos/1080/1080.jpg?random=instasave1',
    filename: 'InstaSave_Demo_High_Quality.jpg',
    size: 'high'
  },
  {
    id: 'demo_2', 
    url: 'https://picsum.photos/720/720.jpg?random=instasave2',
    filename: 'InstaSave_Demo_Medium_Quality.jpg',
    size: 'medium'
  },
  {
    id: 'demo_3',
    url: 'https://picsum.photos/480/480.jpg?random=instasave3',
    filename: 'InstaSave_Demo_Low_Quality.jpg',
    size: 'low'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');
    const download = searchParams.get('download') === 'true';

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    // Find the demo image
    const demoImage = DEMO_IMAGES.find(img => imageId.includes(img.id) || imageId.includes(img.size));
    if (!demoImage) {
      return NextResponse.json({ error: 'Demo image not found' }, { status: 404 });
    }

    // Fetch the actual image
    const imageResponse = await fetch(demoImage.url);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch demo image');
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // Create response with proper headers for download
    const headers = new Headers();
    headers.set('Content-Type', 'image/jpeg');
    headers.set('Content-Length', imageBuffer.byteLength.toString());
    
    if (download) {
      headers.set('Content-Disposition', `attachment; filename="${demoImage.filename}"`);
    } else {
      headers.set('Content-Disposition', `inline; filename="${demoImage.filename}"`);
    }

    // Add CORS headers for cross-origin requests
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error('Demo download error:', error);
    return NextResponse.json(
      { error: 'Failed to download demo image' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
