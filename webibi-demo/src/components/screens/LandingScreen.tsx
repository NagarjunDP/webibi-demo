"use client";

import { useEffect, useRef, useState } from "react";
import { FlowState } from "@/app/page";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
}

// ── Ticker ────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "🍽️ The Spicery Indian Bistro, Bengaluru  ✅ Live",
  "✂️ Glamour Salon, Hassan  ✅ Live",
  "🏋️ Iron Fist Fitness, Mysuru  ✅ Live",
  "🩺 Healthfirst Clinic, Mangaluru  ✅ Live",
  "📚 Bright Future Academy, Hubli  ✅ Live",
  "🏨 Serenity Hotel & Stays, Belagavi  ✅ Live",
  "⚖️ Apex Legal & Partners, Bengaluru  ✅ Live",
  "🎉 Dream Events Co., Dharwad  ✅ Live",
];

// ── Steps ─────────────────────────────────────────────────────────────────────
const STEPS = [
  { num: "01", title: "Upload Your Logo", desc: "Tap and upload your business logo — that's the only input we need." },
  { num: "02", title: "AI Builds It",     desc: "Our AI writes copy, picks your colour palette and designs every section." },
  { num: "03", title: "Share the Link",   desc: "Receive a live URL in under 20 seconds. Share it on WhatsApp instantly." },
];

// ── Industries ────────────────────────────────────────────────────────────────
const INDUSTRIES = [
  { emoji: "🍽️", name: "Restaurant" },
  { emoji: "🏋️", name: "Gym & Fitness" },
  { emoji: "✂️",  name: "Salon & Spa" },
  { emoji: "🩺",  name: "Clinic" },
  { emoji: "⚖️",  name: "Law Firm" },
  { emoji: "🎉",  name: "Events" },
  { emoji: "🏢",  name: "Real Estate" },
  { emoji: "📚",  name: "Education" },
  { emoji: "🏨",  name: "Hotel & Stay" },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "Got 3 new customers in the first week after launching my demo website!",
    name: "Priya S.",
    role: "Salon Owner, Bengaluru",
  },
  {
    quote: "My restaurant now appears when people search online. Orders have increased!",
    name: "Ravi M.",
    role: "Restaurant Owner, Hassan",
  },
  {
    quote: "Very professional website. Patients trust us more now when they find us online.",
    name: "Dr. Sharma",
    role: "Clinic Owner, Mysuru",
  },
];

// ── Colour tokens (blue-only palette) ─────────────────────────────────────────
const C = {
  bg:        "#070d1a",   // deepest navy
  bg2:       "#0b1425",   // section bg
  bg3:       "#0f1e38",   // card bg
  border:    "#1a2d4d",   // subtle border
  border2:   "#1e3a5f",   // slightly lighter
  accent:    "#2563eb",   // primary blue
  accent2:   "#3b82f6",   // medium blue
  accentLt:  "#93c5fd",   // light blue (text highlights)
  muted:     "#64748b",   // muted slate
  body:      "#94a3b8",   // body text
  white:     "#f1f5f9",   // near-white
  wa:        "#25D366",   // WhatsApp green (kept)
};

// ── Shared button style ───────────────────────────────────────────────────────
const primaryBtn: React.CSSProperties = {
  width: "100%",
  maxWidth: "380px",
  height: "56px",
  background: C.accent,
  borderRadius: "12px",
  border: "none",
  color: "#fff",
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  letterSpacing: "0.01em",
  transition: "background 0.2s ease, transform 0.15s ease",
};

// ─────────────────────────────────────────────────────────────────────────────
export default function LandingScreen({ state, updateState }: Props) {
  const [showStickyBar, setShowStickyBar] = useState(false);

  // ── phone.email: set callback + load script ───────────────────────────────
  useEffect(() => {
    (window as any).phoneEmailListener = async function (userObj: any) {
      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userJsonUrl: userObj?.user_json_url,
            phoneNumber: "+16505553434",
            code: "654321",
            sessionInfo: null,
            mockMode: true,
          }),
        });
        const data = await res.json();
        if (data.redirectUrl) { window.location.href = data.redirectUrl; return; }
      } catch (err) {
        console.error("phone.email verify error", err);
      }
      updateState({ userData: { phoneOrEmail: "verified-phone", verified: true }, step: "category" });
    };

    if (!document.getElementById("phone-email-script")) {
      const s = document.createElement("script");
      s.id = "phone-email-script";
      s.src = "https://www.phone.email/sign_in_button_v1.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [updateState]);

  // ── Sticky bar on scroll ──────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Fade-up intersection observer ─────────────────────────────────────────
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Click the hidden phone.email button ───────────────────────────────────
  const triggerSignIn = () => {
    const btn = document.querySelector(
      "#pe-hidden-btn .pe_signin_button a, #pe-hidden-btn .pe_signin_button button, #pe-hidden-btn .pe_signin_button div[role='button']"
    ) as HTMLElement | null;
    if (btn) btn.click();
    else (document.querySelector("#pe-hidden-btn .pe_signin_button") as HTMLElement | null)?.click();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.bg, color: C.white, fontFamily: "var(--font-dm-sans), system-ui, sans-serif", overflowX: "hidden" }}>

      {/* ════════════════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: C.bg, position: "relative", overflow: "hidden" }}>

        {/* Blob 1 — purple, top-right */}
        <div style={{
          position: "absolute", top: "-60px", right: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
          animation: "blobFloat1 14s ease-in-out infinite",
        }} />

        {/* Blob 2 — blue, bottom-left */}
        <div style={{
          position: "absolute", bottom: "60px", left: "-60px",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
          animation: "blobFloat2 18s ease-in-out infinite",
        }} />

        {/* Nav */}
        <nav style={{ position: "relative", zIndex: 10, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="/assets/logoo.png"
            alt="Webibi"
            style={{ height: "40px", objectFit: "contain", filter: "drop-shadow(0 0 12px rgba(59,130,246,0.25))" }}
          />
        </nav>

        {/* Hero body */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 24px 40px", textAlign: "center", position: "relative", zIndex: 10 }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "6px 14px", borderRadius: "100px", marginBottom: "28px",
            background: "rgba(37,99,235,0.1)", border: `1px solid rgba(59,130,246,0.3)`,
            fontSize: "12px", fontWeight: 600, color: C.accentLt, letterSpacing: "0.04em",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent2, display: "inline-block" }} />
            AI-Powered · Ready in 20 seconds
          </div>

          {/* Headline — 2 lines, 42px */}
          <h1 style={{
            fontSize: "42px", fontWeight: 800,
            lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "18px",
            fontFamily: "var(--font-syne), sans-serif",
          }}>
            <span style={{ color: C.white, display: "block" }}>Your Business Deserves</span>
            <span style={{
              display: "block",
              background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>a Website.</span>
          </h1>

          {/* Sub */}
          <p style={{ color: C.body, fontSize: "15px", lineHeight: 1.7, maxWidth: "290px", marginBottom: "10px" }}>
            Upload your logo — we build a stunning demo website instantly. No tech skills needed.
          </p>

          {/* Stars */}
          <p style={{ color: C.muted, fontSize: "13px", marginBottom: "32px" }}>
            <span style={{ color: "#fbbf24" }}>★★★★★</span>{"  "}Loved by 50+ businesses across Karnataka
          </p>

          {/* CTA */}
          <button
            id="hero-cta-btn"
            onClick={triggerSignIn}
            style={{
              ...primaryBtn,
              maxWidth: "340px",
              height: "56px",
              fontSize: "16px",
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              boxShadow: "0 0 28px rgba(124,58,237,0.45), 0 4px 16px rgba(0,0,0,0.3)",
              animation: "ctaGlow 3s ease-in-out infinite",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 44px rgba(124,58,237,0.7), 0 4px 16px rgba(0,0,0,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 28px rgba(124,58,237,0.45), 0 4px 16px rgba(0,0,0,0.3)"; }}
          >
            Get My Free Demo Website
          </button>

          <p style={{ color: C.muted, fontSize: "12px", marginTop: "12px" }}>
            Free forever · No credit card · 20 seconds
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "24px", gap: "4px", position: "relative", zIndex: 10 }}>
          <span style={{ color: C.muted, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Scroll</span>
          <span style={{ color: C.muted, fontSize: "18px", animation: "bounce 2s ease-in-out infinite" }}>↓</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TICKER
          ════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: C.bg2, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        overflow: "hidden", padding: "12px 0",
      }}>
        <div style={{ display: "flex", width: "max-content", animation: "ticker 30s linear infinite" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{
              whiteSpace: "nowrap", padding: "0 32px",
              fontSize: "13px", color: C.body,
              borderRight: `1px solid ${C.border}`,
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, padding: "64px 24px" }}>
        <p className="fade-up" style={{ color: C.accent2, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", marginBottom: "10px" }}>
          How it works
        </p>
        <h2 className="fade-up" style={{
          fontSize: "26px", fontWeight: 800, textAlign: "center", color: C.white,
          letterSpacing: "-0.02em", marginBottom: "40px",
          fontFamily: "var(--font-syne), sans-serif",
        }}>
          Done in 3 steps. Seriously.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {STEPS.map((s, i) => (
            <div key={i} className={`fade-up fade-up-delay-${i + 1}`} style={{
              background: C.bg3, border: `1px solid ${C.border}`,
              borderRadius: "16px", padding: "24px",
              display: "flex", gap: "20px", alignItems: "flex-start",
              transition: "border-color 0.2s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.border2; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
            >
              <span style={{
                fontSize: "13px", fontWeight: 700, color: C.accent2,
                fontFamily: "var(--font-syne), sans-serif",
                background: "rgba(37,99,235,0.12)", border: `1px solid rgba(59,130,246,0.25)`,
                borderRadius: "8px", padding: "4px 8px", flexShrink: 0, marginTop: "2px",
              }}>
                {s.num}
              </span>
              <div>
                <p style={{ color: C.white, fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>{s.title}</p>
                <p style={{ color: C.body, fontSize: "14px", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          INDUSTRIES
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg2, padding: "64px 24px", borderTop: `1px solid ${C.border}` }}>
        <p className="fade-up" style={{ color: C.accent2, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", marginBottom: "10px" }}>
          Industries
        </p>
        <h2 className="fade-up" style={{
          fontSize: "26px", fontWeight: 800, textAlign: "center", color: C.white,
          letterSpacing: "-0.02em", marginBottom: "32px",
          fontFamily: "var(--font-syne), sans-serif",
        }}>
          We build for every business
        </h2>

        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {INDUSTRIES.map((ind, i) => (
            <div key={i} style={{
              background: C.bg3, border: `1px solid ${C.border}`,
              borderRadius: "10px", padding: "12px 14px",
              display: "flex", alignItems: "center", gap: "10px",
              fontSize: "14px", color: C.body, fontWeight: 500,
              cursor: "default", transition: "border-color 0.2s ease, color 0.2s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.body; }}
            >
              <span style={{ fontSize: "18px" }}>{ind.emoji}</span>
              <span>{ind.name}</span>
            </div>
          ))}
        </div>

        <p className="fade-up" style={{ color: C.muted, fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
          + More industries coming soon
        </p>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PHONE MOCKUP
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, padding: "64px 24px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p className="fade-up" style={{ color: C.accent2, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", marginBottom: "10px" }}>
          Live preview
        </p>
        <h2 className="fade-up" style={{
          fontSize: "26px", fontWeight: 800, textAlign: "center", color: C.white,
          letterSpacing: "-0.02em", marginBottom: "36px",
          fontFamily: "var(--font-syne), sans-serif",
        }}>
          This is what your<br />clients will see
        </h2>

        {/* Phone frame */}
        <div className="fade-up" style={{
          width: "210px", height: "420px",
          borderRadius: "34px", background: "#0b1425",
          border: `8px solid #112240`,
          boxShadow: `0 0 0 1px ${C.border}, 0 24px 48px rgba(0,0,0,0.5)`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Notch */}
          <div style={{
            position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)",
            width: "64px", height: "16px", background: "#0b1425",
            borderRadius: "10px", zIndex: 10, border: `2px solid #112240`,
          }} />

          {/* Screen */}
          <div style={{ width: "100%", height: "100%", background: "#050e1c", overflowY: "hidden" }}>
            {/* Site header */}
            <div style={{ background: "#0a1628", padding: "26px 12px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🍽️</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "7px", color: C.body }}>Menu</span>
                <span style={{ fontSize: "7px", color: C.body }}>About</span>
              </div>
            </div>

            {/* Hero */}
            <div style={{ padding: "14px 12px", background: "#071020" }}>
              <div style={{ fontSize: "7px", color: C.accentLt, fontWeight: 700, marginBottom: "5px", letterSpacing: "1px" }}>
                BENGALURU'S FINEST
              </div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: C.white, lineHeight: 1.2, marginBottom: "5px", fontFamily: "var(--font-syne), sans-serif" }}>
                The Spicery<br />Indian Bistro
              </div>
              <div style={{ color: "#fbbf24", fontSize: "9px", marginBottom: "8px" }}>★★★★★</div>
              <div style={{ background: C.accent, borderRadius: "6px", padding: "5px 10px", fontSize: "8px", fontWeight: 700, color: "#fff", display: "inline-block" }}>
                Book a Table
              </div>
            </div>

            {/* Content placeholders */}
            <div style={{ padding: "10px 12px" }}>
              {[{ w: "75%", mb: "6px" }, { w: "55%", mb: "12px" }].map((b, i) => (
                <div key={i} style={{ width: b.w, height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", marginBottom: b.mb }} />
              ))}
              <div style={{ display: "flex", gap: "6px" }}>
                {[0, 1, 2].map((j) => (
                  <div key={j} style={{ flex: 1, height: "44px", background: "rgba(37,99,235,0.1)", borderRadius: "7px", border: `1px solid rgba(37,99,235,0.2)` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="fade-up" style={{ color: C.body, fontSize: "14px", textAlign: "center", marginTop: "24px" }}>
          Real website. Real link. Yours in 20 seconds.
        </p>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PRICING
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#071428", padding: "64px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="fade-up" style={{ textAlign: "center" }}>
          <p style={{ color: C.accent2, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
            Pricing
          </p>
          <h2 style={{
            fontSize: "26px", fontWeight: 800, color: C.white,
            letterSpacing: "-0.02em", marginBottom: "14px",
            fontFamily: "var(--font-syne), sans-serif",
          }}>
            Free demo. Then just{" "}
            <span style={{ color: C.accentLt }}>₹4,999.</span>
          </h2>
          <p style={{ color: C.body, fontSize: "15px", lineHeight: 1.7, maxWidth: "300px", margin: "0 auto 32px" }}>
            Permanent website with custom domain, WhatsApp integration and Google listing setup. One time. No monthly fees.
          </p>
          <a
            href="https://wa.me/919739436319?text=Hi!%20I%20want%20to%20know%20more%20about%20getting%20a%20website%20from%20Webibi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "8px", width: "100%", maxWidth: "340px", height: "52px",
              background: C.wa, borderRadius: "12px", color: "#fff",
              fontSize: "15px", fontWeight: 700, textDecoration: "none",
            }}
          >
            💬 Talk to Us on WhatsApp
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TESTIMONIALS
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, padding: "64px 24px", borderTop: `1px solid ${C.border}` }}>
        <p className="fade-up" style={{ color: C.accent2, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", marginBottom: "10px" }}>
          Testimonials
        </p>
        <h2 className="fade-up" style={{
          fontSize: "26px", fontWeight: 800, textAlign: "center", color: C.white,
          letterSpacing: "-0.02em", marginBottom: "32px",
          fontFamily: "var(--font-syne), sans-serif",
        }}>
          Real businesses. Real results.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`fade-up fade-up-delay-${i + 1}`} style={{
              background: C.bg3, border: `1px solid ${C.border}`,
              borderRadius: "16px", padding: "24px",
            }}>
              <div style={{ color: "#fbbf24", fontSize: "14px", letterSpacing: "2px", marginBottom: "12px" }}>★★★★★</div>
              <p style={{ color: C.white, fontSize: "15px", lineHeight: 1.65, marginBottom: "16px", fontStyle: "italic" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: "rgba(37,99,235,0.15)", border: `1px solid ${C.border2}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", flexShrink: 0,
                }}>👤</div>
                <div>
                  <p style={{ color: C.white, fontWeight: 700, fontSize: "13px", marginBottom: "2px" }}>{t.name}</p>
                  <p style={{ color: C.muted, fontSize: "12px" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg2, padding: "64px 24px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <div className="fade-up">
          <h2 style={{
            fontSize: "26px", fontWeight: 800, color: C.white,
            letterSpacing: "-0.02em", marginBottom: "10px",
            fontFamily: "var(--font-syne), sans-serif",
          }}>
            Still thinking?
          </h2>
          <p style={{ color: C.body, fontSize: "15px", lineHeight: 1.65, maxWidth: "280px", margin: "0 auto 32px" }}>
            Your competitor might get their website before you do.
          </p>

          <button
            onClick={triggerSignIn}
            style={{ ...primaryBtn, maxWidth: "340px", margin: "0 auto 12px" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
          >
            Get My Free Demo — It&apos;s Free
          </button>

          <a
            href="https://wa.me/919739436319?text=Hi!%20I%20want%20to%20know%20more%20about%20getting%20a%20website%20from%20Webibi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "8px", width: "100%", maxWidth: "340px", height: "48px",
              background: "transparent", borderRadius: "12px",
              border: `1px solid ${C.border2}`, color: C.body,
              fontSize: "14px", fontWeight: 600, textDecoration: "none",
              margin: "0 auto", transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border2)}
          >
            💬 Ask Us on WhatsApp
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: C.bg, borderTop: `1px solid ${C.border}`,
        padding: "20px 24px", textAlign: "center",
      }}>
        <p style={{ color: C.muted, fontSize: "13px" }}>
          webibi.tech · Made in Karnataka 🇮🇳
        </p>
        <p style={{ color: C.border2, fontSize: "11px", marginTop: "4px" }}>demo.webibi.tech</p>
      </footer>

      {/* ════════════════════════════════════════════════════════════════
          STICKY BOTTOM BAR
          ════════════════════════════════════════════════════════════════ */}
      {showStickyBar && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          padding: "10px 16px",
          background: "rgba(7,13,26,0.95)", backdropFilter: "blur(12px)",
          borderTop: `1px solid ${C.border}`,
          animation: "slideUpBar 0.35s ease forwards",
        }}>
          <button
            onClick={triggerSignIn}
            style={{ ...primaryBtn, maxWidth: "100%", height: "50px", fontSize: "15px" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
          >
            Get My Free Demo Website
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHONE.EMAIL — Always in DOM so script initialises on load
          ════════════════════════════════════════════════════════════════ */}
      <div
        id="pe-hidden-btn"
        aria-hidden="true"
        style={{ position: "fixed", bottom: "-300px", left: "-300px", opacity: 0, pointerEvents: "none", zIndex: -1 }}
      >
        <div className="pe_signin_button" data-client-id="16065028813839201797" />
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideUpBar {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%      { transform: translate(-20px, 20px) scale(1.08); }
          70%      { transform: translate(10px, -12px) scale(0.95); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          35%      { transform: translate(24px, -18px) scale(1.06); }
          65%      { transform: translate(-10px, 12px) scale(0.96); }
        }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 0 28px rgba(124,58,237,0.45), 0 4px 16px rgba(0,0,0,0.3); }
          50%      { box-shadow: 0 0 52px rgba(124,58,237,0.8), 0 4px 16px rgba(0,0,0,0.3); }
        }
        .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-up-delay-1 { transition-delay: 0.08s; }
        .fade-up-delay-2 { transition-delay: 0.16s; }
        .fade-up-delay-3 { transition-delay: 0.24s; }
        button:active { transform: scale(0.97); }
      `}</style>

    </div>
  );
}
