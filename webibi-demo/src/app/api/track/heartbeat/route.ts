/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, businessName, timestamp } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || '';
    const device = detectDevice(userAgent);
    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();

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

    const agentPhone = demo.agentPhone || '';
    const now = timestamp ? new Date(timestamp) : new Date();

    if (firebaseInitialized && db) {
      const openRef = db.collection('opens').doc(slug);
      
      try {
        await db.runTransaction(async (t: any) => {
          const doc = await t.get(openRef);
          if (!doc.exists) {
            t.set(openRef, {
              demoSlug: slug,
              businessName: businessName || demo.businessName,
              agentPhone: agentPhone,
              totalMinutes: 0.5,
              viewsCount: 1,
              lastActive: now,
              device: device,
              firstOpened: now
            });
          } else {
            const data = doc.data();
            // A basic check to see if this is a new view or just a heartbeat
            // If the last active was more than 30 mins ago, count it as a new view
            const lastActiveDate = data.lastActive?.toDate ? data.lastActive.toDate() : new Date(data.lastActive);
            const isNewView = (now.getTime() - lastActiveDate.getTime()) > (30 * 60 * 1000);
            
            t.update(openRef, {
              totalMinutes: (data.totalMinutes || 0) + 0.5,
              lastActive: now,
              viewsCount: isNewView ? (data.viewsCount || 0) + 1 : data.viewsCount,
              device: device // Update to latest device used
            });
          }
        });
      } catch (err: any) {
         console.error('Transaction failed:', err);
      }
    } else {
      // Mock DB handling
      let openDoc = mockDb.opens.find((o: any) => o.demoSlug === slug);
      if (!openDoc) {
        openDoc = {
          demoSlug: slug,
          businessName: businessName || demo.businessName,
          agentPhone: agentPhone,
          totalMinutes: 0.5,
          viewsCount: 1,
          lastActive: now,
          device: device,
          firstOpened: now
        };
        mockDb.opens.push(openDoc);
      } else {
        const lastActiveDate = new Date(openDoc.lastActive);
        const isNewView = (now.getTime() - lastActiveDate.getTime()) > (30 * 60 * 1000);
        openDoc.totalMinutes += 0.5;
        openDoc.lastActive = now;
        if (isNewView) openDoc.viewsCount += 1;
        openDoc.device = device;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in heartbeat API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
