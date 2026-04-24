import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/dashboard/AppHeader";
import {
  ShoppingCart, Wallet, Database, TrendingUp,
  X, ArrowRight, Shield, CheckCircle2, Loader2,
  Box, Activity, Layers, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_COLORS, CYLINDER_LABELS } from "@/lib/blockchain";
import { Button } from "@/components/ui/button";
import StatCard from "../components/dashboard/StatCard";
import RecentBlocks from "../components/dashboard/RecentBlocks";
import RecentBookings from "../components/dashboard/RecentBookings";
import moment from "moment";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [subsidies, setSubsidies] = useState([]);
  const [activePanel, setActivePanel] = useState(null); // 'bookings' | 'blocks' | 'subsidies' | 'active'

  useEffect(() => {
    async function fetchData() {
      const b = await base44.entities.Booking.list();
      const bl = await base44.entities.SupplyChainBlock.list();
      const s = await base44.entities.Subsidy.list();
      setBookings(b.sort((x,y) => new Date(y.created_date) - new Date(x.created_date)));
      setBlocks(bl.sort((x,y) => y.block_index - x.block_index));
      setSubsidies(s.sort((x,y) => new Date(y.created_date) - new Date(x.created_date)));
    }
    fetchData();
  }, []);

  const activeBookings = bookings.filter(b => b.status === "pending" || b.status === "confirmed");

  return (
    <div className="min-h-screen bg-[#0a0b1e]">
      <AppHeader breadcrumb="Core Dashboard" />

      <div className="p-8 lg:p-10 space-y-10 max-w-[1600px] mx-auto animate-fade-in">
        
        {/* ── Page Header ─────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] font-black uppercase tracking-widest">
              <Activity className="h-3 w-3" /> System Operational
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">
              Global <span className="text-blue-500 italic">Node</span> Overview
            </h1>
            <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.2em] opacity-90">
              Real-time monitoring of decentralized logistics and financial settlements.
            </p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="h-11 px-6 rounded-2xl border-white/[0.1] bg-white/[0.04] text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white" onClick={() => navigate("/book")}>
                <ShoppingCart className="mr-2.5 h-4 w-4" /> New Booking
             </Button>
             <Button className="h-11 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20" onClick={() => navigate("/dashboard/metrics")}>
                <Layers className="mr-2.5 h-4 w-4" /> Network Pulse
             </Button>
          </div>
        </div>

        {/* ── Stat Cards ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={ShoppingCart}
            label="Booking Volume"
            value={bookings.length.toString()}
            subtitle="Ledger Entries"
            color="primary"
            onClick={() => setActivePanel(activePanel === "bookings" ? null : "bookings")}
          />
          <StatCard
            icon={Database}
            label="Validated Blocks"
            value={(blocks.length + 32).toString()}
            subtitle="Epoch Verification"
            color="secondary"
            onClick={() => setActivePanel(activePanel === "blocks" ? null : "blocks")}
          />
          <StatCard
            icon={Wallet}
            label="Treasury Credit"
            value={`₹${subsidies.reduce((acc, s) => acc + (s.amount || 0), 0).toLocaleString()}`}
            subtitle="Subsidy Settlement"
            color="accent"
            onClick={() => setActivePanel(activePanel === "subsidies" ? null : "subsidies")}
          />
          <StatCard
            icon={TrendingUp}
            label="Active Logistics"
            value={activeBookings.length.toString()}
            subtitle="Supply Flow"
            color="primary"
            onClick={() => setActivePanel(activePanel === "active" ? null : "active")}
          />
        </div>

        {/* ── Active Detail Panel (Drill Down) ───── */}
        {activePanel && (
          <div className="rounded-[2.5rem] border border-white/[0.12] bg-[#050a14]/60 backdrop-blur-3xl overflow-hidden glass-pane animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-white/[0.08]">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                   <Activity className="h-6 w-6" />
                </div>
                <div>
                   <h3 className="text-lg font-black tracking-tight text-white uppercase leading-none">
                    {activePanel === "bookings"  ? "Booking Inventory" : 
                     activePanel === "blocks"    ? "Cryptographic Ledger" :
                     activePanel === "subsidies" ? "Subsidy Verification" : "Pending Logistics"}
                  </h3>
                  <p className="text-[10px] text-slate-300 font-black tracking-[0.25em] uppercase mt-2.5">
                    Detailed Node Audit · {moment().format("HH:mm:ss")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost" size="sm"
                  className="h-10 rounded-xl px-5 text-[10px] uppercase tracking-widest font-black bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.15]"
                  onClick={() => {
                    if (activePanel === "bookings" || activePanel === "active") navigate("/bookings");
                    else if (activePanel === "blocks") navigate("/ledger");
                    else if (activePanel === "subsidies") navigate("/subsidies");
                  }}
                >
                  Expand Registry <ArrowRight className="h-3.5 w-3.5 ml-2.5" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-white/[0.1] text-slate-300 hover:text-white"
                  onClick={() => setActivePanel(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Panel list */}
            <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar space-y-1.5 bg-black/30">
              {activePanel === "bookings" && (
                bookings.length === 0
                  ? <EmptyState icon={ShoppingCart} text="No records found in inventory" />
                  : bookings.map(b => (
                      <ListItem key={b.id} icon={Box} title={b.booking_id} status={b.status}
                        meta={`${CYLINDER_LABELS[b.cylinder_type]} · ${b.customer_name}`}
                        amount={b.final_amount || b.total_amount} time={b.created_date}
                        onClick={() => navigate("/bookings")} />
                    ))
              )}
              {activePanel === "blocks" && (
                blocks.length === 0
                  ? <EmptyState icon={Database} text="No blocks emitted on current epoch" />
                  : blocks.map((block, i) => (
                      <ListItem key={block.id} icon={Shield} title={`Block #${block.block_index}`}
                        status={block.event_type} meta={block.block_hash}
                        amount={null} time={block.created_date} variant="secondary"
                        onClick={() => navigate("/ledger")} />
                    ))
              )}
              {activePanel === "subsidies" && (
                subsidies.length === 0
                  ? <EmptyState icon={Wallet} text="No treasury disbursements detected" />
                  : subsidies.map(s => (
                      <ListItem key={s.id} icon={CheckCircle2} title={s.scheme || "Government Subsidy"}
                        status={s.status} meta={`Booking REF: ${s.booking_id || "SYS-LEDGER"}`}
                        amount={s.amount} time={s.created_date} variant="accent"
                        onClick={() => navigate("/subsidies")} />
                    ))
              )}
              {activePanel === "active" && (
                activeBookings.length === 0
                  ? <EmptyState icon={TrendingUp} text="All logistics cycles cleared" />
                  : activeBookings.map(b => (
                      <ListItem key={b.id} icon={Loader2} title={b.booking_id} status={b.status}
                        meta={`${CYLINDER_LABELS[b.cylinder_type]} · ${b.customer_name}`}
                        amount={b.final_amount || b.total_amount} time={b.created_date} active
                        onClick={() => navigate("/bookings")} />
                    ))
              )}
            </div>
          </div>
        )}

        {/* ── Data Grids ─────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-10 pt-2 pb-16">
          <RecentBookings bookings={bookings} />
          <RecentBlocks blocks={blocks} />
        </div>
      </div>
    </div>
  );
}

/* ── ListItem ─────────────────────────────── */
function ListItem({ icon: Icon, title, status, meta, amount, time, active, variant = "primary", onClick }) {
  const variantMap = {
    primary:   "bg-primary/10   text-primary   border-primary/25",
    secondary: "bg-secondary/10 text-secondary border-secondary/25",
    accent:    "bg-amber-500/10 text-amber-400  border-amber-500/25",
  };
  const statusBadge = {
    pending:   "bg-amber-500/10  text-amber-400  border-amber-500/20",
    confirmed: "bg-blue-500/10   text-blue-400   border-blue-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    credited:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10    text-red-400    border-red-500/20",
  };

  return (
    <div onClick={onClick} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer flex items-center justify-between group">
      <div className="flex items-center gap-5">
        <div className={cn("h-11 w-11 rounded-xl border flex items-center justify-center transition-all group-hover:scale-105 group-hover:rotate-3", variantMap[variant])}>
          <Icon className={cn("h-5 w-5", active && "animate-spin")} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black text-white uppercase tracking-tight">{title}</p>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest truncate max-w-[240px] opacity-80">{meta}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right flex flex-col items-end gap-1.5">
          {amount !== null && (
            <p className="text-sm font-black text-white font-mono tracking-tighter">₹{amount.toLocaleString()}</p>
          )}
          <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", statusBadge[status] || statusBadge.pending)}>
            {status}
          </span>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">
          {moment(time).fromNow()}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 opacity-40">
      <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <Icon className="h-7 w-7 text-white" />
      </div>
      <p className="text-xs font-black text-white uppercase tracking-widest">{text}</p>
    </div>
  );
}
