import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { getSessionFromRequest } from '@/lib/authSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const vercelToken = process.env.VERCEL_TOKEN;
    if (!vercelToken) {
      console.warn("VERCEL_TOKEN is missing. Operating in MOCK deployment mode.");
    }

    // 2. Read Zip Buffer and Parse Files
    const arrayBuffer = await req.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const files: any[] = [];

    for (const [relativePath, fileObj] of Object.entries(zip.files)) {
      if (fileObj.dir) continue;
      const base64Data = await fileObj.async('base64');
      files.push({
        file: relativePath,
        data: base64Data,
        encoding: 'base64',
      });
    }

    let liveUrl = '';
    let deploymentId = '';

    if (vercelToken) {
      // 3. POST to Vercel Deployments API
      const projectName = process.env.VERCEL_PROJECT_NAME || 'auto-webibi';
      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          files: files,
          projectSettings: {
            framework: null,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Vercel deployment failed:", errText);
        return NextResponse.json({ error: `Vercel deployment failed: ${errText}` }, { status: response.status });
      }

      const data = await response.json();
      deploymentId = data.id;
      liveUrl = `https://${data.url}`;
    } else {
      // Mock Deployment url if VERCEL_TOKEN is not defined
      deploymentId = `mock_dep_${Math.random().toString(36).substring(2, 9)}`;
      // For local testing, we can serve from the local next.js server /slug directly
      const host = req.headers.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") ? "http" : "https";
      liveUrl = `${protocol}://${host}/${slug}`;
    }

    // 4. Update liveUrl in Firestore/MockDb
    const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
    if (firebaseInitialized && db) {
      await db.collection('demos').doc(slug).update({
        liveUrl: liveUrl,
      });
    } else {
      const demo = mockDb.demos.get(slug);
      if (demo) {
        demo.liveUrl = liveUrl;
        mockDb.demos.set(slug, demo);
      }
    }

    return NextResponse.json({
      success: true,
      url: liveUrl,
      id: deploymentId,
      mock: !vercelToken,
    });
  } catch (error: any) {
    console.error('Error in deploy API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
