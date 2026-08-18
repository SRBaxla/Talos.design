import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, Shield, Brain, Clock, Database, CheckCircle, ArrowRight, UserCheck, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const TECHNICAL_PILLARS = [
    {
        icon: Brain,
        title: 'Retrieval-Augmented Grounding',
        description: 'Contextually ground model responses against company service catalogs, pricing guides, and FAQs to prevent hallucinations and maintain factual answers.',
        accent: 'var(--accent-cyan)',
        bg: 'rgba(0,229,255,0.08)',
        border: 'rgba(0,229,255,0.2)',
    },
    {
        icon: UserCheck,
        title: 'Structured Lead Extraction',
        description: 'Multi-turn extraction logic that identifies visitor intent, collects contact information, and formats structured payloads for CRM ingestion.',
        accent: 'var(--accent-orange)',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
    },
    {
        icon: Shield,
        title: 'Deterministic Human Escalation',
        description: 'Rule-based confidence boundaries that immediately transfer conversations to human team members when queries exceed configured scope.',
        accent: '#c084fc',
        bg: 'rgba(192,132,252,0.08)',
        border: 'rgba(192,132,252,0.2)',
    },
    {
        icon: Smartphone,
        title: 'WhatsApp Business & Web Relays',
        description: 'Event-driven webhook infrastructure connecting Meta WhatsApp Cloud APIs and lightweight React web widgets simultaneously.',
        accent: 'var(--accent-cyan)',
        bg: 'rgba(0,229,255,0.08)',
        border: 'rgba(0,229,255,0.2)',
    },
    {
        icon: Database,
        title: 'Pipeline & CRM Synchronization',
        description: 'Asynchronous webhook dispatches that log qualified lead events into Google Sheets, Airtable, HubSpot, or custom PostgreSQL databases.',
        accent: 'var(--accent-orange)',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
    },
    {
        icon: Clock,
        title: 'Continuous Response Monitoring',
        description: 'Admin review workflows to inspect unanswered questions, fine-tune knowledge base prompts, and expand answer coverage over time.',
        accent: '#c084fc',
        bg: 'rgba(192,132,252,0.08)',
        border: 'rgba(192,132,252,0.2)',
    },
];

const ARCHITECTURE_LAYERS = [
    {
        layer: '01',
        title: 'Inbound Ingestion & Normalization',
        description: 'Receives user messages via WebSocket (Web) or Webhook (WhatsApp), strips formatting anomalies, and establishes session identity.',
    },
    {
        layer: '02',
        title: 'Intent Classification & Guardrails',
        description: 'Evaluates if the query is a routine FAQ, a qualification trigger, or an escalation request before invoking generation logic.',
    },
    {
        layer: '03',
        title: 'Knowledge Grounding & Generation',
        description: 'Injects relevant chunks from your verified documentation into the prompt context to generate precise, grounded answers.',
    },
    {
        layer: '04',
        title: 'Action Dispatch & Human Notification',
        description: 'Formats and dispatches lead data to business storage while sending instant push/email alerts to staff when attention is needed.',
    },
];

function InteractiveChatDemo() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I can answer questions about our services, pricing guidelines, or help you book a discovery call. What can I help you with today?' },
        { sender: 'user', text: 'What is included in the Digital Business Launch package?' },
        { sender: 'bot', text: 'The Digital Business Launch package includes a custom lead-generation website, SEO setup, WhatsApp click-to-chat integration, and full analytics. Delivery timeline is 2–4 weeks at a fixed quote.' },
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Thank you for your inquiry! I can capture your details and notify our team, or connect you directly with an engineer on WhatsApp.' }
            ]);
        }, 800);
    };

    return (
        <div className="w-full max-w-lg mx-auto glass-panel p-5 rounded-3xl border border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col h-[420px]">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-cyan-glow)] flex items-center justify-center">
                        <Bot size={18} className="text-[var(--accent-cyan)]" />
                    </div>
                    <div>
                        <div className="text-xs font-bold font-display">Talos Assistant Demo</div>
                        <div className="text-[9px] text-[var(--accent-cyan)] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[var(--accent-cyan)] rounded-full animate-pulse" /> Knowledge Grounded
                        </div>
                    </div>
                </div>
                <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    Concept Preview
                </span>
            </div>

            <div className="space-y-3 mb-3 flex-grow overflow-y-auto pr-1 scrollbar-thin text-xs">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto' : ''}`}
                    >
                        <div
                            className={`p-3 rounded-2xl ${
                                msg.sender === 'user'
                                    ? 'bg-[var(--accent-orange)] text-[#07090E] font-medium rounded-tr-none'
                                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] rounded-tl-none border border-[var(--border-color)]'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="flex gap-2 items-center bg-[var(--bg-base)] p-1.5 rounded-xl border border-[var(--border-color)]">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about packages, hours, or process..."
                    className="flex-grow text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent px-2 outline-none"
                />
                <button type="submit" className="p-2 bg-[var(--accent-orange)] text-[#07090E] rounded-lg font-bold hover:brightness-110 transition-all">
                    <Zap size={14} />
                </button>
            </form>
        </div>
    );
}

export default function AIAgents() {
    return (
        <div className="container py-16 md:py-24 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-20 md:mb-28 px-4"
            >
                <div className="badge badge-active mb-6 tracking-widest">[TECHNICAL EXPERTISE: CONVERSATIONAL SYSTEMS]</div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl mb-6 font-display font-bold uppercase leading-[1.05] tracking-tight">
                    Conversational AI &amp; <br />
                    <span className="text-gradient-orange text-glow-orange">Inquiry Architecture</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed border-l-2 border-[var(--accent-orange)] pl-6 italic">
                    "How we engineer practical, retrieval-grounded conversational systems that answer routine business questions, capture qualified leads, and safely escalate complex conversations to human teams."
                </p>
            </motion.div>

            {/* Interactive Concept & RAG Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-40">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="px-4"
                >
                    <div className="badge badge-online mb-4">Grounded In Verified Data</div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-tight">
                        Factual Answers. <br />
                        <span className="text-[var(--accent-orange)]">Zero Made-Up Claims.</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-6">
                        Language models without strict grounding frequently invent information. We engineer assistants that reference structured company documentation — price tiers, operating hours, service catalogs, and policy FAQs — so customers receive reliable information every time.
                    </p>
                    <div className="space-y-3 mb-8">
                        {[
                            'Strict prompt context isolation to minimize hallucinations',
                            'Hard rule-based fallbacks when questions are out of scope',
                            'WhatsApp Business Cloud API webhook synchronization',
                            'Instant escalation alerts via email and messaging channels',
                        ].map((point) => (
                            <div key={point} className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                                <CheckCircle size={14} className="text-[var(--accent-cyan)] shrink-0" />
                                {point}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                >
                    <InteractiveChatDemo />
                </motion.div>
            </div>

            {/* Architecture Pipeline */}
            <div className="mb-24 md:mb-40">
                <div className="text-center mb-12 md:mb-16 px-4">
                    <div className="badge badge-outline mb-4 text-[var(--accent-orange)] tracking-widest uppercase">System Design</div>
                    <h2 className="text-3xl md:text-5xl font-display uppercase tracking-tight">
                        The Ingestion &amp; <span className="text-gradient-orange">Routing Flow</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
                    {ARCHITECTURE_LAYERS.map((layer, i) => (
                        <motion.div
                            key={layer.layer}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-panel p-6 flex flex-col justify-between"
                        >
                            <div>
                                <span className="text-xs font-mono font-bold text-[var(--accent-orange)] px-2 py-0.5 rounded bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] mb-4 inline-block">
                                    LAYER {layer.layer}
                                </span>
                                <h3 className="text-base font-bold mb-2 text-[var(--text-primary)]">{layer.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{layer.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Technical Pillars */}
            <div className="mb-24 md:mb-40">
                <h3 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12 flex items-center gap-3 px-4">
                    <Brain className="text-[var(--accent-orange)]" /> Engineering Pillars
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0">
                    {TECHNICAL_PILLARS.map((pillar, i) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-8 border border-[var(--border-color)] group hover:border-[rgba(245,158,11,0.3)] transition-all"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors"
                                style={{ backgroundColor: pillar.bg }}
                            >
                                <pillar.icon size={22} style={{ color: pillar.accent }} />
                            </div>
                            <h4 className="text-lg font-bold mb-3 uppercase tracking-tight">{pillar.title}</h4>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{pillar.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA to Commercial Service */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-10 md:p-14 glass-panel rounded-3xl text-center relative overflow-hidden border border-[var(--border-color)] mb-12"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(245,158,11,0.04)] to-transparent pointer-events-none" />
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-4">
                    Looking to Deploy an <span className="text-gradient-orange">Inquiry Assistant?</span>
                </h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed opacity-90">
                    Explore our commercial AI Sales Assistant service to see full deliverables, package options, and deployment timelines.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/services/chatbots"
                        className="btn btn-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_var(--accent-orange-glow)] flex items-center justify-center gap-2"
                    >
                        View AI Service Details <ArrowRight size={16} />
                    </Link>
                    <Link
                        to="/contact"
                        className="btn btn-outline px-8 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center"
                    >
                        Schedule Discovery Call
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
