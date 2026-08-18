import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Database, Server, ShieldCheck, Workflow, 
    Cloud, Activity, Clock, ArrowRight, Sparkles, Layers
} from 'lucide-react';

const INFRASTRUCTURE_PILLARS = [
    {
        icon: Server,
        title: 'API Architecture & Gateways',
        description: 'High-performance REST & WebSocket APIs with structured payloads, edge rate limiting, and strict type safety.',
        badge: 'Core Services'
    },
    {
        icon: Database,
        title: 'PostgreSQL & Data Modeling',
        description: 'ACID-compliant relational architectures with Row Level Security (RLS) for multi-tenant data isolation.',
        badge: 'Storage'
    },
    {
        icon: Workflow,
        title: 'Data Pipelines & Event Streams',
        description: 'Reliable webhook ingestion, asynchronous message brokers, and automated synchronization across platforms.',
        badge: 'Pipelines'
    },
    {
        icon: ShieldCheck,
        title: 'Authentication & Access Control',
        description: 'Secure token-based auth, OAuth 2.0 integrations, granular role-based permissions (RBAC), and audit trails.',
        badge: 'Security'
    },
    {
        icon: Cloud,
        title: 'Cloud & Container Deployment',
        description: 'Dockerized microservices, serverless compute functions, edge CDN asset delivery, and automated CI/CD pipelines.',
        badge: 'Infrastructure'
    },
    {
        icon: Clock,
        title: 'Background Jobs & Automation',
        description: 'Distributed worker queues, scheduled cron tasks, fault-tolerant retry handlers, and PDF/document generation.',
        badge: 'Execution'
    },
    {
        icon: Activity,
        title: 'Telemetry & System Health',
        description: 'Real-time performance monitoring, structured error logging, endpoint health diagnostics, and uptime reliability.',
        badge: 'Reliability'
    },
    {
        icon: Layers,
        title: 'Modular SaaS Architecture',
        description: 'Composable service boundaries enabling rapid extension into custom business platforms, client portals, and vertical solutions.',
        badge: 'Architecture'
    }
];

export default function Systems() {
    return (
        <div className="container py-16 flex flex-col flex-grow text-white">
            {/* Header */}
            <div className="mb-16 text-center max-w-3xl mx-auto">
                <span className="badge font-mono text-xs text-[var(--accent-cyan)] border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block font-bold">
                    SYSTEMS &amp; ARCHITECTURE
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight uppercase leading-[0.95] mb-6">
                    Backend &amp; <span className="text-gradient-orange">Systems Engineering.</span>
                </h1>
                <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                    Robust digital infrastructure engineered for scalability, data security, high-throughput APIs, and automated business workflows.
                </p>
            </div>

            {/* Technical Systems Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {INFRASTRUCTURE_PILLARS.map((pillar, i) => (
                    <motion.div
                        key={pillar.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-cyan)]/50 transition-all flex flex-col justify-between group"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[rgba(69,104,130,0.15)] flex items-center justify-center text-[var(--accent-cyan)] group-hover:scale-110 transition-transform">
                                    <pillar.icon size={20} />
                                </div>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border border-white/5 px-2 py-0.5 rounded">
                                    {pillar.badge}
                                </span>
                            </div>
                            <h3 className="text-base font-bold uppercase tracking-tight text-white mb-2">{pillar.title}</h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{pillar.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Vertical Solution Callout: MediLife Reference */}
            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-[var(--accent-orange)]/30 bg-black/40 relative overflow-hidden mb-16 shadow-xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="max-w-2xl space-y-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
                            <Sparkles size={12} className="animate-pulse" /> PRODUCTION DEPLOYMENT EXAMPLE
                        </span>
                        <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                            Vertical Software in Practice: <span className="text-gradient-orange">MediLife Clinic Engine</span>
                        </h2>
                        <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                            MediLife is an example of an end-to-end vertical solution engineered with our systems infrastructure — featuring PostgreSQL RLS data segregation, pathologist verification gates, and automated WhatsApp PDF dispatch pipelines.
                        </p>
                    </div>
                    <Link
                        to="/solutions/medilife"
                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/15 transition-all shrink-0 hover:border-[var(--accent-orange)]"
                    >
                        Inspect MediLife Solution <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center p-8 rounded-3xl glass-panel border border-[var(--border-color)]">
                <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-2">Need Custom System Architecture?</h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-lg mx-auto mb-6">
                    From relational database modeling to complex multi-service automations, we architect reliable backend solutions tailored to your operational scale.
                </p>
                <Link
                    to="/contact"
                    className="btn btn-primary px-8 py-3 text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
                >
                    Discuss System Architecture <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}
