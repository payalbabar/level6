import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Link2, Wallet, ClipboardList,
  Database, Menu, ChevronRight, LogOut, User, Activity, Globe,
  ShieldCheck, Zap, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/metrics", label: "Network Stats", icon: Activity },
  { path: "/book", label: "Book Cylinder", icon: ShoppingCart },
  { path: "/bookings", label: "Order History", icon: ClipboardList },
  { path: "/supply-chain", label: "Supply Chain", icon: Globe },
  { path: "/subsidies", label: "Governance", icon: ShieldCheck },
  { path: "/ledger", label: "Explorer", icon: Database },
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#020408] text-slate-200">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col transition-all duration-500",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-8 flex items-center gap-4">
          <img src="/logo.png" alt="GasChain Logo" className="h-10 w-10 object-contain rounded-xl shadow-2xl shadow-primary/20" />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white leading-none">GasChain</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-black mt-1">CORE NODE</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all group relative overflow-hidden",
                  isActive
                    ? "text-white bg-primary/10 border border-primary/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary glow" />
                )}
                <item.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary" : "text-slate-600 group-hover:text-slate-400")} />
                <span className="flex-1 tracking-tight">{item.label}</span>
                {isActive && <Zap className="h-3 w-3 text-primary animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-8">
            <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Network</p>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse glow" />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-300">Stellar Testnet</p>
                    <p className="text-[10px] font-medium text-slate-500">Node: us-east-1.gaschain.io</p>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[88%] animate-pulse" />
                </div>
            </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-accent p-px">
                <div className="h-full w-full bg-[#0a0c10] rounded-[15px] flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                 <p className="text-sm font-black text-white truncate">{user?.name || "Verified Node"}</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Identity Active</p>
              </div>
              <button 
                onClick={() => logout()}
                className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/[0.03] hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
              >
                <LogOut className="h-4 w-4" />
              </button>
           </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 min-h-screen hero-mesh relative">
        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-[#020408]/60 backdrop-blur-2xl border-b border-white/5 px-10 py-6 items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-primary" />
             <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
               System Node / <span className="text-white">{navItems.find(i => i.path === location.pathname || (location.pathname.startsWith(i.path) && i.path !== '/dashboard'))?.label || "Overview"}</span>
             </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white">
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white">
                    <Activity className="h-5 w-5" />
                </Button>
             </div>
             <div className="h-8 w-px bg-white/5 mx-2" />
             <div className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-right leading-none">
                   <p className="text-xs font-black text-white">{user?.name || "Principal Alpha"}</p>
                   <p className="text-[10px] text-primary font-bold mt-1 tracking-widest uppercase">Admin Authority</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <ShieldCheck className="h-5 w-5 text-white" />
                </div>
             </div>
          </div>
        </header>

        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-white/[0.05] border border-white/5">
              <Menu className="h-6 w-6 text-white" />
            </button>
            <img src="/logo.png" alt="GasChain Logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
             <User className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="p-6 md:p-10 lg:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
