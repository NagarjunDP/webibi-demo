import { motion } from 'framer-motion';
import useReveal from '../../hooks/useReveal.js';

const iconMap = { dumbbell: '🏋️', fire: '🔥', barbell: '💪', apple: '🍎', scissors: '✂️', star: '⭐', heart: '❤️', briefcase: '💼', scale: '⚖️', stethoscope: '🩺', camera: '📸', music: '🎵', chef: '👨‍🍳', leaf: '🌿', home: '🏠', car: '🚗', book: '📚', phone: '📞', default: '✦' };

export default function ServicesGrid({ services, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  return (
    <section id="services" className="section dark-section" style={{ background: secondaryColor || '#1a1a2e' }} ref={ref}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>What We Offer</span>
          <h2 className="section-title" style={{ color: '#fff' }}>Our Services</h2>
          <div className="gold-line" style={{ background: primaryColor }} />
        </div>
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {services?.map((s, i) => (
            <motion.div key={i} className={`card card-dark reveal stagger-${i+1}`}
              style={{ padding: '2.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
              whileHover={{ borderColor: primaryColor, boxShadow: `0 0 40px color-mix(in srgb, ${primaryColor} 20%, transparent)` }}>
              <div style={{ fontSize: '2.5rem', minWidth: '2.5rem' }}>{iconMap[s.icon] || iconMap.default}</div>
              <div>
                <h3 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.6rem', color: '#fff', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>{s.name}</h3>
                <p style={{ fontFamily: `'${fontBody}', sans-serif`, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, fontSize: '0.95rem' }}>{s.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
