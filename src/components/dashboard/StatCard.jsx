import { cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, subtitle = "", color, onClick, className, trend }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "stat-card card-hover relative p-5 rounded-2xl border border-border/50 overflow-hidden",
        "flex flex-col justify-between min-h-[148px]",
        onClick && "cursor-pointer",
        className
      )}
      style={{
        background: "linear-gradient(135deg, hsl(220 18% 8% / 0.9) 0%, hsl(220 18% 7% / 0.95) 100%)",
        boxShadow: "0 1px 3px hsl(220 20% 0% / 0.3), 0 4px 16px hsl(220 20% 0% / 0.15)"
      }}
    >
      {/* Gradient shimmer on top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Background glow blob */}
      <div
        className="absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "hsl(var(--primary) / 0.08)" }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10">
        <div
          className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 text-primary"
          style={{
            background: "linear-gradient(135deg, hsl(200 100% 55% / 0.12), hsl(200 100% 55% / 0.06))",
            border: "1px solid hsl(200 100% 55% / 0.12)"
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        {onClick && (
          <div className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground/60 hover:text-primary transition-colors"
            style={{ background: "hsl(220 15% 11%)" }}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-3 relative z-10">
        <p className="text-2xl font-bold tracking-tight text-foreground font-sans">{value}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-sm font-medium text-muted-foreground leading-tight">{label}</p>
          {subtitle && (
            <>
              <span className="text-border">·</span>
              <p className="text-xs text-muted-foreground/70">{subtitle}</p>
            </>
          )}
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-[10px] font-medium text-success">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
