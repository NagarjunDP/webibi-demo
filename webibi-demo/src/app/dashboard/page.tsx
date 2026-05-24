"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, ExternalLink, Clock, Sparkles, ChevronRight, Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [demos, setDemos] = useState<any[]>([]);

  const AGENCY_PHONE = "919739436319";
  const AGENCY_DISPLAY_PHONE = "+91 97394 36319";

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/demos", { credentials: "include" });
      if (res.status === 401) {
        router.replace("/");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setDemos(data.demos);
      }
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleGenerate = () => {
    router.push("/?action=create");
  };

  const handleLogout = () => {
    localStorage.removeItem("webibi_admin_token");
    document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.replace("/");
  };

  const calculateDaysLeft = (expiresAt: string) => {
    const now = new Date().getTime();
    const exp = new Date(expiresAt).getTime();
    const diff = exp - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading && demos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-[#05050a]">
        <Loader2 className="w-12 h-12 animate-spin text-[#c471ed] mb-4" />
        <p className="text-[#a0a0b0] font-medium tracking-wide">Syncing your portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#05050a] font-sans flex flex-col max-w-md mx-auto relative text-white">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-20%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-20%] w-96 h-96 bg-[#c471ed]/20 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Header (Glass) - FIXED */}
      <div className="h-20 flex items-center justify-between px-6 fixed top-0 w-full max-w-md mx-auto z-50 bg-[#05050a]/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="flex items-center">
          <img 
            src="/assets/logoo.png" 
            alt="Agency Logo" 
            className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
          />
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-white/50 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full pt-24 p-5 flex flex-col gap-6 relative z-10 pb-40">
        
        {/* Agency Contact Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg flex flex-col gap-3 relative overflow-hidden shrink-0"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-sm font-bold text-white/80">Agency Support</h2>
          <div className="flex gap-3 relative z-10">
            <a 
              href={`https://wa.me/${AGENCY_PHONE}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 text-[#25D366] rounded-xl py-2.5 flex items-center justify-center gap-2 font-bold text-sm transition-colors"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a 
              href={`tel:+${AGENCY_PHONE}`}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 font-bold text-sm transition-colors"
            >
              <Phone size={16} /> Call Us
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-1 mt-2 shrink-0"
        >
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
            Your Creations
          </h1>
          <p className="text-white/40 text-sm font-medium">Manage your demo websites</p>
        </motion.div>

        <AnimatePresence>
          {demos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl text-center flex flex-col items-center mt-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/10">
                <Sparkles className="w-10 h-10 text-[#c471ed]" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-white">Empty Canvas</h3>
              <p className="text-white/50 text-sm leading-relaxed">You haven't generated any websites yet. Tap the button below to start your journey.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-5">
              {demos.map((demo, i) => {
                const url = `https://${typeof window !== 'undefined' ? window.location.host : 'demo.webibi.tech'}/${demo.slug}`;
                const daysLeft = calculateDaysLeft(demo.expiresAt);
                const progressPct = demo.expired ? 0 : Math.max(0, (daysLeft / 7) * 100);

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={demo.slug} 
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden group shrink-0"
                  >
                    {/* Card background hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex justify-between items-start mb-5 relative z-10">
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-[#c471ed]/20 border border-white/10 flex items-center justify-center shadow-inner">
                          {demo.logoUrl ? (
                            <img src={demo.logoUrl} alt="logo" className="w-8 h-8 object-contain drop-shadow-md" />
                          ) : (
                            <span className="font-black text-xl text-white/80">{demo.businessData?.name?.charAt(0) || "U"}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-bold text-lg text-white leading-tight mb-1">{demo.businessData?.name || "Unknown"}</h3>
                          <span className="text-xs font-semibold tracking-wider text-[#c471ed] uppercase">{demo.businessData?.industry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-5">
                      <div className="flex-1 bg-black/40 rounded-xl p-3 border border-white/5 flex items-center justify-between group/link hover:bg-black/60 transition-colors">
                        <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-white/70 hover:text-white truncate flex-1 flex items-center gap-2">
                          <span className="truncate">{url.replace('https://', '')}</span>
                        </a>
                        <ExternalLink size={14} className="text-white/30 group-hover/link:text-white transition-colors shrink-0" />
                      </div>
                    </div>

                    {/* Custom Progress Visualization */}
                    <div className="relative pt-3 border-t border-white/5 flex items-center justify-between gap-4">
                      {demo.expired ? (
                        <div className="flex items-center gap-2 w-full justify-center py-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
                          <span className="font-black tracking-wider text-xs uppercase">Expired</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-end mb-1">
                              <span className="text-xs font-bold text-white/40 flex items-center gap-1">
                                <Clock size={12} /> Time Remaining
                              </span>
                              <span className="text-sm font-black text-white">{daysLeft} Days</span>
                            </div>
                            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full rounded-full ${daysLeft <= 2 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-primary to-[#c471ed]'}`}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Glassmorphic Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            className="w-full relative group overflow-hidden rounded-2xl shadow-[0_0_40px_-10px_rgba(124,92,252,0.6)] border border-white/20"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent z-10 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#c471ed] to-primary bg-[length:200%_100%] animate-gradient z-0" />
            
            <div className="relative z-20 flex items-center justify-center gap-3 py-4 px-6 backdrop-blur-md">
              <Plus className="w-6 h-6 text-white" />
              <span className="font-black text-lg tracking-wide text-white">CREATE WEBSITE</span>
              <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
