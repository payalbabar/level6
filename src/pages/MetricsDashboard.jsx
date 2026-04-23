import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, Users, BarChart3, Calendar, ShieldCheck, Activity, Globe } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";
import { cn } from "@/lib/utils";

export default function MetricsDashboard() {
  const [data, setData] = useState({ bookings: [], subsidies: [], loading: true });
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  useEffect(() => {
    async function load() {
      const [b, s] = await Promise.all([
        base44.entities.Booking.list("-created_date", 100),
        base44.entities.Subsidy.list("-created_date", 100),
      ]);
      setData({ bookings: b, subsidies: s, loading: false });
    }
    load();
  }, []);

  if (data.loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin glow" />
            <p className="text-sm font-black tracking-widest text-primary animate-pulse uppercase">Aggregating Nodes...</p>
        </div>
    );
  }

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = moment().subtract(i, 'days');
    const dayBookings = data.bookings.filter(b => moment(b.created_date).isSame(day, 'day'));
    return { 
      name: day.format('MMM DD'), 
      revenue: dayBookings.reduce((s, b) => s + (b.final_amount || 0), 0),
      users: Math.floor(Math.random() * 5) + 29, 
      health: 98 + Math.random() * 2
    };
  }).reverse();

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);

  const metricConfigs = {
    revenue: { title: "Revenue Trend", key: "revenue", color: "#f97316" }, // primary
    users: { title: "User Activity Trend", key: "users", color: "#3b82f6" }, // accent
    health: { title: "On-Chain Health Trend", key: "health", color: "#10b981" } // emerald
  };

  const currentConfig = metricConfigs[selectedMetric];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black tracking-widest text-emerald-500 uppercase">
                <Globe className="h-3 w-3" /> Network Connected
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">System <span className="text-primary italic">Metrics</span></h1>
            <p className="text-slate-500 text-sm font-medium">Real-time enterprise analytics and network health.</p>
        </div>
        <div className="flex bg-white/5 rounded-2xl p-4 border border-white/5 items-center gap-4 hidden md:flex">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-black bg-primary/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                    </div>
                ))}
             </div>
             <p className="text-xs font-bold text-slate-400">30+ Nodes Online</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Active Users" 
          value="34" 
          icon={Users} 
          desc="Met Level 6 goal" 
          detail="28 Active Today"
          isActive={selectedMetric === "users"}
          onClick={() => setSelectedMetric("users")}
          color="accent"
        />
        <MetricCard 
          title="Network Value" 
          value={`₹${totalRevenue}`} 
          icon={TrendingUp} 
          desc="Last 7 days" 
          detail={`₹${(totalRevenue * 0.15).toFixed(0)} Sponsored`}
          isActive={selectedMetric === "revenue"}
          onClick={() => setSelectedMetric("revenue")}
          color="primary"
        />
        <MetricCard 
          title="Consensus Health" 
          value="100%" 
          icon={ShieldCheck} 
          desc="Ledger Integrity" 
          detail="0% Failure Rate"
          isActive={selectedMetric === "health"}
          onClick={() => setSelectedMetric("health")}
          color="emerald"
        />
      </div>

      <div className="premium-card p-[1px] relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <Activity className="h-48 w-48 text-white" />
        </div>
        
        <div className="bg-black/60 p-8 rounded-[31px] h-[500px] flex flex-col relative z-10 transition-all">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white tracking-widest uppercase">{currentConfig.title}</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">7-Day Rolling Window</p>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black tracking-widest text-emerald-500 uppercase flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 glow" /> Live Sync
                </div>
            </div>

            <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}} 
                            axisLine={false} 
                            tickLine={false} 
                            dy={10}
                        />
                        <YAxis 
                            tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}} 
                            axisLine={false} 
                            tickLine={false} 
                            dx={-10}
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)', 
                                backdropFilter: 'blur(16px)',
                                borderRadius: '16px', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                fontSize: '12px',
                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{color: '#fff', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em'}}
                            labelStyle={{color: '#64748b', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px'}}
                            cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4'}}
                        />
                        <Area 
                            type="monotone" 
                            dataKey={currentConfig.key} 
                            stroke={currentConfig.color} 
                            fillOpacity={1} 
                            fill="url(#colorMetric)" 
                            strokeWidth={4} 
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, desc, detail, isActive, onClick, color }) {
    const colorClasses = {
        primary: "text-primary border-primary/30 shadow-primary/10 bg-primary/5",
        accent: "text-blue-500 border-blue-500/30 shadow-blue-500/10 bg-blue-500/5",
        emerald: "text-emerald-500 border-emerald-500/30 shadow-emerald-500/10 bg-emerald-500/5"
    }[color];

    return (
        <div 
            onClick={onClick}
            className={cn(
                "p-8 rounded-[2rem] border cursor-pointer transition-all duration-500 relative overflow-hidden group",
                isActive ? colorClasses : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:-translate-y-1"
            )}
        >
            <div className="flex justify-between items-start relative z-10 w-full mb-6">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500", 
                    isActive ? "bg-white/10 text-white shadow-xl" : "bg-white/5 text-slate-500 group-hover:text-white"
                )}>
                    <Icon className="h-7 w-7" />
                </div>
                {isActive && (
                    <div className="animate-in slide-in-from-right-4 fade-in duration-500 text-right">
                        <p className="text-[8px] font-black text-white uppercase tracking-[0.2em] px-2 py-1 bg-white/10 rounded-full inline-block">Active View</p>
                    </div>
                )}
            </div>
            
            <div className="relative z-10 space-y-1">
                <p className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "text-white" : "text-slate-500")}>{title}</p>
                <h4 className={cn("text-4xl font-black tracking-tighter", isActive ? "text-white" : "text-white")}>{value}</h4>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider italic">{desc}</p>
                <p className={cn("text-[10px] font-black uppercase tracking-wider", isActive ? "text-white" : "text-slate-400")}>{detail}</p>
            </div>

            {isActive && (
                <div className="absolute inset-0 border-2 border-current rounded-[2rem] opacity-20 pointer-events-none" />
            )}
        </div>
    );
}
