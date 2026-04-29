import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Wallet, Shield, Zap, Database, Loader2,
  Globe, ArrowRight, Flame, ChevronRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { checkConnection, retrievePublicKey } from "@/lib/freighter";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated } = useAuth();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) setIsWalletConnected(true);
  }, [isAuthenticated]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      toast({ title: "Connecting Freighter…", description: "Requesting wallet permissions" });
      const allowed = await checkConnection();
      if (!allowed) {
        // Fallback for demo/dev mode without Freighter
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
           toast({ title: "Demo Mode", description: "Freighter not found. Entering as guest." });
           login();
           return;
        }
        toast({ title: "Freighter Not Found", description: "Please install Freighter browser extension to continue", variant: "destructive" });
        return;
      }
      const key = await retrievePublicKey();
      setPublicKey(key);
      setIsWalletConnected(true);
      login();
      toast({ title: "✓ Wallet Connected", description: `Connected: ${key.slice(0, 6)}…${key.slice(-4)}` });
    } catch (err) {
      console.error(err);
      toast({ title: "Connection Failed", description: err.message || "User rejected the request", variant: "destructive" });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-white overflow-x-hidden font-sans selection:bg-blue-600/20 selection:text-blue-400">

      {/* ─── Ambient background blobs ─── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[140px] animate-glow-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px]" />
        {/* higher fidelity grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 0)",
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      {/* ─── Navigation ─── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0b1e]/80 backdrop-blur-2xl border-b border-white/[0.12] shadow-[0_1px_40px_rgba(0,0,0,0.6)]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white leading-none">GasChain</span>
              <p className="text-[9px] uppercase tracking-[0.22em] text-blue-500 font-bold leading-none mt-0.5">LPG Connect Protocol</p>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Ecosystem</a>
            <button
              onClick={() => navigate("/dashboard")}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Launch Platform
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile CTA */}
          <button
            onClick={() => navigate("/dashboard")}
            className="md:hidden px-4 py-2 rounded-xl bg-primary text-[#020408] text-xs font-black"
          >
            Launch
          </button>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.1] text-blue-400 text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-3xl">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              GasChain Protocol v2.4
            </div>
 
            {/* Clean Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.05]">
                Modern LPG
                <br />
                <span className="text-gradient-accent">
                   Infrastructure.
                </span>
              </h1>
            </div>
 
            {/* Clean Subtitle */}
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium opacity-90">
              The professional open protocol for secure LPG distribution, 
              real-time logistics tracking, and automated subsidy settlement.
            </p>
 
            {/* Clean Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="group h-14 w-full sm:w-64 rounded-2xl bg-blue-600 text-white font-black tracking-wide text-base shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95"
              >
                Enter Platform
                <ChevronRight className="inline-block h-5 w-5 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </button>
 
              <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  Stellar mainnet-ready nodes
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y border-white/[0.06] bg-white/[0.015] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { value: "48.2K+", label: "Total Transactions" },
              { value: "1,200+", label: "Active Distributors" },
              { value: "45m",    label: "Avg. Delivery Time" },
              { value: "12%",    label: "Carbon Reduction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1.5">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 space-y-4"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-black">Core Infrastructure</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Enterprise Architecture</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-lg font-medium opacity-90">
            Built on the most advanced blockchain protocol for global logistics and energy sectors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Globe,  title: "Global Scalability",     description: "Our smart contract architecture supports multi-region distribution hubs with automated compliance." },
            { icon: Shield, title: "Institutional Security", description: "End-to-end encryption for consumer data with immutable audit trails for regulatory reporting." },
            { icon: Zap,    title: "Real-Time Settlement",   description: "Instant payment processing via XLM with sub-second finality on the Stellar network." },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-10 rounded-[2rem] bg-white/[0.025] border border-white/[0.07] hover:border-primary/25 transition-all duration-500 overflow-hidden cursor-default"
            >
              {/* hover glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/0 group-hover:bg-primary/8 blur-[60px] rounded-full transition-all duration-700 pointer-events-none" />

              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-[#020408] group-hover:border-primary transition-all duration-400 shadow-xl shadow-primary/5 relative z-10">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 relative z-10">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="relative py-32 border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Steps */}
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-black mb-4">How It Works</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.05]">
                  The Modern Way to
                  <br />
                  <span className="text-slate-500">Manage LPG.</span>
                </h2>
              </motion.div>

              <div className="space-y-8 pt-2">
                {[
                  { num: "01", title: "Digital Identity",   desc: "Secure your wallet and create your blockchain-verified energy profile." },
                  { num: "02", title: "Smart Booking",      desc: "AI-optimized routing matches your order with the nearest authorized distributor." },
                  { num: "03", title: "Crypto Settlement",  desc: "Transparent payments via Freighter with zero hidden fees and instant receipts." },
                ].map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-5 items-start group"
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-2xl border border-primary/20 bg-primary/8 flex items-center justify-center text-primary font-black text-sm group-hover:bg-primary group-hover:text-[#020408] group-hover:border-primary transition-all duration-300">
                      {step.num}
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <h4 className="text-lg font-black text-white">{step.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary/12 via-[#050a14] to-secondary/12 border border-white/[0.07] overflow-hidden relative animate-float shadow-2xl">
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
                    backgroundSize: "30px 30px"
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Database className="h-28 w-28 text-primary/12" />
                </div>
                {/* glow center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[60px] rounded-full" />

                {/* floating badges */}
                <div className="absolute top-8 left-8 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-primary/20 text-primary text-xs font-bold shadow-xl">
                  On-Chain Verified
                </div>
                <div className="absolute bottom-8 right-8 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-emerald-500/20 shadow-xl">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Secure 256-bit</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative p-12 md:p-24 rounded-[3rem] overflow-hidden text-center">
            {/* bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-violet-600/20 rounded-[3rem]" />
            <div className="absolute inset-0 border border-primary/20 rounded-[3rem]" />
            <div className="absolute inset-0 backdrop-blur-sm rounded-[3rem]" />
            {/* inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/30 blur-[80px] rounded-full" />

            <div className="relative z-10 space-y-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-black">Get Started</p>
              <h2 className="text-4xl md:text-6xl font-black text-white">
                Ready to modernize<br />your supply chain?
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Join thousands of businesses and users transitioning to a transparent energy future.
              </p>
              <div className="pt-4">
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  size="lg"
                  className="rounded-2xl h-14 px-12 text-base font-black bg-white text-primary shadow-2xl shadow-white/10 hover:bg-slate-100 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  {isConnecting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Connecting…</>
                  ) : (
                    <>Get Started Now<ArrowRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/[0.06] bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <Flame className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-base font-black text-white leading-none">GasChain</span>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold">LPG Connect Protocol</p>
                </div>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
                Empowering the LPG industry with decentralized infrastructure, ensuring transparency and efficiency in every delivery.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-black text-sm">Platform</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {["Documentation", "Security", "Network Status"].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-black text-sm">Connect</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {["Twitter", "Discord", "GitHub"].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2026 GasChain Ecosystem. All rights reserved.</p>
            <p className="text-xs text-slate-700">Built on Stellar · Powered by Soroban</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
