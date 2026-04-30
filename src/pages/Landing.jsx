import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Zap, ArrowRight, ChevronRight, CheckCircle2
} from "lucide-react";
import { GasChainMark } from "@/components/Layout";
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      toast({ title: "Connecting Freighter...", description: "Requesting wallet permissions" });
      const allowed = await checkConnection();
      if (!allowed) {
        if (import.meta.env.DEV) {
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
      toast({ title: "✓ Wallet Connected", description: `Connected: ${key.slice(0, 6)}...${key.slice(-4)}` });
    } catch (err) {
      console.error(err);
      toast({ title: "Connection Failed", description: err.message || "User rejected the request", variant: "destructive" });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white selection:bg-cyan-500/30 selection:text-cyan-400 font-sans">
      
      {/* --- Header --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#02040a]/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo & Version */}
          <div className="flex items-center gap-3">
            <GasChainMark size={28} />
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight">GasChain</span>
              <span className="text-[10px] text-white/40 font-mono">v2.4</span>
            </div>
          </div>

          {/* Network Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Stellar Mainnet</span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-8">
            <button 
              onClick={connectWallet}
              className="hidden md:block text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              Connect Wallet
            </button>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="h-10 px-6 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold transition-all flex items-center gap-2 group"
            >
              Launch App
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="relative pt-48 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 blur-[120px] -z-10 rounded-full" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] -z-10 rounded-full" />
        
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold tracking-wide">
              <Zap className="h-3 w-3 fill-cyan-400" />
              Introducing Protocol v2.4
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1] text-white">
              Energy logistics,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">
                cryptographically verified.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed">
              GasChain is the operating system for global LPG distribution. Track physical assets, 
              automate compliance, and settle payments in milliseconds — on Stellar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                onClick={() => navigate("/dashboard")}
                className="h-14 px-10 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold text-lg transition-all flex items-center gap-2 group shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              >
                Start Building
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={connectWallet}
                variant="outline"
                className="h-14 px-10 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all"
              >
                Connect Wallet
              </Button>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-12">
              {[
                "Stellar Soroban",
                "Zero-Knowledge Proofs",
                "Sub-second finality"
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-white/40 text-xs font-bold tracking-wider uppercase">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500/60" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* --- Footer Status --- */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="p-4 rounded-3xl bg-[#0a0c14]/90 backdrop-blur-2xl border border-white/5 shadow-2xl flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer hover:bg-white/10 transition-colors">
              <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white" />
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 leading-none mb-1">Automated Indexer</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Node Idle</span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline"
            className="h-10 px-6 rounded-full border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold text-xs uppercase tracking-widest transition-all"
          >
            Spin up Node
          </Button>
        </div>
      </div>

    </div>
  );
}
