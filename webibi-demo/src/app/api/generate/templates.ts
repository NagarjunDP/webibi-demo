export function getTemplate(industry: string, data: any) {
  const { name, city, tagline, phone, extractedColors, primaryColor, logoDataUrl } = data;
  const brandColor = primaryColor || '#7c5cfc';
  const defaultTagline = tagline || `Experience the best in ${city}`;

  switch (industry) {
    case 'gym':
      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Premium Fitness</title>
    <link href="https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        :root { --brand: ${brandColor}; --bg: #09090b; --text: #fafafa; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
        h1, h2, h3 { font-family: 'Teko', sans-serif; text-transform: uppercase; margin: 0; line-height: 0.9; }
        .nav { padding: 1.5rem 5%; display: flex; justify-content: space-between; align-items: center; position: fixed; width: 100%; z-index: 50; background: rgba(9,9,11,0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .logo { height: 45px; }
        .hero { height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 0 5%; position: relative; background: linear-gradient(to right, rgba(9,9,11,0.95) 20%, rgba(9,9,11,0.4)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80') center/cover; }
        .hero-content { z-index: 2; max-width: 800px; }
        .hero h1 { font-size: clamp(5rem, 15vw, 10rem); color: transparent; -webkit-text-stroke: 2px rgba(255,255,255,0.2); position: relative; }
        .hero h1 span { color: var(--brand); -webkit-text-stroke: 0; display: block; margin-top: -10px; text-shadow: 0 0 40px var(--brand); }
        .hero p { font-size: 1.25rem; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; color: #fff; margin: 2rem 0; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .btn { display: inline-flex; align-items: center; justify-content: center; padding: 1.2rem 3rem; background: var(--brand); color: #000; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 1.1rem; clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%); transition: all 0.3s; box-shadow: 0 0 20px var(--brand); }
        .btn:hover { background: #fff; transform: scale(1.05); box-shadow: 0 0 40px #fff; }
        .stats { display: flex; gap: 4rem; margin-top: 4rem; }
        .stat-item h3 { font-size: 3.5rem; color: var(--brand); text-shadow: 0 0 20px rgba(255,255,255,0.2); }
        .stat-item p { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; color: #aaa; margin-top: 0.5rem; font-weight: 700; }
        .services { padding: 8rem 5%; background: #000; }
        .section-header { text-align: center; margin-bottom: 5rem; }
        .section-header h2 { font-size: 5rem; color: var(--brand); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .card { background: #111; padding: 3rem; position: relative; overflow: hidden; border: 1px solid #222; transition: all 0.4s; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--brand); transform: scaleY(0); transition: transform 0.4s; transform-origin: bottom; box-shadow: 0 0 20px var(--brand); }
        .card:hover { transform: translateY(-10px); background: #151515; border-color: var(--brand); box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
        .card:hover::before { transform: scaleY(1); }
        .card h3 { font-size: 2.5rem; margin-bottom: 1rem; color: #fff; }
        .card p { color: #aaa; line-height: 1.6; }
        footer { padding: 4rem 5%; border-top: 1px solid #222; text-align: center; background: #050505; }
        footer .logo { filter: grayscale(1); opacity: 0.3; margin-bottom: 2rem; }
    </style>
</head>
<body>
    <nav class="nav">
        <img src="${logoDataUrl}" alt="${name}" class="logo">
        <a href="tel:${phone}" class="btn" style="padding: 0.8rem 2rem; font-size: 0.9rem; box-shadow: none;">Join Now</a>
    </nav>
    <section class="hero">
        <div class="hero-content">
            <h1>NO EXCUSES<br><span>${name}</span></h1>
            <p>${defaultTagline}</p>
            <a href="tel:${phone}" class="btn">Start Free Trial</a>
            <div class="stats">
                <div class="stat-item"><h3>24/7</h3><p>Access</p></div>
                <div class="stat-item"><h3>50+</h3><p>Classes/Week</p></div>
                <div class="stat-item"><h3>100%</h3><p>Results</p></div>
            </div>
        </div>
    </section>
    <section class="services">
        <div class="section-header">
            <h2>OUR PROGRAMS</h2>
        </div>
        <div class="grid">
            <div class="card">
                <h3>Strength & Power</h3>
                <p>Olympic lifting platforms, premium free weights, and powerlifting zones designed for serious gains.</p>
            </div>
            <div class="card">
                <h3>High Intensity</h3>
                <p>Heart-pounding HIIT sessions that burn maximum calories and push your cardiovascular limits.</p>
            </div>
            <div class="card">
                <h3>Recovery Zone</h3>
                <p>State-of-the-art cold plunges, infrared saunas, and mobility tools to keep you in peak condition.</p>
            </div>
        </div>
    </section>
    <footer>
        <img src="${logoDataUrl}" alt="${name}" class="logo">
        <p style="color: #444; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem;">&copy; 2026 ${name}. ${city}.</p>
    </footer>
</body>
</html>`;

    case 'restaurant':
      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Exquisite Dining</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root { --brand: ${brandColor}; --bg: #0a0908; --text: #f4f1de; }
        body { margin: 0; font-family: 'Jost', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
        h1, h2, h3 { font-family: 'Playfair Display', serif; font-weight: 400; margin: 0; }
        .nav { padding: 2rem 5%; display: flex; justify-content: space-between; align-items: center; position: absolute; width: 100%; z-index: 50; }
        .logo { height: 60px; filter: drop-shadow(0 2px 10px rgba(0,0,0,0.5)); }
        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; position: relative; }
        .hero-bg { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80') center/cover; filter: brightness(0.5); z-index: -1; }
        .hero-content { max-width: 800px; padding: 4rem; background: rgba(10, 9, 8, 0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .hero-content p.subtitle { font-size: 1rem; text-transform: uppercase; letter-spacing: 5px; color: var(--brand); margin-bottom: 1.5rem; }
        .hero h1 { font-size: clamp(3rem, 8vw, 6rem); line-height: 1.1; margin-bottom: 2rem; text-shadow: 0 4px 20px rgba(0,0,0,0.8); }
        .btn { display: inline-block; padding: 1.2rem 3rem; background: var(--brand); color: #fff; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; transition: all 0.4s; border-radius: 2px; }
        .btn:hover { background: #fff; color: #000; box-shadow: 0 0 30px rgba(255,255,255,0.3); }
        .section { padding: 8rem 5%; max-width: 1200px; margin: 0 auto; }
        .menu-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; margin-top: 4rem; }
        @media(min-width: 768px) { .menu-grid { grid-template-columns: 1fr 1fr; } }
        .menu-category h2 { font-size: 2.5rem; color: var(--brand); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 2rem; }
        .menu-item { margin-bottom: 2.5rem; }
        .menu-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; }
        .menu-header h3 { font-size: 1.4rem; letter-spacing: 1px; color: #fff; }
        .menu-header .dots { flex-grow: 1; border-bottom: 1px dotted rgba(255,255,255,0.2); margin: 0 1rem; position: relative; top: -5px; }
        .menu-header .price { color: var(--brand); font-size: 1.3rem; font-family: 'Playfair Display', serif; }
        .menu-desc { color: #aaa; font-size: 1rem; line-height: 1.6; }
        .image-banner { height: 60vh; background: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80') center/cover fixed; position: relative; display: flex; align-items: center; justify-content: center; }
        .image-banner::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.6); }
        .banner-text { position: relative; z-index: 1; text-align: center; }
        .banner-text h2 { font-size: 4rem; margin-bottom: 1rem; color: #fff; }
        footer { padding: 4rem 5%; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
    </style>
</head>
<body>
    <nav class="nav">
        <img src="${logoDataUrl}" alt="${name}" class="logo">
        <a href="tel:${phone}" style="color: #fff; text-decoration: none; letter-spacing: 2px; text-transform: uppercase; font-size: 0.9rem; border-bottom: 1px solid var(--brand); padding-bottom: 5px;">Reservations</a>
    </nav>
    <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
            <p class="subtitle">${city}'s finest dining</p>
            <h1>${name}</h1>
            <p style="font-size: 1.2rem; line-height: 1.8; color: #eee; margin-bottom: 3rem;">${defaultTagline}</p>
            <a href="#menu" class="btn">Discover Menu</a>
        </div>
    </section>
    <section id="menu" class="section">
        <div class="menu-grid">
            <div class="menu-category">
                <h2>Starters</h2>
                <div class="menu-item">
                    <div class="menu-header"><h3>Truffle Burrata</h3><div class="dots"></div><span class="price">$24</span></div>
                    <p class="menu-desc">Heirloom tomatoes, aged balsamic, fresh basil, grilled sourdough</p>
                </div>
                <div class="menu-item">
                    <div class="menu-header"><h3>Wagyu Carpaccio</h3><div class="dots"></div><span class="price">$32</span></div>
                    <p class="menu-desc">Shaved black truffle, parmesan crisps, dijon emulsion</p>
                </div>
            </div>
            <div class="menu-category">
                <h2>Mains</h2>
                <div class="menu-item">
                    <div class="menu-header"><h3>Pan-Seared Halibut</h3><div class="dots"></div><span class="price">$48</span></div>
                    <p class="menu-desc">Saffron beurre blanc, charred asparagus, pomme purée</p>
                </div>
                <div class="menu-item">
                    <div class="menu-header"><h3>Dry-Aged Ribeye</h3><div class="dots"></div><span class="price">$65</span></div>
                    <p class="menu-desc">Roasted garlic, wild mushrooms, signature red wine reduction</p>
                </div>
            </div>
        </div>
    </section>
    <div class="image-banner">
        <div class="banner-text">
            <h2>An Unforgettable Experience</h2>
            <a href="tel:${phone}" class="btn" style="margin-top: 2rem;">Book a Table</a>
        </div>
    </div>
    <footer>
        <img src="${logoDataUrl}" alt="${name}" class="logo" style="margin-bottom: 2rem; filter: grayscale(1); opacity: 0.5;">
        <p style="color: #666; font-size: 0.9rem;">${phone} &nbsp;|&nbsp; ${city}</p>
    </footer>
</body>
</html>`;

    case 'events':
      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Extraordinary Events</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root { --brand: ${brandColor}; --bg: #050505; --text: #ffffff; }
        body { margin: 0; font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
        h1, h2, h3 { font-family: 'Syne', sans-serif; margin: 0; }
        .nav { padding: 1.5rem 5%; display: flex; justify-content: space-between; align-items: center; position: fixed; width: 100%; z-index: 100; background: rgba(5,5,5,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .logo { height: 40px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.2)); }
        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: space-between; padding: 0 5%; position: relative; overflow: hidden; }
        .hero-shapes { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .shape-1 { position: absolute; top: -10%; right: -5%; width: 50vw; height: 50vw; border-radius: 50%; background: var(--brand); filter: blur(120px); opacity: 0.4; animation: float 10s ease-in-out infinite; }
        .shape-2 { position: absolute; bottom: -20%; left: -10%; width: 60vw; height: 60vw; border-radius: 50%; background: var(--brand); filter: blur(150px); opacity: 0.3; animation: float 15s ease-in-out infinite reverse; }
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-50px) scale(1.1); } }
        .hero-content { z-index: 1; max-width: 650px; }
        .hero h1 { font-size: clamp(4rem, 8vw, 7rem); line-height: 1; letter-spacing: -2px; margin-bottom: 1.5rem; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .hero h1 span { color: var(--brand); text-shadow: 0 0 40px var(--brand); }
        .hero p { font-size: 1.3rem; color: #ccc; margin-bottom: 2.5rem; line-height: 1.6; }
        .btn { display: inline-flex; align-items: center; padding: 1.2rem 2.5rem; background: var(--brand); color: #000; text-decoration: none; border-radius: 100px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s; box-shadow: 0 0 20px var(--brand); }
        .btn:hover { background: #fff; box-shadow: 0 0 40px #fff; transform: translateY(-3px); }
        .hero-image { z-index: 1; width: 45%; height: 70vh; border-radius: 30px; background: url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80') center/cover; box-shadow: 0 30px 60px rgba(0,0,0,0.5); display: none; border: 1px solid rgba(255,255,255,0.1); }
        @media(min-width: 992px) { .hero-image { display: block; } }
        .features { padding: 8rem 5%; position: relative; z-index: 2; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; }
        .feature-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); padding: 3rem; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); transition: transform 0.3s, border-color 0.3s; }
        .feature-card:hover { transform: translateY(-10px); border-color: var(--brand); background: rgba(255,255,255,0.05); box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
        .f-icon { width: 70px; height: 70px; border-radius: 20px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1.5rem; color: var(--brand); text-shadow: 0 0 10px var(--brand); }
        .feature-card h3 { font-size: 2rem; margin-bottom: 1rem; color: #fff; }
        .feature-card p { color: #aaa; line-height: 1.7; }
        .marquee { background: var(--brand); padding: 2.5rem 0; overflow: hidden; white-space: nowrap; box-shadow: 0 0 50px var(--brand); position: relative; z-index: 10; }
        .marquee span { font-family: 'Syne', sans-serif; font-size: 3.5rem; font-weight: 800; color: #000; text-transform: uppercase; margin-right: 2rem; display: inline-block; animation: scroll 20s linear infinite; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        footer { padding: 5rem 5%; text-align: center; position: relative; z-index: 2; border-top: 1px solid rgba(255,255,255,0.05); }
    </style>
</head>
<body>
    <nav class="nav">
        <img src="${logoDataUrl}" alt="${name}" class="logo">
        <a href="tel:${phone}" class="btn" style="padding: 0.8rem 1.5rem; font-size: 0.9rem; box-shadow: none;">Contact</a>
    </nav>
    <section class="hero">
        <div class="hero-shapes">
            <div class="shape-1"></div>
            <div class="shape-2"></div>
        </div>
        <div class="hero-content">
            <h1>We design <br><span>moments.</span></h1>
            <p>${defaultTagline}. From intimate gatherings to massive corporate events, we turn your vision into an unforgettable reality.</p>
            <a href="tel:${phone}" class="btn">Start Planning <span>&rarr;</span></a>
        </div>
        <div class="hero-image"></div>
    </section>
    <div class="marquee">
        <span>WEDDINGS • CORPORATE • GALAS • PRIVATE PARTIES • PRODUCT LAUNCHES • </span>
        <span>WEDDINGS • CORPORATE • GALAS • PRIVATE PARTIES • PRODUCT LAUNCHES • </span>
    </div>
    <section class="features">
        <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: 4rem; text-shadow: 0 0 20px rgba(255,255,255,0.1);">Our Expertise</h2>
        </div>
        <div class="features-grid">
            <div class="feature-card">
                <div class="f-icon">01</div>
                <h3>Design & Styling</h3>
                <p>Bespoke visual concepts, floral arrangements, and atmospheric lighting that perfectly capture your unique aesthetic.</p>
            </div>
            <div class="feature-card">
                <div class="f-icon">02</div>
                <h3>Coordination</h3>
                <p>Flawless day-of execution and vendor management so you can actually enjoy your own event without stress.</p>
            </div>
            <div class="feature-card">
                <div class="f-icon">03</div>
                <h3>Production</h3>
                <p>Top-tier audio, visual, and staging production for corporate summits, concerts, and large-scale galas.</p>
            </div>
        </div>
    </section>
    <footer>
        <img src="${logoDataUrl}" alt="${name}" style="height: 50px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.5)); margin-bottom: 2rem;">
        <h2 style="font-size: 2.5rem;">Ready to create magic?</h2>
        <p style="color: #888; margin-top: 1rem; font-size: 1.2rem;">Call us at ${phone}</p>
    </footer>
</body>
</html>`;

    case 'salon':
      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Luxury Spa & Salon</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Lato:wght@300;400&display=swap" rel="stylesheet">
    <style>
        :root { --brand: ${brandColor}; --bg: #11100F; --text: #F8F5F2; }
        body { margin: 0; font-family: 'Lato', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
        h1, h2, h3 { font-family: 'Cinzel', serif; font-weight: 400; text-align: center; margin: 0; }
        .nav { padding: 2rem 5%; display: flex; justify-content: center; position: absolute; width: 100%; z-index: 10; }
        .logo { height: 70px; filter: drop-shadow(0 0 20px rgba(255,255,255,0.2)); }
        .hero { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 5%; background: linear-gradient(rgba(17,16,15,0.6), rgba(17,16,15,0.9)), url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80') center/cover; position: relative; }
        .hero h1 { font-size: clamp(3.5rem, 8vw, 6rem); color: #fff; margin-bottom: 1rem; letter-spacing: 4px; text-shadow: 0 10px 30px rgba(0,0,0,0.8); }
        .hero p { font-size: 1.2rem; color: #ccc; max-width: 600px; line-height: 1.8; margin-bottom: 3rem; font-weight: 300; }
        .btn { display: inline-block; padding: 1.2rem 3rem; background: transparent; border: 1px solid var(--brand); color: var(--brand); text-decoration: none; text-transform: uppercase; letter-spacing: 3px; font-size: 0.9rem; transition: all 0.4s; backdrop-filter: blur(10px); }
        .btn:hover { background: var(--brand); color: #fff; box-shadow: 0 0 30px var(--brand); }
        .services { padding: 8rem 5%; max-width: 1200px; margin: 0 auto; }
        .services h2 { font-size: 3.5rem; margin-bottom: 5rem; color: #fff; }
        .services h2 span { color: var(--brand); font-style: italic; }
        .s-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 4rem; }
        .s-card { text-align: center; transition: transform 0.4s; }
        .s-card:hover { transform: translateY(-10px); }
        .img-wrapper { position: relative; width: 100%; aspect-ratio: 4/5; overflow: hidden; margin-bottom: 2rem; border-radius: 100px 100px 0 0; }
        .img-wrapper::after { content: ''; position: absolute; inset: 0; background: var(--brand); opacity: 0; transition: opacity 0.4s; mix-blend-mode: color; }
        .s-card:hover .img-wrapper::after { opacity: 0.5; }
        .s-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
        .s-card:hover .s-img { transform: scale(1.1); }
        .s-card h3 { font-size: 2rem; margin-bottom: 1rem; color: #fff; }
        .s-card p { color: #aaa; line-height: 1.7; font-weight: 300; }
        .book-banner { background: url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80') center/cover fixed; color: #fff; text-align: center; position: relative; padding: 8rem 5%; }
        .book-banner::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.7); }
        .banner-content { position: relative; z-index: 1; }
        .book-banner h2 { font-size: 4rem; margin-bottom: 1rem; }
        footer { padding: 4rem 5%; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
    </style>
</head>
<body>
    <nav class="nav">
        <img src="${logoDataUrl}" alt="${name}" class="logo">
    </nav>
    <section class="hero">
        <h1>${name}</h1>
        <p>${defaultTagline}. A sanctuary of beauty and relaxation designed to elevate your senses and renew your spirit.</p>
        <a href="tel:${phone}" class="btn">Book an Appointment</a>
    </section>
    <section class="services">
        <h2>Our <span>Rituals</span></h2>
        <div class="s-grid">
            <div class="s-card">
                <div class="img-wrapper">
                    <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80" alt="Hair" class="s-img">
                </div>
                <h3>Hair Artistry</h3>
                <p>Bespoke coloring, precision cuts, and revitalizing treatments tailored to your unique aesthetic.</p>
            </div>
            <div class="s-card">
                <div class="img-wrapper">
                    <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80" alt="Skin" class="s-img">
                </div>
                <h3>Skin Therapy</h3>
                <p>Advanced facial treatments using premium botanicals to restore your natural, radiant glow.</p>
            </div>
            <div class="s-card">
                <div class="img-wrapper">
                    <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80" alt="Massage" class="s-img">
                </div>
                <h3>Body Wellness</h3>
                <p>Deep tissue and relaxation massages designed to melt away stress and realign your energy.</p>
            </div>
        </div>
    </section>
    <div class="book-banner">
        <div class="banner-content">
            <h2>Experience True Luxury</h2>
            <p style="margin-bottom: 3rem; color: #ccc; font-size: 1.2rem; font-weight: 300;">Visit us in ${city}</p>
            <a href="tel:${phone}" class="btn" style="background: var(--brand); color: #fff; border-color: var(--brand);">Call ${phone}</a>
        </div>
    </div>
    <footer>
        <p style="color: #666;">&copy; 2026 ${name}. All rights reserved.</p>
    </footer>
</body>
</html>`;

    default:
      // An INSANELY premium Corporate/Clinic/Real Estate layout
      return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | ${city}</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --brand: ${brandColor}; --bg: #0B0F19; --text: #f8fafc; }
        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
        h1, h2, h3 { margin: 0; }
        .nav { padding: 1.5rem 5%; background: rgba(11,15,25,0.7); backdrop-filter: blur(20px); display: flex; justify-content: space-between; align-items: center; position: fixed; width: 100%; top: 0; z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.05); box-sizing: border-box; }
        .logo { height: 50px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.2)); }
        
        /* Premium Hero Section */
        .hero { min-height: 100vh; padding: 0 5%; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; }
        .hero-bg-img { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80') center/cover; opacity: 0.3; z-index: 0; mix-blend-mode: overlay; }
        .hero-glow { position: absolute; top: -20%; right: -10%; width: 60vw; height: 60vw; background: var(--brand); filter: blur(150px); opacity: 0.4; border-radius: 50%; z-index: 0; animation: pulse 8s ease-in-out infinite alternate; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.3; } 100% { transform: scale(1.1); opacity: 0.5; } }
        
        .hero-content { z-index: 2; max-width: 650px; margin-top: 5rem; }
        .hero h1 { font-size: clamp(3.5rem, 6vw, 6rem); font-weight: 700; letter-spacing: -2px; line-height: 1.1; margin-bottom: 1.5rem; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .hero h1 span { background: linear-gradient(135deg, #fff 0%, var(--brand) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.3rem; color: #cbd5e1; line-height: 1.7; margin-bottom: 2.5rem; max-width: 550px; font-weight: 300; }
        
        .btn-group { display: flex; gap: 1rem; }
        .btn { display: inline-flex; align-items: center; padding: 1.2rem 2.5rem; border-radius: 12px; font-weight: 600; text-decoration: none; transition: all 0.3s; font-size: 1.1rem; }
        .btn-primary { background: var(--brand); color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.3), 0 0 20px var(--brand); }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(0,0,0,0.4), 0 0 40px var(--brand); filter: brightness(1.2); }
        .btn-secondary { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }
        
        /* Floating Glass Card */
        .glass-card { position: relative; z-index: 2; background: rgba(255,255,255,0.03); backdrop-filter: blur(24px); padding: 3rem; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2); max-width: 400px; width: 100%; display: none; }
        @media(min-width: 1024px) { .glass-card { display: block; } }
        .glass-card::before { content: ''; position: absolute; inset: 0; border-radius: 30px; padding: 2px; background: linear-gradient(135deg, rgba(255,255,255,0.4), transparent); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
        .glass-card h3 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .glass-card p { color: #94a3b8; font-size: 1rem; margin-bottom: 2rem; line-height: 1.5; }
        .mock-field { height: 50px; background: rgba(0,0,0,0.2); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1rem; display: flex; align-items: center; padding: 0 1rem; color: #64748b; font-size: 0.9rem; }
        .mock-btn { height: 50px; background: var(--brand); border-radius: 12px; margin-top: 1.5rem; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #fff; box-shadow: 0 0 15px var(--brand); }

        /* Features Section */
        .features { padding: 10rem 5%; background: #0B0F19; position: relative; z-index: 5; }
        .section-tag { display: inline-block; padding: 0.5rem 1.2rem; background: rgba(255,255,255,0.05); color: var(--brand); border-radius: 100px; font-weight: 600; font-size: 0.85rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 2px; border: 1px solid rgba(255,255,255,0.1); }
        .features h2 { font-size: 4rem; font-weight: 700; margin: 0 0 5rem 0; letter-spacing: -1px; text-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .f-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; }
        .f-card { padding: 3rem; background: rgba(255,255,255,0.02); border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.4s; position: relative; overflow: hidden; }
        .f-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at top right, var(--brand), transparent 70%); opacity: 0; transition: opacity 0.4s; z-index: 0; }
        .f-card:hover { transform: translateY(-10px); border-color: rgba(255,255,255,0.2); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .f-card:hover::before { opacity: 0.1; }
        .f-card-content { position: relative; z-index: 1; }
        .f-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--brand); text-shadow: 0 0 15px var(--brand); }
        .f-card h3 { font-size: 1.6rem; margin: 0 0 1rem 0; }
        .f-card p { color: #94a3b8; line-height: 1.7; font-weight: 300; }
        
        footer { padding: 4rem 5%; background: #05070A; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
        footer p { color: #64748b; font-size: 0.95rem; }
    </style>
</head>
<body>
    <nav class="nav">
        <img src="${logoDataUrl}" alt="${name}" class="logo">
        <a href="tel:${phone}" class="btn btn-primary" style="padding: 0.8rem 2rem; font-size: 0.9rem; box-shadow: none;">Contact Us</a>
    </nav>
    <section class="hero">
        <div class="hero-bg-img"></div>
        <div class="hero-glow"></div>
        <div class="hero-content">
            <h1>Expertise you can <br><span>trust completely.</span></h1>
            <p>${defaultTagline}. We deliver exceptional results with uncompromising quality and dedicated support for top-tier clients in ${city}.</p>
            <div class="btn-group">
                <a href="tel:${phone}" class="btn btn-primary">Book Consultation</a>
                <a href="#services" class="btn btn-secondary">Learn More</a>
            </div>
        </div>
        
        <!-- Premium Floating UI Element -->
        <div class="glass-card">
            <h3>Quick Inquiry</h3>
            <p>Schedule a priority call with our executive team today.</p>
            <div class="mock-field">Full Name</div>
            <div class="mock-field">Email Address</div>
            <div class="mock-field">Project Details</div>
            <div class="mock-btn">Send Request</div>
        </div>
    </section>
    
    <section id="services" class="features">
        <span class="section-tag">Why Choose Us</span>
        <h2>Elevating Standards</h2>
        <div class="f-grid">
            <div class="f-card">
                <div class="f-card-content">
                    <div class="f-icon">✦</div>
                    <h3>Industry Leading Expertise</h3>
                    <p>Our team consists of top-tier professionals dedicated to delivering outcomes that exceed expectations at every single milestone.</p>
                </div>
            </div>
            <div class="f-card">
                <div class="f-card-content">
                    <div class="f-icon">◈</div>
                    <h3>Uncompromising Quality</h3>
                    <p>We adhere to the highest standards of excellence in every single project, ensuring absolute satisfaction and precision.</p>
                </div>
            </div>
            <div class="f-card">
                <div class="f-card-content">
                    <div class="f-icon">◎</div>
                    <h3>Dedicated Support</h3>
                    <p>Available around the clock to provide unparalleled guidance, answer critical questions, and ensure a seamless experience.</p>
                </div>
            </div>
        </div>
    </section>
    
    <footer>
        <img src="${logoDataUrl}" alt="${name}" style="height: 30px; filter: grayscale(1); opacity: 0.5;">
        <p>&copy; 2026 ${name}. ${phone}.</p>
    </footer>
</body>
</html>`;
  }
}
