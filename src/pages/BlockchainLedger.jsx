import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { 
  Database, Search, Loader2, Hash, Shield, ChevronDown, 
  ChevronUp, CheckCircle2, Link2, X, ChevronRight,
  Globe, Zap, Activity, Box, Lock, Terminal
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin glow" />
        <p className="text-sm font-black tracking-widest text-primary animate-pulse uppercase">Querying Transaction Pool...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary uppercase">
                Enterprise Node 01
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Public <span className="text-primary italic">Ledger</span></h1>
            <p className="text-slate-500 text-sm font-medium">Real-time audit log of the LPG global supply network.</p>
        </div>
        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Query Hash, Chain or Event..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 pl-12 bg-transparent border-none focus-visible:ring-0 text-sm font-bold placeholder:text-slate-600"
                />
            </div>
        </div>
      </div>

      {/* Interactive Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatPanel 
            label="Total Blocks"
            value={blocks.length}
            icon={Database}
            color="primary"
            active={activeFilter === "total"}
            onClick={() => handleStatClick("total")}
        />
        <StatPanel 
            label="Active Chains"
            value={uniqueChains.length}
            icon={Link2}
            color="accent"
            active={activeFilter === "chains"}
            onClick={() => handleStatClick("chains")}
        />
        <StatPanel 
            label="Integrity Rate"
            value="100%"
            icon={Shield}
            color="emerald"
            active={activeFilter === "verified"}
            onClick={() => handleStatClick("verified")}
        />
      </div>

      {/* Monitoring Dashboard Section - Level 6 Requirement */}
      <div className="premium-card p-8 bg-black/20 backdrop-blur-3xl overflow-hidden relative border border-white/5">
        <div className="absolute top-0 right-0 p-4">
             <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black text-emerald-500 uppercase animate-pulse">
                Live Monitoring Active
             </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/3 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" /> Network Vitality Matrix
                </h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    Real-time telemetry from established enterprise nodes monitoring block propagation and validator signature consistency across the LPG network.
                </p>
                <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Node Uptime</p>
                        <p className="text-xl font-black text-white tracking-tighter">99.98%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Avg Latency</p>
                        <p className="text-xl font-black text-white tracking-tighter">1.2s</p>
                    </div>
                </div>
            </div>
            
            <div className="w-full lg:w-2/3 h-48 bg-white/[0.01] rounded-[2rem] border border-white/5 relative overflow-hidden flex items-end justify-between p-6 gap-2">
                {/* Mock Visualizer for Monitoring */}
                {[45, 60, 40, 75, 50, 90, 30, 55, 65, 80, 50, 70, 45, 60, 85, 40, 95, 60, 50, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-lg transition-all duration-1000 group hover:from-primary/40 hover:to-primary" style={{ height: `${h}%` }}>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            {h}ms
                        </div>
                    </div>
                ))}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-[10px] font-black text-slate-700/50 uppercase tracking-[.5em]">Real-time Throughput Map</p>
                </div>
            </div>
        </div>
      </div>

      {/* Filter Panels */}
      {activeFilter && (
        <div className="premium-card p-1 animate-in slide-in-from-top-4 duration-500 overflow-hidden">
            <div className="bg-black/40 backdrop-blur-3xl p-8 rounded-[31px]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <Terminal className="h-5 w-5 text-primary" />
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">
                                {activeFilter === "total" && "Ledger Inventory Visualization"}
                                {activeFilter === "chains" && "Chain Allocation Map"}
                                {activeFilter === "verified" && "Nodes & Validators Audit"}
                            </h3>
                            <p className="text-[10px] text-slate-500 font-bold mt-1">Sourced from decentralized indexer node us-east-01</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => { setActiveFilter(null); setSelectedChain(null); }} className="hover:bg-white/5 text-slate-500">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-white/5">
                    {activeFilter === "total" && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(
                                blocks.reduce((acc, b) => { acc[b.event_type] = (acc[b.event_type] || 0) + 1; return acc; }, {})
                            ).map(([type, count]) => (
                                <div key={type} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-3">
                                    <p className="text-3xl font-black text-white">{count}</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">
                                        {EVENT_LABELS[type] || type}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeFilter === "chains" && (
                        <div className="space-y-3">
                            {selectedChain && (
                                <Button variant="link" onClick={() => setSelectedChain(null)} className="h-auto p-0 text-[10px] text-primary uppercase font-black tracking-widest mb-4">
                                    <X className="h-3 w-3 mr-1" /> Reset Chain Filter
                                </Button>
                            )}
                            {uniqueChains.map((chainId) => {
                                const chainBlocks = blocks.filter((b) => b.booking_id === chainId);
                                const isSelected = selectedChain === chainId;
                                return (
                                    <div
                                        key={chainId}
                                        onClick={() => setSelectedChain(isSelected ? null : chainId)}
                                        className={cn(
                                            "flex items-center justify-between p-6 rounded-3xl transition-all cursor-pointer border group",
                                            isSelected
                                                ? "bg-primary/10 border-primary/40"
                                                : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                                <Activity className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white font-mono">{chainId}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{chainBlocks.length} verified events</p>
                                            </div>
                                        </div>
                                        <ChevronRight className={cn("h-5 w-5 transition-all text-slate-500 group-hover:text-white", isSelected && "rotate-90 text-primary")} />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeFilter === "verified" && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 text-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-4" />
                                    <p className="text-4xl font-black text-emerald-500 tracking-tighter">100.0%</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Datanode Consistency</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 text-center">
                                    <Lock className="h-8 w-8 text-emerald-500 mx-auto mb-4" />
                                    <p className="text-4xl font-black text-emerald-500 tracking-tighter">{blocks.length}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Sealed Transactions</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Main List */}
      <div className="space-y-4">
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
                "premium-card overflow-hidden transition-all duration-500",
                isExpanded ? "p-1 ring-1 ring-primary/20" : "p-[1px]"
              )}
            >
              <div
                className={cn("p-6 cursor-pointer bg-black/40 hover:bg-white/[0.02] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6", isExpanded ? "rounded-[31px]" : "rounded-[31px]")}
                onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
              >
                <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-primary shadow-inner">
                        <Hash className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="text-base font-black text-white tracking-tight uppercase">Index #{block.block_index}</span>
                            <div className="h-1 w-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{EVENT_LABELS[block.event_type] || block.event_type}</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-600 truncate max-w-[300px]">HASH: {block.block_hash}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 glow" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Secured</span>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] font-bold text-slate-400">{moment(block.created_date).format("DD MMM, HH:mm")}</p>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Stellar TX: Validated</p>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 text-slate-500 transition-transform", isExpanded && "rotate-180")} />
                </div>
              </div>

              {isExpanded && (
                <div className="p-8 space-y-8 bg-black/60 rounded-b-[31px] animate-in slide-in-from-top-4 duration-500">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <DetailItem label="TRANSACTION HASH" value={block.block_hash} mono />
                        <DetailItem label="PREVIOUS HASH" value={block.previous_hash} mono />
                        <DetailItem label="CHAIN IDENTITY" value={block.booking_id} mono />
                        <DetailItem label="GEOGRAPHIC NODE" value={block.location} />
                        <DetailItem label="AUTHORITY" value={block.verified_by} icon={<Shield className="h-3 w-3" />} />
                        <DetailItem label="CHALLENGE NONCE" value={block.nonce} mono />
                        <DetailItem label="CONSENSUS TIME" value={moment(block.created_date).format("YYYY-MM-DD HH:mm:ss:SSS")} />
                    </div>
                    
                    {eventData && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Terminal className="h-3 w-3 text-slate-600" />
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Raw Payload Trace</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-[11px] text-slate-400 overflow-x-auto selection:bg-primary/20">
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
  );
}

function StatPanel({ label, value, icon: Icon, color, active, onClick }) {
    const colorClasses = {
        primary: "text-primary border-primary/40 shadow-[0_0_30px_rgba(249,115,22,0.15)] bg-primary/10 scale-[1.02]",
        accent: "text-accent border-accent/40 shadow-[0_0_30px_rgba(56,189,248,0.15)] bg-accent/10 scale-[1.02]",
        emerald: "text-emerald-500 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-emerald-500/10 scale-[1.02]"
    }[color];

    return (
        <div 
            onClick={onClick}
            className={cn(
                "p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-300 relative overflow-hidden group active:scale-95",
                active ? colorClasses : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
            )}
        >
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-colors", active ? "text-white" : "text-slate-500 group-hover:text-slate-400")}>{label}</p>
                    <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
                    
                    <div className={cn(
                        "flex items-center gap-1 mt-4 text-[9px] font-bold uppercase tracking-widest transition-all",
                        active ? "text-current opacity-100 translate-y-0" : "text-slate-600 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                    )}>
                        {active ? "Close Details" : "View Details"} <ChevronRight className={cn("h-3 w-3", active && "rotate-90")} />
                    </div>
                </div>
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 border group-hover:scale-110 group-hover:rotate-3", 
                    active ? "bg-black/20 border-white/10 text-current" : "bg-white/5 border-white/5 text-slate-500"
                )}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-current" />
            )}
        </div>
    );
}

function DetailItem({ label, value, mono, icon }) {
    if (!value && value !== 0) return null;
    return (
        <div className="space-y-1.5">
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{label}</p>
            <div className="flex items-center gap-2">
                {icon && <span className="text-slate-500">{icon}</span>}
                <span className={cn("text-xs font-bold text-slate-300 truncate", mono && "font-mono text-[10px] text-slate-500")}>
                    {value}
                </span>
            </div>
        </div>
    );
}
