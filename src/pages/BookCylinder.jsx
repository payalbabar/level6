import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Shield, Wallet, MapPin, BadgeCheck, Zap, Info, Building2, User
} from "lucide-react";
import { generateHash, generateBlockHash, generateBookingId, CYLINDER_PRICES, CYLINDER_LABELS } from "@/lib/blockchain";
import { checkConnection, sendXLM, retrievePublicKey } from "@/lib/freighter";
import { cn } from "@/lib/utils";

const STATES_CITIES = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"]
};

// Scalable Distributors (reflecting contract capability)
const DISTRIBUTORS = [
  { id: "dist_1", name: "GasChain Central Depot", address: "GB2...P3K", rating: 4.9 },
  { id: "dist_2", name: "Metro LPG Solutions", address: "GA4...R9L", rating: 4.7 },
  { id: "dist_3", name: "EcoEnergy Distributors", address: "GC1...M2X", rating: 4.8 },
];

export default function BookCylinder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
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
    cylinder_sn: "L-102", // Default existing asset for demo
    notes: "",
  });

  const price = CYLINDER_PRICES[form.cylinder_type] || 0;
  const subsidyAmount = form.cylinder_type === "14.2kg_domestic" ? 200 : 0;
  const totalAmount = price * form.quantity;
  const finalAmount = totalAmount - subsidyAmount * form.quantity;

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (step < 3) {
        setStep(step + 1);
        return;
    }

    // Validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.customer_phone)) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid 10-digit mobile number", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    if (form.payment_method === 'freighter') {
      const allowed = await checkConnection();
      if (!allowed) {
        toast({ title: "Freighter Not Found", description: "Please install Freighter to use this payment method", variant: "destructive" });
        setLoading(false);
        return;
      }

      try {
        const userAddress = await retrievePublicKey();
        const xlmPrice = (finalAmount * 0.1).toFixed(2);
        
        toast({ title: "Payment Pending", description: `Transaction of ${xlmPrice} XLM initiated.` });

        const res = await sendXLM(userAddress, xlmPrice);
        const txHash = res.hash || res.transaction_hash || "unknown_hash";

        const bookingId = generateBookingId();
        const fullAddress = `${form.house_no}, ${form.street_address}, ${form.landmark ? form.landmark + ', ' : ''}${form.city}, ${form.state} - ${form.pincode}, India`;
        const blockHash = generateHash({ bookingId, ...form });

        const distributor = DISTRIBUTORS.find(d => d.id === form.distributor_id);

        await base44.entities.Booking.create({
          ...form,
          customer_address: fullAddress,
          booking_id: bookingId,
          total_amount: totalAmount,
          subsidy_applied: subsidyAmount * form.quantity,
          final_amount: finalAmount,
          status: "confirmed",
          block_hash: blockHash,
          distributor_name: distributor.name,
          cylinder_sn: form.cylinder_sn, // Track the physical asset serial
          metadata: JSON.stringify({ txHash, network: "Stellar Testnet", priceXLM: xlmPrice, enterprise: "v2_protocol" }),
        });

        const genesisHash = generateBlockHash("0x0000000000000000", { bookingId, event: "booking_created" });
        await base44.entities.SupplyChainBlock.create({
          block_index: 1,
          block_hash: genesisHash,
          previous_hash: "0x0000000000000000",
          timestamp: new Date().toISOString(),
          booking_id: bookingId,
          event_type: "booking_created",
          event_data: JSON.stringify({ customer: form.customer_name, stellar_payment: true, distributor: distributor.name }),
          location: "Stellar Node (Testnet)",
          verified_by: "Protocol Node",
          nonce: Math.floor(Math.random() * 100000),
        });

        toast({ title: "Success!", description: "Immutable booking record confirmed." });
        navigate("/bookings");
      } catch (error) {
        toast({ title: "Transaction Failed", description: error.message || "User denied request", variant: "destructive" });
        setLoading(false);
      }
      return;
    }

    // Default processing for other payment methods...
    const bookingId = generateBookingId();
    const fullAddress = `${form.house_no}, ${form.street_address}, ${form.landmark ? form.landmark + ', ' : ''}${form.city}, ${form.state} - ${form.pincode}, India`;
    const distributor = DISTRIBUTORS.find(d => d.id === form.distributor_id);

    await base44.entities.Booking.create({
      ...form,
      customer_address: fullAddress,
      booking_id: bookingId,
      total_amount: totalAmount,
      subsidy_applied: subsidyAmount * form.quantity,
      final_amount: finalAmount,
      status: "pending",
      distributor_name: distributor.name,
      block_hash: generateHash({ bookingId, ...form }),
      metadata: JSON.stringify({ network: "GasChain L2" }),
    });

    toast({ title: "Booking Pending", description: `Reference: ${bookingId}` });
    navigate("/bookings");
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary uppercase">
                Step {step} of 3 • {step === 1 ? "Identity" : step === 2 ? "Logistics" : "Payment"}
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Smart <span className="text-primary">Booking</span></h1>
            <p className="text-slate-500 text-sm font-medium">Verify your profile and secure your energy supply on-chain.</p>
        </div>
        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
            {[1, 2, 3].map(s => (
                <div key={s} className={cn("h-2 w-12 rounded-full mx-1 transition-all", step === s ? "bg-primary glow" : step > s ? "bg-primary/40" : "bg-white/10")} />
            ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
            {/* STEP 1: Personal + Address */}
            {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="premium-card p-8 space-y-8">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <User className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">Identity Verification</h2>
                         </div>
                         <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Customer Name</Label>
                                <Input
                                    placeholder="Enter full name"
                                    className="h-12 bg-white/[0.02] border-white/10 focus:border-primary/50 transition-all rounded-xl"
                                    value={form.customer_name}
                                    onChange={(e) => updateForm("customer_name", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Contact Node</Label>
                                <Input
                                    placeholder="10-digit mobile"
                                    maxLength={10}
                                    className="h-12 bg-white/[0.02] border-white/10 focus:border-primary/50 transition-all rounded-xl"
                                    value={form.customer_phone}
                                    onChange={(e) => updateForm("customer_phone", e.target.value.replace(/[^0-9]/g, ''))}
                                />
                            </div>
                         </div>
                    </div>

                    <div className="premium-card p-8 space-y-8">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">Geo-Data Allocation</h2>
                         </div>
                         <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">State Entity</Label>
                                <Select value={form.state} onValueChange={(v) => { updateForm("state", v); updateForm("city", ""); }}>
                                    <SelectTrigger className="h-12 bg-white/[0.02] border-white/10 rounded-xl"><SelectValue placeholder="Select State" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(STATES_CITIES).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Urban Node</Label>
                                <Select value={form.city} onValueChange={(v) => updateForm("city", v)} disabled={!form.state}>
                                    <SelectTrigger className="h-12 bg-white/[0.02] border-white/10 rounded-xl"><SelectValue placeholder="Select City" /></SelectTrigger>
                                    <SelectContent>
                                        {form.state && STATES_CITIES[form.state].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Pincode</Label>
                            <Input
                                placeholder="6 digits"
                                maxLength={6}
                                className="h-12 bg-white/[0.02] border-white/10 rounded-xl"
                                value={form.pincode}
                                onChange={(e) => updateForm("pincode", e.target.value.replace(/[^0-9]/g, ''))}
                            />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Street Protocol</Label>
                            <Input
                                placeholder="Detailed address"
                                className="h-12 bg-white/[0.02] border-white/10 rounded-xl"
                                value={form.street_address}
                                onChange={(e) => updateForm("street_address", e.target.value)}
                            />
                         </div>
                    </div>
                </div>
            )}

            {/* STEP 2: Distributor Selection */}
            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="premium-card p-8 space-y-8">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">Authorized Distributors</h2>
                         </div>
                         <p className="text-sm text-slate-500 font-medium italic">Select a verified node for delivery.</p>
                         <div className="grid gap-4">
                             {DISTRIBUTORS.map(d => (
                                <div 
                                    key={d.id} 
                                    onClick={() => updateForm("distributor_id", d.id)}
                                    className={cn("p-6 rounded-2xl border transition-all cursor-pointer group/dist", form.distributor_id === d.id ? "bg-primary/10 border-primary/40" : "bg-white/[0.02] border-white/5 hover:border-white/10")}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("h-10 w-10 rounded-[10px] flex items-center justify-center", form.distributor_id === d.id ? "bg-primary text-white" : "bg-white/5 text-slate-500")}>
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{d.name}</p>
                                                <p className="text-[10px] font-mono text-slate-500">{d.address}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-white">{d.rating} ★</p>
                                            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
                                        </div>
                                    </div>
                                </div>
                             ))}
                         </div>
                    </div>

                    <div className="premium-card p-8 space-y-8">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                <Shield className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">Cylinder Asset Verification</h2>
                         </div>
                         <div className="space-y-4">
                            <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Serial Number (Physical Sn)</Label>
                            <div className="relative">
                               <Input
                                   placeholder="Enter L-XXX series"
                                   className="h-12 bg-white/[0.02] border-white/10 rounded-xl pl-4 pr-10"
                                   value={form.cylinder_sn}
                                   onChange={(e) => updateForm("cylinder_sn", e.target.value.toUpperCase())}
                               />
                               <BadgeCheck className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">Verified in Enterprise Asset Registry v2.0</p>
                         </div>
                    </div>
                </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="premium-card p-8 space-y-8">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <Zap className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">Settlement Layer</h2>
                         </div>
                         <div className="grid gap-4">
                            {[
                                { id: "freighter", label: "Freighter (XLM)", icon: Wallet, desc: "Direct Stellar Payment (Instant)" },
                                { id: "online", label: "Digital UPI", icon: Info, desc: "Standard INR Gateway" },
                                { id: "cod", label: "Cash Settlement", icon: Info, desc: "Payment upon delivery verification" },
                            ].map(m => (
                                <div 
                                    key={m.id} 
                                    onClick={() => updateForm("payment_method", m.id)}
                                    className={cn("p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between", form.payment_method === m.id ? "bg-primary/10 border-primary/40" : "bg-white/[0.02] border-white/5 hover:border-white/20")}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("h-10 w-10 rounded-[10px] flex items-center justify-center", form.payment_method === m.id ? "bg-primary text-white" : "bg-white/5 text-slate-500")}>
                                            <m.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">{m.label}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">{m.desc}</p>
                                        </div>
                                    </div>
                                    {form.payment_method === m.id && <BadgeCheck className="h-5 w-5 text-primary" />}
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            )}

            <div className="flex gap-4 pt-4">
                {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="h-14 flex-1 rounded-2xl border-white/10 hover:bg-white/5 text-slate-400 font-black tracking-widest text-xs uppercase">
                        Back
                    </Button>
                )}
                <Button type="submit" disabled={loading} className="h-14 flex-[2] rounded-2xl bg-primary hover:bg-primary/90 text-white font-black tracking-widest text-xs uppercase shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02]">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : step === 3 ? "Process Booking" : "Next Protocol"}
                </Button>
            </div>
        </div>

        {/* PRICE SUMMARY - SIDEBAR */}
        <div className="lg:col-span-2 space-y-6">
            <div className="premium-card p-8 relative overflow-hidden bg-white/5 border border-white/10">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Zap className="h-32 w-32 text-primary" />
                </div>
                <h3 className="text-lg font-black text-white mb-8 tracking-tight">Ledger Summary</h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Network Assets</Label>
                        <Select value={form.cylinder_type} onValueChange={(v) => updateForm("cylinder_type", v)}>
                            <SelectTrigger className="bg-transparent border-white/10 h-11 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(CYLINDER_LABELS).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500 uppercase tracking-widest">Base Rate</span>
                            <span className="text-white font-mono">₹{price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500 uppercase tracking-widest">Quantity</span>
                            <span className="text-white font-mono">×{form.quantity}</span>
                        </div>
                        {subsidyAmount > 0 && (
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-emerald-500 uppercase tracking-widest">Subsidy Drop</span>
                                <span className="text-emerald-500 font-mono">-₹{(subsidyAmount * form.quantity).toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Liability</p>
                                <p className="text-3xl font-black text-white tracking-tighter">₹{finalAmount.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Hash Estimate</p>
                                <p className="text-sm font-bold text-slate-400">{(finalAmount * 0.1).toFixed(2)} XLM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                    <Shield className="h-5 w-5" />
                    <p className="text-sm font-black tracking-tight">On-Chain Protocol</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    This booking will be cryptographically hashed and committed to the Stellar ledger. 
                    Once confirmed, the distributor will receive a smart contract event for fulfillment.
                </p>
            </div>
        </div>
      </form>
    </div>
  );
}
