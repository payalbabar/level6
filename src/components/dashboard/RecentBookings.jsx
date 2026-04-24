import { ArrowRight, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { STATUS_COLORS, CYLINDER_LABELS } from "@/lib/blockchain";
import { cn } from "@/lib/utils";
import moment from "moment";

/* ── Status badge helper ─────────────────────── */
function StatusBadge({ status }) {
  const map = {
    pending:   "bg-amber-500/10  text-amber-400  border-amber-500/20",
    confirmed: "bg-blue-500/10   text-blue-400   border-blue-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10    text-red-400    border-red-500/20",
    transit:   "bg-cyan-500/10   text-cyan-400   border-cyan-500/20",
  };
  return (
    <span className={cn(
      "text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border",
      map[status] || "bg-white/5 text-slate-300 border-white/15"
    )}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

export default function RecentBookings({ bookings }) {
  const navigate = useNavigate();

  const isEmpty = !bookings || bookings.length === 0;

  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] overflow-hidden flex flex-col h-[540px]">
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
            <ShoppingCart className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white leading-none">Recent Bookings</h3>
            <p className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">
              {bookings?.length || 0} total records
            </p>
          </div>
        </div>
        <Link
          to="/bookings"
          className="group flex items-center gap-1.5 text-[10px] font-black tracking-widest text-primary hover:text-primary/80 uppercase transition-colors"
        >
          View All
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Content */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center mb-4">
            <ShoppingCart className="h-7 w-7 text-white opacity-20" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No bookings yet</p>
          <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">Book a cylinder to see activity here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
          {bookings.slice(0, 8).map((booking) => (
            <div
              key={booking.id}
              onClick={() => navigate("/bookings")}
              className="group flex items-center gap-3.5 p-4 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.08] transition-all duration-150 cursor-pointer border border-transparent hover:border-white/[0.1]"
            >
              {/* Icon */}
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-200">
                <ShoppingCart className="h-4 w-4 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-xs font-black font-mono text-white truncate uppercase tracking-widest">{booking.booking_id}</p>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">
                  {CYLINDER_LABELS[booking.cylinder_type]}
                  <span className="mx-2 text-slate-700">|</span>
                  <span className="text-primary font-black">₹{(booking.final_amount || booking.total_amount || 0).toLocaleString()}</span>
                </p>
              </div>

              {/* Time + arrow */}
              <div className="flex-shrink-0 text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  {moment(booking.created_date).fromNow()}
                </p>
                <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 ml-auto mt-1.5 transition-all group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
