import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import fs from 'fs';
import path from 'path';

interface Props {
  params: {
    slug: string;
  };
}

export async function GET(req: Request, { params }: Props) {
  try {
    const { slug } = params;
    if (!slug) {
      return new NextResponse('Slug is required', { status: 400 });
    }

    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
    let htmlContent = '';

    // 1. Try to fetch from database
    if (firebaseInitialized && db) {
      const docSnap = await db.collection('demos').doc(slug).get();
      if (docSnap.exists) {
        htmlContent = docSnap.data()?.html || '';
      }
    } else {
      const demo = mockDb.demos.get(slug);
      if (demo) {
        htmlContent = demo.html || '';
      }
    }

    // 2. Fallback to local filesystem if database doesn't have it (e.g. pre-existing demos)
    if (!htmlContent) {
      try {
        const filePath = path.join(process.cwd(), 'public', 'demos', `${slug}.html`);
        if (fs.existsSync(filePath)) {
          htmlContent = fs.readFileSync(filePath, 'utf8');
        }
      } catch (fsErr) {
        console.error('File read error:', fsErr);
      }
    }

    if (!htmlContent) {
      return new NextResponse('Demo website not found', { status: 404 });
    }

    // 3. Return the HTML directly with correct content-type
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('Error in HTML dynamic route:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
