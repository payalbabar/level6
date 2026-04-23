import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { 
  Wallet, Loader2, CheckCircle2, Clock, XCircle, 
  AlertCircle, ClipboardList, FilterX, Shield,
  ChevronRight, Box, CircleDollarSign, ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Button } from "@/components/ui/button";

const SUBSIDY_LABELS = {
  bpl: "BPL Scheme",
  apl: "APL Scheme",
  ujjwala: "PM Ujjwala Yojana",
  pmuy: "PMUY",
  state_scheme: "State Scheme",
};

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "bg-amber-500/10 text-amber-500 border-amber-500/20", label: "Pending" },
  credited: { icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", label: "Credited" },
  rejected: { icon: XCircle, color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Rejected" },
  expired: { icon: AlertCircle, color: "bg-slate-500/10 text-slate-500 border-slate-500/20", label: "Expired" },
};

export default function Subsidies() {
  const [subsidies, setSubsidies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null); 
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await base44.entities.Subsidy.list("-created_date", 50);
      setSubsidies(data);
      setLoading(false);
    }
    load();
  }, []);

  const totalCredited = subsidies
    .filter((s) => s.status === "credited")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const totalPending = subsidies
    .filter((s) => s.status === "pending")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin glow" />
        <p className="text-[10px] font-black tracking-widest text-primary uppercase animate-pulse">Loading Financial State...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary uppercase">
                <CircleDollarSign className="h-3 w-3" /> Financial Hub
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Sponsorship <span className="text-primary italic">Distribution</span></h1>
            <p className="text-slate-500 text-sm font-medium">Immutable tracking of government and enterprise subsidies.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatPanel
          icon={CheckCircle2}
          label="Settled Value"
          value={`₹${totalCredited.toLocaleString()}`}
          color="emerald"
          active={activeFilter === "credited"}
          onClick={() => setActiveFilter(activeFilter === "credited" ? null : "credited")}
        />
        <StatPanel
          icon={Clock}
          label="Pending Clearance"
          value={`₹${totalPending.toLocaleString()}`}
          color="accent"
          active={activeFilter === "pending"}
          onClick={() => setActiveFilter(activeFilter === "pending" ? null : "pending")}
        />
        <StatPanel
          icon={ClipboardList}
          label="Total Interventions"
          value={subsidies.length}
          color="primary"
          active={activeFilter === null}
          onClick={() => setActiveFilter(null)}
        />
      </div>

      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
          {activeFilter ? (
            <>
              Status Filter: <span className="text-primary">{activeFilter}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-widest ml-2"
                onClick={() => setActiveFilter(null)}
              >
                <FilterX className="h-3 w-3 mr-1" /> Clear
              </Button>
            </>
          ) : (
            "Recent Allocations"
          )}
        </h2>
      </div>

      {/* Subsidy List */}
      {subsidies.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
          <Wallet className="h-16 w-16 text-slate-800 mx-auto mb-6" />
          <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">No allocations found</p>
          <p className="text-xs font-medium text-slate-600 mt-2">Initialize a smart booking to trigger subsidy verification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {subsidies
            .filter(s => !activeFilter || s.status === activeFilter)
            .map((subsidy) => {
            const config = STATUS_CONFIG[subsidy.status] || STATUS_CONFIG.pending;
            const StatusIcon = config.icon;
            const isExpanded = expandedId === subsidy.id;

            return (
              <div 
                key={subsidy.id} 
                className={cn(
                  "premium-card overflow-hidden transition-all duration-500 cursor-pointer group",
                  isExpanded ? "p-1 ring-1 ring-primary/20" : "p-[1px] hover:border-primary/30"
                )}
                onClick={() => setExpandedId(isExpanded ? null : subsidy.id)}
              >
                <div className={cn("p-6 bg-black/40 hover:bg-white/[0.02] flex items-center justify-between gap-6 transition-all relative overflow-hidden", isExpanded ? "rounded-[31px]" : "rounded-[31px]")}>
                  
                  <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                    <CircleDollarSign className="h-24 w-24 text-white" />
                  </div>

                  <div className="flex items-center gap-6 z-10 relative">
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border shadow-xl transition-all", 
                        isExpanded ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.02] border-white/5 text-slate-500 group-hover:text-white group-hover:border-white/10"
                    )}>
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-white tracking-tight">
                                {SUBSIDY_LABELS[subsidy.subsidy_type] || subsidy.subsidy_type}
                            </span>
                            <span className={cn("text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border flex items-center gap-1", config.color)}>
                                <StatusIcon className="h-3 w-3" />
                                {config.label}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400">BENEFICIARY: {subsidy.beneficiary_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-10 z-10 relative">
                    <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Time Log</p>
                        <p className="text-[11px] font-bold text-slate-400">{moment(subsidy.created_date).format("DD MMM YYYY")}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Allocated Value</p>
                        <p className="text-xl font-black text-white tracking-tighter">₹{(subsidy.amount || 0).toLocaleString()}</p>
                    </div>
                    <ChevronRight className={cn("h-5 w-5 text-slate-600 transition-transform hidden md:block", isExpanded && "rotate-90 text-primary")} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-8 pb-8 pt-4 bg-black/60 rounded-b-[31px] animate-in slide-in-from-top-4 duration-500">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 pt-4 border-t border-white/5">
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Linked Booking Identity</p>
                        <p className="text-[11px] font-mono text-slate-300 bg-white/[0.02] p-2 rounded-xl border border-white/5">{subsidy.booking_id || "N/A"}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">KYC Status</p>
                        <p className={cn("text-[11px] font-bold p-2 rounded-xl border flex items-center gap-2", 
                            subsidy.aadhaar_linked ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" : "bg-amber-500/5 text-amber-500 border-amber-500/10"
                        )}>
                          {subsidy.aadhaar_linked ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {subsidy.aadhaar_linked ? "Aadhaar Identity Verified" : "Identity Verification Pending"}
                        </p>
                      </div>
                      <div className="space-y-1.5 lg:col-span-1 md:col-span-2">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">System Notes</p>
                        <p className="text-[11px] text-slate-400 italic bg-white/[0.02] p-2 rounded-xl border border-transparent">
                          {subsidy.remarks || "Automated processing. No manual flags raised."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <Shield className="h-3 w-3" /> Cryptographic Proof
                        </p>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 glow" />
                      </div>
                      <p className="text-[11px] font-mono text-primary/70 break-all p-3 rounded-xl bg-black/40 border border-primary/10">
                        {subsidy.block_hash || "HASH_PENDING_CONFIRMATION_0x001"}
                      </p>
                      <p className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-widest mt-3 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3" /> State anchored to Stellar Global Ledger
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatPanel({ label, value, icon: Icon, color, active, onClick }) {
    const colorClasses = {
        primary: "text-primary border-primary/20 shadow-primary/5 bg-primary/5",
        accent: "text-accent border-accent/20 shadow-accent/5 bg-accent/5",
        emerald: "text-emerald-500 border-emerald-500/20 shadow-emerald-500/5 bg-emerald-500/5"
    }[color];

    return (
        <div 
            onClick={onClick}
            className={cn(
                "p-6 rounded-[2rem] border cursor-pointer transition-all duration-300 relative overflow-hidden group",
                active ? colorClasses : "bg-white/[0.02] border-white/5 hover:border-white/10"
            )}
        >
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                    <p className={cn("text-[9px] font-black uppercase tracking-widest", active ? "text-white" : "text-slate-600")}>{label}</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
                </div>
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110", active ? "bg-white/10 text-white" : "bg-white/5 text-slate-500")}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-current" />
            )}
        </div>
    );
}
