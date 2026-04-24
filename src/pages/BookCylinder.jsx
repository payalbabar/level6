import { useState, useMemo, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/dashboard/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Shield, Wallet, MapPin, BadgeCheck, Zap, Info, Building2, User, ChevronRight, Activity, Terminal, Sparkles, Fingerprint
} from "lucide-react";
import { generateHash, generateBlockHash, generateBookingId, CYLINDER_PRICES, CYLINDER_LABELS } from "@/lib/blockchain";
import { checkConnection, sendXLM, retrievePublicKey } from "@/lib/freighter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const STATES_CITIES = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"]
};

const ASSETS = [
    { id: "14.2kg_domestic", label: "14.2 KG Domestic", price: 903, subsidy: 200, icon: "🔥" },
    { id: "19kg_commercial", label: "19 KG Commercial", price: 1450, subsidy: 0, icon: "🏭" },
    { id: "5kg_portable", label: "5 KG Portable", price: 305, subsidy: 0, icon: "👜" },
    { id: "47.5kg_industrial", label: "47.5 KG Industrial", price: 3650, subsidy: 0, icon: "🏗" },
];

export default function BookCylinder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [indexerStatus, setIndexerStatus] = useState("Idle");
  
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    house_no: "",
    street_address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    cylinder_type: "14.2kg_domestic",
    quantity: 1,
    payment_method: "freighter",
    distributor_id: "dist_1",
    cylinder_sn: "L-102",
    notes: "",
  });

  const selectedAsset = useMemo(() => ASSETS.find(a => a.id === form.cylinder_type), [form.cylinder_type]);
  const price = selectedAsset?.price || 0;
  const subsidyAmount = selectedAsset?.subsidy || 0;
  const totalAmount = price * form.quantity;
  const finalAmount = totalAmount - (subsidyAmount * form.quantity);
  const hashEstimate = (finalAmount * 0.1).toFixed(2);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIndexerStatus("Indexing...");
    setTimeout(() => setIndexerStatus("Idle"), 800);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const bookingId = generateBookingId();
      const fullAddress = `${form.street_address}, ${form.city}, ${form.state} - ${form.pincode}, India`;
      const blockHash = generateHash({ bookingId, ...form });

      if (form.payment_method === 'freighter') {
          const allowed = await checkConnection();
          if (allowed) {
              const userAddress = await retrievePublicKey();
              await sendXLM(userAddress, hashEstimate);
          }
      }

      await base44.entities.Booking.create({
        ...form,
        customer_address: fullAddress,
        booking_id: bookingId,
        total_amount: totalAmount,
        subsidy_applied: subsidyAmount * form.quantity,
        final_amount: finalAmount,
        status: "confirmed",
        block_hash: blockHash,
        distributor_name: "GasChain Central Depot",
        metadata: JSON.stringify({ network: "Stellar Testnet", estimate: hashEstimate }),
      });

      await base44.entities.SupplyChainBlock.create({
        block_index: 1,
        block_hash: generateBlockHash("0x0", { bookingId }),
        previous_hash: "0x0000000000000000",
        timestamp: new Date().toISOString(),
        booking_id: bookingId,
        event_type: "booking_created",
        location: "Network Node",
        verified_by: "Protocol Node",
        nonce: Math.floor(Math.random() * 100000),
      });

      toast({ title: "Booking Finalized", description: "Ledger commit successful." });
      navigate("/bookings");
    } catch (err) {
      toast({ title: "Commit Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e]">
      <AppHeader breadcrumb="Book Cylinder" />
      
      <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            
            <div className="space-y-6">
                <motion.div 
                   layoutId="step-badge"
                   className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 text-[10px] font-black tracking-widest text-primary uppercase"
                >
                    <Activity className="h-3 w-3 animate-pulse" />
                    PHASE {step} / 03
                </motion.div>
                <div className="space-y-1">
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-black text-white tracking-tight leading-none"
                    >
                        Smart <span className="text-primary italic">Booking</span>
                    </motion.h1>
                    <p className="text-slate-300 font-bold text-sm">Secure your energy supply assets on-chain.</p>
                </div>
                <div className="relative pt-2">
                    <div className="relative h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            className="absolute h-full bg-primary shadow-[0_0_15px_rgba(14,252,249,0.5)] z-10"
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid gap-6"
                    >
                        <SectionCard icon={Fingerprint} title="Identity Protocol" subTitle="Personal Information">
                            <div className="grid md:grid-cols-2 gap-6">
                                <InteractiveGroup label="CUSTOMER NAME">
                                    <Input 
                                        placeholder="Full Name" 
                                        value={form.customer_name} 
                                        onChange={(e) => updateForm("customer_name", e.target.value)}
                                        className="h-11 bg-white/[0.03] border-white/[0.1] focus:border-primary rounded-xl px-4 text-sm font-bold text-white placeholder:text-slate-600 transition-all"
                                    />
                                </InteractiveGroup>
                                <InteractiveGroup label="CONTACT NODE">
                                    <Input 
                                        placeholder="10-digit mobile" 
                                        maxLength={10} 
                                        value={form.customer_phone} 
                                        onChange={(e) => updateForm("customer_phone", e.target.value.replace(/\D/g, ''))}
                                        className="h-11 bg-white/[0.03] border-white/[0.1] focus:border-primary rounded-xl px-4 text-sm font-bold text-white placeholder:text-slate-600 transition-all"
                                    />
                                </InteractiveGroup>
                            </div>
                        </SectionCard>

                        <SectionCard icon={MapPin} title="Terminal Allocation" subTitle="Delivery Destination">
                            <div className="grid md:grid-cols-2 gap-6">
                                <InteractiveGroup label="STATE ERR">
                                    <Select value={form.state} onValueChange={(v) => { updateForm("state", v); updateForm("city", ""); }}>
                                        <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.1] rounded-xl px-4 text-slate-200 font-bold focus:border-primary text-sm whitespace-nowrap overflow-hidden">
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#050a14] border-white/10 text-white">
                                            {Object.keys(STATES_CITIES).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </InteractiveGroup>
                                <InteractiveGroup label="URBAN NODE">
                                    <Select value={form.city} onValueChange={(v) => updateForm("city", v)} disabled={!form.state}>
                                        <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.1] rounded-xl px-4 text-slate-200 font-bold focus:border-primary text-sm whitespace-nowrap overflow-hidden">
                                            <SelectValue placeholder="Select City" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#050a14] border-white/10 text-white">
                                            {form.state && STATES_CITIES[form.state].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </InteractiveGroup>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InteractiveGroup label="PINCODE">
                                    <Input 
                                        placeholder="6 Digits" 
                                        maxLength={6} 
                                        value={form.pincode} 
                                        onChange={(e) => updateForm("pincode", e.target.value.replace(/\D/g, ''))}
                                        className="h-11 bg-white/[0.03] border-white/[0.1] focus:border-primary rounded-xl px-4 text-sm font-bold text-white placeholder:text-slate-600"
                                    />
                                </InteractiveGroup>
                                <InteractiveGroup label="STREET PROTOCOL">
                                    <Input 
                                        placeholder="Address" 
                                        value={form.street_address} 
                                        onChange={(e) => updateForm("street_address", e.target.value)}
                                        className="h-11 bg-white/[0.03] border-white/[0.1] focus:border-primary rounded-xl px-4 text-sm font-bold text-white placeholder:text-slate-600"
                                    />
                                </InteractiveGroup>
                            </div>
                        </SectionCard>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <SectionCard icon={Activity} title="Asset Inventory" subTitle="Cylinder Selection">
                            <div className="grid gap-3">
                                {ASSETS.map((asset) => (
                                    <div 
                                        key={asset.id}
                                        onClick={() => updateForm("cylinder_type", asset.id)}
                                        className={cn(
                                            "flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group",
                                            form.cylinder_type === asset.id 
                                                ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(14,252,249,0.1)]" 
                                                : "bg-black/40 border-white/[0.08] hover:border-white/15"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl border flex items-center justify-center text-xl transition-all",
                                                form.cylinder_type === asset.id ? "border-primary bg-primary text-black" : "border-white/10"
                                            )}>
                                                {form.cylinder_type === asset.id ? <CheckCircle className="h-5 w-5" /> : asset.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase tracking-tight">{asset.label}</p>
                                                {asset.subsidy > 0 && <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Subsidy: -₹{asset.subsidy}</p>}
                                            </div>
                                        </div>
                                        <p className="text-xl font-black text-white font-mono tracking-tighter italic">₹{asset.price}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <SectionCard icon={BadgeCheck} title="Final Audit" subTitle="On-Chain Commitment">
                            <div className="divide-y divide-white/[0.04] bg-black/20 rounded-2xl overflow-hidden border border-white/[0.04]">
                                <ReviewRow label="REGISTRANT" value={form.customer_name} />
                                <ReviewRow label="NETWORK_ID" value={form.customer_phone} />
                                <ReviewRow label="CLUSTER_LOC" value={`${form.city}, ${form.state}`} />
                                <ReviewRow label="ASSET_CLASS" value={selectedAsset?.label} />
                                <ReviewRow label="LIABILITY" value={`₹${finalAmount}`} highlight />
                            </div>
                        </SectionCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-4">
                {step > 1 && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setStep(step - 1)}
                        className="flex-1 h-13 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white"
                    >
                        Back
                    </Button>
                )}
                <Button 
                    type="submit" 
                    disabled={loading}
                    className={cn(
                        "flex-[2] h-13 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        step === 3 ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" : "bg-primary hover:bg-primary/90 text-[#020408] shadow-primary/20"
                    )}
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (step === 3 ? "Commit to Ledger" : "Next Protocol")}
                </Button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-7 pb-4 border-b border-white/[0.08] flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-primary" /> System Metrics
                  </h3>
                  
                  <div className="space-y-6">
                      <div className="space-y-3">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset</p>
                          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-[11px] font-bold text-white uppercase tracking-widest">
                              {selectedAsset?.label}
                          </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-white/[0.06]">
                          <SummaryRow label="BASE RATE" value={`₹${price}`} />
                          <SummaryRow label="QUANTITY" value={`0${form.quantity}`} />
                          <SummaryRow label="SUBSIDY" value={`-₹${subsidyAmount * form.quantity}`} variant="success" />
                      </div>

                      <div className="pt-6 border-t border-white/[0.06] space-y-1.5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Liability</p>
                          <motion.p 
                             key={finalAmount}
                             className="text-4xl font-black text-white tracking-tighter"
                          >
                             ₹{finalAmount}
                          </motion.p>
                          <div className="flex items-center justify-between mt-6">
                              <div className="space-y-1">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">HashEstimate</p>
                                  <p className="text-base font-black text-primary tracking-widest">{hashEstimate} XLM</p>
                              </div>
                              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                                  <Zap className={cn("h-5 w-5", indexerStatus !== "Idle" && "animate-pulse")} />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[8px] font-black text-primary uppercase tracking-widest text-nowrap">
                                <Terminal className="h-3 w-3" /> AUTO_INDEXER
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <div className={cn("h-1.5 w-1.5 rounded-full", indexerStatus === "Idle" ? "bg-primary animate-pulse" : "bg-amber-400 animate-spin")} />
                                <span className={cn("text-[8px] font-black uppercase tracking-widest", indexerStatus === "Idle" ? "text-primary" : "text-amber-400")}>
                                    {indexerStatus}
                                </span>
                            </div>
                        </div>
                        <Button className="w-full h-8 rounded-xl bg-primary/10 border border-primary/30 text-[8px] font-black text-primary uppercase tracking-widest hover:bg-primary/20">VERIFY LOGS</Button>
                  </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.015] border border-white/[0.08] space-y-3">
                  <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h4 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">On-Chain Protocol</h4>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      Confirmed via ECDSA encryption. Sequential blocks finalized in T+2s.
                  </p>
              </div>
          </div>

        </form>
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, subTitle, children }) {
    return (
        <div className="p-7 rounded-3xl bg-white/[0.015] border border-white/[0.08] space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5">
                <Icon className="h-12 w-12 text-white" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{subTitle}</p>
                </div>
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

function InteractiveGroup({ label, children }) {
    return (
        <div className="space-y-2.5">
            <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {label}
            </Label>
            {children}
        </div>
    );
}

function SummaryRow({ label, value, variant = "default" }) {
    return (
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400 font-bold">{label}</span>
            <span className={cn(variant === "success" ? "text-emerald-500" : "text-white")}>{value}</span>
        </div>
    );
}

function ReviewRow({ label, value, highlight }) {
    return (
        <div className="flex items-center justify-between py-4 px-5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={cn("text-[11px] font-black uppercase tracking-widest", highlight ? "text-primary" : "text-white")}>{value || "—"}</span>
        </div>
    );
}

function CheckCircle({ className, ...props }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    )
}
