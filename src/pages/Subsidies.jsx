import React, { useState, useEffect } from 'react';
import AppHeader from '../components/dashboard/AppHeader';
import { Shield, Vote, CheckCircle, Clock, XCircle, Info, Zap, Terminal, ArrowRight, Activity, Globe, Cpu, ChevronDown, ChevronUp, AlertCircle, FileText, BarChart3, Radio, Layers, Search, Loader2, TrendingUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const initialProposals = [
  { 
    id: 'GIP-001', 
    title: 'Increase Subsidy Cap for Domestic Cylinders', 
    desc: 'Proposal to raise the subsidy drop from ₹200 to ₹280 for 14.2 KG domestic cylinders across all verified nodes.', 
    status: 'active', 
    votes: { yes: 72, no: 18, abstain: 10 }, 
    ends: '3 days',
    proposer: 'Global Depot Node #04',
    impact: 'Estimated 15% increase in domestic booking volume.',
    techSpec: 'Modify stellar_subsidy_contract.rs line 142 from 200 to 280.'
  },
  { 
    id: 'GIP-002', 
    title: 'Add Rajasthan to Supported State Entities', 
    desc: 'Expand geo-data allocation support to include Rajasthan urban nodes for smart booking and on-chain delivery.', 
    status: 'passed', 
    votes: { yes: 88, no: 7, abstain: 5 }, 
    ends: 'Closed',
    proposer: 'India North Cluster',
    impact: 'Expands network reach to 25.4 million new users.',
    techSpec: 'Add STATE_CODE "RJ" to geo_validator.wasm registry.'
  },
  { 
    id: 'GIP-003', 
    title: 'Reduce Stellar TX Fee Estimation Factor', 
    desc: 'Lower the XLM hash estimate multiplier from 0.1 to 0.07 to better reflect current Stellar network fees.', 
    status: 'rejected', 
    votes: { yes: 31, no: 58, abstain: 11 }, 
    ends: 'Closed',
    proposer: 'Fee Oracle Node',
    impact: 'Reduces transaction overhead by 30% per booking.',
    techSpec: 'Update fee_policy.json multiplier value to 0.07.'
  },
  { 
    id: 'GIP-004', 
    title: 'Launch Industrial Cylinder Subsidy Program', 
    desc: 'Create a new subsidy pool for 47.5 KG industrial cylinders targeting MSME sector distribution nodes.', 
    status: 'pending', 
    votes: { yes: 0, no: 0, abstain: 0 }, 
    ends: '7 days',
    proposer: 'Industrial Hub #01',
    impact: 'Incentivizes MSME shift to cleaner LPG assets.',
    techSpec: 'Initialize new industrial_subsidy_vault on-chain.'
  },
  { 
    id: 'GIP-005', 
    title: 'Automated Multi-Vault Ledger Re-indexing', 
    desc: 'Migrate to a multi-vault structure for faster cross-state delivery verification and block propagation.', 
    status: 'active', 
    votes: { yes: 45, no: 42, abstain: 13 }, 
    ends: '2 days',
    proposer: 'System Architect Alpha',
    impact: 'Reduces block sync time from 3.2s to 1.1s.',
    techSpec: 'Splits ledger indexing into 8 regional vaults.'
  },
  { 
    id: 'GIP-006', 
    title: 'Biometric QR Integration for Field Agents', 
    desc: 'Integrate fingerprint-encrypted QR codes on physical cylinders for end-to-end auditability.', 
    status: 'active', 
    votes: { yes: 82, no: 10, abstain: 8 }, 
    ends: '5 days',
    proposer: 'Logistics Safety Board',
    impact: 'Prevents 99.9% of asset misappropriation cases.',
    techSpec: 'Encodes hash(fingerprint) into delivery QR payload.'
  },
];

const statusConfig = {
  active:   { style: 'bg-primary/10 text-primary border-primary/25', icon: Vote, label: 'ACTIVE' },
  passed:   { style: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/25', icon: CheckCircle, label: 'PASSED' },
  rejected: { style: 'bg-red-400/10 text-red-400 border-red-400/25', icon: XCircle, label: 'REJECTED' },
  pending:  { style: 'bg-amber-400/10 text-amber-400 border-amber-400/25', icon: Clock, label: 'PENDING' },
};

export default function Subsidies() {
  const [voted, setVoted] = useState({});
  const [proposals, setProposals] = useState(initialProposals);
  const [expandedId, setExpandedId] = useState(null);
  const [activeMetric, setActiveMetric] = useState(null); // 'total' | 'active' | 'passed' | 'power'
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); 

  const handleVote = (id, choice) => {
    setIsBroadcasting(true);
    setTimeout(() => {
        setVoted(prev => ({ ...prev, [id]: choice }));
        setProposals(prev => prev.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    votes: { ...p.votes, [choice]: p.votes[choice] + 1 }
                };
            }
            return p;
        }));
        setIsBroadcasting(false);
        toast({ title: "Broadcast Successful", description: `Signature committed to protocol.` });
    }, 1500);
  };

  const filteredProposals = proposals.filter(p => {
    if (activeTab === 'active') return p.status === 'active';
    if (activeTab === 'history') return p.status === 'passed' || p.status === 'rejected';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0b1e]">
      <AppHeader breadcrumb="Governance" />
      
      <div className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-10 pb-32">
        
        {/* Protocol Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-violet-400/10 border border-violet-400/25 text-violet-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              <Shield className="h-3.5 w-3.5" /> Consensus Protocol 09
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
              Protocol <span className="text-primary italic">Governance</span>
            </h1>
            <p className="text-slate-300 font-bold uppercase tracking-widest text-[11px] max-w-xl leading-relaxed">
              Decentralized decision-making for the GasChain protocol. Each vote is cryptographically signed and committed.
            </p>
          </div>
          
          <div className="flex p-1 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-3xl shadow-2xl">
             {['all', 'active', 'history'].map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                        "px-7 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === tab ? "bg-primary text-[#020408] shadow-[0_0_15px_rgba(14,252,249,0.3)]" : "text-slate-300 hover:text-slate-100"
                    )}
                 >
                     {tab}
                 </button>
             ))}
          </div>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            label="Total Proposals" 
            value={proposals.length.toString()} 
            icon={FileText} 
            active={activeMetric === 'total'}
            onClick={() => setActiveMetric(activeMetric === 'total' ? null : 'total')}
          />
          <MetricCard 
            label="Active Votes" 
            value={proposals.filter(p => p.status === 'active').length.toString()} 
            icon={Zap} 
            color="text-primary" 
            active={activeMetric === 'active'}
            onClick={() => setActiveMetric(activeMetric === 'active' ? null : 'active')}
          />
          <MetricCard 
            label="Passed History" 
            value={proposals.filter(p => p.status === 'passed').length.toString()} 
            icon={CheckCircle} 
            color="text-emerald-400" 
            active={activeMetric === 'passed'}
            onClick={() => setActiveMetric(activeMetric === 'passed' ? null : 'passed')}
          />
          <MetricCard 
            label="Voting Power" 
            value="100 XLM" 
            icon={Cpu} 
            color="text-violet-400" 
            active={activeMetric === 'power'}
            onClick={() => setActiveMetric(activeMetric === 'power' ? null : 'power')}
          />
        </div>

        {/* Metric Detail Drill-down Panel */}
        <AnimatePresence>
            {activeMetric && (
                <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden"
                >
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.04] border border-primary/20 shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-6">
                            <Button variant="ghost" size="icon" onClick={() => setActiveMetric(null)} className="h-10 w-10 text-slate-500 hover:text-white"><XCircle className="h-5 w-5" /></Button>
                        </div>
                        {activeMetric === 'total' && (
                            <div className="grid md:grid-cols-3 gap-8">
                                <DetailInfo label="Category: Logistics" value="3 Proposals" sub="Focusing on delivery verification" />
                                <DetailInfo label="Category: Finance" value="2 Proposals" sub="Stellar fee & subsidy adjustments" />
                                <DetailInfo label="Category: System" value="1 Proposal" sub="Global node cluster audits" />
                            </div>
                        )}
                        {activeMetric === 'active' && (
                            <div className="grid md:grid-cols-3 gap-8">
                                <DetailInfo label="Avg. Participation" value="84.2%" color="text-primary" />
                                <DetailInfo label="Current Winner" value="GIP-006" sub="Biometric QR Integration (82%)" />
                                <DetailInfo label="Pending Quorum" value="Validated" sub="Protocol reach: 1,248 nodes" />
                            </div>
                        )}
                        {activeMetric === 'passed' && (
                            <div className="grid md:grid-cols-3 gap-8">
                                <DetailInfo label="Subsidy Disbursed" value="₹12.4M" color="text-emerald-400" />
                                <DetailInfo label="Nodes Upgraded" value="98%" sub="Automatic v4.0 transition" />
                                <DetailInfo label="Last Execution" value="GIP-002" sub="Rajasthan Geo-Data active" />
                            </div>
                        )}
                        {activeMetric === 'power' && (
                            <div className="grid md:grid-cols-3 gap-8">
                                <DetailInfo label="Staking Tier" value="Elite Node" color="text-violet-400" />
                                <DetailInfo label="Weight Factor" value="1.2x" sub="Seniority bonus applied" />
                                <DetailInfo label="Yield Estimate" value="42 XLM" sub="End of Epoch 428" />
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Proposals Feed */}
        <div className="space-y-6">
          {filteredProposals.map((p, i) => {
            const cfg = statusConfig[p.status];
            const StatusIcon = cfg.icon;
            const total = p.votes.yes + p.votes.no + p.votes.abstain || 1;
            const isExpanded = expandedId === p.id;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "rounded-[2.5rem] border transition-all duration-500 overflow-hidden relative group",
                    voted[p.id] ? "bg-white/[0.04] border-emerald-500/30" : "bg-white/[0.018] border-white/[0.1] hover:bg-white/[0.035] hover:border-white/25"
                )}
              >
                {/* Header Section */}
                <div 
                   onClick={() => setExpandedId(isExpanded ? null : p.id)}
                   className="p-8 lg:p-10 cursor-pointer select-none"
                >
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.id}</span>
                                <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", cfg.style)}>
                                    <StatusIcon className="h-3 w-3" /> {cfg.label}
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{p.title}</h3>
                            <p className="text-[13px] text-slate-300 font-bold leading-relaxed max-w-4xl tracking-wide">{p.desc}</p>
                        </div>
                        <div className="flex items-center gap-6 flex-shrink-0">
                            <div className="text-right">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-black">Ends Epoch</p>
                                <p className={cn("text-sm font-black uppercase tracking-widest mt-1.5", p.status === 'active' ? "text-primary flex items-center gap-2" : "text-slate-400")}>
                                    {p.status === 'active' && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#0efcf9]" />}
                                    {p.ends}
                                </p>
                            </div>
                            <div className={cn("h-11 w-11 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center transition-transform duration-500", isExpanded && "rotate-180 bg-primary/10 border-primary/30")}>
                                <ChevronDown className={cn("h-5 w-5", isExpanded ? "text-primary" : "text-slate-400")} />
                            </div>
                        </div>
                    </div>

                    {/* Progress Matrix */}
                    {total > 1 && (
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <VoteBar label="YES PROPOSALS" value={p.votes.yes} total={total} color="bg-emerald-500" />
                            <VoteBar label="NO PROPOSALS" value={p.votes.no} total={total} color="bg-red-500" />
                            <VoteBar label="ABSTAIN_V" value={p.votes.abstain} total={total} color="bg-slate-400" />
                        </div>
                    )}
                </div>

                {/* Expanded Detail Drill-down */}
                <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/[0.1] bg-black/40"
                      >
                        <div className="p-8 lg:p-10 space-y-10">
                            <div className="grid md:grid-cols-3 gap-8">
                                <DetailBox icon={User} title="PROPOSER_IDENTITY" value={p.proposer} />
                                <DetailBox icon={BarChart3} title="NETWORK_IMPACT" value={p.impact} />
                                <DetailBox icon={Terminal} title="CODE_REVISION_MD" value={p.techSpec} isCode />
                            </div>

                            {/* Interaction Zone */}
                            {p.status === 'active' && !voted[p.id] ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-white/[0.1]" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">COMMIT VOTING TRANSACTION</span>
                                        <div className="h-px flex-1 bg-white/[0.1]" />
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {['yes', 'no', 'abstain'].map(v => (
                                            <Button
                                                key={v}
                                                disabled={isBroadcasting}
                                                onClick={(e) => { e.stopPropagation(); handleVote(p.id, v); }}
                                                className={cn(
                                                    "flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[.25em] transition-all border shadow-lg",
                                                    v === 'yes' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black' :
                                                    v === 'no' ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black' :
                                                    'bg-white/[0.04] border-white/[0.15] text-slate-300 hover:bg-white/10 hover:text-white'
                                                )}
                                            >
                                                {isBroadcasting ? <Loader2 className="h-5 w-5 animate-spin" /> : `VOTE ${v}`}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ) : voted[p.id] ? (
                                <div className="p-8 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between shadow-2xl">
                                    <div className="flex items-center gap-6">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/25 shadow-lg shadow-emerald-500/10">
                                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.25em] leading-none">SIGNATURE BROADCASTED</p>
                                            <p className="text-sm text-white font-bold tracking-widest mt-2 uppercase">Decision: {voted[p.id]} · Ledger seq validated</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[10px] font-black uppercase tracking-widest text-slate-200 hover:text-primary">
                                        Explorer Link <ArrowRight className="ml-2 h-3.5 w-3.5 text-primary" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 py-6 opacity-40">
                                    <AlertCircle className="h-5 w-5 text-slate-500" />
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Historical protocol cycle. Voting locked.</p>
                                </div>
                            )}
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Global Activity Feed */}
        <div className="pt-12 space-y-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
                <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                    <Radio className="h-4.5 w-4.5 text-primary animate-pulse" /> Live Consensus Stream
                </h4>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Global Epoch 428</span>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-6 rounded-[1.8rem] bg-white/[0.02] border border-white/[0.08] flex items-center gap-5 group/feed hover:bg-white/[0.04] transition-colors">
                        <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-primary transition-all group-hover/feed:scale-110 shadow-lg shadow-black/20">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] text-white font-black uppercase tracking-tight leading-none text-nowrap">Vote Received</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Node_{i === 1 ? 'Alpha' : i === 2 ? 'Gamma' : 'Theta'} · YES</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* Persistence Broadcasting Overlay */}
      <AnimatePresence>
          {isBroadcasting && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0a0b1e]/95 backdrop-blur-2xl flex flex-col items-center justify-center space-y-8">
                  <div className="relative">
                      <div className="h-24 w-24 rounded-3xl border-2 border-primary/30 flex items-center justify-center bg-primary/5">
                          <Loader2 className="h-12 w-12 text-primary animate-spin" />
                      </div>
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 h-24 w-24 rounded-3xl border-2 border-primary" 
                      />
                  </div>
                  <div className="text-center space-y-3">
                      <p className="text-2xl font-black text-white uppercase tracking-[0.4em] italic leading-tight">Broadcasting...</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest max-w-[280px]">Signing transaction and committing consensus to Stellar L2 Ledger</p>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color = "text-white", active, onClick }) {
    return (
        <motion.div 
            whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.04)", borderColor: "rgba(14, 252, 249, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "p-8 rounded-[2.2rem] bg-white/[0.02] border transition-all shadow-xl relative group cursor-pointer",
                active ? "border-primary bg-primary/5 shadow-primary/10" : "border-white/[0.1]"
            )}
        >
            <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-20 transition-opacity"><Icon className="h-9 w-9 text-white" /></div>
            <p className={cn("text-4xl font-black italic tracking-tighter", color)}>{value}</p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-black mt-3">{label}</p>
            <div className={cn("absolute bottom-4 right-4 h-6 w-6 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center transition-all", active ? "opacity-100 rotate-90 bg-primary/20" : "opacity-0 group-hover:opacity-100")}>
                <ArrowRight className={cn("h-3 w-3 text-primary")} />
            </div>
        </motion.div>
    );
}

function DetailInfo({ label, value, sub, color = "text-white" }) {
    return (
        <div className="space-y-2 p-5 rounded-3xl bg-black/40 border border-white/[0.05] group">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <p className={cn("text-2xl font-black italic tracking-tighter transition-transform group-hover:translate-x-1", color)}>{value}</p>
            {sub && <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none">{sub}</p>}
        </div>
    );
}

function VoteBar({ label, value, total, color }) {
    const pct = ((value / total) * 100).toFixed(0);
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">{label}</span>
                <span className="text-[12px] font-black text-white font-mono">{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.08] shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={cn("h-full transition-all duration-1000", color, "shadow-[0_0_15px_rgba(255,255,255,0.1)]")} />
            </div>
        </div>
    );
}

function DetailBox({ icon: Icon, title, value, isCode }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2.5 px-1">
                <Icon className="h-4 w-4 text-slate-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{title}</span>
            </div>
            <div className={cn("p-5 rounded-2xl border transition-all shadow-inner", isCode ? "bg-black/60 border-primary/25 font-mono text-[11px] text-primary/90 lowercase leading-relaxed" : "bg-white/[0.03] border-white/[0.12] text-xs text-white font-bold leading-relaxed tracking-wide")}>
                {value}
            </div>
        </div>
    );
}

function User({ className, ...props }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    );
}
