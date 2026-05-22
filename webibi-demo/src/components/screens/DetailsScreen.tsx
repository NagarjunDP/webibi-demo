"use client";

import { useRef, useState } from "react";
import { FlowState } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, UploadCloud, CheckCircle2 } from "lucide-react";
import { getPaletteSync } from "colorthief";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
  updateBusinessData: (updates: Partial<FlowState["businessData"]>) => void;
}

const INDUSTRIES: Record<string, { name: string; emoji: string }> = {
  restaurant: { name: "Restaurant", emoji: "🍽️" },
  gym: { name: "Gym & Fitness", emoji: "🏋️" },
  salon: { name: "Salon & Spa", emoji: "✨" },
  clinic: { name: "Clinic", emoji: "🩺" },
  law: { name: "Law Firm", emoji: "⚖️" },
  events: { name: "Events", emoji: "🎉" },
  realestate: { name: "Real Estate", emoji: "🏢" },
  education: { name: "Education", emoji: "📚" },
  hotel: { name: "Hotel & Stay", emoji: "🏨" },
};



export default function DetailsScreen({ state, updateState, updateBusinessData }: Props) {
  const { industry, name, city, tagline, phone, primaryColor, logoDataUrl, extractedColors } = state.businessData;
  const indInfo = INDUSTRIES[industry] || { name: "Business", emoji: "🏢" };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => updateState({ step: "category" });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      const img = new Image();
      img.onload = () => {
        try {
          const palette = getPaletteSync(img, { colorCount: 5 });
          const hexPalette = palette ? palette.map((p: any) => p.hex()) : [];
          
          updateBusinessData({
            logoDataUrl: dataUrl,
            extractedColors: hexPalette,
            primaryColor: hexPalette[0] || "#7c5cfc"
          });
        } catch (err) {
          console.error("Failed to extract colors", err);
          updateBusinessData({ logoDataUrl: dataUrl });
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    if (!name || !city) return;
    updateState({ step: "generation" });
  };

  return (
    <div className="flex flex-col flex-1 p-6 relative pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center border border-white/5 hover:bg-white/5 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="font-heading text-xl flex items-center gap-2">
            <span>{indInfo.emoji}</span> {indInfo.name}
          </h2>
          <p className="text-xs text-muted-foreground">Almost done. Give us the details.</p>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto hide-scrollbar">
        {/* Logo Upload Zone */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Brand Logo</Label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              logoDataUrl ? "border-primary/50 bg-primary/5" : "border-white/10 bg-surface-elevated hover:border-white/20"
            }`}
          >
            {logoDataUrl ? (
              <div className="flex items-center gap-4 p-4">
                <img src={logoDataUrl} alt="Logo" className="h-16 object-contain rounded-lg bg-white/10 p-2" />
                <div className="flex flex-col">
                  <span className="text-success flex items-center gap-1 font-medium text-sm">
                    <CheckCircle2 size={16} /> Logo Uploaded
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">Tap to change</span>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud size={32} className="text-muted-foreground mb-2" />
                <span className="text-sm text-foreground font-medium">Upload your logo</span>
                <span className="text-xs text-muted-foreground text-center mt-1 px-4">
                  We'll extract and match your brand colors.
                </span>
              </>
            )}
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/svg+xml" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleLogoUpload}
            />
          </div>

          {/* Color Extraction Results */}
          {extractedColors.length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-xs text-muted-foreground mb-2 block">Extracted Brand Palette</Label>
              <div className="flex gap-3">
                {extractedColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => updateBusinessData({ primaryColor: color })}
                    className={`w-8 h-8 rounded-full shadow-inner transition-transform hover:scale-110 ${
                      primaryColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Business Name <span className="text-primary">*</span></Label>
            <Input 
              value={name} 
              onChange={(e) => updateBusinessData({ name: e.target.value })}
              className="bg-surface-elevated border-white/5 h-12"
              placeholder="e.g. The Rustic Bean"
            />
          </div>

          <div className="space-y-2">
            <Label>City / Location <span className="text-primary">*</span></Label>
            <Input 
              value={city} 
              onChange={(e) => updateBusinessData({ city: e.target.value })}
              className="bg-surface-elevated border-white/5 h-12"
              placeholder="e.g. London"
            />
          </div>

          <div className="space-y-2">
            <Label>Tagline / One-liner</Label>
            <Input 
              value={tagline} 
              onChange={(e) => updateBusinessData({ tagline: e.target.value })}
              className="bg-surface-elevated border-white/5 h-12"
              placeholder="e.g. Premium Coffee & Bakes"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              type="tel"
              value={phone} 
              onChange={(e) => updateBusinessData({ phone: e.target.value })}
              className="bg-surface-elevated border-white/5 h-12"
              placeholder="e.g. +44 123 456 789"
            />
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-6 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent z-50">
        <Button
          disabled={!name || !city}
          onClick={handleGenerate}
          className="w-full h-14 rounded-xl text-base font-semibold transition-all bg-gradient-to-r from-[#7c5cfc] to-[#c471ed] hover:opacity-90 shadow-lg shadow-primary/25 border-0 text-white disabled:opacity-50 disabled:shadow-none"
        >
          ⚡ Generate My Demo Website
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
          Ready in under 60 seconds
        </p>
      </div>
    </div>
  );
}
