import { useEffect, useState } from 'react';
import fallbackContent from './content.js';

import { motion } from 'framer-motion';

// Common
import WeibiBanner from './components/common/WeibiBanner.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import FloatingWhatsApp from './components/common/FloatingWhatsApp.jsx';
import Contact from './components/common/Contact.jsx';

// Heroes
import HeroSplit from './components/heroes/HeroSplit.jsx';
import HeroCentered from './components/heroes/HeroCentered.jsx';
import HeroFullBleed from './components/heroes/HeroFullBleed.jsx';
import HeroLuxury from './components/heroes/HeroLuxury.jsx';

// Services
import ServicesGrid from './components/services/ServicesGrid.jsx';
import ServicesCards from './components/services/ServicesCards.jsx';
import ServicesAccordion from './components/services/ServicesAccordion.jsx';

// Trust / Stats
import TrustGrid from './components/trust/TrustGrid.jsx';

// Testimonials
import TestimonialsSlider from './components/testimonials/TestimonialsSlider.jsx';
import TestimonialsSpotlight from './components/testimonials/TestimonialsSpotlight.jsx';

// Process
import ProcessTimeline from './components/process/ProcessTimeline.jsx';
import ProcessSteps from './components/process/ProcessSteps.jsx';

// Niche
import GymSchedule from './components/niche/GymSchedule.jsx';
import RestaurantMenu from './components/niche/RestaurantMenu.jsx';
import SalonPricing from './components/niche/SalonPricing.jsx';
import LawPracticeAreas from './components/niche/LawPracticeAreas.jsx';
import ClinicDoctors from './components/niche/ClinicDoctors.jsx';
import EventShowcase from './components/niche/EventShowcase.jsx';

// ── Firestore Tracking (called with ?wid=DEMO_ID) ──
const FIREBASE_PROJECT_ID = 'auto-webibi';

function useAnalytics(demoId, content) {
  useEffect(() => {
    if (!demoId || !FIREBASE_PROJECT_ID) return;

    const sessionId = Math.random().toString(36).substring(2, 15);
    const startTime = Date.now();
    const viewedSections = new Set(['hero']);

    const openDocId = `open_${Date.now()}_${sessionId}`;
    fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/opens?documentId=${openDocId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          demoId: { stringValue: demoId },
          sessionId: { stringValue: sessionId },
          openedAt: { timestampValue: new Date().toISOString() },
          userAgent: { stringValue: navigator.userAgent },
          referrer: { stringValue: document.referrer || 'Direct' },
          company: { stringValue: content?.company || 'Unknown' },
          timeSpentSeconds: { integerValue: 0 },
          sectionsViewed: { arrayValue: { values: [{ stringValue: 'hero' }] } }
        }
      })
    }).catch(() => {});

    const updateInterval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const sections = Array.from(viewedSections).map(s => ({ stringValue: s }));
      fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/opens/${openDocId}?updateMask.fieldPaths=timeSpentSeconds&updateMask.fieldPaths=sectionsViewed&updateMask.fieldPaths=lastActive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            timeSpentSeconds: { integerValue: timeSpent },
            sectionsViewed: { arrayValue: { values: sections } },
            lastActive: { timestampValue: new Date().toISOString() }
          }
        })
      }).catch(() => {});
    }, 5000);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.target.id) {
          viewedSections.add(e.target.id);
        }
      });
    }, { threshold: 0.3 });

    setTimeout(() => {
      document.querySelectorAll('section[id], div[id^="hero"]').forEach(el => observer.observe(el));
    }, 1000);

    return () => {
      clearInterval(updateInterval);
      observer.disconnect();
    };
  }, [demoId]);
}


// ── Maps ──
const heroMap = {
  split: HeroSplit,
  centered: HeroCentered,
  fullbleed: HeroFullBleed,
  fullwidth: HeroFullBleed,
  luxury: HeroLuxury,
  diagonal: HeroSplit, // fallback
};

const servicesMap = {
  'bold-energetic': ServicesGrid,
  'tech-modern': ServicesGrid,
  'luxury-refined': ServicesAccordion,
  'warm-local': ServicesAccordion,
  'playful-creative': ServicesCards,
};

const testimonialsMap = {
  'bold-energetic': TestimonialsSlider,
  'tech-modern': TestimonialsSpotlight,
  'luxury-refined': TestimonialsSpotlight,
  'warm-local': TestimonialsSlider,
  'playful-creative': TestimonialsSlider,
};

const nicheMap = {
  gym: GymSchedule,
  restaurant: RestaurantMenu,
  'salon': SalonPricing,
  'salon-beauty': SalonPricing,
  'law': LawPracticeAreas,
  'law-firm': LawPracticeAreas,
  clinic: ClinicDoctors,
  'clinic-healthcare': ClinicDoctors,
  'event-management': EventShowcase,
  'event': EventShowcase,
};

// About section (inline, no separate file needed)
function AboutSection({ content }) {
  const { about, company, primaryColor, secondaryColor, fontHeading, fontBody, vibe } = content;
  const isDark = vibe === 'bold-energetic' || vibe === 'tech-modern';
  return (
    <section id="about" className="section" style={{ background: isDark ? '#111' : '#fafafa' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div className="img-placeholder" style={{ height: 480, borderRadius: 16 }}>
            <span className="img-placeholder-text">{company}</span>
          </div>
          <div>
            <span className="eyebrow" style={{ color: primaryColor }}>Our Story</span>
            <h2 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: 'clamp(2rem,4vw,3rem)', color: isDark ? '#fff' : (secondaryColor || '#1a1a2e'), marginBottom: '1.5rem', lineHeight: 1.1 }}>
              About {company}
            </h2>
            <p style={{ fontFamily: `'${fontBody}', sans-serif`, fontSize: '1.05rem', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)', lineHeight: 1.85 }}>{about}</p>
            <a href="#contact" className="cta-btn" style={{ background: primaryColor, marginTop: '2.5rem', display: 'inline-flex', animation: 'none' }}>
              {content.ctaText}
            </a>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          #about .container > div { grid-template-columns: 1fr !important; gap: 2rem !important; }
          #about .img-placeholder { height: 260px !important; }
        }
      `}</style>
    </section>
  );
}
// Premium scroll animations
const sectionVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const wid = params.get('wid');
  
  const [content, setContent] = useState(fallbackContent);
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [loading, setLoading] = useState(!!wid);

  const [isHtmlMode, setIsHtmlMode] = useState(false);

  useEffect(() => {
    if (!wid) return;
    fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/demos/${wid}`)
      .then(r => r.json())
      .then(data => {
        if (data.fields?.contentJs?.stringValue) {
          // Clean up AI hallucinations (markdown blocks, export default, etc.)
          let raw = data.fields.contentJs.stringValue;
          raw = raw.replace(/^export default /i, '');
          raw = raw.replace(/^```[a-z]*\n?/i, '');
          raw = raw.replace(/```$/i, '');
          raw = raw.replace(/^```\n?/i, '');

          try {
            const parsed = new Function('return ' + raw)();
            setContent(parsed);
            
            // Check for logo
            if (data.fields.logoBase64?.stringValue) {
              setLogoUrl(`data:image/png;base64,${data.fields.logoBase64.stringValue}`);
            }
          } catch(e) { console.error('Failed to parse dynamic content', e); }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [wid]);

  useAnalytics(wid, content);
  // Track open via ?wid= param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wid = params.get('wid');
    if (wid) window.currentDemoId = wid; // stored for hook

    // Body class for vibe
    document.body.classList.add(`vibe-${content.vibe}`);
    return () => document.body.classList.remove(`vibe-${content.vibe}`);
  }, []);

  const { vibe, heroStyle, niche, sections = ['hero', 'stats', 'services', 'about', 'nicheSection', 'testimonials', 'contact'] } = content;

  // Pick components
  const HeroComp = heroMap[heroStyle] || HeroSplit;
  const ServicesComp = servicesMap[vibe] || ServicesCards;
  const TestimonialsComp = testimonialsMap[vibe] || TestimonialsSlider;
  const NicheComp = nicheMap[niche] || null;

  const heroProps = {
    company: content.company,
    tagline: content.tagline,
    subtext: content.about?.slice(0, 120) + '…',
    ctaText: content.ctaText,
    ctaPhone: content.phone,
    primaryColor: content.primaryColor,
    secondaryColor: content.secondaryColor,
    fontHeading: content.fontHeading,
    fontBody: content.fontBody,
    logoUrl: logoUrl,
  };

  const renderSection = (key) => {
    let comp = null;
    switch (key) {
      case 'hero':
        comp = <HeroComp key="hero" {...heroProps} />; break;
      case 'stats':
        comp = <TrustGrid key="stats" stats={content.stats || []} primaryColor={content.primaryColor} secondaryColor={content.secondaryColor} />; break;
      case 'services':
        comp = <ServicesComp key="services" services={content.services || []} primaryColor={content.primaryColor} secondaryColor={content.secondaryColor} fontHeading={content.fontHeading} fontBody={content.fontBody} />; break;
      case 'about':
        comp = <AboutSection key="about" content={content} />; break;
      case 'nicheSection':
        comp = NicheComp ? <NicheComp key="niche" data={content} primaryColor={content.primaryColor} secondaryColor={content.secondaryColor} fontHeading={content.fontHeading} fontBody={content.fontBody} /> : null; break;
      case 'testimonials':
        comp = <TestimonialsComp key="testimonials" testimonials={content.testimonials || []} primaryColor={content.primaryColor} secondaryColor={content.secondaryColor} fontHeading={content.fontHeading} fontBody={content.fontBody} />; break;
      case 'contact':
        comp = <Contact key="contact" content={content} />; break;
      default:
        return null;
    }
    
    // Do not animate Hero as it is above the fold, but animate everything else
    if (key === 'hero' || !comp) return comp;
    
    return (
      <motion.div key={key} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionVariant}>
        {comp}
      </motion.div>
    );
  };

  if (isHtmlMode) return null;
  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: 'sans-serif' }}>Loading Demo...</div>;

  return (
    <>
      <WeibiBanner content={content} />
      <Navbar logoUrl={logoUrl} content={content} />
      <main style={{ paddingTop: '48px', overflow: 'hidden' }}>
        {sections.map(s => renderSection(s))}
      </main>
      <Footer content={content} />
      <FloatingWhatsApp content={content} />
    </>
  );
}
