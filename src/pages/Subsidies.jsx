import React, { useState } from 'react';
import AppHeader from '../components/dashboard/AppHeader';
import { Shield, Vote, CheckCircle, Clock, XCircle, Zap, Terminal, ArrowRight, Activity, Cpu, ChevronDown, AlertCircle, FileText, BarChart3, Radio, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const initialProposals = [
  { id: 'GIP-001', title: 'Increase Subsidy Cap for Domestic Cylinders', desc: 'Proposal to raise the subsidy drop from ₹200 to ₹280 for 14.2 KG domestic cylinders across all verified nodes.', status: 'active', votes: { yes: 72, no: 18, abstain: 10 }, ends: '3 days', proposer: 'Global Depot Node #04', impact: 'Estimated 15% increase in domestic booking volume.', techSpec: 'Modify stellar_subsidy_contract.rs line 142 from 200 to 280.' },
  { id: 'GIP-002', title: 'Add Rajasthan to Supported State Entities', desc: 'Expand geo-data allocation support to include Rajasthan urban nodes for smart booking and on-chain delivery.', status: 'passed', votes: { yes: 88, no: 7, abstain: 5 }, ends: 'Closed', proposer: 'India North Cluster', impact: 'Expands network reach to 25.4 million new users.', techSpec: 'Add STATE_CODE "RJ" to geo_validator.wasm registry.' },
  { id: 'GIP-003', title: 'Reduce Stellar TX Fee Estimation Factor', desc: 'Lower the XLM hash estimate multiplier from 0.1 to 0.07 to better reflect current Stellar network fees.', status: 'rejected', votes: { yes: 31, no: 58, abstain: 11 }, ends: 'Closed', proposer: 'Fee Oracle Node', impact: 'Reduces transaction overhead by 30% per booking.', techSpec: 'Update fee_policy.json multiplier value to 0.07.' },
  { id: 'GIP-004', title: 'Launch Industrial Cylinder Subsidy Program', desc: 'Create a new subsidy pool for 47.5 KG industrial cylinders targeting MSME sector distribution nodes.', status: 'pending', votes: { yes: 0, no: 0, abstain: 0 }, ends: '7 days', proposer: 'Industrial Hub #01', impact: 'Incentivizes MSME shift to cleaner LPG assets.', techSpec: 'Initialize new industrial_subsidy_vault on-chain.' },
  { id: 'GIP-005', title: 'Automated Multi-Vault Ledger Re-indexing', desc: 'Migrate to a multi-vault structure for faster cross-state delivery verification and block propagation.', status: 'active', votes: { yes: 45, no: 42, abstain: 13 }, ends: '2 days', proposer: 'System Architect Alpha', impact: 'Reduces block sync time from 3.2s to 1.1s.', techSpec: 'Splits ledger indexing into 8 regional vaults.' },
  { id: 'GIP-006', title: 'Biometric QR Integration for Field Agents', desc: 'Integrate fingerprint-encrypted QR codes on physical cylinders for end-to-end auditability.', status: 'active', votes: { yes: 82, no: 10, abstain: 8 }, ends: '5 days', proposer: 'Logistics Safety Board', impact: 'Prevents 99.9% of asset misappropriation cases.', techSpec: 'Encodes hash(fingerprint) into delivery QR payload.' },
];

const statusConfig = {
  active:   { style: 'bg-primary/10 text-primary', icon: Vote, label: 'Active' },
  passed:   { style: 'bg-success/10 text-success', icon: CheckCircle, label: 'Passed' },
  rejected: { style: 'bg-destructive/10 text-destructive', icon: XCircle, label: 'Rejected' },
  pending:  { style: 'bg-warning/10 text-warning', icon: Clock, label: 'Pending' },
};

export default function Subsidies() {
  const [voted, setVoted] = useState({});
  const [proposals, setProposals] = useState(initialProposals);
  const [expandedId, setExpandedId] = useState(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); 
  const [selectedMetric, setSelectedMetric] = useState(null);

  const governanceInfo = {
    "Total Proposals": {
      title: "Protocol Ledger Stats",
      desc: "Total number of GasChain Improvement Proposals (GIP) submitted since network genesis. Includes active, passed, and rejected states."
    },
    "Active Votes": {
      title: "Live Consensus",
      desc: "Proposals currently in the active voting window. Requires 66% supermajority for protocol parameter adjustments."
    },
    "Passed": {
      title: "Governance History",
      desc: "Successful proposals that have been merged into the protocol's master logic and committed to the Stellar blockchain."
    },
    "Voting Power": {
      title: "Authority Weight",
      desc: "Your current voting weight based on XLM staked in the governance vault. Higher authority allows for greater influence on GIP outcomes."
    }
  };
  const handleVote = (id, choice) => {
    setIsBroadcasting(true);
    setTimeout(() => {
        setVoted(prev => ({ ...prev, [id]: choice }));
        setProposals(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, votes: { ...p.votes, [choice]: p.votes[choice] + 1 } };
            }
            return p;
        }));
        setIsBroadcasting(false);
        toast({ title: "Vote Recorded", description: `Your vote has been committed to the protocol.` });
    }, 1500);
  };

  const filteredProposals = proposals.filter(p => {
    if (activeTab === 'active') return p.status === 'active';
    if (activeTab === 'history') return p.status === 'passed' || p.status === 'rejected';
    return true;
  });

  return (
    <>
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader breadcrumb="Governance" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight">Protocol Governance</h1>
            <p className="text-sm text-muted-foreground">Decentralized decision-making. Each vote is cryptographically signed.</p>
          </div>
          
          <div className="flex p-1 rounded-lg bg-muted border border-border">
             {['all', 'active', 'history'].map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors",
                        activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                 >
                     {tab}
                 </button>
             ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            label="Total Proposals" 
            value={proposals.length.toString()} 
            icon={FileText} 
            onClick={() => setSelectedMetric(selectedMetric === "Total Proposals" ? null : "Total Proposals")}
          />
          <MetricCard 
            label="Active Votes" 
            value={proposals.filter(p => p.status === 'active').length.toString()} 
            icon={Zap} 
            onClick={() => setSelectedMetric(selectedMetric === "Active Votes" ? null : "Active Votes")}
          />
          <MetricCard 
            label="Passed" 
            value={proposals.filter(p => p.status === 'passed').length.toString()} 
            icon={CheckCircle} 
            onClick={() => setSelectedMetric(selectedMetric === "Passed" ? null : "Passed")}
          />
          <MetricCard 
            label="Voting Power" 
            value="100 XLM" 
            icon={Cpu} 
            onClick={() => setSelectedMetric(selectedMetric === "Voting Power" ? null : "Voting Power")}
          />
        </div>

        {/* Inline Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedMetric && (
            <motion.div
              key={selectedMetric}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Shield className="h-24 w-24 text-primary" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {governanceInfo[selectedMetric].title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                      {governanceInfo[selectedMetric].desc}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedMetric(null)}
                    className="self-start md:self-center border-primary/20 hover:bg-primary/10"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Proposals */}
        <div className="space-y-4">
          {filteredProposals.map((p) => {
            const cfg = statusConfig[p.status];
            const StatusIcon = cfg.icon;
            const total = p.votes.yes + p.votes.no + p.votes.abstain || 1;
            const isExpanded = expandedId === p.id;

            return (
              <div
                key={p.id}
                className={cn(
                    "rounded-xl border transition-colors overflow-hidden",
                    voted[p.id] ? "bg-card border-success/30" : "bg-card border-border hover:border-primary/30"
                )}
              >
                <div 
                   onClick={() => setExpandedId(isExpanded ? null : p.id)}
                   className="p-6 cursor-pointer"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-muted-foreground">{p.id}</span>
                                <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase", cfg.style)}>
                                    <StatusIcon className="h-3 w-3" /> {cfg.label}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{p.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-muted-foreground">Ends</p>
                                <p className={cn("text-sm font-medium", p.status === 'active' ? "text-primary" : "text-muted-foreground")}>
                                    {p.ends}
                                </p>
                            </div>
                            <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                        </div>
                    </div>

                    {/* Vote Bars */}
                    {total > 1 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <VoteBar label="Yes" value={p.votes.yes} total={total} color="bg-success" />
                            <VoteBar label="No" value={p.votes.no} total={total} color="bg-destructive" />
                            <VoteBar label="Abstain" value={p.votes.abstain} total={total} color="bg-muted-foreground" />
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border bg-muted/30"
                      >
                        <div className="p-6 space-y-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <DetailBox title="Proposer" value={p.proposer} />
                                <DetailBox title="Impact" value={p.impact} />
                                <DetailBox title="Technical Spec" value={p.techSpec} isCode />
                            </div>

                            {p.status === 'active' && !voted[p.id] ? (
                                <div className="space-y-3">
                                    <p className="text-xs text-muted-foreground text-center">Cast your vote</p>
                                    <div className="flex gap-3">
                                        {['yes', 'no', 'abstain'].map(v => (
                                            <Button
                                                key={v}
                                                disabled={isBroadcasting}
                                                onClick={(e) => { e.stopPropagation(); handleVote(p.id, v); }}
                                                variant="outline"
                                                className={cn(
                                                    "flex-1 capitalize",
                                                    v === 'yes' && 'hover:bg-success hover:text-white hover:border-success',
                                                    v === 'no' && 'hover:bg-destructive hover:text-white hover:border-destructive',
                                                )}
                                            >
                                                {isBroadcasting ? <Loader2 className="h-4 w-4 animate-spin" /> : `Vote ${v}`}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ) : voted[p.id] ? (
                                <div className="p-4 rounded-lg bg-success/10 border border-success/20 flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-success" />
                                    <div>
                                        <p className="text-sm font-semibold text-success">Vote Recorded</p>
                                        <p className="text-xs text-muted-foreground">Decision: {voted[p.id]} · Committed to ledger</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-muted-foreground py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <p className="text-sm">Voting period has ended.</p>
                                </div>
                            )}
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Broadcasting Overlay */}
      <AnimatePresence>
          {isBroadcasting && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-lg font-semibold">Broadcasting vote...</p>
                  <p className="text-sm text-muted-foreground">Signing and committing to Stellar ledger</p>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
    </>
  );
}

function MetricCard({ label, value, icon: Icon, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-6 rounded-xl bg-card border border-border transition-all duration-300",
        onClick && "cursor-pointer hover:border-primary/50 hover:shadow-glow-sm hover:-translate-y-1"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function VoteBar({ label, value, total, color }) {
    const pct = ((value / total) * 100).toFixed(0);
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={cn("h-full rounded-full", color)} />
            </div>
        </div>
    );
}

function DetailBox({ title, value, isCode }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <div className={cn("p-3 rounded-lg border border-border text-sm", isCode ? "bg-muted font-mono text-xs" : "bg-muted/50")}>
                {value}
            </div>
        </div>
    );
}
