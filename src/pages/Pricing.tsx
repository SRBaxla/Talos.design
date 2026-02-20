import { useState } from 'react';
import { CheckCircle2, Sliders, Settings2, Info, ArrowRight, Zap, Shield, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(false);

    // Custom Forge State
    const [gpu, setGpu] = useState(128);
    const [storage, setStorage] = useState(4.0);
    const [threads, setThreads] = useState(500);

    // Calculate Custom Forge Cost
    const baseRate = 149.00;
    const gpuSurcharge = gpu * 0.66;
    const storageFees = storage * 10;
    const customMonthlyCost = baseRate + gpuSurcharge + storageFees;

    // Apply 20% discount if annual is selected
    const discountMultiplier = isAnnual ? 0.8 : 1;
    const customFinalCost = customMonthlyCost * discountMultiplier;

    return (
        <div className="container py-16 flex flex-col flex-grow items-center relative z-10 w-full">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-online mb-8 font-mono text-xs border-[rgba(245,158,11,0.3)] shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            >
                SYSTEM_STATUS: OPTIMAL
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center"
            >
                Choose Your Automation <span className="text-gradient-cyan drop-shadow-[0_0_20px_rgba(0,229,255,0.2)]">Engine</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mb-12"
            >
                Scale your AI capabilities from prototype to god-mode. Select a pre-configured core or forge your own custom specifications for enterprise-grade workloads.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 mb-24 glass-panel rounded-full p-2 border-[rgba(255,255,255,0.1)]"
            >
                <button
                    onClick={() => setIsAnnual(false)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-[var(--bg-surface-elevated)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setIsAnnual(true)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? 'bg-[var(--bg-surface-elevated)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                    Annually <span className="text-[10px] bg-[rgba(0,229,255,0.1)] text-[var(--accent-cyan)] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest hidden sm:inline-block">Save 20%</span>
                </button>
            </motion.div>

            {/* Pricing Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-32 relative">

                {/* Tier 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel p-8 flex flex-col hover:border-[rgba(255,255,255,0.2)] transition-colors group"
                >
                    <div className="text-[10px] font-mono text-[var(--accent-orange)] uppercase tracking-widest mb-4">INITIATE</div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-display font-bold tabular-nums">${isAnnual ? '24' : '29'}</span>
                        <span className="text-[var(--text-muted)] text-sm">/month</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-8 flex-grow">Essential tools for single developers and early prototypes.</p>

                    <ul className="flex flex-col gap-4 mb-10 text-sm text-[var(--text-secondary)]">
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] transition-colors shrink-0" /> 5 AI Projects</li>
                        <li className="flex gap-3 items-center">
                            <CheckCircle2 size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] transition-colors shrink-0" />
                            Basic Analytics
                            <Info size={14} className="text-[var(--text-muted)] ml-auto cursor-help" />
                        </li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] transition-colors shrink-0" /> Community Support</li>
                        <li className="flex gap-3 items-center opacity-50"><CheckCircle2 size={16} className="shrink-0" /> API Access</li>
                    </ul>
                    <button className="btn btn-outline w-full hover:bg-[var(--accent-orange)] hover:text-black hover:border-[var(--accent-orange)] transition-all">Select Initiate</button>
                </motion.div>

                {/* Tier 2: Popular */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-8 flex flex-col relative border-[var(--accent-cyan)] shadow-[0_0_40px_rgba(0,229,255,0.05)] transform md:-translate-y-4 bg-[rgba(18,18,20,0.95)]"
                >
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[rgba(0,229,255,0.05)] to-transparent opacity-50 pointer-events-none rounded-2xl"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent-cyan)] text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-[0_0_20px_var(--accent-cyan-glow)]">
                        MOST POPULAR
                    </div>
                    <div className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-4">TITAN</div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-display font-bold tabular-nums">${isAnnual ? '399' : '499'}</span>
                        <span className="text-[var(--text-muted)] text-sm">/month</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-8 flex-grow">Enterprise-grade power for heavy production workloads.</p>
                    <ul className="flex flex-col gap-4 mb-10 text-sm">
                        <li className="flex gap-3 items-center font-medium"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> Unlimited Projects</li>
                        <li className="flex gap-3 items-center font-medium">
                            <CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" />
                            Real-time Inference
                            <Info size={14} className="text-[var(--text-muted)] ml-auto cursor-help" />
                        </li>
                        <li className="flex gap-3 items-center font-medium"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> 24/7 Dedicated Support</li>
                        <li className="flex gap-3 items-center font-medium"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> Custom Model Training</li>
                        <li className="flex gap-3 items-center font-medium"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> SSO & Security Audit</li>
                    </ul>
                    <button className="btn w-full bg-[var(--accent-cyan)] text-black hover:bg-white hover:shadow-[0_0_20px_var(--accent-cyan-glow)] transition-all">Initialize Titan</button>
                </motion.div>

                {/* Tier 3 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-8 flex flex-col hover:border-[rgba(255,255,255,0.2)] transition-colors relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#c084fc] opacity-[0.05] rounded-full blur-[40px] group-hover:opacity-[0.1] transition-opacity"></div>
                    <div className="text-[10px] font-mono text-[#c084fc] uppercase tracking-widest mb-4">OLYMPUS</div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-display font-bold">Custom</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-8 flex-grow">Limitless scale and isolated environments for global operations.</p>
                    <ul className="flex flex-col gap-4 mb-10 text-sm text-[var(--text-secondary)]">
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[#c084fc] shrink-0" /> Dedicated Infrastructure</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[#c084fc] shrink-0" /> On-Premise Deployment</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[#c084fc] shrink-0" /> White-glove Onboarding</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[#c084fc] shrink-0" /> Strict SLA Guarantees</li>
                    </ul>
                    <button className="btn btn-outline w-full hover:bg-[rgba(192,132,252,0.1)] hover:border-[#c084fc] hover:text-[#c084fc] transition-colors mt-auto flex items-center justify-center gap-2">Contact Sales <ArrowRight size={16} /></button>
                </motion.div>
            </div>

            {/* Custom Forge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl glass-panel p-0 overflow-hidden flex flex-col lg:flex-row mb-16 relative"
            >
                {/* Dotted background effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                {/* Controls Area */}
                <div className="w-full lg:w-3/5 p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-[var(--border-color)] relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[rgba(0,229,255,0.1)] flex items-center justify-center text-[var(--accent-cyan)] shadow-[0_0_20px_rgba(0,229,255,0.1)]">
                                <Sliders size={24} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-display">Custom Forge</h2>
                                <p className="text-[var(--text-muted)] text-sm">Design your optimal infrastructure</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono border border-[var(--border-color)] px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] self-start sm:self-center">Build v2.1.0</span>
                    </div>

                    <div className="space-y-12">
                        {/* Slider 1: GPU */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Cpu size={16} className="text-[var(--text-secondary)]" />
                                    <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">GPU_ALLOCATION</span>
                                </div>
                                <span className="bg-[rgba(0,229,255,0.1)] text-[var(--accent-cyan)] px-3 py-1 rounded text-xs font-bold font-mono border border-[rgba(0,229,255,0.2)]">
                                    {gpu} CORES
                                </span>
                            </div>
                            <input
                                type="range" min="8" max="256" value={gpu} onChange={(e) => setGpu(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-[var(--bg-surface-elevated)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--accent-cyan)' }}
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-3"><span>8 (Min)</span><span>256 (Max)</span></div>
                        </div>

                        {/* Slider 2: Storage */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                                    <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">STORAGE_CAPACITY</span>
                                </div>
                                <span className="bg-[rgba(0,229,255,0.1)] text-[var(--accent-cyan)] px-3 py-1 rounded text-xs font-bold font-mono border border-[rgba(0,229,255,0.2)]">
                                    {storage.toFixed(1)} TB
                                </span>
                            </div>
                            <input
                                type="range" min="1" max="100" step="0.5" value={storage} onChange={(e) => setStorage(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-[var(--bg-surface-elevated)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--accent-cyan)' }}
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-3"><span>1 TB</span><span>100 TB</span></div>
                        </div>

                        {/* Slider 3: Threads */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Zap size={16} className="text-[var(--text-secondary)]" />
                                    <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">CONCURRENT_THREADS</span>
                                </div>
                                <span className="bg-[rgba(0,229,255,0.1)] text-[var(--accent-cyan)] px-3 py-1 rounded text-xs font-bold font-mono border border-[rgba(0,229,255,0.2)]">
                                    {threads}
                                </span>
                            </div>
                            <input
                                type="range" min="10" max="2000" step="10" value={threads} onChange={(e) => setThreads(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-[var(--bg-surface-elevated)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--accent-cyan)' }}
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-3"><span>10 (Base)</span><span>2000 (Max)</span></div>
                        </div>
                    </div>
                </div>

                {/* Output / Receipt Area */}
                <div className="w-full lg:w-2/5 bg-[rgba(10,10,11,0.8)] backdrop-blur-md p-10 md:p-14 flex flex-col justify-between relative z-10 border-l border-[rgba(255,255,255,0.02)]">
                    <div>
                        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-8">
                            <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">CONFIGURATION_OUTPUT</span>
                            <Shield size={16} className="text-[var(--text-muted)]" />
                        </div>

                        <div className="space-y-5 font-mono text-sm">
                            <div className="flex justify-between items-center group">
                                <span className="text-[var(--text-muted)] group-hover:text-white transition-colors">BASE_RATE</span>
                                <span className="tabular-nums">${baseRate.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-[var(--text-muted)] group-hover:text-white transition-colors">GPU_SURCHARGE</span>
                                <span className="tabular-nums">+${gpuSurcharge.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-[var(--text-muted)] group-hover:text-white transition-colors">STORAGE_FEES</span>
                                <span className="tabular-nums">+${storageFees.toFixed(2)}</span>
                            </div>

                            <AnimatePresence>
                                {isAnnual && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: '1.25rem' }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="flex justify-between items-center bg-[rgba(0,229,255,0.05)] p-3 rounded border border-[rgba(0,229,255,0.1)] overflow-hidden"
                                    >
                                        <span className="text-[var(--accent-cyan)] font-bold text-xs">ANNUAL COMMITMENT (20% OFF)</span>
                                        <span className="text-[var(--accent-cyan)] font-bold tabular-nums">-${(customMonthlyCost * 0.2).toFixed(2)}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mt-16">
                        <div className="flex flex-col gap-2 mb-8">
                            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">ESTIMATED_COST</span>
                            <div className="flex items-baseline gap-2">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={customFinalCost}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="text-5xl md:text-6xl font-display font-bold text-[var(--accent-cyan)] tabular-nums"
                                    >
                                        ${customFinalCost.toFixed(2)}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest">/mo</span>
                            </div>
                        </div>

                        <button className="btn btn-outline border-[var(--border-color-light)] w-full flex items-center justify-center font-mono text-sm tracking-widest hover:bg-[rgba(0,229,255,0.1)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all py-5 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,229,255,0.1)] to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            <Settings2 size={18} className="mr-3 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors" />
                            COMPILE_PACKAGE
                        </button>
                        <p className="text-[10px] text-center text-[var(--text-muted)] mt-4 font-mono">Generates a hardware provisioning manifest.</p>
                    </div>
                </div>

            </motion.div>

        </div>
    );
}
