import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart, Wallet, Database, TrendingUp,
  X, ArrowRight, Shield, CheckCircle2, Loader2,
  Box, Activity, Layers
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
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState(null); 

  useEffect(() => {
    async function load() {
      const [b, bl, s] = await Promise.all([
        base44.entities.Booking.list("-created_date", 10),
        base44.entities.SupplyChainBlock.list("-created_date", 10),
        base44.entities.Subsidy.list("-created_date", 10),
      ]);
      setBookings(b);
      setBlocks(bl);
      setSubsidies(s);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalSubsidy = subsidies
    .filter((s) => s.status === "credited")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const activeBookings = bookings.filter((b) => !["delivered", "cancelled"].includes(b.status));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin glow" />
        <p className="text-sm font-bold tracking-widest text-primary animate-pulse">SYNCHRONIZING LEDGER...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Visual Polish */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase">
            <Activity className="h-3 w-3" /> Network Operational
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">System <span className="text-primary italic">Overview</span></h1>
          <p className="text-slate-500 text-sm font-medium">Real-time monitoring of decentralized LPG logistics cycles.</p>
        </div>
        <div className="flex gap-3">
            <Button onClick={() => navigate('/book')} className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <ShoppingCart className="mr-2 h-4 w-4" /> New Booking
            </Button>
            <Button onClick={() => navigate('/ledger')} variant="outline" className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold h-12 px-6 transition-all">
              <Layers className="mr-2 h-4 w-4" /> Explorer
            </Button>
        </div>
      </div>

      {/* Stats Grid - High Contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingCart}
          label="Total Volume"
          value={bookings.length}
          subtitle="All-time bookings"
          color="primary"
          onClick={() => setActivePanel(activePanel === "bookings" ? null : "bookings")}
        />
        <StatCard
          icon={Database}
          label="Ledger State"
          value={blocks.length}
          subtitle="Height: #02934"
          color="secondary"
          onClick={() => setActivePanel(activePanel === "blocks" ? null : "blocks")}
        />
        <StatCard
          icon={Wallet}
          label="Treasury Disbursements"
          value={`₹${totalSubsidy.toLocaleString()}`}
          subtitle="Verified subsidies"
          color="accent"
          onClick={() => setActivePanel(activePanel === "subsidies" ? null : "subsidies")}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Pipeline"
          value={activeBookings.length}
          subtitle="Live status tracking"
          color="primary"
          onClick={() => setActivePanel(activePanel === "active" ? null : "active")}
        />
      </div>

      {/* Drilldown Panel - Premium Glass Tray */}
      {activePanel && (
        <div className="glass-pane rounded-[2rem] overflow-hidden animate-in fade-in zoom-in-95 duration-500 border border-white/10 relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          {/* Panel Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-2xl", {
                "border-primary/20 bg-primary/10 text-primary": activePanel === "bookings" || activePanel === "active",
                "border-secondary/20 bg-secondary/10 text-secondary": activePanel === "blocks",
                "border-accent/20 bg-accent/10 text-accent": activePanel === "subsidies",
              })}>
                {activePanel === "bookings" && <ShoppingCart className="h-5 w-5" />}
                {activePanel === "blocks" && <Database className="h-5 w-5" />}
                {activePanel === "subsidies" && <Wallet className="h-5 w-5" />}
                {activePanel === "active" && <TrendingUp className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white uppercase">
                  {activePanel === "bookings" && "Booking Inventory"}
                  {activePanel === "blocks" && "Cryptographic Ledger"}
                  {activePanel === "subsidies" && "Subsidy Verification"}
                  {activePanel === "active" && "Pending Logistics"}
                </h3>
                <p className="text-xs text-slate-500 font-bold tracking-widest">
                  DETAILED NODE AUDIT • {moment().format('HH:mm:ss')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 rounded-xl px-4 text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300"
                onClick={() => {
                  if (activePanel === "bookings" || activePanel === "active") navigate("/bookings");
                  else if (activePanel === "blocks") navigate("/ledger");
                  else if (activePanel === "subsidies") navigate("/subsidies");
                }}
              >
                Expand <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5" onClick={() => setActivePanel(null)}>
                <X className="h-5 w-5 text-slate-400" />
              </Button>
            </div>
          </div>

          {/* Panel Content - List items with more white space */}
          <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            {activePanel === "bookings" && (
                bookings.length === 0 ? <EmptyState icon={ShoppingCart} text="No records found in inventory" /> : 
                bookings.map(b => <ListItem key={b.id} icon={Box} title={b.booking_id} status={b.status} meta={`${CYLINDER_LABELS[b.cylinder_type]} • ${b.customer_name}`} amount={b.final_amount || b.total_amount} time={b.created_date} onClick={() => navigate("/bookings")} />)
            )}
            {activePanel === "blocks" && (
                blocks.length === 0 ? <EmptyState icon={Database} text="No blocks emitted on current epoch" /> : 
                blocks.map(block => <ListItem key={block.id} icon={Shield} title={`Block #${block.block_index}`} status={block.event_type} meta={block.block_hash} amount={null} time={block.created_date} variant="secondary" onClick={() => navigate("/ledger")} />)
            )}
            {activePanel === "subsidies" && (
                subsidies.length === 0 ? <EmptyState icon={Wallet} text="No treasury disbursements detected" /> : 
                subsidies.map(s => <ListItem key={s.id} icon={CheckCircle2} title={s.scheme || "Government Subsidy"} status={s.status} meta={`Booking REF: ${s.booking_id || "SYS-LEDGER"}`} amount={s.amount} time={s.created_date} variant="accent" onClick={() => navigate("/subsidies")} />)
            )}
            {activePanel === "active" && (
                activeBookings.length === 0 ? <EmptyState icon={TrendingUp} text="All logistics cycles cleared" /> : 
                activeBookings.map(b => <ListItem key={b.id} icon={Loader2} title={b.booking_id} status={b.status} meta={`${CYLINDER_LABELS[b.cylinder_type]} • ${b.customer_name}`} amount={b.final_amount || b.total_amount} time={b.created_date} active onClick={() => navigate("/bookings")} />)
            )}
          </div>
        </div>
      )}

      {/* Primary Data Grids */}
      <div className="grid lg:grid-cols-2 gap-8 mt-12 pb-12">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <RecentBookings bookings={bookings} />
        </div>
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-[2.5rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <RecentBlocks blocks={blocks} />
        </div>
      </div>
    </div>
  );
}

function ListItem({ icon: Icon, title, status, meta, amount, time, active, variant = "primary", onClick }) {
    return (
        <div 
          onClick={onClick}
          className="flex items-center justify-between gap-4 p-4 rounded-[1.25rem] hover:bg-white/[0.04] transition-all cursor-pointer group/item border border-transparent hover:border-white/5 mb-2"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className={cn("h-12 w-12 rounded-[1rem] flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110", {
                    "bg-primary/5 text-primary border border-primary/10": variant === "primary",
                    "bg-secondary/5 text-secondary border border-secondary/10": variant === "secondary",
                    "bg-accent/5 text-accent border border-accent/10": variant === "accent",
                })}>
                    <Icon className={cn("h-5 w-5", active && "animate-spin")} />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black tracking-tight text-white font-mono">{title}</span>
                        <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter", STATUS_COLORS[status] || "bg-slate-800 text-slate-400")}>
                            {status?.replace("_", " ")}
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] md:max-w-md">
                        {meta}
                    </p>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                {amount !== null && <p className="text-sm font-black text-white">₹{amount.toLocaleString()}</p>}
                <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase">{moment(time).fromNow()}</p>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
      <Icon className="h-16 w-16 text-slate-800 mx-auto mb-6" />
      <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">{text}</p>
    </div>
  );
}
