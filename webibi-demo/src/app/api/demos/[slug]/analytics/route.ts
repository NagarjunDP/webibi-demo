/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

interface Props {
  params: {
    slug: string;
  };
}

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
    
    let analyticsData = {
      viewsCount: 0,
      totalMinutes: 0,
      lastActive: null,
      device: 'Unknown',
      firstOpened: null
    };

    if (firebaseInitialized && db) {
      const docSnap = await db.collection('opens').doc(slug).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        if (data) {
          analyticsData = {
            viewsCount: data.viewsCount || 0,
            totalMinutes: data.totalMinutes || 0,
            lastActive: data.lastActive ? (data.lastActive.toDate ? data.lastActive.toDate().toISOString() : new Date(data.lastActive).toISOString()) : null,
            device: data.device || 'Unknown',
            firstOpened: data.firstOpened ? (data.firstOpened.toDate ? data.firstOpened.toDate().toISOString() : new Date(data.firstOpened).toISOString()) : null
          };
        }
      }
    } else {
      const openDoc = mockDb.opens.find((o: any) => o.demoSlug === slug);
      if (openDoc) {
        analyticsData = {
          viewsCount: openDoc.viewsCount || 0,
          totalMinutes: openDoc.totalMinutes || 0,
          lastActive: openDoc.lastActive ? new Date(openDoc.lastActive).toISOString() : null,
          device: openDoc.device || 'Unknown',
          firstOpened: openDoc.firstOpened ? new Date(openDoc.firstOpened).toISOString() : null
        };
      }
    }

    return NextResponse.json({ success: true, analytics: analyticsData });
  } catch (error: any) {
    console.error('Error in demo analytics API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
