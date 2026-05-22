import useReveal from '../../hooks/useReveal.js';

export default function GymSchedule({ data, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  const schedule = data?.classSchedule || [];
  return (
    <section className="section" ref={ref} style={{ background: '#0d0d0d' }}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '3rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Weekly Schedule</span>
          <h2 className="section-title" style={{ color: '#fff' }}>Class Timetable</h2>
        </div>
        <div className="grid-2 reveal" style={{ gap: '1.5rem' }}>
          {schedule.map((day, i) => (
            <div key={i} className={`card card-dark stagger-${i+1}`} style={{ padding: '1.5rem' }}>
              <h3 style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.5rem', color: primaryColor, marginBottom: '1rem', letterSpacing: '0.05em' }}>{day.day}</h3>
              {day.classes?.map((c, j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: j < day.classes.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div>
                    <div style={{ fontFamily: `'${fontBody}', sans-serif`, color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{c.name}</div>
                    <div style={{ fontFamily: `'${fontBody}', sans-serif`, color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: '0.2rem' }}>with {c.trainer}</div>
                  </div>
                  <div style={{ background: `${primaryColor}22`, border: `1px solid ${primaryColor}44`, borderRadius: 100, padding: '0.3rem 0.8rem', fontFamily: `'${fontBody}', sans-serif`, color: primaryColor, fontSize: '0.8rem', fontWeight: 600 }}>{c.time}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="reveal" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a href="#contact" className="cta-btn" style={{ background: primaryColor, fontFamily: `'${fontHeading}', serif` }}>Book a Free Trial Class</a>
        </div>
      </div>
    </section>
  );
}
