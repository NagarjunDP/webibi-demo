import { motion } from 'framer-motion';
import useReveal from '../../hooks/useReveal.js';

const iconMap = { dumbbell: '🏋️', fire: '🔥', barbell: '💪', apple: '🍎', scissors: '✂️', star: '⭐', heart: '❤️', briefcase: '💼', scale: '⚖️', stethoscope: '🩺', chef: '👨‍🍳', leaf: '🌿', default: '✦' };

export default function ServicesCards({ services, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  return (
    <section id="services" className="section" ref={ref}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>What We Do</span>
          <h2 className="section-title" style={{ color: secondaryColor || '#1a1a2e' }}>Our Services</h2>
          <div className="gold-line" style={{ background: primaryColor }} />
        </div>
        <div className="grid-3" style={{ gap: '2rem' }}>
          {services?.map((s, i) => (
            <motion.div key={i} className={`card reveal stagger-${i+1}`}
              style={{ overflow: 'hidden' }}
              whileHover={{ y: -8, boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}>
              {/* Gradient header */}
              <div style={{ height: 160, background: `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor || '#1a1a2e'}33)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || '#1a1a2e'})`, opacity: 0.15 }} />
                {iconMap[s.icon] || iconMap.default}
              </div>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.5rem', marginBottom: '0.75rem', color: secondaryColor || '#1a1a2e', letterSpacing: '0.03em' }}>{s.name}</h3>
                <p style={{ fontFamily: `'${fontBody}', sans-serif`, color: 'rgba(0,0,0,0.6)', lineHeight: 1.75, fontSize: '0.9rem' }}>{s.description}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: primaryColor, fontSize: '0.85rem', fontWeight: 600 }}>
                  Learn More <span style={{ transition: 'transform 0.2s' }}>→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
