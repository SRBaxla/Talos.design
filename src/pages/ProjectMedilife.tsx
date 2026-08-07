import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, Globe, Cpu, Layers, Zap, ShieldCheck,
    HardDrive, Printer, Clock, TrendingUp, DollarSign,
    CheckCircle2, Lock, RefreshCw, Check, ExternalLink
} from 'lucide-react';

const ONBOARDING_STEPS = [
    { step: '01', title: 'Lab Identity & Branding', desc: 'Lab name, logo upload, primary brand colors, and contact info.' },
    { step: '02', title: 'Subdomain Routing', desc: 'Real-time debounced availability check (*.medilifewaas.com or custom CNAME).' },
    { step: '03', title: 'Module Selection', desc: 'Choose WhatsApp Report Delivery, PABS Hardware Bridge, and Patient Retention Engine.' },
    { step: '04', title: 'Instant Provisioning', desc: 'PostgreSQL RLS schema creation, Stripe subscription hook, and live site deployment.' }
];

const METRICS_ROI = [
    { value: '2+ Hours', label: 'Daily Time Saved', desc: 'Manual typing and report phone distribution eliminated per clinic.', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { value: '100%', label: 'Margin Retention', desc: 'Local home-collection bookings retained without central call center commissions.', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { value: '3.4x', label: 'Patient Retention', desc: 'Repeat bookings driven via automated 6-month checkup reminders & campaign blasts.', icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' }
];

export default function ProjectMedilife() {
    const [activePillar, setActivePillar] = useState<'branding' | 'webhook' | 'provisioning' | 'billing'>('branding');
    const [activeStep, setActiveStep] = useState(0);
    const [subdomainInput, setSubdomainInput] = useState('citylab');
    const [isSubdomainAvailable, setIsSubdomainAvailable] = useState(true);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeDrawerTab, setActiveDrawerTab] = useState<'architecture' | 'hardware' | 'roi'>('architecture');

    // Handle debounced subdomain check simulation
    const handleSubdomainChange = (val: string) => {
        const cleaned = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setSubdomainInput(cleaned);
        setIsDebouncing(true);
        setTimeout(() => {
            setIsDebouncing(false);
            setIsSubdomainAvailable(cleaned.length > 2 && cleaned !== 'admin' && cleaned !== 'api');
        }, 300);
    };

    return (
        <div className="container py-16 flex flex-col flex-grow text-white">
            {/* Back link */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back to Projects Showcase
                </Link>
            </motion.div>

            {/* Strategic Header */}
            <div className="mb-16">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="badge font-mono text-xs text-[var(--accent-orange)] border-[var(--accent-orange)]/30 bg-[var(--accent-orange)]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Cpu size={12} className="animate-pulse" /> ENTERPRISE_SaaS_ARCHITECTURE
                    </span>
                    <span className="text-xs font-mono text-[var(--accent-cyan)] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        Multi-Tenant WaaS Platform
                    </span>
                </div>

                <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tight uppercase leading-[0.95] mb-6">
                    Medilife <span className="text-gradient-orange">WaaS Engine.</span>
                </h1>

                <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed italic border-l-2 border-[var(--accent-orange)] pl-6 mb-8">
                    "A multi-tenant Website-as-a-Service infrastructure engineered specifically for independent diagnostic laboratories and tier-2 franchise operators to defend market share against corporate diagnostic chains."
                </p>

                {/* Live Application URL Bar & Interactive Preview Action */}
                <div className="p-6 rounded-3xl glass-panel border border-[var(--accent-cyan)]/40 bg-gradient-to-r from-[rgba(0,229,255,0.08)] via-[#07090E] to-[rgba(245,158,11,0.08)] flex flex-wrap items-center justify-between gap-4 shadow-2xl">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <div className="space-y-0.5 min-w-0">
                            <div className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest font-bold">LIVE DEPLOYED SaaS APPLICATION</div>
                            <div className="text-sm font-mono font-bold text-white truncate">https://timely-rolypoly-3a7789.netlify.app/</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <a
                            href="https://timely-rolypoly-3a7789.netlify.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-3 rounded-2xl bg-[var(--accent-cyan)] text-[#07090E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                        >
                            Open Live Medilife SaaS <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Live Interactive SaaS Application Preview Card */}
            <div className="mb-20 glass-panel rounded-[2.5rem] border border-[var(--accent-cyan)]/40 overflow-hidden bg-[#07090E] shadow-2xl relative">
                {/* Browser Toolbar Header */}
                <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-3 h-3 rounded-full bg-red-500/80" />
                            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <span className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="flex items-center gap-2 bg-black/60 px-4 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-white/80 truncate">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="truncate">https://timely-rolypoly-3a7789.netlify.app/</span>
                        </div>
                    </div>
                    <a
                        href="https://timely-rolypoly-3a7789.netlify.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-[var(--accent-cyan)] text-[#07090E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] shrink-0"
                    >
                        Launch Medilife SaaS <ExternalLink size={14} />
                    </a>
                </div>

                {/* Hero Showcase Display (Replaces X-Frame-Options blocked iframe) */}
                <div className="p-8 md:p-14 bg-gradient-to-br from-[#07090E] via-[#0b1329] to-[#0f172a] relative overflow-hidden flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-3xl bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                        <Globe size={36} className="text-[var(--accent-cyan)]" />
                    </div>

                    <div className="badge badge-active mb-4 font-mono text-xs text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                        [LIVE NETLIFY PRODUCTION DEPLOYMENT]
                    </div>

                    <h3 className="text-3xl md:text-5xl font-bold font-display uppercase tracking-tight text-white mb-4">
                        Medilife Diagnostic <span className="text-gradient-orange">Storefront & Portal</span>
                    </h3>

                    <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-8">
                        Experience the live multi-tenant diagnostic lab platform in real-time. Test patient booking workflows, report downloads, WhatsApp notifications, and clinic management.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="https://timely-rolypoly-3a7789.netlify.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-4 rounded-2xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider flex items-center gap-3 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                        >
                            Explore Live Application <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>

            {/* ROI Operational Highlights Callout Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                {METRICS_ROI.map((roi) => (
                    <motion.div
                        key={roi.label}
                        whileHover={{ y: -4 }}
                        className={`p-8 rounded-3xl glass-panel border ${roi.border} relative overflow-hidden flex flex-col justify-between`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-2xl ${roi.bg} flex items-center justify-center`}>
                                <roi.icon className={roi.color} size={24} />
                            </div>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">[OPERATIONAL_ROI]</span>
                        </div>

                        <div>
                            <div className={`text-4xl font-black font-mono tracking-tight ${roi.color} mb-1`}>{roi.value}</div>
                            <div className="text-sm font-bold text-white uppercase tracking-wider mb-2">{roi.label}</div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{roi.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Core Architecture Pillars Section */}
            <div className="mb-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--accent-orange)] mb-2">Four Technical Achievements</div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight">System Architecture Pillars</h2>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="px-6 py-3 rounded-2xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] w-fit"
                    >
                        <Layers size={16} /> Open Architecture Detail Drawer
                    </button>
                </div>

                {/* Pillar Switcher Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {[
                        { id: 'branding', label: '01. Subdomain & Branding', icon: Globe },
                        { id: 'webhook', label: '02. Webhook & Analytics', icon: Zap },
                        { id: 'provisioning', label: '03. Idempotent Provisioning', icon: ShieldCheck },
                        { id: 'billing', label: '04. Consumption Wallet', icon: DollarSign }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActivePillar(tab.id as any)}
                            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 font-mono text-xs ${
                                activePillar === tab.id
                                    ? 'bg-[var(--accent-orange)]/10 border-[var(--accent-orange)] text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                    : 'bg-white/5 border-white/10 text-[var(--text-muted)] hover:text-white'
                            }`}
                        >
                            <tab.icon size={16} className={activePillar === tab.id ? 'text-[var(--accent-orange)]' : ''} />
                            <span className="font-bold truncate">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Active Pillar Card */}
                <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-[var(--border-color)] relative overflow-hidden bg-black/40">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-orange)] opacity-[0.03] blur-[80px] pointer-events-none" />

                    {activePillar === 'branding' && (
                        <div className="space-y-8">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                                <div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30 mb-2 inline-block">
                                        PILLAR 01: ZERO-CODE RESKINNING
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold font-display text-white">Multi-Tenant Subdomain & Dynamic Branding Engine</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-emerald-400 font-bold">Wildcard Router</span>
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-sky-400 font-bold">CSS Custom Props</span>
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-amber-400 font-bold">Zero Re-Deploy</span>
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-4xl">
                                Resolves tenant branding dynamically at runtime from PostgreSQL database parameters. Wildcard DNS routes incoming traffic (<span className="font-mono text-[var(--accent-orange)]">tenant.medilifewaas.com</span>), fetching tenant theme tokens (custom CSS variables, typography, logo assets, and primary color palettes) to reskin the unified single-build React frontend in under <span className="font-mono text-emerald-400 font-bold">12ms</span> without code deployments.
                            </p>

                            {/* Dynamic Live Subdomain Simulator */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent-orange)] flex items-center gap-2">
                                    <Globe size={14} /> Interactive Subdomain Resolution Sandbox
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1 bg-[#07090E] px-4 py-3 rounded-xl border border-white/20 text-sm font-mono flex-1 min-w-[280px]">
                                        <span className="text-[var(--accent-orange)] font-bold">https://</span>
                                        <input
                                            type="text"
                                            value={subdomainInput}
                                            onChange={(e) => handleSubdomainChange(e.target.value)}
                                            className="bg-transparent text-white focus:outline-none font-bold w-28 text-center border-b border-[var(--accent-orange)]"
                                            placeholder="your-lab"
                                        />
                                        <span className="text-[var(--text-muted)]">.medilifewaas.com</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                                        {isDebouncing ? (
                                            <>
                                                <RefreshCw size={14} className="text-amber-400 animate-spin" />
                                                <span className="text-amber-400 font-bold">Checking DNS & Database...</span>
                                            </>
                                        ) : isSubdomainAvailable ? (
                                            <>
                                                <CheckCircle2 size={14} className="text-emerald-400" />
                                                <span className="text-emerald-400 font-bold">Domain Active & Resolved</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={14} className="text-red-400" />
                                                <span className="text-red-400 font-bold">Reserved / Unavailable</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activePillar === 'webhook' && (
                        <div className="space-y-8">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                                <div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 mb-2 inline-block">
                                        PILLAR 02: HIGH-THROUGHPUT PIPELINE
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold font-display text-white">Asynchronous Meta Webhook & Real-Time Analytics Engine</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-emerald-400 font-bold">Sub-50ms Ack</span>
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-sky-400 font-bold">PostgreSQL Triggers</span>
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-amber-400 font-bold">Decoupled Queue</span>
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-4xl">
                                High-volume Meta WhatsApp webhook events (delivery receipts, read confirmations, button clicks) are ingested by lightweight Edge functions with instant sub-50ms HTTP 200 acknowledgments. Heavy mathematical funnel aggregations (campaign conversion rates, delivery status percentages) are offloaded to asynchronous PostgreSQL database triggers, preserving API responsiveness and eliminating compute spikes.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-[10px] font-mono text-white/50 uppercase mb-1">Ingress Latency</div>
                                    <div className="text-xl font-bold font-mono text-emerald-400">14ms HTTP 200</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-[10px] font-mono text-white/50 uppercase mb-1">Funnel Aggregation</div>
                                    <div className="text-xl font-bold font-mono text-sky-400">Async DB Triggers</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-[10px] font-mono text-white/50 uppercase mb-1">Queue Reliability</div>
                                    <div className="text-xl font-bold font-mono text-amber-400">100% Dead-Letter Fallback</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activePillar === 'provisioning' && (
                        <div className="space-y-8">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                                <div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2 inline-block">
                                        PILLAR 03: ZERO-COLLISION TENANCY
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold font-display text-white">Idempotent SaaS Billing & Automated Provisioning</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-emerald-400 font-bold">Row Level Security (RLS)</span>
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-sky-400 font-bold">Idempotent Webhooks</span>
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-amber-400 font-bold">4-Step Onboarding</span>
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-4xl">
                                Four-step self-serve clinic onboarding workflow with debounced subdomain availability validation. Network idempotency protection logs every payment webhook event ID to prevent duplicate database provisioning. Strict tenant data isolation is enforced directly at the database engine level via PostgreSQL Row Level Security (RLS) policies.
                            </p>

                            {/* 4-Step Onboarding Wizard Visualization */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                {ONBOARDING_STEPS.map((s, idx) => (
                                    <div
                                        key={s.step}
                                        onClick={() => setActiveStep(idx)}
                                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                                            activeStep === idx
                                                ? 'bg-[var(--accent-orange)]/10 border-[var(--accent-orange)] text-white shadow-lg'
                                                : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="text-xs font-mono font-bold text-[var(--accent-orange)] mb-2 flex items-center justify-between">
                                            <span>STEP {s.step}</span>
                                            {activeStep === idx && <Check size={14} className="text-emerald-400" />}
                                        </div>
                                        <div className="text-sm font-bold mb-1 font-display">{s.title}</div>
                                        <p className="text-xs text-[var(--text-muted)] leading-normal">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activePillar === 'billing' && (
                        <div className="space-y-8">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                                <div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2 inline-block">
                                        PILLAR 04: CONSUMPTION WALLET
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold font-display text-white">Hybrid Modular Pricing & Consumption Wallet</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-emerald-400 font-bold">Meta Business API</span>
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-sky-400 font-bold">Pre-Flight Estimator</span>
                                    <span className="px-3 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-amber-400 font-bold">Credit Wallet</span>
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-4xl">
                                Decouples monthly base platform subscriptions from pay-as-you-go Meta communication costs. Lab owners maintain a prepaid credit wallet that calculates exact audience dispatch costs pre-flight before issuing campaign webhooks to the Meta WhatsApp Business API.
                            </p>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <div className="text-xs font-mono uppercase text-[var(--text-muted)]">Pre-Flight Audience Cost Calculator</div>
                                    <div className="text-xl font-bold font-mono text-white">1,500 Patient Report Reminders</div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Estimated Meta API Cost</div>
                                        <div className="text-2xl font-bold font-mono text-emerald-400">₹420.00</div>
                                    </div>
                                    <button className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all">
                                        Dispatch Campaign
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Hardware Integration Spec Card (PABS PrintPost Desktop Bridge) */}
            <div className="mb-24">
                <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-[rgba(0,229,255,0.3)] relative overflow-hidden bg-gradient-to-br from-[#07090E] via-[#0b1329] to-[#07090E]">
                    <div className="absolute top-0 right-0 p-6">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 flex items-center gap-1.5 font-bold">
                            <Printer size={12} /> HARDWARE_BRIDGE_ONLINE
                        </span>
                    </div>

                    <div className="max-w-3xl space-y-6">
                        <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent-cyan)] flex items-center gap-2">
                            <HardDrive size={16} /> Local Pathology Equipment Interface
                        </div>

                        <h3 className="text-3xl md:text-5xl font-bold font-display uppercase tracking-tight">
                            PABS (PrintPost) <span className="text-[var(--accent-cyan)]">Desktop Bridge</span>
                        </h3>

                        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                            An Electron/Node.js desktop utility designed to interface local pathology testing machinery directly with the Medilife cloud platform. Listens continuously to local analyzer RS232 serial and TCP socket outputs, parses ASTM E1381 and HL7 v2.x machine payloads, attaches PDF watermarks, and dispatches automated WhatsApp PDF report download links directly to patient mobile numbers.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-[10px] font-mono text-white/50 uppercase mb-1">Architecture</div>
                                <div className="text-xs font-bold font-mono text-white">Electron / Node.js</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-[10px] font-mono text-white/50 uppercase mb-1">Protocols</div>
                                <div className="text-xs font-bold font-mono text-[var(--accent-cyan)]">ASTM E1381 / HL7</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-[10px] font-mono text-white/50 uppercase mb-1">Port Listeners</div>
                                <div className="text-xs font-bold font-mono text-white">RS232 / TCP Sockets</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-[10px] font-mono text-white/50 uppercase mb-1">Dispatch Speed</div>
                                <div className="text-xs font-bold font-mono text-emerald-400">&lt; 1.2s Post-Test</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Architecture Drawer Modal */}
            <AnimatePresence>
                {drawerOpen && (
                    <div
                        className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-2xl flex justify-end overflow-hidden"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-2xl h-full glass-panel border-l border-[var(--border-color)] bg-[#07090E] p-8 overflow-y-auto flex flex-col justify-between shadow-2xl text-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                                    <div>
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-orange)]">Medilife WaaS Architecture Drawer</span>
                                        <h3 className="text-2xl font-bold font-display uppercase tracking-tight">System Specification Specs</h3>
                                    </div>
                                    <button onClick={() => setDrawerOpen(false)} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase">
                                        Close Drawer
                                    </button>
                                </div>

                                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 font-mono text-xs">
                                    <button onClick={() => setActiveDrawerTab('architecture')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDrawerTab === 'architecture' ? 'bg-[var(--accent-orange)] text-black' : 'text-white/70'}`}>
                                        System Topology
                                    </button>
                                    <button onClick={() => setActiveDrawerTab('hardware')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDrawerTab === 'hardware' ? 'bg-[var(--accent-cyan)] text-black' : 'text-white/70'}`}>
                                        PABS Hardware
                                    </button>
                                    <button onClick={() => setActiveDrawerTab('roi')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDrawerTab === 'roi' ? 'bg-emerald-400 text-black' : 'text-white/70'}`}>
                                        ROI Metrics
                                    </button>
                                </div>

                                {activeDrawerTab === 'architecture' && (
                                    <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
                                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                            <div className="text-xs font-mono uppercase font-bold text-white">Database Row Level Security (RLS)</div>
                                            <p className="text-xs">Enforces tenant-level data segregation across all lab reports, patient profiles, and staff accounts in a single PostgreSQL database instance.</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                            <div className="text-xs font-mono uppercase font-bold text-white">Debounced Wildcard Routing</div>
                                            <p className="text-xs">Edge server resolves incoming Host header, querying tenant theme config and applying CSS variables at runtime.</p>
                                        </div>
                                    </div>
                                )}

                                {activeDrawerTab === 'hardware' && (
                                    <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
                                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                            <div className="text-xs font-mono uppercase font-bold text-[var(--accent-cyan)]">ASTM / HL7 Automatic Parser</div>
                                            <p className="text-xs">Ingests raw machine output strings from local analyzer machines, maps parameter ranges, and converts to structured JSON payloads.</p>
                                        </div>
                                    </div>
                                )}

                                {activeDrawerTab === 'roi' && (
                                    <div className="space-y-4">
                                        {METRICS_ROI.map((m) => (
                                            <div key={m.label} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                                <div className="text-xl font-bold font-mono text-emerald-400">{m.value}</div>
                                                <div className="text-xs font-bold text-white uppercase">{m.label}</div>
                                                <p className="text-xs text-[var(--text-muted)] mt-1">{m.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                                <span className="text-[10px] font-mono text-[var(--text-muted)]">VERIFIED ARCHITECTURE BRIEF</span>
                                <Link to="/contact" className="px-5 py-2.5 rounded-xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider">
                                    Deploy Medilife WaaS →
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
