import {
    Globe, Palette, Search, Share2, FileText, BarChart3,
    Server, ArrowRight, ArrowLeft, CheckCircle2, DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURES = [
    {
        icon: Globe,
        title: 'Custom Website Design & Development',
        price: 999,
        description:
            'A blazing-fast, responsive website built from scratch — no templates. Tailored to your brand, optimized for every screen size, and engineered for performance.',
    },
    {
        icon: Palette,
        title: 'Brand Identity System',
        price: 499,
        description:
            'Logo, color palette, typography, and design guidelines that give your business a cohesive, premium visual identity across every touchpoint.',
    },
    {
        icon: Search,
        title: 'SEO & Performance Optimization',
        price: 399,
        description:
            'On-page SEO, structured data, Core Web Vitals optimization, and keyword strategy to make sure your audience finds you first.',
    },
    {
        icon: Share2,
        title: 'Social Media CI/CD Automation',
        price: 349,
        description:
            'We automate the deployment pipeline for your social media content — scheduling, cross-posting, and analytics integration. You create the content; we handle the infrastructure.',
    },
    {
        icon: FileText,
        title: 'Content Management System',
        price: 449,
        description:
            'An intuitive CMS so you can update pages, publish blog posts, and manage media without touching a line of code.',
    },
    {
        icon: BarChart3,
        title: 'Analytics & Reporting Dashboard',
        price: 299,
        description:
            "Real-time visitor analytics, conversion tracking, and custom dashboards so you always know what is working.",
    },
    {
        icon: Server,
        title: 'Domain & Hosting Setup',
        price: 199,
        description:
            'We handle domain registration, SSL certificates, CDN configuration, and hosting deployment — your site is live and secure from day one.',
    },
];

const BENEFITS = [
    '24/7 online availability — your business never sleeps',
    'Mobile-first, responsive on every device',
    'Sub-second load times with edge deployment',
    'Update content anytime through the CMS',
    'Built-in SEO that compounds over time',
    'Scalable architecture that grows with you',
];

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function ProjectPresence() {
    return (
        <div className="container py-16 flex flex-col flex-grow">
            {/* Back link */}
            <motion.div {...fadeUp} className="mb-8">
                <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Projects
                </Link>
            </motion.div>

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 mb-8"
            >
                <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                <div className="badge badge-online">PROTOCOL_01: DIGITAL PRESENCE</div>
            </motion.div>

            {/* Hero */}
            <div className="mb-20">
                <motion.h1
                    {...fadeUp}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-display tracking-tight mb-6"
                >
                    Digital <span className="text-[var(--accent-orange)]">Presence.</span>
                </motion.h1>
                <motion.p
                    {...fadeUp}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed"
                >
                    Your complete online identity — designed, built, and deployed. We engineer everything from the website to SEO to social-media automation, so your brand is always on and always polished.
                </motion.p>
                <motion.p
                    {...fadeUp}
                    transition={{ delay: 0.25 }}
                    className="text-sm text-[var(--text-muted)] font-mono mt-4"
                >
                    // Social media content creation remains your domain — we automate the pipeline.
                </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Included Modules // 01</span>
                </div>
                <h2 className="text-3xl font-display uppercase tracking-tight">What's Included</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                {FEATURES.map((f, i) => (
                    <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 + i * 0.07 }}
                        className="glass-panel p-6 flex flex-col group hover:border-[rgba(245,158,11,0.3)] transition-colors"
                    >
                        <div className="w-10 h-10 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center mb-5 group-hover:bg-[rgba(245,158,11,0.2)] transition-colors">
                            <f.icon className="text-[var(--accent-orange)]" size={20} />
                        </div>
                        <h3 className="text-base font-bold mb-2">{f.title}</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{f.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Pricing Breakdown */}
            <motion.div {...fadeUp} transition={{ delay: 0.45 }} className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Pricing Estimate // 01.5</span>
                </div>
                <h2 className="text-3xl font-display uppercase tracking-tight">Investment</h2>
            </motion.div>

            <motion.div
                {...fadeUp}
                transition={{ delay: 0.48 }}
                className="glass-panel p-8 max-w-2xl mb-24 border border-[rgba(245,158,11,0.15)]"
            >
                <div className="space-y-4 font-mono text-sm mb-6">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="flex justify-between items-center group">
                            <span className="text-[var(--text-secondary)] group-hover:text-white transition-colors">{f.title}</span>
                            <span className="tabular-nums text-[var(--text-muted)]">${f.price}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-[rgba(245,158,11,0.2)] pt-4 flex justify-between items-baseline">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Package Total</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-display font-bold text-[var(--accent-orange)]">
                            ${FEATURES.reduce((s, f) => s + f.price, 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">one-time</span>
                    </div>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] font-mono mt-3">* Starting estimate. Final quote based on project scope and complexity.</p>
                <div className="mt-4 pt-4 border-t border-[rgba(245,158,11,0.1)]">
                    <Link to="/pricing" className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors">
                        <DollarSign size={12} />
                        View ongoing maintenance plans →
                    </Link>
                </div>
            </motion.div>

            {/* Benefits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                <motion.div {...fadeUp} transition={{ delay: 0.5 }}>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Key Metrics // 02</span>
                    </div>
                    <h2 className="text-3xl font-display uppercase tracking-tight mb-8">Why It Matters</h2>
                    <ul className="flex flex-col gap-4">
                        {BENEFITS.map((b) => (
                            <li key={b} className="flex items-start gap-3 text-[var(--text-secondary)] text-sm">
                                <CheckCircle2 size={16} className="text-[var(--accent-orange)] shrink-0 mt-0.5" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* CTA Card */}
                <motion.div
                    {...fadeUp}
                    transition={{ delay: 0.6 }}
                    className="glass-panel p-8 flex flex-col justify-between border border-[rgba(245,158,11,0.2)] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-48 h-48 bg-[var(--accent-orange)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-display font-bold mb-4">Ready to go live?</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
                            Tell us about your business and we'll architect the perfect digital presence for you. Free consultation, no strings attached.
                        </p>
                        <Link
                            to="/contact"
                            className="btn btn-primary inline-flex items-center gap-2 text-sm font-bold tracking-widest"
                        >
                            Initialize Project <ArrowRight size={16} />
                        </Link>
                        <p className="text-[var(--text-muted)] text-xs font-mono mt-6">
                            → Average deployment: 2–4 weeks
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
