import React, { useState, useEffect } from 'react';
import AppHeader from '../components/dashboard/AppHeader';
import { Package, Search, ChevronDown, ChevronUp, CheckCircle, Database, Globe, MapPin, Terminal, Zap, Shield, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const statusMap = {
  'confirmed': 'bg-primary/10 text-primary border-primary/25',
  'pending': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  'cancelled': 'bg-red-500/10 text-red-400 border-red-500/25',
};

export default function SupplyChain() {
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [b, bl] = await Promise.all([
          base44.entities.Booking.list(),
          base44.entities.SupplyChainBlock.list(),
        ]);
        setBookings(b.sort((x, y) => new Date(y.created_date) - new Date(x.created_date)));
        setBlocks(bl);
      } catch (err) {
        console.error("Failed to fetch supply chain data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getEventsForBooking = (bookingId) => {
    // Combine booking data and block data to create a timeline
    const booking = bookings.find(b => b.booking_id === bookingId);
    if (!booking) return [];

    const bookingBlocks = blocks.filter(bl => bl.booking_id === bookingId).sort((a,b) => a.block_index - b.block_index);
    
    return bookingBlocks.map((bl, i) => ({
      n: i + 1,
      label: bl.event_type?.replace(/_/g, ' ').toUpperCase() || 'EVENT TRIGGERED',
      time: new Date(bl.created_date).toLocaleString(),
      loc: bl.location || 'Network Node',
      tx: bl.block_hash || 'TX-PENDING'
    }));
  };

  const filtered = bookings.filter(s => 
    s.booking_id.toLowerCase().includes(query.toLowerCase()) ||
    s.customer_name.toLowerCase().includes(query.toLowerCase())
  );

  const startScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e]">
      <AppHeader breadcrumb="Supply Chain" />
      
      <div className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-10">
        
        {/* Protocol Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              <Shield className="h-3 w-3" /> Proof of Delivery Protocol
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
              Supply Chain <span className="text-primary italic">Live</span>
            </h1>
            <p className="text-slate-300 font-bold uppercase tracking-widest text-[11px] max-w-xl leading-relaxed">
              Global tracking of every logistics event on the Stellar network. Real-time cryptographic verification of physical asset movement.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group/search">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within/search:text-primary transition-colors" />
               <input
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 placeholder="Trace Booking ID or Hash..."
                 className="pl-12 pr-6 h-12 rounded-xl bg-white/[0.03] border border-white/[0.1] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all w-72 lg:w-96 shadow-inner"
               />
            </div>
            <Button variant="outline" className="h-12 w-12 rounded-xl border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08]" onClick={startScan}>
                {scanning ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Zap className="h-5 w-5 text-slate-400" />}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Main Shipments Feed */}
          <div className="lg:col-span-8 space-y-4">
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/[0.015] border border-white/[0.08] rounded-[2.5rem] opacity-40 italic">
                    <Package className="h-10 w-10 mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest">No active shipments found in current epoch</p>
                </div>
            ) : (
                filtered.map((shipment, i) => (
                    <motion.div
                      key={shipment.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                          "rounded-[2rem] border transition-all duration-500 overflow-hidden group",
                          expanded === shipment.booking_id 
                            ? "bg-white/[0.06] border-primary shadow-2xl shadow-primary/5" 
                            : "bg-white/[0.015] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]"
                      )}
                    >
                      <button
                        onClick={() => setExpanded(expanded === shipment.booking_id ? null : shipment.booking_id)}
                        className="w-full flex items-center gap-6 p-6 text-left relative"
                      >
                        <div className={cn(
                            "h-12 w-12 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-all duration-500",
                            expanded === shipment.booking_id ? "bg-primary text-black border-primary" : "bg-primary/10 border-primary/25 text-primary group-hover:scale-105"
                        )}>
                          <Package className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                              <p className="text-base font-black text-white uppercase tracking-tight">{shipment.booking_id}</p>
                              <div className="h-1 w-1 rounded-full bg-slate-700" />
                              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">{shipment.customer_name}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={cn("px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm", statusMap[shipment.status] || statusMap.pending)}>
                                {shipment.status === 'confirmed' ? 'IN FLIGHT' : shipment.status.toUpperCase()}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Database className="h-3 w-3 text-slate-500" />
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", expanded === shipment.booking_id ? "text-primary" : "text-slate-500")}>
                                    +{blocks.filter(b => b.booking_id === shipment.booking_id).length} confirmed block(s)
                                </span>
                            </div>
                          </div>
                        </div>
                        {expanded === shipment.booking_id ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5 text-slate-600 group-hover:text-slate-400" />}
                        
                        {scanning && (
                           <div className="absolute inset-0 bg-primary/5 animate-shimmer pointer-events-none" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expanded === shipment.booking_id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-white/[0.08]"
                          >
                            <div className="p-8 space-y-8 bg-black/40">
                              {getEventsForBooking(shipment.booking_id).map((ev) => (
                                <div key={ev.n} className="flex gap-6 items-start group/ev">
                                  <div className="relative flex flex-col items-center">
                                      <div className="h-10 w-10 rounded-2xl bg-primary border-2 border-[#020408] flex items-center justify-center text-[#020408] text-xs font-black flex-shrink-0 z-10 shadow-lg shadow-primary/20 group-hover/ev:scale-110 transition-transform">
                                        {ev.n}
                                      </div>
                                      {/* Vertical Line Connector */}
                                      <div className="h-16 w-px bg-primary/20 absolute top-10" />
                                  </div>
                                  <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-center gap-4 mb-1.5 flex-wrap">
                                      <p className="text-base font-black text-white uppercase tracking-tight">{ev.label}</p>
                                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                         <Terminal className="h-3 w-3" /> {ev.time}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                       <MapPin className="h-3 w-3 text-primary/60" />
                                       <p className="text-[11px] text-primary uppercase font-black tracking-widest">{ev.loc}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-between group/tx hover:border-white/[0.12] transition-colors">
                                        <p className="text-[9px] font-mono text-slate-500 truncate select-all group-hover/tx:text-slate-300 transition-colors uppercase tracking-widest">COMMIT_HASH: {ev.tx}</p>
                                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {getEventsForBooking(shipment.booking_id).length === 0 && (
                                  <div className="flex flex-col items-center justify-center py-6 opacity-30 italic">
                                      <Terminal className="h-6 w-6 mb-2" />
                                      <p className="text-[10px] font-black uppercase tracking-widest">No block events indexed for this register</p>
                                  </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                ))
            )}
          </div>

          {/* Right Sidebar: Contextual Stats */}
          <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.08] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-10 pb-6 border-b border-white/[0.08] flex items-center gap-3">
                      <Terminal className="h-4 w-4 text-primary" /> Network Authority
                  </h3>
                  
                  <div className="space-y-8">
                       <MetricRow label="Active Hubs" value="24" icon={Globe} />
                       <MetricRow label="In-Flight" value={bookings.filter(b => b.status === 'confirmed').length.toString()} icon={Zap} color="primary" />
                       <MetricRow label="Completed" value={bookings.filter(b => b.status === 'delivered').length.toString()} icon={CheckCircle} color="emerald" />
                  </div>

                  <div className="mt-12 p-6 rounded-[2rem] bg-primary/5 border border-primary/15 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest">
                                <Terminal className="h-3.5 w-3.5" /> Indexer_Status
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[8px] font-black text-primary uppercase tracking-widest">Syncing</span>
                            </div>
                        </div>
                        <Button className="w-full h-10 rounded-xl bg-primary/10 border border-primary/30 text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-black shadow-lg shadow-primary/5">
                            Spin Up Node
                        </Button>
                  </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/[0.015] border border-white/[0.08] space-y-5">
                  <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Compliance Protocol</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      All logistic logs are immutable and cryptographically signed by authorized distribution nodes. Audit logs available for Tier-G authorities.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                       {['ISO-9001', 'BLOCK_V2', 'LPG_SEC'].map(tag => (
                           <span key={tag} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[8px] font-black text-slate-500 tracking-widest">
                               {tag}
                           </span>
                       ))}
                  </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, icon: Icon, color = "white" }) {
    return (
        <div className="flex items-center justify-between group/row">
            <div className="flex items-center gap-4">
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center border transition-all group-hover/row:scale-110", 
                    color === 'primary' ? 'bg-primary/10 border-primary/30 text-primary' : 
                    color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    'bg-white/[0.03] border-white/[0.1] text-slate-400'
                )}>
                    <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/row:text-slate-200 transition-colors">{label}</span>
            </div>
            <span className={cn("text-xl font-black italic tracking-tighter", 
                 color === 'primary' ? 'text-primary' : 
                 color === 'emerald' ? 'text-emerald-400' : 'text-white'
            )}>{value}</span>
        </div>
    );
}
