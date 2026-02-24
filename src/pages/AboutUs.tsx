import { Heart, Zap, Globe, Users, Laptop, Rocket, ArrowRight, Code2, Bot, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const values = [
    {
        icon: Zap,
        title: 'Speed & Precision',
        description: 'We move fast without cutting corners. Every pixel and every line of code is intentional.',
        color: 'var(--accent-orange)',
        bgColor: 'rgba(245,158,11,0.1)',
        borderColor: 'rgba(245,158,11,0.2)',
    },
    {
        icon: Heart,
        title: 'Client Obsessed',
        description: 'Your success is our success. We treat every project like it\'s our own product launch.',
        color: 'var(--accent-cyan)',
        bgColor: 'rgba(0,229,255,0.1)',
        borderColor: 'rgba(0,229,255,0.2)',
    },
    {
        icon: Globe,
        title: 'Remote First',
        description: 'No office, no boundaries. We work from anywhere and deliver everywhere.',
        color: '#c084fc',
        bgColor: 'rgba(192,132,252,0.1)',
        borderColor: 'rgba(192,132,252,0.2)',
    },
];

const capabilities = [
    { icon: Code2, label: 'Web Development', detail: 'React, Next.js, Vite, Tailwind' },
    { icon: Bot, label: 'AI & Chatbots', detail: 'OpenAI, LangChain, Custom LLMs' },
    { icon: Palette, label: 'UI/UX Design', detail: 'Figma, Framer Motion, Design Systems' },
    { icon: Zap, label: 'Automation', detail: 'Workflows, APIs, CRM, Notifications' },
];

export default function AboutUs() {
    return (
        <div className="container py-16 flex flex-col flex-grow items-center relative z-10 w-full">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-online mb-8 font-mono text-xs border-[rgba(245,158,11,0.3)] shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            >
                ABOUT_US
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center"
            >
                We Are <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Talos</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mb-20"
            >
                A small, passionate team of engineers and designers building powerful digital solutions from India — for clients worldwide.
            </motion.p>

            {/* Our Story */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Our Story</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-8">
                    From Idea to <span className="text-[var(--accent-cyan)]">Impact</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            <span className="text-[var(--accent-orange)] font-bold font-mono">&gt;&gt;</span> Talos.design was born out of a simple belief: every business — no matter how small — deserves world-class digital infrastructure. We saw small hotels, local shops, and emerging startups struggling with outdated systems and overpriced agencies.
                        </p>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            So we built something different. A lean, remote-first studio that combines the precision of modern engineering with the creativity of great design. No fluff, no bloated teams — just sharp minds shipping real products.
                        </p>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            Today, we build everything from premium websites and booking engines to AI chatbots and custom automation systems. We're proud to be a fully remote team based in India, serving clients around the world.
                        </p>
                    </div>

                    <div className="glass-panel p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent-orange)] opacity-[0.04] blur-[60px] rounded-full pointer-events-none"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
                                    <Laptop size={20} className="text-[var(--accent-orange)]" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">Fully Remote</div>
                                    <div className="text-xs text-[var(--text-muted)]">No office, pure digital operations</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(0,229,255,0.1)] flex items-center justify-center">
                                    <Globe size={20} className="text-[var(--accent-cyan)]" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">Based in India 🇮🇳</div>
                                    <div className="text-xs text-[var(--text-muted)]">Serving clients worldwide</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(192,132,252,0.1)] flex items-center justify-center">
                                    <Users size={20} className="text-[#c084fc]" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">Small & Focused</div>
                                    <div className="text-xs text-[var(--text-muted)]">Lean team, big impact</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.1)] flex items-center justify-center">
                                    <Rocket size={20} className="text-green-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">SaaS Solutions</div>
                                    <div className="text-xs text-[var(--text-muted)]">One-time builds, lasting results</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Our Values */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Core Values</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    What Drives <span className="text-[var(--accent-orange)]">Us</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {values.map((value, i) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-8 flex flex-col group hover:border-[rgba(255,255,255,0.15)] transition-all"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border transition-all"
                                style={{ backgroundColor: value.bgColor, borderColor: value.borderColor }}
                            >
                                <value.icon size={24} style={{ color: value.color }} />
                            </div>
                            <h3 className="text-lg font-display font-bold mb-3">{value.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* What We Build */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Capabilities</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    What We <span className="text-[var(--accent-cyan)]">Build</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {capabilities.map((cap, i) => (
                        <motion.div
                            key={cap.label}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-6 flex items-center gap-5 hover:border-[rgba(0,229,255,0.2)] transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[rgba(0,229,255,0.08)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(0,229,255,0.15)] transition-colors">
                                <cap.icon size={22} className="text-[var(--accent-cyan)]" />
                            </div>
                            <div>
                                <div className="font-bold text-sm mb-1">{cap.label}</div>
                                <div className="text-xs text-[var(--text-muted)] font-mono">{cap.detail}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl border border-[var(--border-color)] p-10 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl bg-[rgba(255,255,255,0.01)] backdrop-blur-sm relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(245,158,11,0.03)] to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-3xl font-display mb-2">Let's Build Together</h2>
                    <p className="text-[var(--text-secondary)]">Have a project in mind? We'd love to hear about it.</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <Link to="/pricing" className="btn btn-outline py-3 px-8">View Pricing</Link>
                    <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)] flex items-center gap-2">
                        Get in Touch <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>

        </div>
    );
}
