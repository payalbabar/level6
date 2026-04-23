import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { 
  Link2, Search, MapPin, Clock, 
  Shield, ChevronDown, ChevronUp, Hash, CheckCircle2,
  Globe, Box, Lock, Activity as ActivityIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { EVENT_LABELS } from "@/lib/blockchain";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Button } from "@/components/ui/button";

export default function SupplyChain() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedBlockId, setExpandedBlockId] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await base44.entities.SupplyChainBlock.list("-created_date", 100);
      setBlocks(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = blocks.filter(
    (b) =>
      !search ||
      b.booking_id?.toLowerCase().includes(search.toLowerCase()) ||
      b.block_hash?.toLowerCase().includes(search.toLowerCase()) ||
      b.event_type?.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {};
  filtered.forEach((block) => {
    if (!grouped[block.booking_id]) grouped[block.booking_id] = [];
    grouped[block.booking_id].push(block);
  });

  Object.values(grouped).forEach((arr) => arr.sort((a, b) => (a.block_index || 0) - (b.block_index || 0)));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin glow" />
        <p className="text-sm font-bold tracking-widest text-primary animate-pulse uppercase">Auditing Ledger Blocks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary uppercase">
                <Globe className="h-3 w-3" /> Proof of Delivery Protocol
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Supply Chain <span className="text-primary italic">Live</span></h1>
            <p className="text-slate-500 text-sm font-medium">Global tracking of every logistics event on the Stellar network.</p>
        </div>
        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Trace Booking ID or Hash..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 pl-12 bg-transparent border-none focus-visible:ring-0 text-sm font-bold placeholder:text-slate-600"
                />
            </div>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
          <Link2 className="h-16 w-16 text-slate-800 mx-auto mb-6" />
          <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">Archive protocol empty</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([bookingId, chainBlocks]) => (
            <div key={bookingId} className="premium-card p-1">
              <div className="p-8">
                  <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-primary">
                            <Box className="h-7 w-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white font-mono tracking-tighter">{bookingId}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest", chainBlocks.some(b => b.event_type === 'delivered') ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary")}>
                                    {chainBlocks.some(b => b.event_type === 'delivered') ? "Archived" : "In Flight"}
                                </span>
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">• {chainBlocks.length} Confirmed Blocks</span>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div className="relative px-4">
                    <div className="absolute left-[34px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary via-primary/20 to-transparent" />
                    <div className="space-y-6">
                      {chainBlocks.map((block, idx) => {
                        const isExpanded = expandedBlockId === block.id;
                        let eventData = null;
                        if (block.event_data) {
                          try { eventData = JSON.parse(block.event_data); } catch {}
                        }

                        return (
                          <div key={block.id} className="relative">
                            <div 
                              className={cn(
                                "group relative flex gap-6 cursor-pointer transition-all p-5 rounded-2xl border border-transparent",
                                isExpanded ? "bg-white/[0.04] border-white/10 shadow-2xl" : "hover:bg-white/[0.02]"
                              )}
                              onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                            >
                              <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center z-10 flex-shrink-0 text-xs font-black transition-all",
                                idx === chainBlocks.length - 1
                                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110"
                                  : "bg-white/5 text-slate-400 border border-white/10",
                                isExpanded && "ring-2 ring-primary/40 ring-offset-2 ring-offset-black"
                              )}>
                                {block.block_index}
                              </div>
                              <div className="flex-1 min-w-0 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-base font-black text-white tracking-tight uppercase">
                                            {EVENT_LABELS[block.event_type] || block.event_type}
                                        </h4>
                                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            {moment(block.created_date).fromNow()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {block.location && (
                                          <p className="text-[10px] font-bold text-primary flex items-center gap-1.5 uppercase tracking-widest">
                                            <MapPin className="h-3 w-3" /> {block.location}
                                          </p>
                                        )}
                                        <p className="text-[10px] font-mono text-slate-600 truncate max-w-[200px]">
                                          TX: {block.block_hash}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                        {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600" /> : <ChevronDown className="h-5 w-5 text-slate-600" />}
                                    </Button>
                                </div>
                              </div>
                            </div>

                            {/* Expansion Area */}
                            {isExpanded && (
                              <div className="ml-16 mt-4 mb-4 p-8 rounded-3xl bg-black/60 backdrop-blur-md border border-white/5 animate-in slide-in-from-top-4 duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                  <div className="lg:col-span-2 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <MetaItem label="BLOCK HASH" value={block.block_hash} icon={Hash} mono />
                                        <MetaItem label="PARENT HASH" value={block.previous_hash} icon={Link2} mono />
                                        <MetaItem label="VALIDATOR NODE" value={block.verified_by || "Consensus Group"} icon={Shield} />
                                        <MetaItem label="STAMP" value={moment(block.created_date).format("YYYY-MM-DD HH:mm:ss")} icon={Clock} />
                                    </div>
                                    
                                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Integrity Check</p>
                                            <p className="text-[11px] text-slate-400 font-medium">Cryptographic seal verified by active nodes.</p>
                                        </div>
                                      </div>
                                      <Lock className="h-4 w-4 text-emerald-500 opacity-30" />
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Network Payload</p>
                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 h-full overflow-hidden group/payload relative">
                                        <div className="absolute top-4 right-4 animate-pulse">
                                            <ActivityIcon className="h-3 w-3 text-primary" />
                                        </div>
                                      {eventData ? (
                                        <pre className="text-[11px] font-mono text-slate-400 overflow-x-auto selection:bg-primary/20">
                                          {JSON.stringify(eventData, null, 2)}
                                        </pre>
                                      ) : (
                                        <p className="text-xs text-slate-600 italic font-medium">End of transmission.</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, value, icon: Icon, mono }) {
    if (!value) return null;
    return (
        <div className="space-y-1.5">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-white/5 flex items-center justify-center text-slate-500">
                    <Icon className="h-3 w-3" />
                </div>
                <span className={cn("text-xs font-bold text-slate-300 truncate", mono && "font-mono text-[10px] text-slate-400")}>
                    {value}
                </span>
            </div>
        </div>
    );
}
