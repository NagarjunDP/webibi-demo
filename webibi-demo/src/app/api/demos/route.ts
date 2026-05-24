/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  try {
    // 1. Authenticate Request
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
    const now = Date.now();

    let demosList: any[] = [];
    let opensList: any[] = [];

    if (firebaseInitialized && db) {
      // Fetch demos for agent
      const demosSnap = await db.collection('demos')
        .where('agentPhone', '==', session.phoneNumber)
        .get();
      
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

      // Fetch opens for agent
      const opensSnap = await db.collection('opens')
        .where('agentPhone', '==', session.phoneNumber)
        .get();
      
      opensList = opensSnap.docs.map(doc => doc.data());
    } else {
      // Mock mode
      demosList = Array.from(mockDb.demos.values())
        .filter((demo: any) => demo.agentPhone === session.phoneNumber)
        .map((demo: any) => ({
          ...demo,
          generatedAt: demo.generatedAt instanceof Date ? demo.generatedAt.toISOString() : demo.generatedAt,
          expiresAt: demo.expiresAt instanceof Date ? demo.expiresAt.toISOString() : demo.expiresAt,
          sentAt: demo.sentAt instanceof Date ? demo.sentAt.toISOString() : demo.sentAt,
        }));
      
      opensList = mockDb.opens.filter((open: any) => open.agentPhone === session.phoneNumber);
    }

    // Sort demos by generatedAt desc
    demosList.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

    // Helper to get time safely from Timestamp, Date, or string
    const getSafeTime = (val: any) => {
      if (!val) return 0;
      if (val.toDate) return val.toDate().getTime();
      return new Date(val).getTime();
    };

    // Aggregate open analytics by slug
    const analyticsMap: Record<string, any> = {};
    opensList.forEach((open: any) => {
      if (!analyticsMap[open.demoSlug]) {
        analyticsMap[open.demoSlug] = {
           viewsCount: open.viewsCount || 1,
           totalMinutes: open.totalMinutes || 0,
           lastActive: open.lastActive,
           device: open.device || 'Unknown',
           firstOpened: open.firstOpened
        };
      } else {
        // Fallback if there are still multiple docs (legacy schema)
        analyticsMap[open.demoSlug].viewsCount += (open.viewsCount || 1);
        analyticsMap[open.demoSlug].totalMinutes += (open.totalMinutes || 0);
        if (getSafeTime(open.lastActive) > getSafeTime(analyticsMap[open.demoSlug].lastActive)) {
           analyticsMap[open.demoSlug].lastActive = open.lastActive;
           analyticsMap[open.demoSlug].device = open.device;
        }
      }
    });

    // Map results with open count and expiration flag
    const results = demosList.map(demo => {
      const expiresAtMs = new Date(demo.expiresAt).getTime();
      const analytics = analyticsMap[demo.slug] || { viewsCount: 0, totalMinutes: 0, device: 'Unknown', lastActive: null, firstOpened: null };
      
      const safeIsoString = (val: any) => {
        if (!val) return null;
        try {
          if (val.toDate) return val.toDate().toISOString();
          return new Date(val).toISOString();
        } catch(e) {
          return null;
        }
      };

      return {
        ...demo,
        expired: expiresAtMs < now,
        opensCount: analytics.viewsCount,
        totalMinutes: analytics.totalMinutes,
        lastActive: safeIsoString(analytics.lastActive),
        device: analytics.device,
        firstOpened: safeIsoString(analytics.firstOpened)
      };
    });

    return NextResponse.json({ success: true, demos: results });
  } catch (error: any) {
    console.error('Error in get-demos API:', error.stack || error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
