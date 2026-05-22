import { useState } from 'react';
import useReveal from '../../hooks/useReveal.js';

const Stars = ({ n = 5, color }) => Array.from({ length: n }).map((_, i) => <span key={i} style={{ color }}>★</span>);

export default function TestimonialsSpotlight({ testimonials, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const [active, setActive] = useState(0);
  const ref = useReveal();
  if (!testimonials?.length) return null;
  const main = testimonials[active];
  return (
    <section className="section dark-section" style={{ background: secondaryColor || '#1a1a2e' }} ref={ref}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Testimonials</span>
          <h2 className="section-title" style={{ color: '#fff' }}>Real Results</h2>
        </div>
        {/* Spotlight */}
        <div className="reveal" style={{ maxWidth: 700, margin: '0 auto 4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', color: primaryColor, lineHeight: 1, marginBottom: '1rem', opacity: 0.4 }}>"</div>
          <p style={{ fontFamily: `'${fontBody}', sans-serif`, fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '2rem' }}>{main.text}</p>
          <div style={{ color: primaryColor, marginBottom: '0.75rem' }}><Stars n={main.rating || 5} color={primaryColor} /></div>
          <div style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.4rem', color: '#fff' }}>{main.name}</div>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>{main.role}</div>
        </div>
        {/* Mini grid */}
        {testimonials.length > 1 && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {testimonials.map((t, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ padding: '0.75rem 1.5rem', borderRadius: 100, border: `1px solid ${i === active ? primaryColor : 'rgba(255,255,255,0.15)'}`, background: i === active ? primaryColor : 'transparent', color: i === active ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s', fontFamily: `'${fontBody}', sans-serif` }}>
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
