import { ImageResponse } from 'next/og';
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

export const dynamic = 'force-dynamic';


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
            backgroundColor: primaryColor,
            backgroundImage: 'linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.95))',
            color: 'white',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px',
            width: '50%',
            height: '100%',
          }}>
            <div style={{
               fontSize: 72,
               fontWeight: 900,
               letterSpacing: '-0.02em',
               marginBottom: 24,
               lineHeight: 1.1,
               textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              {businessName}
            </div>
            <div style={{
               fontSize: 32,
               color: 'rgba(255,255,255,0.85)',
               lineHeight: 1.4,
               fontWeight: 500
            }}>
              {tagline}
            </div>
            
            <div style={{ display: 'flex', marginTop: 'auto' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '16px 24px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ fontSize: 24, fontWeight: 600, color: '#38bdf8' }}>✨ Live Demo by webibi.tech</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{
            display: 'flex',
            width: '50%',
            height: '100%',
            backgroundColor: '#f8fafc',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '-20px 0 60px rgba(0,0,0,0.6)'
          }}>
            {/* Decorative background elements so it never looks empty */}
            <div style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '300px',
              backgroundColor: primaryColor,
              opacity: 0.1,
              top: '-150px',
              right: '-150px',
            }} />
            
            <div style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '200px',
              backgroundColor: primaryColor,
              opacity: 0.15,
              bottom: '-100px',
              left: '-100px',
            }} />

            {logoUrl ? (
               <img src={logoUrl} style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 10 }} alt="Logo" />
            ) : (
               <div style={{ 
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 width: '280px', 
                 height: '280px', 
                 backgroundColor: 'white',
                 borderRadius: '60px',
                 boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                 fontSize: 140, 
                 color: primaryColor, 
                 fontWeight: 900,
                 zIndex: 10
               }}>
                 {businessName.charAt(0).toUpperCase()}
               </div>
            )}
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
