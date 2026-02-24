import { CheckCircle2, ArrowRight, MessageSquare, Brain, Database, Clock, Globe, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: MessageSquare,
        title: 'Natural Conversations',
        description: 'AI chatbots that understand context, intent, and nuance — not just keyword matching.',
    },
    {
        icon: Brain,
        title: 'Custom Knowledge Base',
        description: 'Train on your business data — products, FAQs, policies — so the bot speaks your language.',
    },
    {
        icon: Clock,
        title: '24/7 Availability',
        description: 'Never miss a customer query. Your AI agent works around the clock, every day of the year.',
    },
    {
        icon: Database,
        title: 'CRM Integration',
        description: 'Seamlessly connect with your existing CRM to log conversations, capture leads, and track follow-ups.',
    },
    {
        icon: Globe,
        title: 'Multi-Channel Deploy',
        description: 'Deploy across your website, WhatsApp, Instagram, Facebook Messenger — all from one system.',
    },
    {
        icon: Settings,
        title: 'Easy Management',
        description: 'Simple dashboard to update responses, view analytics, and fine-tune your bot without code.',
    },
];

const useCases = [
    { title: 'Customer Support', description: 'Handle FAQs, complaints, and ticket routing automatically.', color: 'var(--accent-cyan)' },
    { title: 'Lead Generation', description: 'Qualify visitors, capture contact info, and book appointments.', color: 'var(--accent-orange)' },
    { title: 'E-Commerce Assistant', description: 'Help customers find products, check availability, and track orders.', color: '#c084fc' },
    { title: 'Internal Tools', description: 'HR bots, IT helpdesks, and knowledge management for your team.', color: 'var(--accent-cyan)' },
];

const techStack = [
    { name: 'OpenAI GPT', category: 'LLM' },
    { name: 'LangChain', category: 'Framework' },
    { name: 'Pinecone', category: 'Vector DB' },
    { name: 'Firebase', category: 'Backend' },
    { name: 'WhatsApp API', category: 'Channel' },
    { name: 'Dialogflow', category: 'NLP' },
    { name: 'Node.js', category: 'Runtime' },
    { name: 'Python', category: 'ML Pipeline' },
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
                SERVICE_MODULE: AI_CHATBOTS
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center"
            >
                AI <span className="text-gradient-cyan drop-shadow-[0_0_20px_rgba(0,229,255,0.2)]">Chatbots</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mb-20"
            >
                Intelligent conversational agents that handle customer support, generate leads, and automate interactions — 24/7, across every channel.
            </motion.p>

            {/* Features */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Capabilities</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    Smart <span className="text-[var(--accent-cyan)]">Features</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-6 group hover:border-[rgba(0,229,255,0.2)] transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[rgba(0,229,255,0.08)] flex items-center justify-center mb-4 group-hover:bg-[rgba(0,229,255,0.15)] transition-colors">
                                <feature.icon size={20} className="text-[var(--accent-cyan)]" />
                            </div>
                            <h3 className="text-sm font-bold mb-2">{feature.title}</h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Use Cases */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Applications</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    Use <span className="text-[var(--accent-orange)]">Cases</span>
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

            {/* Tech Stack */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Technology</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    Tech <span className="text-[var(--accent-cyan)]">Stack</span>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {techStack.map((tech, i) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-4 text-center hover:border-[rgba(0,229,255,0.2)] transition-all"
                        >
                            <div className="text-sm font-bold mb-1">{tech.name}</div>
                            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">{tech.category}</div>
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
                    What You <span className="text-[var(--accent-orange)]">Receive</span>
                </h2>

                <div className="glass-panel p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Custom-trained AI chatbot',
                            'Knowledge base setup & training',
                            'Multi-channel deployment',
                            'Admin dashboard for management',
                            'Conversation analytics & reports',
                            'CRM & notification integration',
                            'Escalation to human agent flow',
                            'Post-launch support (30 days)',
                        ].map((item) => (
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
                    <h2 className="text-3xl font-display mb-2">Ready to Deploy an AI Agent?</h2>
                    <p className="text-[var(--text-secondary)]">Let us build a chatbot that works for your business, 24/7.</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <Link to="/pricing" className="btn btn-outline py-3 px-8">View Pricing</Link>
                    <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)] flex items-center gap-2">
                        Get Started <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>

        </div>
    );
}
