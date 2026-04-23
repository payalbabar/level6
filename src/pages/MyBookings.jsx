import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { 
  ClipboardList, ChevronRight, Hash, 
  MapPin, Clock, Box, Zap
} from "lucide-react";
import { STATUS_COLORS, CYLINDER_LABELS } from "@/lib/blockchain";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import moment from "moment";
import BookingDetail from "../components/BookingDetail";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await base44.entities.Booking.list("-created_date", 50);
      setBookings(data);
      if (selected) {
        const updated = data.find(b => b.id === selected.id);
        if (updated) setSelected(updated);
      }
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [selected?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin glow" />
        <p className="text-[10px] font-black tracking-widest text-primary uppercase">Synchronizing Ledger...</p>
      </div>
    );
  }

  if (selected) {
    return <BookingDetail booking={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary uppercase">
                Enterprise Identity
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Order <span className="text-primary italic">History</span></h1>
            <p className="text-slate-500 text-sm font-medium">Traceable lifecycle of your energy allocations.</p>
        </div>
        <Link to="/book">
          <Button className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black tracking-widest text-xs uppercase shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
            New Allocation
          </Button>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5 space-y-6">
          <ClipboardList className="h-16 w-16 text-slate-800 mx-auto" />
          <div>
            <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">Archive protocol empty</p>
            <p className="text-xs text-slate-600 mt-1">Initialize your first on-chain supply request.</p>
          </div>
          <Link to="/book" className="inline-block">
            <Button variant="outline" className="h-12 border-white/10 text-white font-black tracking-widest text-xs uppercase rounded-xl">
                Initial Booking
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="premium-card p-6 cursor-pointer group hover:border-primary/30 transition-all relative overflow-hidden"
              onClick={() => setSelected(booking)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                <Box className="h-24 w-24 text-white" />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10 relative">
                <div className="flex items-center gap-6">
                    <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-2xl", 
                        booking.status === 'delivered' ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" : "bg-primary/20 text-primary border border-primary/30"
                    )}>
                        {booking.status === 'delivered' ? <Zap className="h-7 w-7" /> : <Box className="h-7 w-7 animate-pulse" />}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-white font-mono tracking-tighter">{booking.booking_id}</span>
                            <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-[0.2em]", 
                                STATUS_COLORS[booking.status]?.includes('green') ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                            )}>
                                {booking.status?.replace("_", " ")}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500">
                            <p className="text-xs font-bold text-slate-400">
                                {CYLINDER_LABELS[booking.cylinder_type]}
                            </p>
                            <div className="h-1 w-1 rounded-full bg-slate-800" />
                            <p className="text-[10px] font-black uppercase tracking-widest">
                                UNIT POOL: {booking.quantity}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block h-10 w-px bg-white/5 mx-4" />

                <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                            <MapPin className="h-2 w-2" /> Destination Node
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 truncate">{booking.customer_address?.split(',')[0]}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                            <Clock className="h-2 w-2" /> Block Time
                        </p>
                        <p className="text-[11px] font-bold text-slate-400">{moment(booking.created_date).fromNow()}</p>
                    </div>
                    <div className="space-y-1 hidden md:block">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                            <Hash className="h-2 w-2" /> State Root
                        </p>
                        <p className="text-[10px] font-mono text-slate-500 truncate">{booking.block_hash || "PENDING_COMMIT"}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-none border-white/5 pt-4 lg:pt-0">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Settlement</p>
                        <p className="text-xl font-black text-white tracking-tighter">₹{(booking.final_amount || booking.total_amount || 0).toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-all group-hover:translate-x-1">
                        <ChevronRight className="h-5 w-5" />
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
