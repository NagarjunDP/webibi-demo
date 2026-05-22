import useReveal from '../../hooks/useReveal.js';

const events = [
  { type: 'Corporate Gala', scale: '500+ guests', location: 'Mumbai' },
  { type: 'Wedding Reception', scale: '300 guests', location: 'Delhi' },
  { type: 'Product Launch', scale: 'Brand activation', location: 'Bangalore' },
  { type: 'Award Ceremony', scale: '200 attendees', location: 'Hyderabad' },
  { type: 'Music Festival', scale: '2000+ crowd', location: 'Pune' },
  { type: 'Conference', scale: '1-day summit', location: 'Chennai' },
];

export default function EventShowcase({ data, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  const items = data?.eventShowcase || events;
  return (
    <section className="section dark-section" ref={ref} style={{ background: secondaryColor || '#1a1a2e' }}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Our Portfolio</span>
          <h2 className="section-title" style={{ color: '#fff' }}>Past Events</h2>
        </div>
        <div className="grid-3 reveal" style={{ gap: '1rem' }}>
          {items.map((e, i) => (
            <div key={i} className={`stagger-${i+1}`} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: i % 3 === 1 ? 280 : 220, cursor: 'pointer' }}>
              <div className="img-placeholder" style={{ height: '100%' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
                <h3 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.2rem', color: '#fff', marginBottom: '0.25rem' }}>{e.type}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                  <span>👥 {e.scale}</span>
                  <span>📍 {e.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a href="#contact" className="cta-btn" style={{ background: primaryColor }}>Plan Your Event</a>
        </div>
      </div>
    </section>
  );
}
