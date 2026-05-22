import useReveal from '../../hooks/useReveal.js';

const sampleMenu = [
  { name: 'Butter Chicken', description: 'Tender chicken in rich tomato-cream sauce', price: '₹380', category: 'Mains' },
  { name: 'Dal Makhani', description: 'Slow-cooked black lentils, hours of love', price: '₹280', category: 'Mains' },
  { name: 'Paneer Tikka', description: 'Smoky cottage cheese skewers, mint chutney', price: '₹320', category: 'Starters' },
  { name: 'Biryani Royale', description: 'Fragrant basmati with saffron and whole spices', price: '₹450', category: 'Rice' },
  { name: 'Gulab Jamun', description: 'Soft milk-solid balls in rose-cardamom syrup', price: '₹120', category: 'Desserts' },
  { name: 'Masala Chai', description: 'House-blend spiced tea, made fresh every hour', price: '₹80', category: 'Beverages' },
];

export default function RestaurantMenu({ data, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  const menu = data?.menuHighlights || sampleMenu;
  return (
    <section className="section" ref={ref} style={{ background: '#fffdf8' }}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Our Specialties</span>
          <h2 className="section-title" style={{ color: secondaryColor || '#1a1a2e' }}>Menu Highlights</h2>
          <div className="gold-line" style={{ background: primaryColor }} />
        </div>
        <div className="grid-2 reveal" style={{ gap: '0' }}>
          {menu.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.2rem', color: secondaryColor || '#1a1a2e' }}>{item.name}</span>
                  <span style={{ fontSize: '0.7rem', background: `${primaryColor}15`, color: primaryColor, padding: '0.2rem 0.6rem', borderRadius: 100, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.category}</span>
                </div>
                <p style={{ fontFamily: `'${fontBody}', sans-serif`, fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
              <div style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.3rem', color: primaryColor, whiteSpace: 'nowrap' }}>{item.price}</div>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a href="#contact" className="cta-btn" style={{ background: primaryColor }}>Reserve a Table</a>
        </div>
      </div>
    </section>
  );
}
