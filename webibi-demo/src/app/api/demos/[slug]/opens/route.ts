import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

interface Props {
  params: {
    slug: string;
  };
}

// Helper to detect device from user agent
function detectDevice(userAgent: string): string {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) {
    return 'Tablet';
  }
  if (/mobi|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'Mobile';
  }
  return 'Desktop';
}

// GET: Returns open count for a demo
export async function GET(req: Request, { params }: Props) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
    let count = 0;

    if (firebaseInitialized && db) {
      const opensSnap = await db.collection('opens')
        .where('demoSlug', '==', slug)
        .get();
      count = opensSnap.size;
    } else {
      count = mockDb.opens.filter((open: any) => open.demoSlug === slug).length;
    }

    return NextResponse.json({ success: true, slug, count });
  } catch (error: any) {
    console.error('Error in get-opens API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST: Public endpoint to log a prospect view
export async function POST(req: Request, { params }: Props) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || '';
    let requestDevice = '';
    
    try {
      const body = await req.json().catch(() => ({}));
      requestDevice = body.device;
    } catch (e) {
      // Body reading might fail or be empty, ignore
    }

    const device = requestDevice || detectDevice(userAgent);
    const openedAt = new Date();

    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();

    // 1. Fetch demo info to get businessName and agentPhone
    let demo: any = null;
    if (firebaseInitialized && db) {
      const docSnap = await db.collection('demos').doc(slug).get();
      if (docSnap.exists) {
        demo = docSnap.data();
      }
    } else {
      demo = mockDb.demos.get(slug);
    }

    if (!demo) {
      return NextResponse.json({ error: 'Demo not found' }, { status: 404 });
    }

    // 2. Log the open event
    const openDoc = {
      demoSlug: slug,
      businessName: demo.businessName,
      agentPhone: demo.agentPhone,
      openedAt,
      device,
      userAgent: userAgent.substring(0, 500), // Limit length
    };

    if (firebaseInitialized && db) {
      await db.collection('opens').add(openDoc);
    } else {
      mockDb.opens.push(openDoc);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in post-open API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
