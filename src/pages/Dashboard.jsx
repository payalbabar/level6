import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/dashboard/AppHeader";
import {
  ShoppingCart, Wallet, Database, TrendingUp,
  X, ArrowRight, Shield, CheckCircle2, Loader2,
  Box, Activity, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CYLINDER_LABELS } from "@/lib/blockchain";
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
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const b  = await base44.entities.Booking.list();
      const bl = await base44.entities.SupplyChainBlock.list();
      const s  = await base44.entities.Subsidy.list();
      setBookings(b.sort((x, y) => new Date(y.created_date) - new Date(x.created_date)));
      setBlocks(bl.sort((x, y) => y.block_index - x.block_index));
      setSubsidies(s.sort((x, y) => new Date(y.created_date) - new Date(x.created_date)));
    }
    fetchData();
  }, []);

  const activeBookings = bookings.filter(b => b.status === "pending" || b.status === "confirmed");
  const totalSubsidies = subsidies.reduce((acc, s) => acc + (s.amount || 0), 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader breadcrumb="Overview" />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-success">All Systems Operational</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Network <span className="gradient-text">Overview</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Real-time monitoring of LPG logistics, blockchain settlements, and treasury operations across the network.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => navigate("/book")}
              className="border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Booking
            </Button>
            <Button
              onClick={() => navigate("/dashboard/metrics")}
              className="gradient-bg-primary text-white border-0 hover:opacity-90 shadow-glow-sm"
            >
              <Activity className="mr-2 h-4 w-4" />
              Network Pulse
            </Button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={ShoppingCart}
            label="Total Bookings"
            value={bookings.length.toString()}
            subtitle="Ledger entries"
            onClick={() => setActivePanel(activePanel === "bookings" ? null : "bookings")}
            className={cn(activePanel === "bookings" && "ring-2 ring-primary/50")}
          />
          <StatCard
            icon={Database}
            label="Validated Blocks"
            value={blocks.length.toString()}
            subtitle="On-chain"
            onClick={() => setActivePanel(activePanel === "blocks" ? null : "blocks")}
            className={cn(activePanel === "blocks" && "ring-2 ring-primary/50")}
          />
          <StatCard
            icon={Wallet}
            label="Treasury Credits"
            value={`₹${totalSubsidies.toLocaleString()}`}
            subtitle="Settled subsidies"
            onClick={() => setActivePanel(activePanel === "subsidies" ? null : "subsidies")}
            className={cn(activePanel === "subsidies" && "ring-2 ring-primary/50")}
          />
          <StatCard
            icon={TrendingUp}
            label="Active Logistics"
            value={activeBookings.length.toString()}
            subtitle="In-flight orders"
            onClick={() => setActivePanel(activePanel === "active" ? null : "active")}
            className={cn(activePanel === "active" && "ring-2 ring-primary/50")}
          />
        </div>

        {/* ── Detail Panel ── */}
        {activePanel && (
          <div className="rounded-2xl border border-border/50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 shadow-elevated"
            style={{ background: "hsl(220 18% 7% / 0.95)" }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Activity className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {activePanel === "bookings"  ? "Booking Inventory" :
                     activePanel === "blocks"    ? "Cryptographic Ledger" :
                     activePanel === "subsidies" ? "Subsidy Disbursements" : "Active Logistics"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live audit · {moment().format("HH:mm:ss")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" size="sm"
                  className="h-8 text-xs border-border/60"
                  onClick={() => {
                    if (activePanel === "bookings" || activePanel === "active") navigate("/bookings");
                    else if (activePanel === "blocks") navigate("/ledger");
                    else if (activePanel === "subsidies") navigate("/subsidies");
                  }}
                >
                  View All <ArrowRight className="h-3 w-3 ml-1.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActivePanel(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Panel content */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-border/30">
              {activePanel === "bookings" && (
                bookings.length === 0
                  ? <EmptyState icon={ShoppingCart} text="No records in inventory" />
                  : bookings.map(b => (
                      <ListItem key={b.id} icon={Box} title={b.booking_id} status={b.status}
                        meta={`${CYLINDER_LABELS[b.cylinder_type] || "Cylinder"} · ${b.customer_name}`}
                        amount={b.final_amount || b.total_amount} time={b.created_date}
                        onClick={() => navigate("/bookings")} />
                    ))
              )}
              {activePanel === "blocks" && (
                blocks.length === 0
                  ? <EmptyState icon={Database} text="No blocks on current epoch" />
                  : blocks.map(block => (
                      <ListItem key={block.id} icon={Shield} title={`Block #${block.block_index}`}
                        status={block.event_type} meta={block.block_hash}
                        amount={null} time={block.created_date}
                        onClick={() => navigate("/ledger")} />
                    ))
              )}
              {activePanel === "subsidies" && (
                subsidies.length === 0
                  ? <EmptyState icon={Wallet} text="No treasury disbursements" />
                  : subsidies.map(s => (
                      <ListItem key={s.id} icon={CheckCircle2} title={s.scheme || "Government Subsidy"}
                        status={s.status} meta={`Ref: ${s.booking_id || "SYS-LEDGER"}`}
                        amount={s.amount} time={s.created_date}
                        onClick={() => navigate("/subsidies")} />
                    ))
              )}
              {activePanel === "active" && (
                activeBookings.length === 0
                  ? <EmptyState icon={TrendingUp} text="All logistics cycles cleared" />
                  : activeBookings.map(b => (
                      <ListItem key={b.id} icon={Loader2} title={b.booking_id} status={b.status}
                        meta={`${CYLINDER_LABELS[b.cylinder_type] || "Cylinder"} · ${b.customer_name}`}
                        amount={b.final_amount || b.total_amount} time={b.created_date} active
                        onClick={() => navigate("/bookings")} />
                    ))
              )}
            </div>
          </div>
        )}

        {/* ── Activity Feed ── */}
        <div className="grid lg:grid-cols-2 gap-6 pb-16">
          <RecentBookings bookings={bookings} />
          <RecentBlocks blocks={blocks} />
        </div>

      </div>
    </div>
  );
}

function ListItem({ icon: Icon, title, status, meta, amount, time, active, onClick }) {
  const badge = {
    pending:   "bg-warning/10 text-warning border-warning/20",
    confirmed: "bg-primary/10 text-primary border-primary/20",
    delivered: "bg-success/10 text-success border-success/20",
    credited:  "bg-success/10 text-success border-success/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <div onClick={onClick}
      className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all flex-shrink-0">
          <Icon className={cn("h-4 w-4", active && "animate-spin")} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold font-mono truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[220px]">{meta}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <div className="text-right hidden sm:block">
          {amount !== null && (
            <p className="text-sm font-semibold font-mono">₹{(amount || 0).toLocaleString()}</p>
          )}
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase border", badge[status] || "bg-muted/20 text-muted-foreground border-border/20")}>
            {status?.replace(/_/g, " ")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground w-16 text-right hidden md:block">{moment(time).fromNow()}</p>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <div className="h-12 w-12 rounded-2xl bg-muted/20 flex items-center justify-center">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
