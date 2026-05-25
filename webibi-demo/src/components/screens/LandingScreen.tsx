"use client";

import { useEffect, useRef } from "react";
import { FlowState } from "@/app/page";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sparkles, Phone, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
}

function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Initialize particles
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2 - 0.15, // Float upwards
        opacity: Math.random() * 0.4 + 0.15,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(34, 211, 238, 0.4)"; // Cyan-400 color

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Reset if they float off screen
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0 || p.x > canvas.width) p.x = Math.random() * canvas.width;

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

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
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
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
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col flex-1 p-6 items-center justify-start min-h-screen relative overflow-y-auto bg-slate-950">
      {/* Dynamic particles in background */}
      <ParticlesBackground />

      {/* Decorative blurred background orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-950/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-950/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm z-10 flex flex-col items-center pt-8 pb-10">
        {/* Logo Mark */}
        <div className="logo-mark w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-cyan-500/25">
          <span className="font-heading font-black text-3xl text-white">W</span>
        </div>

        {/* Shiny Badge */}
        <div className="hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Webibi AI v2.0</span>
        </div>

        {/* Title */}
        <h1 className="hero-title font-heading text-4xl text-center mb-4 tracking-tight font-black leading-tight text-white">
          Your website, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">in 60 seconds.</span>
        </h1>
        
        {/* Description */}
        <p className="hero-desc text-slate-400 text-center mb-8 text-base font-medium max-w-[280px]">
          See a stunning live website demo built from your logo &mdash; instantly.
        </p>

        {/* Login Card */}
        <div className="login-card w-full p-6 bg-slate-900/60 border border-white/5 rounded-3xl backdrop-blur-xl shadow-[0_8px_32px_rgba(6,182,212,0.06)] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
          <h2 className="text-white text-center text-sm font-semibold mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            Verify Phone to Get Started
          </h2>
          <div className="w-full flex justify-center py-5 bg-black/30 border border-white/5 rounded-2xl relative z-10">
            {/* Phone.email integration button */}
            <div className="pe_signin_button" data-client-id="16065028813839201797"></div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="w-full space-y-4 mt-10">
          <h3 className="text-[10px] font-bold tracking-wider uppercase text-cyan-400/80 mb-2 text-center">How Webibi Works</h3>
          {bentoItems.map((item, idx) => (
            <div 
              key={idx}
              className="bento-card bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex gap-4 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-white font-semibold text-sm mb-0.5">{item.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
