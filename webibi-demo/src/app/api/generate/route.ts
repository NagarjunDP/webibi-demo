/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { getSessionFromRequest } from "@/lib/authSession";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

const NICHES = ['restaurant', 'salon', 'gym', 'clinic', 'events', 'law', 'realestate', 'education', 'hotel'];

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db, bucket, firebaseInitialized, mockDb } = getFirebaseAdmin();

    // 1a. Limit Enforcement
    if (firebaseInitialized && db) {
      const userDoc = await db.collection('users').doc(session.phoneNumber).get();
      const isUnlimited = userDoc.exists && userDoc.data()?.unlimitedGeneration === true;
      console.log(`[GENERATE DEBUG] user: ${session.phoneNumber}, docExists: ${userDoc.exists}, data:`, userDoc.exists ? userDoc.data() : null, `isUnlimited: ${isUnlimited}`);

      const demosSnap = await db.collection('demos')
        .where('agentPhone', '==', session.phoneNumber)
        .get();
        
      if (!isUnlimited && demosSnap.size >= 3) {
        return NextResponse.json({
          error: 'LIMIT_REACHED',
          message: 'You have reached the maximum of 3 free demo generations. Contact webibi.tech to upgrade.'
        }, { status: 403 });
      }
    } else {
      const demosList = Array.from(mockDb.demos.values()).filter((d: any) => d.agentPhone === session.phoneNumber);
      if (demosList.length >= 3) {
        return NextResponse.json({
          error: 'LIMIT_REACHED',
          message: 'You have reached the maximum of 3 free demo generations. Contact webibi.tech to upgrade.'
        }, { status: 403 });
      }
    }

    const body = await req.json();
    const { name, industry, city, tagline, phone, primaryColor, logoDataUrl, extractedColors } = body;

    if (!name || !city) {
      return NextResponse.json({ error: "Business name and city are required" }, { status: 400 });
    }

    const indKey = (industry || '').toLowerCase().trim();
    const activeIndustry = NICHES.includes(indKey) ? indKey : 'clinic';

    // 2. Generate Unique Slug (Conflict Prevention)
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""); // trim hyphens
    
    let slug = baseSlug || "demo-business";
    let counter = 1;
    let exists = true;

    while (exists) {
      let docExists = false;
      if (firebaseInitialized && db) {
        const docRef = db.collection('demos').doc(slug);
        const docSnap = await docRef.get();
        docExists = docSnap.exists;
      } else {
        docExists = mockDb.demos.has(slug);
      }

      if (docExists) {
        counter++;
        slug = `${baseSlug}-${counter}`;
      } else {
        exists = false;
      }
    }

    // 3. Logo Upload Handling (Firebase Storage with Local Fallback)
    let logoUrl = '';
    if (logoDataUrl && logoDataUrl.startsWith('data:')) {
      const matches = logoDataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const extension = contentType.split('/')[1] || 'png';
        const storagePath = `logos/${slug}.${extension}`;

        if (firebaseInitialized && bucket) {
          try {
            const file = bucket.file(storagePath);
            await file.save(buffer, {
              metadata: { contentType },
              public: true
            });
            // Public Google Cloud Storage URL
            logoUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
          } catch (storageErr: any) {
            console.error("Firebase Storage write error, using local fallback:", storageErr.message);
          }
        }

        if (!logoUrl) {
          try {
            const publicLogosDir = path.join(process.cwd(), 'public', 'logos');
            if (!fs.existsSync(publicLogosDir)) {
              fs.mkdirSync(publicLogosDir, { recursive: true });
            }
            fs.writeFileSync(path.join(publicLogosDir, `${slug}.${extension}`), buffer);
            logoUrl = `/logos/${slug}.${extension}`;
          } catch (fsErr: any) {
            console.error("Local logos write error:", fsErr.message);
            logoUrl = logoDataUrl; // Fallback to raw base64 if local write also fails
          }
        }
      }
    }

    // 4. Setup Colors
    const colorPrimary = primaryColor || (extractedColors && extractedColors[0]) || "#7c5cfc";
    const colorSecondary = (extractedColors && extractedColors[1]) || colorPrimary;
    const colorTertiary = (extractedColors && extractedColors[2]) || colorSecondary;

    // 5. Mock Google Places ratings (as requested: remove Places API completely)
    const rating = "4.8";
    const reviewCount = (Math.floor(Math.random() * 220) + 80).toString();
    const topReview = `Absolutely love this place. Best in ${city} hands down. The staff is incredible and the quality is unmatched.`;

    // 6. Fallback copywriting
    const fallbackCopy = {
      tagline: tagline || `The best choice in ${city}`,
      hero_headline: `Redefining Excellence in ${city}`,
      hero_sub: `Experience unmatched quality and dedication crafted specifically for you.`,
      about_text: `We are deeply rooted in ${city}, bringing years of passion and expertise to our community. Our commitment to your satisfaction drives everything we do.`,
      cta: `Call Now`,
      reviews: [
        { name: "Rahul Sharma", review: "Absolutely wonderful experience. Highly recommended!" },
        { name: "Priya Patel", review: "Great service and very professional staff." },
        { name: "Amit Kumar", review: "Best in the city, will definitely visit again." }
      ]
    };

    let copy = fallbackCopy;

    // 7. Gemini AI Copywriting
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'dummy') {
      const prompt = `You are a professional local business copywriter. Reply ONLY with a clean JSON object, no markdown block syntax, no explanation, no headers.
      
Business Name: ${name}
Industry/Niche: ${industry || 'local business'}
City: ${city}
Google Rating: ${rating}/5 (${reviewCount} reviews)

Return exactly this JSON structure:
{
  "tagline": "5-7 word punchy tagline",
  "hero_headline": "8-12 word hero headline",
  "hero_sub": "one sentence benefit statement, max 18 words",
  "about_text": "two sentences about the business, warm and local, max 35 words",
  "cta": "3-word call to action button text",
  "reviews": [
    { "name": "Indian Name 1", "review": "1-2 sentence realistic review" },
    { "name": "Indian Name 2", "review": "1-2 sentence realistic review" },
    { "name": "Indian Name 3", "review": "1-2 sentence realistic review" }
  ]
}`;

      try {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
          })
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          text = text.trim();
          if (text.startsWith('```')) {
            text = text.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '').trim();
          }
          const aiJson = JSON.parse(text);
          copy = {
            tagline: aiJson.tagline || fallbackCopy.tagline,
            hero_headline: aiJson.hero_headline || fallbackCopy.hero_headline,
            hero_sub: aiJson.hero_sub || fallbackCopy.hero_sub,
            about_text: aiJson.about_text || fallbackCopy.about_text,
            cta: aiJson.cta || fallbackCopy.cta,
            reviews: (aiJson.reviews && aiJson.reviews.length === 3) ? aiJson.reviews : fallbackCopy.reviews
          };
        } else {
          console.warn("Gemini API returned error:", geminiRes.status);
        }
      } catch (err: any) {
        console.error("Gemini copywriting request failed:", err.message);
      }
    }

    // 8. Select Niche HTML Template
    const templatesDir = path.join(process.cwd(), 'templates');
    const templatePath = path.join(templatesDir, `shell-${activeIndustry}.html`);
    let templateHtml = fs.readFileSync(templatePath, 'utf8');

    // 9. Static Images Mappings
    const imgSet = Math.floor(Math.random() * 5) + 1;
    const imgHero = `/assets/${activeIndustry}/hero-${imgSet}.jpg`;
    const imgSection = `/assets/${activeIndustry}/section-${imgSet}.jpg`;
    const imgGallery1 = `/assets/${activeIndustry}/gallery1-${imgSet}.jpg`;
    const imgGallery2 = `/assets/${activeIndustry}/gallery2-${imgSet}.jpg`;
    const imgGallery3 = `/assets/${activeIndustry}/gallery3-${imgSet}.jpg`;

    const variants = ['variant-a', 'variant-b', 'variant-c', 'variant-d', 'variant-e'];
    const layoutVariant = variants[Math.floor(Math.random() * variants.length)];
    const businessInitials = name.trim().slice(0, 2).toUpperCase() || 'WB';

    const badgeMap: Record<string, string> = {
      restaurant: '🍽 Restaurant',
      salon: '💆 Salon & Beauty',
      gym: '💪 Gym & Fitness',
      clinic: '🩺 Medical Clinic',
      events: '🎉 Event Venue',
    };
    const industryBadge = badgeMap[activeIndustry] || '💼 Business';
    const agencyPhone = process.env.AGENCY_PHONE || '+919876543210';
    const agencyWhatsapp = process.env.AGENCY_WHATSAPP_NUMBER || '919876543210';

    let logoEscaped = logoUrl || '';
    if (logoEscaped) {
      logoEscaped = logoEscaped.replaceAll('"', "'");
    }

    const generatedAt = new Date();
    const expiresAt = new Date(generatedAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later
    const expiryTimestamp = expiresAt.getTime().toString();
    const businessNameEncoded = encodeURIComponent(name);

    // 10. Inject Variables & Tokens
    let htmlOutput = templateHtml
      .replaceAll('{{BUSINESS_NAME}}', name)
      .replaceAll('{{BUSINESS_NAME_ENCODED}}', businessNameEncoded)
      .replaceAll('{{SLUG}}', slug)
      .replaceAll('{{EXPIRY_TIMESTAMP}}', expiryTimestamp)
      .replaceAll('{{AGENCY_PHONE}}', agencyPhone)
      .replaceAll('{{AGENCY_WHATSAPP_NUMBER}}', agencyWhatsapp)
      .replaceAll('{{REVIEW_1_NAME}}', copy.reviews[0].name)
      .replaceAll('{{REVIEW_1_INITIAL}}', copy.reviews[0].name.charAt(0))
      .replaceAll('{{REVIEW_1_TEXT}}', copy.reviews[0].review)
      .replaceAll('{{REVIEW_2_NAME}}', copy.reviews[1].name)
      .replaceAll('{{REVIEW_2_INITIAL}}', copy.reviews[1].name.charAt(0))
      .replaceAll('{{REVIEW_2_TEXT}}', copy.reviews[1].review)
      .replaceAll('{{REVIEW_3_NAME}}', copy.reviews[2].name)
      .replaceAll('{{REVIEW_3_INITIAL}}', copy.reviews[2].name.charAt(0))
      .replaceAll('{{REVIEW_3_TEXT}}', copy.reviews[2].review)
      .replaceAll('{{HERO_HEADLINE}}', copy.hero_headline)
      .replaceAll('{{HERO_SUBLINE}}', copy.hero_sub)
      .replaceAll('{{TAGLINE}}', copy.tagline)
      .replaceAll('{{ABOUT_TEXT}}', copy.about_text)
      .replaceAll('{{CTA_TEXT}}', copy.cta)
      .replaceAll('{{FOOTER_TAGLINE}}', copy.tagline)
      .replaceAll('{{PHONE}}', phone || '')
      .replaceAll('{{CITY}}', city)
      .replaceAll('{{LOGO_URL}}', logoEscaped)
      .replaceAll('{{COLOR_PRIMARY}}', colorPrimary)
      .replaceAll('{{COLOR_SECONDARY}}', colorSecondary)
      .replaceAll('{{COLOR_TERTIARY}}', colorTertiary)
      .replaceAll('{{IMG_HERO}}', imgHero)
      .replaceAll('{{IMG_SECTION}}', imgSection)
      .replaceAll('{{IMG_GALLERY1}}', imgGallery1)
      .replaceAll('{{IMG_GALLERY2}}', imgGallery2)
      .replaceAll('{{IMG_GALLERY3}}', imgGallery3)
      .replaceAll('{{GOOGLE_RATING}}', rating)
      .replaceAll('{{REVIEW_COUNT}}', reviewCount)
      .replaceAll('{{TOP_REVIEW}}', topReview)
      .replaceAll('{{HERO_LAYOUT_CLASS}}', layoutVariant)
      .replaceAll('{{LAYOUT_VARIANT}}', layoutVariant)
      .replaceAll('{{IMG_SET}}', imgSet.toString())
      .replaceAll('{{BUSINESS_INITIALS}}', businessInitials)
      .replaceAll('{{INDUSTRY_BADGE}}', industryBadge)
      .replaceAll('{{INDUSTRY}}', activeIndustry);

    // 11. Inject Expiration & Tracking Script into HTML Page
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const mainAppUrl = `${protocol}://${host}`;

    const trackingScript = `
  <!-- Tracking and Expiration System -->
  <script>
    (async function() {
      const slug = "${slug}";
      const mainAppUrl = "${mainAppUrl}";
      try {
        // 1. Check expiration status
        const statusRes = await fetch(mainAppUrl + "/api/demos/" + slug + "/status");
        const statusData = await statusRes.json();
        
        if (statusData.expired) {
          document.body.innerHTML = \`
            <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #0b0b0f; color: #ffffff; text-align: center; padding: 24px;">
              <div style="width: 64px; height: 64px; border-radius: 20px; background: linear-gradient(135deg, #ff416c, #ff4b2b); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(255, 75, 43, 0.2);">
                <span style="font-size: 32px; font-weight: bold;">⚠️</span>
              </div>
              <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 12px 0; tracking: -0.025em;">This demo has expired</h1>
              <p style="color: #8f929d; font-size: 16px; margin: 0; max-width: 320px; line-height: 1.5;">Demo pages are active for 7 days only. Contact your representative to reactivate.</p>
            </div>
          \`;
          return;
        }

        // 2. Track open event
        const detectDevice = () => {
          const ua = navigator.userAgent;
          if (/Mobi|Android|iPhone/i.test(ua)) return 'Mobile';
          if (/Tablet|iPad/i.test(ua)) return 'Tablet';
          return 'Desktop';
        };

        await fetch(mainAppUrl + "/api/demos/" + slug + "/opens", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            device: detectDevice()
          })
        });
      } catch (e) {
        console.error("Tracking error:", e);
      }
    })();
  </script>
`;

    // Inject just before </body>
    htmlOutput = htmlOutput.replace('</body>', `${trackingScript}</body>`);

    // 12. Write static file locally (for direct local serving)
    try {
      const demosDir = path.join(process.cwd(), 'public', 'demos');
      if (!fs.existsSync(demosDir)) {
        fs.mkdirSync(demosDir, { recursive: true });
      }
      fs.writeFileSync(path.join(demosDir, `${slug}.html`), htmlOutput);
    } catch (fsError) {
      console.error("Local file system write failed:", fsError);
    }

    // 13. Save record to Database
    const defaultLiveUrl = `${protocol}://${host}/${slug}`;

    const demoDoc = {
      slug,
      businessName: name,
      industry: activeIndustry,
      city,
      phone: phone || '',
      agentPhone: session.phoneNumber,
      primaryColor: colorPrimary,
      logoUrl,
      html: htmlOutput,
      liveUrl: defaultLiveUrl, // initial value, updated upon Vercel deployment if deployed
      generatedAt,
      expiresAt,
      sentViaWhatsApp: false,
      sentAt: null
    };

    if (firebaseInitialized && db) {
      await db.collection('demos').doc(slug).set(demoDoc);
    } else {
      mockDb.demos.set(slug, demoDoc);
    }

    return NextResponse.json({ success: true, html: htmlOutput, slug, liveUrl: defaultLiveUrl });
  } catch (error: any) {
    console.error("Error in generate API:", error);
    return NextResponse.json({ error: error.message || "Failed to generate website" }, { status: 500 });
  }
}
