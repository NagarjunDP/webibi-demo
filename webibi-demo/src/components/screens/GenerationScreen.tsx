"use client";

import { useEffect, useRef, useState } from "react";
import { FlowState } from "@/app/page";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
}

const STEPS = [
  "Analysing logo & brand DNA",
  "Extracting palette & typography",
  "Writing personalized copywriting",
  "Staging responsive grid layout",
  "Publishing live demo URL",
];

const generateWebsite = async (businessData: any) => {
  try {
    const payload = JSON.stringify(businessData);
    const payloadSizeMb = payload.length / (1024 * 1024);
    console.log(`Payload size: ${payloadSizeMb.toFixed(2)} MB`);
    
    if (payloadSizeMb > 2) {
      return { error: `Image too large (${payloadSizeMb.toFixed(2)} MB). Please use a smaller logo image under 1MB.` };
    }

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: payload,
    });
    
    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        const text = await res.text();
        console.error("HTML Error Response:", text);
        return { error: `Server error ${res.status}: ${res.statusText}. Payload might be too large.` };
      }
      
      const data = await res.json().catch(() => null);
      return { error: data?.error || `Server error ${res.status}: ${res.statusText}` };
    }
    
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Generate API error:", err);
    return { error: err.message || "Unknown error occurred" };
  }
};

function GenerationParticles() {
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

    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15 - 0.2, // Float upwards slightly faster
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(34, 211, 238, 0.4)"; // Cyan-400

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

export default function GenerationScreen({ state, updateState }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const { name } = state.businessData;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const runSteps = async () => {
      // Step 1: 1.5s
      await new Promise(r => setTimeout(r, 1500));
      if (!isMounted) return;
      setCurrentStep(1);

      // Step 2: 1.5s
      await new Promise(r => setTimeout(r, 1500));
      if (!isMounted) return;
      setCurrentStep(2);

      // Step 3: API generation
      const result = await generateWebsite(state.businessData); 
      if (!isMounted) return;

      if (!result || result.error) {
        alert("Generation Error: " + (result?.error || "Failed to contact server. Please verify you are logged in."));
        updateState({ step: "details" });
        return;
      }

      setCurrentStep(3);

      // Step 4: 1.5s
      await new Promise(r => setTimeout(r, 1500));
      if (!isMounted) return;
      setCurrentStep(4);

      // Final: 1.5s then redirect
      await new Promise(r => setTimeout(r, 1500));
      if (!isMounted) return;
      
      const slug = result?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      updateState({ 
        demoSlug: slug,
        step: "result" 
      });
    };

    runSteps();
    return () => { isMounted = false; };
  }, [name, state.businessData, updateState]);

  useGSAP(() => {
    // Entrance animations
    gsap.from(".loader-box", {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    gsap.from(".title-text", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out"
    });

    gsap.from(".step-row", {
      x: -15,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      delay: 0.4,
      ease: "power2.out"
    });

    // Make the inner icon levitate gently
    gsap.to(".levitate-icon", {
      y: -6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col flex-1 items-center justify-center p-6 min-h-screen relative overflow-hidden bg-slate-950">
      {/* Dynamic star field background */}
      <GenerationParticles />

      {/* Glow Orbs */}
      <div className="absolute top-[25%] left-[5%] w-72 h-72 bg-cyan-950/30 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[25%] right-[5%] w-72 h-72 bg-blue-950/30 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />

      <div className="z-10 w-full max-w-sm flex flex-col items-center">
        {/* Animated Loader */}
        <div className="loader-box relative w-32 h-32 mb-10 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-blue-500 border-b-transparent border-l-transparent opacity-85 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            className="absolute inset-2.5 rounded-full border-4 border-b-cyan-500/50 border-l-blue-400/50 border-t-transparent border-r-transparent opacity-60"
          />
          <div className="levitate-icon w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Sparkles className="text-cyan-400" size={28} />
          </div>
        </div>

        <h2 className="title-text font-heading text-2xl text-center mb-8 font-black text-white">
          Building <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">{name || "your"}</span>'s site...
        </h2>

        {/* Steps Card */}
        <div className="w-full p-6 bg-slate-900/60 border border-white/5 rounded-3xl backdrop-blur-md shadow-xl space-y-4">
          {STEPS.map((stepText, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isPending = currentStep < idx;

            return (
              <div key={idx} className="step-row flex items-center gap-4">
                <div className="w-6 flex justify-center">
                  <AnimatePresence mode="wait">
                    {isCompleted && (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                      >
                        <CheckCircle2 size={20} />
                      </motion.div>
                    )}
                    {isCurrent && (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-cyan-400"
                      >
                        <Loader2 size={20} className="animate-spin" />
                      </motion.div>
                    )}
                    {isPending && (
                      <motion.div
                        key="dot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-white/5"
                      />
                    )}
                  </AnimatePresence>
                </div>
                <span className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${
                  isCompleted ? "text-slate-500 line-through" : isCurrent ? "text-cyan-300 font-bold" : "text-slate-600"
                }`}>
                  {stepText}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
