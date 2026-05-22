import { useEffect, useRef } from 'react';
import useReveal from '../../hooks/useReveal.js';

function useCountUp(stats) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-countup]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (!el.isIntersecting) return;
        const target = el.target;
        const end = parseFloat(target.dataset.countup);
        const suffix = target.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          target.textContent = (Number.isInteger(end) ? Math.round(end * eased) : (end * eased).toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.unobserve(target);
      });
    }, { threshold: 0.5 });
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function TrustGrid({ stats, features, primaryColor, secondaryColor }) {
  useCountUp(stats);
  const ref = useReveal();

  const parseVal = (v) => {
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
    const suffix = String(v).replace(/[0-9.]/g, '');
    return { n, suffix };
  };

  return (
    <section className="section dark-section" style={{ background: secondaryColor || '#1a1a2e' }} ref={ref}>
      <div className="container">
        {/* Stats */}
        {stats?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: '2rem', marginBottom: features?.length ? '5rem' : 0, textAlign: 'center' }}>
            {stats.map((s, i) => {
              const { n, suffix } = parseVal(s.value);
              return (
                <div key={i} className={`reveal stagger-${i+1}`}>
                  <div className="stat-value" data-countup={n} data-suffix={suffix}>{s.value}</div>
                  <p className="stat-label" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</p>
                </div>
              );
            })}
          </div>
        )}
        {/* Features */}
        {features?.length > 0 && (
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {features.map((f, i) => (
              <div key={i} className={`card card-dark reveal stagger-${i+1}`} style={{ padding: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.75 }}>{f.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
