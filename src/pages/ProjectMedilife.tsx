import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, Globe, Layers, Zap, ShieldCheck,
    Clock, TrendingUp, ExternalLink,
    AlertTriangle, CheckSquare, PhoneOff, Sparkles, ArrowRight
} from 'lucide-react';
import MedilifeClinicDemo from '../components/medilife/MedilifeClinicDemo';

const METRICS_ROI = [
    { value: '2+ Hours', label: 'Daily Time Saved', icon: Clock, color: 'text-amber-400' },
    { value: '80% Drop', label: 'In Status Phone Calls', icon: PhoneOff, color: 'text-emerald-400' },
    { value: '3.4x Higher', label: 'Patient Retention', icon: TrendingUp, color: 'text-sky-400' }
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

export default function ProjectMedilife() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeDrawerTab, setActiveDrawerTab] = useState<'architecture' | 'hardware' | 'roi'>('architecture');

    return (
        <div className="container py-12 flex flex-col flex-grow text-white">
            {/* Back Navigation */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Back to Projects Showcase
                </Link>
            </motion.div>

            {/* Crisp Hero Section */}
            <div className="mb-12">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="badge font-mono text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        <Sparkles size={12} className="animate-pulse" /> DEMO READY — DIAGNOSTIC CLINIC PLATFORM
                    </span>
                </div>

                <h1 className="text-3xl md:text-6xl font-display font-bold tracking-tight uppercase leading-[0.98] mb-4">
                    Transform Your Lab Into a <span className="text-gradient-orange">Digital Powerhouse.</span>
                </h1>

                <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-6">
                    Branded online test booking, pathologist peer-reviewed reports, and instant 1-click WhatsApp PDF delivery.
                </p>

                {/* Hero Actions */}
                <div className="flex flex-wrap items-center gap-4">
                    <a
                        href="https://timely-rolypoly-3a7789.netlify.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    >
                        Launch Live Demo Portal <ExternalLink size={14} />
                    </a>
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/10 transition-all"
                    >
                        <Layers size={14} /> Tech Specs Drawer
                    </button>
                </div>
            </div>

            {/* Live Demo Credentials Component */}
            <div className="mb-12">
                <MedilifeClinicDemo />
            </div>

            {/* Sleek Stats Strip */}
            <div className="mb-12 p-6 rounded-2xl glass-panel border border-white/10 bg-black/40 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {METRICS_ROI.map((m) => (
                    <div key={m.label} className="flex flex-col items-center">
                        <div className={`text-3xl md:text-4xl font-black font-mono tracking-tight ${m.color} mb-1 flex items-center gap-2`}>
                            <m.icon size={20} />
                            {m.value}
                        </div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">{m.label}</div>
                    </div>
                ))}
            </div>

            {/* Scannable Problem vs Solution Matrix */}
            <div className="mb-12">
                <div className="text-center max-w-xl mx-auto mb-8">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--accent-orange)] font-bold">Why Labs Upgrade</span>
                    <h2 className="text-2xl md:text-4xl font-display font-bold uppercase tracking-tight text-white mt-1">
                        Problem vs Medilife Solution
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {COMPARISONS.map((c, i) => (
                        <div key={i} className="p-6 rounded-2xl glass-panel border border-white/10 bg-[#0E131F]/60 flex flex-col justify-between space-y-4">
                            {/* Problem */}
                            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-1">
                                <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                                    <AlertTriangle size={14} /> {c.problemTitle}
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-normal">{c.problemDesc}</p>
                            </div>

                            <div className="flex justify-center text-[var(--accent-cyan)]">
                                <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                            </div>

                            {/* Solution */}
                            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                    <CheckSquare size={14} /> {c.solutionTitle}
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-normal">{c.solutionDesc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Crisp Core Features */}
            <div className="mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <Globe size={20} className="text-[var(--accent-orange)] mb-3" />
                        <h3 className="text-sm font-bold text-white mb-1">Branded Storefront</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Your lab's custom website for online test booking under your domain.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <ShieldCheck size={20} className="text-emerald-400 mb-3" />
                        <h3 className="text-sm font-bold text-white mb-1">Pathologist Peer Review</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Mandatory senior doctor verification before releasing reports.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <Zap size={20} className="text-[var(--accent-cyan)] mb-3" />
                        <h3 className="text-sm font-bold text-white mb-1">WhatsApp PDF Dispatch</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Instant NABL PDF delivery straight to patient WhatsApp inbox.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <TrendingUp size={20} className="text-purple-400 mb-3" />
                        <h3 className="text-sm font-bold text-white mb-1">Patient Retention</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Automated reminders for 3-month and 6-month blood test follow-ups.</p>
                    </div>
                </div>
            </div>

            {/* Slide-over Architecture Drawer Modal */}
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
                            className="w-full max-w-xl h-full glass-panel border-l border-[var(--border-color)] bg-[#07090E] p-8 overflow-y-auto flex flex-col justify-between shadow-2xl text-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div>
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-orange)]">Medilife Technical Specifications</span>
                                        <h3 className="text-xl font-bold font-display uppercase tracking-tight">System Specs & Hardware Interface</h3>
                                    </div>
                                    <button onClick={() => setDrawerOpen(false)} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold uppercase">
                                        Close
                                    </button>
                                </div>

                                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 font-mono text-xs">
                                    <button onClick={() => setActiveDrawerTab('architecture')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDrawerTab === 'architecture' ? 'bg-[var(--accent-orange)] text-black' : 'text-white/70'}`}>
                                        System Topology
                                    </button>
                                    <button onClick={() => setActiveDrawerTab('hardware')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDrawerTab === 'hardware' ? 'bg-[var(--accent-cyan)] text-black' : 'text-white/70'}`}>
                                        Hardware Bridge
                                    </button>
                                    <button onClick={() => setActiveDrawerTab('roi')} className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeDrawerTab === 'roi' ? 'bg-emerald-400 text-black' : 'text-white/70'}`}>
                                        Clinic ROI
                                    </button>
                                </div>

                                {activeDrawerTab === 'architecture' && (
                                    <div className="space-y-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                                            <div className="font-mono uppercase font-bold text-white">Database Row Level Security (RLS)</div>
                                            <p>Enforces strict tenant data segregation across all lab reports, patient profiles, and staff accounts in PostgreSQL.</p>
                                        </div>
                                    </div>
                                )}

                                {activeDrawerTab === 'hardware' && (
                                    <div className="space-y-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                                            <div className="font-mono uppercase font-bold text-[var(--accent-cyan)]">ASTM / HL7 Automatic Machine Parser</div>
                                            <p>Ingests raw output strings from local analyzer machines, mapping parameter ranges automatically.</p>
                                        </div>
                                    </div>
                                )}

                                {activeDrawerTab === 'roi' && (
                                    <div className="space-y-3">
                                        {METRICS_ROI.map((m) => (
                                            <div key={m.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div className="text-lg font-bold font-mono text-emerald-400">{m.value}</div>
                                                <div className="text-xs font-bold text-white uppercase">{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                <span className="text-[10px] font-mono text-[var(--text-muted)]">MEDILIFE CLINIC EDITION</span>
                                <a href="https://timely-rolypoly-3a7789.netlify.app/" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider">
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
