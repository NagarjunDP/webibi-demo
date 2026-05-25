"use client";

import { useEffect, useRef } from "react";
import { FlowState } from "@/app/page";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Zap, Layers, ShieldCheck } from "lucide-react";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
}

// Preview items for the infinite scroll showcase
const ROW1_ITEMS = [
  { name: "Luigi's Bistro", industry: "Restaurant", img: "/assets/restaurant/hero-1.jpg", url: "luigi-bistro.html" },
  { name: "Glow & Co", industry: "Salon & Spa", img: "/assets/salon/hero-1.jpg", url: "super-salon.html" },
  { name: "Iron Gym", industry: "Fitness", img: "/assets/gym/hero-1.jpg", url: "fittygitty.html" },
  { name: "Apex Health", industry: "Clinic", img: "/assets/clinic/hero-1.jpg", url: "hv.html" },
  { name: "Dream Events", industry: "Events", img: "/assets/events/hero-1.jpg", url: "vivience-events.html" },
];

const ROW2_ITEMS = [
  { name: "Prime Realty", industry: "Real Estate", img: "/assets/realestate/hero-1.jpg", url: "gk.html" },
  { name: "Nova Academy", industry: "Education", img: "/assets/education/hero-1.jpg", url: "4-3.html" },
  { name: "Grand Resort", industry: "Hotel", img: "/assets/hotel/hero-1.jpg", url: "r.html" },
  { name: "Equity Legal", industry: "Law Firm", img: "/assets/law/hero-1.jpg", url: "boss-events.html" },
  { name: "Luigi's Bistro", industry: "Restaurant", img: "/assets/restaurant/hero-1.jpg", url: "luigi-bistro.html" },
];

const bentoItems = [
  {
    icon: <Zap className="text-cyan-400 w-5 h-5" />,
    title: "Instant Generation",
    desc: "We analyze your logo to extract color DNA and layout structures in under a minute.",
  },
  {
    icon: <Layers className="text-cyan-400 w-5 h-5" />,
    title: "Multi-Industry Shells",
    desc: "9 specialized responsive blueprints tailoring design logic directly to your business category.",
  },
  {
    icon: <ShieldCheck className="text-cyan-400 w-5 h-5" />,
    title: "1-Click Permanent",
    desc: "Upgrade anytime to a lifetime custom domain hosting plan. No recurring monthly fees.",
  }
];

export default function LandingScreen({ state, updateState }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (window as any).phoneEmailListener = async function (userObj: any) {
      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userJsonUrl: userObj?.user_json_url,
            phoneNumber: "+16505553434", // fallback
            code: "654321",
            sessionInfo: null,
            mockMode: true
          }),
        });
        const data = await res.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
      } catch (err) {
        console.error("Failed to sync session cookie with backend", err);
      }

      updateState({
        userData: { phoneOrEmail: "verified-phone", verified: true },
        step: "category",
      });
    };

    // Load the phone.email script only once when mounted
    if (!document.getElementById("phone-email-script")) {
      const script = document.createElement("script");
      script.id = "phone-email-script";
      script.src = "https://www.phone.email/sign_in_button_v1.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [updateState]);

  useGSAP(() => {
    // Entrance animations
    gsap.from(".logo-mark", {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
    
    gsap.from(".hero-badge", {
      y: -20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out"
    });

    gsap.from(".hero-title", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out"
    });

    gsap.from(".hero-desc", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
      ease: "power2.out"
    });

    gsap.from(".login-card", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 0.7,
      ease: "power3.out"
    });

    gsap.from(".bento-card", {
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      delay: 0.9,
      ease: "power2.out"
    });

    // Subtle floating animation of the entire 3D marquee track
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        y: -10,
        x: -5,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col flex-1 p-6 items-center justify-start min-h-screen relative overflow-y-auto bg-black text-white selection:bg-cyan-500 selection:text-black">
      
      {/* CSS marquee stylesheet */}
      <style>{`
        .marquee-wrapper {
          perspective: 1200px;
          overflow: hidden;
        }
        .marquee-track-container {
          transform: rotateX(15deg) rotateY(-12deg) rotateZ(-3deg) scale(1.1);
          transform-style: preserve-3d;
        }
        .marquee-track-left {
          display: flex;
          width: max-content;
          gap: 20px;
          animation: scroll-left 50s linear infinite;
        }
        .marquee-track-right {
          display: flex;
          width: max-content;
          gap: 20px;
          animation: scroll-right 50s linear infinite;
        }
        .marquee-card {
          width: 250px;
          height: 140px;
          flex-shrink: 0;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #09090b;
          overflow: hidden;
          position: relative;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8);
          transform-style: preserve-3d;
          transition: border-color 0.3s, transform 0.3s;
        }
        .marquee-card:hover {
          border-color: rgba(34, 211, 238, 0.4);
          transform: translateZ(10px) scale(1.02);
        }
        @keyframes scroll-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes scroll-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Infinite Scrolling Website Showcase (Netflix & JioHotstar style) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden marquee-wrapper opacity-45 pointer-events-none">
        
        {/* Subtle grid elements layout */}
        <div ref={marqueeRef} className="absolute inset-0 w-full h-full flex flex-col justify-center gap-6 py-12 marquee-track-container">
          
          {/* Row 1 (Scrolling Left) */}
          <div className="marquee-track-left">
            {[...ROW1_ITEMS, ...ROW1_ITEMS].map((item, idx) => (
              <div key={`row1-${idx}`} className="marquee-card">
                {/* Browser top-bar */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-b border-white/5">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-1 bg-black/40 rounded h-3 flex items-center px-1.5 border border-white/5">
                    <span className="text-[6px] text-zinc-500 truncate">{item.url}</span>
                  </div>
                </div>
                {/* Simulated screenshot */}
                <div className="relative w-full h-full bg-zinc-950">
                  <img src={item.img} alt="" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <span className="absolute bottom-8 left-3 text-[10px] font-bold text-white tracking-wide">{item.name}</span>
                  <span className="absolute top-2.5 right-3 text-[6px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-800/30">
                    {item.industry}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 (Scrolling Right) */}
          <div className="marquee-track-right">
            {[...ROW2_ITEMS, ...ROW2_ITEMS].map((item, idx) => (
              <div key={`row2-${idx}`} className="marquee-card">
                {/* Browser top-bar */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-b border-white/5">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-1 bg-black/40 rounded h-3 flex items-center px-1.5 border border-white/5">
                    <span className="text-[6px] text-zinc-500 truncate">{item.url}</span>
                  </div>
                </div>
                {/* Simulated screenshot */}
                <div className="relative w-full h-full bg-zinc-950">
                  <img src={item.img} alt="" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <span className="absolute bottom-8 left-3 text-[10px] font-bold text-white tracking-wide">{item.name}</span>
                  <span className="absolute top-2.5 right-3 text-[6px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-800/30">
                    {item.industry}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Cinematic Fade Overlays (Netflix / JioHotstar style) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none z-10" />
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-10" />
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-sm z-20 flex flex-col items-center pt-8 pb-10">
        
        {/* Logo Mark */}
        <div className="logo-mark mb-8 flex items-center justify-center">
          <img 
            src="/assets/logoo.png" 
            alt="Webibi Logo" 
            className="h-16 object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          />
        </div>

        {/* Shiny Badge */}
        <div className="hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Webibi AI v2.0</span>
        </div>

        {/* Title */}
        <h1 className="hero-title font-heading text-4xl text-center mb-4 tracking-tight font-black leading-tight text-white">
          Your website, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">in 60 seconds.</span>
        </h1>
        
        {/* Description */}
        <p className="hero-desc text-zinc-400 text-center mb-8 text-base font-medium max-w-[280px]">
          See a stunning live website demo built from your logo &mdash; instantly.
        </p>

        {/* Simplified Login Card */}
        <div className="login-card w-full p-6 bg-zinc-950/70 border border-zinc-800/50 rounded-[28px] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden mb-10">
          <div className="w-full flex justify-center py-4 bg-black/40 border border-zinc-800/60 rounded-2xl relative z-10">
            {/* Phone.email integration button */}
            <div className="pe_signin_button" data-client-id="16065028813839201797"></div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="w-full space-y-4">
          <h3 className="text-[10px] font-bold tracking-wider uppercase text-cyan-400/80 mb-2 text-center">How Webibi Works</h3>
          {bentoItems.map((item, idx) => (
            <div 
              key={idx}
              className="bento-card bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 flex gap-4 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)]"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-white font-semibold text-sm mb-0.5">{item.title}</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
