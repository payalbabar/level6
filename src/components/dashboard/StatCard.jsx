import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, subtitle = "", color = "primary", onClick }) {
  const colorMap = {
    primary: "text-primary bg-primary/5 border-primary/20",
    secondary: "text-secondary bg-secondary/5 border-secondary/20",
    accent: "text-accent bg-accent/5 border-accent/20",
    destructive: "text-destructive bg-destructive/5 border-destructive/20",
  };

  return (
    <div
      className={cn(
        "premium-card p-6 flex flex-col justify-between min-h-[160px] group",
        onClick && "cursor-pointer active:scale-95"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:glow", colorMap[color])}>
          <Icon className="h-6 w-6" />
        </div>
        {onClick && (
          <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <ChevronRight className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-black tracking-tight text-white">{value}</p>
          {subtitle.includes('%') && (
            <span className="text-xs font-bold text-emerald-400">↑ {subtitle.split(' ')[0]}</span>
          )}
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">{label}</p>
        {!subtitle.includes('%') && subtitle && (
          <p className="text-[10px] text-slate-600 mt-1 font-medium italic">{subtitle}</p>
        )}
      </div>

      {/* Decorative Gradient Background */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-all" />
    </div>
  );
}
