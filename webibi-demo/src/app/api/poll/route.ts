import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/authSession';

export async function GET(req: Request) {
  try {
    // 1. Authenticate Request
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Deployment ID is required' }, { status: 400 });
    }

    // If mock ID
    if (id.startsWith('mock_dep_')) {
      return NextResponse.json({
        id,
        readyState: 'READY',
        status: 'READY',
      });
    }

    const vercelToken = process.env.VERCEL_TOKEN;
    if (!vercelToken) {
      return NextResponse.json({ error: 'VERCEL_TOKEN is not configured' }, { status: 500 });
    }

    // 2. Fetch Vercel Status
    const response = await fetch(`https://api.vercel.com/v13/deployments/${id}`, {
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Failed to poll deployment: ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in poll API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
