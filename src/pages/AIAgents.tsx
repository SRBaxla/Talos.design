import { useState, useEffect } from 'react';
import { Bot, Sparkles, Zap, MessageSquare, Shield, Globe, Brain, Clock, Database, CheckCircle, MousePointer2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AGENT_CAPABILITIES = [
    { icon: MessageSquare, title: 'Linguistic Precision', description: 'Advanced sentiment analysis and intent recognition that captures every nuance of your customer’s query.' },
    { icon: Brain, title: 'Knowledge Anchoring', description: 'Transform static docs into a dynamic brain that provides 100% accurate, hallucination-free business intelligence.' },
    { icon: Clock, title: 'Perpetual Operation', description: 'Zero downtime. Zero distraction. Your digital twin manages 1,000+ support threads simultaneously, 24/7.' },
    { icon: Database, title: 'Deep Ecosystem Sync', description: 'Intelligent bi-directional flow into Salesforce, HubSpot, or your custom CRM for automated lead nurturing.' },
    { icon: Globe, title: 'Global Omnipresence', description: 'Seamlessly switch between WhatsApp, Instagram, and Web without losing context or customer history.' },
    { icon: Shield, title: 'Governance & Audit', description: 'Enterprise-grade monitoring suite to audit conversations, fine-tune logic, and ensure brand integrity.' },
];

const USE_CASES = [
    { title: 'Customer Experience', description: 'Automate 85% of tier-1 support with instant, accurate resolutions.', color: 'var(--accent-cyan)' },
    { title: 'Hyper-Growth Sales', description: 'Qualify leads in seconds and book high-value meetings 24/7.', color: 'var(--accent-orange)' },
    { title: 'Commerce Logistics', description: 'Dynamic order tracking and personalized product recommendations.', color: '#c084fc' },
    { title: 'Internal Intelligence', description: 'Enable your team with an AI bot trained on internal policies and HR docs.', color: 'var(--accent-cyan)' },
];

const TECH_STACK = ['Vector Databases', 'Semantic Search', 'Context Injection', 'Source Attribution'];

const DELIVERABLES = [
    { id: '01', title: 'Custom AI Chatbot', description: 'Tailored reasoning engine trained on your unique business data.' },
    { id: '02', title: 'Knowledge Base Sync', description: 'Automated ingestion of PDF, Doc, and Web sources for RAG anchoring.' },
    { id: '03', title: 'Multi-Channel View', description: 'Deployment across WhatsApp, Instagram, and Web interfaces.' },
    { id: '04', title: 'Admin Governance', description: 'Managed dashboard for conversation auditing and logic fine-tuning.' },
];

function AgentMonitor() {
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState('Idle');
    const logPool = [
        'Connecting to Vector DB...',
        'Knowledge Base Sync: 100%',
        'Analyzing Sentiment...',
        'Applying Logic: Support_v2',
        'Generating Response...',
        'Lead Qualified: High Intent',
        'Syncing with Salesforce...',
        'Drafting Escalation Note...'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prev => [logPool[Math.floor(Math.random() * logPool.length)], ...prev].slice(0, 5));
            setStatus(['Processing', 'Analyzing', 'Responding', 'Syncing'][Math.floor(Math.random() * 4)]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-panel p-6 rounded-3xl border border-[var(--border-color)] font-mono overflow-hidden h-full">
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border-color)] pb-4">
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Live Agent Monitor</div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] animate-pulse" />
                    <span className="text-[10px] text-[var(--accent-orange)] uppercase">{status}</span>
                </div>
            </div>
            <div className="space-y-2">
                <AnimatePresence>
                    {logs.map((log, i) => (
                        <motion.div
                            key={log + i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[9px] text-[var(--text-secondary)] flex items-center gap-3"
                        >
                            <span className="text-[var(--accent-cyan)] opacity-50">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            {log}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
                <div className="text-[9px] text-[var(--text-muted)]">THROUGHPUT: 450 req/sec</div>
                <div className="text-[9px] text-[var(--text-muted)]">LATENCY: 1.2ms</div>
            </div>
        </div>
    );
}

function ChatPreview() {
    return (
        <div className="w-full max-w-lg mx-auto glass-panel p-4 rounded-3xl border border-[var(--border-color)] shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-cyan-glow)] flex items-center justify-center">
                    <Bot size={18} className="text-[var(--accent-cyan)]" />
                </div>
                <div>
                    <div className="text-sm font-bold">Talos Assistant</div>
                    <div className="text-[10px] text-[var(--accent-cyan)] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[var(--accent-cyan)] rounded-full animate-pulse" /> AI Agent Online
                    </div>
                </div>
            </div>
            <div className="space-y-4 mb-4 h-64 overflow-y-auto pr-2 scrollbar-thin">
                <div className="flex gap-2 max-w-[80%]">
                    <div className="p-3 rounded-2xl rounded-tl-none bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)]">
                        Hello! I'm your custom AI agent. How can I help you optimize your business today?
                    </div>
                </div>
                <div className="flex gap-2 max-w-[80%] ml-auto">
                    <div className="p-3 rounded-2xl rounded-tr-none bg-[var(--accent-cyan)] text-white text-xs">
                        I need to automate my customer support workflow.
                    </div>
                </div>
                <div className="flex gap-2 max-w-[80%]">
                    <div className="p-3 rounded-2xl rounded-tl-none bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)]">
                        Absolutely. I can handle 80% of routine queries instantly and only escalate complex issues to your human team. Would you like to see a demo?
                    </div>
                </div>
            </div>
            <div className="flex gap-2 items-center bg-[var(--bg-base)] p-2 rounded-xl border border-[var(--border-color)]">
                <div className="flex-grow text-xs text-[var(--text-muted)] px-2">Type a message...</div>
                <button className="p-2 bg-[var(--accent-cyan)] rounded-lg text-white">
                    <Zap size={14} />
                </button>
            </div>
        </div>
    );
}

export default function AIAgents() {
    return (
        <div className="container py-24 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-24 md:mb-32 px-4"
            >
                <div className="badge badge-active mb-6 tracking-widest">[AGENTIC INFRASTRUCTURE]</div>
                <h1 className="text-5xl md:text-8xl mb-6 font-black tracking-tighter uppercase leading-[0.9] md:leading-[0.85]">Engineering <br /><span className="text-gradient-orange text-glow-orange">Digital Autonomy.</span></h1>
                <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed border-l-2 border-[var(--accent-orange)] pl-6 italic">
                    "The future is not just automated; it's autonomous. We build the reasoning engines that power your next competitive advantage."
                </p>
            </motion.div>

            {/* RAG Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-48">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="px-4"
                >
                    <div className="badge badge-online mb-6">Semantic Memory</div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-tighter decoration-[var(--accent-orange)] decoration-4 underline underline-offset-8">RAG: Knowledge <br />without Hallucination.</h2>
                    <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-10">
                        Our Agents don't just guess. We implement "Retrieval-Augmented Generation" (RAG) pipelines that anchor agent logic in your unique business data, ensuring 100% factual accuracy and technical depth in every response.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {TECH_STACK.map(tech => (
                            <span key={tech} className="px-4 py-1.5 rounded-full border border-[var(--border-color)] text-[10px] uppercase tracking-widest bg-[rgba(255,255,255,0.02)]">
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-6"
                >
                    <ChatPreview />
                    <AgentMonitor />
                </motion.div>
            </div>

            {/* Efficiency Gap Table */}
            <div className="mb-24 md:mb-48">
                <div className="text-center mb-12 md:mb-16 px-4">
                    <div className="badge badge-outline mb-4 text-[var(--accent-orange)] tracking-widest uppercase">The Efficiency Gap</div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">Human vs <br /><span className="text-gradient-orange">Agentic.</span></h2>
                </div>
                
                <div className="glass-panel overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-[rgba(255,255,255,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px] md:min-w-0">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Capability</th>
                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Static Workforce</th>
                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-mono text-[var(--accent-orange)] uppercase tracking-widest font-bold">Talos Agents</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { cap: 'Availability', human: '40h / Week', agent: '168h / Week (24/7)', icon: Clock },
                                    { cap: 'Latency', human: 'Hours / Days', agent: '< 2s Real-time', icon: Zap },
                                    { cap: 'Accuracy', human: 'Variable (Human Error)', agent: '99.9% Deterministic', icon: CheckCircle },
                                    { cap: 'Scalability', human: 'Linear Hiring Costs', agent: 'Instant / Elastic', icon: MousePointer2 }
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 md:px-8 py-5 md:py-6 font-bold uppercase tracking-tighter text-base md:text-lg">{row.cap}</td>
                                        <td className="px-6 md:px-8 py-5 md:py-6 text-[var(--text-secondary)] text-sm md:text-base">{row.human}</td>
                                        <td className="px-6 md:px-8 py-5 md:py-6 text-white font-medium flex items-center gap-2 md:gap-3 text-sm md:text-base">
                                            <row.icon size={16} className="text-[var(--accent-orange)]" />
                                            {row.agent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Use Cases */}
            <div className="mb-40">
                <h3 className="text-4xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter">
                    <Sparkles className="text-[var(--accent-orange)]" size={32} /> Strategic Use Cases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {USE_CASES.map((uc, i) => (
                        <motion.div
                            key={uc.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-6 border-l-4"
                            style={{ borderLeftColor: uc.color }}
                        >
                            <h4 className="text-sm font-bold mb-2 uppercase tracking-tight">{uc.title}</h4>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                {uc.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Agent Capabilities */}
            <div className="mb-24 md:mb-48">
                <h3 className="text-3xl font-bold mb-12 flex items-center gap-4 px-4 uppercase tracking-tighter">
                    <Brain className="text-[var(--accent-orange)]" /> Capabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0">
                    {AGENT_CAPABILITIES.map((cap, i) => (
                        <motion.div
                            key={cap.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-8 md:p-10 border border-[var(--border-color)] group hover:border-[rgba(245,158,11,0.2)] transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[rgba(245,158,11,0.08)] flex items-center justify-center mb-6 group-hover:bg-[rgba(245,158,11,0.15)] transition-colors">
                                <cap.icon size={24} className="text-[var(--accent-orange)]" />
                            </div>
                            <h4 className="text-lg font-bold mb-3 uppercase tracking-tight">{cap.title}</h4>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{cap.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Core Deliverables */}
            <div className="mb-24 md:mb-48">
                <div className="badge badge-outline mb-6 mx-4">Outputs</div>
                <h3 className="text-4xl md:text-5xl font-black mb-16 uppercase tracking-tighter px-4 leading-[0.9]">Core <br /><span className="text-gradient-orange">Deliverables.</span></h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 md:space-y-8 px-4">
                        {DELIVERABLES.map((d, i) => (
                            <motion.div 
                                key={d.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-6 pb-8 border-b border-white/5 group"
                            >
                                <div className="text-lg font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] transition-colors">{d.id}</div>
                                <div>
                                    <h4 className="text-xl font-bold uppercase tracking-tight mb-2">{d.title}</h4>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{d.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-[var(--border-color)] bg-gradient-to-tr from-[rgba(255,255,255,0.02)] to-transparent mx-4 sm:mx-0">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">Protocol Verification Alpha-9</span>
                        </div>
                        <h4 className="text-2xl font-black mb-6 uppercase tracking-tight text-gradient-orange">Security by Design.</h4>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8 italic">
                            "Every agent is containerized and restricted by strict logic boundaries. We prioritize your data sovereignty above all else."
                        </p>
                        <div className="space-y-4">
                            {['OAuth 2.0 Integration', 'SOC2 Compliant Logic', 'End-to-End Encryption', 'Zero-Trust Architecture'].map(item => (
                                <div key={item} className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-color)]" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-10 md:p-16 glass-panel rounded-[2.5rem] md:rounded-[4rem] text-center relative overflow-hidden border border-[var(--accent-orange-glow)] mb-24"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(245,158,11,0.05)] to-transparent pointer-events-none" />
                <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">Ready to <br /><span className="text-gradient-orange">Automate?</span></h2>
                <p className="text-[var(--text-secondary)] mb-12 max-w-xl mx-auto text-lg md:text-xl leading-relaxed px-4 opacity-80">
                    "The manual tax is the most expensive cost in modern business. Let's eliminate it together."
                </p>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                    <button className="btn btn-primary px-8 md:px-12 py-4 md:py-5 text-xs md:text-sm shadow-[0_0_30px_var(--accent-orange-glow)] flex items-center justify-center gap-3">
                        Request Agent Audit <ArrowRight size={18} />
                    </button>
                    <button className="btn btn-outline px-8 md:px-12 py-4 md:py-5 text-xs md:text-sm">Technical Documentation</button>
                </div>
            </motion.div>
        </div>
    );
}
