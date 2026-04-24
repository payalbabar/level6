import { cn } from "@/lib/utils";
import { ChevronRight, ArrowUpRight } from "lucide-react";

const colorConfig = {
  primary: {
    icon:    "text-primary bg-primary/10 border-primary/20 shadow-primary/10",
    glow:    "shadow-primary/20",
    badge:   "text-primary bg-primary/15 border-primary/25",
    gradient: "from-primary/10 via-transparent to-transparent"
  },
  secondary: {
    icon:    "text-secondary bg-secondary/10 border-secondary/20 shadow-secondary/10",
    glow:    "shadow-secondary/20",
    badge:   "text-secondary bg-secondary/15 border-secondary/25",
    gradient: "from-secondary/10 via-transparent to-transparent"
  },
  accent: {
    icon:    "text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-amber-400/10",
    glow:    "shadow-amber-500/20",
    badge:   "text-amber-400 bg-amber-400/15 border-amber-400/25",
    gradient: "from-amber-500/10 via-transparent to-transparent"
  },
  destructive: {
    icon:    "text-red-400 bg-red-400/10 border-red-400/20 shadow-red-400/10",
    glow:    "shadow-red-500/20",
    badge:   "text-red-400 bg-red-400/15 border-red-400/25",
    gradient: "from-red-500/10 via-transparent to-transparent"
  },
};

export default function StatCard({ icon: Icon, label, value, subtitle = "", color = "primary", onClick }) {
  const c = colorConfig[color] || colorConfig.primary;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.02]",
        "p-6 flex flex-col justify-between min-h-[170px]",
        "transition-all duration-500 group",
        onClick && "cursor-pointer hover:bg-white/[0.04] hover:border-white/15 active:scale-[0.98]"
      )}
    >
      {/* Background Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", c.gradient)} />
      
      {/* Top Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center border shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
          c.icon
        )}>
          <Icon className="h-6 w-6" />
        </div>
        {onClick && (
          <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/[0.1] transition-all">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-6 relative z-10">
        <p className="text-3xl font-black tracking-tight text-white leading-none group-hover:translate-x-1 transition-transform duration-500">{value}</p>
        <div className="flex items-center gap-2 mt-3">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">{label}</p>
          {subtitle && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{subtitle}</p>
            </>
          )}
        </div>
      </div>

      {/* Bottom accent glow */}
      <div className={cn("absolute -bottom-10 -right-10 w-24 h-24 blur-3xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000", c.icon.split(' ')[0])} />
    </div>
  );
}
