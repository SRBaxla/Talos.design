import { Layers, Maximize2, Sparkles, Box, Zap, Code2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DISCIPLINES = [
    {
        icon: Layers,
        title: 'Design Tokens & Component Systems',
        description: 'Systematized color scales, typographic hierarchies, and atomic React components engineered for predictable scaling and maintainability.'
    },
    {
        icon: Maximize2,
        title: 'Fluid Typography & Adaptive Viewports',
        description: 'Mathematical clamp formulas and resilient layout grids ensuring optimal readability across 4K monitors and mobile viewports.'
    },
    {
        icon: Sparkles,
        title: 'Physics-Based Motion & Micro-Interactions',
        description: 'Spring physics curves, scroll-linked orchestration, and seamless layout transitions powered by Framer Motion.'
    },
    {
        icon: Box,
        title: 'Hardware-Accelerated WebGL & Shaders',
        description: 'Interactive Three.js canvas viewports, custom GLSL fragment shaders, and GPU-accelerated graphic elements.'
    },
    {
        icon: Zap,
        title: 'Core Web Vitals & Asset Performance',
        description: 'Optimized build pipelines with tree-shaking, code splitting, progressive image delivery, and sub-second client-side hydration.'
    },
    {
        icon: Code2,
        title: 'Semantic Accessibility & TypeScript',
        description: 'Strict end-to-end type safety, keyboard-navigable focus states, ARIA landmarks, and high-contrast accessibility standards.'
    }
];

const ARCHITECTURE_STANDARDS = [
    { label: 'Styling Engine', value: 'Tailwind CSS & CSS Custom Properties' },
    { label: 'Motion Physics', value: 'Framer Motion Spring Dynamics' },
    { label: 'Graphics Pipeline', value: 'WebGL & Three.js Canvas' },
    { label: 'Type Safety', value: 'Strict TypeScript Strict-Mode' },
    { label: 'Layout Architecture', value: 'Fluid Clamp & CSS Subgrid' },
    { label: 'Build Tooling', value: 'Vite Optimized SSG Bundling' }
];

export default function Designs() {
    return (
        <div className="container py-24 min-h-screen">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-20 md:mb-32"
            >
                <div className="badge badge-active mb-8 md:mb-10 px-4 md:px-6 py-2 uppercase tracking-[0.3em] font-bold text-[10px] md:text-xs">
                    [VISUAL &amp; FRONTEND ENGINEERING]
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl mb-8 md:mb-10 font-display font-bold tracking-tight uppercase leading-[1.05] max-w-5xl">
                    Visual &amp; <br />
                    <span className="text-gradient-orange text-glow-orange leading-none">Frontend Engineering</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-[var(--accent-orange)] pl-6 italic">
                    "Crafting deterministic design systems, 60fps physics-driven interactions, and resilient modern web architecture with rigorous aesthetic standards."
                </p>
            </motion.div>

            {/* Technical Engineering Disciplines Grid */}
            <div className="mb-24 md:mb-36">
                <div className="flex items-center gap-4 mb-12 md:mb-20">
                    <div className="h-px bg-gradient-to-r from-[var(--accent-orange)] to-transparent flex-grow" />
                    <h2 className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-[var(--text-muted)] uppercase text-center">
                        Frontend Engineering Disciplines
                    </h2>
                    <div className="h-px bg-gradient-to-l from-[var(--accent-orange)] to-transparent flex-grow" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {DISCIPLINES.map((d, i) => (
                        <motion.div
                            key={d.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-8 md:p-10 group hover:border-[rgba(245,158,11,0.2)] transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[rgba(245,158,11,0.08)] flex items-center justify-center mb-6 border border-[rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform">
                                    <d.icon size={26} className="text-[var(--accent-orange)]" />
                                </div>
                                <h3 className="text-lg font-bold mb-3 uppercase tracking-tight text-white">{d.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {d.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Frontend Architecture & Standards Matrix */}
            <div className="mb-24 md:mb-36">
                <div className="glass-panel p-8 md:p-12 rounded-3xl border border-[var(--border-color)] bg-black/40">
                    <div className="max-w-2xl mb-8">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-cyan)] font-bold">
                            ENGINEERING FOUNDATION
                        </span>
                        <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white mt-1">
                            Design as a Deterministic System
                        </h3>
                        <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed mt-2">
                            Every interface component is structured as an isolated, testable unit with strict token contracts, avoiding ad-hoc styling and layout regressions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ARCHITECTURE_STANDARDS.map((item) => (
                            <div key={item.label} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-orange)] font-bold">
                                    {item.label}
                                </div>
                                <div className="text-xs font-semibold text-white">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Collaboration CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-8 md:p-16 glass-panel rounded-[2.5rem] md:rounded-[4rem] text-center relative overflow-hidden border border-[var(--accent-orange-glow)] mb-24"
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(245,158,11,0.05)] to-transparent pointer-events-none" />
                <h2 className="text-3xl md:text-6xl font-display font-bold mb-6 uppercase tracking-tight leading-[1.05] relative z-10">
                    Collaborate on <br /><span className="text-gradient-orange">Frontend Architecture</span>
                </h2>
                <p className="text-[var(--text-secondary)] mb-10 max-w-xl mx-auto text-base leading-relaxed opacity-90 px-4 relative z-10">
                    From complex interactive WebGL canvas modules to scalable React component systems, we engineer high-fidelity user interfaces and modern frontend architecture.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <Link to="/contact" className="btn btn-primary py-3.5 px-8 shadow-[0_0_20px_var(--accent-orange-glow)] inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold">
                        Discuss Technical Collaboration <ArrowRight size={16} />
                    </Link>
                    <Link to="/services/web-design" className="btn btn-outline py-3.5 px-8 inline-flex items-center justify-center text-xs uppercase tracking-wider font-bold">
                        Explore Web Design Service
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
