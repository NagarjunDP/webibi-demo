"use client";

import { useEffect, useRef, useState } from "react";
import { FlowState } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Share2, Plus, Clock, ExternalLink, Smartphone, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
}

function ResultParticles() {
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

    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1 - 0.1, // Float upwards slowly
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(34, 211, 238, 0.3)"; // Cyan

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

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

export default function ResultScreen({ state, updateState }: Props) {
  const { name } = state.businessData;
  const { demoSlug } = state;
  const [demoHost, setDemoHost] = useState("demo.webibi.tech");
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDemoHost(window.location.host);
    }
  }, []);

  const displayUrl = `demo.webibi.tech/${demoSlug}`;
  const actualUrl = `http://${demoHost}/${demoSlug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(actualUrl);
    // Standard visual feedback alert/prompt
    alert("Copied website link to clipboard!");
  };

  const handleShare = () => {
    const text = `Hey! I built a premium live website for ${name} in 60 seconds. No cost, no catch. See it here: ${actualUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleReset = () => {
    updateState({ step: "category", demoSlug: "" });
  };

  useGSAP(() => {
    // Entrance animations
    gsap.from(".result-header", {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });

    gsap.from(".device-mockup-wrapper", {
      scale: 0.9,
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.1,
      ease: "power3.out"
    });

    gsap.from(".btn-group", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.4,
      ease: "power2.out"
    });

    // Subtly levitate the device mockup continuously
    gsap.to(mockupRef.current, {
      y: -8,
      rotationX: 8,
      rotationY: -4,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  // 3D Hover tilt effect on device mockup
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = mockupRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt calculations
    const tiltX = (y / (rect.height / 2)) * -12; // max tilt 12deg
    const tiltY = (x / (rect.width / 2)) * 12;

    gsap.to(card, {
      rotationX: tiltX,
      rotationY: tiltY,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleMouseLeave = () => {
    const card = mockupRef.current;
    if (!card) return;

    gsap.to(card, {
      rotationX: 6,
      rotationY: -3,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col flex-1 p-6 relative pb-10 min-h-screen bg-slate-950 overflow-y-auto">
      {/* Floating particles background */}
      <ResultParticles />

      {/* Glow Orbs */}
      <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-cyan-950/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-72 h-72 bg-blue-950/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="result-header flex flex-col items-center mt-2 mb-6 text-center z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Live Demo Ready</span>
        </div>
        
        <h1 className="font-heading text-3xl font-black tracking-tight text-white leading-tight">
          ✦ <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">{name}</span> is live!
        </h1>
      </div>

      {/* Interactive 3D Device Mockup */}
      <div 
        className="device-mockup-wrapper w-full flex justify-center mb-8 z-10 cursor-pointer"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={mockupRef}
          className="w-full max-w-[270px] bg-slate-900/80 border border-white/10 rounded-[38px] p-2.5 shadow-[0_20px_50px_rgba(6,182,212,0.15)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_25px_60px_rgba(6,182,212,0.25)] relative overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(6deg) rotateY(-3deg)"
          }}
        >
          {/* Inner Phone Screen Frame */}
          <div className="w-full bg-slate-950 rounded-[30px] border border-white/5 overflow-hidden flex flex-col relative aspect-[9/16] max-h-[380px]">
            
            {/* Phone Notch/Speaker */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-950 rounded-b-xl z-20 flex items-center justify-center border-x border-b border-white/5">
              <div className="w-8 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Simulated Address Bar */}
            <div className="flex items-center px-3 pt-5 pb-2 bg-slate-900 border-b border-white/5 gap-2 z-10">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
              <div className="flex-1 bg-slate-950 rounded-md h-5.5 flex items-center justify-between px-2 border border-white/5">
                <span className="text-[9px] text-slate-500 truncate max-w-[120px]">{displayUrl}</span>
                <a href={actualUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                  <ExternalLink size={8} />
                </a>
              </div>
            </div>

            {/* Actual Live Website Iframe */}
            <div className="flex-1 relative bg-slate-950 z-0">
              <iframe 
                src={`/api/demos/${demoSlug}/html`} 
                className="w-full h-full border-0 pointer-events-none"
                title="Demo Preview"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="btn-group space-y-3.5 mt-auto z-10 w-full max-w-sm mx-auto">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleCopy}
            className="flex-1 h-12 rounded-2xl border-white/10 bg-slate-900/60 hover:bg-slate-800/80 hover:text-cyan-300 text-white font-semibold text-sm transition-all duration-200"
          >
            <Copy size={16} className="mr-2 text-cyan-400" /> Copy Link
          </Button>
          <Button 
            onClick={handleShare}
            className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white font-bold text-sm border-0 transition-all duration-200"
          >
            <Share2 size={16} className="mr-2" /> WhatsApp
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={handleReset}
          className="w-full h-12 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl text-xs font-semibold"
        >
          <Plus size={14} className="mr-1.5 text-cyan-400" /> Generate another demo
        </Button>
      </div>
    </div>
  );
}
