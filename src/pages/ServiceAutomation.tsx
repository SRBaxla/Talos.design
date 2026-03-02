import { CheckCircle2, ArrowRight, Workflow, Bell, Calendar, Database, Mail, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: Workflow,
        title: 'Custom Workflows',
        description: 'Tailor-made automation pipelines that connect your apps, databases, and services into one seamless flow.',
    },
    {
        icon: Bell,
        title: 'Smart Notifications',
        description: 'Automated email, SMS, and push notifications triggered by real-time events in your system.',
    },
    {
        icon: Calendar,
        title: 'Booking & Scheduling',
        description: 'Automated appointment booking, availability management, and calendar sync across platforms.',
    },
    {
        icon: Database,
        title: 'Data Sync',
        description: 'Keep your databases, spreadsheets, and CRMs in sync automatically — no manual data entry.',
    },
    {
        icon: Mail,
        title: 'Email Automation',
        description: 'Drip campaigns, transactional emails, follow-ups, and newsletters — all on autopilot.',
    },
    {
        icon: Repeat,
        title: 'Task Elimination',
        description: 'Identify and automate repetitive tasks that eat into your productivity every single day.',
    },
];

const industries = [
    { title: 'Hospitality', examples: 'Booking engines, guest CRM, automated check-in/out, review collection', color: 'var(--accent-orange)' },
    { title: 'E-Commerce', examples: 'Inventory sync, order tracking, abandoned cart recovery, shipping alerts', color: 'var(--accent-cyan)' },
    { title: 'Healthcare', examples: 'Appointment scheduling, patient reminders, prescription refill alerts', color: '#c084fc' },
    { title: 'Professional Services', examples: 'Client onboarding, invoice generation, project status updates', color: 'var(--accent-orange)' },
];

const techStack = [
    { name: 'Python', category: 'Backend' },
    { name: 'Node.js', category: 'Runtime' },
    { name: 'Zapier', category: 'Integration' },
    { name: 'Make', category: 'Automation' },
    { name: 'Firebase', category: 'Database' },
    { name: 'AWS Lambda', category: 'Serverless' },
    { name: 'Twilio', category: 'SMS/Voice' },
    { name: 'SendGrid', category: 'Email' },
];

const process = [
    { step: '01', title: 'Audit', description: 'We map your current workflows and identify bottlenecks, manual tasks, and automation opportunities.' },
    { step: '02', title: 'Architect', description: 'Design the automation blueprint — triggers, actions, data flows, and integration points.' },
    { step: '03', title: 'Build', description: 'Implement the automations using best-in-class tools and custom code where needed.' },
    { step: '04', title: 'Monitor', description: 'Deploy, test, and set up monitoring dashboards so you can track performance in real time.' },
];

export default function ServiceAutomation() {
    return (
        <div className="container py-16 flex flex-col flex-grow items-center relative z-10 w-full">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-online mb-8 font-mono text-xs border-[rgba(192,132,252,0.3)] shadow-[0_0_15px_rgba(192,132,252,0.1)]"
            >
                SERVICE_MODULE: AUTOMATION
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center"
            >
                System <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Automation</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mb-20"
            >
                Eliminate manual data entry and repetitive tasks. We connect your apps, databases, and workflows into intelligent, self-running systems.
            </motion.p>

            {/* Features */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Capabilities</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    What We <span className="text-[var(--accent-orange)]">Automate</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-6 group hover:border-[rgba(245,158,11,0.2)] transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.08)] flex items-center justify-center mb-4 group-hover:bg-[rgba(245,158,11,0.15)] transition-colors">
                                <feature.icon size={20} className="text-[var(--accent-orange)]" />
                            </div>
                            <h3 className="text-sm font-bold mb-2">{feature.title}</h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Process */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Our Process</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    How It <span className="text-[var(--accent-cyan)]">Works</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {process.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-6 relative overflow-hidden"
                        >
                            <div className="text-4xl font-display font-bold text-[rgba(0,229,255,0.1)] absolute top-4 right-4">{step.step}</div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-[var(--accent-cyan)]">{step.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Industries */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Industries</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    Built <span className="text-[var(--accent-orange)]">For</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {industries.map((industry, i) => (
                        <motion.div
                            key={industry.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-6"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                                    style={{ backgroundColor: industry.color, color: industry.color }}
                                ></div>
                                <h3 className="text-sm font-bold">{industry.title}</h3>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{industry.examples}</p>
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
                            className="glass-panel p-4 text-center hover:border-[rgba(245,158,11,0.2)] transition-all"
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
                            'Custom automation workflows',
                            'App & API integrations',
                            'Real-time monitoring dashboard',
                            'Email & SMS notification setup',
                            'Data migration & sync pipelines',
                            'Documentation & runbooks',
                            'Error handling & retry logic',
                            'Post-launch support (30 days)',
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                <CheckCircle2 size={16} className="text-[var(--accent-orange)] shrink-0" />
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
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(245,158,11,0.03)] to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-3xl font-display mb-2">Ready to Automate?</h2>
                    <p className="text-[var(--text-secondary)]">Stop doing things manually. Let us build your automation engine.</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <Link to="/contact" className="btn btn-outline py-3 px-8">Get in Touch</Link>
                    <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)] flex items-center gap-2">
                        Start Automating <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>

        </div>
    );
}
