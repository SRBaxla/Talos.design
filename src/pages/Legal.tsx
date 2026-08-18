import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, HelpCircle } from 'lucide-react';

export default function Legal() {
    const lastUpdated = 'February 24, 2026';
    const location = useLocation();

    // Auto-scroll to section hash when navigating via footer links
    useEffect(() => {
        if (location.hash) {
            const targetId = location.hash.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location]);

    return (
        <div className="container py-16 flex flex-col flex-grow items-center relative z-10 w-full">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-online mb-8 font-mono text-xs border-[rgba(245,158,11,0.3)] shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            >
                LEGAL_GOVERNANCE_DOCS
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center uppercase font-bold"
            >
                Legal & <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Governance</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-[var(--text-muted)] text-center mb-12 font-mono"
            >
                Last updated: {lastUpdated}
            </motion.p>

            {/* Anchor Navigation Bar */}
            <div className="flex flex-wrap justify-center gap-3 mb-16 px-4">
                <a href="#terms" className="px-4 py-2 rounded-xl glass-panel border border-[var(--border-color)] text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-orange)] transition-all flex items-center gap-2">
                    <FileText size={14} className="text-[var(--accent-orange)]" /> Terms of Service
                </a>
                <a href="#privacy" className="px-4 py-2 rounded-xl glass-panel border border-[var(--border-color)] text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-cyan)] transition-all flex items-center gap-2">
                    <Lock size={14} className="text-[var(--accent-cyan)]" /> Privacy Policy
                </a>
                <a href="#security" className="px-4 py-2 rounded-xl glass-panel border border-[var(--border-color)] text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-orange)] transition-all flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[var(--accent-orange)]" /> Security & Governance
                </a>
            </div>

            {/* Content */}
            <div className="w-full max-w-4xl space-y-20">

                {/* Section 01: Terms of Service */}
                <motion.section
                    id="terms"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-32"
                >
                    <div className="flex items-center gap-4 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-orange)] shadow-[0_0_10px_var(--accent-orange-glow)]"></span>
                        <span className="text-xs font-mono text-[var(--accent-orange)] uppercase tracking-widest font-bold">Section 01</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-8 font-bold">
                        Terms of <span className="text-[var(--accent-orange)]">Service</span>
                    </h2>

                    <div className="glass-panel p-8 md:p-10 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed rounded-3xl border border-[var(--border-color)]">
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">1. Agreement to Terms</h3>
                            <p>By accessing or using the digital systems and services provided by Talos.design, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not utilize our digital platform.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">2. Scope of Services</h3>
                            <p>Talos.design provides custom software solutions including web design, 24/7 AI chatbots, and workflow automation systems. All deliverables, timelines, and budgets are executed according to individual signed proposals.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">3. Payment Terms & Milestones</h3>
                            <p>Project payments follow the milestone schedule outlined in your agreement. Deposits are required before engineering begins. Payments correspond to verified deliverable approvals.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">4. Intellectual Property & Ownership</h3>
                            <p>Upon final payment, clients receive 100% full ownership of custom source code, design assets, and database schemas created for their specific business project.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">5. Revisions & Modifications</h3>
                            <p>Each project proposal includes standard revision cycles. Scope additions or custom features requested outside the initial proposal are evaluated under clear change requests.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">6. Limitation of Liability</h3>
                            <p>Talos.design shall not be liable for indirect, incidental, or consequential damages arising from third-party API downtime. Our maximum liability is capped at the fees paid for the specific service module.</p>
                        </div>
                    </div>
                </motion.section>

                {/* Section 02: Privacy Policy */}
                <motion.section
                    id="privacy"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-32"
                >
                    <div className="flex items-center gap-4 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan-glow)]"></span>
                        <span className="text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest font-bold">Section 02</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-8 font-bold">
                        Privacy <span className="text-[var(--accent-cyan)]">Policy</span>
                    </h2>

                    <div className="glass-panel p-8 md:p-10 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed rounded-3xl border border-[var(--border-color)]">
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">1. Information We Collect</h3>
                            <p>We collect essential operational information provided directly by clients, including contact names, company emails, phone numbers, and business documentation required for AI model training.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">2. Purpose of Processing</h3>
                            <p>Information is used exclusively to build, configure, and maintain your custom AI agents, website analytics, and automated workflow pipelines. We strictly do not sell client data.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">3. Data Retention & Privacy Rights</h3>
                            <p>You reserve full rights to request complete deletion or retrieval of your stored client data at any time by emailing <a href="mailto:hello@talos.design" className="text-[var(--accent-cyan)] font-bold hover:underline">hello@talos.design</a>.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base">4. Cookies & Analytics</h3>
                            <p>We use essential cookies strictly for system performance and session security. No cross-site advertising or third-party tracking pixels are deployed.</p>
                        </div>
                    </div>
                </motion.section>

                {/* Section 03: Security & Governance */}
                <motion.section
                    id="security"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-32"
                >
                    <div className="flex items-center gap-4 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-orange)] shadow-[0_0_10px_var(--accent-orange-glow)]"></span>
                        <span className="text-xs font-mono text-[var(--accent-orange)] uppercase tracking-widest font-bold">Section 03</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-8 font-bold">
                        Security & <span className="text-[var(--accent-orange)]">Governance</span>
                    </h2>

                    <div className="glass-panel p-8 md:p-10 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed rounded-3xl border border-[var(--accent-orange)]/30 shadow-[0_0_30px_rgba(212,175,55,0.08)]">
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base flex items-center gap-2">
                                <ShieldCheck size={18} className="text-[var(--accent-orange)]" /> 1. Data Encryption Standards
                            </h3>
                            <p>All data transmitted through our web interfaces and automated API webhooks is encrypted in transit using TLS 1.3 protocols. Stored data and vector embeddings are encrypted at rest using AES-256 encryption.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base flex items-center gap-2">
                                <Lock size={18} className="text-[var(--accent-orange)]" /> 2. AI Model Governance & Data Isolation
                            </h3>
                            <p>Your proprietary business data, catalogs, and PDFs are strictly isolated. We implement dedicated vector memory databases so your business knowledge is never shared across clients or used to train public LLM foundation models.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base flex items-center gap-2">
                                <FileText size={18} className="text-[var(--accent-orange)]" /> 3. Access Control & Authentication
                            </h3>
                            <p>System dashboards and administrative panels enforce multi-factor authentication (MFA), role-based access control (RBAC), and strict principle-of-least-privilege access for all team members.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2 text-base flex items-center gap-2">
                                <HelpCircle size={18} className="text-[var(--accent-orange)]" /> 4. Infrastructure Resilience &amp; Reliability
                            </h3>
                            <p>Our automation pipelines and web services are deployed on established cloud infrastructure providers (AWS, Firebase, and Cloudflare) with automated backups and continuous health monitoring.</p>
                        </div>
                    </div>
                </motion.section>

                {/* Section 04: Disclaimer */}
                <motion.section
                    id="disclaimer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="scroll-mt-32"
                >
                    <div className="flex items-center gap-4 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc] shadow-[0_0_10px_rgba(192,132,252,0.5)]"></span>
                        <span className="text-xs font-mono text-[#c084fc] uppercase tracking-widest font-bold">Section 04</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-8 font-bold">
                        <span className="text-[#c084fc]">Disclaimer</span>
                    </h2>

                    <div className="glass-panel p-8 md:p-10 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed rounded-3xl border border-[var(--border-color)]">
                        <p>The information provided on this website is for general informational purposes. While we strive to maintain complete accuracy, Talos.design makes no representations or warranties regarding specific third-party API availability.</p>
                        <p>All operational projections, estimated time savings, and system capabilities described across our service documentation reflect targeted outcomes based on architectural specifications, and actual results may vary depending on individual operational environments.</p>
                    </div>
                </motion.section>

                {/* Contact Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel p-8 md:p-10 text-center rounded-3xl border border-[var(--accent-orange)]/40"
                >
                    <h3 className="text-2xl font-display font-bold mb-3 uppercase tracking-tight">Need Legal or Compliance Clarification?</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md mx-auto leading-relaxed">
                        If you have specific security compliance questions or require custom data processing agreements, our engineering team is here to assist.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/contact" className="btn-hero-primary">
                            Contact Compliance Team
                        </Link>
                        <a href="mailto:hello@talos.design" className="btn-hero-secondary">
                            Email Compliance
                        </a>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
