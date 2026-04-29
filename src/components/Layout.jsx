import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, ClipboardList,
  Database, Menu, LogOut, User, Activity, Globe,
  ShieldCheck, X, Flame, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

// Premium SVG Logo — flame + chain link
const GasChainMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(200, 100%, 55%)" />
        <stop offset="100%" stopColor="hsl(170, 80%, 45%)" />
      </linearGradient>
      <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(200, 100%, 75%)" />
        <stop offset="100%" stopColor="hsl(200, 100%, 55%)" />
      </linearGradient>
    </defs>
    {/* Outer ring */}
    <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.4" />
    {/* Hexagon */}
    <path
      d="M20 5L32 12V28L20 35L8 28V12L20 5Z"
      fill="url(#logoGrad)"
      opacity="0.12"
      stroke="url(#logoGrad)"
      strokeWidth="1.5"
    />
    {/* Flame */}
    <path
      d="M20 30C20 30 13 24 13 18.5C13 14.5 16 11 20 8C20 8 18 14 20 16C22 18 24 16 24 14C26 17 27 19.5 27 22C27 26.5 24 30 20 30Z"
      fill="url(#logoGrad2)"
    />
    {/* Inner flame highlight */}
    <path
      d="M20 28C20 28 16 24 16 21C16 19 17.5 17.5 19 17C18.5 19 20 20 21 19C22 21 22 22.5 22 23.5C22 26 21 28 20 28Z"
      fill="white"
      opacity="0.3"
    />
  </svg>
);

const navItems = [
  { path: "/dashboard",         label: "Dashboard",    icon: LayoutDashboard, desc: "Overview" },
  { path: "/dashboard/metrics", label: "Network Stats", icon: Activity,        desc: "Analytics" },
  { path: "/book",              label: "Book Cylinder", icon: ShoppingCart,    desc: "New order" },
  { path: "/bookings",          label: "Order History", icon: ClipboardList,   desc: "My orders" },
  { path: "/supply-chain",      label: "Supply Chain",  icon: Globe,           desc: "Tracking" },
  { path: "/subsidies",         label: "Governance",    icon: ShieldCheck,     desc: "Proposals" },
  { path: "/ledger",            label: "Ledger",        icon: Database,        desc: "Explorer" },
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─────────── SIDEBAR ─────────── */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px]",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "border-r border-border/50",
          "bg-card/80 backdrop-blur-xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          background: "linear-gradient(180deg, hsl(220 18% 7% / 0.95) 0%, hsl(220 18% 6% / 0.98) 100%)"
        }}
      >
        {/* ── Logo Area ── */}
        <div className="h-20 flex items-center gap-3.5 px-5 border-b border-border/30 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full scale-150" />
            <GasChainMark size={36} />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-foreground leading-tight">
              GasChain
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-primary/80 mt-0.5">
              Enterprise Network
            </div>
          </div>
          <button
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-3">
            Main Menu
          </p>
          {navItems.slice(0, 2).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={item.path} item={item} isActive={isActive} setSidebarOpen={setSidebarOpen} />
            );
          })}

          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-3 mt-5">
            Operations
          </p>
          {navItems.slice(2, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={item.path} item={item} isActive={isActive} setSidebarOpen={setSidebarOpen} />
            );
          })}

          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-3 mt-5">
            Protocol
          </p>
          {navItems.slice(5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={item.path} item={item} isActive={isActive} setSidebarOpen={setSidebarOpen} />
            );
          })}
        </nav>

        {/* ── Network Status Card ── */}
        <div className="px-3 pb-3">
          <div className="rounded-xl p-3 border border-border/30" style={{
            background: "linear-gradient(135deg, hsl(200 100% 55% / 0.06) 0%, hsl(170 80% 45% / 0.04) 100%)"
          }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Network</span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                <span className="text-[10px] font-semibold text-success">LIVE</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground">Stellar Testnet</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">us-east-1.gaschain.io</p>
          </div>
        </div>

        {/* ── User Footer ── */}
        <div className="p-3 border-t border-border/30">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group">
            <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm"
              style={{ background: "linear-gradient(135deg, hsl(200 100% 55% / 0.15), hsl(260 60% 58% / 0.15))" }}
            >
              {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate leading-tight">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-primary font-medium truncate">Verified Authority</p>
            </div>
            <button
              onClick={() => logout()}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────── MAIN CONTENT ─────────── */}
      <main className="flex-1 min-w-0 min-h-screen relative flex flex-col">

        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-border/50"
          style={{ background: "hsl(220 18% 7% / 0.95)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="h-9 w-9 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/60 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <GasChainMark size={24} />
              <span className="text-sm font-bold tracking-tight">GasChain</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-primary text-sm font-bold"
            style={{ background: "hsl(200 100% 55% / 0.12)" }}
          >
            {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 bg-background relative mesh-bg">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavLink({ item, isActive, setSidebarOpen }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={() => setSidebarOpen(false)}
      className={cn(
        "sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
        isActive
          ? "bg-primary/10 text-primary active"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
      )}
    >
      <div className={cn(
        "h-8 w-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-200",
        isActive
          ? "bg-primary/15 text-primary shadow-glow-sm"
          : "bg-muted/30 text-muted-foreground group-hover:bg-muted/60 group-hover:text-foreground"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm leading-tight font-medium", isActive ? "text-primary" : "")}>{item.label}</div>
        <div className="text-[10px] text-muted-foreground/60 leading-tight mt-0.5">{item.desc}</div>
      </div>
      {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary/50 flex-shrink-0" />}
    </Link>
  );
}
