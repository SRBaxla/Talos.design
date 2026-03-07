import { motion } from 'framer-motion';
import { Network, Cpu, Shield, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
};

export default function AboutUs() {
    return (
        <div className="flex flex-col flex-grow w-full">
            {/* ── HERO SECTION ───────────────────────────────────────────────── */}
            <div className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.05)] pt-32 pb-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-orange)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

                <div className="container relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="badge badge-active mb-8 font-mono text-xs"
                    >
                        [ABOUT US]
                    </motion.div>

                    <motion.h1
                        {...fadeUp}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl text-center mb-6 max-w-5xl tracking-tight leading-[1.1] font-display"
                    >
                        We Build <br />
                        <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Digital Infrastructure</span>
                    </motion.h1>

                    <motion.p
                        {...fadeUp}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-[var(--text-secondary)] text-center max-w-2xl leading-relaxed mb-10"
                    >
                        Talos Design is a modern agency engineering scalable, reliable, and powerful digital ecosystems for the next generation of business.
                    </motion.p>
                </div>
            </div>

            {/* ── VALUES SECTION ─────────────────────────────────────────────── */}
            <div className="container py-24 flex flex-col items-center flex-grow relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl mb-24"
                >
                    <h2 className="text-3xl font-display uppercase tracking-tight mb-12 text-center">
                        Our Core <span className="text-[var(--accent-orange)]">Principles</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: Cpu,
                                title: 'Automation First',
                                desc: 'We replace manual labor with intelligent, scalable software that works 24/7 without fail.',
                                color: 'var(--accent-orange)',
                                bg: 'rgba(245,158,11,0.1)'
                            },
                            {
                                icon: Shield,
                                title: 'Reliable Infrastructure',
                                desc: 'Our architectures are built for resilience, providing a robust foundation that businesses can trust.',
                                color: 'var(--accent-cyan)',
                                bg: 'rgba(0,229,255,0.1)'
                            },
                            {
                                icon: Network,
                                title: 'Connected Systems',
                                desc: 'We unify fragmented data, seamlessly integrating tools to create synchronized digital operations.',
                                color: '#c084fc',
                                bg: 'rgba(192,132,252,0.1)'
                            },
                            {
                                icon: Users,
                                title: 'Client Empowerment',
                                desc: 'We build systems that give you full control, reducing dependencies and improving efficiency.',
                                color: '#34d399',
                                bg: 'rgba(52,211,153,0.1)'
                            }
                        ].map((val, i) => (
                            <motion.div
                                key={val.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i }}
                                className="glass-panel p-8 group border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)] transition-colors"
                            >
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                                    style={{ backgroundColor: val.bg, color: val.color }}
                                >
                                    <val.icon size={24} />
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-3">{val.title}</h3>
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── CTA SECTION ──────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel w-full max-w-5xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 border-[var(--border-color)] text-center md:text-left"
                >
                    <div>
                        <h3 className="text-2xl font-display font-bold mb-2">Ready to upgrade your infrastructure?</h3>
                        <p className="text-[var(--text-secondary)]">Let's discuss how we can automate and scale your business operations.</p>
                    </div>
                    <Link to="/contact" className="btn btn-primary whitespace-nowrap px-8 py-3 flex items-center gap-2">
                        Get in Touch <ArrowRight size={16} />
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
