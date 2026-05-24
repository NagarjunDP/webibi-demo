import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
    let count = 0;

    if (firebaseInitialized && db) {
      // Check for unlimitedGeneration flag on the user doc
      const userDoc = await db.collection('users').doc(session.phoneNumber).get();
      const isUnlimited = userDoc.exists && userDoc.data()?.unlimitedGeneration === true;

      const snapshot = await db.collection('demos')
        .where('agentPhone', '==', session.phoneNumber)
        .get();
      
      count = snapshot.size;

      if (isUnlimited) {
        return NextResponse.json({ count, limit: 'unlimited', remaining: 'unlimited' });
      }
    } else {
      // Mock DB logic
      const demosList = Array.from(mockDb.demos.values()).filter((d: any) => d.agentPhone === session.phoneNumber);
      count = demosList.length;
    }

    const limit = 3;
    const remaining = Math.max(0, limit - count);

    return NextResponse.json({ count, limit, remaining, success: true });
  } catch (error: any) {
    console.error('Error fetching demo count:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
