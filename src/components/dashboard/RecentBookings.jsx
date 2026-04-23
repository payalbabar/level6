import { ArrowRight, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { STATUS_COLORS, CYLINDER_LABELS } from "@/lib/blockchain";
import { cn } from "@/lib/utils";
import moment from "moment";

export default function RecentBookings({ bookings }) {
  const navigate = useNavigate();

  if (!bookings || bookings.length === 0) {
    return (
      <div className="premium-card p-1">
        <div className="bg-black/60 backdrop-blur-3xl p-8 rounded-[31px]">
          <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Recent Bookings</h3>
          <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
            <ShoppingCart className="h-10 w-10 text-slate-700 mx-auto mb-4" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No bookings yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card p-1">
      <div className="bg-black/60 backdrop-blur-3xl p-8 rounded-[31px] h-[550px] flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Recent Bookings</h3>
            <Link to="/bookings" className="text-[10px] font-black tracking-widest text-primary hover:text-primary/80 uppercase flex items-center gap-2">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {bookings.slice(0, 6).map((booking) => (
              <div 
                key={booking.id} 
                onClick={() => navigate('/bookings')}
                className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer border border-transparent hover:border-white/10 group"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ShoppingCart className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <p className="text-xs font-black font-mono text-white truncate">{booking.booking_id}</p>
                    <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border", STATUS_COLORS[booking.status]?.includes('green') ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20" )}>
                      {booking.status?.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {CYLINDER_LABELS[booking.cylinder_type]} • <span className="text-white">₹{booking.final_amount || booking.total_amount}</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex-shrink-0">
                  {moment(booking.created_date).fromNow()}
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 text-primary transition-all translate-x-[-10px] group-hover:translate-x-0 ml-2" />
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
