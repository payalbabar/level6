import { Database, ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EVENT_LABELS } from "@/lib/blockchain";
import { cn } from "@/lib/utils";
import moment from "moment";

/* ── Event type colour map ─────────────────────── */
const eventColors = {
  booking_created:   "bg-blue-500/10   text-blue-400   border-blue-500/20",
  payment_confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  delivery_updated:  "bg-cyan-500/10   text-cyan-400   border-cyan-500/20",
  subsidy_credited:  "bg-amber-500/10  text-amber-400  border-amber-500/20",
};

function EventBadge({ type }) {
  return (
    <span className={cn(
      "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border",
      eventColors[type] || "bg-secondary/10 text-secondary border-secondary/30"
    )}>
      {EVENT_LABELS[type] || type?.replace(/_/g, " ") || "event"}
    </span>
  );
}

export default function RecentBlocks({ blocks }) {
  const navigate = useNavigate();
  const isEmpty = !blocks || blocks.length === 0;

  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] overflow-hidden flex flex-col h-[540px]">
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center">
            <Database className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white leading-none">Blockchain Activity</h3>
            <p className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">
              {blocks?.length || 0} blocks indexed
            </p>
          </div>
        </div>
        <Link
          to="/ledger"
          className="group flex items-center gap-1.5 text-[10px] font-black tracking-widest text-secondary hover:text-secondary/80 uppercase transition-colors"
        >
          View All
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Content */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center mb-4">
            <Database className="h-7 w-7 text-white opacity-20" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No blocks yet</p>
          <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Initialize a booking to start consensus.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
          {blocks.slice(0, 8).map((block) => (
            <div
              key={block.id}
              onClick={() => navigate("/ledger")}
              className="group flex items-center gap-3.5 p-4 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.08] transition-all duration-150 cursor-pointer border border-transparent hover:border-white/[0.1]"
            >
              {/* Icon */}
              <div className="h-10 w-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-200">
                <Database className="h-4 w-4 text-secondary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-xs font-black text-white font-mono truncate tracking-tight">
                    Block #{block.block_index}
                  </p>
                  <ShieldCheck className="h-3 w-3 text-secondary flex-shrink-0" />
                  <EventBadge type={block.event_type} />
                </div>
                <p className="text-[10px] font-mono text-slate-500 truncate lowercase">{block.block_hash}</p>
              </div>

              {/* Time + arrow */}
              <div className="flex-shrink-0 text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {moment(block.created_date).fromNow()}
                </p>
                <ArrowRight className="h-3.5 w-3.5 text-secondary opacity-0 group-hover:opacity-100 ml-auto mt-1.5 transition-all group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
