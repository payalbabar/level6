import { Database, ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EVENT_LABELS } from "@/lib/blockchain";
import moment from "moment";

export default function RecentBlocks({ blocks }) {
  const navigate = useNavigate();

  if (!blocks || blocks.length === 0) {
    return (
      <div className="premium-card p-1">
        <div className="bg-black/60 backdrop-blur-3xl p-8 rounded-[31px]">
          <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Recent Blockchain Activity</h3>
          <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
            <Database className="h-10 w-10 text-slate-700 mx-auto mb-4" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No blocks yet.</p>
            <p className="text-[10px] font-bold text-slate-600 mt-2">Initialize a booking to start consensus.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card p-1">
      <div className="bg-black/60 backdrop-blur-3xl p-8 rounded-[31px] h-[550px] flex flex-col">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-white">Recent Blockchain Activity</h3>
          <Link to="/ledger" className="text-[10px] font-black tracking-widest text-secondary hover:text-secondary/80 uppercase flex items-center gap-2">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {blocks.slice(0, 6).map((block) => (
            <div 
                key={block.id} 
                onClick={() => navigate('/ledger')}
                className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer border border-transparent hover:border-white/10 group"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 border border-secondary/20 group-hover:scale-110 transition-transform">
                <Database className="h-4 w-4 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-xs font-black text-white uppercase tracking-widest truncate">
                        {EVENT_LABELS[block.event_type] || block.event_type}
                    </p>
                    <ShieldCheck className="h-3 w-3 text-secondary" />
                </div>
                <p className="text-[10px] font-mono text-slate-400 truncate w-full">{block.block_hash}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex-shrink-0">
                {moment(block.created_date).fromNow()}
              </span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 text-secondary transition-all translate-x-[-10px] group-hover:translate-x-0 ml-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
