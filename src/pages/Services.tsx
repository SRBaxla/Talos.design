import { LayoutGrid, Bot, Settings, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const TABS = [
    { id: 'web-design', label: 'Web Design' },
    { id: 'chatbots', label: 'AI Chatbots' },
    { id: 'automation', label: 'System Automation' },
];

const services = [
    {
        id: 'web-design',
        number: '01',
        icon: LayoutGrid,
        title: 'High-Converting Websites',
        benefit: 'Turn Visitors Into Paying Customers',
        description:
            'We build high-performance, fully custom websites that load in under 1 second, build market trust, and turn casual visitors into paying clients on every device.',
        features: [
            'Mobile-first & ultra-fast load speed',
            'Google Search & SEO setup',
            'Built-in WhatsApp lead button',
            'Easy admin panel for updating photos & pricing',
            'Integrated client booking & inquiry forms',
        ],
        to: '/services/web-design',
        accentColor: 'var(--accent-orange)',
        accentBg: 'rgba(210,193,182,0.08)',
        accentBorder: 'rgba(210,193,182,0.25)',
    },
    {
        id: 'chatbots',
        number: '02',
        icon: Bot,
        title: 'AI Sales & Inquiry Assistants',
        benefit: 'Turn Routine Inquiries Into Qualified Leads',
        description:
            'We configure and deploy AI assistants that answer routine questions, capture prospect details, and route qualified conversations to your human team on WhatsApp and Web.',
        features: [
            'Trained on your actual products, pricing & FAQs',
            'Captures visitor contact details & project scope',
            'Seamless escalation to human team members',
            'Direct integration with WhatsApp Business & Web',
            'Automated lead sync to CRM & Google Sheets',
        ],
        to: '/services/chatbots',
        accentColor: 'var(--accent-cyan)',
        accentBg: 'rgba(69,104,130,0.08)',
        accentBorder: 'rgba(69,104,130,0.25)',
    },
    {
        id: 'automation',
        number: '03',
        icon: Settings,
        title: 'Workflow Automation',
        benefit: 'Save 20+ Hours of Admin Work Weekly',
        description:
            'We map your operational bottlenecks and build automated pipelines that connect your payment gateways, CRM, and communications so you can focus on revenue growth.',
        features: [
            'Automated invoice generation & PDF mailing',
            'Auto-sync leads directly into CRM & Google Sheets',
            'Instant WhatsApp deal & payment alerts',
            'Real-time operational dashboards',
            'Recovers 20+ hours weekly per team member',
        ],
        to: '/services/automation',
        accentColor: 'var(--accent-orange)',
        accentBg: 'rgba(210,193,182,0.08)',
        accentBorder: 'rgba(210,193,182,0.25)',
    },
];

export default function Services() {
    const [activeTab, setActiveTab] = useState('web-design');

    // Highlight tab based on scroll position
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveTab(entry.target.id);
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );
        TABS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const OFFSET = 64 + 48 + 16; // navbar + tab bar + breathing room
        const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col flex-grow w-full">

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <div className="relative w-full py-24 flex flex-col items-center justify-center border-b border-[rgba(255,255,255,0.05)]">
                <div className="container flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="badge badge-active mb-8 font-mono text-xs"
                    >
                        [SERVICES: ACTIVE]
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display tracking-tight mb-6 leading-[1.1] max-w-4xl"
                    >
                        Everything We <br />
                        <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Build For You</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10"
                    >
                        Three focused services — web, AI, and automation — delivered end-to-end for businesses that want results, not just deliverables.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4"
                    >
                        <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)]">
                            Book a Free Call
                        </Link>
                        <Link to="/packages" className="btn btn-outline py-3 px-8">
                            Explore Packages
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* ── STICKY TAB NAV ───────────────────────────────────────────── */}
            <div className="sticky top-[64px] z-40 w-full bg-[var(--bg-base)] border-b border-[var(--border-color)] backdrop-blur-md">
                <div className="container flex gap-0 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => scrollTo(tab.id)}
                            className={`px-6 py-4 text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id
                                ? 'border-[var(--accent-orange)] text-[var(--text-primary)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── SERVICE SECTIONS ─────────────────────────────────────────── */}
            <div className="container py-0 flex flex-col items-center">
                {services.map((svc, i) => {
                    const Icon = svc.icon;
                    return (
                        <section
                            key={svc.id}
                            id={svc.id}
                            className="w-full max-w-5xl py-24 border-b border-[var(--border-color)] last:border-0"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ delay: i * 0.05 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                            >
                                {/* Left — text content */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{ background: svc.accentBg, border: `1px solid ${svc.accentBorder}` }}
                                        >
                                            <Icon size={22} style={{ color: svc.accentColor }} />
                                        </div>
                                        <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">{svc.number}</span>
                                    </div>

                                    <h2 className="text-4xl font-display uppercase tracking-tight mb-3">{svc.title}</h2>
                                    <p className="text-lg font-medium mb-6" style={{ color: svc.accentColor }}>{svc.benefit}</p>
                                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">{svc.description}</p>

                                    <Link
                                        to={svc.to}
                                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:gap-3"
                                        style={{ color: svc.accentColor }}
                                    >
                                        Full details <ArrowRight size={14} />
                                    </Link>
                                </div>

                                {/* Right — feature list */}
                                <div
                                    className="glass-panel p-8 rounded-2xl"
                                    style={{ borderColor: svc.accentBorder }}
                                >
                                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-5">What's included</div>
                                    <ul className="flex flex-col gap-4">
                                        {svc.features.map((feat) => (
                                            <li key={feat} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                                                <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: svc.accentColor }} />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </section>
                    );
                })}
            </div>

            {/* ── CTA ──────────────────────────────────────────────────────── */}
            <div className="container py-16 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl border border-[var(--border-color)] p-10 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl bg-[rgba(255,255,255,0.01)] backdrop-blur-sm relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(210,193,182,0.04)] to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-display mb-2">Not sure which service fits?</h2>
                        <p className="text-[var(--text-secondary)]">Book a free 30-minute call — we'll map the right solution for your business.</p>
                    </div>
                    <div className="relative z-10">
                        <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)] whitespace-nowrap">
                            Book a Free Call
                        </Link>
                    </div>
                </motion.div>
            </div>

        </div>
    );
}
