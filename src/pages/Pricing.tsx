import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Pricing() {
    return (
        <div className="container py-16 flex flex-col flex-grow items-center relative z-10 w-full">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-online mb-8 font-mono text-xs border-[rgba(245,158,11,0.3)] shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            >
                SYSTEM_STATUS: OPTIMAL
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center"
            >
                Our SaaS <span className="text-gradient-cyan drop-shadow-[0_0_20px_rgba(0,229,255,0.2)]">Solutions</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[var(--text-secondary)] text-center max-w-2xl mb-16"
            >
                One-time project packages to build your digital presence or automation systems from scratch. Choose a ready-made package or create a custom build tailored to your needs.
            </motion.p>

            {/* Project Packages */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">One-Time Project Pricing</span>
                </div>
                <h2 className="text-3xl font-display uppercase tracking-tight mb-3">Project Packages</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-10 max-w-2xl">
                    Select a pre-configured package or build a custom solution. Each package is a one-time investment to get your digital systems up and running.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Digital Presence */}
                    <Link
                        to="/projects/presence"
                        className="glass-panel p-6 group hover:border-[rgba(245,158,11,0.3)] transition-all"
                    >
                        <div className="text-[10px] font-mono text-[var(--accent-orange)] uppercase tracking-widest mb-3">Protocol_01</div>
                        <h3 className="text-lg font-display font-bold mb-1">Digital Presence</h3>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-2xl font-display font-bold text-[var(--accent-orange)]">$2,499</span>
                            <span className="text-xs text-[var(--text-muted)] font-mono">starting</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mb-4">Website, branding, SEO, CMS, analytics & more.</p>
                        <span className="text-xs text-[var(--accent-orange)] flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Details <ArrowRight size={12} />
                        </span>
                    </Link>

                    {/* Smart Automation */}
                    <Link
                        to="/projects/automation"
                        className="glass-panel p-6 group hover:border-[rgba(0,229,255,0.3)] transition-all"
                    >
                        <div className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-3">Protocol_02</div>
                        <h3 className="text-lg font-display font-bold mb-1">Smart Automation</h3>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-2xl font-display font-bold text-[var(--accent-cyan)]">$3,999</span>
                            <span className="text-xs text-[var(--text-muted)] font-mono">starting</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mb-4">Bookings, chatbot, inventory, CRM & notifications.</p>
                        <span className="text-xs text-[var(--accent-cyan)] flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Details <ArrowRight size={12} />
                        </span>
                    </Link>

                    {/* Custom Build */}
                    <Link
                        to="/projects/custom"
                        className="glass-panel p-6 group hover:border-[rgba(192,132,252,0.3)] transition-all"
                    >
                        <div className="text-[10px] font-mono text-[#c084fc] uppercase tracking-widest mb-3">Protocol_03</div>
                        <h3 className="text-lg font-display font-bold mb-1">Custom Build</h3>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-2xl font-display font-bold text-[#c084fc]">Varies</span>
                            <span className="text-xs text-[var(--text-muted)] font-mono">per module</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mb-4">Pick any features from both packages. Get a quote.</p>
                        <span className="text-xs text-[#c084fc] flex items-center gap-1 group-hover:gap-2 transition-all">
                            Build Custom <ArrowRight size={12} />
                        </span>
                    </Link>
                </div>
            </motion.div>

        </div>
    );
}
