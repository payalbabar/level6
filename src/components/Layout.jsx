import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, ClipboardList,
  Database, Menu, LogOut, User, Activity, Globe,
  ShieldCheck, Zap, X, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { path: "/dashboard",         label: "Dashboard",    icon: LayoutDashboard },
  { path: "/dashboard/metrics", label: "Network Stats", icon: Activity },
  { path: "/book",              label: "Book Cylinder", icon: ShoppingCart },
  { path: "/bookings",          label: "Order History", icon: ClipboardList },
  { path: "/supply-chain",      label: "Supply Chain",  icon: Globe },
  { path: "/subsidies",         label: "Governance",    icon: ShieldCheck },
  { path: "/ledger",            label: "Explorer",      icon: Database },
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#0a0b1e] text-white">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─────────── SIDEBAR ─────────── */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px]",
          "bg-[#0a0b1e]/98 backdrop-blur-3xl",
          "border-r border-white/[0.14] flex flex-col transition-all duration-500 shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-[70px] flex items-center gap-3 px-6 border-b border-white/[0.08]">
          <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shadow-lg shadow-primary/10">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight text-white">GasChain</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-blue-500 font-bold mt-0.5">LPG Connect</span>
          </div>
          {/* mobile close */}
          <button
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "relative flex items-center gap-4 px-5 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 group overflow-hidden tracking-wide",
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/30 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {/* active left bar */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full nav-active-glow" />
                )}
                <item.icon
                  className={cn(
                    "h-4.5 w-4.5 flex-shrink-0 transition-all duration-300",
                    isActive
                      ? "text-primary scale-110"
                      : "text-slate-500 group-hover:text-slate-200 group-hover:scale-105"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <Zap className="h-3.5 w-3.5 text-primary opacity-100 animate-pulse shadow-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Network Status */}
        <div className="px-4 pb-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network</p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-emerald-500 font-bold uppercase">Live</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Stellar Testnet</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5 font-bold">Node: us-east-1.gaschain.io</p>
            </div>
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-slate-500 font-black uppercase">
                <span>Sync</span><span>88%</span>
              </div>
              <div className="h-1 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full w-[88%] bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_8px_rgba(14,252,249,0.3)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer / User */}
        <div className="p-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 px-1">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-white truncate leading-none">{user?.name || "Verified Node"}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Identity Active</p>
            </div>
            <button
              onClick={() => logout()}
              className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────── MAIN CONTENT ─────────── */}
      <main className="flex-1 min-w-0 min-h-screen page-mesh relative">

        {/* Mobile Header (Only header for mobile now) */}
        <div className="lg:hidden sticky top-0 z-40 bg-[#0a0b1e]/90 backdrop-blur-2xl border-b border-white/[0.12] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-300 hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <Flame className="h-5 w-5 text-primary" />
              <span className="text-sm font-black text-white tracking-tight">GasChain</span>
            </div>
          </div>
          <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Page Content */}
        <div className="animate-slide-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
