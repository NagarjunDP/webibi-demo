import { useState, useEffect } from 'react';

const WEBIBI_OWNER_PHONE = '919876543210'; // ← Change this to your number

export default function WeibiBanner({ content }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => { if (!visible) document.body.style.marginTop = '0'; }, [visible]);
  if (!visible) return null;
  const waMsg = encodeURIComponent(`Hi, I saw the demo for ${content.company} and I'm interested in getting a website. Can we talk?`);
  return (
    <div className="webibi-banner">
      <span>🎨 Free demo for <strong>{content.company}</strong> by Webibi</span>
      <span className="webibi-expiry">· Valid 7 days ·</span>
      <a href={`https://wa.me/${WEBIBI_OWNER_PHONE}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="wa-btn">
        Want this live? → WhatsApp
      </a>
      <span className="close-btn" onClick={() => setVisible(false)}>✕</span>
    </div>
  );
}
