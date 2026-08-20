import { useRef } from 'react';
import { Heart, Zap, Globe, ArrowRight, CheckCircle, Phone, FileText, Hammer, Rocket } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
// import NetworkScene from '../components/NetworkScene';

const values = [
    {
        icon: Zap,
        title: 'Speed & Precision',
        description: 'We move fast without cutting corners. Every pixel and every line of code is intentional.',
        color: 'var(--accent-orange)',
        bgColor: 'rgba(210,193,182,0.08)',
        borderColor: 'rgba(210,193,182,0.25)',
    },
    {
        icon: Heart,
        title: 'Client Obsessed',
        description: 'Your success is our success. We treat every project like it\'s our own product launch.',
        color: 'var(--accent-cyan)',
        bgColor: 'rgba(69,104,130,0.08)',
        borderColor: 'rgba(69,104,130,0.25)',
    },
    {
        icon: Globe,
        title: 'Remote First',
        description: 'No office, no boundaries. Based in India, serving clients worldwide with premium quality at competitive rates.',
        color: '#c084fc',
        bgColor: 'rgba(192,132,252,0.08)',
        borderColor: 'rgba(192,132,252,0.25)',
    },
];

const process = [
    {
        step: '01',
        icon: Phone,
        title: 'Discovery Call',
        badge: 'Free',
        badgeColor: 'rgba(34,197,94,0.15)',
        badgeBorderColor: 'rgba(34,197,94,0.3)',
        badgeTextColor: '#4ade80',
        description: 'We spend 30 minutes understanding your business, goals, timeline, and what\'s blocking you right now.',
    },
    {
        step: '02',
        icon: FileText,
        title: 'Proposal & Fixed Price',
        badge: 'No surprises',
        badgeColor: 'rgba(210,193,182,0.1)',
        badgeBorderColor: 'rgba(210,193,182,0.3)',
        badgeTextColor: 'var(--text-primary)',
        description: 'You get a clear scope document, timeline, and a fixed price before we write a single line of code.',
    },
    {
        step: '03',
        icon: Hammer,
        title: 'Build with Check-ins',
        badge: 'Transparent',
        badgeColor: 'rgba(69,104,130,0.1)',
        badgeBorderColor: 'rgba(69,104,130,0.3)',
        badgeTextColor: 'var(--accent-cyan)',
        description: 'We deliver in phases with regular progress updates — you\'re never waiting blindly for a final reveal.',
    },
    {
        step: '04',
        icon: Rocket,
        title: 'Launch & Support',
        badge: 'Post-launch included',
        badgeColor: 'rgba(192,132,252,0.1)',
        badgeBorderColor: 'rgba(192,132,252,0.3)',
        badgeTextColor: '#c084fc',
        description: 'We go live together, handle any issues, and remain available after launch. You\'re not left on your own.',
    },
];

const stats = [
    { value: '100%', label: 'Custom Engineered' },
    { value: '2–4 wks', label: 'Target Launch Timeline' },
    { value: '100%', label: 'Remote — serve worldwide' },
    { value: '🇮🇳', label: 'Engineered in Jhansi, India' },
];

export default function Studio() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

    return (
        <div className="flex flex-col flex-grow relative" ref={containerRef}>

            {/* ── STICKY HERO ──────────────────────────────────────────────── */}
            <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-0 overflow-hidden">
                {/* <NetworkScene /> */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--accent-orange)] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="container flex flex-col items-center text-center relative z-10 pb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="badge badge-online mb-8 font-mono text-xs border-[rgba(245,158,11,0.3)]"
                    >
                        TALOS STUDIO
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display tracking-tight mb-6 leading-[1.1] max-w-4xl"
                    >
                        We Are <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Talos</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed mb-10"
                    >
                        A lean, remote-first studio of engineers and designers building powerful digital products — from India, for clients worldwide.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col items-center text-[10px] text-[var(--accent-orange)] font-mono uppercase tracking-widest gap-2 font-bold"
                    >
                        Scroll to learn more
                        <span className="animate-bounce">↓</span>
                    </motion.div>
                </motion.div>
            </div>

            {/* ── SCROLLING BODY ───────────────────────────────────────────── */}
            <div className="relative z-20 bg-[var(--bg-base)] w-full flex flex-col items-center pb-24 border-t border-[var(--border-color)] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] pt-24">

                {/* Stats strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl mb-24 px-4"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="glass-panel p-6 flex flex-col items-center text-center">
                                <div className="text-3xl font-display font-bold mb-2 text-gradient-orange">{stat.value}</div>
                                <div className="text-[10px] font-mono text-[var(--text-secondary)] font-semibold uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Our Story */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl mb-24 px-4"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]" />
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Our Story</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-8">
                        From Idea to <span className="text-[var(--accent-cyan)]">Reality</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-5">
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                <span className="text-[var(--accent-orange)] font-bold font-mono">&gt;&gt;</span> Talos.design was founded on a straightforward principle: businesses deserve high-quality, dependable digital systems without unnecessary complexity or bloated agency overhead.
                            </p>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                We are a lean, engineering-led studio that combines thoughtful design with practical software engineering. No fluff, no buzzword hype — just clear technical execution.
                            </p>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                We build custom websites, AI inquiry assistants, and workflow automation systems — proudly based in Jhansi, India and working with businesses everywhere.
                            </p>
                        </div>

                        <div className="glass-panel p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent-orange)] opacity-[0.04] blur-[60px] rounded-full pointer-events-none" />
                            <div className="relative z-10 space-y-5">
                                {[
                                    { label: 'Fully Remote', sub: 'No office, pure digital operations', color: 'var(--accent-orange)' },
                                    { label: 'Based in India 🇮🇳', sub: 'Serving clients worldwide', color: 'var(--accent-cyan)' },
                                    { label: 'Small & Focused', sub: 'Lean team, big impact', color: '#c084fc' },
                                    { label: 'One-time builds', sub: 'Lasting results, no retainer lock-in', color: '#4ade80' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <CheckCircle size={16} style={{ color: item.color }} className="shrink-0" />
                                        <div>
                                            <div className="text-sm font-bold">{item.label}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{item.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Core Values */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl mb-24 px-4"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]" />
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
                                className="glass-panel p-8 flex flex-col"
                                style={{ borderColor: value.borderColor }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                                    style={{ backgroundColor: value.bgColor, border: `1px solid ${value.borderColor}` }}
                                >
                                    <value.icon size={22} style={{ color: value.color }} />
                                </div>
                                <h3 className="text-lg font-display font-bold mb-3">{value.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* How We Work */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl mb-24 px-4"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]" />
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">The Process</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                        How We <span className="text-[var(--accent-cyan)]">Work</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {process.map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-8 flex flex-col gap-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-xl bg-[rgba(210,193,182,0.06)] border border-[rgba(210,193,182,0.15)] flex items-center justify-center">
                                        <step.icon size={20} className="text-[var(--text-secondary)]" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                                            style={{ background: step.badgeColor, borderColor: step.badgeBorderColor, color: step.badgeTextColor }}
                                        >
                                            {step.badge}
                                        </span>
                                        <span className="text-xs font-mono text-[var(--text-muted)]">{step.step}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-bold mb-2">{step.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
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
                    className="w-full max-w-5xl border border-[var(--border-color)] p-10 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl bg-[rgba(255,255,255,0.01)] backdrop-blur-sm relative overflow-hidden mx-4"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(210,193,182,0.04)] to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                        <h2 className="text-3xl font-display mb-2">Let's Build Together</h2>
                        <p className="text-[var(--text-secondary)]">Have a project in mind? Start with a free 30-minute discovery call.</p>
                    </div>
                    <div className="flex gap-4 relative z-10 shrink-0">
                        <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)] flex items-center gap-2">
                            Book a Call <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
