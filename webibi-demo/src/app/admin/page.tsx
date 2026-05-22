"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, LayoutDashboard, Eye, Activity, Calendar, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalDemos: 0, demosToday: 0, totalOpens: 0, activeDemos: 0 });
  const [demos, setDemos] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [statsRes, demosRes] = await Promise.all([
          fetch("/api/admin/stats", { credentials: "include" }),
          fetch("/api/admin/demos", { credentials: "include" })
        ]);

        if (statsRes.status === 401 || demosRes.status === 401) {
          router.replace("/");
          return;
        }

        const statsData = await statsRes.json();
        const demosData = await demosRes.json();

        if (isMounted) {
          if (statsData.success) setStats(statsData.stats);
          if (demosData.success) setDemos(demosData.demos);
          setLoading(false);
        }
      } catch (err) {
        console.error("Admin fetch error", err);
        if (isMounted) router.replace("/");
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [router]);

  const filteredDemos = demos.filter(d => 
    d.businessData?.name?.toLowerCase().includes(search.toLowerCase()) || 
    d.agentPhone?.includes(search)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#0a0a0f] text-foreground p-4 sm:p-6 md:p-10 w-full flex flex-col gap-8 animate-in fade-in duration-700 overflow-y-auto font-sans">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 relative z-10 border-b border-white/5 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center px-3 py-1 mb-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                System Live
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight flex items-center gap-3">
              <LayoutDashboard className="text-primary h-10 w-10 sm:h-12 sm:w-12" /> Admin Portal
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
              Manage system-wide generated demos, track engagement, and oversee agent activity in real-time.
            </p>
          </div>
          
          <div className="relative w-full sm:w-80 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-[#c471ed] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-[#0d0d14] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search business, city or phone..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 bg-transparent border-0 h-12 text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 w-full"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "Total Demos", value: stats.totalDemos, icon: LayoutDashboard, color: "from-blue-500/20 to-blue-500/5", text: "text-blue-400", border: "border-blue-500/20" },
            { label: "Generated Today", value: stats.demosToday, icon: Calendar, color: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-400", border: "border-emerald-500/20" },
            { label: "Total Opens", value: stats.totalOpens, icon: Eye, color: "from-purple-500/20 to-purple-500/5", text: "text-purple-400", border: "border-purple-500/20" },
            { label: "Active Demos", value: stats.activeDemos, icon: Activity, color: "from-amber-500/20 to-amber-500/5", text: "text-amber-400", border: "border-amber-500/20" }
          ].map((stat, i) => (
            <div key={i} className={`group relative bg-[#12121a] backdrop-blur-xl border border-white/5 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <h2 className={`text-4xl sm:text-5xl font-black ${stat.text} tracking-tight`}>{stat.value}</h2>
                </div>
                <div className={`p-3 rounded-xl bg-[#0a0a0f] border ${stat.border} shadow-inner`}>
                  <stat.icon size={24} className={stat.text} />
                </div>
              </div>
              
              {/* Decorative background shape */}
              <div className="absolute -bottom-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500">
                <stat.icon size={120} />
              </div>
            </div>
          ))}
        </div>

        {/* Demos Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-semibold font-heading tracking-tight">Recent Deployments</h3>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground shadow-sm">
              Showing {filteredDemos.length} results
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-[#12121a] backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0a0a0f]/80 backdrop-blur-md text-muted-foreground/80 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="px-6 py-5 border-b border-white/5">Business Details</th>
                  <th className="px-6 py-5 border-b border-white/5">Agent / Creator</th>
                  <th className="px-6 py-5 border-b border-white/5">Performance</th>
                  <th className="px-6 py-5 border-b border-white/5 text-right">Status & Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDemos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Search className="w-10 h-10 opacity-20" />
                        <p>No demos found matching your search criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDemos.map((demo, idx) => (
                    <tr key={demo.id || idx} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1e1e2d] to-[#0a0a0f] border border-white/10 flex items-center justify-center shadow-inner group-hover:border-primary/30 transition-colors">
                            <span className="font-bold text-lg text-primary">{demo.businessData?.name?.charAt(0) || "U"}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-base tracking-tight">{demo.businessData?.name || "Unknown Business"}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="capitalize px-1.5 py-0.5 rounded-md bg-white/5 font-medium">{demo.businessData?.industry || "N/A"}</span>
                              <span>&bull;</span>
                              <span>{demo.businessData?.city || "Unknown Location"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-sm text-foreground/80">{demo.agentPhone || "N/A"}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(demo.generatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{demo.opensCount || 0}</span>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Views</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right space-y-3">
                        <div>
                          {demo.expired ? (
                            <span className="inline-flex px-2.5 py-1 rounded-md bg-destructive/10 text-destructive text-[10px] uppercase font-bold tracking-widest border border-destructive/20 shadow-[0_0_10px_rgba(255,0,0,0.1)]">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold tracking-widest border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                              Active Live
                            </span>
                          )}
                        </div>
                        <div>
                          <a 
                            href={`http://${typeof window !== 'undefined' ? window.location.host : 'demo.webibi.tech'}/${demo.slug}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary hover:text-white transition-colors text-xs font-semibold group/link"
                          >
                            Open Portal <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {filteredDemos.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-[#12121a] rounded-2xl border border-white/5">
                No demos found matching your search.
              </div>
            ) : (
              filteredDemos.map((demo, idx) => (
                <div key={demo.id || idx} className="bg-[#12121a] backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col gap-4 shadow-xl hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#0a0a0f] border border-white/10 flex items-center justify-center">
                        <span className="font-bold text-lg text-primary">{demo.businessData?.name?.charAt(0) || "U"}</span>
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{demo.businessData?.name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground flex gap-1.5 items-center">
                          <span className="capitalize">{demo.businessData?.industry || "N/A"}</span>
                          <span>&bull;</span>
                          <span>{demo.businessData?.city || "Unknown City"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 bg-[#0a0a0f] p-3 rounded-xl border border-white/5">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Agent Phone</p>
                      <p className="font-mono text-xs text-foreground/90 truncate">{demo.agentPhone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Views</p>
                      <p className="font-bold text-sm text-primary">{demo.opensCount || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div>
                      {demo.expired ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-destructive text-[10px] uppercase font-bold tracking-widest border border-destructive/20">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded text-emerald-400 text-[10px] uppercase font-bold tracking-widest border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </div>
                    <a 
                      href={`http://${typeof window !== 'undefined' ? window.location.host : 'demo.webibi.tech'}/${demo.slug}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-xs font-semibold"
                    >
                      View Site <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
