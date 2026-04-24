import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Database, MapPin, Clock, Loader2, Terminal, Link2, CheckCircle2, ShieldCheck, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_COLORS, EVENT_LABELS, generateBlockHash } from "@/lib/blockchain";
import { cn } from "@/lib/utils";
import moment from "moment";
import { toast } from "@/hooks/use-toast";

const STATUS_FLOW = ["pending", "confirmed", "dispatched", "in_transit", "delivered"];

export default function BookingDetail({ booking, onBack }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    async function load() {
      const data = await base44.entities.SupplyChainBlock.filter(
        { booking_id: booking.booking_id },
        "created_date",
        50
      );
      setBlocks(data);
      setLoading(false);
    }
    load();
  }, [booking.booking_id]);

  async function handleStatusUpdate() {
    if (!newStatus) return;
    setUpdating(true);

    try {
        await base44.entities.Booking.update(booking.id, { status: newStatus });

        const maxIndex = blocks.reduce((max, b) => Math.max(max, b.block_index || 0), 0);
        const lastBlock = blocks.find(b => b.block_index === maxIndex) || blocks[0];
        const prevHash = lastBlock?.block_hash || "0x0000000000000000";
        const newHash = generateBlockHash(prevHash, { booking_id: booking.booking_id, event: newStatus });

        const eventMap = {
          confirmed: "cylinder_assigned",
          dispatched: "dispatched",
          in_transit: "in_transit",
          delivered: "delivered",
        };

        await base44.entities.SupplyChainBlock.create({
          block_index: maxIndex + 1,
          block_hash: newHash,
          previous_hash: prevHash,
          timestamp: new Date().toISOString(),
          booking_id: booking.booking_id,
          event_type: eventMap[newStatus] || newStatus,
          event_data: JSON.stringify({ status: newStatus, updated_at: new Date().toISOString() }),
          location: newStatus === "delivered" ? booking.customer_address : "Distribution Network",
          verified_by: "Decentralized Node Authority",
          nonce: Math.floor(Math.random() * 100000),
        });

        const updatedBlocks = await base44.entities.SupplyChainBlock.filter(
          { booking_id: booking.booking_id },
          "created_date",
          50
        );
        setBlocks(updatedBlocks);
        toast({ title: "✓ Network State Synchronized", description: "New state successfully committed to blockchain." });
    } catch (err) {
        toast({ title: "Command Failed", description: "Failed to broadcast state update.", variant: "destructive" });
    } finally {
        setUpdating(false);
        setNewStatus("");
    }
  }

  const currentIdx = STATUS_FLOW.indexOf(booking.status);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl hover:bg-white/[0.04] text-slate-500 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Index
        </Button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" /> Audit Active
        </div>
      </div>

      {/* Main Order Card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.02] shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        
        <div className="p-8 lg:p-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 border-b border-white/[0.06]">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                            <Terminal className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Contract Execution</p>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-white font-mono tracking-tighter leading-none">{booking.booking_id}</h1>
                                <span className={cn("text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border", 
                                    booking.status === 'delivered' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                                )}>
                                    {booking.status?.replace("_", " ")}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-2.5 w-2.5" /> Identity Node
                            </p>
                            <p className="text-sm font-bold text-slate-300">{booking.customer_name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{booking.customer_phone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="h-2.5 w-2.5" /> Destination Node
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[200px]">{booking.customer_address}</p>
                        </div>
                    </div>
                </div>

                <div className="text-left md:text-right space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Settlement</p>
                    <p className="text-4xl font-black text-white tracking-widest font-mono">₹{(booking.final_amount || 0).toLocaleString()}</p>
                    {booking.subsidy_applied > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/8 text-emerald-500 border border-emerald-500/10">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sponsored by Scheme</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Lifecycle Progress */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Lifecycle Tracking</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Current Step: {currentIdx + 1} / {STATUS_FLOW.length}</p>
                </div>
                <div className="flex items-center gap-2">
                {STATUS_FLOW.map((status, i) => (
                    <div key={status} className="flex-1 space-y-4">
                        <div
                            className={cn(
                            "h-1.5 w-full rounded-full transition-all duration-1000",
                            i <= currentIdx ? "bg-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "bg-white/[0.05]"
                            )}
                        />
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-[0.1em] block text-center transition-colors",
                            i <= currentIdx ? "text-primary" : "text-slate-700"
                        )}>
                            {status.replace("_", " ")}
                        </span>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>

      {/* Broadcast Command - Dynamic Panel */}
      {booking.status !== "delivered" && booking.status !== "cancelled" && (
        <div className="relative group p-6 md:p-8 rounded-3xl border border-white/[0.08] bg-[#050a14]/60 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                    <Database className="h-5 w-5" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">Command State Transition</h3>
                   <p className="text-[11px] text-slate-500 font-medium mt-1">Authorized node required to broadcast status update to the network.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/[0.03] border-white/[0.08] h-11 rounded-xl text-white font-bold text-xs">
                    <SelectValue placeholder="Select new state..." />
                </SelectTrigger>
                <SelectContent className="bg-[#050a14] border-white/[0.1] text-white">
                  {STATUS_FLOW.filter((_, i) => i > currentIdx).map((s) => (
                    <SelectItem key={s} value={s} className="font-bold text-[10px] uppercase tracking-widest focus:bg-primary/20 focus:text-primary transition-colors py-2.5">
                        {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={!newStatus || updating} 
                className="w-full sm:w-auto h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-[#020408] font-black tracking-[0.1em] text-[10px] uppercase transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
              >
                {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                {updating ? "Processing..." : "Commit Change"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Ledger Trail */}
      <div className="relative rounded-[2rem] border border-white/[0.07] bg-white/[0.015] overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <Link2 className="h-4 w-4" />
            </div>
            <div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Cryptographic Audit Trail</h2>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">Network Execution Logs</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Indexed Blocks</p>
             <p className="text-xl font-black text-white font-mono leading-none">{blocks.length}</p>
          </div>
        </div>

        <div className="p-8 lg:p-10">
            {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <p className="text-[10px] text-primary font-black uppercase tracking-widest">Syncing trail state...</p>
            </div>
            ) : blocks.length === 0 ? (
            <div className="text-center py-20 opacity-50">
                <Database className="h-10 w-10 text-slate-700 mx-auto mb-4" />
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest">No block emissions detected</p>
            </div>
            ) : (
            <div className="relative pl-4 sm:pl-8">
                <div className="absolute left-[34px] sm:left-[50px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />
                <div className="space-y-10">
                {blocks.map((block, idx) => (
                    <div key={block.id} className="relative flex flex-col sm:flex-row gap-6 sm:gap-10 group/item">
                    {/* Block circle */}
                    <div className={cn(
                        "h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center z-10 shrink-0 border transition-all duration-500",
                        idx === 0 ? "bg-primary text-[#020408] border-primary shadow-xl shadow-primary/20 scale-110" : "bg-[#050a14] text-slate-500 border-white/[0.08]"
                    )}>
                        <span className="text-[11px] font-black font-mono">#{block.block_index}</span>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-white uppercase tracking-widest">
                                    {EVENT_LABELS[block.event_type] || block.event_type?.replace(/_/g, " ")}
                                </span>
                                {idx === 0 && <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 font-black animate-pulse uppercase">Latest</span>}
                            </div>
                            <span className="text-[10px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-widest">
                                <Clock className="h-3 w-3" />
                                {moment(block.created_date).format("DD MMM YYYY, HH:mm:ss")}
                            </span>
                        </div>

                        {block.location && (
                        <p className="text-[10px] text-primary font-black flex items-center gap-2 uppercase tracking-widest">
                            <MapPin className="h-3 w-3" /> {block.location}
                        </p>
                        )}

                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] group-hover/item:border-white/[0.12] transition-colors space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Verification Node</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <p className="text-[10px] font-bold text-slate-400">{block.verified_by || "Protocol Agent"}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Event Hash</p>
                                    <p className="text-[10px] font-mono text-slate-500 truncate">{block.block_hash}</p>
                                </div>
                            </div>
                            
                            <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500/60" />
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Blockchain Validated</p>
                                </div>
                                <p className="text-[9px] font-mono text-slate-700 uppercase">Nonce: {block.nonce || "000000"}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}
