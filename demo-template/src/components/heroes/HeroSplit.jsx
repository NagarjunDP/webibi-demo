import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function HeroSplit({ company, tagline, subtext, ctaText, ctaPhone, primaryColor, secondaryColor, fontHeading, fontBody, logoUrl }) {
  return (
    <section className="hero-split" style={{ paddingTop: 0 }}>
      {/* Left: Text */}
      <div className="hero-split-text" style={{ background: secondaryColor || '#1a1a2e' }}>
        {logoUrl && <img src={logoUrl} alt={company} style={{ height: 56, width: 'auto', objectFit: 'contain', marginBottom: '2rem', opacity: 0.9 }} />}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Welcome to</span>
          <h1 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: 'clamp(3rem,6vw,5.5rem)', color: '#fff', lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '0.02em' }}>
            {company}
          </h1>
          <p style={{ fontFamily: `'${fontBody}', sans-serif`, fontSize: 'clamp(1.1rem,2vw,1.4rem)', color: 'rgba(255,255,255,0.75)', marginBottom: '1rem', letterSpacing: '0.02em' }}>
            {tagline}
          </p>
          {subtext && <p style={{ fontFamily: `'${fontBody}', sans-serif`, fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 420 }}>{subtext}</p>}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <a href="#contact" className="cta-btn" style={{ background: primaryColor, fontFamily: `'${fontHeading}', serif` }}>{ctaText || 'Get Started'}</a>
            {ctaPhone && (
              <a href={`tel:${ctaPhone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, color: '#fff', fontFamily: `'${fontBody}', sans-serif`, fontSize: '0.95rem', transition: 'border-color 0.2s' }}>
                📞 {ctaPhone}
              </a>
            )}
          </div>
        </motion.div>
      </div>
      {/* Right: Visual */}
      <motion.div className="hero-split-visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
        <div className="img-placeholder" style={{ height: '100%', minHeight: '100vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
            {logoUrl && <img src={logoUrl} alt={company} style={{ height: 80, width: 'auto', objectFit: 'contain', opacity: 0.6 }} />}
            <span className="img-placeholder-text">{company}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
