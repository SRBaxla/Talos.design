import { useRef } from 'react';
import { Shield, ChevronDown, Bot, CircuitBoard, Code2, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress for the whole page
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Fade out and slightly scale down the hero content as user scrolls down the first viewport height
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <div className="flex flex-col flex-grow relative" ref={containerRef}>

            {/* STICKY BACKGROUND & HERO - Stays fixed while scrolling */}
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-24 z-0">

                {/* Abstract Glows */}
                <div className="absolute top-[20%] left-1/4 w-[500px] h-[500px] bg-[var(--accent-orange)] opacity-[0.04] blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
                <div className="absolute top-[40%] right-1/4 w-[600px] h-[600px] bg-[var(--accent-cyan)] opacity-[0.04] blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

                {/* Grid pattern specific to hero */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_var(--bg-base)_100%)] pointer-events-none z-0"></div>

                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="container flex flex-col items-center text-center relative z-10"
                >
                    <div className="w-24 h-24 rounded-2xl bg-[rgba(18,18,20,0.8)] border border-[rgba(245,158,11,0.3)] shadow-[0_0_30px_rgba(245,158,11,0.15)] flex items-center justify-center mb-10">
                        <Shield className="text-[var(--accent-orange)]" size={48} />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display tracking-tight leading-tight mb-8">
                        Forging the Future <br />
                        <span className="text-[var(--accent-orange)] font-serif italic pr-4 tracking-tighter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">of Intelligence</span>
                    </h1>

                    <div className="flex flex-col items-center gap-2 mb-10 text-sm text-[var(--text-secondary)] font-mono">
                        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] px-4 py-2 border border-[var(--border-color)] rounded-full backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></span>
                            SYSTEM STATUS: <span className="text-white">ONLINE</span>
                        </div>
                        <div className="flex items-start gap-2 max-w-lg text-center mt-4">
                            <span className="text-[var(--text-muted)]">-</span>
                            We bridge the gap between ancient craftsmanship and futuristic automation.
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-[10px] text-[var(--accent-orange)] font-mono uppercase tracking-widest gap-2 opacity-80 mt-12">
                        SCROLL TO INITIATE
                        <ChevronDown size={14} className="animate-bounce" />
                    </div>
                </motion.div>
            </div>

            {/* FOREGROUND CONTENT - Scrolls over the sticky hero */}
            {/* Note the mt-[100vh] so it starts exactly below the hero section realistically */}
            <div className="relative z-20 bg-[var(--bg-base)] w-full flex flex-col items-center pb-24 border-t border-[var(--border-color)] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pt-32">

                {/* The Guardian section */}
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40 items-center px-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.2)] text-[var(--accent-cyan)] text-[10px] font-mono uppercase tracking-widest mb-6 rounded-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span> Core Directive
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display leading-tight mb-6">
                            The Guardian of <br /> Digital Efficiency
                        </h2>
                        <div className="w-16 h-1 bg-[var(--accent-orange)] mb-6"></div>
                    </div>

                    <div className="border-l-2 border-[var(--border-color)] pl-8 py-2">
                        <p className="text-lg leading-relaxed mb-6 block bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--text-secondary)]">
                            <span className="text-[var(--accent-orange)] font-bold">&gt;&gt; Talos.design</span> is not merely an agency; it is an architectural firm for the digital age. We believe that true intelligence lies in the seamless integration of raw data and refined automation.
                        </p>
                        <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                            Our mission is to construct robust digital frameworks that operate with the autonomy of AI and the precision of a master craftsman. We identify inefficiencies, architect solutions, and deploy autonomous agents to safeguard your growth.
                        </p>
                        <div className="flex gap-8 border-t border-[rgba(255,255,255,0.1)] pt-6">
                            <div>
                                <div className="text-3xl font-display font-bold text-white mb-1 leading-none text-gradient-orange">98%</div>
                                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Efficiency</div>
                            </div>
                            <div>
                                <div className="text-3xl font-display font-bold text-white mb-1 leading-none text-gradient-cyan">24/7</div>
                                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Uptime</div>
                            </div>
                            <div>
                                <div className="text-3xl font-display font-bold text-white mb-1 leading-none">∞</div>
                                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Scale</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Protocol Timeline */}
                <div className="w-full max-w-3xl mb-40 flex flex-col items-center px-4">
                    <h2 className="text-3xl font-display mb-2">The Protocol</h2>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-16 overflow-hidden max-w-full relative inline-block">
                        INITIALIZING SEQUENCE...
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-50"></div>
                    </div>

                    <div className="relative w-full">
                        {/* Vertical Line */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-[var(--border-color)] via-[rgba(245,158,11,0.3)] to-[var(--border-color)]"></div>

                        {/* Phase 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="flex justify-between items-center w-full mb-16 relative"
                        >
                            <div className="w-5/12 text-right pr-8">
                                <h3 className="text-xl font-bold mb-2">Phase 1: Analysis</h3>
                                <p className="text-[var(--text-secondary)] text-sm">Deep dive into data structures. Identifying core inefficiencies.</p>
                            </div>
                            <div className="z-10 w-4 h-4 rounded-full border-2 border-[var(--bg-base)] bg-[var(--border-color-light)] shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
                            <div className="w-5/12 pl-8 border-b border-[var(--border-color)] h-px"></div>
                        </motion.div>

                        {/* Phase 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-between items-center w-full mb-16 relative"
                        >
                            <div className="w-5/12 pr-8 border-b border-[var(--border-color)] h-px"></div>
                            <div className="z-10 w-4 h-4 rounded-full border-2 border-[var(--bg-base)] bg-[var(--accent-orange)] shadow-[0_0_15px_var(--accent-orange-glow)]"></div>
                            <div className="w-5/12 pl-8">
                                <h3 className="text-xl font-bold mb-2 text-white">Phase 2: Architecture</h3>
                                <p className="text-[var(--text-secondary)] text-sm">Constructing digital frameworks. Building scalable intelligence.</p>
                            </div>
                        </motion.div>

                        {/* Phase 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-between items-center w-full relative"
                        >
                            <div className="w-5/12 text-right pr-8">
                                <h3 className="text-xl font-bold mb-2 text-[var(--accent-cyan)] drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">Phase 3: Automation</h3>
                                <p className="text-[var(--text-secondary)] text-sm">Deploying autonomous agents. Handling complex workflows.</p>
                            </div>
                            <div className="z-10 w-4 h-4 rounded-full border-2 border-[var(--bg-base)] bg-[var(--accent-cyan)] shadow-[0_0_15px_var(--accent-cyan-glow)]"></div>
                            <div className="w-5/12 pl-8 border-b border-[var(--accent-cyan)] h-px opacity-30 shadow-[0_0_10px_rgba(0,229,255,0.5)]"></div>
                        </motion.div>
                    </div>
                </div>

                {/* The Architects */}
                <div className="w-full max-w-6xl mb-32 relative z-20 px-4">
                    <div className="flex justify-between items-end mb-12 border-b border-[var(--border-color)] pb-4">
                        <div className="max-w-md">
                            <h2 className="text-3xl font-display mb-4">The Architects</h2>
                            <p className="text-sm text-[var(--text-secondary)]">The minds behind the machine. A collective of engineers, designers, and strategists.</p>
                        </div>
                        <a href="#" className="hidden md:flex items-center text-[10px] text-[var(--accent-orange)] font-mono uppercase tracking-widest hover:text-[var(--accent-orange-hover)]">
                            View All Agents <ArrowRight size={14} className="ml-2" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
                        {/* Unit Alpha */}
                        <motion.div
                            whileHover={{ translateY: -10, rotateX: 5, rotateY: -5, zIndex: 30 }}
                            className="glass-panel p-8 border-t border-t-[rgba(255,255,255,0.05)] transition-all duration-300 transform-gpu relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.03)] to-transparent pointer-events-none"></div>
                            <div className="w-full h-48 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded mb-8 flex items-center justify-center opacity-70 group hover:opacity-100 transition-opacity">
                                <Bot size={48} className="text-[var(--border-color-light)] group-hover:text-[var(--accent-orange)] group-hover:drop-shadow-[0_0_10px_var(--accent-orange-glow)] transition-all" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-1">Unit Alpha</h3>
                            <div className="text-[10px] font-mono text-[var(--accent-orange)] uppercase tracking-widest mb-4">Lead Architect</div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed relative z-10">Runs class in neural network architectures and high-level system logic.</p>
                        </motion.div>

                        {/* Unit Beta */}
                        <motion.div
                            whileHover={{ translateY: -10, rotateX: 5, zIndex: 30 }}
                            className="glass-panel p-8 border-t border-t-[rgba(255,255,255,0.05)] transition-all duration-300 transform-gpu relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-transparent pointer-events-none"></div>
                            <div className="w-full h-48 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded mb-8 flex items-center justify-center opacity-70 group hover:opacity-100 transition-opacity">
                                <CircuitBoard size={48} className="text-[var(--border-color-light)] group-hover:text-[var(--text-primary)] transition-all" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-1">Unit Beta</h3>
                            <div className="text-[10px] font-mono text-white uppercase tracking-widest mb-4">Systems Operations</div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed relative z-10">Expert in data flow optimization and automated agent deployment.</p>
                        </motion.div>

                        {/* Unit Gamma */}
                        <motion.div
                            whileHover={{ translateY: -10, rotateX: 5, rotateY: 5, zIndex: 30 }}
                            className="glass-panel p-8 border-t border-t-[rgba(255,255,255,0.05)] transition-all duration-300 transform-gpu relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-bl from-[rgba(255,255,255,0.03)] to-transparent pointer-events-none"></div>
                            <div className="w-full h-48 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded mb-8 flex items-center justify-center opacity-70 group hover:opacity-100 transition-opacity">
                                <Code2 size={48} className="text-[var(--border-color-light)] group-hover:text-[var(--accent-cyan)] group-hover:drop-shadow-[0_0_10px_var(--accent-cyan-glow)] transition-all" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-1">Unit Gamma</h3>
                            <div className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-4">Logic Interface</div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed relative z-10">Translating complex data streams into intuitive human interfaces.</p>
                        </motion.div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="w-full max-w-4xl flex flex-col items-center text-center mt-16 mb-24 relative z-20 px-4">
                    <div className="w-12 h-12 rounded-full bg-[rgba(245,158,11,0.1)] text-[var(--accent-orange)] flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[var(--accent-orange)]"></div>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display tracking-tight mb-6">Ready to Automate?</h2>
                    <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl">
                        The future doesn't wait. Initiate the protocol to begin your transformation into a digitally optimized entity.
                    </p>
                    <div className="flex gap-4">
                        <a href="/contact" className="btn btn-primary px-8 flex items-center gap-2">
                            INITIATE PROTOCOL <ArrowRight size={16} />
                        </a>
                        <a href="/services" className="btn btn-outline px-8">
                            READ DOCUMENTATION
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}
