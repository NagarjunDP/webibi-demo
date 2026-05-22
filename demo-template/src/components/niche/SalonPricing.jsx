import useReveal from '../../hooks/useReveal.js';

const samplePricing = [
  { name: 'Essential', price: '₹999/month', features: ['Haircut & Styling', 'Basic Facial', 'Eyebrow Shaping', 'Hair Wash & Blowdry'], highlight: false },
  { name: 'Premium', price: '₹1,999/month', features: ['All Essential Services', 'Deep Conditioning', 'Manicure & Pedicure', 'Threading & Waxing', 'Hair Spa'], highlight: true },
  { name: 'Luxury', price: '₹3,499/month', features: ['All Premium Services', 'Keratin Treatment', 'Skin Brightening', 'Bridal Package', 'Priority Booking'], highlight: false },
];

export default function SalonPricing({ data, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  const pricing = data?.serviceMenu || samplePricing;
  return (
    <section className="section" ref={ref} style={{ background: '#fdf8f5' }}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Service Packages</span>
          <h2 className="section-title" style={{ color: secondaryColor || '#1a1a2e' }}>Choose Your Plan</h2>
        </div>
        <div className="grid-3 reveal" style={{ gap: '2rem', alignItems: 'start' }}>
          {pricing.map((p, i) => (
            <div key={i} style={{ background: p.highlight ? primaryColor : '#fff', borderRadius: 16, padding: '2.5rem', boxShadow: p.highlight ? `0 20px 60px color-mix(in srgb, ${primaryColor} 30%, transparent)` : '0 4px 20px rgba(0,0,0,0.06)', transform: p.highlight ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.3s' }}>
              {p.highlight && <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 100, padding: '0.3rem 1rem', fontSize: '0.7rem', fontWeight: 700, color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'inline-block', marginBottom: '1rem' }}>Most Popular</div>}
              <h3 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.8rem', color: p.highlight ? '#fff' : (secondaryColor || '#1a1a2e'), marginBottom: '0.5rem' }}>{p.name}</h3>
              <div style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '2rem', color: p.highlight ? 'rgba(255,255,255,0.9)' : primaryColor, marginBottom: '1.5rem' }}>{p.price}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: `'${fontBody}', sans-serif`, fontSize: '0.9rem', color: p.highlight ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.65)' }}>
                    <span style={{ color: p.highlight ? 'rgba(255,255,255,0.8)' : primaryColor }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#contact" style={{ display: 'block', textAlign: 'center', padding: '0.875rem', borderRadius: 8, background: p.highlight ? 'rgba(255,255,255,0.2)' : primaryColor, color: '#fff', fontFamily: `'${fontHeading}', serif`, fontSize: '1rem', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                Book Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
