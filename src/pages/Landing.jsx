import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Wallet, Shield, Zap, Database, Loader2, 
  ChevronRight, Globe, Lock, BarChart3, TrendingUp, ArrowRight 
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
  
  useEffect(() => {
    if (isAuthenticated) setIsWalletConnected(true);
  }, [isAuthenticated]);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      toast({ title: "Connecting Freighter...", description: "Requesting wallet permissions" });
      const allowed = await checkConnection();
      if (!allowed) {
        toast({ title: "Freighter Not Found", description: "Please install Freighter browser extension to continue", variant: "destructive" });
        return;
      }
      const key = await retrievePublicKey();
      setPublicKey(key);
      setIsWalletConnected(true);
      login();
      toast({ title: "Wallet Connected", description: `Connected: ${key.slice(0, 6)}...${key.slice(-4)}` });
    } catch (err) {
      console.error(err);
      toast({ title: "Connection Failed", description: err.message || "User rejected the request", variant: "destructive" });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 overflow-x-hidden font-sans selection:bg-primary/30 Hero-mesh">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="GasChain Logo" className="h-10 w-10 object-contain rounded-lg shadow-2xl shadow-primary/20" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">GasChain</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/80 mt-1">LPG Connect Protocol</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</button>
            <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Ecosystem</button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-full bg-primary text-secondary text-sm font-bold shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
            >
              Launch GasChain
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden hero-mesh">
        <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live on Stellar Testnet
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-[0.9]">
                Decentralized <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary/80">LPG Connect</span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                The world's first open-source protocol for secure, transparent, 
                and efficient LPG supply chain management powered by Stellar.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-secondary text-lg font-black shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Enter Platform <ArrowRight className="w-6 h-6 text-primary" />
                </button>
                <div className="flex items-center gap-4 text-slate-500 font-medium">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-secondary bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm">Trusted by 30+ Active Users</span>
                </div>
              </div>
            </motion.div>
        </div>
        
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-[2/1] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />
      </section>

      {/* Unified Stats */}
      <section className="border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap justify-center gap-12 md:gap-24">
          <Stat label="Total Transactions" value="48.2K+" />
          <Stat label="Active Distributors" value="1,200+" />
          <Stat label="Avg. Delivery Time" value="45m" />
          <Stat label="Carbon Reduction" value="12%" />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col items-center text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Enterprise Infrastructure</h2>
          <p className="text-slate-400 max-w-xl text-lg">Built on the most advanced blockchain protocol for global logistics and energy sectors.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Globe}
            title="Global Scalability"
            description="Our smart contract architecture supports multi-region distribution hubs with automated compliance."
          />
          <FeatureCard 
            icon={Shield}
            title="Institutional Security"
            description="End-to-end encryption for consumer data with immutable audit trails for regulatory reporting."
          />
          <FeatureCard 
            icon={Zap}
            title="Real-Time Settlement"
            description="Instant payment processing via XLM with sub-second finality on the Stellar network."
          />
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="relative py-32 border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold tracking-tight">The Modern way to <br />Manage LPG.</h2>
              <div className="space-y-12 pt-8">
                <ProcessStep number="1" title="Digital Identity" desc="Secure your wallet and create your blockchain-verified energy profile." />
                <ProcessStep number="2" title="Smart Booking" desc="AI-optimized routing matches your order with the nearest authorized distributor." />
                <ProcessStep number="3" title="Crypto Settlement" desc="Transparent payments via Freighter with zero hidden fees and instant receipts." />
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-[4rem] group overflow-hidden border border-white/10 shadow-2xl animate-float">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Database className="h-32 w-32 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[60px] rounded-full" />
              </div>
              <div className="absolute -top-6 -right-6 px-6 py-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-primary font-bold shadow-2xl">
                On-Chain Verified
              </div>
              <div className="absolute -bottom-6 -left-6 px-6 py-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-emerald-400 font-bold shadow-2xl">
                SECURE 256-BIT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-32">
        <div className="max-w-5xl mx-auto p-12 md:p-24 rounded-[3rem] bg-primary relative overflow-hidden text-center group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <h2 className="text-4xl md:text-6xl font-black text-white relative z-10">Ready to modernize your supply chain?</h2>
          <p className="mt-6 text-white/80 text-xl font-medium relative z-10 max-w-2xl mx-auto">Join thousands of businesses and users transitioning to a transparent energy future.</p>
          <Button onClick={connectWallet} size="lg" className="mt-12 rounded-full h-16 px-12 text-lg font-bold bg-white text-primary hover:bg-slate-100 transition-all font-bold relative z-10">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="GasChain Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold tracking-tight text-white leading-none">GasChain</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              Empowering the LPG industry with decentralized infrastructure, ensuring transparency and efficiency in every delivery.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold">Platform</h4>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Network Status</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold">Connect</h4>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-slate-600 text-sm">
          <p>© 2026 GasChain Ecosystem. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/50 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/20 transition-all" />
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function ProcessStep({ number, title, desc }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 h-10 w-10 rounded-full border border-primary/40 flex items-center justify-center text-primary font-bold text-sm">
        {number}
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-bold text-white tracking-tight">{title}</h4>
        <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-4xl font-black text-white tracking-tighter mb-1">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">{label}</div>
    </div>
  );
}
