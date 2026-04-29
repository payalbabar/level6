import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Shield, Zap, Database, Loader2, Globe, ArrowRight,
  Activity, BarChart3, Lock, ChevronRight, Flame, CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { checkConnection, retrievePublicKey } from "@/lib/freighter";
import { motion, AnimatePresence } from "framer-motion";

// Premium animated logo mark
const GasChainMark = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#2dd4bf" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="18" stroke="url(#heroGrad)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.3" />
    <path d="M20 5L32 12V28L20 35L8 28V12L20 5Z" fill="url(#heroGrad)" opacity="0.1" stroke="url(#heroGrad)" strokeWidth="1.5" />
    <path d="M20 30C20 30 13 24 13 18.5C13 14.5 16 11 20 8C20 8 18 14 20 16C22 18 24 16 24 14C26 17 27 19.5 27 22C27 26.5 24 30 20 30Z" fill="url(#heroGrad)" />
    <path d="M20 28C20 28 16 24 16 21C16 19 17.5 17.5 19 17C18.5 19 20 20 21 19C22 21 22 22.5 22 23.5C22 26 21 28 20 28Z" fill="white" opacity="0.3" />
  </svg>
);

const features = [
  {
    icon: Globe,
    title: "Global State Machine",
    desc: "Every cylinder acts as a node, updating global state in real-time. Sub-second finality via Stellar consensus.",
    size: "lg",
    gradient: "from-sky-500/10 to-teal-500/5",
  },
  {
    icon: Lock,
    title: "Zero-Trust Security",
    desc: "Cryptographic proofs for every physical handoff. End-to-end auditability on Soroban.",
    size: "sm",
    gradient: "from-violet-500/10 to-purple-500/5",
  },
  {
    icon: BarChart3,
    title: "Live Telemetry",
    desc: "Monitor logistics velocity, node uptime, and transaction throughput in real-time.",
    size: "sm",
    gradient: "from-emerald-500/10 to-teal-500/5",
  },
  {
    icon: Activity,
    title: "Instant Settlement",
    desc: "Smart contracts auto-disburse subsidies the moment proof-of-delivery is confirmed on-chain.",
    size: "lg",
    gradient: "from-amber-500/10 to-orange-500/5",
  },
];

const stats = [
  { label: "Network Uptime", value: "99.998%" },
  { label: "Avg Latency",   value: "1.2s" },
  { label: "Active Nodes",  value: "1,240" },
  { label: "Ledger Blocks", value: "642K+" },
];





const infoMap = {
  global: {
    title: "Global State Machine",
    desc: "Every cylinder acts as a node, updating the global state in real-time. Sub-second finality via Stellar consensus."
  },
  trust: {
    title: "Zero-Trust Security",
    desc: "Cryptographic proofs for every physical handoff. End-to-end auditability on Soroban smart contracts."
  },
  telemetry: {
    title: "Live Telemetry",
    desc: "Monitor logistics velocity, node uptime, and throughput instantaneously across the network."
  },
  settlement: {
    title: "Instant Settlement",
    desc: "Smart contracts auto-disburse subsidies the moment proof-of-delivery is confirmed on-chain."
  }
};

export default function Landing() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      toast({ title: "Connecting Freighter…", description: "Requesting wallet permissions" });
      const allowed = await checkConnection();
      if (!allowed) {
        toast({ title: "Demo Mode", description: "Freighter not found. Entering as guest." });
        login();
        return;
      }
      const key = await retrievePublicKey();
      login();
      toast({ title: "✓ Wallet Connected", description: `${key.slice(0, 6)}…${key.slice(-4)}` });
    } catch (err) {
      toast({ title: "Connection Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">

      {/* ── Radial mesh background ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(200 100% 55% / 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, hsl(260 60% 58% / 0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="absolute inset-0 dot-grid opacity-40" />
      </div>

      {/* ── Navigation ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/40 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
        style={scrolled ? { background: "hsl(220 18% 4% / 0.85)" } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative flex items-center">
              <GasChainMark size={32} />
              <span className="absolute inset-0 rounded-full border-2 border-primary opacity-0 group-hover:opacity-80 blur-sm animate-pulse"></span>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-foreground">GasChain</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2 font-mono">v2.4</span>
            </div>
          </div>

          {/* Status chip */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-muted/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-success">Stellar Mainnet</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hidden sm:flex text-sm text-muted-foreground hover:text-foreground"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Connect Wallet
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="h-9 px-5 text-sm font-semibold gradient-bg-primary text-white border-0 rounded-full hover:opacity-90 shadow-glow-sm transition-all"
            >
              Launch App <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Protocol badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold border border-primary/20 bg-primary/5 text-primary">
              <Zap className="h-3.5 w-3.5" />
              Introducing Protocol v2.4
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.08] text-foreground">
              Energy logistics,
              <br />
              <span className="gradient-text">cryptographically</span>{" "}
              <span className="text-muted-foreground/80">verified.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              GasChain is the operating system for global LPG distribution.
              Track physical assets, automate compliance, and settle payments in milliseconds — on Stellar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-full gradient-bg-primary text-white border-0 text-base font-semibold hover:opacity-90 shadow-glow-md transition-all"
              >
                Start Building <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full sm:w-auto h-12 px-8 rounded-full border-border/60 bg-transparent hover:bg-muted/30 text-foreground text-base font-semibold transition-all"
              >
                {isConnecting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Connect Wallet
              </Button>
            </div>

            {/* Trust line */}
            <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
              {["Stellar Soroban", "Zero-Knowledge Proofs", "Sub-second finality"].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3 text-success" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section className="px-6 pb-32 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative rounded-3xl border border-border/40 overflow-hidden shadow-elevated"
            style={{ background: "hsl(220 18% 6%)" }}
          >
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/30"
              style={{ background: "hsl(220 18% 7%)" }}
            >
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-destructive/60" />
                <span className="h-3 w-3 rounded-full bg-warning/60" />
                <span className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 mx-3">
                <div className="h-5 rounded-md bg-muted/30 border border-border/30 flex items-center px-3">
                  <span className="text-[10px] text-muted-foreground font-mono">https://app.gaschain.io/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard preview content */}
            <div className="p-6 space-y-4">
              {/* Stat row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total Bookings", val: "2,847" },
                  { label: "Blocks Validated", val: "14,209" },
                  { label: "Treasury Credits", val: "₹4.2M" },
                  { label: "Active Logistics", val: "38" },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-xl border border-border/30"
                    style={{ background: "hsl(220 18% 8%)" }}
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 mb-3" />
                    <div className="text-lg font-bold text-foreground">{s.val}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Activity bars */}
              <div className="grid grid-cols-2 gap-3">
                {["Recent Bookings", "Blockchain Activity"].map(t => (
                  <div key={t} className="p-4 rounded-xl border border-border/30 space-y-2"
                    style={{ background: "hsl(220 18% 8%)" }}
                  >
                    <div className="text-xs font-semibold text-foreground">{t}</div>
                    {[70, 50, 85, 40, 95, 60].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-primary/10 flex-1">
                          <div className="h-full rounded-full bg-primary/40" style={{ width: `${w}%` }} />
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground w-6">{w}%</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Network Stats Strip ── */}
      <section className="border-y border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Bento ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 z-10 relative">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Platform Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            A complete network protocol.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Everything you need to secure your supply chain — from physical asset tracking to automated compliance.
          </p>
        </div>

        {/* Inline Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedInfo && (
            <motion.div
              key={selectedInfo}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="mb-10"
            >
              <div className="p-10 rounded-[2.5rem] border border-primary/20 bg-primary/5 relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Activity className="h-64 w-64 text-primary" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-wider text-primary">
                      Protocol Feature
                    </div>
                    <h3 className="text-3xl font-bold text-foreground tracking-tight">
                      {infoMap[selectedInfo].title}
                    </h3>
                    <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl">
                      {infoMap[selectedInfo].desc}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setSelectedInfo(null)}
                    className="rounded-2xl h-14 px-8 border-primary/20 hover:bg-primary/10 text-primary font-bold"
                    variant="outline"
                  >
                    Close Analysis
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large card */}
          <div className="md:col-span-2 p-8 rounded-3xl border border-border/40 relative overflow-hidden group card-hover"
            style={{ background: `linear-gradient(135deg, hsl(220 18% 8%), hsl(200 100% 55% / 0.04))` }}
            onClick={() => setSelectedInfo(selectedInfo === 'global' ? null : 'global')}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <Globe className="h-24 w-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Global State Machine</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every cylinder and delivery truck acts as a node, updating the global state in real-time. Sub-second finality via Stellar consensus.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-border/40 relative overflow-hidden group card-hover"
            style={{ background: "linear-gradient(135deg, hsl(220 18% 8%), hsl(260 60% 58% / 0.04))" }}
            onClick={() => setSelectedInfo(selectedInfo === 'trust' ? null : 'trust')}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="relative z-10">
              <div className="h-11 w-11 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                <Lock className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Zero-Trust Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cryptographic proofs for every physical handoff. End-to-end auditability on Soroban smart contracts.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-border/40 relative overflow-hidden group card-hover"
            style={{ background: "linear-gradient(135deg, hsl(220 18% 8%), hsl(152 70% 45% / 0.04))" }}
            onClick={() => setSelectedInfo(selectedInfo === 'telemetry' ? null : 'telemetry')}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/30 to-transparent" />
            <div className="relative z-10">
              <div className="h-11 w-11 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mb-6">
                <BarChart3 className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Live Telemetry</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor logistics velocity, node uptime, and throughput instantaneously across the network.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 p-8 rounded-3xl border border-border/40 relative overflow-hidden group card-hover"
            style={{ background: "linear-gradient(135deg, hsl(220 18% 8%), hsl(38 95% 55% / 0.04))" }}
            onClick={() => setSelectedInfo(selectedInfo === 'settlement' ? null : 'settlement')}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-warning/30 to-transparent" />
            <div className="relative z-10">
              <div className="h-11 w-11 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center mb-6">
                <Activity className="h-5 w-5 text-warning" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Instant Settlement</h3>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                Treasury smart contracts automatically disburse subsidies and payments the moment proof-of-delivery is confirmed on-chain. Zero human intervention required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-32 z-10 relative">
        <div className="max-w-4xl mx-auto text-center rounded-3xl border border-border/40 p-16 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(220 18% 8%), hsl(200 100% 55% / 0.06))" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(200 100% 55%), transparent)" }}
          />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl mb-2"
              style={{ background: "linear-gradient(135deg, hsl(200 100% 55% / 0.2), hsl(170 80% 45% / 0.1))", border: "1px solid hsl(200 100% 55% / 0.2)" }}
            >
              <Flame className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Ready to go live?
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Join 1,240+ nodes on the GasChain network. Connect your wallet and start tracking in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="h-12 px-10 rounded-full gradient-bg-primary text-white border-0 text-base font-semibold hover:opacity-90 shadow-glow-md"
              >
                Launch GasChain <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GasChainMark size={24} />
            <span className="text-sm font-bold tracking-tight text-foreground">GasChain</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 GasChain Protocol. Built on Stellar Soroban.</p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
            </span>
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
