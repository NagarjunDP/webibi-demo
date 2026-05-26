/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageResponse } from 'next/og';
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const { db, mockDb, firebaseInitialized } = getFirebaseAdmin();

    let businessName = "webibi.tech";
    let tagline = "AI-powered demo websites";
    let primaryColor = "#7c5cfc";
    let logoUrl = null;

    let found = false;

    if (firebaseInitialized && db) {
      const docRef = db.collection('demos').doc(slug);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data();
        if (data) {
          businessName = data.businessName || businessName;
          primaryColor = data.primaryColor || primaryColor;
          logoUrl = data.logoUrl || null;
          tagline = `${data.industry || 'Local Business'} in ${data.city || 'your city'}`;
          found = true;
        }
      }
    } else {
      const data = mockDb.demos.get(slug);
      if (data) {
        businessName = data.businessName || businessName;
        primaryColor = data.primaryColor || primaryColor;
        logoUrl = data.logoUrl || null;
        tagline = `${data.industry || 'Local Business'} in ${data.city || 'your city'}`;
        found = true;
      }
    }

    if (!found) {
      businessName = "Webibi Demo";
      tagline = "This demo has expired or does not exist.";
      primaryColor = "#1a1a2e";
    }

    const response = new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: primaryColor,
            backgroundImage: 'linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
            color: 'white',
            textAlign: 'center',
            padding: '40px',
            position: 'relative'
          }}
        >
          {logoUrl ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '24px',
                marginBottom: '40px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
              }}
            >
              {/* Using native img tag for vercel/og */}
              <img src={logoUrl} width="160" height="160" style={{ objectFit: 'contain' }} alt="Logo" />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '24px',
                marginBottom: '40px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                width: 160,
                height: 160,
                fontSize: 64,
                color: primaryColor,
                fontWeight: 'bold'
              }}
            >
              {businessName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div
            style={{
              fontSize: 32,
              fontStyle: 'normal',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: 16,
              textShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}
          >
            {businessName}
          </div>
          
          <div
            style={{
              fontSize: 18,
              fontStyle: 'normal',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.85)',
              textShadow: '0 2px 5px rgba(0,0,0,0.5)',
            }}
          >
            {tagline}
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.05em',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            ✨ Free Demo by webibi.tech
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    response.headers.set('Content-Type', 'image/png');
    response.headers.set('Cache-Control', 'public, max-age=3600');
    return response;
  } catch (error: any) {
    console.error("OG Image generation failed, returning fallback brand image:", error);
    try {
      const fallbackResponse = new ImageResponse(
        (
          <div style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #070d1a, #0b1425)',
            flexDirection: 'column',
            fontFamily: 'sans-serif',
            color: 'white',
            textAlign: 'center',
            position: 'relative'
          }}>
            {/* Glowing blobs */}
            <div style={{
              position: 'absolute',
              top: '-150px',
              right: '-150px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'rgba(124, 58, 237, 0.15)',
              filter: 'blur(80px)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-150px',
              left: '-150px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'rgba(37, 99, 235, 0.12)',
              filter: 'blur(80px)'
            }} />
            
            <div style={{
              display: 'flex',
              fontSize: '84px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '16px'
            }}>
              webibi.
            </div>
            
            <div style={{
              fontSize: '28px',
              color: '#94a3b8',
              maxWidth: '600px',
              fontWeight: 500
            }}>
              Your Business Website in 20 Seconds
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 500,
              color: '#64748b',
              letterSpacing: '0.05em',
              borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
              ✨ AI-Powered Demo Builder by webibi.tech
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
      
      fallbackResponse.headers.set('Content-Type', 'image/png');
      fallbackResponse.headers.set('Cache-Control', 'public, max-age=3600');
      return fallbackResponse;
    } catch (fallbackError) {
      console.error("Fallback image generation also failed:", fallbackError);
      return new Response(`Failed to generate the image`, {
        status: 500,
      });
    }
  }
}
