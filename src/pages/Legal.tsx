import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Legal() {
    const lastUpdated = 'February 24, 2026';

    return (
        <div className="container py-16 flex flex-col flex-grow items-center relative z-10 w-full">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-online mb-8 font-mono text-xs border-[rgba(245,158,11,0.3)] shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            >
                LEGAL_DOCUMENTATION
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center"
            >
                Legal <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Notice</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-[var(--text-muted)] text-center mb-16 font-mono"
            >
                Last updated: {lastUpdated}
            </motion.p>

            {/* Content */}
            <div className="w-full max-w-3xl space-y-16">

                {/* Terms of Service */}
                <motion.section
                    id="terms"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-4 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Section 01</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display uppercase tracking-tight mb-8">
                        Terms of <span className="text-[var(--accent-orange)]">Service</span>
                    </h2>

                    <div className="glass-panel p-8 md:p-10 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
                        <div>
                            <h3 className="text-white font-bold mb-2">1. Agreement to Terms</h3>
                            <p>By accessing or using the services provided by Talos.design, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">2. Services</h3>
                            <p>Talos.design provides SaaS solutions including web design, AI chatbot development, and system automation services. All project scopes, deliverables, and timelines are agreed upon in individual project proposals before work begins.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">3. Payment Terms</h3>
                            <p>Payment schedules are defined in individual project agreements. Unless otherwise stated, a deposit is required before work begins. All payments are non-refundable once the corresponding milestone has been delivered and approved.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">4. Intellectual Property</h3>
                            <p>Upon full payment, clients receive full ownership of all custom code, designs, and assets created for their project. Talos.design retains the right to showcase the work in its portfolio unless otherwise agreed.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">5. Revisions & Scope</h3>
                            <p>Each project includes a defined number of revision rounds as specified in the project proposal. Additional revisions or scope changes may incur extra charges, which will be communicated and approved before proceeding.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">6. Limitation of Liability</h3>
                            <p>Talos.design shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the total fees paid for the specific project in question.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">7. Termination</h3>
                            <p>Either party may terminate a project agreement with written notice. Upon termination, compensation is due for all work completed up to the termination date.</p>
                        </div>
                    </div>
                </motion.section>

                {/* Privacy Policy */}
                <motion.section
                    id="privacy"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-4 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Section 02</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display uppercase tracking-tight mb-8">
                        Privacy <span className="text-[var(--accent-cyan)]">Policy</span>
                    </h2>

                    <div className="glass-panel p-8 md:p-10 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
                        <div>
                            <h3 className="text-white font-bold mb-2">1. Information We Collect</h3>
                            <p>We collect information you provide directly to us, including your name, email address, company name, and project requirements when you fill out our contact form or communicate with us via email.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">2. How We Use Your Information</h3>
                            <p>We use the information we collect to respond to your inquiries, provide our services, send project updates, and improve our offerings. We do not sell your personal information to third parties.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">3. Data Storage</h3>
                            <p>Your data is stored securely using industry-standard encryption and security practices. We use trusted third-party services (such as Firebase and Google Cloud) for data storage and processing.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">4. Cookies</h3>
                            <p>Our website may use essential cookies for basic functionality such as site analytics. We do not use cookies for advertising or tracking purposes across other websites.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">5. Third-Party Services</h3>
                            <p>We may use third-party tools for analytics (such as Google Analytics), hosting, and communication. These services have their own privacy policies, and we encourage you to review them.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">6. Your Rights</h3>
                            <p>You have the right to access, update, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:hello@talos.design" className="text-[var(--accent-cyan)] hover:underline">hello@talos.design</a>.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-2">7. Changes to This Policy</h3>
                            <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.</p>
                        </div>
                    </div>
                </motion.section>

                {/* Disclaimer */}
                <motion.section
                    id="disclaimer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-4 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.5)]"></span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Section 03</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display uppercase tracking-tight mb-8">
                        <span className="text-[#c084fc]">Disclaimer</span>
                    </h2>

                    <div className="glass-panel p-8 md:p-10 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
                        <p>The information provided on this website is for general informational purposes only. While we strive to keep the content accurate and up to date, Talos.design makes no representations or warranties of any kind about the completeness, accuracy, or reliability of the information.</p>
                        <p>Any reliance you place on such information is strictly at your own risk. Talos.design will not be liable for any losses or damages in connection with the use of this website.</p>
                        <p>All project outcomes, metrics, and results mentioned on this site are illustrative and may vary based on individual project requirements and external factors.</p>
                    </div>
                </motion.section>

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel p-8 md:p-10 text-center"
                >
                    <h3 className="text-lg font-display font-bold mb-3">Questions?</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">If you have any questions about our legal policies, feel free to reach out.</p>
                    <Link to="/contact" className="btn btn-primary px-8 py-3 text-sm">
                        Contact Us
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
