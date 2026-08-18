import { CheckCircle2, ArrowRight, MessageSquare, Brain, Database, Shield, UserCheck, Smartphone, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const capabilities = [
    {
        icon: MessageSquare,
        title: 'Answer Common Questions',
        description: 'Answers customer inquiries instantly with verified info on your services, pricing guidelines, business hours, and FAQs.',
        accent: 'var(--accent-cyan)',
        bg: 'rgba(0,229,255,0.08)',
        border: 'rgba(0,229,255,0.2)',
    },
    {
        icon: UserCheck,
        title: 'Capture Lead Details',
        description: 'Collects visitor names, phone numbers, emails, service interests, and specific project requirements automatically.',
        accent: 'var(--accent-orange)',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
    },
    {
        icon: Brain,
        title: 'Qualify Inquiries',
        description: 'Asks predefined qualification questions to identify high-intent prospects and filter out irrelevant or spam messages.',
        accent: '#c084fc',
        bg: 'rgba(192,132,252,0.08)',
        border: 'rgba(192,132,252,0.2)',
    },
    {
        icon: Smartphone,
        title: 'WhatsApp + Website Deploy',
        description: 'Operates seamlessly across your website chat widget and your official WhatsApp Business number from a single setup.',
        accent: 'var(--accent-cyan)',
        bg: 'rgba(0,229,255,0.08)',
        border: 'rgba(0,229,255,0.2)',
    },
    {
        icon: Shield,
        title: 'Human Team Handoff',
        description: 'Smoothly escalates complex questions, sensitive topics, or custom quote requests directly to your human staff with full chat context.',
        accent: 'var(--accent-orange)',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
    },
    {
        icon: Database,
        title: 'Workflow & CRM Sync',
        description: 'Automatically routes captured leads into Google Sheets, your CRM, email inbox, or Slack channels in real-time.',
        accent: '#c084fc',
        bg: 'rgba(192,132,252,0.08)',
        border: 'rgba(192,132,252,0.2)',
    },
];

const useCases = [
    {
        title: 'Local Businesses & Clinics',
        description: 'Answer hours, fee estimates, and service availability while capturing patient booking inquiries around the clock.',
        color: 'var(--accent-cyan)',
    },
    {
        title: 'Consultancies & B2B Services',
        description: 'Screen prospect budgets, project scopes, and timelines before booking discovery calls with your team.',
        color: 'var(--accent-orange)',
    },
    {
        title: 'E-Commerce & Retail Stores',
        description: 'Help customers check stock availability, return policies, order tracking, and store directions.',
        color: '#c084fc',
    },
    {
        title: 'Hospitality & Hotels',
        description: 'Answer room amenities, check-in policies, and capture direct booking inquiries without OTA commission fees.',
        color: 'var(--accent-cyan)',
    },
];

const workflowSteps = [
    {
        step: '01',
        title: 'Knowledge Base Setup',
        description: 'We gather and structure your service catalog, price guidelines, FAQs, and business policies into a clean reference system.',
    },
    {
        step: '02',
        title: 'Qualification Scripting',
        description: 'We configure the exact questions the assistant asks to qualify incoming prospects and set rules for when to notify your team.',
    },
    {
        step: '03',
        title: 'Channel Integration',
        description: 'We install a lightweight chat widget on your website and connect your WhatsApp Business endpoint with end-to-end routing.',
    },
    {
        step: '04',
        title: 'Validation & Handover',
        description: 'Rigorous response testing, staff notification checks, and team training before taking the assistant live.',
    },
];

const deliverables = [
    'Custom-configured AI sales & inquiry assistant',
    'Knowledge base ingestion (FAQs, price lists, policies)',
    'Website chat widget with custom branding',
    'WhatsApp Business API integration',
    'Automated lead capture to CRM or Google Sheets',
    'Instant notification alerts for high-priority inquiries',
    'Seamless escalation to human team members',
    '30 days of post-launch tuning and support',
];

export default function ServiceChatbots() {
    return (
        <div className="container py-16 flex flex-col flex-grow items-center relative z-10 w-full">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-online mb-8 font-mono text-xs border-[rgba(0,229,255,0.3)] shadow-[0_0_15px_rgba(0,229,255,0.1)]"
            >
                SERVICE_MODULE: AI_SALES_ASSISTANTS
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-7xl font-display tracking-tight mb-6 text-center max-w-4xl"
            >
                AI Sales &amp; <br />
                <span className="text-gradient-cyan drop-shadow-[0_0_20px_rgba(0,229,255,0.2)]">Inquiry Assistants</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-[var(--text-primary)] font-medium text-center max-w-2xl mb-4"
            >
                Turn Website &amp; WhatsApp Enquiries Into Qualified Leads.
            </motion.p>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-sm md:text-base text-[var(--text-secondary)] text-center max-w-2xl mb-12 leading-relaxed"
            >
                Deploy an AI-powered assistant that answers common questions, captures enquiries, qualifies prospects, and routes conversations to your team — without forcing customers to wait for a response.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center mb-24"
            >
                <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)] flex items-center gap-2">
                    Book Discovery Call <ArrowRight size={16} />
                </Link>
                <a
                    href="https://wa.me/918090489112?text=Hello%20Talos.design%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20AI%20Inquiry%20Assistants."
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline py-3 px-8 flex items-center gap-2"
                >
                    <Send size={14} className="text-[#25D366]" /> Chat on WhatsApp
                </a>
            </motion.div>

            {/* Core Capabilities */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Practical Capabilities</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    What The Assistant <span className="text-[var(--accent-cyan)]">Does</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {capabilities.map((cap, i) => (
                        <motion.div
                            key={cap.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-6 group hover:border-[rgba(0,229,255,0.3)] transition-all flex flex-col justify-between"
                            style={{ borderColor: cap.border }}
                        >
                            <div>
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors"
                                    style={{ backgroundColor: cap.bg }}
                                >
                                    <cap.icon size={20} style={{ color: cap.accent }} />
                                </div>
                                <h3 className="text-base font-bold mb-2 tracking-tight">{cap.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{cap.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* How We Build & Deploy */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Process</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    How We <span className="text-[var(--accent-orange)]">Set It Up</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {workflowSteps.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-panel p-6 flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-[var(--accent-orange)] px-2.5 py-1 rounded bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]">
                                    STEP {step.step}
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-[var(--text-primary)]">{step.title}</h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Target Use Cases */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Applications</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    Who It Is <span className="text-[var(--accent-cyan)]">For</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {useCases.map((useCase, i) => (
                        <motion.div
                            key={useCase.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-6 flex items-start gap-4"
                        >
                            <div
                                className="w-3 h-3 rounded-full shrink-0 mt-1 shadow-[0_0_8px_currentColor]"
                                style={{ backgroundColor: useCase.color, color: useCase.color }}
                            ></div>
                            <div>
                                <h3 className="text-sm font-bold mb-1">{useCase.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{useCase.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Deliverables */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Deliverables</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    What We <span className="text-[var(--accent-orange)]">Deliver</span>
                </h2>

                <div className="glass-panel p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deliverables.map((item) => (
                            <div key={item} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                <CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl border border-[var(--border-color)] p-10 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl bg-[rgba(255,255,255,0.01)] backdrop-blur-sm relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,229,255,0.03)] to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-display mb-2">Ready to Respond Faster to Inquiries?</h2>
                    <p className="text-sm text-[var(--text-secondary)]">Let us configure an assistant that captures leads and handles routine customer questions 24/7.</p>
                </div>
                <div className="flex gap-4 relative z-10 shrink-0">
                    <Link to="/contact" className="btn btn-outline py-3 px-6 text-xs uppercase tracking-wider">Ask a Question</Link>
                    <Link to="/contact" className="btn btn-primary py-3 px-6 shadow-[0_0_20px_var(--accent-orange-glow)] flex items-center gap-2 text-xs uppercase tracking-wider">
                        Get Started <ArrowRight size={14} />
                    </Link>
                </div>
            </motion.div>

        </div>
    );
}
