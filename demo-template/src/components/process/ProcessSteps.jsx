import useReveal from '../../hooks/useReveal.js';

export default function ProcessSteps({ steps, primaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  return (
    <section className="section" style={{ background: '#fafaf8' }} ref={ref}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>The Journey</span>
          <h2 className="section-title">From Vision to Reality</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 700, margin: '0 auto' }}>
          {steps?.map((s, i) => (
            <div key={i} className={`reveal stagger-${i+1}`} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 15px rgba(0,0,0,0.05)', borderLeft: `4px solid ${primaryColor}` }}>
              <div style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '2.5rem', color: primaryColor, lineHeight: 1, minWidth: '2rem' }}>{String(i+1).padStart(2,'0')}</div>
              <div>
                <h3 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.5rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ fontFamily: `'${fontBody}', sans-serif`, color: 'rgba(0,0,0,0.6)', lineHeight: 1.75, fontSize: '0.95rem' }}>{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
