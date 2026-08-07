import { Settings, Workflow, Layers, Clock, Database, CheckCircle, Bell, Mail, Repeat, ArrowRight, Zap, Play, Activity, Globe, Printer, ExternalLink, ShieldCheck, Cpu, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FEATURES = [
    { icon: Workflow, title: 'Seamless Scalability', description: 'Systems built to handle 10 to 10,000 daily orders without requiring linear headcount growth.' },
    { icon: Bell, title: 'Real-Time Event Triggers', description: 'Instantly notify your sales team or clients the second an inquiry, booking, or payment is placed.' },
    { icon: Database, title: '100% Data Accuracy', description: 'Automated CRM and database synchronization so client information is always up to date.' },
    { icon: Mail, title: 'Automated Invoicing & Billing', description: 'Automatically generate, attach, and email professional invoices upon payment confirmation.' },
    { icon: Clock, title: 'Time-Saving Workflows', description: 'Recover 20+ hours of manual administrative labor weekly per team member.' },
    { icon: Repeat, title: 'Reliable & Error-Free', description: 'Built-in fail-safe logic ensuring zero dropped leads, lost orders, or billing mistakes.' },
];

const TECH_STACK = ['Zapier & Make Automation', 'Custom Python Pipelines', 'Razorpay & Payment Sync', 'Google & CRM Integration'];

function SystemHealth() {
    return (
        <div className="glass-panel p-8 rounded-[3rem] border border-[rgba(245,158,11,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">System Nominal</span>
                </div>
            </div>
            
            <div className="mb-10">
                <h4 className="text-sm font-mono text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2 text-gradient-orange">Throughput Monitor</h4>
                <div className="text-4xl font-black tracking-tighter text-white">1,240 <span className="text-sm font-normal text-[var(--text-secondary)] uppercase tracking-widest ml-2">Req/Min</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">API Latency</div>
                    <div className="text-xl font-bold text-[var(--accent-orange)] text-glow-orange">12ms</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">Log Success</div>
                    <div className="text-xl font-bold text-white">100%</div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-4">Encryption Status</div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="w-2 h-6 rounded-sm bg-[var(--accent-orange)] opacity-40 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    </div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">AES-256 Active</div>
                </div>
            </div>
        </div>
    );
}

function WorkflowVisualizer() {
    return (
        <div className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-[2.5rem] border border-[var(--border-color)] relative overflow-hidden bg-black/20">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            
            <div className="relative z-10 flex flex-col items-center gap-12">
                {/* Node 1 */}
                <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-orange-glow)] flex items-center justify-center shadow-xl">
                        <Zap className="text-[var(--accent-orange)]" size={32} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-orange)]">Trigger</span>
                </motion.div>

                {/* Connector 1 */}
                <div className="h-12 w-0.5 bg-dashed-gradient relative">
                    <motion.div 
                        initial={{ top: 0 }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute w-2 h-2 -left-[3px] bg-[var(--accent-orange)] rounded-full shadow-[0_0_10px_var(--accent-orange)]"
                    />
                </div>

                {/* Node 2 - Processing */}
                <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-surface-elevated)] border-2 border-[var(--accent-orange)] flex items-center justify-center shadow-2xl relative">
                        <div className="absolute inset-0 border-2 border-[var(--accent-orange)] rounded-full animate-ping opacity-20" />
                        <Settings className="text-[var(--accent-orange)] animate-spin-slow" size={40} />
                    </div>
                    <div className="flex gap-1 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-primary)]">Logical Forge</span>
                </motion.div>

                {/* Connector 2 */}
                <div className="h-12 w-0.5 bg-dashed-gradient relative">
                    <motion.div 
                        initial={{ top: 0 }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.75 }}
                        className="absolute w-2 h-2 -left-[3px] bg-[var(--accent-orange)] rounded-full shadow-[0_0_10px_var(--accent-orange)]"
                    />
                </div>

                {/* End Nodes */}
                <div className="flex gap-16">
                    <motion.div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center justify-center">
                            <Database className="text-[var(--text-muted)]" size={24} />
                        </div>
                        <span className="text-[9px] font-mono uppercase text-[var(--text-muted)]">Vault Sync</span>
                    </motion.div>
                    <motion.div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center justify-center">
                            <Mail className="text-[var(--text-muted)]" size={24} />
                        </div>
                        <span className="text-[9px] font-mono uppercase text-[var(--text-muted)]">Broadcast</span>
                    </motion.div>
                </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-tight">
                <div className="flex items-center gap-2"><Play size={10} className="text-[var(--accent-orange)]" /> System Active</div>
                <div className="flex items-center gap-2"><Activity size={10} /> Latency: 4ms</div>
            </div>
        </div>
    );
}

export default function Systems() {
    return (
        <div className="container py-24 min-h-screen px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-24 md:mb-32"
            >
                <div className="badge badge-active mb-6 tracking-widest">[BUSINESS WORKFLOW AUTOMATION]</div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl mb-6 font-display font-bold tracking-tight uppercase leading-[1.05]">Workflow & Operations <br /><span className="text-gradient-orange text-glow-orange">Automation Systems</span></h1>
                <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed border-l-2 border-[var(--accent-orange)] pl-6 italic">
                    "Stop wasting hours on copy-pasting client data, manual invoicing, and status updates. We automate your backend operations so your business can scale without extra admin costs."
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    <div className="px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-[2rem] glass-panel border border-[rgba(245,158,11,0.1)] text-center">
                        <div className="text-xl md:text-2xl font-black text-[var(--accent-orange)]">20+ Hours</div>
                        <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Saved Weekly / Staff</div>
                    </div>
                    <div className="px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-[2rem] glass-panel border border-[rgba(245,158,11,0.1)] text-center">
                        <div className="text-xl md:text-2xl font-black text-white">100%</div>
                        <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Billing Accuracy</div>
                    </div>
                </div>
            </motion.div>

            {/* Workflow Visualizer Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-40">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="order-2 lg:order-1"
                >
                    <div className="badge badge-online mb-6">Architecture</div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-tighter decoration-[var(--accent-orange)] decoration-4 underline underline-offset-8">Logic Built <br />to Scale.</h2>
                    <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-10">
                        Stop acting as a bridge between your tools. We build the digital glue that makes your software stack talk to each other, ensuring data integrity and real-time responsiveness across your entire operation.
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {TECH_STACK.map(tech => (
                            <span key={tech} className="px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-[var(--border-color)] text-[9px] md:text-[10px] uppercase tracking-widest bg-[rgba(255,255,255,0.02)]">
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="order-1 lg:order-2"
                >
                    <WorkflowVisualizer />
                </motion.div>
            </div>

            {/* Features Grid */}
            <div className="mb-24 md:mb-40">
                <h3 className="text-3xl font-bold mb-12 flex items-center gap-4 uppercase tracking-tighter">
                    <Zap className="text-[var(--accent-orange)]" size={32} /> Capabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-8 md:p-10 group hover:border-[rgba(245,158,11,0.2)] transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[rgba(245,158,11,0.08)] flex items-center justify-center mb-6 group-hover:bg-[rgba(245,158,11,0.15)] transition-colors">
                                <f.icon size={24} className="text-[var(--accent-orange)]" />
                            </div>
                            <h4 className="text-lg font-bold mb-3 uppercase tracking-tight">{f.title}</h4>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Engineering Capabilities: Full-Stack Vertical Suites & Systems */}
            <div className="mb-24 md:mb-40">
                <div className="text-center mb-12 md:mb-16">
                    <div className="badge badge-active mb-4 font-mono text-xs tracking-widest uppercase flex items-center gap-1.5 justify-center mx-auto w-fit">
                        <Cpu size={12} className="animate-pulse" /> SYSTEM PROTOTYPES & CAPABILITY DEMOS
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                        Engineering Capabilities: <br />
                        <span className="text-gradient-orange">Full-Stack Vertical Suites</span>
                    </h2>
                    <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed mt-4 italic border-l-2 border-[var(--accent-orange)] pl-6 text-left">
                        "This is the caliber of custom digital infrastructure we can build for your business. The system architecture prototypes below demonstrate our capability to design, deploy, and scale complex B2B vertical platforms."
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Prototype Card 1: Medilife WaaS */}
                    <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-[var(--accent-orange)]/40 relative overflow-hidden bg-black/40">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
                            <div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30 mb-3 inline-block">
                                    PROTOTYPE CAPABILITY DEMO
                                </span>
                                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Medilife WaaS (Website-as-a-Service) Platform</h3>
                                <p className="text-xs font-mono text-[var(--accent-cyan)] mt-1">Multi-Tenant Diagnostic Laboratory SaaS Architecture</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <a href="https://timely-rolypoly-3a7789.netlify.app/" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl bg-[var(--accent-cyan)] text-[#07090E] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                                    Launch Live Medilife <ExternalLink size={14} />
                                </a>
                                <Link to="/projects/medilife" className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all flex items-center gap-2 border border-white/10">
                                    Inspect Blueprint →
                                </Link>
                            </div>
                        </div>

                        {/* Projected Capability Claims */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                <div className="text-2xl font-black font-mono text-amber-400">2+ Hours / Day</div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">Engineered Time Recovery</div>
                                <p className="text-[11px] text-[var(--text-secondary)] mt-1">Designed to eliminate manual clinic report typing & phone calls.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                <div className="text-2xl font-black font-mono text-emerald-400">100% Retained</div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">Margin Protection</div>
                                <p className="text-[11px] text-[var(--text-secondary)] mt-1">Designed to keep direct patient bookings local without call center fees.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                                <div className="text-2xl font-black font-mono text-sky-400">3.4x Target</div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">Patient Retention</div>
                                <p className="text-[11px] text-[var(--text-secondary)] mt-1">Architected for automated 6-month checkup reminders & campaign blasts.</p>
                            </div>
                        </div>

                        {/* 5 Architecture Pillar Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-orange)] uppercase">
                                    <Globe size={14} /> 01. Multi-Tenant Subdomain Engine
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    TenantResolver middleware maps wildcard subdomains, injecting dynamic CSS custom properties from PostgreSQL in 12ms without code re-deployments.
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-cyan)] uppercase">
                                    <Zap size={14} /> 02. Asynchronous Meta Webhooks
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    Supabase Edge Functions deliver sub-50ms HTTP 200 acknowledgments, delegating conversion funnel mathematical aggregations to PostgreSQL database triggers.
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                                    <ShieldCheck size={14} /> 03. Idempotent Provisioning & RLS
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    500ms debounced live URL validator, network idempotency via event deduplication, and tenant data isolation enforced by PostgreSQL Row Level Security (RLS).
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase">
                                    <DollarSign size={14} /> 04. Modular Hybrid Pricing
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    Decouples platform subscriptions from pay-as-you-go Meta WhatsApp credit wallets with real-time pre-flight audience dispatch budget estimation.
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 lg:col-span-2">
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase">
                                    <Printer size={14} /> 05. PABS ASTM/HL7 Hardware Bridge
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    Electron/Node.js desktop bridge listening continuously to local pathology analyzer RS232 & TCP socket ports, parsing ASTM E1381 & HL7 payloads for direct cloud PDF WhatsApp dispatch.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Prototype Card 2: Multi-Property Hotel PMS Engine */}
                    <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-[var(--accent-cyan)]/40 relative overflow-hidden bg-black/40">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
                            <div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 mb-3 inline-block">
                                    PROTOTYPE CAPABILITY DEMO
                                </span>
                                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Multi-Property Hotel PMS & ERP Engine</h3>
                                <p className="text-xs font-mono text-[var(--accent-orange)] mt-1">Dockerized Microservices Hospitality Core</p>
                            </div>
                        </div>

                        {/* Projected Capability Claims */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                                <div className="text-2xl font-black font-mono text-[var(--accent-cyan)]">&lt; 400ms</div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">Web-to-Desk Sync Target</div>
                                <p className="text-[11px] text-[var(--text-secondary)] mt-1">Architected for instantaneous guest booking updates across property nodes.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                <div className="text-2xl font-black font-mono text-emerald-400">0 Collisions</div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">Double-Booking Guarantee</div>
                                <p className="text-[11px] text-[var(--text-secondary)] mt-1">Redis atomic room availability locks across OTAs & direct engines.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                                <div className="text-2xl font-black font-mono text-purple-400">Multi-Tenant</div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider">Property Scalability</div>
                                <p className="text-[11px] text-[var(--text-secondary)] mt-1">Centralized PMS swarm serving multiple boutique property locations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Efficiency Gap Section */}
            <div className="mb-24 md:mb-40">
                <div className="text-center mb-12 md:mb-16">
                    <div className="badge badge-outline mb-4 text-[var(--accent-orange)] tracking-widest uppercase">The ROI Argument</div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">The Efficiency <br /><span className="text-gradient-orange">Gap.</span></h2>
                </div>
                
                <div className="glass-panel overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[rgba(255,255,255,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px] md:min-w-0">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Metric</th>
                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Manual Operations</th>
                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-mono text-[var(--accent-orange)] uppercase tracking-widest font-bold">Talos Systems</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { metric: 'Reliability', manual: 'Human Error Risk', talos: '100% Deterministic', icon: CheckCircle },
                                    { metric: 'Latency', manual: 'Hours/Days', talos: '< 100ms Execution', icon: Zap },
                                    { metric: 'Scalability', manual: 'Linear Hiring Costs', talos: 'Fixed Infrastructure', icon: Layers },
                                    { metric: 'Consistency', manual: 'Variable Outcomes', talos: 'Strict Logic Protocols', icon: Settings }
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 md:px-8 py-5 md:py-6 font-bold uppercase tracking-tighter text-base md:text-lg">{row.metric}</td>
                                        <td className="px-6 md:px-8 py-5 md:py-6 text-[var(--text-secondary)] text-sm md:text-base">{row.manual}</td>
                                        <td className="px-6 md:px-8 py-5 md:py-6 text-white font-medium flex items-center gap-2 md:gap-3 text-sm md:text-base">
                                            <row.icon size={16} className="text-[var(--accent-orange)]" />
                                            {row.talos}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Industrial-Grade Performance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-40">
                <div className="order-2 lg:order-1">
                    <SystemHealth />
                </div>
                <div className="order-1 lg:order-2 px-4">
                    <div className="badge badge-outline mb-6 tracking-widest text-[var(--accent-orange)] uppercase">[Industrial Grade]</div>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">Beyond <br /><span className="text-gradient-orange text-glow-orange">Benchmarks.</span></h2>
                    <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-8 leading-relaxed max-w-xl opacity-80">
                        Our systems aren't just faster—they're more secure. We implement military-grade encryption and zero-downtime deployment cycles to ensure your digital backbone is unbreakable.
                    </p>
                    <ul className="space-y-4">
                        {['AES-256 Encryption', 'Auto-Scaling Infrastructure', 'Redundant Logic Failovers', 'Real-time Health Audits'].map(item => (
                            <li key={item} className="flex items-center gap-3 text-xs md:text-sm font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange)]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-10 md:p-16 glass-panel rounded-[2.5rem] md:rounded-[4rem] text-center relative overflow-hidden border border-[var(--accent-orange-glow)] mb-12"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(245,158,11,0.05)] to-transparent pointer-events-none" />
                <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">Ready to <br /><span className="text-gradient-orange">Automate?</span></h2>
                <p className="text-[var(--text-secondary)] mb-12 max-w-xl mx-auto text-lg md:text-xl leading-relaxed px-4 opacity-80">
                    "Every manual task is a hidden tax on your growth. Let's build the digital infrastructure that frees your team to focus on high-stakes strategy."
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                    <button className="btn btn-primary px-8 md:px-12 py-4 md:py-5 text-xs md:text-sm shadow-[0_0_30px_var(--accent-orange-glow)] flex items-center justify-center gap-3">
                        Request System Audit <ArrowRight size={18} />
                    </button>
                    <button className="btn btn-outline px-8 md:px-12 py-4 md:py-5 text-xs md:text-sm">Explore Case Studies</button>
                </div>
            </motion.div>
        </div>
    );
}
