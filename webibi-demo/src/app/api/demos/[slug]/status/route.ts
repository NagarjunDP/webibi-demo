import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

interface Props {
  params: {
    slug: string;
  };
}

export async function GET(req: Request, { params }: Props) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
    let demo: any = null;

    if (firebaseInitialized && db) {
      const docSnap = await db.collection('demos').doc(slug).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        demo = {
          ...data,
          expiresAt: data?.expiresAt?.toDate ? data.expiresAt.toDate() : data?.expiresAt,
        };
      }
    } else {
      demo = mockDb.demos.get(slug);
    }

    if (!demo) {
      return NextResponse.json({ expired: true, error: 'Demo not found' }, { status: 404 });
    }

    const expiresAt = new Date(demo.expiresAt);
    const expired = expiresAt.getTime() < Date.now();

    return NextResponse.json({
      expired,
      expiresAt: expiresAt.toISOString(),
      businessName: demo.businessName,
    });
  } catch (error: any) {
    console.error('Error in status API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
