import { notFound, redirect } from "next/navigation";
import { Metadata } from 'next';
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

export const dynamic = 'force-dynamic';


interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  if (!slug) return {};

  const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
  let businessName = "webibi.tech";
  let tagline = "AI-powered demo website";
  let found = false;

  // Try to query Firebase Database
  if (firebaseInitialized && db) {
    try {
      const docSnap = await db.collection('demos').doc(slug).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        if (data) {
          businessName = data.businessName || businessName;
          tagline = data.tagline || `${data.industry ? data.industry.charAt(0).toUpperCase() + data.industry.slice(1) : 'Local Business'} in ${data.city || 'your city'}`;
          found = true;
        }
      }
    } catch (e) {
      console.error("Error fetching demo metadata:", e);
    }
  }

  // Fallback to memory Mock Database
  if (!found) {
    const data = mockDb.demos.get(slug);
    if (data) {
      businessName = data.businessName || businessName;
      tagline = data.tagline || `${data.industry ? data.industry.charAt(0).toUpperCase() + data.industry.slice(1) : 'Local Business'} in ${data.city || 'your city'}`;
      found = true;
    }
  }

  if (!found) {
    return {
      title: "Webibi Demo",
      description: "This website demo is ready."
    };
  }

  const absoluteOgUrl = `https://demo.webibi.tech/api/og/${slug}`;

  return {
    title: `${businessName} | Live Demo Website`,
    description: `${tagline} — Click to view this stunning live demo website built in seconds by Webibi.`,
    openGraph: {
      title: `${businessName} | Live Demo Website`,
      description: `${tagline} — Click to view this stunning live demo website built in seconds by Webibi.`,
      url: `https://demo.webibi.tech/${slug}`,
      siteName: 'Webibi',
      images: [
        {
          url: absoluteOgUrl,
          width: 1200,
          height: 630,
          alt: `${businessName} Live Demo Website`,
        }
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${businessName} | Live Demo Website`,
      description: `${tagline} — Click to view this stunning live demo website built in seconds by Webibi.`,
      images: [absoluteOgUrl],
    },
  };
}

export default async function GeneratedSitePage({ params }: PageProps) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  const { db, firebaseInitialized, mockDb } = getFirebaseAdmin();
  let liveUrl = '';
  let found = false;

  // Try to query Firebase Database
  if (firebaseInitialized && db) {
    try {
      const docSnap = await db.collection('demos').doc(slug).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        if (data) {
          liveUrl = data.liveUrl || '';
          found = true;
        }
      }
    } catch (e) {
      console.error("Error fetching demo:", e);
    }
  }

  // Fallback to memory Mock Database
  if (!found) {
    const data = mockDb.demos.get(slug);
    if (data) {
      liveUrl = data.liveUrl || '';
      found = true;
    }
  }

  if (!found) {
    notFound();
  }

  // If liveUrl is defined, is an absolute URL (starts with http) and is not a loop redirect back to demo.webibi.tech/[slug], redirect to Vercel!
  if (liveUrl && liveUrl.startsWith('http') && !liveUrl.includes(`demo.webibi.tech/${slug}`)) {
    redirect(liveUrl);
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      zIndex: 999999
    }}>
      <iframe 
        src={`/api/demos/${slug}/html`} 
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block'
        }}
        title={`${slug} Demo Website`}
      />
    </div>
  );
}
