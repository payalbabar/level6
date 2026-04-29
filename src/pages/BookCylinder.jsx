import { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/dashboard/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Shield, Wallet, MapPin, BadgeCheck, Zap, Info, Building2, User, ChevronRight, Activity, Terminal
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
    { id: "14.2kg_domestic", label: "14.2 KG Domestic", price: 903, subsidy: 200 },
    { id: "19kg_commercial", label: "19 KG Commercial", price: 1450, subsidy: 0 },
    { id: "5kg_portable", label: "5 KG Portable", price: 305, subsidy: 0 },
    { id: "47.5kg_industrial", label: "47.5 KG Industrial", price: 3650, subsidy: 0 },
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
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader breadcrumb="Book Cylinder" />
      
      <div className="p-8 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header */}
            <div className="border-b border-border pb-6">
              <h1 className="text-3xl font-semibold tracking-tight mb-1">Book Cylinder</h1>
              <p className="text-sm text-muted-foreground">Secure your energy supply assets on-chain.</p>
              
              {/* Progress */}
              <div className="flex items-center gap-3 mt-4">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border",
                      s <= step ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
                    )}>
                      {s}
                    </div>
                    <span className={cn("text-sm font-medium hidden sm:inline", s <= step ? "text-foreground" : "text-muted-foreground")}>
                      {s === 1 ? "Details" : s === 2 ? "Cylinder" : "Review"}
                    </span>
                    {s < 3 && <div className={cn("w-8 h-px", s < step ? "bg-primary" : "bg-border")} />}
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                    >
                        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                            <h3 className="text-base font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Personal Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                                    <Input placeholder="Full Name" value={form.customer_name} onChange={(e) => updateForm("customer_name", e.target.value)} className="h-10 bg-muted/50 border-border focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                                    <Input placeholder="10-digit mobile" maxLength={10} value={form.customer_phone} onChange={(e) => updateForm("customer_phone", e.target.value.replace(/\D/g, ''))} className="h-10 bg-muted/50 border-border focus:border-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                            <h3 className="text-base font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">State</Label>
                                    <Select value={form.state} onValueChange={(v) => { updateForm("state", v); updateForm("city", ""); }}>
                                        <SelectTrigger className="h-10 bg-muted/50 border-border"><SelectValue placeholder="Select State" /></SelectTrigger>
                                        <SelectContent>{Object.keys(STATES_CITIES).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">City</Label>
                                    <Select value={form.city} onValueChange={(v) => updateForm("city", v)} disabled={!form.state}>
                                        <SelectTrigger className="h-10 bg-muted/50 border-border"><SelectValue placeholder="Select City" /></SelectTrigger>
                                        <SelectContent>{form.state && STATES_CITIES[form.state].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Pincode</Label>
                                    <Input placeholder="6 Digits" maxLength={6} value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value.replace(/\D/g, ''))} className="h-10 bg-muted/50 border-border focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Street Address</Label>
                                    <Input placeholder="Address" value={form.street_address} onChange={(e) => updateForm("street_address", e.target.value)} className="h-10 bg-muted/50 border-border focus:border-primary" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                            <h3 className="text-base font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Select Cylinder</h3>
                            <div className="space-y-2">
                                {ASSETS.map((asset) => (
                                    <div 
                                        key={asset.id}
                                        onClick={() => updateForm("cylinder_type", asset.id)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer",
                                            form.cylinder_type === asset.id ? "bg-primary/10 border-primary" : "bg-muted/30 border-border hover:border-primary/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-8 w-8 rounded-lg flex items-center justify-center",
                                                form.cylinder_type === asset.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                            )}>
                                                <Zap className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{asset.label}</p>
                                                {asset.subsidy > 0 && <p className="text-xs text-success font-medium">Subsidy: -₹{asset.subsidy}</p>}
                                            </div>
                                        </div>
                                        <p className="text-lg font-semibold font-mono">₹{asset.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                            <h3 className="text-base font-semibold flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> Review Order</h3>
                            <div className="divide-y divide-border rounded-lg bg-muted/30 overflow-hidden">
                                <ReviewRow label="Customer" value={form.customer_name} />
                                <ReviewRow label="Phone" value={form.customer_phone} />
                                <ReviewRow label="Location" value={`${form.city}, ${form.state}`} />
                                <ReviewRow label="Cylinder" value={selectedAsset?.label} />
                                <ReviewRow label="Total" value={`₹${finalAmount}`} highlight />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-3">
                {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                        Back
                    </Button>
                )}
                <Button type="submit" disabled={loading} className={cn("flex-[2]", step === 3 && "bg-success hover:bg-success/90")}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (step === 3 ? "Confirm Booking" : "Continue")}
                </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                  <h3 className="text-sm font-semibold mb-4 pb-3 border-b border-border">Order Summary</h3>
                  <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Asset</span>
                          <span className="font-medium">{selectedAsset?.label}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Base Price</span>
                          <span className="font-medium">₹{price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Quantity</span>
                          <span className="font-medium">{form.quantity}</span>
                      </div>
                      {subsidyAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subsidy</span>
                          <span className="font-medium text-success">-₹{subsidyAmount * form.quantity}</span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-border flex justify-between">
                          <span className="text-sm font-semibold">Total</span>
                          <span className="text-2xl font-semibold">₹{finalAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2">
                          <span className="text-muted-foreground">XLM Estimate</span>
                          <span className="font-medium text-primary">{hashEstimate} XLM</span>
                      </div>
                  </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">On-Chain Protocol</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Confirmed via ECDSA encryption. Blocks finalized in T+2s.</p>
              </div>
          </div>

        </form>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, highlight }) {
    return (
        <div className="flex items-center justify-between py-3 px-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={cn("text-sm font-medium", highlight ? "text-primary" : "text-foreground")}>{value || "—"}</span>
        </div>
    );
}
