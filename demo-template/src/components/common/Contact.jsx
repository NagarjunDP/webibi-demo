import { useState } from 'react';

const WEBIBI_OWNER_PHONE = '919876543210';

export default function Contact({ content }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const phone = content.phone?.replace(/[^0-9]/g, '') || WEBIBI_OWNER_PHONE;

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Hi ${content.company}!\n\nName: ${form.name}\nPhone: ${form.phone}\nMessage: ${form.message}`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <section id="contact">
      <div className="contact-section">
        {/* Left: Info */}
        <div className="contact-info">
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Get In Touch</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#fff', marginBottom: '2rem', lineHeight: 1.05 }}>
            {content.ctaText}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.7 }}>
            {content.ctaSubtext}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📞</span>
              <div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.25rem' }}>Call Us</div>
                <a href={`tel:${content.phone}`} style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{content.phone}</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📍</span>
              <div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.25rem' }}>Location</div>
                <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{content.location}</span>
              </div>
            </div>
            <a
              href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${content.company}! I'd like to connect.`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#25D366', color: '#fff', padding: '1rem 2rem', borderRadius: '4px', fontWeight: 700, marginTop: '1rem', width: 'fit-content', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Message on WhatsApp
            </a>
          </div>
        </div>

        {/* Right: Form */}
        <div className="contact-form">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem,3vw,2.5rem)', marginBottom: '2rem', color: 'var(--color-secondary)' }}>Send a Message</h3>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f0fdf4', borderRadius: '12px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#166534' }}>Message Sent!</h4>
              <p style={{ color: '#166534', marginTop: '0.5rem' }}>We've opened WhatsApp with your message. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" required placeholder="Enter your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea required placeholder="Tell us about what you need..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit" className="submit-btn">Send via WhatsApp →</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
