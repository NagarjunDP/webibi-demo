import useReveal from '../../hooks/useReveal.js';

export default function ProcessTimeline({ steps, primaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  return (
    <section className="section" style={{ background: '#fff' }} ref={ref}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>How It Works</span>
          <h2 className="section-title">Our Process</h2>
        </div>
        {/* Desktop horizontal */}
        <div className="desktop-timeline reveal" style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          {steps?.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative', padding: '0 1rem' }}>
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', top: 24, left: '60%', right: '-40%', height: 2, background: `linear-gradient(90deg, ${primaryColor}, transparent)` }} />
              )}
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: primaryColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: `'${fontHeading}', serif`, fontSize: '1.2rem', margin: '0 auto 1.5rem' }}>
                {String(s.number || i+1).padStart(2,'0')}
              </div>
              <h3 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.3rem', marginBottom: '0.75rem', color: '#1a1a2e' }}>{s.title}</h3>
              <p style={{ fontFamily: `'${fontBody}', sans-serif`, fontSize: '0.875rem', color: 'rgba(0,0,0,0.55)', lineHeight: 1.7 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
