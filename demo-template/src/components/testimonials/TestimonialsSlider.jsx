import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useReveal from '../../hooks/useReveal.js';

const Stars = ({ n = 5, color }) => Array.from({ length: n }).map((_, i) => <span key={i} style={{ color }}>★</span>);

export default function TestimonialsSlider({ testimonials, primaryColor, secondaryColor, fontHeading, fontBody }) {
  const ref = useReveal();
  return (
    <section className="section" style={{ background: '#fafafa' }} ref={ref}>
      <div className="container">
        <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
          <span className="eyebrow" style={{ color: primaryColor }}>Client Love</span>
          <h2 className="section-title" style={{ color: secondaryColor || '#1a1a2e' }}>What People Say</h2>
          <div className="gold-line" style={{ background: primaryColor }} />
        </div>
        <div className="reveal">
          <Swiper modules={[Autoplay, Pagination]} spaceBetween={30} slidesPerView={1} pagination={{ clickable: true }} autoplay={{ delay: 4500, disableOnInteraction: false }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} style={{ paddingBottom: '3rem' }}>
            {testimonials?.map((t, i) => (
              <SwiperSlide key={i}>
                <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '1rem', color: primaryColor }}><Stars n={t.rating || 5} color={primaryColor} /></div>
                  <p style={{ fontFamily: `'${fontBody}', sans-serif`, color: 'rgba(0,0,0,0.7)', lineHeight: 1.8, fontSize: '0.95rem', flex: 1, fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                    <div style={{ fontFamily: `'${fontHeading}', serif`, fontSize: '1.1rem', color: secondaryColor || '#1a1a2e' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{t.role}</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
