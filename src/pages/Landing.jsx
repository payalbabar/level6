import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Wallet, Shield, Zap, ArrowRight, Database, Loader2, 
  ChevronRight, Globe, Lock, BarChart3, TrendingUp 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { checkConnection, retrievePublicKey } from "@/lib/freighter";

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
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">LPG CONNECT</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 mr-12 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Process</a>
            <a href="/dashboard/metrics" className="hover:text-white transition-colors">Network</a>
          </div>

          <div className="flex items-center gap-4">
            {isWalletConnected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : "Connected"}
                </div>
                <Button onClick={() => navigate('/dashboard')} size="sm" className="rounded-full px-6 bg-white text-black hover:bg-slate-200 transition-all font-bold">
                  Dashboard
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { logout(); setIsWalletConnected(false); }} className="text-slate-500 hover:text-white">
                  <Lock className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet} className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden hero-mesh">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-wider text-primary uppercase animate-fade-in">
              <TrendingUp className="h-3 w-3" /> Leading the Global LPG Revolution
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-tight max-w-5xl">
              SECURE. <span className="text-primary">SCALABLE.</span> <br />
              TRANSPARENT.
            </h1>
            
            <p className="max-w-2xl mx-auto text-slate-400 text-xl leading-relaxed font-medium">
              Revolutionizing LPG distribution through Stellar's high-speed blockchain network. 
              Efficiency meets transparency for the next generation of energy logistics.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
              {!isWalletConnected ? (
                <Button onClick={connectWallet} disabled={isConnecting} size="lg" className="rounded-full h-16 px-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-105">
                  {isConnecting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wallet className="mr-2 h-5 w-5" />}
                  Launch GasChain
                </Button>
              ) : (
                <Button onClick={() => navigate('/book')} size="lg" className="rounded-full h-16 px-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-105">
                  New Booking <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button onClick={() => navigate('/dashboard/metrics')} variant="outline" size="lg" className="rounded-full h-16 px-12 text-lg font-bold border-white/10 hover:bg-white/5 transition-all">
                Live Stats <BarChart3 className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
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
              {/* Floating tags */}
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
