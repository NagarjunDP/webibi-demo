"use client";

import { useEffect, useState } from "react";
import { FlowState } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Share2, Plus, Clock, ExternalLink } from "lucide-react";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
}

export default function ResultScreen({ state, updateState }: Props) {
  const { name } = state.businessData;
  const { demoSlug } = state;
  const [demoHost, setDemoHost] = useState("demo.webibi.tech");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDemoHost(window.location.host);
    }
  }, []);

  const displayUrl = `demo.webibi.tech/${demoSlug}`;
  const actualUrl = `http://${demoHost}/${demoSlug}`;
  
  // Mock live analytics
  const [analytics, setAnalytics] = useState({
    opens: 0,
    time: "0s",
    status: "🆕 Sent"
  });

  // Simulate analytics updating over time
  useEffect(() => {
    const timer1 = setTimeout(() => setAnalytics(a => ({ ...a, opens: 1, status: "👀 Viewed" })), 5000);
    const timer2 = setTimeout(() => setAnalytics(a => ({ ...a, time: "45s" })), 8000);
    const timer3 = setTimeout(() => setAnalytics(a => ({ ...a, opens: 3, status: "🔥 Hot Lead" })), 15000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(actualUrl);
    // Show toast here in real app
  };

  const handleShare = () => {
    const text = `Hey — we built a live website for ${name} in 60 seconds. No cost, no catch. See it here: ${actualUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleReset = () => {
    updateState({ step: "category", demoSlug: "" });
  };

  return (
    <div className="flex flex-col flex-1 p-6 relative pb-10">
      {/* Confetti / Success Header */}
      <div className="flex flex-col items-center mt-4 mb-8 text-center animate-in slide-in-from-bottom-4 duration-500">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="text-xs font-semibold text-success tracking-wide uppercase">Live & Published</span>
        </div>
        
        <h1 className="font-heading text-3xl leading-tight">
          ✦ <span className="gradient-text">{name}</span> is live!
        </h1>
      </div>

      {/* Demo Preview Card */}
      <div className="w-full bg-surface-elevated rounded-2xl border border-white/10 overflow-hidden shadow-2xl mb-6 flex-shrink-0 animate-in zoom-in-95 duration-500 delay-150">
        {/* Browser Chrome */}
        <div className="flex items-center px-4 py-3 bg-surface border-b border-white/5 gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
          </div>
          <div className="flex-1 bg-background rounded-md h-7 flex items-center justify-center px-3 border border-white/5">
            <span className="text-xs text-muted-foreground truncate">{displayUrl}</span>
          </div>
          <a href={actualUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
            <ExternalLink size={14} />
          </a>
        </div>
        {/* Preview content (Simulated) */}
        <div className="w-full aspect-[9/16] max-h-[400px] relative bg-background">
          <iframe 
            src={`/demos/${demoSlug}.html`} 
            className="w-full h-full border-0 pointer-events-none"
            title="Demo Preview"
          />
        </div>
      </div>

      {/* Analytics Strip */}
      <div className="grid grid-cols-3 gap-2 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-300">
        <div className="bg-surface-elevated border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <Eye size={16} className="text-muted-foreground mb-1" />
          <span className="text-sm font-semibold">{analytics.opens}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Opens</span>
        </div>
        <div className="bg-surface-elevated border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <Clock size={16} className="text-muted-foreground mb-1" />
          <span className="text-sm font-semibold">{analytics.time}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Time</span>
        </div>
        <div className="bg-surface-elevated border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-primary/5">
          <span className="text-lg mb-0.5">{analytics.status.split(' ')[0]}</span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider truncate w-full">
            {analytics.status.substring(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-auto">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleCopy}
            className="flex-1 h-12 rounded-xl border-white/10 bg-surface hover:bg-surface-elevated hover:text-foreground text-foreground font-semibold"
          >
            <Copy size={18} className="mr-2" /> Copy Link
          </Button>
          <Button 
            onClick={handleShare}
            className="flex-1 h-12 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold border-0"
          >
            <Share2 size={18} className="mr-2" /> WhatsApp
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={handleReset}
          className="w-full h-12 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl"
        >
          <Plus size={16} className="mr-2" /> Generate another demo
        </Button>
      </div>
    </div>
  );
}
