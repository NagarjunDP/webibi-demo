import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  try {
    // 1. Authenticate Admin Request
    const session = getSessionFromRequest(req);
    const adminPhone = process.env.ADMIN_PHONE || '+16505553434';

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
    const now = Date.now();

    let demosList: any[] = [];
    let opensList: any[] = [];

    if (firebaseInitialized && db) {
      const demosSnap = await db.collection('demos').get();
      demosList = demosSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          generatedAt: data.generatedAt?.toDate ? data.generatedAt.toDate().toISOString() : data.generatedAt,
          expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate().toISOString() : data.expiresAt,
          sentAt: data.sentAt?.toDate ? data.sentAt.toDate().toISOString() : data.sentAt,
        };
      });

      const opensSnap = await db.collection('opens').get();
      opensList = opensSnap.docs.map(doc => doc.data());
    } else {
      demosList = Array.from(mockDb.demos.values())
        .map((demo: any) => ({
          ...demo,
          generatedAt: demo.generatedAt instanceof Date ? demo.generatedAt.toISOString() : demo.generatedAt,
          expiresAt: demo.expiresAt instanceof Date ? demo.expiresAt.toISOString() : demo.expiresAt,
          sentAt: demo.sentAt instanceof Date ? demo.sentAt.toISOString() : demo.sentAt,
        }));
      opensList = mockDb.opens;
    }

    // Sort demos by generatedAt desc
    demosList.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

    // Aggregate open counts by slug
    const opensMap: Record<string, number> = {};
    opensList.forEach((open: any) => {
      opensMap[open.demoSlug] = (opensMap[open.demoSlug] || 0) + 1;
    });

    const results = demosList.map(demo => {
      const expiresAtMs = new Date(demo.expiresAt).getTime();
      return {
        ...demo,
        expired: expiresAtMs < now,
        opensCount: opensMap[demo.slug] || 0,
      };
    });

    return NextResponse.json({ success: true, demos: results });
  } catch (error: any) {
    console.error('Error in admin-demos API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
