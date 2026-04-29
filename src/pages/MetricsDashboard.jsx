import React, { useState } from 'react';
import AppHeader from '../components/dashboard/AppHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, Wifi, Zap, Clock, Activity, Globe, Shield, Terminal, ArrowUpRight, X, Layers, Database, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const latencyData = [45, 60, 40, 75, 50, 90, 30, 55, 65, 80, 50, 70, 45, 60, 85, 40, 95, 60, 50, 75].map((v, i) => ({ time: i, value: v }));
const throughputData = [120, 145, 110, 160, 135, 180, 100, 150, 140, 170, 130, 155, 125, 145, 175, 115, 190, 150, 135, 165].map((v, i) => ({ time: i, value: v }));

const stats = [
  { id: 'uptime', icon: Cpu, label: 'Node Uptime', value: '99.98%', sub: 'Last 30 days', color: 'text-success bg-success/10' },
  { id: 'latency', icon: Clock, label: 'Avg Latency', value: '1.2s', sub: 'Block propagation', color: 'text-primary bg-primary/10' },
  { id: 'blocks', icon: Zap, label: 'Total Blocks', value: '642', sub: 'Confirmed on-chain', color: 'text-warning bg-warning/10' },
  { id: 'chains', icon: Wifi, label: 'Active Chains', value: '12', sub: 'Live connections', color: 'text-purple-500 bg-purple-500/10' },
];

const nodes = [
  { id: 'node1', label: 'Enterprise Node 01', loc: 'US East-1', status: 'Active', uptime: '99.98%', ip: '102.16.8.1', version: 'v2.4.1' },
  { id: 'node2', label: 'Public Node (India)', loc: 'Mumbai', status: 'Active', uptime: '99.71%', ip: '19.45.2.10', version: 'v2.4.0' },
  { id: 'node3', label: 'Stellar Horizon', loc: 'Testnet', status: 'Syncing', uptime: '97.50%', ip: 'stellar.rpc.node', version: 'v2.5.0' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-md bg-popover border border-border text-xs text-popover-foreground shadow-sm">
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
        <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Instance Uptime Timeline</p>
            <span className="text-xs font-medium text-success">Target: 99.99%</span>
        </div>
        <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className={cn("h-6 rounded-sm", i === 32 ? "bg-warning" : "bg-success")} />
            ))}
        </div>
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Protocol Logs</p>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
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
            <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">Internal RTT</p>
                <p className="text-xl font-semibold text-foreground">42ms</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">Global Avg</p>
                <p className="text-xl font-semibold text-foreground">1,204ms</p>
            </div>
        </div>
      </div>
    ),
    blocks: (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
            <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground font-mono">#64239{i}</p>
                </div>
                <p className="text-xs font-mono text-muted-foreground">0xfa82...{i}ed9</p>
            </div>
        ))}
      </div>
    ),
    chains: (
        <div className="grid grid-cols-2 gap-3">
            {['LOGISTICS_P0', 'FINANCE_S1', 'RETAIL_X4', 'AUDIT_Q2'].map(id => (
                <div key={id} className="p-3 rounded-lg bg-muted/50 border border-border flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{id}</span>
                </div>
            ))}
        </div>
    )
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader breadcrumb="Network Stats" />
      <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight">Network Vitality</h1>
            <p className="text-sm text-muted-foreground">Global cluster monitoring with sub-millisecond precision.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="gap-2 text-sm">
                <Terminal className="h-4 w-4" /> Console
             </Button>
             <Button className="gap-2 text-sm">
                <Globe className="h-4 w-4" /> Global Map
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveStat(activeStat === s.id ? null : s.id)}
              className={cn(
                  "p-6 rounded-xl border transition-colors cursor-pointer group",
                  activeStat === s.id 
                    ? "bg-muted border-primary" 
                    : "bg-card border-border hover:border-primary/50"
              )}
            >
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mb-4", s.color)}>
                  <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-semibold text-foreground tracking-tight">{s.value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{s.label}</p>
              <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                  <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", activeStat === s.id && "rotate-90 text-primary")} />
              </div>
            </div>
          ))}
        </div>

        {activeStat && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-in slide-in-from-top-2">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> Details
                        </h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setActiveStat(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="max-w-3xl">{statDetails[activeStat]}</div>
            </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <ChartPanel title="Global Latency Map" subtitle="Regional block propagation delay (ms)" badge="Live">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={latencyData} barCategoryGap="20%">
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
          <ChartPanel title="Throughput Velocity" subtitle="Events processed per block cycle" badge="Protocol A">
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
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#tpGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Shield className="h-4 w-4" /></div>
                  <div>
                      <h3 className="text-base font-semibold text-foreground">Authorized Node Cluster</h3>
                      <p className="text-sm text-muted-foreground">Epoch 429</p>
                  </div>
              </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <div key={node.id} onClick={() => setActiveNode(activeNode === node.id ? null : node.id)} className={cn("p-4 rounded-lg border transition-colors cursor-pointer", activeNode === node.id ? "bg-muted border-border" : "bg-card border-border hover:border-primary/50")}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">{node.label}</p>
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium uppercase", node.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>{node.status}</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Globe className="h-3 w-3" /> {node.loc}</p>
                    <p className="text-xs font-mono text-muted-foreground">{node.uptime}</p>
                </div>
                {activeNode === node.id && (
                    <div className="pt-4 mt-4 border-t border-border space-y-2">
                        <div className="flex justify-between items-center"><span className="text-xs text-muted-foreground">IP Address</span><span className="text-xs font-mono text-foreground">{node.ip}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-muted-foreground">Version</span><span className="text-xs font-mono text-foreground">{node.version}</span></div>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartPanel({ title, subtitle, badge, children }) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
                <div className="px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">{badge}</div>
            </div>
            <div className="relative">{children}</div>
        </div>
    );
}
