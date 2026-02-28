import { Mail, Globe, Code, Network, Send, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addInquiry } from '../admin/store/adminStore';

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
            const prefilledMessage = `Negotiation Request: ${bundleType}\n\nEstimated Value: ~$${estimatedValue}\n\nSelected Modules:\n${modules.map((m: string) => `- ${m}`).join('\n')}\n\nAdditional Details:\n`;
            setMessage(prefilledMessage);
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTransmitting(true);

        try {
            await addInquiry({ name, email, company, message });

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setName('');
                setEmail('');
                setCompany('');
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error("Failed to transmit data:", error);
        } finally {
            setIsTransmitting(false);
        }
    };

    return (
        <div className="container py-16 flex flex-col flex-grow">

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 mb-8"
            >
                <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
                <div className="badge badge-online">SYSTEM STATUS: ONLINE</div>
            </motion.div>

            <div className="mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-display tracking-tight mb-6"
                >
                    Initiate <span className="text-[var(--accent-orange)]">Sequence.</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-[var(--text-secondary)] max-w-2xl"
                >
                    Ready to automate your future? Establish a neural link with our engineering team.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Form Column - Left */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-7"
                >
                    <div className="glass-panel p-8 relative overflow-hidden bg-[rgba(18,18,20,0.8)] border border-[rgba(245,158,11,0.2)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-orange)] opacity-[0.05] blur-[80px] rounded-full pointer-events-none"></div>

                        <form className="relative z-10 flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-2">IDENTITY_REF_ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors text-white placeholder-[var(--text-muted)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-2">SIGNAL_FREQ (EMAIL)</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors text-white placeholder-[var(--text-muted)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-2">ORGANIZATION</label>
                                <input
                                    type="text"
                                    required
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="Company Name"
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors text-white placeholder-[var(--text-muted)]"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-2">OBJECTIVE_PARAMETERS</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe your automation requirements..."
                                    rows={6}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors text-white placeholder-[var(--text-muted)] resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isTransmitting}
                                className="btn btn-primary w-full py-4 text-sm font-bold tracking-widest flex items-center justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} className="mr-2" />
                                {isTransmitting ? 'TRANSMITTING...' : status === 'success' ? 'TRANSMISSION SUCCESSFUL' : 'TRANSMIT DATA'}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Sidebar Column - Right */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel p-6 flex items-start gap-4 hover:border-[rgba(245,158,11,0.3)] transition-colors"
                    >
                        <div className="w-12 h-12 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center shrink-0">
                            <Mail className="text-[var(--accent-orange)]" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Neural Link</h3>
                            <p className="text-[var(--text-secondary)] text-sm mb-3">Direct channel for inquiries and support protocols.</p>
                            <a href="mailto:hello@talos.design" className="text-[var(--accent-orange)] text-sm font-mono hover:underline">hello@talos.design</a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-panel p-6 flex items-start gap-4 hover:border-[rgba(245,158,11,0.3)] transition-colors"
                    >
                        <div className="w-12 h-12 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center shrink-0">
                            <Laptop className="text-[var(--accent-orange)]" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Remote First</h3>
                            <p className="text-[var(--text-secondary)] text-sm mb-3">We're a fully remote team — no physical office, just pure digital operations.</p>
                            <div className="text-white text-sm font-mono">Based in India 🇮🇳</div>
                            <div className="text-[var(--text-muted)] text-sm">Available worldwide, async-friendly</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-panel p-6 overflow-hidden relative"
                    >
                        <div className="absolute inset-x-0 top-0 h-32 opacity-20 bg-cover bg-center pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                        <div className="h-32 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded mb-6 flex items-center justify-center relative overflow-hidden">
                            {/* Simulated map graphic */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface-elevated)] to-transparent z-10"></div>
                            <div className="w-full h-full border border-[var(--border-color)] opacity-30 right-[-20%] bottom-[-20%] absolute rotate-12 transform scale-150" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        </div>
                        <h3 className="text-lg font-bold mb-4">Network Protocols</h3>
                        <div className="flex gap-3">
                            <a href="https://talos.design" target="_blank" rel="noreferrer" className="w-10 h-10 rounded border border-[var(--border-color)] bg-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[var(--accent-cyan)] hover:text-black transition-colors">
                                <Globe size={18} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded border border-[var(--border-color)] bg-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[var(--accent-cyan)] hover:text-black transition-colors">
                                <Network size={18} />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded border border-[var(--border-color)] bg-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[var(--accent-cyan)] hover:text-black transition-colors">
                                <Code size={18} />
                            </a>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
