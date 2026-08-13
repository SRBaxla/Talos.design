import { Link } from 'react-router-dom';
import { 
    Globe, Zap, TrendingUp, Clock, PhoneOff, 
    ExternalLink, ArrowRight, Key, CheckSquare, Sparkles
} from 'lucide-react';

export default function Systems() {
    return (
        <div className="container py-16 flex flex-col flex-grow text-white">
            {/* Header */}
            <div className="mb-16 text-center max-w-3xl mx-auto">
                <span className="badge font-mono text-xs text-[var(--accent-cyan)] border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block font-bold">
                    SYSTEMS & ARCHITECTURE
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight uppercase leading-[0.95] mb-6">
                    Production <span className="text-gradient-orange">Engine Solutions.</span>
                </h1>
                <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                    Custom digital infrastructure engineered for vertical SaaS, automated workflows, and enterprise scale.
                </p>
            </div>

            {/* Showcase Vertical Suites */}
            <div className="space-y-16">
                {/* Prototype Card 1: Medilife Diagnostic Platform */}
                <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-[var(--accent-orange)]/40 relative overflow-hidden bg-black/40 shadow-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
                        <div>
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3 inline-flex items-center gap-1.5">
                                <Sparkles size={12} className="animate-pulse" /> DEMO READY — DIAGNOSTIC CLINIC PLATFORM
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Medilife Diagnostic Clinic Engine</h3>
                            <p className="text-xs font-mono text-[var(--accent-cyan)] mt-1">Branded Online Storefront, Pathologist Peer Review & Automated WhatsApp PDF Dispatch</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <a href="https://timely-rolypoly-3a7789.netlify.app/" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl bg-[var(--accent-cyan)] text-[#07090E] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                                Launch Live Demo <ExternalLink size={14} />
                            </a>
                            <Link to="/projects/medilife" className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all flex items-center gap-2 border border-white/10">
                                Inspect Clinic Showcase <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Operational Metrics Strip */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <div className="text-xl font-black font-mono text-amber-400">2+ Hours / Day</div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">Daily Time Saved</div>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                <PhoneOff size={20} />
                            </div>
                            <div>
                                <div className="text-xl font-black font-mono text-emerald-400">80% Drop</div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">In Status Phone Calls</div>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <div className="text-xl font-black font-mono text-sky-400">3.4x Higher</div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">Patient Retention</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Demo Credentials Callout */}
                    <div className="p-4 md:p-5 rounded-2xl bg-black/60 border border-white/15 mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 flex items-center justify-center text-[var(--accent-orange)]">
                                <Key size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-[var(--accent-orange)] uppercase font-bold">Verified Demo Credentials</div>
                                <div className="text-xs font-bold text-white">Lab Admin Sign-In: <span className="font-mono text-[var(--accent-cyan)] font-normal">admin@medilife.in</span> | <span className="font-mono text-[var(--accent-orange)] font-normal">Admin@2026!</span></div>
                            </div>
                        </div>
                        <a
                            href="https://timely-rolypoly-3a7789.netlify.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                            Quick Login <ExternalLink size={12} />
                        </a>
                    </div>

                    {/* 4 Core Clinic Modules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-orange)] uppercase">
                                <Globe size={14} /> 01. Branded Storefront
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                Custom website & online test booking under your clinic’s own domain name.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                                <CheckSquare size={14} /> 02. Pathologist Peer Review
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                Mandatory senior doctor verification gatekeeper before report generation.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-cyan)] uppercase">
                                <Zap size={14} /> 03. WhatsApp PDF Dispatch
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                1-Click automated PDF report delivery straight to patient’s WhatsApp inbox.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase">
                                <TrendingUp size={14} /> 04. Patient Retention
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                Automated reminders for 3-month and 6-month blood test follow-up checkups.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
