import glob
import os

WHATSAPP_CSS = """
<style>
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #25D366;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  box-shadow: 0 4px 20px rgba(37,211,102,0.5);
  z-index: 9999;
  text-decoration: none;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.6); }
  70% { box-shadow: 0 0 0 15px rgba(37,211,102,0); }
  100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
}
</style>
"""

WHATSAPP_HTML = """
<!-- WhatsApp Float Button -->
<a href="https://wa.me/{{AGENCY_WHATSAPP_NUMBER}}?text=Hi!%20I%20saw%20my%20demo%20for%20{{BUSINESS_NAME_ENCODED}}%20and%20want%20the%20full%20website!" 
   class="whatsapp-float" target="_blank">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
  </svg>
  <span>Get This Website</span>
</a>
"""

EXPIRY_BANNER_HTML = """
<!-- Expiry Banner -->
<div id="expiry-banner" style="position:sticky;top:0;z-index:10000;background:#1a1a1a;color:white;text-align:center;padding:10px 16px;font-size:14px;">
  ⏰ This demo expires in <span id="countdown" style="color:#FFD700;font-weight:bold;"></span> — 
  Get your full website at <strong style="color:#FFD700;">20% off!</strong> 
  <a href="https://webibi.tech" style="color:#25D366;text-decoration:underline;">webibi.tech</a> | 
  <a href="tel:{{AGENCY_PHONE}}" style="color:#25D366;">Call us</a>
</div>

<script>
const expiry = new Date({{EXPIRY_TIMESTAMP}});
function updateCountdown() {
  const now = new Date();
  const diff = expiry - now;
  if (diff <= 0) {
    document.getElementById('expiry-banner').innerHTML = '⚠️ This demo has expired. Contact <a href="https://webibi.tech" style="color:#25D366;">webibi.tech</a> to get your website!';
    return;
  }
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
  const secs = Math.floor((diff % (1000*60)) / 1000);
  document.getElementById('countdown').textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
}
updateCountdown();
setInterval(updateCountdown, 1000);
</script>
"""

REVIEWS_SECTION_HTML = """
<!-- Reviews Section -->
<section style="padding:60px 20px;background:#f9f9f9;">
  <h2 style="text-align:center;margin-bottom:32px;font-weight:700;font-size:2rem;color:var(--dark);">⭐ What Our Customers Say</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;max-width:900px;margin:0 auto;">
    
    <div style="background:white;padding:24px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="width:40px;height:40px;border-radius:50%;background:#4f46e5;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">{{REVIEW_1_INITIAL}}</div>
        <div>
          <div style="font-weight:600;color:var(--dark);">{{REVIEW_1_NAME}}</div>
          <div style="color:#FFD700;">★★★★★</div>
        </div>
      </div>
      <p style="color:#555;line-height:1.6;">{{REVIEW_1_TEXT}}</p>
      <div style="font-size:12px;color:#999;margin-top:8px;">Posted on Google</div>
    </div>

    <div style="background:white;padding:24px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="width:40px;height:40px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">{{REVIEW_2_INITIAL}}</div>
        <div>
          <div style="font-weight:600;color:var(--dark);">{{REVIEW_2_NAME}}</div>
          <div style="color:#FFD700;">★★★★★</div>
        </div>
      </div>
      <p style="color:#555;line-height:1.6;">{{REVIEW_2_TEXT}}</p>
      <div style="font-size:12px;color:#999;margin-top:8px;">Posted on Google</div>
    </div>

    <div style="background:white;padding:24px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="width:40px;height:40px;border-radius:50%;background:#f59e0b;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">{{REVIEW_3_INITIAL}}</div>
        <div>
          <div style="font-weight:600;color:var(--dark);">{{REVIEW_3_NAME}}</div>
          <div style="color:#FFD700;">★★★★★</div>
        </div>
      </div>
      <p style="color:#555;line-height:1.6;">{{REVIEW_3_TEXT}}</p>
      <div style="font-size:12px;color:#999;margin-top:8px;">Posted on Google</div>
    </div>

  </div>
</section>
"""

OG_TAGS_HTML = """
<meta property="og:title" content="{{BUSINESS_NAME}} — Free Demo Website" />
<meta property="og:description" content="{{TAGLINE}} | Powered by webibi.tech" />
<meta property="og:image" content="https://demo.webibi.tech/api/og/{{SLUG}}" />
<meta property="og:url" content="https://demo.webibi.tech/demos/{{SLUG}}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
"""

HEARTBEAT_SCRIPT = """
<script>
// Heartbeat tracker — sends ping every 30 seconds while page is open
const slug = '{{SLUG}}';
const businessName = '{{BUSINESS_NAME}}';

async function sendHeartbeat() {
  await fetch('/api/track/heartbeat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ slug, businessName, timestamp: new Date().toISOString() })
  });
}

// Send on load
sendHeartbeat();

// Send every 30 seconds while active
setInterval(sendHeartbeat, 30000);

// Send on page close
window.addEventListener('beforeunload', sendHeartbeat);
</script>
"""

for filepath in glob.glob('templates/shell-*.html'):
    with open(filepath, 'r') as f:
        content = f.read()

    # Avoid duplicate injections
    if "whatsapp-float" in content:
        continue

    # Inject OG Tags before </head>
    content = content.replace("</head>", f"{OG_TAGS_HTML}\n</head>")
    
    # Inject Expiry Banner right after <body>
    content = content.replace("<body>", f"<body>\n{EXPIRY_BANNER_HTML}")
    
    # Inject CSS before </style> or before </head>
    if "</style>" in content:
        content = content.replace("</style>", f"{WHATSAPP_CSS}\n</style>")
    else:
        content = content.replace("</head>", f"{WHATSAPP_CSS}\n</head>")
        
    # Inject Reviews before <footer> or just before script injects at the end
    # Looking for <footer class="footer"> or just footer
    if '<footer' in content:
        content = content.replace("<footer", f"{REVIEWS_SECTION_HTML}\n<footer")
    else:
        # Fallback to appending at bottom of body before scripts
        content = content.replace("</body>", f"{REVIEWS_SECTION_HTML}\n</body>")

    # Inject WhatsApp HTML and Heartbeat script before </body>
    content = content.replace("</body>", f"{WHATSAPP_HTML}\n{HEARTBEAT_SCRIPT}\n</body>")

    with open(filepath, 'w') as f:
        f.write(content)

print("Updated all templates successfully.")
