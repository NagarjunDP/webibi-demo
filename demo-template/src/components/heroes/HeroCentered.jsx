import { motion } from 'framer-motion';

export default function HeroCentered({ company, tagline, subtext, ctaText, ctaPhone, primaryColor, secondaryColor, fontHeading, fontBody, logoUrl }) {
  return (
    <div className="hero-centered" style={{ background: `linear-gradient(160deg, ${secondaryColor || '#1a1a2e'} 0%, color-mix(in srgb, ${primaryColor} 30%, ${secondaryColor || '#1a1a2e'}) 100%)`, color: '#fff' }}>
      {/* Background gradient orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${primaryColor}25 0%, transparent 70%)`, filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, color-mix(in srgb, ${primaryColor} 60%, #ff6f91)25 0%, transparent 70%)`, filter: 'blur(40px)' }} />
      </div>

      {logoUrl && (
        <motion.img src={logoUrl} alt={company} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ height: 72, width: 'auto', objectFit: 'contain', marginBottom: '2rem', position: 'relative', zIndex: 2 }}
        />
      )}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16,1,0.3,1] }} style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 800 }}>
        <span className="eyebrow" style={{ color: primaryColor }}>{company}</span>
        <h1 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: 'clamp(2.5rem,7vw,6rem)', lineHeight: 1.02, marginBottom: '1.5rem', letterSpacing: '0.03em', color: '#fff' }}>
          {tagline}
        </h1>
        {subtext && <p style={{ fontFamily: `'${fontBody}', sans-serif`, fontSize: '1.15rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: 560, margin: '0 auto 2.5rem' }}>{subtext}</p>}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          <a href="#contact" className="cta-btn" style={{ background: primaryColor, fontFamily: `'${fontHeading}', serif`, fontSize: '1.1rem' }}>{ctaText || 'Get Started'}</a>
          <a href="#services" style={{ padding: '1rem 2rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, color: '#fff', fontFamily: `'${fontBody}', sans-serif`, fontSize: '0.95rem', transition: 'border-color 0.2s' }}>
            Explore Services ↓
          </a>
        </div>
      </motion.div>
    </div>
  );
}
