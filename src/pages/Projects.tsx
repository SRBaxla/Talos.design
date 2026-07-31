import { Globe, Bot, Wrench, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PROJECTS = [
    {
        id: 'presence',
        label: 'PACKAGE 01',
        title: 'Digital Business Launch',
        accent: 'orange',
        icon: Globe,

        description:
            'Establish immediate market credibility and capture qualified online leads with a high-performance web presence tailored for your business.',
        highlights: [
            'Custom high-converting website design',
            'Mobile-first & 1-second load speed',
            'Google Business & Local SEO setup',
            'Instant WhatsApp click-to-chat button',
            'Easy admin content manager',
            'Analytics & lead reporting',
        ],
        cta: 'Explore Package 01',
        path: '/projects/presence',
    },
    {
        id: 'automation',
        label: 'PACKAGE 02 — MOST POPULAR',
        title: 'Automated Growth Engine',
        accent: 'cyan',
        icon: Bot,

        description:
            'Automate bookings, customer inquiries, client follow-ups, and invoicing with 24/7 intelligent AI systems — zero extra staff required.',
        highlights: [
            '24/7 AI WhatsApp & Web sales bot',
            'Automated lead qualification & capture',
            'Instant CRM & Google Sheets sync',
            'Automated invoice generation & emailing',
            'WhatsApp payment & deal alerts',
            'Real-time business performance reporting',
        ],
        cta: 'Explore Package 02',
        path: '/projects/automation',
    },
    {
        id: 'custom',
        label: 'PACKAGE 03 — ENTERPRISE',
        title: 'Custom Business Platform',
        accent: 'orange',
        icon: Wrench,

        description:
            'Tailored software architecture, custom ERPs, client portals, and specialized operational workflows built specifically for your enterprise.',
        highlights: [
            'Tailored workflow architecture',
            'Custom web portals & admin dashboards',
            'Dedicated 1-on-1 priority support',
            'Fixed pricing & phased milestone delivery',
        ],
        cta: 'Explore Custom Build',
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
