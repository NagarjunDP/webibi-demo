import { motion } from 'framer-motion';

export default function HeroLuxury({ company, tagline, subtext, ctaText, ctaPhone, primaryColor, secondaryColor, fontHeading, fontBody, logoUrl }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafaf8', padding: '8rem 2rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 30% 70%, color-mix(in srgb, ${primaryColor} 6%, transparent) 0%, transparent 50%), radial-gradient(circle at 70% 30%, color-mix(in srgb, ${primaryColor} 4%, transparent) 0%, transparent 50%)`, pointerEvents: 'none' }} />

      {/* Thin top rule */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, ease: [0.16,1,0.3,1] }}
        style={{ position: 'absolute', top: '80px', left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`, transformOrigin: 'center' }}
      />

      {logoUrl && (
        <motion.img src={logoUrl} alt={company} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
          style={{ height: 60, width: 'auto', objectFit: 'contain', marginBottom: '3rem', filter: 'grayscale(0.2)' }}
        />
      )}

      <motion.span className="eyebrow" style={{ color: primaryColor, letterSpacing: '0.5em', fontSize: '0.7rem', marginBottom: '2rem' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
        {company}
      </motion.span>

      <motion.h1 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: 'clamp(2.5rem,6vw,5rem)', lineHeight: 1.1, color: '#1a1a1a', marginBottom: '2rem', fontStyle: 'italic', fontWeight: 400, maxWidth: 800, letterSpacing: '0.01em' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: [0.16,1,0.3,1] }}>
        {tagline}
      </motion.h1>

      {subtext && (
        <motion.p style={{ fontFamily: `'${fontBody}', sans-serif`, fontSize: '1.05rem', color: 'rgba(26,26,26,0.55)', maxWidth: 480, lineHeight: 1.9, marginBottom: '3rem' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
          {subtext}
        </motion.p>
      )}

      <motion.div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
        <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 3rem', border: `1px solid ${primaryColor}`, color: primaryColor, fontFamily: `'${fontBody}', sans-serif`, fontSize: '0.85rem', letterSpacing: '0.25em', textTransform: 'uppercase', transition: 'all 0.4s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background = primaryColor; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = primaryColor; }}>
          {ctaText || 'Begin'}
        </a>
        {ctaPhone && (
          <a href={`tel:${ctaPhone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', color: 'rgba(26,26,26,0.5)', fontFamily: `'${fontBody}', sans-serif`, fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            {ctaPhone}
          </a>
        )}
      </motion.div>

      {/* Bottom rule */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, ease: [0.16,1,0.3,1], delay: 0.2 }}
        style={{ position: 'absolute', bottom: '60px', left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)`, transformOrigin: 'center' }}
      />
    </div>
  );
}
