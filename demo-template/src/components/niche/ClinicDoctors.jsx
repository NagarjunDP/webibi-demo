import useReveal from '../../hooks/useReveal.js';

const doctors = [
  { name: 'Dr. Anjali Rao', specialisation: 'General Physician', experience: '15 years', days: 'Mon, Wed, Fri' },
  { name: 'Dr. Rajesh Kumar', specialisation: 'Cardiologist', experience: '22 years', days: 'Tue, Thu, Sat' },
  { name: 'Dr. Priya Nair', specialisation: 'Paediatrician', experience: '12 years', days: 'Mon–Sat' },
];

export default function ClinicDoctors({ data, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  const profiles = data?.doctorProfiles || doctors;
  return (
    <section className="section" ref={ref} style={{ background: '#f0f9ff' }}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Our Team</span>
          <h2 className="section-title" style={{ color: secondaryColor || '#1a1a2e' }}>Meet Our Doctors</h2>
        </div>
        <div className="grid-3 reveal" style={{ gap: '2rem' }}>
          {profiles.map((d, i) => (
            <div key={i} className={`card stagger-${i+1}`} style={{ textAlign: 'center', overflow: 'hidden' }}>
              <div style={{ height: 200, background: `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor || '#1a1a2e'}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
                👨‍⚕️
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.4rem', color: secondaryColor || '#1a1a2e', marginBottom: '0.25rem' }}>{d.name}</h3>
                <p style={{ color: primaryColor, fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>{d.specialisation}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)' }}>
                  <span>🏆 {d.experience}</span>
                  <span>📅 {d.days}</span>
                </div>
                <a href="#contact" style={{ display: 'block', marginTop: '1.5rem', padding: '0.75rem', background: primaryColor, color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem', textAlign: 'center', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Book Appointment
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
