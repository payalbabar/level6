import React, { useState, useEffect } from 'react';
import AppHeader from '../components/dashboard/AppHeader';
import { Package, Search, ChevronDown, ChevronUp, CheckCircle, Database, Globe, MapPin, Terminal, Zap, Shield, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STATUS_STYLE = {
  confirmed: "bg-primary/10 text-primary border-primary/20",
  pending:   "bg-warning/10 text-warning border-warning/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function SupplyChain() {
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery]       = useState('');
  const [bookings, setBookings] = useState([]);
  const [blocks, setBlocks]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [b, bl] = await Promise.all([
          base44.entities.Booking.list(),
          base44.entities.SupplyChainBlock.list(),
        ]);
        setBookings(b.sort((x,y) => new Date(y.created_date)-new Date(x.created_date)));
        setBlocks(bl);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const eventsFor = (bookingId) => {
    return blocks
      .filter(bl => bl.booking_id === bookingId)
      .sort((a,b) => a.block_index - b.block_index)
      .map((bl,i) => ({
        n: bl.block_index,
        label: bl.event_type?.replace(/_/g,' ').toUpperCase() || 'EVENT',
        time: new Date(bl.created_date).toLocaleString(),
        loc: bl.location || 'Network Node',
        hash: bl.block_hash || 'TX-PENDING',
      }));
  };

  const filtered = bookings.filter(s =>
    s.booking_id.toLowerCase().includes(query.toLowerCase()) ||
    s.customer_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader breadcrumb="Supply Chain" />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-16">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Supply Chain <span className="gradient-text">Explorer</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time cryptographic verification of physical asset movement.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search ID or name…"
                className="pl-9 pr-4 h-10 rounded-xl bg-muted/20 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 w-64 lg:w-80 transition-all"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 border-border/50 rounded-xl"
              onClick={() => { setScanning(true); setTimeout(()=>setScanning(false),1800); }}
            >
              {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* Shipments */}
          <div className="lg:col-span-8 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border/40"
                style={{ background: "hsl(220 18% 7% / 0.6)" }}
              >
                <Package className="h-8 w-8 mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No active shipments found</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/40 overflow-hidden shadow-card"
                style={{ background: "hsl(220 18% 7% / 0.9)" }}
              >
                {filtered.map((s, i) => {
                  const open = expanded === s.booking_id;
                  const evs  = eventsFor(s.booking_id);
                  return (
                    <div key={s.id} className="border-b border-border/20 last:border-0">
                      {/* Row */}
                      <div
                        onClick={() => setExpanded(open ? null : s.booking_id)}
                        className="flex items-center justify-between px-6 py-4 hover:bg-muted/15 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                            open ? "bg-primary text-white" : "bg-muted/20 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          )}>
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold font-mono text-foreground">{s.booking_id}</p>
                              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase border", STATUS_STYLE[s.status] || STATUS_STYLE.pending)}>
                                {s.status === "confirmed" ? "In Flight" : s.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{s.customer_name}</span>
                              <span className="flex items-center gap-1">
                                <Database className="h-3 w-3" />
                                {evs.length} block{evs.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        {open
                          ? <ChevronUp className="h-4 w-4 text-primary" />
                          : <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        }
                      </div>

                      {/* Expanded timeline */}
                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden border-t border-border/20"
                            style={{ background: "hsl(220 18% 6%)" }}
                          >
                            <div className="px-6 py-6 pl-20 space-y-5">
                              {evs.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No blockchain events recorded yet.</p>
                              ) : evs.map((ev, idx) => (
                                <div key={ev.n} className="relative">
                                  {idx < evs.length - 1 && (
                                    <div className="absolute left-[-28px] top-5 bottom-[-20px] w-px bg-border/30" />
                                  )}
                                  <div className="absolute left-[-34px] top-1 h-5 w-5 rounded-full border-2 border-primary/40 bg-background flex items-center justify-center z-10">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-sm font-semibold text-foreground">{ev.label}</p>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Terminal className="h-3 w-3" />{ev.time}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                      <MapPin className="h-3 w-3" />{ev.loc}
                                    </p>
                                    <div className="p-2.5 rounded-lg border border-border/30 bg-muted/10 flex items-center justify-between gap-2">
                                      <p className="text-[10px] font-mono text-muted-foreground truncate">HASH: {ev.hash}</p>
                                      <CheckCircle className="h-3.5 w-3.5 text-success flex-shrink-0" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl border border-border/40 p-5"
              style={{ background: "hsl(220 18% 7% / 0.9)" }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-t-2xl" />
              <h3 className="text-sm font-semibold mb-4 pb-3 border-b border-border/30">Network Authority</h3>
              <div className="space-y-3">
                {[
                  { icon: Globe, label: "Active Hubs",  val: "—" },
                  { icon: Zap,   label: "In-Flight",    val: bookings.filter(b=>b.status==="confirmed").length },
                  { icon: CheckCircle, label: "Completed", val: bookings.filter(b=>b.status==="delivered").length },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/10 border border-border/20">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <r.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{r.label}</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/40 p-5"
              style={{ background: "hsl(220 18% 7% / 0.9)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold">Compliance</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                All logistic records are immutable and cryptographically signed on Stellar Soroban.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-primary/8 border border-primary/15 text-primary">
                  NETWORK_ACTIVE
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
