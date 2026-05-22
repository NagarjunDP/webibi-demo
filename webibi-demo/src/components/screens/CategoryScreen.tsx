"use client";

import { FlowState } from "@/app/page";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
  updateBusinessData: (updates: Partial<FlowState["businessData"]>) => void;
}

const INDUSTRIES = [
  { id: "restaurant", name: "Restaurant", emoji: "🍽️", desc: "Cafes & Dining" },
  { id: "gym", name: "Gym & Fitness", emoji: "🏋️", desc: "Studios & Trainers" },
  { id: "salon", name: "Salon & Spa", emoji: "✨", desc: "Beauty & Wellness" },
  { id: "clinic", name: "Clinic", emoji: "🩺", desc: "Healthcare & Med" },
  { id: "law", name: "Law Firm", emoji: "⚖️", desc: "Legal Services" },
  { id: "events", name: "Events", emoji: "🎉", desc: "Weddings & Parties" },
  { id: "realestate", name: "Real Estate", emoji: "🏢", desc: "Brokers & Agents" },
  { id: "retail", name: "Retail Shop", emoji: "🛍️", desc: "Stores & Boutiques" },
  { id: "education", name: "Education", emoji: "📚", desc: "Tutors & Schools" },
  { id: "hotel", name: "Hotel & Stay", emoji: "🏨", desc: "Resorts & Stays" },
];

export default function CategoryScreen({ state, updateState, updateBusinessData }: Props) {
  const selectedId = state.businessData.industry;

  const handleSelect = (id: string) => {
    updateBusinessData({ industry: id });
  };

  const handleContinue = () => {
    if (!selectedId) return;
    updateState({ step: "details" });
  };

  return (
    <div className="flex flex-col flex-1 p-6 relative pb-32">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="font-heading font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5cfc] to-[#c471ed] flex items-center justify-center">
            <span className="text-white text-sm">W</span>
          </div>
          <span className="gradient-text">Webibi</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-elevated border border-white/10 flex items-center justify-center">
          <User size={18} className="text-muted-foreground" />
        </div>
      </div>

      <h2 className="font-heading text-3xl mb-2">What's your business?</h2>
      <p className="text-muted-foreground mb-8">Select your industry to customize the AI output.</p>

      <div className="grid grid-cols-2 gap-4">
        {INDUSTRIES.map((ind, i) => {
          const isSelected = selectedId === ind.id;
          return (
            <motion.button
              key={ind.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(ind.id)}
              className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-primary/10 border-primary ring-1 ring-primary/50"
                  : "bg-surface-elevated border-white/5 hover:border-white/20"
              }`}
            >
              <span className="text-3xl mb-3">{ind.emoji}</span>
              <span className="font-semibold text-foreground mb-1">{ind.name}</span>
              <span className="text-xs text-muted-foreground">{ind.desc}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-6 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pointer-events-none flex justify-center pb-8 z-50">
        <Button
          disabled={!selectedId}
          onClick={handleContinue}
          className={`w-full h-14 rounded-xl text-base font-semibold pointer-events-auto transition-all ${
            selectedId
              ? "bg-gradient-to-r from-[#7c5cfc] to-[#c471ed] hover:opacity-90 shadow-lg shadow-primary/25 border-0 text-white"
              : "bg-surface-elevated text-muted-foreground border border-white/5"
          }`}
        >
          Continue &rarr;
        </Button>
      </div>
    </div>
  );
}
