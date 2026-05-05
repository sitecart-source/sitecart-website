import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { Menu, X, CheckCircle2, Zap, Truck, Shield, Mountain, Play, Settings } from "lucide-react";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

import logoPrimary from "./assets/sitecart-logo.png";
import productRender640 from "./assets/sitecart-product-640.webp";
import productRender1280 from "./assets/sitecart-product-1280.webp";
import productRender1920 from "./assets/sitecart-product-1920.webp";
import productRenderJpg from "./assets/sitecart-product-1280.jpg";

const productSrcSet = `${productRender640} 640w, ${productRender1280} 1280w, ${productRender1920} 1920w`;

type InterestedModel = "Core" | "Pro" | "Custom";

interface SitecartLeadRequest {
  name: string;
  business: string;
  trade: string;
  location: string;
  phone: string;
  email: string;
  interestedModel: InterestedModel;
  useCase?: string;
  company: string;
}

interface SitecartLeadResponse {
  ok: boolean;
  duplicate?: boolean;
}

class LeadSubmitError extends Error {
  status: number;
  data: { error?: string } | null;
  constructor(status: number, data: { error?: string } | null, message: string) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function submitSitecartLead(payload: SitecartLeadRequest): Promise<SitecartLeadResponse> {
  const res = await fetch("/api/sitecart-leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let data: { error?: string; ok?: boolean; duplicate?: boolean } | null = null;
  try {
    data = await res.json();
  } catch {
    // ignore non-json response
  }
  if (!res.ok) {
    throw new LeadSubmitError(res.status, data, data?.error ?? `Request failed (${res.status})`);
  }
  return { ok: data?.ok ?? true, duplicate: data?.duplicate };
}

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SitecartLanding />
    </QueryClientProvider>
  );
}

function SitecartLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden industrial-texture">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm py-3" : "bg-transparent py-5"}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }} className="flex items-center gap-2">
            <img src={logoPrimary} alt="SITECART Logo" className="h-8 md:h-10 object-contain" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("features")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</button>
            <button onClick={() => scrollTo("models")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Models</button>
            <button onClick={() => scrollTo("addons")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Add-ons</button>
            <button onClick={() => scrollTo("roi")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">ROI</button>
            <button onClick={() => scrollTo("specs")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Specs</button>
          </div>

          {/* Mobile Nav Toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4">
            <button onClick={() => scrollTo("features")} className="text-left font-medium p-2 hover:bg-muted rounded">Features</button>
            <button onClick={() => scrollTo("models")} className="text-left font-medium p-2 hover:bg-muted rounded">Models</button>
            <button onClick={() => scrollTo("addons")} className="text-left font-medium p-2 hover:bg-muted rounded">Add-ons</button>
            <button onClick={() => scrollTo("roi")} className="text-left font-medium p-2 hover:bg-muted rounded">ROI</button>
            <button onClick={() => scrollTo("specs")} className="text-left font-medium p-2 hover:bg-muted rounded">Specs</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-12 md:pt-40 md:pb-32 container mx-auto px-4 md:px-6 relative clip-angle">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="z-10">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 text-primary border border-primary/20 mb-6 text-sm font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Prototype builds now open. Limited early access available.
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black leading-tight mb-6 text-white uppercase tracking-tight">
              The Mobile Jobsite Hub Built for <span className="text-primary">Australian Trades</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Power your tools, move heavy gear, and lock up your equipment from one rugged, driveable cart.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => scrollTo("register")} className="text-lg h-14 px-8 font-bold uppercase tracking-wide">
                Register Interest
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo("features")} className="text-lg h-14 px-8 border-muted-foreground/30 hover:border-primary hover:text-primary font-bold uppercase tracking-wide">
                See Features
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full"></div>
            <img
              src={productRenderJpg}
              srcSet={productSrcSet}
              sizes="(min-width: 1024px) 600px, 100vw"
              alt="SITECART Product"
              width={1402}
              height={1122}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="relative z-10 w-full h-auto object-contain drop-shadow-2xl scale-110"
            />
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problems" className="py-12 md:py-24 bg-card border-t border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-8 md:mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">The Ute Is Too Far Away</motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground">The daily grind of walking back and forth is killing your margin and wrecking your back.</motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: "Power Run", desc: "Walking back to the ute just to charge a battery or run a lead." },
              { title: "Heavy Lifting", desc: "Carrying tools and materials across rough site terrain by hand." },
              { title: "Unsecured Gear", desc: "Leaving expensive equipment out in the open during smoko." },
              { title: "Wasted Wages", desc: "Minutes lost per worker per day stacking up into real money." }
            ].map((problem, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className="bg-background border-border/50 h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-primary font-black text-4xl mb-4 opacity-50">0{i+1}</div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">{problem.title}</h3>
                    <p className="text-muted-foreground">{problem.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-16 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-20 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">One Cart. Power. Storage. Movement.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need right where you're working.</p>
          </div>

          <div className="relative max-w-5xl mx-auto mt-12">
            <img
              src={productRenderJpg}
              srcSet={productSrcSet}
              sizes="(min-width: 1024px) 1024px, 100vw"
              alt="SITECART Detail"
              width={1402}
              height={1122}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />

            {/* Callouts overlaid on the cart image — hidden on small screens, see stacked list below */}
            <div className="hidden md:block absolute top-[30%] left-[20%]">
              <span className="flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
              </span>
              <div className="absolute top-6 left-0 bg-card border border-border p-3 w-48 rounded shadow-xl text-sm font-medium">
                2 x AU 240V sockets + USB-C / USB-A charging
              </div>
            </div>

            <div className="hidden md:block absolute top-[38%] right-[12%]">
              <span className="flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
              </span>
              <div className="absolute top-6 right-0 bg-card border border-border p-3 w-44 rounded shadow-xl text-sm font-medium text-right">
                On-cart battery % display
              </div>
            </div>

            <div className="hidden md:block absolute top-[45%] right-[25%]">
              <span className="flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
              </span>
              <div className="absolute top-6 right-0 bg-card border border-border p-3 w-48 rounded shadow-xl text-sm font-medium text-right">
                Hinged lockable storage compartments
              </div>
            </div>

            <div className="hidden md:block absolute top-[10%] left-[42%]">
              <span className="flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
              </span>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-card border border-border p-3 w-48 rounded shadow-xl text-sm font-medium text-center">
                Large tray with side rails + tie-down points
              </div>
            </div>

            <div className="hidden md:block absolute top-[18%] left-[8%]">
              <span className="flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
              </span>
              <div className="absolute top-6 left-0 bg-card border border-border p-3 w-44 rounded shadow-xl text-sm font-medium">
                LED mount points top &amp; bottom
              </div>
            </div>

            <div className="hidden md:block absolute bottom-[20%] left-[30%]">
              <span className="flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
              </span>
              <div className="absolute top-6 left-0 bg-card border border-border p-3 w-48 rounded shadow-xl text-sm font-medium">
                All-terrain wheels for rough ground
              </div>
            </div>

            <div className="hidden md:block absolute top-[32%] right-[32%]">
              <span className="flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive border-2 border-background"></span>
              </span>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-card border border-border p-3 w-40 rounded shadow-xl text-sm font-medium text-center">
                Emergency stop button
              </div>
            </div>

            <div className="hidden md:block absolute top-[5%] right-[20%]">
              <span className="flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
              </span>
              <div className="absolute top-6 right-0 bg-card border border-border p-3 w-48 rounded shadow-xl text-sm font-medium text-right">
                Push-or-drive handle with controls
              </div>
            </div>
          </div>

          {/* Stacked feature list — visible on small screens as a fallback for the overlaid callouts */}
          <ul className="md:hidden mt-8 grid grid-cols-1 gap-3 max-w-md mx-auto">
            {[
              "2 x AU 240V sockets + USB-C / USB-A charging",
              "On-cart battery % display",
              "Hinged lockable storage compartments",
              "Large tray with side rails + tie-down points",
              "LED mount points top & bottom",
              "All-terrain wheels for rough ground",
              "Emergency stop button",
              "Push-or-drive handle with controls",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 bg-card border border-border p-3 rounded text-sm font-medium">
                <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-primary"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 md:py-24 bg-card clip-angle-bottom">
        <div className="container mx-auto px-4 md:px-6 pb-6 md:pb-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Zap, title: "Power On Site", desc: "2 x AU 240V sockets + USB-C/USB-A, run lights, chargers, small power tools." },
              { icon: Truck, title: "Move More Gear", desc: "Large lockable tray + side rails, tie-down points, designed to move heavy loads across the site without throwing your back out." },
              { icon: Shield, title: "Lock It Up", desc: "Lockable storage compartments, secure your gear at smoko or overnight." },
              { icon: Mountain, title: "Built for Rough Ground", desc: "All-terrain wheels, made to handle dirt, gravel, mud and uneven slabs." },
              { icon: Play, title: "Push or Drive", desc: "Battery-powered drive mode plus a manual push handle, move full loads with one finger or walk it where you need it." },
              { icon: Settings, title: "Built to Customise", desc: "Modular mounts and add-on points so each trade configures it how they actually work." }
            ].map((f, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className="bg-background border-border h-full group hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-8">
                    <f.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold mb-3 uppercase">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Models Section */}
      <section id="models" className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Choose Your SITECART</h2>
            <p className="text-xl text-muted-foreground">Configured for exactly how you work.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Core Model */}
            <Card className="bg-card border-border flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black uppercase mb-2">Core</h3>
                <p className="text-muted-foreground mb-6">The standard SITECART build.</p>
                <div className="text-3xl font-bold mb-8">POA</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Standard battery</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>2x AU 240V Outlets</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Manual & Drive mode</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Standard storage</span></li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro Model */}
            <Card className="bg-background border-primary relative transform md:-translate-y-4 shadow-2xl shadow-primary/10 flex flex-col">
              <div className="absolute top-0 left-0 w-full bg-primary text-primary-foreground text-center py-1.5 text-sm font-bold uppercase tracking-wider">
                Recommended
              </div>
              <CardContent className="p-8 pt-12 flex-1 flex flex-col">
                <h3 className="text-2xl font-black uppercase mb-2">Pro</h3>
                <p className="text-muted-foreground mb-6">Core plus the most popular add-ons.</p>
                <div className="text-3xl font-bold mb-8 text-primary">POA</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Everything in Core</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Extended battery pack</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>LED jobsite lighting package</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Custom branding wrap</span></li>
                </ul>
              </CardContent>
            </Card>

            {/* Custom Model */}
            <Card className="bg-card border-border flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black uppercase mb-2">Custom</h3>
                <p className="text-muted-foreground mb-6">Fully spec'd to your site requirements.</p>
                <div className="text-3xl font-bold mb-8">POA</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Choose any add-on</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Custom storage racking</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Fleet management setup</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> <span>Dedicated account manager</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section id="addons" className="py-12 md:py-24 bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 md:mb-12 text-center">Optional Add-ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 max-w-5xl mx-auto">
            {[
              "Hydraulic lift tray",
              "LED jobsite lighting package",
              "Tablet / device station",
              "Mini fridge",
              "Microwave",
              "42\" TV mount (for site briefings / inductions)",
              "Extra battery pack",
              "Tool shelving and racking inserts",
              "Custom branding wrap",
              "GPS tracking",
              "Solar charging panel",
              "Fleet numbering and ID"
            ].map((addon, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50">
                <div className="w-2 h-2 bg-primary rotate-45 shrink-0"></div>
                <span className="text-sm md:text-base font-medium">{addon}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Who It's For */}
      <section id="audiences" className="py-12 md:py-24 bg-card clip-angle">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-12">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-8 md:mb-16 text-center">Built For Your Trade</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Builders & carpenters", desc: "Run saws and charge batteries right where you're cutting." },
              { title: "Electricians", desc: "A mobile wire-spool and termination station that goes anywhere." },
              { title: "Plumbers", desc: "Secure heavy fittings and expensive press tools." },
              { title: "Concreters", desc: "Drive heavy vibrators and tools across rough prep." },
              { title: "Landscapers", desc: "Move materials easily across mud and uneven ground." },
              { title: "Site managers", desc: "A mobile plan desk, briefing station, and TV mount." }
            ].map((t, i) => (
              <Card key={i} className="bg-background border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold uppercase mb-2 text-primary">{t.title}</h3>
                  <p className="text-muted-foreground">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section id="specs" className="py-12 md:py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-12">Standard Specifications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                {[
                  ["Dimensions (LxWxH)", "Approx. tradie-friendly footprint, fits through standard site gates"],
                  ["Drive", "Battery-powered drive mode + manual push handle"],
                  ["Power outlets", "2 x AU 240V"],
                  ["USB", "USB-C and USB-A"],
                  ["Battery indicator", "On-cart % display"],
                  ["Storage", "Lockable compartments + open tray with side rails"],
                  ["Wheels", "All-terrain"],
                  ["Safety", "Emergency stop button"],
                  ["Lighting mounts", "LED mount points top and bottom"],
                  ["Construction", "Heavy-duty steel frame and panels"]
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <th className="py-4 pr-6 font-bold uppercase tracking-wide whitespace-nowrap text-muted-foreground">{row[0]}</th>
                    <td className="py-4 font-medium">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Safety & Compliance */}
      <section id="safety" className="py-10 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <Shield className="w-10 h-10 mx-auto mb-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            SITECART is a concept product currently in development. The standard configuration is being designed for future Australian electrical and workplace safety compliance review. Final specifications, certifications and ratings will be confirmed prior to commercial release.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Built for Australian conditions</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Designed around AU 240V</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Lockable storage</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Emergency stop</li>
          </ul>
        </div>
      </section>

      {/* Early Access Form */}
      <section id="register" className="py-12 md:py-24 bg-card clip-angle-bottom">
        <div className="container mx-auto px-4 md:px-6 max-w-xl pb-8 md:pb-16">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Register Your Interest</h2>
            <p className="text-muted-foreground">Get on the prototype build list and we'll be in touch.</p>
          </div>
          <EarlyAccessForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border pt-10 pb-6 md:pt-16 md:pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
            <div className="text-center md:text-left">
              <img src={logoPrimary} alt="SITECART" className="h-8 mb-4 mx-auto md:mx-0" />
              <p className="font-bold uppercase tracking-widest text-primary">Built for site. Driven by you.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-medium uppercase tracking-wide">
              <button onClick={() => scrollTo("features")} className="hover:text-primary transition-colors">Features</button>
              <button onClick={() => scrollTo("models")} className="hover:text-primary transition-colors">Models</button>
              <button onClick={() => scrollTo("addons")} className="hover:text-primary transition-colors">Add-ons</button>
              <button onClick={() => scrollTo("roi")} className="hover:text-primary transition-colors">ROI</button>
              <button onClick={() => scrollTo("specs")} className="hover:text-primary transition-colors">Specs</button>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
            <p>SITECART is a concept product currently in development. Specifications, configurations and availability subject to change.</p>
            <p className="mt-2">&copy; {new Date().getFullYear()} SITECART. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

function ROICalculator() {
  const [minutes, setMinutes] = useState<number>(30);
  const [rate, setRate] = useState<number>(90);
  const [workers, setWorkers] = useState<number>(3);

  // Monthly wasted wages = (minutes lost per worker per day / 60) * hourly rate
  // * number of workers * working days per month. We use 20 working days/month
  // (a typical four-week month, four 5-day weeks) so that the brief's example
  // inputs of 30 min, $90/hr, 3 workers produce the headline figure of $2,700.
  const monthlySavings = Math.round((minutes / 60) * rate * workers * 20);

  return (
    <section id="roi" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">What Lost Time Actually Costs You</h2>
            <p className="text-xl text-muted-foreground mb-8">This is what you're paying workers to walk back to the ute every single day.</p>
            
            <div className="bg-primary/10 border border-primary/20 p-8 rounded-lg mb-8">
              <div className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Monthly Wasted Wages</div>
              <div className="text-6xl md:text-7xl font-black text-white">${monthlySavings.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-3">Based on 20 working days per month.</div>
            </div>
            
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 font-bold uppercase tracking-wide text-lg" onClick={() => {
              const el = document.getElementById("register");
              el?.scrollIntoView({ behavior: "smooth" });
            }}>
              Calculate My Site Savings
            </Button>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-bold uppercase">Minutes lost per worker / day</Label>
                    <span className="text-xl font-black text-primary">{minutes} min</span>
                  </div>
                  <Input 
                    type="range" 
                    min="5" 
                    max="120" 
                    step="5" 
                    value={minutes} 
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-full accent-primary" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-bold uppercase">Hourly Rate (AUD)</Label>
                    <span className="text-xl font-black text-primary">${rate}/hr</span>
                  </div>
                  <Input 
                    type="range" 
                    min="30" 
                    max="200" 
                    step="5" 
                    value={rate} 
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full accent-primary" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-bold uppercase">Number of workers</Label>
                    <span className="text-xl font-black text-primary">{workers}</span>
                  </div>
                  <Input 
                    type="range" 
                    min="1" 
                    max="20" 
                    step="1" 
                    value={workers} 
                    onChange={(e) => setWorkers(Number(e.target.value))}
                    className="w-full accent-primary" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

interface EarlyAccessFormValues {
  name: string;
  business: string;
  trade: string;
  location: string;
  phone: string;
  email: string;
  usage: string;
  model: "Core" | "Pro" | "Custom";
  // Honeypot — hidden from real users, filled in by dumb bots. The
  // server silently 200s when this is non-empty.
  company: string;
}

function EarlyAccessForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EarlyAccessFormValues>({
    defaultValues: { model: "Pro", company: "" },
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: submitSitecartLead,
    onSuccess: (response) => {
      const duplicate = response?.duplicate === true;
      setIsDuplicate(duplicate);
      setIsSuccess(true);
      setErrorMsg(null);
      reset();
      toast({
        title: duplicate ? "Already Registered" : "Interest Registered",
        description: duplicate
          ? "We've already got your details from a recent submission — we'll be in touch."
          : "Thanks. Your SITECART interest has been registered.",
      });
    },
    onError: (err: unknown) => {
      const status = err instanceof LeadSubmitError ? err.status : undefined;
      const apiMessage = err instanceof LeadSubmitError ? err.data?.error : undefined;
      const fallback =
        "We couldn't register your interest just now. Please try again in a moment.";
      if (status === 429) {
        setErrorMsg(
          "Too many submissions in a short time. Please wait a moment and try again.",
        );
      } else {
        setErrorMsg(apiMessage ?? fallback);
      }
    },
  });

  const onSubmit = (data: EarlyAccessFormValues) => {
    setErrorMsg(null);
    const useCase = data.usage?.trim();
    const payload: SitecartLeadRequest = {
      name: data.name.trim(),
      business: data.business.trim(),
      trade: data.trade.trim(),
      location: data.location.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      interestedModel: data.model ?? "Pro",
      ...(useCase ? { useCase } : {}),
      company: data.company,
    };
    submit.mutate(payload);
  };

  if (isSuccess) {
    return (
      <div className="bg-background border border-primary/30 p-12 text-center rounded-lg">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
          {isDuplicate ? "Already on the list." : "Thanks."}
        </h3>
        <p className="text-muted-foreground text-lg">
          {isDuplicate
            ? "We've already got your details from a recent registration — no need to submit again. We'll be in touch."
            : "Your SITECART interest has been registered."}
        </p>
        <Button
          variant="outline"
          className="mt-8 uppercase font-bold"
          onClick={() => {
            setIsSuccess(false);
            setIsDuplicate(false);
          }}
        >
          Submit Another
        </Button>
      </div>
    );
  }

  const isSubmitting = submit.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot — hidden from real users, visible to dumb bots */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor="sitecart-company">Company (leave blank)</label>
        <input
          id="sitecart-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name", { required: true })} className="bg-background border-border focus-visible:ring-primary h-12" />
          {errors.name && <span className="text-destructive text-sm font-medium">Required</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="business">Business / Company</Label>
          <Input id="business" {...register("business", { required: true })} className="bg-background border-border focus-visible:ring-primary h-12" />
          {errors.business && <span className="text-destructive text-sm font-medium">Required</span>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="trade">Trade</Label>
          <Input id="trade" {...register("trade", { required: true })} className="bg-background border-border focus-visible:ring-primary h-12" />
          {errors.trade && <span className="text-destructive text-sm font-medium">Required</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Site Location (Suburb / State)</Label>
          <Input id="location" {...register("location", { required: true })} className="bg-background border-border focus-visible:ring-primary h-12" />
          {errors.location && <span className="text-destructive text-sm font-medium">Required</span>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register("phone", { required: true })} className="bg-background border-border focus-visible:ring-primary h-12" />
          {errors.phone && <span className="text-destructive text-sm font-medium">Required</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email", { required: true })} className="bg-background border-border focus-visible:ring-primary h-12" />
          {errors.email && <span className="text-destructive text-sm font-medium">Required</span>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="usage">How would you use SITECART?</Label>
        <Textarea id="usage" {...register("usage")} className="bg-background border-border focus-visible:ring-primary min-h-[100px] resize-y" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Interested Model</Label>
        <select 
          id="model" 
          {...register("model")} 
          className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Pro">Pro (Recommended)</option>
          <option value="Core">Core</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      {errorMsg && (
        <div
          role="alert"
          aria-live="polite"
          className="border border-destructive/40 bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded"
        >
          {errorMsg}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold uppercase tracking-widest">
        {isSubmitting ? "Submitting..." : "Submit Registration"}
      </Button>
    </form>
  );
}
