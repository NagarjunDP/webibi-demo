"use client";

import { useEffect, useState } from "react";
import { FlowState } from "@/app/page";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
}

const STEPS = [
  "Analysing your logo & extracting brand DNA",
  "Selecting typography & colour palette",
  "Writing personalised page copy",
  "Designing your layout & sections",
  "Publishing your live demo URL",
];

// Call API for generation
const generateWebsite = async (businessData: any) => {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(businessData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default function GenerationScreen({ state, updateState }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const { name } = state.businessData;

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

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 relative overflow-hidden bg-[#0a0a0f]">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#c471ed]/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center">
        {/* Animated Loader */}
        <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-t-primary border-r-[#c471ed] border-b-transparent border-l-transparent opacity-80"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-2 rounded-full border-4 border-b-primary border-l-[#c471ed] border-t-transparent border-r-transparent opacity-50"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-16 bg-surface-elevated rounded-2xl border border-white/10 shadow-xl flex items-center justify-center"
          >
            <Sparkles className="text-primary" size={28} />
          </motion.div>
        </div>

        <h2 className="font-heading text-2xl text-center mb-10">
          Building <span className="gradient-text">{name || "your"}</span>'s website...
        </h2>

        {/* Step List */}
        <div className="w-full space-y-5">
          {STEPS.map((stepText, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isPending = currentStep < idx;

            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-6 flex justify-center">
                  <AnimatePresence mode="wait">
                    {isCompleted && (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-success"
                      >
                        <CheckCircle2 size={24} />
                      </motion.div>
                    )}
                    {isCurrent && (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-primary"
                      >
                        <Loader2 size={24} className="animate-spin" />
                      </motion.div>
                    )}
                    {isPending && (
                      <motion.div
                        key="dot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-2 h-2 rounded-full bg-white/20"
                      />
                    )}
                  </AnimatePresence>
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isCompleted ? "text-muted-foreground" : isCurrent ? "text-foreground" : "text-white/20"
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
