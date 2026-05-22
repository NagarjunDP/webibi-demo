import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
    const sentAt = new Date();

    if (firebaseInitialized && db) {
      // Check if demo belongs to the agent
      const docRef = db.collection('demos').doc(slug);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json({ error: 'Demo not found' }, { status: 404 });
      }

      const demo = docSnap.data();
      if (demo?.agentPhone !== session.phoneNumber) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      await docRef.update({
        sentViaWhatsApp: true,
        sentAt: sentAt,
      });
    } else {
      const demo = mockDb.demos.get(slug);
      if (!demo) {
        return NextResponse.json({ error: 'Demo not found' }, { status: 404 });
      }

      if (demo.agentPhone !== session.phoneNumber) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      demo.sentViaWhatsApp = true;
      demo.sentAt = sentAt;
      mockDb.demos.set(slug, demo);
    }

    return NextResponse.json({ success: true, sentAt });
  } catch (error: any) {
    console.error('Error in share-demo API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
