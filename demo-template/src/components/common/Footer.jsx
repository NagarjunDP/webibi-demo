export default function Footer({ content }) {
  return (
    <footer className="footer">
      <div className="footer-brand">{content.company}</div>
      <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>{content.tagline}</p>
      <p style={{ marginTop: '0.5rem', opacity: 0.5, fontSize: '0.85rem' }}>{content.location} · {content.phone}</p>
      <div className="footer-sub">
        © {new Date().getFullYear()} {content.company}. Demo built by{' '}
        <a href="https://webibi.tech" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', opacity: 1 }}>Webibi.tech</a>
      </div>
    </footer>
  );
}
