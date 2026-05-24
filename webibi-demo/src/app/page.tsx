"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingScreen from "@/components/screens/LandingScreen";
import CategoryScreen from "@/components/screens/CategoryScreen";
import DetailsScreen from "@/components/screens/DetailsScreen";
import GenerationScreen from "@/components/screens/GenerationScreen";
import ResultScreen from "@/components/screens/ResultScreen";

export type FlowState = {
  step: "landing" | "category" | "details" | "generation" | "result";
  userData: {
    phoneOrEmail: string;
    verified: boolean;
  };
  businessData: {
    industry: string;
    name: string;
    city: string;
    tagline: string;
    phone: string;
    logoDataUrl: string;
    primaryColor: string;
    extractedColors: string[];
  };
  demoSlug: string;
};

export default function Home() {
  const [state, setState] = useState<FlowState>({
    step: "landing",
    userData: { phoneOrEmail: "", verified: false },
    businessData: {
      industry: "",
      name: "",
      city: "",
      tagline: "",
      phone: "",
      logoDataUrl: "",
      primaryColor: "#7c5cfc",
      extractedColors: [],
    },
    demoSlug: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("action") === "create") {
        setState((prev) => ({
          ...prev,
          step: "category",
          userData: { phoneOrEmail: "agent", verified: true },
        }));
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);

  const updateState = (updates: Partial<FlowState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const updateBusinessData = (updates: Partial<FlowState["businessData"]>) => {
    setState((prev) => ({
      ...prev,
      businessData: { ...prev.businessData, ...updates },
    }));
  };

  const pageTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.35, ease: "easeOut" as const },
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      <AnimatePresence mode="wait">
        {state.step === "landing" && (
          <motion.div key="landing" {...pageTransition} className="flex-1 flex flex-col">
            <LandingScreen state={state} updateState={updateState} />
          </motion.div>
        )}
        {state.step === "category" && (
          <motion.div key="category" {...pageTransition} className="flex-1 flex flex-col">
            <CategoryScreen state={state} updateState={updateState} updateBusinessData={updateBusinessData} />
          </motion.div>
        )}
        {state.step === "details" && (
          <motion.div key="details" {...pageTransition} className="flex-1 flex flex-col">
            <DetailsScreen state={state} updateState={updateState} updateBusinessData={updateBusinessData} />
          </motion.div>
        )}
        {state.step === "generation" && (
          <motion.div key="generation" {...pageTransition} className="flex-1 flex flex-col">
            <GenerationScreen state={state} updateState={updateState} />
          </motion.div>
        )}
        {state.step === "result" && (
          <motion.div key="result" {...pageTransition} className="flex-1 flex flex-col">
            <ResultScreen state={state} updateState={updateState} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
