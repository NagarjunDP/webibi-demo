import { useState } from 'react';
import useReveal from '../../hooks/useReveal.js';

const areas = [
  { name: 'Corporate Law', description: 'Company formation, mergers & acquisitions, shareholder disputes, and regulatory compliance for businesses of all sizes.' },
  { name: 'Civil Litigation', description: 'Expert representation in property disputes, contract breaches, and debt recovery matters across all civil courts.' },
  { name: 'Family Law', description: 'Divorce, child custody, alimony, and domestic relations handled with sensitivity and discretion.' },
  { name: 'Criminal Defence', description: 'Skilled defence representation for all criminal matters, from bail applications to trial proceedings.' },
];

export default function LawPracticeAreas({ data, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const [open, setOpen] = useState(null);
  const ref = useReveal();
  const items = data?.practiceAreas || areas;
  return (
    <section className="section" ref={ref} style={{ background: '#f8f9fa' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Legal Expertise</span>
          <h2 className="section-title" style={{ color: secondaryColor || '#1a1a2e' }}>Practice Areas</h2>
        </div>
        {items.map((item, i) => (
          <div key={i} className={`reveal stagger-${i+1}`} style={{ marginBottom: '1rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.3rem', color: open === i ? primaryColor : (secondaryColor || '#1a1a2e'), transition: 'color 0.3s' }}>{item.name}</span>
              <span style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${primaryColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: primaryColor, fontSize: '1.2rem', transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>+</span>
            </button>
            <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease', padding: open === i ? '0 2rem 1.5rem' : '0 2rem' }}>
              <p style={{ fontFamily: `'${fontBody}', sans-serif`, color: 'rgba(0,0,0,0.6)', lineHeight: 1.8, fontSize: '0.95rem' }}>{item.description}</p>
            </div>
          </div>
        ))}
        <div className="reveal" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a href="#contact" className="cta-btn" style={{ background: primaryColor }}>Book a Free Consultation</a>
        </div>
      </div>
    </section>
  );
}
