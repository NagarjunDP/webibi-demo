import { motion } from 'framer-motion';

export default function HeroFullBleed({ company, tagline, subtext, ctaText, ctaPhone, primaryColor, secondaryColor, fontHeading, fontBody, logoUrl }) {
  return (
    <div className="hero-fullwidth" style={{ minHeight: '100vh' }}>
      {/* Full bleed background */}
      <div className="hero-fullwidth-bg" style={{ background: `linear-gradient(135deg, ${secondaryColor || '#0d0d0d'} 0%, color-mix(in srgb, ${primaryColor} 25%, #000) 50%, ${secondaryColor || '#0d0d0d'} 100%)`, backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite' }}>
        {/* Grid pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Radial vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, color: '#fff', textAlign: 'center' }}>
        {logoUrl && (
          <motion.img src={logoUrl} alt={company} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
            style={{ height: 80, width: 'auto', objectFit: 'contain', margin: '0 auto 2rem', display: 'block' }}
          />
        )}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }}>
          <div style={{ display: 'inline-block', border: `1px solid ${primaryColor}`, borderRadius: 100, padding: '0.4rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '2rem', color: primaryColor }}>{company}</div>
          <h1 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: 'clamp(2.5rem,8vw,7rem)', lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '0.02em' }}>
            {tagline}
          </h1>
          {subtext && <p style={{ fontFamily: `'${fontBody}', sans-serif`, fontSize: '1.15rem', color: 'rgba(255,255,255,0.65)', maxWidth: 560, margin: '0 auto 3rem', lineHeight: 1.8 }}>{subtext}</p>}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            <a href="#contact" className="cta-btn" style={{ background: primaryColor, fontFamily: `'${fontHeading}', serif` }}>{ctaText || 'Get Started'}</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
