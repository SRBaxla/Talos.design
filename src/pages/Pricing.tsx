import { useState } from 'react';
import { CheckCircle2, Sliders, Settings2 } from 'lucide-react';

export default function Pricing() {
    const [gpu, setGpu] = useState(128);
    const [storage, setStorage] = useState(4.0);
    const [threads, setThreads] = useState(500);

    const estimatedCost = 149.00 + (gpu * 0.66) + (storage * 10);

    return (
        <div className="container py-16 flex flex-col flex-grow items-center">

            <div className="badge badge-online mb-8 font-mono text-xs border-[rgba(245,158,11,0.3)]">
                SYSTEM_STATUS: OPTIMAL
            </div>

            <h1 className="text-5xl md:text-6xl font-display tracking-tight mb-6 text-center">
                Choose Your Automation <span className="text-[var(--text-secondary)]">Engine</span>
            </h1>

            <p className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mb-24">
                Scale your AI capabilities from prototype to god-mode. Select a pre-configured core or forge your own custom specifications.
            </p>

            {/* Pricing Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mb-32">
                {/* Tier 1 */}
                <div className="glass-panel p-8 flex flex-col hover:border-[rgba(255,255,255,0.2)] transition-colors">
                    <div className="text-[10px] font-mono text-[var(--accent-orange)] uppercase tracking-widest mb-4">INITIATE</div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-display font-bold">$29</span>
                        <span className="text-[var(--text-muted)] text-sm">/month</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-8 flex-grow">Essential tools for hobbyists and early prototypes.</p>
                    <ul className="flex flex-col gap-4 mb-8 text-sm text-[var(--text-secondary)]">
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--accent-orange)] shrink-0" /> 5 AI Projects</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--accent-orange)] shrink-0" /> Basic Analytics</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--accent-orange)] shrink-0" /> Community Support</li>
                    </ul>
                    <button className="btn btn-outline w-full hover:bg-[rgba(255,255,255,0.05)]">Select Initiate</button>
                </div>

                {/* Tier 2 */}
                <div className="glass-panel p-8 flex flex-col hover:border-[rgba(255,255,255,0.2)] transition-colors">
                    <div className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-4">ASCENDANT</div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-display font-bold">$99</span>
                        <span className="text-[var(--text-muted)] text-sm">/month</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-8 flex-grow">Advanced compute for growing startups.</p>
                    <ul className="flex flex-col gap-4 mb-8 text-sm text-[var(--text-secondary)]">
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> 25 AI Projects</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> Advanced Analytics</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> Priority Email Support</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> API Access</li>
                    </ul>
                    <button className="btn btn-outline w-full hover:bg-[rgba(255,255,255,0.05)]">Select Ascendant</button>
                </div>

                {/* Tier 3: Popular */}
                <div className="glass-panel p-8 flex flex-col relative border-[var(--accent-cyan)] shadow-[0_0_30px_rgba(0,229,255,0.1)] transform md:-translate-y-4 bg-[rgba(18,18,20,0.95)]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent-cyan)] text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_var(--accent-cyan-glow)]">
                        MOST POPULAR
                    </div>
                    <div className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-4">TITAN</div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-display font-bold">$499</span>
                        <span className="text-[var(--text-muted)] text-sm">/month</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-8 flex-grow">Enterprise-grade power for heavy workloads.</p>
                    <ul className="flex flex-col gap-4 mb-8 text-sm">
                        <li className="flex gap-3 items-center font-medium"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> Unlimited Projects</li>
                        <li className="flex gap-3 items-center font-medium"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> Real-time Inference</li>
                        <li className="flex gap-3 items-center font-medium"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> 24/7 Dedicated Support</li>
                        <li className="flex gap-3 items-center font-medium"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> Custom Model Training</li>
                        <li className="flex gap-3 items-center font-medium"><CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" /> SSO & Security Audit</li>
                    </ul>
                    <button className="btn w-full bg-[var(--accent-cyan)] text-black hover:bg-white hover:text-black hover:shadow-[0_0_20px_var(--accent-cyan-glow)]">Initialize Titan</button>
                </div>

                {/* Tier 4 */}
                <div className="glass-panel p-8 flex flex-col hover:border-[rgba(255,255,255,0.2)] transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-orange)] opacity-[0.05] rounded-full blur-[40px]"></div>
                    <div className="text-[10px] font-mono text-[#c084fc] uppercase tracking-widest mb-4">OLYMPUS</div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-display font-bold">Custom</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-8 flex-grow">Limitless scale for global operations.</p>
                    <ul className="flex flex-col gap-4 mb-8 text-sm text-[var(--text-secondary)]">
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[#c084fc] shrink-0" /> Dedicated Infrastructure</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[#c084fc] shrink-0" /> On-Premise Deployment</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[#c084fc] shrink-0" /> White-glove Onboarding</li>
                        <li className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[#c084fc] shrink-0" /> SLA Guarantees</li>
                    </ul>
                    <button className="btn btn-outline w-full hover:bg-[rgba(255,255,255,0.05)] mt-auto">Contact Sales</button>
                </div>
            </div>

            {/* Custom Forge */}
            <div className="w-full max-w-5xl glass-panel p-0 overflow-hidden flex flex-col md:flex-row mb-16 relative">
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                {/* Controls */}
                <div className="w-full md:w-2/3 p-10 pr-12 border-b md:border-b-0 md:border-r border-[var(--border-color)] relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                        <Sliders className="text-[var(--accent-cyan)]" size={28} />
                        <h2 className="text-3xl font-display">Custom Forge</h2>
                        <span className="text-[10px] font-mono border border-[var(--border-color)] px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]">Build v1.0.4</span>
                    </div>

                    <div className="space-y-10">
                        {/* Slider 1 */}
                        <div>
                            <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                                <span>GPU_ALLOCATION</span>
                                <span className="text-[var(--accent-cyan)] text-xs font-bold">{gpu} CORES</span>
                            </div>
                            <input
                                type="range" min="8" max="256" value={gpu} onChange={(e) => setGpu(parseInt(e.target.value))}
                                className="w-full h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--accent-cyan)' }}
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-2"><span>8</span><span>256</span></div>
                        </div>

                        {/* Slider 2 */}
                        <div>
                            <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                                <span>STORAGE_CAPACITY</span>
                                <span className="text-[var(--accent-cyan)] text-xs font-bold">{storage.toFixed(1)} TB</span>
                            </div>
                            <input
                                type="range" min="1" max="100" step="0.5" value={storage} onChange={(e) => setStorage(parseFloat(e.target.value))}
                                className="w-full h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--accent-cyan)' }}
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-2"><span>1TB</span><span>100TB</span></div>
                        </div>

                        {/* Slider 3 */}
                        <div>
                            <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                                <span>CONCURRENT_THREADS</span>
                                <span className="text-[var(--accent-cyan)] text-xs font-bold">{threads}</span>
                            </div>
                            <input
                                type="range" min="10" max="2000" step="10" value={threads} onChange={(e) => setThreads(parseInt(e.target.value))}
                                className="w-full h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--accent-cyan)' }}
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-2"><span>10</span><span>2000</span></div>
                        </div>
                    </div>
                </div>

                {/* Output / Receipt */}
                <div className="w-full md:w-1/3 bg-[rgba(10,10,11,0.5)] p-10 flex flex-col justify-between relative z-10">
                    <div>
                        <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-6 border-b border-[var(--border-color)] pb-4">
                            CONFIGURATION_OUTPUT
                        </div>

                        <div className="space-y-4 font-mono text-xs">
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">BASE_RATE</span>
                                <span>$149.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">GPU_SURCHARGE</span>
                                <span>${(gpu * 0.66).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">STORAGE_FEES</span>
                                <span>${(storage * 10).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-[var(--border-color)] pb-4 mt-2 border-dashed">
                                <span className="text-[var(--accent-orange)]">DISCOUNT (BETA)</span>
                                <span className="text-[var(--accent-orange)]">-$24.50</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-8 mt-12">
                            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">ESTIMATED_COST</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-display font-bold text-[var(--accent-cyan)]">${(estimatedCost - 24.50).toFixed(2)}</span>
                                <span className="text-[10px] text-[var(--text-muted)] font-mono">/mo</span>
                            </div>
                        </div>
                        <button className="btn btn-outline border-[var(--border-color-light)] w-full flex items-center justify-center font-mono text-xs tracking-widest hover:bg-[rgba(0,229,255,0.1)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-colors py-4">
                            <Settings2 size={16} className="mr-2" /> COMPILE_PACKAGE
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}
