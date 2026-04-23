import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Database, MapPin, Clock, Loader2, Terminal, Link2, CheckCircle2 } from "lucide-react";
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
    setUpdating(false);
    setNewStatus("");
    toast({ title: "New state committed to blockchain." });
  }

  const currentIdx = STATUS_FLOW.indexOf(booking.status);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl hover:bg-white/5 text-slate-400 mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Return to Index
      </Button>

      {/* Header */}
      <div className="premium-card p-1">
        <div className="p-8 bg-black/40 backdrop-blur-3xl rounded-[31px]">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                            <Terminal className="h-4 w-4" />
                        </div>
                        <h1 className="text-2xl font-black text-white font-mono tracking-tighter">{booking.booking_id}</h1>
                        <span className={cn("text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ml-2 border", 
                            STATUS_COLORS[booking.status]?.includes('green') ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                            {booking.status?.replace("_", " ")}
                        </span>
                    </div>
                    <div className="space-y-1 mt-4">
                        <p className="text-sm font-bold text-slate-300">{booking.customer_name} <span className="text-slate-600 font-normal">| {booking.customer_phone}</span></p>
                        <p className="text-xs text-slate-500 font-mono">{booking.customer_address}</p>
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Settlement Lock</p>
                    <p className="text-3xl font-black text-white tracking-tighter">₹{(booking.final_amount || 0).toLocaleString()}</p>
                    {booking.subsidy_applied > 0 && (
                        <p className="text-[11px] font-bold text-emerald-500 mt-1 uppercase tracking-widest">+ ₹{booking.subsidy_applied} SPONSORED</p>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-8 flex items-center gap-2">
            {STATUS_FLOW.map((status, i) => (
                <div key={status} className="flex-1 flex flex-col items-center">
                    <div
                        className={cn(
                        "h-1 w-full rounded-full transition-all duration-1000",
                        i <= currentIdx ? "bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-white/5"
                        )}
                    />
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest mt-3 transition-colors",
                        i <= currentIdx ? "text-primary" : "text-slate-600"
                    )}>
                        {status.replace("_", " ")}
                    </span>
                </div>
            ))}
            </div>
        </div>
      </div>

      {/* Update Status */}
      {booking.status !== "delivered" && booking.status !== "cancelled" && (
        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger className="flex-1 bg-black/50 border-white/10 h-12 rounded-xl text-white font-bold"><SelectValue placeholder="Command new state..." /></SelectTrigger>
            <SelectContent className="bg-black border-white/10 text-white">
              {STATUS_FLOW.filter((_, i) => i > currentIdx).map((s) => (
                <SelectItem key={s} value={s} className="font-bold text-xs uppercase tracking-widest">{s.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleStatusUpdate} disabled={!newStatus || updating} className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-black tracking-widest text-[10px] uppercase transition-all">
            {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
            {updating ? "Committing..." : "Broadcast State"}
          </Button>
        </div>
      )}

      {/* Blockchain Trail */}
      <div className="premium-card p-8">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <Link2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Cryptographic Audit Trail</h2>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Immutable execution logs mapped to booking identity.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[10px] text-primary font-black uppercase tracking-widest">Syncing network state...</p>
          </div>
        ) : blocks.length === 0 ? (
          <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
              <Database className="h-10 w-10 text-slate-700 mx-auto mb-4" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No events published to mainnet yet.</p>
          </div>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[39px] top-6 bottom-6 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
            <div className="space-y-6">
              {blocks.map((block, idx) => (
                <div key={block.id} className="relative flex gap-6">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center z-10 flex-shrink-0 border shadow-2xl transition-all",
                    idx === blocks.length - 1 ? "bg-primary text-white border-primary glow scale-110" : "bg-black text-slate-400 border-white/10"
                  )}>
                    <span className="text-xs font-black">{block.block_index}</span>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-4 flex-wrap mb-2">
                      <span className="text-xs font-black text-white uppercase tracking-widest">
                        {EVENT_LABELS[block.event_type] || block.event_type}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-slate-700" />
                      <span className="text-[9px] font-black text-slate-500 flex items-center gap-1.5 uppercase tracking-widest">
                        <Clock className="h-3 w-3" />
                        {moment(block.created_date).format("DD MMM, HH:mm:ss")}
                      </span>
                    </div>
                    {block.location && (
                      <p className="text-[10px] text-primary font-bold flex items-center gap-1.5 mt-2 uppercase tracking-widest">
                        <MapPin className="h-3 w-3" /> {block.location}
                      </p>
                    )}
                    <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                      <p className="text-[9px] font-mono text-slate-400 truncate flex items-center gap-2">
                        <span className="text-slate-600 font-bold uppercase tracking-widest w-12">HASH</span> {block.block_hash}
                      </p>
                      <p className="text-[9px] font-mono text-slate-600 truncate flex items-center gap-2">
                        <span className="text-slate-700 font-bold uppercase tracking-widest w-12">PREV</span> {block.previous_hash}
                      </p>
                      {block.verified_by && (
                        <div className="pt-2 mt-2 border-t border-white/5 flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <p className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">
                            Consensus Reached by {block.verified_by}
                            </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
