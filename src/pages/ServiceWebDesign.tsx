import { CheckCircle2, ArrowRight, Monitor, Smartphone, Search, Palette, Gauge, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: Monitor,
        title: 'Responsive Design',
        description: 'Pixel-perfect layouts that look stunning on every screen — from 4K monitors to mobile phones.',
    },
    {
        icon: Search,
        title: 'SEO Optimized',
        description: 'Built-in search engine optimization so your site ranks higher and gets found by the right audience.',
    },
    {
        icon: Gauge,
        title: 'Lightning Fast',
        description: 'Optimized for speed with lazy loading, code splitting, and modern build tools for sub-second load times.',
    },
    {
        icon: Palette,
        title: 'Custom Design System',
        description: 'A tailored design system with tokens, components, and guidelines that ensure brand consistency.',
    },
    {
        icon: Smartphone,
        title: 'Progressive Web App',
        description: 'App-like experience right in the browser with offline support, push notifications, and install prompts.',
    },
    {
        icon: Shield,
        title: 'Security First',
        description: 'HTTPS, CSP headers, input sanitization, and best-practice authentication built in from day one.',
    },
];

const techStack = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Framework' },
    { name: 'Vite', category: 'Build Tool' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Framer Motion', category: 'Animation' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Firebase', category: 'Hosting' },
    { name: 'Figma', category: 'Design' },
];

const process = [
    { step: '01', title: 'Discovery', description: 'We learn about your business, audience, and goals to define the project scope.' },
    { step: '02', title: 'Design', description: 'Wireframes and high-fidelity mockups are crafted for your review and approval.' },
    { step: '03', title: 'Development', description: 'Clean, modular code is written using modern frameworks and best practices.' },
    { step: '04', title: 'Launch', description: 'Thorough QA testing, performance optimization, and deployment to production.' },
];

export default function ServiceWebDesign() {
    return (
        <div className="container py-16 flex flex-col flex-grow items-center relative z-10 w-full">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-online mb-8 font-mono text-xs border-[rgba(245,158,11,0.3)] shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            >
                SERVICE_MODULE: WEB_DESIGN
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center"
            >
                Web <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Design</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mb-20"
            >
                High-performance, responsive websites that convert visitors into customers. We build digital experiences that are fast, beautiful, and built to last.
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
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">What You Get</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    Features & <span className="text-[var(--accent-cyan)]">Standards</span>
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

            {/* Process */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl mb-32"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Our Process</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-12">
                    How We <span className="text-[var(--accent-orange)]">Build</span>
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
                            <div className="text-4xl font-display font-bold text-[rgba(245,158,11,0.1)] absolute top-4 right-4">{step.step}</div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-[var(--accent-orange)]">{step.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
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
                            'Fully responsive website',
                            'Custom design system & style guide',
                            'SEO-optimized pages with meta tags',
                            'Performance-tuned production build',
                            'CMS integration (if needed)',
                            'Analytics & tracking setup',
                            'SSL certificate & domain config',
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
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(245,158,11,0.03)] to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-3xl font-display mb-2">Ready to Build?</h2>
                    <p className="text-[var(--text-secondary)]">Let us design and develop your next website.</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <Link to="/contact" className="btn btn-outline py-3 px-8">Get in Touch</Link>
                    <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)] flex items-center gap-2">
                        Start Project <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>

        </div>
    );
}
