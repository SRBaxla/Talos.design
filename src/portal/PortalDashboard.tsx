import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, FileText, Clock, ExternalLink, Send, MessageSquare } from 'lucide-react';
import { useProjects, useInvoices, useMessages, sendMessage } from '../admin/store/adminStore';
import type { Project } from '../admin/store/adminStore';

export default function PortalDashboard() {
    const navigate = useNavigate();
    const [clientEmail, setClientEmail] = useState<string | null>(null);

    const { projects, loading: pLoading } = useProjects();
    const { invoices, loading: iLoading } = useInvoices();

    // We will initialize useMessages after we find the project
    const clientProject = projects.find(p => p.clientEmail?.toLowerCase() === clientEmail?.toLowerCase());
    const clientInvoices = invoices.filter(i => i.clientEmail?.toLowerCase() === clientEmail?.toLowerCase());

    const { messages, loading: mLoading } = useMessages(clientProject?.id || '');
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('talosClientEmail');
        if (!email) {
            navigate('/portal');
        } else {
            setClientEmail(email);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('talosClientEmail');
        navigate('/portal');
    };

    if (pLoading || iLoading || (clientProject && mLoading)) {
        return (
            <div className="admin-shell flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-cyan)] border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !clientProject) return;
        setSending(true);
        try {
            await sendMessage(clientProject.id, newMessage, 'client');
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSending(false);
        }
    };

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'in-progress': return '#00e5ff';
            case 'completed': return '#22c55e';
            case 'published': return '#a855f7';
            case 'review': return '#f59e0b';
            case 'lead': return '#71717a';
            default: return '#71717a';
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-white w-full">
            <header className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex justify-center items-center gap-2">
                        <span className="text-[var(--accent-cyan)] font-mono text-sm uppercase tracking-widest px-2 py-1 bg-[rgba(0,229,255,0.1)] rounded border border-[rgba(0,229,255,0.2)]">CLIENT PORTAL</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <span className="text-[var(--text-muted)] hidden md:inline-block">{clientEmail}</span>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-[var(--accent-orange)] hover:text-white transition-colors">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {!clientProject && clientInvoices.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center border border-[var(--border-color)] border-dashed rounded-lg bg-[rgba(255,255,255,0.02)]">
                        <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4 text-[var(--text-muted)]">
                            <Clock size={24} />
                        </div>
                        <h2 className="text-xl font-bold mb-2">No active projects found</h2>
                        <p className="text-[var(--text-secondary)] max-w-md">Your project details or invoices will appear here once our engineers assign them to your email address.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Project Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {clientProject ? (
                                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-display font-bold">Project Status</h2>
                                        <span className="px-3 py-1 text-xs uppercase font-bold rounded-full font-mono tracking-widest" style={{ backgroundColor: `${getStatusColor(clientProject.status)}20`, color: getStatusColor(clientProject.status), border: `1px solid ${getStatusColor(clientProject.status)}` }}>
                                            {clientProject.status}
                                        </span>
                                    </div>

                                    <div className="admin-card">
                                        <div className="admin-card-header border-b border-[var(--border-color)] pb-4 mb-4">
                                            <h3 className="text-xl font-bold text-[var(--accent-cyan)]">{clientProject.title}</h3>
                                            <p className="text-sm text-[var(--text-muted)] mt-1">{clientProject.type}</p>
                                        </div>

                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                                            {clientProject.description || "No project description provided."}
                                        </p>

                                        {clientProject.technologies && clientProject.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {clientProject.technologies.map((tech, idx) => (
                                                    <span key={idx} className="text-xs text-[var(--text-muted)] bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] px-2 py-1 rounded">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {clientProject.link && (
                                            <a href={clientProject.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[var(--accent-orange)] text-sm font-bold bg-[rgba(245,158,11,0.1)] px-4 py-2 rounded hover:bg-[rgba(245,158,11,0.2)] transition-colors w-full justify-center md:w-auto">
                                                <ExternalLink size={16} /> View Live Deployment
                                            </a>
                                        )}
                                    </div>
                                </motion.section>
                            ) : (
                                <div className="admin-card bg-[var(--bg-surface-elevated)] border-dashed">
                                    <div className="p-8 text-center text-[var(--text-muted)]">
                                        Your custom project space is still being generated.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Invoices Column */}
                        <div className="lg:col-span-1 space-y-8">
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-[var(--accent-cyan)]" /> Invoices
                                </h2>

                                {clientInvoices.length === 0 ? (
                                    <div className="text-sm text-[var(--text-muted)] p-6 bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded text-center">
                                        No invoices linked to this account.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {clientInvoices.map((inv) => (
                                            <div key={inv.id} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded p-4 hover:border-[rgba(0,229,255,0.3)] transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">#{inv.invoiceNumber}</span>
                                                        <span className="font-bold text-lg font-mono">
                                                            ${inv.items.reduce((s, item) => s + (item.quantity * item.rate), 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border" style={{
                                                        color: inv.status === 'paid' ? '#22c55e' : inv.status === 'overdue' ? '#ef4444' : '#3b82f6',
                                                        borderColor: inv.status === 'paid' ? 'rgba(34,197,94,0.3)' : inv.status === 'overdue' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)',
                                                        backgroundColor: inv.status === 'paid' ? 'rgba(34,197,94,0.1)' : inv.status === 'overdue' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)'
                                                    }}>
                                                        {inv.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-4">
                                                    <span>Issued: {inv.issueDate}</span>
                                                    <span>Due: {inv.dueDate}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.section>

                            {/* Client Chat Messages */}
                            {clientProject && (
                                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-col h-[500px]">
                                    <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                                        <MessageSquare size={20} className="text-[#a855f7]" /> Project Chat
                                    </h2>

                                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-t-lg p-4 flex-1 overflow-y-auto space-y-4 flex flex-col">
                                        {messages.length === 0 ? (
                                            <div className="text-center text-[var(--text-muted)] text-sm my-auto">No messages yet. Send a message to the engineering team.</div>
                                        ) : (
                                            messages.map((msg) => (
                                                <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.sender === 'client'
                                                        ? 'bg-[var(--accent-cyan)] text-black rounded-br-none'
                                                        : 'bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] text-white rounded-bl-none'
                                                        }`}>
                                                        <div className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-70">
                                                            {msg.sender === 'client' ? 'You' : 'Talos Team'}
                                                        </div>
                                                        <div className="whitespace-pre-wrap">{msg.text}</div>
                                                        <div className="text-[10px] mt-2 opacity-50 text-right">
                                                            {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="bg-[rgba(0,0,0,0.2)] border border-[var(--border-color)] border-t-0 p-3 rounded-b-lg">
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Message the team..."
                                                className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                                            />
                                            <button
                                                type="submit"
                                                disabled={sending || !newMessage.trim()}
                                                className="bg-[var(--accent-cyan)] text-black p-2 rounded hover:bg-[var(--accent-cyan-glow)] disabled:opacity-50 transition-colors flex items-center justify-center"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </form>
                                    </div>
                                </motion.section>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
