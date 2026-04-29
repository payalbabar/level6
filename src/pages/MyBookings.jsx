import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import AppHeader from "../components/dashboard/AppHeader";
import { ClipboardList, ChevronRight, MapPin, Clock, Box, Zap, Loader2 } from "lucide-react";
import { CYLINDER_LABELS } from "@/lib/blockchain";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import moment from "moment";
import BookingDetail from "../components/BookingDetail";

const STATUS_STYLE = {
  delivered: "bg-success/10 text-success border-success/20",
  pending:   "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await base44.entities.Booking.list("-created_date", 50);
      setBookings(data);
      if (selected) {
        const upd = data.find(b => b.id === selected.id);
        if (upd) setSelected(upd);
      }
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [selected?.id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading orders…</p>
    </div>
  );

  if (selected) return <BookingDetail booking={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader breadcrumb="Order History" />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Order <span className="gradient-text">History</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Lifecycle of your energy allocations — tracked on-chain.
            </p>
          </div>
          <Link to="/book">
            <Button className="gradient-bg-primary text-white border-0 shadow-glow-sm hover:opacity-90 h-10 font-semibold">
              <Zap className="mr-2 h-4 w-4" /> New Booking
            </Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl border border-border/40"
            style={{ background: "hsl(220 18% 7% / 0.6)" }}
          >
            <div className="h-16 w-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
              <ClipboardList className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground mb-6">Book a cylinder to start tracking your supply chain.</p>
            <Link to="/book">
              <Button variant="outline" className="border-border/60 hover:border-primary/40">
                Create First Booking
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/40 overflow-hidden shadow-card"
            style={{ background: "hsl(220 18% 7% / 0.9)" }}
          >
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-border/30 bg-muted/10">
              {["Order ID","Type","Customer","Amount","Status","Time",""].map(h=>(
                <div key={h} className={cn("text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
                  h===""?"col-span-1":h==="Order ID"?"col-span-3":h==="Customer"?"col-span-2":h==="Type"?"col-span-2":h==="Amount"?"col-span-2":h==="Status"?"col-span-1":"col-span-1"
                )}>{h}</div>
              ))}
            </div>

            <div className="divide-y divide-border/20">
              {bookings.map(b => (
                <div key={b.id}
                  onClick={() => setSelected(b)}
                  className="flex md:grid md:grid-cols-12 items-center px-6 py-4 hover:bg-muted/15 transition-colors cursor-pointer group gap-3 md:gap-0"
                >
                  {/* Icon + ID */}
                  <div className="flex items-center gap-3 col-span-3 min-w-0">
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                      b.status==="delivered"?"bg-success/10 text-success group-hover:bg-success/15":
                      b.status==="pending"  ?"bg-warning/10 text-warning group-hover:bg-warning/15":
                      "bg-primary/10 text-primary group-hover:bg-primary/15"
                    )}>
                      <Box className="h-4 w-4"/>
                    </div>
                    <span className="text-sm font-mono font-semibold text-foreground truncate">{b.booking_id}</span>
                  </div>
                  {/* Type */}
                  <div className="col-span-2 hidden md:block">
                    <span className="text-xs text-muted-foreground">{CYLINDER_LABELS[b.cylinder_type]}</span>
                  </div>
                  {/* Customer */}
                  <div className="col-span-2 hidden md:block">
                    <p className="text-xs text-foreground truncate">{b.customer_name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3"/>{b.customer_address?.split(",")[0]}
                    </p>
                  </div>
                  {/* Amount */}
                  <div className="col-span-2">
                    <p className="text-sm font-bold font-mono text-foreground">₹{(b.final_amount||b.total_amount||0).toLocaleString()}</p>
                  </div>
                  {/* Status */}
                  <div className="col-span-1 hidden md:block">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase border",STATUS_STYLE[b.status]||"bg-muted/10 text-muted-foreground border-border/20")}>
                      {b.status?.replace(/_/g," ")}
                    </span>
                  </div>
                  {/* Time */}
                  <div className="col-span-1 hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3"/>{moment(b.created_date).fromNow()}
                  </div>
                  {/* Arrow */}
                  <div className="col-span-1 flex justify-end">
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"/>
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
