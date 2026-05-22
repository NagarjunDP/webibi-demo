import { useState, useEffect } from 'react';

export default function Navbar({ logoUrl, content }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const isLight = scrolled;

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} style={{ color: isLight ? '#1a1a1a' : '#fff' }}>
        <div className="navbar-logo">
          {logoUrl
            ? <img src={logoUrl} alt={content.company} />
            : <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: isLight ? 'var(--color-primary)' : '#fff', letterSpacing: '0.05em' }}>{content.company}</span>
          }
        </div>
        <ul className="navbar-links">
          {links.map(l => (
            <li key={l.href}><a href={l.href} style={{ color: isLight ? '#1a1a1a' : 'rgba(255,255,255,0.85)' }}>{l.label}</a></li>
          ))}
          <li><a href="#contact" className="nav-cta">{content.ctaText}</a></li>
        </ul>
        <div className="hamburger" onClick={() => setOpen(true)} style={{ color: isLight ? '#1a1a1a' : '#fff' }}>
          <span /><span /><span />
        </div>
      </nav>

      {open && (
        <div className="mobile-menu open" style={{ background: content.secondaryColor || '#1a1a2e', color: '#fff' }}>
          <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setOpen(false)}>✕</span>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: '#fff', letterSpacing: '0.08em' }}>{l.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="cta-btn">{content.ctaText}</a>
        </div>
      )}
    </>
  );
}
