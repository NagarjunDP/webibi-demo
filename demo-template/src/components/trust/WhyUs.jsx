import useReveal from '../../hooks/useReveal.js';

export default function WhyUs({ stats, features, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  const items = features || stats?.map(s => ({ title: s.value, description: s.label })) || [];
  return (
    <section className="section" style={{ background: '#fff' }} ref={ref}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Why Choose Us</span>
          <h2 className="section-title" style={{ color: secondaryColor || '#1a1a2e' }}>Built on Trust</h2>
        </div>
        {items.map((item, i) => (
          <div key={i} className={`reveal stagger-${i+1}`} style={{ display: 'flex', gap: '3rem', alignItems: 'center', padding: '3rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
            <div style={{ flex: '0 0 120px', height: 120, borderRadius: '50%', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || '#1a1a2e'})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '2.5rem', color: '#fff' }}>{String(i+1).padStart(2,'0')}</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '2rem', color: secondaryColor || '#1a1a2e', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ fontFamily: `'${fontBody}', sans-serif`, color: 'rgba(0,0,0,0.6)', lineHeight: 1.8, fontSize: '1rem', maxWidth: 560 }}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
