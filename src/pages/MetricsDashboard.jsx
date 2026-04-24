import React, { useState } from 'react';
import AppHeader from '../components/dashboard/AppHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Wifi, Zap, Clock, Activity, Globe, Shield, Terminal, ArrowUpRight, X, Layers, Database } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const latencyData = [45, 60, 40, 75, 50, 90, 30, 55, 65, 80, 50, 70, 45, 60, 85, 40, 95, 60, 50, 75].map((v, i) => ({ time: i, value: v }));
const throughputData = [120, 145, 110, 160, 135, 180, 100, 150, 140, 170, 130, 155, 125, 145, 175, 115, 190, 150, 135, 165].map((v, i) => ({ time: i, value: v }));

const stats = [
  { id: 'uptime', icon: Cpu, label: 'Node Uptime', value: '99.98%', sub: 'Last 30 days', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  { id: 'latency', icon: Clock, label: 'Avg Latency', value: '1.2s', sub: 'Block propagation', color: 'text-primary bg-primary/10 border-primary/20' },
  { id: 'blocks', icon: Zap, label: 'Total Blocks', value: '642', sub: 'Confirmed on-chain', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  { id: 'chains', icon: Wifi, label: 'Active Chains', value: '12', sub: 'Live connections', color: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
];

const nodes = [
  { id: 'node1', label: 'Enterprise Node 01', loc: 'US East-1', status: 'Active', uptime: '99.98%', ip: '102.16.8.1', version: 'v2.4.1' },
  { id: 'node2', label: 'Public Node (India)', loc: 'Mumbai', status: 'Active', uptime: '99.71%', ip: '19.45.2.10', version: 'v2.4.0' },
  { id: 'node3', label: 'Stellar Horizon', loc: 'Testnet', status: 'Syncing', uptime: '97.50%', ip: 'stellar.rpc.node', version: 'v2.5.0' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg bg-[#050a14] border border-white/20 text-[10px] text-white font-bold shadow-xl">
        {payload[0].value} units
      </div>
    );
  }
  return null;
};

export default function MetricsDashboard() {
  const [activeStat, setActiveStat] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

  const statDetails = {
    uptime: (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instance Uptime Timeline</p>
            <span className="text-[9px] font-black text-emerald-400 uppercase">Target: 99.99%</span>
        </div>
        <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className={cn("h-8 rounded-sm", i === 32 ? "bg-amber-500/40" : "bg-emerald-500/40")} />
            ))}
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.1]">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Protocol Logs</p>
            <div className="space-y-1 font-mono text-[9px] text-slate-400">
                <p>[14:22:01] Node Alpha heartbeat received</p>
                <p>[14:22:05] Consensus reach: 24/24 nodes</p>
                <p>[14:22:12] Ledger seq: 642398 finalized</p>
            </div>
        </div>
      </div>
    ),
    latency: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.1] text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Internal RTT</p>
                <p className="text-xl font-black text-white">42ms</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.1] text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Global Avg</p>
                <p className="text-xl font-black text-white">1,204ms</p>
            </div>
        </div>
        <div className="h-24 bg-black/40 rounded-xl border border-white/[0.1] relative flex items-center justify-center">
            <Activity className="h-8 w-8 text-primary opacity-30" />
            <div className="absolute inset-x-0 h-px bg-white/10 top-1/2" />
        </div>
      </div>
    ),
    blocks: (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Database className="h-3.5 w-3.5 text-primary" />
                    <p className="text-[10px] font-black text-white font-mono">#64239{i}</p>
                </div>
                <p className="text-[9px] font-mono text-slate-400 truncate">0xfa82...{i}ed9</p>
                <span className="text-[8px] font-black text-slate-500 uppercase">2.4s ago</span>
            </div>
        ))}
      </div>
    ),
    chains: (
        <div className="grid grid-cols-2 gap-3">
            {['LOGISTICS_P0', 'FINANCE_S1', 'RETAIL_X4', 'AUDIT_Q2'].map(id => (
                <div key={id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-violet-400" />
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{id}</span>
                </div>
            ))}
        </div>
    )
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e]">
      <AppHeader breadcrumb="Network Stats" />
      <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Telemetry Stream
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Network <span className="text-primary italic">Vitality Matrix</span>
            </h1>
            <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">Global cluster monitoring with sub-millisecond precision.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-9 px-4 rounded-xl border-white/[0.1] bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white">
                <Terminal className="mr-2 h-3.5 w-3.5" /> Node Console
             </Button>
             <Button variant="outline" className="h-9 px-4 rounded-xl border-primary/30 bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">
                <Globe className="mr-2 h-3.5 w-3.5" /> Global Map
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setActiveStat(activeStat === s.id ? null : s.id)}
              className={cn(
                  "p-7 rounded-[2rem] border transition-all duration-500 cursor-pointer group relative overflow-hidden",
                  activeStat === s.id 
                    ? "bg-white/[0.08] border-primary shadow-2xl shadow-primary/5" 
                    : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/15"
              )}
            >
              {activeStat === s.id && <div className="absolute top-0 right-0 p-4"><ArrowUpRight className="h-4 w-4 text-primary animate-pulse" /></div>}
              <div className={cn("h-12 w-12 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-500", 
                  activeStat === s.id ? "scale-110 shadow-lg" : "group-hover:scale-105", 
                  s.color
              )}><s.icon className="h-6 w-6" /></div>
              <p className="text-3xl font-black text-white tracking-widest leading-none">{s.value}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mt-3">{s.label}</p>
              <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.sub}</p>
                  <ChevronRight className={cn("h-3 w-3 text-slate-500 transition-all", activeStat === s.id && "rotate-90 text-primary")} />
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
            {activeStat && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="relative rounded-[2.5rem] border border-white/[0.12] bg-[#050a14]/60 backdrop-blur-xl p-8 shadow-2xl">
                        <div className="absolute top-0 right-0 p-6">
                            <Button variant="ghost" size="icon" onClick={() => setActiveStat(null)} className="h-10 w-10 rounded-full hover:bg-white/10 text-slate-400"><X className="h-5 w-5" /></Button>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-10">
                            <div className="lg:w-1/3">
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-4"><Activity className="h-3.5 w-3.5 text-primary" /> Advanced Analytics</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Sourced from the decentralized oracle network for high-integrity telemetry verification.</p>
                            </div>
                            <div className="flex-1">{statDetails[activeStat]}</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-8">
          <ChartPanel title="Global Latency Map" subtitle="Regional block propagation delay (ms)" badge="Live Feed">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={latencyData} barCategoryGap="35%">
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
          <ChartPanel title="Throughput Velocity" subtitle="Events processed per block cycle" badge="Protocol A" variant="primary">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'white', strokeOpacity: 0.1 }} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#tpGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>

        <div className="relative rounded-[2.5rem] border border-white/[0.1] bg-white/[0.015] p-10 overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-400"><Shield className="h-5 w-5" /></div>
                  <div>
                      <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Authorized Node Cluster</h3>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Verified identities in epoch 429</p>
                  </div>
              </div>
              <Button variant="link" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors p-0">View All Cluster Nodes</Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {nodes.map((node) => (
              <div key={node.id} onClick={() => setActiveNode(activeNode === node.id ? null : node.id)} className={cn("p-7 rounded-[2rem] border transition-all duration-500 cursor-pointer relative overflow-hidden", activeNode === node.id ? "bg-white/[0.08] border-primary/40" : "bg-white/[0.01] border-white/[0.1] hover:bg-white/[0.03] hover:border-white/20")}>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-black text-white tracking-tight uppercase">{node.label}</p>
                  <div className={cn("px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border", node.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20')}>{node.status}</div>
                </div>
                <div className="flex items-center justify-between mb-5">
                    <div className="space-y-1">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Network Location</p>
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest flex items-center gap-1.5"><Globe className="h-3 w-3 text-primary/80" /> {node.loc}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Stability</p>
                        <p className="text-xs font-black text-white font-mono">{node.uptime}</p>
                    </div>
                </div>
                <AnimatePresence>
                    {activeNode === node.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-5 border-t border-white/[0.1] mt-2 space-y-3">
                            <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase">IP Address</span><span className="text-[10px] font-mono text-slate-300 font-bold">{node.ip}</span></div>
                            <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase">Protocol Version</span><span className="text-[10px] font-mono text-slate-300 font-bold">{node.version}</span></div>
                            <Button variant="ghost" className="w-full h-9 rounded-xl bg-white/[0.04] text-[10px] font-black uppercase tracking-[.2em] border border-white/[0.1] text-primary hover:bg-primary/10">Open SSH Tunnel</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
                {activeNode !== node.id && <div className="absolute bottom-0 inset-x-0 h-1 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartPanel({ title, subtitle, badge, children, variant = "default" }) {
    return (
        <div className="relative rounded-[2.5rem] border border-white/[0.1] bg-white/[0.01] p-10 overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-400 hover:text-white"><ArrowUpRight className="h-5 w-5" /></Button></div>
            <div className="flex items-center justify-between mb-10">
                <div className="space-y-1.5">
                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>
                </div>
                <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", variant === "primary" ? "bg-primary/10 text-primary border-primary/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30")}>{badge}</div>
            </div>
            <div className="relative">{children}</div>
        </div>
    );
}

function ChevronRight({ className, ...props }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="m9 18 6-6-6-6"/></svg>
    );
}
