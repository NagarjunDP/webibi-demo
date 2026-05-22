import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useReveal from '../../hooks/useReveal.js';

const iconMap = { dumbbell: '🏋️', fire: '🔥', barbell: '💪', apple: '🍎', scissors: '✂️', star: '⭐', heart: '❤️', briefcase: '💼', scale: '⚖️', stethoscope: '🩺', chef: '👨‍🍳', leaf: '🌿', default: '✦' };

export default function ServicesAccordion({ services, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const [open, setOpen] = useState(0);
  const ref = useReveal();
  return (
    <section id="services" className="section" style={{ background: '#fafaf8' }} ref={ref}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Our Expertise</span>
          <h2 className="section-title" style={{ color: secondaryColor || '#1a1a2e' }}>Services</h2>
          <div className="gold-line" style={{ background: primaryColor }} />
        </div>
        {services?.map((s, i) => (
          <div key={i} className="reveal" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.75rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: '1.8rem' }}>{iconMap[s.icon] || iconMap.default}</span>
              <span style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.5rem', color: open === i ? primaryColor : (secondaryColor || '#1a1a2e'), flex: 1, transition: 'color 0.3s', letterSpacing: '0.03em' }}>{s.name}</span>
              <span style={{ fontSize: '1.5rem', color: primaryColor, transform: open === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.4s' }}>+</span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
                  style={{ overflow: 'hidden', paddingLeft: '3.5rem', paddingBottom: '1.5rem' }}>
                  <p style={{ fontFamily: `'${fontBody}', sans-serif`, color: 'rgba(0,0,0,0.6)', lineHeight: 1.8, fontSize: '1rem' }}>{s.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
