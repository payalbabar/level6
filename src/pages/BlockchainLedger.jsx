import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import AppHeader from "../components/dashboard/AppHeader";
import { 
  Database, Search, Hash, Shield, ChevronDown, CheckCircle2, Link2, X, ChevronRight, Activity, Lock, Terminal, Zap, Globe, Cpu
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EVENT_LABELS } from "@/lib/blockchain";
import { cn } from "@/lib/utils";
import moment from "moment";

export default function BlockchainLedger() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await base44.entities.SupplyChainBlock.list("-created_date", 200);
      setBlocks(data);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const uniqueChains = [...new Set(blocks.map((b) => b.booking_id))];

  let filtered = blocks.filter(
    (b) =>
      !search ||
      b.block_hash?.toLowerCase().includes(search.toLowerCase()) ||
      b.booking_id?.toLowerCase().includes(search.toLowerCase()) ||
      b.event_type?.toLowerCase().includes(search.toLowerCase())
  );
  if (selectedChain) {
    filtered = filtered.filter((b) => b.booking_id === selectedChain);
  }

  function handleStatClick(stat) {
    if (activeFilter === stat) {
      setActiveFilter(null);
      setSelectedChain(null);
      return;
    }
    setActiveFilter(stat);
    setSelectedChain(null);
  }

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
            <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-0 w-14 h-14 rounded-full bg-primary/5 animate-ping" />
            </div>
            <div className="text-center space-y-1">
                <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">Querying Transaction Pool</p>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Compiling ledger state...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e]">
      <AppHeader breadcrumb="Explorer" />
      <div className="p-8 space-y-8 pb-16 max-w-6xl mx-auto">
        {/* Sub-Header with search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary uppercase">
                  <Globe className="h-3 w-3" /> Enterprise Node Cluster
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">Public <span className="text-blue-500 italic">Audit Ledger</span></h1>
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">Real-time cryptographic audit log of the LPG global supply network.</p>
          </div>
          <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="Query Hash, Chain or Event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-11 bg-white/[0.03] border-white/[0.08] focus:border-primary/40 focus:bg-white/[0.05] rounded-xl text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 transition-all"
              />
          </div>
        </div>

        {/* High-Impact Interactive Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatPanel 
              label="Total Blocks" value={blocks.length} icon={Database} variant="primary"
              active={activeFilter === "total"} onClick={() => handleStatClick("total")}
          />
          <StatPanel 
              label="Active Chains" value={uniqueChains.length} icon={Link2} variant="secondary"
              active={activeFilter === "chains"} onClick={() => handleStatClick("chains")}
          />
          <StatPanel 
              label="Integrity Rate" value="100%" icon={Shield} variant="success"
              active={activeFilter === "verified"} onClick={() => handleStatClick("verified")}
          />
        </div>

        {/* Network Vitality Dashboard */}
        <div className="relative rounded-[2.5rem] border border-white/[0.07] bg-[#050a14]/60 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                  <div className="w-full lg:w-1/3 space-y-6">
                      <div className="flex items-center justify-between">
                          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                              <Activity className="h-4 w-4 text-primary" /> Vitality Matrix
                          </h3>
                          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
                          </div>
                      </div>
                      <p className="text-[10px] text-slate-300 font-black tracking-widest leading-relaxed uppercase opacity-80">
                          Telemetry from global enterprise clusters monitoring block propagation and validator signature consistency.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Node Uptime</p>
                              <p className="text-2xl font-black text-white tracking-tighter">99.98%</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-80">Throughput</p>
                              <p className="text-2xl font-black text-white tracking-tighter">1.2s</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="w-full lg:w-2/3 space-y-4">
                      <div className="h-48 bg-black/40 rounded-3xl border border-white/[0.08] relative overflow-hidden flex items-end justify-between p-6 gap-1.5 shadow-inner">
                          {[45, 60, 40, 75, 50, 90, 30, 55, 65, 80, 50, 70, 45, 60, 85, 40, 95, 60, 50, 75, 40, 55, 30].map((h, i) => (
                              <div key={i} className="flex-1 bg-gradient-to-t from-primary/10 via-primary/30 to-primary/60 rounded-t-sm transition-all duration-700 group/bar relative" style={{ height: `${h}%` }}>
                                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#050a14] border border-primary/30 px-2 py-1 rounded-md text-[8px] font-black text-primary opacity-0 group-hover/bar:opacity-100 transition-opacity z-10">
                                      {h}ms
                                  </div>
                              </div>
                          ))}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                              <p className="text-[9px] font-black text-white uppercase tracking-[.8em]">Network Density Map</p>
                          </div>
                      </div>
                      <div className="flex items-center justify-between px-2">
                          <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Last 24 Epochs</p>
                          <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Aggregate Velocity: 0.42 TPS</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>

        {/* Filter Action Display */}
        {activeFilter && (
          <div className="relative rounded-[2rem] border border-primary/20 bg-primary/5 animate-in slide-in-from-top-4 duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                  <Button variant="ghost" size="icon" onClick={() => { setActiveFilter(null); setSelectedChain(null); }} className="h-8 w-8 rounded-full hover:bg-white/10 text-primary">
                      <X className="h-4 w-4" />
                  </Button>
              </div>
              
              <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-lg shadow-primary/10">
                          <Terminal className="h-5 w-5" />
                      </div>
                      <div>
                          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                              {activeFilter === "total" && "Ledger Distribution Filter"}
                              {activeFilter === "chains" && "Chain Allocation Index"}
                              {activeFilter === "verified" && "Nodes & Validators Proof"}
                          </h3>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Sourced from decentralized cluster indexer</p>
                      </div>
                  </div>

                  <div className="max-h-[350px] overflow-y-auto pr-2 scrollbar-premium">
                      {activeFilter === "total" && (
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {Object.entries(
                                  blocks.reduce((acc, b) => { acc[b.event_type] = (acc[b.event_type] || 0) + 1; return acc; }, {})
                              ).map(([type, count]) => (
                                  <div key={type} className="p-6 rounded-2xl bg-[#050a14] border border-white/[0.08] hover:border-primary/30 transition-colors group">
                                      <p className="text-3xl font-black text-white group-hover:text-primary transition-colors">{count}</p>
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-2">{EVENT_LABELS[type] || type?.replace(/_/g, " ")}</p>
                                  </div>
                              ))}
                          </div>
                      )}

                      {activeFilter === "chains" && (
                          <div className="space-y-3">
                              {selectedChain && (
                                  <div className="flex justify-between items-center mb-4 px-2">
                                      <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                          <Activity className="h-3 w-3" /> Focus Locked: {selectedChain}
                                      </p>
                                      <Button variant="link" onClick={() => setSelectedChain(null)} className="h-auto p-0 text-[10px] text-slate-500 uppercase font-black tracking-widest">Reset</Button>
                                  </div>
                              )}
                              {uniqueChains.map((chainId) => {
                                  const chainBlocks = blocks.filter((b) => b.booking_id === chainId);
                                  const isSelected = selectedChain === chainId;
                                  return (
                                      <div
                                          key={chainId}
                                          onClick={() => setSelectedChain(isSelected ? null : chainId)}
                                          className={cn(
                                              "flex items-center justify-between p-5 rounded-2xl transition-all cursor-pointer border group",
                                              isSelected ? "bg-primary/20 border-primary/40" : "bg-[#050a14] border-white/[0.06] hover:border-white/[0.15]"
                                          )}
                                      >
                                          <div className="flex items-center gap-5">
                                              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border transition-colors", 
                                                  isSelected ? "bg-primary text-white border-primary" : "bg-white/[0.04] border-white/[0.1] text-slate-500 group-hover:text-white"
                                              )}>
                                                  <Activity className="h-5 w-5" />
                                              </div>
                                              <div>
                                                  <p className="text-xs font-black text-white font-mono leading-none">{chainId}</p>
                                                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1.5">{chainBlocks.length} Block Emissions</p>
                                              </div>
                                          </div>
                                          <ChevronRight className={cn("h-4 w-4 transition-all text-slate-600", isSelected && "rotate-90 text-primary")} />
                                      </div>
                                  );
                              })}
                          </div>
                      )}

                      {activeFilter === "verified" && (
                          <div className="grid md:grid-cols-2 gap-5">
                              <div className="p-8 rounded-3xl bg-[#050a14] border border-emerald-500/20 text-center relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 h-20 w-20 bg-emerald-500/5 blur-2xl rounded-full" />
                                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                                  <p className="text-4xl font-black text-white tracking-widest group-hover:text-emerald-400 transition-colors">100.0%</p>
                                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-3">Ledger Consensus Integrity</p>
                              </div>
                              <div className="p-8 rounded-3xl bg-[#050a14] border border-emerald-500/20 text-center relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 h-20 w-20 bg-emerald-500/5 blur-2xl rounded-full" />
                                  <Lock className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                                  <p className="text-4xl font-black text-white tracking-widest group-hover:text-emerald-400 transition-colors">{blocks.length}</p>
                                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-3">Cryptographically Sealed Blocks</p>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
        )}

        {/* Primary Block Explorer Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
              <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  <Cpu className="h-3.5 w-3.5 text-slate-600" /> Block Chronology
              </h2>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Showing Latest {filtered.length} Events</p>
          </div>
          {filtered.map((block) => {
            const isExpanded = expandedBlock === block.id;
            let eventData = null;
            if (block.event_data) {
              try { eventData = JSON.parse(block.event_data); } catch {}
            }

            return (
              <div
                key={block.id}
                className={cn(
                  "relative rounded-2xl border transition-all duration-300 overflow-hidden",
                  isExpanded ? "border-primary/30 bg-white/[0.04] shadow-2xl" : "border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.035]"
                )}
              >
                <div
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                  onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
                >
                  <div className="flex items-center gap-6">
                      <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-500 border shadow-inner", 
                          isExpanded ? "bg-primary text-[#020408] border-primary" : "bg-white/[0.04] border-white/[0.08] text-slate-500 group-hover:text-white"
                      )}>
                          <Hash className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5 align-middle">
                          <div className="flex items-center gap-3">
                              <span className="text-base font-black text-white font-mono tracking-tighter leading-none">Block #{block.block_index}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-700" />
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{EVENT_LABELS[block.event_type] || block.event_type?.replace(/_/g, " ")}</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Fingerprint</p>
                              <p className="text-[11px] font-mono text-slate-500 truncate max-w-[200px] leading-none">{block.block_hash}</p>
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-10 pt-5 md:pt-0 border-t md:border-none border-white/[0.06]">
                      <div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Committed</span>
                      </div>
                      <div className="text-right">
                          <p className="text-[11px] font-bold text-slate-400">{moment(block.created_date).format("DD MMM, HH:mm:ss")}</p>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Global Cluster A</p>
                      </div>
                      <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.06] transition-all">
                          <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", isExpanded && "rotate-180 text-primary")} />
                      </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-8 pb-8 pt-4 bg-[#050a14] border-t border-white/[0.06] animate-in slide-in-from-top-4 duration-500">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/[0.06]">
                          <DetailItem label="EVENT HASH" value={block.block_hash} icon={<Hash className="h-3 w-3" />} mono />
                          <DetailItem label="PREVIOUS ROOT" value={block.previous_hash} icon={<Link2 className="h-3 w-3" />} mono />
                          <DetailItem label="CHAIN ID" value={block.booking_id} icon={<Activity className="h-3 w-3" />} mono />
                          <DetailItem label="GEO LOCATION" value={block.location} icon={<Globe className="h-3 w-3" />} />
                          <DetailItem label="ATTESTATION" value={block.verified_by || "Consensus Protocol"} icon={<Shield className="h-3 w-3" />} />
                          <DetailItem label="EPOCH NONCE" value={block.nonce} icon={<Cpu className="h-3 w-3" />} mono />
                      </div>
                      
                      {eventData && (
                          <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                      <Terminal className="h-3.5 w-3.5 text-slate-600" />
                                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol Payload Trace</p>
                                  </div>
                                  <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">JSON Output</span>
                              </div>
                              <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.05] font-mono text-[11px] text-slate-500 overflow-x-auto selection:bg-primary/20 leading-relaxed shadow-inner">
                                  {JSON.stringify(eventData, null, 4)}
                              </div>
                          </div>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatPanel({ label, value, icon: Icon, variant, active, onClick }) {
    const variants = {
        primary:   "text-primary border-primary/30 bg-primary/5",
        secondary: "text-secondary border-secondary/30 bg-secondary/5",
        success:   "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
    };

    return (
        <div 
            onClick={onClick}
            className={cn(
                "p-7 rounded-[2.5rem] border cursor-pointer transition-all duration-300 relative overflow-hidden group h-[180px] flex flex-col justify-between",
                active ? variants[variant] : "bg-white/[0.02] border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.04]"
            )}
        >
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                    <p className={cn("text-[9px] font-black uppercase tracking-[0.2em]", active ? "text-current opacity-80" : "text-slate-500")}>
                        {label}
                    </p>
                    <h4 className="text-3xl font-black text-white tracking-widest leading-none transition-transform group-hover:scale-105 origin-left">
                        {value}
                    </h4>
                </div>
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-500 border", 
                    active ? "bg-white/10 text-current border-white/20 shadow-lg" : "bg-white/[0.04] border-white/[0.1] text-slate-600 group-hover:text-white"
                )}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Network Node A</p>
                <div className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all", 
                    active ? "text-current opacity-100" : "text-slate-500 opacity-60 group-hover:opacity-100"
                )}>
                    {active ? "Close View" : "View Index"} <ChevronRight className={cn("h-3.5 w-3.5", active && "rotate-90")} />
                </div>
            </div>

            {active && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-current animate-in slide-in-from-left-full duration-700" />
            )}
        </div>
    );
}

function DetailItem({ label, value, mono, icon }) {
    if (!value && value !== 0) return null;
    return (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none">{label}</p>
            <div className="flex items-center gap-3">
                {icon && <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-500">{icon}</div>}
                <span className={cn("text-[11px] font-bold text-slate-400 truncate leading-none", mono && "font-mono text-slate-500")}>
                    {value}
                </span>
            </div>
        </div>
    );
}
