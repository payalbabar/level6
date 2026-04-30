import { Bell, Activity, ShieldCheck, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function AppHeader({ breadcrumb }) {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="hidden lg:flex sticky top-0 z-30 h-16 items-center justify-between px-8 border-b border-border/50"
      style={{
        background: "hsl(220 18% 7% / 0.85)",
        backdropFilter: "blur(24px) saturate(1.8)",
      }}
    >
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">GasChain</p>
        <span className="text-border text-sm">/</span>
        <p className="text-sm font-semibold text-foreground">{breadcrumb}</p>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Live clock */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 bg-muted/20">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">
            {time.toLocaleTimeString()}
          </span>
        </div>

        <div className="w-px h-5 bg-border/50 mx-1" />

        <button
          className="relative h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <button
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
          title="Activity"
        >
          <Activity className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-border/50 mx-1" />

        {/* User chip */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
          <div className="h-6 w-6 rounded-full flex items-center justify-center text-primary text-xs font-bold flex-shrink-0"
            style={{ background: "hsl(200 100% 55% / 0.15)" }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden xl:block text-right">
            <p className="text-xs font-semibold text-foreground leading-tight">{user?.name || "unknown-node"}</p>
            <p className="text-[10px] text-primary font-medium leading-tight">Validated</p>
          </div>
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>
    </header>
  );
}
