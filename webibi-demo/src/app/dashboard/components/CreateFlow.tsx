/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Upload, ArrowLeft, Loader2, Link as LinkIcon, Smartphone, QrCode, MessageCircle } from "lucide-react";
import QRModal from "./QRModal";

const INDUSTRIES = [
  { id: "restaurant", name: "Restaurant", icon: "🍽️" },
  { id: "salon", name: "Salon", icon: "✂️" },
  { id: "gym", name: "Gym", icon: "💪" },
  { id: "clinic", name: "Clinic", icon: "🏥" },
  { id: "events", name: "Events", icon: "🎉" },
  { id: "law", name: "Law Firm", icon: "⚖️" },
  { id: "realestate", name: "Real Estate", icon: "🏢" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "hotel", name: "Hotel", icon: "🏨" }
];

const COLORS = ["#7c5cfc", "#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#ec4899"];

interface Props {
  onSuccess: () => void;
}

export default function CreateFlow({ onSuccess }: Props) {
  const [step, setStep] = useState<"industry" | "details" | "generating" | "success">("industry");
  const [industry, setIndustry] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [logo, setLogo] = useState<string | null>(null);
  
  const [loadingStep, setLoadingStep] = useState(0);
  const [demoResult, setDemoResult] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [limitData, setLimitData] = useState<{count: number, limit: number | string, remaining: number | string} | null>(null);
  const [loadingLimit, setLoadingLimit] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("webibi_admin_token") || "";
    fetch('/api/demos/count', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setLimitData(data);
        }
        setLoadingLimit(false);
      })
      .catch(err => {
        console.error("Failed to fetch limits", err);
        setLoadingLimit(false);
      });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 500;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setLogo(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setStep("generating");
    
    // Animate Loading Steps
    const stepInterval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, 3));
    }, 1500);

    try {
      const token = localStorage.getItem("webibi_admin_token") || "";
      const payload = { industry, name, city, tagline, phone, color, logoDataUrl: logo || undefined };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      clearInterval(stepInterval);
      setLoadingStep(4);

      if (res.ok) {
        setDemoResult(data);
        setTimeout(() => setStep("success"), 500);
      } else {
        alert("Error: " + (data.error || "Generation failed"));
        setStep("details");
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      alert("Network error: " + err.message);
      setStep("details");
    }
  };

  if (loadingLimit) {
    return (
      <div className="pb-24 pt-12 px-4 flex flex-col items-center justify-center animate-in fade-in duration-300">
        <Loader2 size={32} className="text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Checking account status...</p>
      </div>
    );
  }

  if (limitData && limitData.limit !== 'unlimited' && limitData.count >= (limitData.limit as number)) {
    const waText = encodeURIComponent("Hi! I've used all 3 free demos and want to upgrade to get more website generations!");
    return (
      <div className="pb-24 pt-12 px-4 animate-in slide-in-from-bottom-8 duration-500 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
          <span className="text-4xl">🚀</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">You've used<br/>all 3 free demos!</h2>
        <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">Ready to get the real thing? Upgrade your account to unlock unlimited generations.</p>

        <div className="w-full space-y-3 max-w-sm">
          <a 
            href={`https://wa.me/919739436319?text=${waText}`}
            target="_blank"
            rel="noreferrer"
            className="w-full h-14 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl font-bold shadow-sm transition-transform active:scale-95"
          >
            <MessageCircle size={18} /> WhatsApp us to Upgrade
          </a>
          
          <a 
            href="https://webibi.tech"
            target="_blank"
            rel="noreferrer"
            className="w-full h-14 flex items-center justify-center gap-2 bg-gray-100 text-gray-800 rounded-xl font-bold transition-transform active:scale-95"
          >
            <LinkIcon size={18} /> Visit webibi.tech
          </a>
        </div>

        <button 
          onClick={onSuccess}
          className="mt-8 text-sm font-semibold text-gray-500 hover:text-gray-900 pb-2 border-b border-transparent hover:border-gray-300 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const renderLimitHeader = () => {
    if (!limitData || limitData.limit === 'unlimited') return null;
    const count = limitData.count as number;
    const limit = limitData.limit as number;
    const pct = Math.min(100, (count / limit) * 100);
    const isWarning = limit - count <= 1;

    return (
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm mb-6 flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demo Usage</span>
          <span className={`text-sm font-black ${isWarning ? 'text-red-500' : 'text-primary'}`}>
            {count} of {limit} used
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${isWarning ? 'bg-red-500' : 'bg-primary'}`} 
            style={{ width: `${pct}%` }} 
          />
        </div>
      </div>
    );
  };

  if (step === "industry") {
    return (
      <div className="pb-24 pt-4 px-4 animate-in fade-in duration-300">
        {renderLimitHeader()}
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Choose Industry</h2>
        <div className="grid grid-cols-2 gap-4">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => {
                setIndustry(ind.id);
                setStep("details");
              }}
              className="bg-white p-6 rounded-2xl border-2 border-transparent shadow-sm flex flex-col items-center justify-center gap-3 transition-all active:scale-95"
            >
              <div className="text-4xl">{ind.icon}</div>
              <span className="font-semibold text-gray-800">{ind.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "details") {
    return (
      <div className="pb-24 pt-4 px-4 animate-in slide-in-from-right-8 duration-300">
        {renderLimitHeader()}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep("industry")} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-none">Business Details</h2>
            <span className="text-sm font-medium text-primary mt-1 block">For {INDUSTRIES.find(i => i.id === industry)?.name}</span>
          </div>
        </div>

        <div className="space-y-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g. Sri Ganesh Academy"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g. Hassan, Bengaluru, Mumbai"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tagline (Optional)</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g. Shaping Tomorrow's Leaders Today"
            />
            <p style={{fontSize:'12px', color:'#666', marginTop:'4px'}}>
              A short catchy line about your business (optional — AI will generate one if left empty)
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g. +91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${color === c ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check size={16} color="white" />}
                </button>
              ))}
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-[-10px] w-20 h-20 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Logo (Optional)</label>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden"
            >
              {logo ? (
                <img src={logo} alt="Logo preview" className="absolute inset-0 w-full h-full object-contain p-2 bg-white" />
              ) : (
                <>
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm text-gray-500 font-medium">Tap to upload</span>
                </>
              )}
            </button>
            {logo && (
              <button onClick={() => setLogo(null)} className="mt-2 text-xs text-red-500 font-semibold w-full text-center">
                Remove Logo
              </button>
            )}
          </div>

          <button
            disabled={!name || !city}
            onClick={handleGenerate}
            className="w-full h-14 mt-4 rounded-xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 disabled:opacity-50 transition-all active:scale-95"
          >
            ⚡ Generate Demo
          </button>
        </div>
      </div>
    );
  }

  if (step === "generating") {
    const messages = [
      "Reading your business details...",
      "Writing content with AI...",
      "Designing pages...",
      "Publishing your site..."
    ];

    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-300">
        <Loader2 size={48} className="text-primary animate-spin mb-8" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Building &quot;{name}&quot;...
        </h2>
        <div className="w-full max-w-sm mt-8 space-y-4">
          {messages.map((msg, i) => {
            const isDone = loadingStep > i;
            const isCurrent = loadingStep === i;
            return (
              <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${isDone ? 'text-green-600 font-semibold' : isCurrent ? 'text-gray-900 font-bold scale-105' : 'text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${isDone ? 'bg-green-600 border-green-600' : isCurrent ? 'border-gray-900' : 'border-gray-300'}`}>
                  {isDone ? <Check size={12} className="text-white" /> : isCurrent ? <div className="w-2 h-2 rounded-full bg-gray-900 animate-pulse" /> : null}
                </div>
                {msg}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === "success" && demoResult) {
    const liveUrl = demoResult.liveUrl;
    const whatsappAgentShare = `https://wa.me/?text=${encodeURIComponent(`Hi! Here's your free demo website: ${liveUrl} — Valid for 7 days only! 🌟`)}`;

    return (
      <div className="pb-24 pt-8 px-4 animate-in slide-in-from-bottom-8 duration-500 flex flex-col items-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Demo Ready!</h2>
        <p className="text-gray-500 mb-8 text-center">{name} is now live on the web.</p>

        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-xl bg-gray-50 border flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <img src={logo} alt="logo" className="w-full h-full object-contain p-1.5" />
              ) : (
                <span className="font-bold text-xl text-primary">{name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{name}</h3>
              <div className="flex items-center text-sm text-primary font-medium truncate bg-primary/5 py-1 px-2 rounded-md mt-1">
                <LinkIcon size={14} className="mr-1.5 shrink-0" />
                <span className="truncate">{liveUrl.replace('https://', '')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={() => setShowQR(true)}
            className="w-full h-14 flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl font-bold shadow-sm"
          >
            <QrCode size={18} /> Show QR Code
          </button>
          
          <a 
            href={whatsappAgentShare}
            target="_blank"
            rel="noreferrer"
            className="w-full h-14 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl font-bold shadow-sm"
          >
            <MessageCircle size={18} /> Share on WhatsApp
          </a>
          
          <a 
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full h-14 flex items-center justify-center gap-2 bg-gray-100 text-gray-800 rounded-xl font-bold"
          >
            <Smartphone size={18} /> View Demo
          </a>
        </div>

        <button 
          onClick={onSuccess}
          className="mt-8 text-sm font-semibold text-gray-500 hover:text-gray-900 pb-2 border-b border-transparent hover:border-gray-300"
        >
          ← Back to Dashboard
        </button>

        {showQR && (
          <QRModal demo={{ ...demoResult, businessName: name }} onClose={() => setShowQR(false)} />
        )}
      </div>
    );
  }

  return null;
}
