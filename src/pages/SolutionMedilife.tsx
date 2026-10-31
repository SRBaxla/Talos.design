import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, Globe, Layers, Zap, ShieldCheck,
    Clock, TrendingUp, ExternalLink,
    AlertTriangle, CheckSquare, Sparkles, ArrowRight
} from 'lucide-react';
import MedilifeClinicDemo from '../components/medilife/MedilifeClinicDemo';

const PLATFORM_CAPABILITIES = [
    { value: 'Instant', label: 'WhatsApp PDF Report Dispatch', icon: Clock, color: 'text-amber-400' },
    { value: 'Verified', label: 'Pathologist Peer Review Gate', icon: ShieldCheck, color: 'text-emerald-400' },
    { value: '100% Direct', label: 'Zero Aggregator Commissions', icon: Zap, color: 'text-sky-400' }
];

const COMPARISONS = [
    {
        problemTitle: 'Manual Report Typing',
        problemDesc: 'Manual data entry causes diagnostic typos & slow turnaround.',
        solutionTitle: 'Pathologist Peer Review',
        solutionDesc: 'Structured parameter entry with mandatory doctor verification.'
    },
    {
        problemTitle: 'Endless Status Phone Calls',
        problemDesc: 'Receptionists spend hours answering "Is my report ready?".',
        solutionTitle: '1-Click WhatsApp PDF',
        solutionDesc: 'Instant PDF report delivery straight to patient WhatsApp.'
    },
    {
        problemTitle: 'Aggregator Margin Theft',
        problemDesc: 'Paying 25-40% commission to central booking apps.',
        solutionTitle: '100% Direct Margins',
        solutionDesc: 'Patients book directly on your lab’s branded website storefront.'
    }
];

export default function SolutionMedilife() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeDrawerTab, setActiveDrawerTab] = useState<'architecture' | 'hardware' | 'capabilities'>('architecture');

    return (
        <div className="container py-12 flex flex-col flex-grow">
            {/* Back Navigation */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <Link to="/solutions" className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft size={14} /> Back to Solutions
                </Link>
            </motion.div>

            {/* Crisp Hero Section */}
            <div className="mb-12">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="badge font-mono text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        <Sparkles size={12} className="animate-pulse" /> REFERENCE BUILD — DIAGNOSTIC CLINIC PLATFORM
                    </span>
                </div>

                <h1 className="text-3xl md:text-6xl font-display font-bold tracking-tight uppercase leading-[0.98] mb-4">
                    Diagnostic Lab &amp; <span className="text-gradient-orange">Patient Report Platform.</span>
                </h1>

                <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-6">
                    Pre-built diagnostic clinic software platform engineered by TALOS.DESIGN. Deployable to your laboratory with custom domain branding, pathologist verification, instant WhatsApp PDF delivery, and ongoing technical support.
                </p>

                {/* Hero Actions */}
                <div className="flex flex-wrap items-center gap-4">
                    <a
                        href="https://medlife-three.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-xl bg-[var(--accent-orange)] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    >
                        Launch Live Demo Portal <ExternalLink size={14} />
                    </a>
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="px-5 py-3 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-[var(--border-color)] transition-all"
                    >
                        <Layers size={14} /> Tech Specs Drawer
                    </button>
                    <Link
                        to="/contact"
                        state={{
                            bundleType: 'MediLife Diagnostic Clinic Platform',
                            estimatedValue: 'Custom Clinic Deployment',
                            modules: ['Branded Storefront', 'Pathologist Peer Review', 'WhatsApp PDF Dispatch', 'Ongoing IT & Platform Support']
                        }}
                        className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-emerald-600 shadow-md transition-all"
                    >
                        Deploy For Your Clinic <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Live Demo Credentials Component */}
            <div className="mb-12">
                <MedilifeClinicDemo />
            </div>

            {/* Sleek Stats Strip */}
            <div className="mb-12 p-6 rounded-2xl glass-panel border border-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {PLATFORM_CAPABILITIES.map((m) => (
                    <div key={m.label} className="flex flex-col items-center">
                        <div className={`text-3xl md:text-4xl font-black font-mono tracking-tight ${m.color} mb-1 flex items-center gap-2`}>
                            <m.icon size={20} />
                            {m.value}
                        </div>
                        <div className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">{m.label}</div>
                    </div>
                ))}
            </div>

            {/* Scannable Problem vs Solution Matrix */}
            <div className="mb-16">
                <div className="text-center max-w-xl mx-auto mb-10">
                    <span className="badge font-mono text-xs text-[var(--accent-orange)] border border-[var(--accent-orange)]/30 bg-[var(--accent-orange)]/10 px-3 py-1 rounded-full uppercase tracking-widest font-bold inline-block mb-3">
                        Operational Impact
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                        Legacy Problems <span className="text-[var(--text-muted)] font-normal">vs</span> <span className="text-gradient-orange">MediLife Solution</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {COMPARISONS.map((c, i) => (
                        <div 
                            key={i} 
                            className="glass-panel p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface-elevated)] flex flex-col justify-between hover:border-[var(--accent-orange)]/30 transition-all duration-300 shadow-lg group"
                        >
                            {/* Problem Block */}
                            <div className="space-y-3 pb-6 border-b border-[var(--border-color)]">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <AlertTriangle size={12} /> LEGACY BOTTLENECK
                                    </span>
                                    <span className="text-[10px] font-mono text-[var(--text-muted)]">0{i + 1}</span>
                                </div>
                                <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
                                    {c.problemTitle}
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    {c.problemDesc}
                                </p>
                            </div>

                            {/* Transformation Badge Indicator */}
                            <div className="my-4 flex items-center gap-3 justify-center">
                                <div className="h-px bg-[var(--border-color)] flex-grow" />
                                <span className="px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[9px] font-mono text-[var(--accent-cyan)] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                    <Sparkles size={10} className="animate-pulse" /> Solved by MediLife
                                </span>
                                <div className="h-px bg-[var(--border-color)] flex-grow" />
                            </div>

                            {/* Solution Block */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <CheckSquare size={12} /> MEDILIFE SYSTEM
                                    </span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                                <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
                                    {c.solutionTitle}
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                                    {c.solutionDesc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Crisp Core Features */}
            <div className="mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                        <Globe size={20} className="text-[var(--accent-orange)] mb-3" />
                        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Branded Storefront</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Your lab's custom website for online test booking under your domain.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                        <ShieldCheck size={20} className="text-emerald-500 mb-3" />
                        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Pathologist Peer Review</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Mandatory senior doctor verification before releasing reports.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                        <Zap size={20} className="text-[var(--accent-cyan)] mb-3" />
                        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">WhatsApp PDF Dispatch</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Instant NABL PDF delivery straight to patient WhatsApp inbox.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                        <TrendingUp size={20} className="text-purple-500 mb-3" />
                        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Patient Retention</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Automated reminders for 3-month and 6-month blood test follow-ups.</p>
                    </div>
                </div>
            </div>

            {/* Turnkey Deployment Callout Banner */}
            <div className="mb-12 p-8 rounded-2xl glass-panel border border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">TURNKEY CLINICAL SOFTWARE DEPLOYMENT</span>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-[var(--text-primary)] mt-1">Deploy MediLife for Your Diagnostic Practice</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">We handle domain setup, test catalog migration, analyzer machine data parser connectivity, and ongoing infrastructure maintenance.</p>
                </div>
                <Link
                    to="/contact"
                    state={{
                        bundleType: 'MediLife Diagnostic Clinic Platform',
                        estimatedValue: 'Custom Clinic Deployment',
                        modules: ['Branded Storefront', 'Pathologist Peer Review', 'WhatsApp PDF Dispatch', 'Ongoing IT & Platform Support']
                    }}
                    className="btn btn-primary whitespace-nowrap px-6 py-3 text-xs uppercase tracking-wider font-bold shrink-0 flex items-center gap-2"
                >
                    Deploy MediLife Platform <ArrowRight size={14} />
                </Link>
            </div>

            {/* Slide-over Architecture Drawer Modal */}
            <AnimatePresence>
                {drawerOpen && (
                    <div
                        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex justify-end overflow-hidden"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-xl h-full border-l border-[var(--border-color)] bg-[var(--bg-surface)] p-8 overflow-y-auto flex flex-col justify-between shadow-2xl text-[var(--text-primary)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                                    <div>
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-orange)] font-bold">Medilife Technical Specifications</span>
                                        <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[var(--text-primary)]">System Specs & Hardware Interface</h3>
                                    </div>
                                    <button onClick={() => setDrawerOpen(false)} className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-xs font-bold uppercase text-[var(--text-primary)] border border-[var(--border-color)]">
                                        Close
                                    </button>
                                </div>

                                <div className="flex gap-2 bg-[var(--bg-surface-elevated)] p-1 rounded-xl border border-[var(--border-color)] font-mono text-xs">
                                    <button onClick={() => setActiveDrawerTab('architecture')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDrawerTab === 'architecture' ? 'bg-[var(--accent-orange)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                        System Topology
                                    </button>
                                    <button onClick={() => setActiveDrawerTab('hardware')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDrawerTab === 'hardware' ? 'bg-[var(--accent-cyan)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                        Hardware Bridge
                                    </button>
                                    <button onClick={() => setActiveDrawerTab('capabilities')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDrawerTab === 'capabilities' ? 'bg-emerald-600 text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                        Key Highlights
                                    </button>
                                </div>

                                {activeDrawerTab === 'architecture' && (
                                    <div className="space-y-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                                        <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-1">
                                            <div className="font-mono uppercase font-bold text-[var(--text-primary)]">Database Row Level Security (RLS)</div>
                                            <p className="text-[var(--text-secondary)]">Enforces strict tenant data segregation across all lab reports, patient profiles, and staff accounts in PostgreSQL.</p>
                                        </div>
                                    </div>
                                )}

                                {activeDrawerTab === 'hardware' && (
                                    <div className="space-y-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                                        <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-1">
                                            <div className="font-mono uppercase font-bold text-[var(--accent-cyan)]">ASTM / HL7 Automatic Machine Parser</div>
                                            <p className="text-[var(--text-secondary)]">Ingests raw output strings from local analyzer machines, mapping parameter ranges automatically.</p>
                                        </div>
                                    </div>
                                )}

                                {activeDrawerTab === 'capabilities' && (
                                    <div className="space-y-3">
                                        {PLATFORM_CAPABILITIES.map((m) => (
                                            <div key={m.label} className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                                                <div className="text-lg font-bold font-mono text-emerald-500">{m.value}</div>
                                                <div className="text-xs font-bold text-[var(--text-primary)] uppercase">{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center">
                                <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">MEDILIFE CLINIC EDITION</span>
                                <a href="https://medlife-three.vercel.app/" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-[var(--accent-orange)] text-white font-bold text-xs uppercase tracking-wider">
                                    Launch Live Portal →
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
