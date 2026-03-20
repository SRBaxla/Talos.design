import { Palette, ArrowRight, ExternalLink, ZoomIn, Zap, Box, Code2, Layers, BarChart3, Binary } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const FEATURES = [
    { icon: Zap, title: 'Performance Budgets', description: 'Hard-coded limits on bundle size and execution time to ensure sub-second interaction readiness.' },
    { icon: Layers, title: 'Semantic Architecture', description: 'Strict component composability following atomic design principles for infinite scalability.' },
    { icon: Box, title: 'Dynamic Breakpoint Logic', description: 'Fluid, mathematical scaling that maintains typographic rhythm across any infinite resolution.' },
    { icon: Code2, title: 'Tokenized Systems', description: 'Design-to-code synchronization using unified tokens for 100% brand fidelity across all platforms.' },
    { icon: BarChart3, title: 'Accessibility Auditing', description: 'Continuous integration of WCAG 2.1 standards into the core design logic, not as an afterthought.' },
    { icon: Binary, title: 'Logic-Driven Animation', description: 'Micro-interactions programmed to represent system state, enhancing UX through meaningful motion.' },
];

const PROCESS = [
    { step: '01', title: 'DNA Extraction', description: 'Technical auditing of brand architecture and user intent to define the structural foundation.' },
    { step: '02', title: 'Aesthetic Synthesis', description: 'Calculated mathematical design systems crafted for visual impact and semantic consistency.' },
    { step: '03', title: 'Logic Integration', description: 'Translating design tokens into high-performance, modular code using modern framework standards.' },
    { step: '04', title: 'Performance Hardening', description: 'Rigorous optimization of bundle size, Core Web Vitals, and accessibility for a 100/100 score.' },
];

const PORTFOLIO_ITEMS = [
    { id: 1, title: 'Luxe Real Estate', category: 'High-End Web', description: 'A custom-engineered destination for ultra-high-net-worth individuals, featuring fluid typography and rapid-load asset delivery.', image: 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]' },
    { id: 2, title: 'SaaS Dashboard', category: 'UI/UX Design', description: 'Quantified user interfaces for complex data visualization, optimizing for cognitive load and decision speed.', image: 'bg-gradient-to-br from-[#0f172a] to-[#1e293b]' },
    { id: 3, title: '3D Portfolio', category: 'Interactive', description: 'Pushing the boundaries of the browser with math-driven animations and performant WebGL explorations.', image: 'bg-gradient-to-br from-[#1e1b4b] to-[#312e81]' },
    { id: 4, title: 'E-commerce Engine', category: 'Web App', description: 'Architecture built for scale, focusing on transactional friction reduction and millisecond-level responsiveness.', image: 'bg-gradient-to-br from-[#451a03] to-[#78350f]' },
];

function DesignGallery() {
    const [activeId, setActiveId] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto mb-40">
            {PORTFOLIO_ITEMS.map((item) => (
                <motion.div
                    key={item.id}
                    layoutId={`card-${item.id}`}
                    onClick={() => setActiveId(item.id)}
                    className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden cursor-pointer group glass-panel border border-[var(--border-color)]"
                >
                    <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-105 ${item.image}`} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="text-white w-12 h-12" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <div className="text-[10px] font-mono tracking-widest uppercase text-[var(--accent-orange)] mb-2">{item.category}</div>
                        <h4 className="text-2xl font-bold text-white">{item.title}</h4>
                    </div>
                </motion.div>
            ))}

            <AnimatePresence>
                {activeId && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveId(null)}
                        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-20"
                    >
                        <motion.div 
                            layoutId={`card-${activeId}`}
                            className="w-full max-w-6xl aspect-square md:aspect-[16/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative glass-panel border border-[var(--border-color)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`absolute inset-0 ${PORTFOLIO_ITEMS.find(i => i.id === activeId)?.image}`} />
                            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">{PORTFOLIO_ITEMS.find(i => i.id === activeId)?.title}</h3>
                                <p className="text-base md:text-xl text-white/70 max-w-2xl mb-8 leading-relaxed italic">
                                    {PORTFOLIO_ITEMS.find(i => i.id === activeId)?.description}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="btn btn-primary px-8 py-3 text-xs md:text-sm flex items-center justify-center gap-2">Visit Live <ExternalLink size={16} /></button>
                                    <button onClick={() => setActiveId(null)} className="btn btn-outline px-8 py-3 text-xs md:text-sm text-white">Close View</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Designs() {
    return (
        <div className="container py-24 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-24 md:mb-40"
            >
                <div className="badge badge-active mb-8 md:mb-10 px-4 md:px-6 py-2 uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-[10px] md:text-sm">[ENGINEERING ELEGANCE]</div>
                <h1 className="text-5xl md:text-9xl mb-8 md:mb-10 font-black tracking-tighter uppercase leading-[0.9] md:leading-[0.85] max-w-5xl">
                    Engineering <br />
                    <span className="text-gradient-orange text-glow-orange leading-none">Digital Superiority.</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-2xl opacity-80 border-l-2 border-[var(--accent-orange)] pl-6 italic">
                    "Design is not how it looks, but how it works. At Talos, aesthetics are a functional extension of engineering logic."
                </p>
            </motion.div>

            {/* Design Gallery */}
            <DesignGallery />

            <div className="mb-24 md:mb-48 relative h-[300px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-[rgba(210,193,182,0.15)] group shadow-[0_0_50px_rgba(210,193,182,0.05)]">
                <div className="absolute inset-0 bg-[var(--bg-surface-elevated)]/40 backdrop-blur-md z-10 flex items-center justify-center pointer-events-none">
                    <div className="text-center px-6">
                        <div className="text-[10px] md:text-[12px] font-mono tracking-[0.4em] md:tracking-[1.2em] text-[var(--accent-orange)] opacity-60 mb-6 uppercase">System Aesthetic Pulse</div>
                        <div className="flex gap-4 md:gap-8 items-center justify-center">
                            <Binary size={24} className="text-[var(--accent-orange)] animate-pulse md:w-8 md:h-8" />
                            <div className="h-px w-24 md:w-48 bg-gradient-to-r from-transparent via-[var(--accent-orange)] to-transparent opacity-50" />
                            <Palette size={24} className="text-[var(--accent-orange)] animate-float md:w-8 md:h-8" />
                        </div>
                        <div className="mt-8 text-[8px] md:text-[10px] font-mono tracking-[0.3em] md:tracking-[0.5em] text-[var(--text-muted)] opacity-40 uppercase">Aesthetic Quantifier: 0.9997 [STABLE]</div>
                    </div>
                </div>
                <DesignPulse />
            </div>

            {/* Design Infrastructure */}
            <div className="mb-24 md:mb-48">
                <div className="flex items-center gap-4 mb-12 md:mb-20">
                    <div className="h-px bg-gradient-to-r from-[var(--accent-orange)] to-transparent flex-grow" />
                    <h3 className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-[var(--text-muted)] uppercase text-center">Technical Design Infrastructure</h3>
                    <div className="h-px bg-gradient-to-l from-[var(--accent-orange)] to-transparent flex-grow" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-8 md:p-10 group hover:border-[rgba(245,158,11,0.2)] transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[rgba(245,158,11,0.08)] flex items-center justify-center mb-6 border border-[rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform">
                                <f.icon size={28} className="text-[var(--accent-orange)]" />
                            </div>
                            <h4 className="text-lg font-bold mb-3 uppercase tracking-tight">{f.title}</h4>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* The Logic of Aesthetics */}
            <div className="mb-24 md:mb-48">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-12 md:mb-20">
                    <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
                        <h3 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">The Logic of <br /><span className="text-gradient-orange">Aesthetics.</span></h3>
                        <p className="text-[var(--text-secondary)] text-[10px] md:text-sm uppercase tracking-widest font-mono opacity-60">A 4-step quantified synthesis of form and function.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {PROCESS.map((p, i) => (
                        <motion.div 
                            key={p.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-8 relative overflow-hidden group"
                        >
                            <div className="text-6xl font-display font-bold text-[rgba(245,158,11,0.05)] absolute -top-2 -right-2 transform group-hover:-translate-x-2 transition-transform">{p.step}</div>
                            <div className="relative z-10">
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-[var(--accent-orange)]">{p.title}</h4>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-8 md:p-20 glass-panel rounded-[2.5rem] md:rounded-[5rem] text-center relative overflow-hidden border border-[var(--accent-orange-glow)] mb-24 md:mb-40"
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(245,158,11,0.05)] to-transparent pointer-events-none" />
                <h2 className="text-4xl md:text-8xl font-black mb-10 uppercase tracking-tighter leading-[0.9] md:leading-none">Elevate Your <br /><span className="text-gradient-orange">Presence.</span></h2>
                <p className="text-[var(--text-secondary)] mb-12 md:mb-16 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed italic opacity-80 px-4">
                    "The difference between a website and a digital destination is a deliberate choice. Choose the Talos standard."
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                    <button className="btn btn-primary px-8 md:px-16 py-4 md:py-6 text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-[0_0_50px_var(--accent-orange-glow)] group">
                        Start Design Brief <ArrowRight size={20} className="inline ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                    <button className="btn btn-outline px-8 md:px-16 py-4 md:py-6 text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Full Portfolio</button>
                </div>
                <div className="mt-12 text-[8px] md:text-[10px] font-mono tracking-[0.3em] md:tracking-[0.5em] text-[var(--text-muted)] uppercase">Limited Monthly Capacity: [2/4 INTAKE SLOTS OPEN]</div>
            </motion.div>
        </div>
    );
}

function DesignPulse() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <motion.div 
                animate={{ 
                    x: [0, 150, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[var(--accent-orange)] to-transparent rounded-full blur-[140px]"
            />
            <motion.div 
                animate={{ 
                    x: [0, -180, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-[rgba(0,229,255,0.2)] to-transparent rounded-full blur-[160px]"
            />
        </div>
    );
}
