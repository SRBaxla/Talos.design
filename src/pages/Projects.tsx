import { Globe, Bot, Wrench, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PROJECTS = [
    {
        id: 'presence',
        label: 'Package 01',
        title: 'Digital Presence',
        accent: 'orange',
        icon: Globe,

        description:
            'Your complete online identity — designed, built, and deployed. We handle the website, branding, SEO, and social-media CI/CD so you can focus on running your business.',
        highlights: [
            'Custom website design & development',
            'Brand identity system',
            'SEO & performance optimization',
            'Social media CI/CD automation',
            'Content management system',
            'Analytics & reporting dashboard',
        ],
        cta: 'Explore Presence',
        path: '/projects/presence',
    },
    {
        id: 'automation',
        label: 'Package 02',
        title: 'Smart Automation',
        accent: 'cyan',
        icon: Bot,

        description:
            'Automate bookings, queries, inventory, and service management with intelligent digital systems that run 24/7 — no manual work, no downtime.',
        highlights: [
            'AI-powered booking & reservation',
            'Automated query handling (chatbot + email)',
            'Inventory & service management',
            'Notification & alert system',
            'CRM integration',
            'Real-time reporting',
        ],
        cta: 'Explore Automation',
        path: '/projects/automation',
    },
    {
        id: 'custom',
        label: 'Package 03',
        title: 'Custom Build',
        accent: 'purple',
        icon: Wrench,

        description:
            'Mix and match from both packages or request something entirely unique. We\'ll craft the exact solution your business needs — nothing more, nothing less.',
        highlights: [
            'Pick features from any package',
            'Tailored architecture',
            'Priority engineering support',
            'Scalable infrastructure',
            'Dedicated project manager',
            'Flexible timeline',
        ],
        cta: 'Build Custom',
        path: '/projects/custom',
    },
];

const accentMap: Record<string, { color: string; glow: string; bg: string; border: string }> = {
    orange: {
        color: 'var(--accent-orange)',
        glow: 'var(--accent-orange-glow)',
        bg: 'rgba(245,158,11,0.1)',
        border: 'rgba(245,158,11,0.25)',
    },
    cyan: {
        color: 'var(--accent-cyan)',
        glow: 'var(--accent-cyan-glow)',
        bg: 'rgba(0,229,255,0.1)',
        border: 'rgba(0,229,255,0.25)',
    },
    purple: {
        color: '#c084fc',
        glow: 'rgba(192,132,252,0.4)',
        bg: 'rgba(192,132,252,0.1)',
        border: 'rgba(192,132,252,0.25)',
    },
};

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function Projects() {
    return (
        <div className="container py-16 flex flex-col flex-grow items-center">
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="badge badge-active mb-8 font-mono text-xs"
            >
                [PACKAGES]
            </motion.div>

            {/* Hero */}
            <motion.h1
                {...fadeUp}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center"
            >
                Choose Your <span className="text-[var(--accent-orange)]">Package.</span>
            </motion.h1>
            <motion.p
                {...fadeUp}
                transition={{ delay: 0.2 }}
                className="text-xl text-[var(--text-secondary)] text-center max-w-2xl mb-20"
            >
                Choose a pre-built package or custom-craft your own. We handle everything digital — bookings, queries, management, automation — so your business runs 24/7 without the manual load.
            </motion.p>

            {/* Project Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-24">
                {PROJECTS.map((project, i) => {
                    const a = accentMap[project.accent];
                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="glass-panel p-8 flex flex-col relative overflow-hidden group hover:border-opacity-60 transition-all duration-300"
                            style={{ borderColor: a.border }}
                        >
                            {/* Glow */}
                            <div
                                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-[0.06] pointer-events-none group-hover:opacity-[0.12] transition-opacity"
                                style={{ backgroundColor: a.color }}
                            ></div>

                            <div className="relative z-10 flex flex-col flex-grow">
                                {/* Label */}
                                <span
                                    className="text-[10px] font-mono uppercase tracking-widest mb-6"
                                    style={{ color: a.color }}
                                >
                                    {project.label}
                                </span>

                                {/* Icon + Title */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: a.bg }}
                                    >
                                        <project.icon size={24} style={{ color: a.color }} />
                                    </div>
                                    <h2 className="text-2xl font-display font-bold">{project.title}</h2>
                                </div>



                                {/* Description */}
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
                                    {project.description}
                                </p>

                                {/* Highlights */}
                                <ul className="flex flex-col gap-3 mb-10 flex-grow">
                                    {project.highlights.map((h) => (
                                        <li key={h} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                            <Sparkles size={14} className="shrink-0 mt-0.5" style={{ color: a.color }} />
                                            {h}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <Link
                                    to={project.path}
                                    className="btn btn-outline w-full flex items-center justify-center gap-2 transition-all"
                                    style={{
                                        borderColor: a.border,
                                        color: a.color,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = a.bg;
                                        e.currentTarget.style.boxShadow = `0 0 20px ${a.glow}`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {project.cta} <ArrowRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom note */}
            <motion.div
                {...fadeUp}
                transition={{ delay: 0.7 }}
                className="glass-panel p-8 max-w-3xl w-full text-center"
            >
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    <span className="text-[var(--text-primary)] font-semibold">Not sure which one fits?</span> Pick Custom Build and we'll help you figure out the right setup during a free 30-minute call — no commitment needed.
                </p>
            </motion.div>


        </div>
    );
}
