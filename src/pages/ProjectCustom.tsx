import { useState } from 'react';
import {
    Globe, Palette, Search, Share2, FileText, BarChart3, Server,
    CalendarCheck, MessageSquareText, Package, Bell, Users,
    ArrowRight, ArrowLeft, CheckCircle2, Circle, Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Feature {
    id: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    shortDesc: string;
}

const PRESENCE_FEATURES: Feature[] = [
    { id: 'website', icon: Globe, title: 'Custom Website', shortDesc: 'Responsive site built from scratch' },
    { id: 'brand', icon: Palette, title: 'Brand Identity', shortDesc: 'Logo, colors, typography system' },
    { id: 'seo', icon: Search, title: 'SEO Optimization', shortDesc: 'On-page SEO & performance tuning' },
    { id: 'social', icon: Share2, title: 'Social Media CI/CD', shortDesc: 'Automated content deployment' },
    { id: 'cms', icon: FileText, title: 'Content Management', shortDesc: 'Easy-to-use CMS dashboard' },
    { id: 'analytics-p', icon: BarChart3, title: 'Analytics Dashboard', shortDesc: 'Visitor & conversion tracking' },
    { id: 'hosting', icon: Server, title: 'Domain & Hosting', shortDesc: 'SSL, CDN, deployment pipeline' },
];

const AUTOMATION_FEATURES: Feature[] = [
    { id: 'booking', icon: CalendarCheck, title: 'Booking System', shortDesc: 'AI-powered reservations 24/7' },
    { id: 'chatbot', icon: MessageSquareText, title: 'Query Handling', shortDesc: 'Chatbot + smart email routing' },
    { id: 'inventory', icon: Package, title: 'Inventory Management', shortDesc: 'Real-time stock & service tracking' },
    { id: 'notifications', icon: Bell, title: 'Notifications', shortDesc: 'SMS, email, push alerts' },
    { id: 'crm', icon: Users, title: 'CRM Integration', shortDesc: 'Centralized customer data' },
    { id: 'analytics-a', icon: BarChart3, title: 'Reporting & Analytics', shortDesc: 'Real-time operational dashboards' },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function ProjectCustom() {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const allFeatures = [...PRESENCE_FEATURES, ...AUTOMATION_FEATURES];
    const selectedFeatures = allFeatures.filter((f) => selected.has(f.id));
    const presenceCount = PRESENCE_FEATURES.filter((f) => selected.has(f.id)).length;
    const automationCount = AUTOMATION_FEATURES.filter((f) => selected.has(f.id)).length;

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
                <span className="w-2 h-2 rounded-full bg-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.4)]"></span>
                <div className="badge" style={{ borderColor: 'rgba(192,132,252,0.3)', color: '#c084fc' }}>
                    PROTOCOL_03: CUSTOM BUILD
                </div>
            </motion.div>

            {/* Hero */}
            <div className="mb-16">
                <motion.h1
                    {...fadeUp}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-display tracking-tight mb-6"
                >
                    Custom <span style={{ color: '#c084fc' }}>Build.</span>
                </motion.h1>
                <motion.p
                    {...fadeUp}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed"
                >
                    Pick exactly the features you need from both packages. No filler, no compromises — just the systems your business actually requires.
                </motion.p>
            </div>

            {/* Main Grid: Feature Selector + Summary Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
                {/* Feature Selector - Left */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    {/* Presence Features */}
                    <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                            <span className="text-[10px] font-mono text-[var(--accent-orange)] uppercase tracking-widest">Digital Presence Features</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {PRESENCE_FEATURES.map((f) => {
                                const isOn = selected.has(f.id);
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => toggle(f.id)}
                                        className={`glass-panel p-4 flex items-start gap-3 text-left transition-all duration-200 cursor-pointer ${isOn
                                            ? 'border-[rgba(245,158,11,0.4)] bg-[rgba(245,158,11,0.05)]'
                                            : 'hover:border-[rgba(255,255,255,0.15)]'
                                            }`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {isOn ? (
                                                <CheckCircle2 size={18} className="text-[var(--accent-orange)]" />
                                            ) : (
                                                <Circle size={18} className="text-[var(--text-muted)]" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold mb-0.5">{f.title}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{f.shortDesc}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Automation Features */}
                    <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                            <span className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest">Smart Automation Features</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {AUTOMATION_FEATURES.map((f) => {
                                const isOn = selected.has(f.id);
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => toggle(f.id)}
                                        className={`glass-panel p-4 flex items-start gap-3 text-left transition-all duration-200 cursor-pointer ${isOn
                                            ? 'border-[rgba(0,229,255,0.4)] bg-[rgba(0,229,255,0.05)]'
                                            : 'hover:border-[rgba(255,255,255,0.15)]'
                                            }`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {isOn ? (
                                                <CheckCircle2 size={18} className="text-[var(--accent-cyan)]" />
                                            ) : (
                                                <Circle size={18} className="text-[var(--text-muted)]" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold mb-0.5">{f.title}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{f.shortDesc}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* Summary Sidebar - Right */}
                <motion.div
                    {...fadeUp}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-4"
                >
                    <div className="glass-panel p-6 sticky top-24 border border-[rgba(192,132,252,0.2)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c084fc] opacity-[0.04] blur-[60px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(192,132,252,0.1)] flex items-center justify-center">
                                    <Wrench size={20} style={{ color: '#c084fc' }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Your Build</h3>
                                    <p className="text-xs text-[var(--text-muted)] font-mono">
                                        {selected.size} module{selected.size !== 1 ? 's' : ''} selected
                                    </p>
                                </div>
                            </div>

                            {/* Counters */}
                            <div className="flex gap-3 mb-6">
                                <div className="flex-1 bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-[var(--accent-orange)]">{presenceCount}</div>
                                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Presence</div>
                                </div>
                                <div className="flex-1 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.15)] rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-[var(--accent-cyan)]">{automationCount}</div>
                                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Automation</div>
                                </div>
                            </div>

                            {/* Selected list */}
                            <div className="mb-6 min-h-[120px]">
                                <AnimatePresence mode="popLayout">
                                    {selectedFeatures.length === 0 ? (
                                        <motion.p
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-sm text-[var(--text-muted)] italic"
                                        >
                                            Select features from the left to build your custom package.
                                        </motion.p>
                                    ) : (
                                        <ul className="flex flex-col gap-2">
                                            {selectedFeatures.map((f) => (
                                                <motion.li
                                                    key={f.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    layout
                                                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                                                >
                                                    <CheckCircle2 size={14} style={{ color: '#c084fc' }} className="shrink-0" />
                                                    {f.title}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* CTA */}
                            <Link
                                to="/contact"
                                state={{
                                    bundleType: 'Custom Build',
                                    estimatedValue: 'To be determined',
                                    modules: selectedFeatures.map(f => f.title)
                                }}
                                className={`btn w-full flex items-center justify-center gap-2 text-sm font-bold tracking-widest transition-all ${selected.size > 0
                                    ? 'bg-[#c084fc] text-black hover:bg-white hover:shadow-[0_0_20px_rgba(192,132,252,0.4)]'
                                    : 'btn-outline border-[rgba(192,132,252,0.3)] text-[#c084fc] opacity-50 pointer-events-none'
                                    }`}
                            >
                                Submit Requirements <ArrowRight size={16} />
                            </Link>
                            <p className="text-[var(--text-muted)] text-[10px] font-mono mt-3 text-center">
                                {"We'll scope & quote within 48 hours."}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
