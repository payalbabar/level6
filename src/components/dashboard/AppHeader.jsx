import { Bell, Activity, ShieldCheck, Flame } from "lucide-react";

export default function AppHeader({ breadcrumb }) {
  return (
    <header className="hidden lg:flex sticky top-0 z-30 bg-[#0a0b1e]/90 backdrop-blur-3xl border-b border-white/[0.14] px-8 py-0 h-[70px] items-center justify-between shadow-2xl">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_#0efcf9]" />
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          System Node
        </p>
        <span className="text-slate-500 font-bold">/</span>
        <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
          {breadcrumb.toUpperCase()}
        </p>
      </div>

      {/* Right: Controls & User */}
      <div className="flex items-center gap-3">
        <button className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all">
          <Bell className="h-4 w-4" />
        </button>
        <button className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all">
          <Activity className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-white/[0.08] mx-1" />

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="text-right leading-none">
            <p className="text-xs font-black text-white">Admin Node</p>
            <p className="text-[9px] text-blue-500 font-bold mt-0.5 tracking-widest uppercase">Validated Authority</p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
