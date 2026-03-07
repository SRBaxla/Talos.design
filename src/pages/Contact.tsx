import { Mail, Clock, CheckCircle, Send, Laptop, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addInquiry } from '../admin/store/adminStore';
import { sendAutoResponderEmail } from '../lib/emailService';

const nextSteps = [
    { label: 'We read your message', sub: 'Usually within a few hours' },
    { label: 'We schedule a call', sub: 'Free 30-min discovery session' },
    { label: 'You get a proposal', sub: 'Scope, timeline & fixed price' },
    { label: 'We build', sub: 'Phased delivery with check-ins' },
];

export default function Contact() {
    const location = useLocation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [message, setMessage] = useState('');
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    useEffect(() => {
        if (location.state && location.state.bundleType) {
            const { bundleType, estimatedValue, modules = [] } = location.state;
            const prefilledMessage = `Project Enquiry: ${bundleType}\n\nEstimated Value: ~$${estimatedValue}\n\nSelected Modules:\n${modules.map((m: string) => `- ${m}`).join('\n')}\n\nAdditional Details:\n`;
            setMessage(prefilledMessage);
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTransmitting(true);
        try {
            await addInquiry({ name, email, company, message });

            // Send the auto-responder email to the user
            try {
                await sendAutoResponderEmail({ clientName: name, clientEmail: email });
            } catch (emailErr) {
                console.error("Failed to send auto-responder email. Inquiry was still saved.", emailErr);
            }

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setName('');
                setEmail('');
                setCompany('');
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsTransmitting(false);
        }
    };

    return (
        <div className="container py-16 flex flex-col flex-grow">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">We're available</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-display tracking-tight mb-5">
                    Let's <span className="text-[var(--accent-orange)] drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Talk.</span>
                </h1>
                <p className="text-xl text-[var(--text-secondary)] max-w-2xl">
                    Tell us about your project and we'll get back to you with a clear plan — no sales pitch, just a straightforward conversation.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-7"
                >
                    <div className="glass-panel p-8 relative overflow-hidden border-[rgba(245,158,11,0.2)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-orange)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

                        <form className="relative z-10 flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Smith"
                                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Company / Business Name</label>
                                <input
                                    type="text"
                                    required
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="Your business name"
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Tell us about your project</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="What do you need built? What problem are you trying to solve? Any timeline or budget in mind?"
                                    rows={6}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isTransmitting}
                                className="btn btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_var(--accent-orange-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'success' ? (
                                    <>
                                        <CheckCircle size={16} /> Message Sent!
                                    </>
                                ) : isTransmitting ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <Send size={16} /> Send Message
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-[var(--text-muted)] text-center">
                                No spam. We only use this to reply to your message.
                            </p>
                        </form>
                    </div>
                </motion.div>

                {/* Sidebar */}
                <div className="lg:col-span-5 flex flex-col gap-5">

                    {/* Email */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-panel p-6 flex items-start gap-4 hover:border-[rgba(245,158,11,0.3)] transition-colors"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[rgba(210,193,182,0.08)] border border-[rgba(210,193,182,0.2)] flex items-center justify-center shrink-0">
                            <Mail className="text-[var(--accent-orange)]" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold mb-1">Email us directly</h3>
                            <p className="text-[var(--text-muted)] text-xs mb-2">Prefer email? Reach out anytime.</p>
                            <a href="mailto:hello@talos.design" className="text-[var(--accent-orange)] text-sm font-mono hover:underline">
                                hello@talos.design
                            </a>
                        </div>
                    </motion.div>

                    {/* Response time */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel p-6 flex items-start gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[rgba(69,104,130,0.08)] border border-[rgba(69,104,130,0.25)] flex items-center justify-center shrink-0">
                            <Clock className="text-[var(--accent-cyan)]" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold mb-1">Response time</h3>
                            <p className="text-[var(--text-muted)] text-xs mb-1">We typically reply within <span className="text-[var(--text-primary)] font-medium">a few hours</span>.</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Laptop size={12} className="text-[var(--text-muted)]" />
                                <span className="text-[10px] font-mono text-[var(--text-muted)]">Based in India 🇮🇳 — async-friendly worldwide</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* What happens next */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-panel p-6"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <MessageSquare size={14} className="text-[var(--accent-orange)]" />
                            <h3 className="text-sm font-bold">What happens after you send?</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            {nextSteps.map((step, i) => (
                                <div key={step.label} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[rgba(210,193,182,0.1)] border border-[rgba(210,193,182,0.2)] flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-[8px] font-mono text-[var(--text-muted)]">{i + 1}</span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-[var(--text-primary)]">{step.label}</div>
                                        <div className="text-[10px] text-[var(--text-muted)]">{step.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
