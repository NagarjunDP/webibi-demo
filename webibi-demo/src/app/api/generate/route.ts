import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const NICHES = ['restaurant', 'salon', 'gym', 'clinic', 'events'];

async function fetchGooglePlacesData(businessName: string, city: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey || apiKey === 'dummy') {
    console.log("No Google Places API Key found, using realistic mock data.");
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      rating: "4.8",
      reviewCount: (Math.floor(Math.random() * 300) + 80).toString(),
      topReview: `Absolutely love this place. Best in ${city} hands down. The staff is incredible and the quality is unmatched.`
    };
  }

  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(businessName + ' in ' + city)}&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      throw new Error("Place not found");
    }

    const placeId = searchData.results[0].place_id;
    const rating = searchData.results[0].rating || "4.8";
    const reviewCount = searchData.results[0].user_ratings_total || "120";

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    let topReview = `Highly recommended in ${city}.`;
    if (detailsData.result?.reviews && detailsData.result.reviews.length > 0) {
      const review = detailsData.result.reviews.find((r: any) => r.text && r.text.length > 20);
      if (review) {
        topReview = review.text;
      }
    }

    return {
      rating: rating.toString(),
      reviewCount: reviewCount.toString(),
      topReview
    };
  } catch (error) {
    console.error("Google Places API error:", error);
    return {
      rating: "4.8",
      reviewCount: "150",
      topReview: `The absolute best experience we've had in ${city}. Highly recommended!`
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, industry, city, tagline, phone, extractedColors, primaryColor, logoDataUrl } = body;

    const indKey = (industry || '').toLowerCase().trim();
    const activeIndustry = NICHES.includes(indKey) ? indKey : 'clinic'; // clinic is the fallback/default

    // 1. Fetch places reviews
    const placesData = await fetchGooglePlacesData(name, city);

    // 2. Setup colors (CSS variables will reference these)
    const colorPrimary = primaryColor || (extractedColors && extractedColors[0]) || "#7c5cfc";
    const colorSecondary = (extractedColors && extractedColors[1]) || colorPrimary;
    const colorTertiary = (extractedColors && extractedColors[2]) || colorSecondary;

    // 3. Fallback Copywriter data
    const fallbackCopy = {
      tagline: tagline || `The best choice in ${city}`,
      hero_headline: `Redefining Excellence in ${city}`,
      hero_sub: `Experience unmatched quality and dedication crafted specifically for you.`,
      about_text: `We are deeply rooted in ${city}, bringing years of passion and expertise to our community. Our commitment to your satisfaction drives everything we do.`,
      cta: `Call Now`
    };

    let copy = fallbackCopy;

    // 4. Query Gemini Copywriter API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'dummy') {
      const prompt = `You are a local business copywriter. Reply ONLY with a JSON object, no markdown, no explanation.

Business: ${name}
Industry: ${industry || 'local business'}  
City: ${city}
Google rating: ${placesData.rating}/5 (${placesData.reviewCount} reviews)

Return exactly this structure:
{
  "tagline": "5-7 word punchy tagline",
  "hero_headline": "8-12 word hero headline",
  "hero_sub": "one sentence benefit statement, max 18 words",
  "about_text": "two sentences about the business, warm and local, max 35 words",
  "cta": "3-word call to action button text"
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
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          let jsonText = text.trim();
          if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '').trim();
          }
          const aiJson = JSON.parse(jsonText);
          copy = {
            tagline: aiJson.tagline || fallbackCopy.tagline,
            hero_headline: aiJson.hero_headline || fallbackCopy.hero_headline,
            hero_sub: aiJson.hero_sub || fallbackCopy.hero_sub,
            about_text: aiJson.about_text || fallbackCopy.about_text,
            cta: aiJson.cta || fallbackCopy.cta
          };
        } else {
          console.warn('Gemini copywriting request failed:', geminiRes.status);
        }
      } catch (err) {
        console.error('Error executing Gemini copywriting service:', err);
      }
    }

    // 5. Select Mapped Niche Template
    const templatesDir = path.join(process.cwd(), 'templates');
    const templatePath = path.join(templatesDir, `shell-${activeIndustry}.html`);
    let templateHtml = fs.readFileSync(templatePath, 'utf8');

    // 6. Setup Local Static Images
    const imgSet = Math.floor(Math.random() * 5) + 1;
    const imgHero = `/assets/${activeIndustry}/hero-${imgSet}.jpg`;
    const imgSection = `/assets/${activeIndustry}/section-${imgSet}.jpg`;
    const imgGallery1 = `/assets/${activeIndustry}/gallery1-${imgSet}.jpg`;
    const imgGallery2 = `/assets/${activeIndustry}/gallery2-${imgSet}.jpg`;
    const imgGallery3 = `/assets/${activeIndustry}/gallery3-${imgSet}.jpg`;

    // 7. Pick Layout Variant and details
    const variants = ['variant-a', 'variant-b', 'variant-c', 'variant-d', 'variant-e'];
    const layoutVariant = variants[Math.floor(Math.random() * variants.length)];

    const businessInitials = (name || '').trim().slice(0, 2).toUpperCase() || 'WB';

    const badgeMap: Record<string, string> = {
      restaurant: '🍽 Restaurant',
      salon: '💆 Salon & Beauty',
      gym: '💪 Gym & Fitness',
      clinic: '🩺 Medical Clinic',
      events: '🎉 Event Venue',
    };
    const industryBadge = badgeMap[activeIndustry] || '💼 Business';
    const agencyPhone = '919876543210';

    let logoUrl = logoDataUrl || '';
    if (logoUrl) {
      // Escape double quotes to prevent breaking HTML attributes
      logoUrl = logoUrl.replaceAll('"', "'");
    }

    // 8. Inject Variables & Tokens
    const htmlOutput = templateHtml
      .replaceAll('{{BUSINESS_NAME}}', name)
      .replaceAll('{{HERO_HEADLINE}}', copy.hero_headline)
      .replaceAll('{{HERO_SUBLINE}}', copy.hero_sub)
      .replaceAll('{{TAGLINE}}', copy.tagline)
      .replaceAll('{{ABOUT_TEXT}}', copy.about_text)
      .replaceAll('{{CTA_TEXT}}', copy.cta)
      .replaceAll('{{FOOTER_TAGLINE}}', copy.tagline)
      .replaceAll('{{PHONE}}', phone || '')
      .replaceAll('{{CITY}}', city)
      .replaceAll('{{LOGO_URL}}', logoUrl)
      .replaceAll('{{COLOR_PRIMARY}}', colorPrimary)
      .replaceAll('{{COLOR_SECONDARY}}', colorSecondary)
      .replaceAll('{{COLOR_TERTIARY}}', colorTertiary)
      .replaceAll('{{IMG_HERO}}', imgHero)
      .replaceAll('{{IMG_SECTION}}', imgSection)
      .replaceAll('{{IMG_GALLERY1}}', imgGallery1)
      .replaceAll('{{IMG_GALLERY2}}', imgGallery2)
      .replaceAll('{{IMG_GALLERY3}}', imgGallery3)
      .replaceAll('{{GOOGLE_RATING}}', placesData.rating)
      .replaceAll('{{REVIEW_COUNT}}', placesData.reviewCount)
      .replaceAll('{{TOP_REVIEW}}', placesData.topReview)
      .replaceAll('{{HERO_LAYOUT_CLASS}}', layoutVariant)
      .replaceAll('{{LAYOUT_VARIANT}}', layoutVariant)
      .replaceAll('{{IMG_SET}}', imgSet.toString())
      .replaceAll('{{BUSINESS_INITIALS}}', businessInitials)
      .replaceAll('{{INDUSTRY_BADGE}}', industryBadge)
      .replaceAll('{{AGENCY_PHONE}}', agencyPhone)
      .replaceAll('{{INDUSTRY}}', activeIndustry);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      const demosDir = path.join(process.cwd(), 'public', 'demos');
      if (!fs.existsSync(demosDir)) {
        fs.mkdirSync(demosDir, { recursive: true });
      }
      fs.writeFileSync(path.join(demosDir, `${slug}.html`), htmlOutput);
    } catch (fsError) {
      console.error("Failed to write html file locally", fsError);
    }

    return NextResponse.json({ success: true, html: htmlOutput, slug });
  } catch (error) {
    console.error("Error generating website:", error);
    return NextResponse.json({ success: false, error: "Failed to generate website" }, { status: 500 });
  }
}
