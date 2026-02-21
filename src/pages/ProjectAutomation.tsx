import {
    CalendarCheck, MessageSquareText, Package, Bell,
    Users, BarChart3, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURES = [
    {
        icon: CalendarCheck,
        title: 'AI-Powered Booking & Reservation',
        description:
            'Let customers book appointments, reserve slots, or schedule services 24/7 through an intelligent system that handles conflicts, waitlists, and reminders automatically.',
    },
    {
        icon: MessageSquareText,
        title: 'Automated Query Handling',
        description:
            'AI chatbot + smart email routing that answers common questions instantly, escalates complex issues, and keeps a full conversation history.',
    },
    {
        icon: Package,
        title: 'Inventory & Service Management',
        description:
            'Real-time dashboards to track stock levels, service availability, and resource allocation. Automated alerts when something needs attention.',
    },
    {
        icon: Bell,
        title: 'Notification & Alert System',
        description:
            'SMS, email, and push notifications triggered by events — booking confirmations, low-stock alerts, payment receipts, and custom triggers you define.',
    },
    {
        icon: Users,
        title: 'CRM Integration',
        description:
            'Centralize every customer interaction. Auto-sync with your existing CRM or use our built-in customer management to track leads, history, and lifetime value.',
    },
    {
        icon: BarChart3,
        title: 'Real-Time Reporting & Analytics',
        description:
            'Dashboards that show revenue, booking trends, query volume, and operational health in real time — so you make decisions with data, not guesses.',
    },
];

const BENEFITS = [
    'Zero manual work for routine operations',
    '24/7 availability — systems never call in sick',
    'Real-time updates across all channels',
    'Scales effortlessly as your business grows',
    'Reduces human error to near-zero',
    'Recovers staff hours for high-value tasks',
];

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function ProjectAutomation() {
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
                <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                <div className="badge badge-active">PROTOCOL_02: SMART AUTOMATION</div>
            </motion.div>

            {/* Hero */}
            <div className="mb-20">
                <motion.h1
                    {...fadeUp}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-display tracking-tight mb-6"
                >
                    Smart <span className="text-[var(--accent-cyan)]">Automation.</span>
                </motion.h1>
                <motion.p
                    {...fadeUp}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed"
                >
                    Eliminate manual work from your daily operations. We build intelligent systems that handle bookings, queries, inventory, and service management around the clock.
                </motion.p>
            </div>

            {/* Clarification banner */}
            <motion.div
                {...fadeUp}
                transition={{ delay: 0.25 }}
                className="glass-panel p-5 flex items-start gap-3 mb-16 border border-[rgba(0,229,255,0.15)] max-w-3xl"
            >
                <AlertTriangle size={18} className="text-[var(--accent-cyan)] shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    <span className="text-white font-semibold">Digital-only automation.</span> We handle everything that can be automated digitally — bookings, queries, inventory tracking, notifications, dashboards. Physical task management (e.g., deliveries, on-site work) is outside our scope.
                </p>
            </motion.div>

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
                        className="glass-panel p-6 flex flex-col group hover:border-[rgba(0,229,255,0.3)] transition-colors"
                    >
                        <div className="w-10 h-10 rounded bg-[rgba(0,229,255,0.1)] flex items-center justify-center mb-5 group-hover:bg-[rgba(0,229,255,0.2)] transition-colors">
                            <f.icon className="text-[var(--accent-cyan)]" size={20} />
                        </div>
                        <h3 className="text-base font-bold mb-2">{f.title}</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{f.description}</p>
                    </motion.div>
                ))}
            </div>



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
                                <CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0 mt-0.5" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* CTA Card */}
                <motion.div
                    {...fadeUp}
                    transition={{ delay: 0.6 }}
                    className="glass-panel p-8 flex flex-col justify-between border border-[rgba(0,229,255,0.2)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-cyan)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-display font-bold mb-4">Ready to automate?</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
                            Tell us what you need automated and we'll build the system. Free consultation — we'll map out every workflow before writing a line of code.
                        </p>
                        <Link
                            to="/contact"
                            className="btn inline-flex items-center gap-2 text-sm font-bold tracking-widest bg-[var(--accent-cyan)] text-black hover:bg-white hover:shadow-[0_0_20px_var(--accent-cyan-glow)] transition-all"
                        >
                            Initialize Project <ArrowRight size={16} />
                        </Link>
                        <p className="text-[var(--text-muted)] text-xs font-mono mt-6">
                            → Average deployment: 3–6 weeks
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
