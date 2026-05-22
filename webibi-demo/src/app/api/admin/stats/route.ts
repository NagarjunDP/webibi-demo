import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  try {
    // 1. Authenticate Admin Request
    const session = getSessionFromRequest(req);
    const adminPhone = process.env.ADMIN_PHONE || '+16505553434';
    
    console.log("[ADMIN-STATS] session:", session);

    if (!session || session.role !== 'admin') {
      console.log("[ADMIN-STATS] Rejecting request!");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let totalDemos = 0;
    let demosToday = 0;
    let totalOpens = 0;
    let activeDemos = 0;

    if (firebaseInitialized && db) {
      // 1. Total Demos
      const demosSnap = await db.collection('demos').get();
      totalDemos = demosSnap.size;

      // Iterate and count stats to avoid extra index queries
      demosSnap.docs.forEach(doc => {
        const data = doc.data();
        const genAt = data.generatedAt?.toDate ? data.generatedAt.toDate() : new Date(data.generatedAt);
        const expAt = data.expiresAt?.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);

        if (genAt >= todayStart) {
          demosToday++;
        }
        if (expAt.getTime() >= now) {
          activeDemos++;
        }
      });

      // 2. Total Opens
      const opensSnap = await db.collection('opens').get();
      totalOpens = opensSnap.size;
    } else {
      // Mock stats
      const demos = Array.from(mockDb.demos.values());
      totalDemos = demos.length;

      demos.forEach((demo: any) => {
        const genAt = new Date(demo.generatedAt);
        const expAt = new Date(demo.expiresAt);

        if (genAt >= todayStart) {
          demosToday++;
        }
        if (expAt.getTime() >= now) {
          activeDemos++;
        }
      });

      totalOpens = mockDb.opens.length;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalDemos,
        demosToday,
        totalOpens,
        activeDemos,
      },
    });
  } catch (error: any) {
    console.error('Error in admin-stats API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
