import { Layers, Lightbulb, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Services() {
    return (
        <div className="container py-16 flex flex-col items-center flex-grow">
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center max-w-3xl mb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-32 h-32 mb-8 relative"
                >
                    <div className="absolute inset-0 bg-[var(--accent-orange)] blur-[60px] opacity-20 rounded-full"></div>
                    <div className="w-full h-full border-t-[8px] border-l-[8px] border-r-[8px] border-b-0 border-white relative flex items-center justify-center pt-4">
                        <div className="w-[80%] h-[80%] bg-[rgba(255,255,255,0.05)] text-8xl font-display font-bold text-[var(--accent-orange)] flex items-center justify-center pb-4">T</div>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-display uppercase tracking-tighter mb-6 leading-none"
                >
                    Automate Your <br />
                    <span className="text-[var(--accent-orange)]">Aesthetic</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="badge badge-active mb-6 font-mono text-xs"
                >
                    [SYSTEM_STATUS: ACTIVE]
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-[var(--text-secondary)] mb-10 text-lg leading-relaxed max-w-2xl px-4"
                >
                    Bridging the gap between human intuition and machine precision. We engineer AI systems that design at scale.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-4"
                >
                    <Link to="/projects" className="btn btn-outline border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-black hover:shadow-[0_0_20px_var(--accent-cyan-glow)] uppercase text-xs tracking-widest px-8 flex items-center justify-center">
                        Initialize Project +
                    </Link>
                    <Link to="/contact" className="btn btn-outline uppercase text-xs tracking-widest px-8 flex items-center justify-center">
                        Get in Touch
                    </Link>
                </motion.div>
            </div>

            {/* Autonomous Design Ops */}
            <div className="w-full max-w-6xl mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-between items-end mb-12 border-b border-[var(--border-color)] pb-4"
                >
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Core Modules // 01</span>
                        </div>
                        <h2 className="text-3xl font-display uppercase tracking-tight">Autonomous Design <br /> Ops</h2>
                    </div>
                    <p className="hidden md:block text-xs text-[var(--text-muted)] max-w-xs text-right mb-2">Leveraging neural networks to optimize UX workflows and visual brand consistency.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-panel p-8 bg-[rgba(18,18,20,0.8)] border-t border-t-[rgba(255,255,255,0.1)]"
                    >
                        <div className="w-10 h-10 rounded bg-[rgba(0,229,255,0.1)] flex items-center justify-center text-[var(--accent-cyan)] mb-16">
                            <Layers size={20} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Generative UI Systems</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-auto h-24">
                            Procedural layout generation that adapts in real-time to user behavior and platform constraints.
                        </p>
                        <div className="flex flex-col gap-2 mt-8">
                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-primary)] font-mono uppercase"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]"></span> Dynamic Components</div>
                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-primary)] font-mono uppercase"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]"></span> Variable Theming</div>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-8 bg-[rgba(18,18,20,0.8)] border-t border-t-[rgba(255,255,255,0.1)]"
                    >
                        <div className="w-10 h-10 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[var(--accent-orange)] mb-16">
                            <Lightbulb size={20} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">AI Brand Identity</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-auto h-24">
                            Algorithmic visual identities that evolve while maintaining the core presence of your unique prestige.
                        </p>
                        <div className="flex flex-col gap-2 mt-8">
                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-primary)] font-mono uppercase"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)]"></span> Neural Logos</div>
                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-primary)] font-mono uppercase"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)]"></span> Semantic Palettes</div>
                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 bg-[rgba(18,18,20,0.8)] border-t border-t-[rgba(255,255,255,0.1)]"
                    >
                        <div className="w-10 h-10 rounded bg-[rgba(0,229,255,0.1)] flex items-center justify-center text-[var(--accent-cyan)] mb-16">
                            <Workflow size={20} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Automated Design Ops</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-auto h-24">
                            Seamless integration of AI into your existing Figma or GitHub workflows to eliminate repetitive tasks.
                        </p>
                        <div className="flex flex-col gap-2 mt-8">
                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-primary)] font-mono uppercase"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]"></span> Asset Pipelines</div>
                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-primary)] font-mono uppercase"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]"></span> Auto-Documentation</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Case Studies */}
            <div className="w-full max-w-6xl mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Case Studies // 02</span>
                    </div>
                    <h2 className="text-4xl font-display uppercase tracking-tight">System Outputs</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Project 1 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-panel overflow-hidden group border-t border-t-[rgba(255,255,255,0.1)]"
                    >
                        <div className="h-64 bg-[#1c1c22] relative flex items-center justify-center p-8">
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] to-transparent z-10"></div>
                            {/* Abstract Flower Graphic */}
                            <div className="w-32 h-32 relative z-0 opacity-50 group-hover:scale-105 transition-transform duration-700">
                                <div className="absolute inset-0 bg-white rounded-full blur-[40px] opacity-20"></div>
                                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current opacity-80">
                                    <path d="M50 10 C 60 40, 90 40, 90 50 C 90 60, 60 70, 50 90 C 40 70, 10 60, 10 50 C 10 40, 40 40, 50 10 Z" />
                                    <circle cx="50" cy="50" r="15" fill="black" />
                                    <circle cx="50" cy="50" r="5" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <div className="p-8 relative z-20 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-color)]">
                            <div className="inline-flex items-center justify-center px-2 py-1 bg-[rgba(0,229,255,0.1)] text-[var(--text-primary)] border border-[rgba(0,229,255,0.2)] text-[10px] font-mono uppercase mb-4 rounded-sm">
                                Metrics: +214% ROI
                            </div>
                            <h3 className="text-xl font-display font-bold uppercase tracking-wide mb-2">Project: Neural Vault</h3>
                            <p className="text-[var(--text-muted)] text-sm">Automated 4,000+ interface states in 0.4 seconds.</p>
                        </div>
                    </motion.div>

                    {/* Project 2 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel overflow-hidden group border-t border-t-[rgba(255,255,255,0.1)]"
                    >
                        <div className="h-64 bg-[#1c1c22] relative flex items-center justify-center p-8">
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] to-transparent z-10"></div>
                            {/* Abstract Letter Graphic */}
                            <div className="w-32 h-32 relative z-0 opacity-50 group-hover:scale-105 transition-transform duration-700 flex justify-center items-center">
                                <div className="absolute inset-0 bg-white rounded-full blur-[40px] opacity-20"></div>
                                <div className="text-8xl font-serif text-white font-bold italic tracking-tighter pr-4">L</div>
                            </div>
                        </div>
                        <div className="p-8 relative z-20 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-color)]">
                            <div className="inline-flex items-center justify-center px-2 py-1 bg-[rgba(245,158,11,0.1)] text-[var(--text-primary)] border border-[rgba(245,158,11,0.2)] text-[10px] font-mono uppercase mb-4 rounded-sm">
                                Latency: 12 Seconds
                            </div>
                            <h3 className="text-xl font-display font-bold uppercase tracking-wide mb-2">Project: Aether Lux <span className="text-[10px] font-mono text-[var(--text-muted)] ml-2">BETA</span></h3>
                            <p className="text-[var(--text-muted)] text-sm">Generative identity system for a hyper-premium car brand.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

        </div>
    );
}
