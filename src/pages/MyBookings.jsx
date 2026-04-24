import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import AppHeader from "../components/dashboard/AppHeader";
import { 
  ClipboardList, ChevronRight, Hash, 
  MapPin, Clock, Box, Zap, ArrowRight, Activity
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 w-14 h-14 rounded-full bg-primary/5 animate-ping" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">Synchronizing Ledger</p>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Fetching order history...</p>
        </div>
      </div>
    );
  }

  if (selected) {
    return <BookingDetail booking={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e]">
      <AppHeader breadcrumb="Order History" />
      <div className="p-8 space-y-8 pb-16 max-w-6xl mx-auto">
        {/* Sub-Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary uppercase">
                  <Activity className="h-3 w-3" />
                  Enterprise Identity Verified
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">Order <span className="text-primary italic">Intelligence</span></h1>
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">Traceable lifecycle of your energy allocations recorded on-chain.</p>
          </div>
          <Link to="/book">
            <Button className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-[#020408] font-black tracking-widest text-xs uppercase shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all">
              <Zap className="mr-2 h-4 w-4" /> New Booking
            </Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-32 bg-white/[0.015] rounded-[2.5rem] border border-dashed border-white/10 space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
              <ClipboardList className="h-10 w-10 text-slate-700" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-black tracking-widest text-slate-400 uppercase">Archive Protocol Empty</p>
              <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">Initialize your first on-chain supply request to begin tracking.</p>
            </div>
            <Link to="/book">
              <Button variant="outline" className="h-11 border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-white font-black tracking-widest text-xs uppercase rounded-xl transition-all">
                  Initial Booking
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.045] hover:border-primary/20 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelected(booking)}
              >
                {/* Top accent line */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* ID and Status */}
                  <div className="flex items-center gap-5">
                      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110", 
                          booking.status === 'delivered' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-primary/10 text-primary border border-primary/20"
                      )}>
                          {booking.status === 'delivered' ? <Zap className="h-6 w-6" /> : <Box className="h-6 w-6" />}
                      </div>
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                              <span className="text-lg font-black text-white font-mono tracking-tighter">{booking.booking_id}</span>
                              <span className={cn("text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border", 
                                  booking.status === 'delivered' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                                  booking.status === 'pending'   ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                  "bg-primary/10 text-primary border-primary/20"
                              )}>
                                  {booking.status?.replace("_", " ")}
                              </span>
                          </div>
                          <div className="flex items-center gap-3">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                  {CYLINDER_LABELS[booking.cylinder_type]}
                              </p>
                              <span className="text-slate-800 font-bold">·</span>
                              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                  {booking.quantity} UNIT{booking.quantity > 1 ? 'S' : ''}
                              </p>
                          </div>
                      </div>
                  </div>

                  <div className="hidden xl:block h-10 w-px bg-white/[0.06]" />

                  {/* Metadata Grid */}
                  <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-3 gap-6 lg:ml-4">
                      <div className="space-y-1.5">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
                              <MapPin className="h-2.5 w-2.5 text-primary" /> Destination Node
                          </p>
                          <p className="text-xs font-bold text-slate-200 truncate max-w-[140px] uppercase">{booking.customer_address?.split(',')[0]}</p>
                      </div>
                      <div className="space-y-1.5">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
                              <Clock className="h-2.5 w-2.5 text-primary" /> Event Protocol
                          </p>
                          <p className="text-xs font-bold text-slate-400 uppercase">{moment(booking.created_date).fromNow()}</p>
                      </div>
                      <div className="space-y-1.5 hidden md:block">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
                              <Hash className="h-2.5 w-2.5 text-primary" /> Immutable Hash
                          </p>
                          <p className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">{booking.block_hash || "PENDING_COMMIT"}</p>
                      </div>
                  </div>

                  {/* Amount and Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-5 pt-5 lg:pt-0 border-t lg:border-none border-white/[0.06]">
                      <div className="text-right">
                          <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-0.5">Asset Value</p>
                          <p className="text-xl font-black text-white tracking-widest font-mono">₹{(booking.final_amount || booking.total_amount || 0).toLocaleString()}</p>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all group-hover:translate-x-1 duration-300">
                          <ChevronRight className="h-5 w-5" />
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
