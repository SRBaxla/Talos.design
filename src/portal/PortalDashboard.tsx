import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut, FolderKanban, FileText, MessageSquare, ExternalLink,
    Send, Clock, CheckCircle, ChevronRight, Hexagon, User as UserIcon, Download, DollarSign,
    Monitor, Tablet, Smartphone, X, RefreshCw
} from 'lucide-react';
import {
    useProjects, useInvoices, useMessages, sendMessage,
} from '../admin/store/adminStore';
import type { Project } from '../admin/store/adminStore';
import { onClientAuthChange, signOutClient } from './portalStore';
import type { User as FirebaseUser } from 'firebase/auth';

/* ── Stage stepper data ─────────────────────────────────────── */
const STAGES: { key: Project['status']; label: string }[] = [
    { key: 'lead', label: 'Discovery' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'review', label: 'Review' },
    { key: 'completed', label: 'Completed' },
    { key: 'published', label: 'Live' },
];

const stageIndex = (status: Project['status']) =>
    STAGES.findIndex(s => s.key === status);

const TYPE_LABELS: Record<Project['type'], string> = {
    'web-design': 'Web Design',
    'ai-chatbot': 'AI Chatbot',
    automation: 'Automation',
    custom: 'Custom',
};

const INVOICE_STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
    paid: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
    overdue: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
    sent: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
    draft: { color: '#71717a', bg: 'rgba(113,113,122,0.1)', border: 'rgba(113,113,122,0.3)' },
};

/* ── Sub-components ─────────────────────────────────────────── */
function StageStepper({ status }: { status: Project['status'] }) {
    const current = stageIndex(status);
    return (
        <div className="flex items-center w-full gap-0 mt-4">
            {STAGES.map((stage, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <div key={stage.key} className="flex items-center flex-1 min-w-0">
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                                    ${done ? 'bg-[var(--accent-orange)] text-black' : active ? 'bg-[rgba(210,193,182,0.2)] border-2 border-[var(--accent-orange)] text-[var(--accent-orange)]' : 'bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] text-[var(--text-muted)]'}`}
                            >
                                {done ? <CheckCircle size={12} /> : <span>{i + 1}</span>}
                            </div>
                            <span className={`text-[9px] font-mono mt-1 whitespace-nowrap hidden sm:block ${active ? 'text-[var(--accent-orange)]' : done ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
                                {stage.label}
                            </span>
                        </div>
                        {i < STAGES.length - 1 && (
                            <div className={`h-px flex-1 mx-1 transition-all ${i < current ? 'bg-[var(--accent-orange)]' : 'bg-[var(--border-color)]'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function ProjectCard({ project, onMessageClick }: { project: Project; onMessageClick: () => void }) {
    const [expanded, setExpanded] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [iframeLoading, setIframeLoading] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 hover:border-[rgba(210,193,182,0.25)] transition-all"
        >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
                            {TYPE_LABELS[project.type]}
                        </span>
                        {project.liveUrl && (
                            <button
                                onClick={() => { setIframeLoading(true); setPreviewOpen(true); }}
                                className="px-2 py-0.5 rounded bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 text-[var(--accent-orange)] font-bold hover:bg-[var(--accent-orange)] hover:text-[#07090E] transition-all text-[10px] flex items-center gap-1"
                            >
                                <ExternalLink size={10} /> Live Site Preview
                            </button>
                        )}
                    </div>
                    <h3 className="text-lg font-display font-bold truncate">{project.title}</h3>
                </div>
                <span
                    className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full shrink-0"
                    style={{
                        color: stageIndex(project.status) === STAGES.length - 1 ? '#22c55e' : 'var(--accent-orange)',
                        background: stageIndex(project.status) === STAGES.length - 1 ? 'rgba(34,197,94,0.1)' : 'rgba(210,193,182,0.1)',
                        border: `1px solid ${stageIndex(project.status) === STAGES.length - 1 ? 'rgba(34,197,94,0.3)' : 'rgba(210,193,182,0.3)'}`,
                    }}
                >
                    {project.status.replace('-', ' ')}
                </span>
            </div>

            {/* Stage stepper */}
            <StageStepper status={project.status} />

            {/* Expandable details */}
            <button
                onClick={() => setExpanded(e => !e)}
                className="mt-4 text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
            >
                <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
                {expanded ? 'Hide details' : 'Show details'}
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-4 border-t border-[var(--border-color)] mt-3">
                            {project.description && (
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {project.description}
                                </p>
                            )}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                {project.startDate && (
                                    <div>
                                        <div className="text-[var(--text-muted)] mb-0.5">Start date</div>
                                        <div className="font-mono text-[var(--text-primary)]">{project.startDate}</div>
                                    </div>
                                )}
                                {project.endDate && (
                                    <div>
                                        <div className="text-[var(--text-muted)] mb-0.5">Target date</div>
                                        <div className="font-mono text-[var(--text-primary)]">{project.endDate}</div>
                                    </div>
                                )}
                                {(project as any).budget && (
                                    <div>
                                        <div className="text-[var(--text-muted)] mb-0.5 flex items-center gap-1"><DollarSign size={10} /> Budget</div>
                                        <div className="font-mono text-[var(--text-primary)] font-bold">${Number((project as any).budget).toLocaleString()}</div>
                                    </div>
                                )}
                            </div>
                            {project.selectedFeatures && project.selectedFeatures.length > 0 && (
                                <div>
                                    <div className="text-[10px] text-[var(--text-muted)] mb-2 uppercase tracking-widest">Included Features</div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.selectedFeatures.map((f, i) => (
                                            <span key={i} className="text-[10px] bg-[rgba(255,255,255,0.04)] border border-[var(--border-color)] px-2 py-0.5 rounded-full text-[var(--text-secondary)]">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {(project as any).clientRequirements && (project as any).clientRequirements.length > 0 && (
                                <div>
                                    <div className="text-[10px] text-[var(--text-muted)] mb-2 uppercase tracking-widest">Your Requirements</div>
                                    <ul className="space-y-1">
                                        {((project as any).clientRequirements as string[]).map((r, i) => (
                                            <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                                                <span className="w-1 h-1 rounded-full bg-[var(--accent-orange)] mt-1.5 shrink-0" />
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {(project as any).costRevisions && (project as any).costRevisions.length > 0 && (
                                <div>
                                    <div className="text-[10px] text-[var(--text-muted)] mb-2 uppercase tracking-widest">Cost History</div>
                                    <div className="space-y-1">
                                        {((project as any).costRevisions as { amount: number; reason: string }[]).map((cr, i) => (
                                            <div key={i} className="flex justify-between text-xs border border-[var(--border-color)] rounded px-3 py-1.5">
                                                <span className="text-[var(--text-secondary)]">{cr.reason}</span>
                                                <span className="font-mono font-bold text-[var(--text-primary)]">${cr.amount?.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={onMessageClick}
                                className="text-xs text-[var(--accent-orange)] flex items-center gap-1 hover:underline"
                            >
                                <MessageSquare size={12} /> Message team about this project
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Live Site Preview Modal for Clients */}
            <AnimatePresence>
                {previewOpen && project.liveUrl && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewOpen(false)}
                        className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-hidden text-left"
                    >
                        <motion.div 
                            className="w-full max-w-6xl h-[88vh] max-h-[850px] rounded-[2rem] overflow-hidden relative glass-panel border border-[var(--border-color)] bg-[#07090E] shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 shrink-0">
                                <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:opacity-80" onClick={() => setPreviewOpen(false)} />
                                        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <span className="w-3 h-3 rounded-full bg-green-400/80" />
                                    </div>

                                    {/* Integrated Live URL Address Bar */}
                                    <div className="flex items-center gap-2 bg-[#07090E] px-3 py-1 rounded-xl border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[220px] sm:max-w-md">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                                        <span className="truncate">{project.liveUrl}</span>
                                        {project.liveUrl && (
                                            <a 
                                                href={project.liveUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-[10px] text-[var(--accent-orange)] hover:underline flex items-center gap-0.5 ml-auto shrink-0 font-bold"
                                                title="Open in external browser tab"
                                            >
                                                <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-[#07090E] p-1 rounded-xl border border-[var(--border-color)]">
                                        <button 
                                            onClick={() => setDeviceView('desktop')}
                                            className={`px-3 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-all ${deviceView === 'desktop' ? 'bg-[var(--accent-orange)] text-[#07090E] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            <Monitor size={13} /> Desktop
                                        </button>
                                        <button 
                                            onClick={() => setDeviceView('tablet')}
                                            className={`px-3 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-all ${deviceView === 'tablet' ? 'bg-[var(--accent-orange)] text-[#07090E] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            <Tablet size={13} /> Tablet
                                        </button>
                                        <button 
                                            onClick={() => setDeviceView('mobile')}
                                            className={`px-3 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-all ${deviceView === 'mobile' ? 'bg-[var(--accent-orange)] text-[#07090E] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            <Smartphone size={13} /> Mobile
                                        </button>
                                    </div>
                                    <button onClick={() => setPreviewOpen(false)} className="p-1.5 text-[var(--text-muted)] hover:text-white rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Direct Edge-To-Edge Preview Canvas */}
                            <div className="flex-1 min-h-0 relative bg-black/70 overflow-hidden flex items-center justify-center">
                                <div 
                                    className={`transition-all duration-300 w-full h-full flex flex-col items-center justify-center ${
                                        deviceView === 'desktop' ? 'max-w-full' :
                                        deviceView === 'tablet' ? 'max-w-[720px] py-4' : 'max-w-[360px] py-4'
                                    }`}
                                >
                                    <div className="w-full h-full relative bg-white overflow-hidden flex-1 min-h-0 shadow-2xl rounded-none sm:rounded-xl">
                                        <div className="relative w-full h-full flex-1 min-h-0 overflow-hidden">
                                            {iframeLoading && (
                                                <div className="absolute inset-0 bg-[#07090E] flex flex-col items-center justify-center gap-3 z-10">
                                                    <RefreshCw size={24} className="text-[var(--accent-orange)] animate-spin" />
                                                    <span className="text-xs font-mono text-[var(--text-muted)]">Loading project build: {project.liveUrl}</span>
                                                </div>
                                            )}
                                            <div className="w-full h-full overflow-hidden relative flex-1 min-h-0">
                                                <iframe 
                                                    src={project.liveUrl} 
                                                    title={project.title}
                                                    onLoad={() => setIframeLoading(false)}
                                                    className="w-[calc(100%+24px)] h-full -mr-[24px] border-none"
                                                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-4 shrink-0">
                                <a 
                                    href={project.liveUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-5 py-2.5 rounded-xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-md"
                                >
                                    Open Website In New Tab <ExternalLink size={14} />
                                </a>
                                <button 
                                    onClick={() => setPreviewOpen(false)}
                                    className="px-6 py-2.5 rounded-xl border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ── Chat panel ─────────────────────────────────────────────── */
function ChatPanel({ projects }: { projects: Project[] }) {
    const [selectedId, setSelectedId] = useState(projects[0]?.id || '');
    const { messages } = useMessages(selectedId);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !selectedId) return;
        setSending(true);
        try {
            await sendMessage(selectedId, text, 'client');
            setText('');
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
                <MessageSquare size={32} className="mb-3 opacity-30" />
                <p className="text-sm">No projects to chat about yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-[400px]">
            {/* Project selector (only if multiple) */}
            {projects.length > 1 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                    {projects.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedId(p.id)}
                            className={`text-xs px-3 py-1.5 rounded-full border font-mono transition-all ${selectedId === p.id
                                ? 'border-[var(--accent-orange)] text-[var(--accent-orange)] bg-[rgba(210,193,182,0.1)]'
                                : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[rgba(210,193,182,0.3)]'
                                }`}
                        >
                            {p.title}
                        </button>
                    ))}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-t-xl p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] text-sm gap-2">
                        <MessageSquare size={24} className="opacity-30" />
                        No messages yet. Start the conversation below.
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'client'
                                ? 'bg-[var(--accent-orange)] text-black rounded-br-none'
                                : 'bg-[rgba(255,255,255,0.06)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-bl-none'
                                }`}
                            >
                                <div className="text-[9px] uppercase font-bold opacity-60 mb-1">
                                    {msg.sender === 'client' ? 'You' : 'Talos Team'}
                                </div>
                                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                                <div className="text-[9px] mt-1 opacity-50 text-right">
                                    {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] border-t-0 rounded-b-xl p-3">
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Message the Talos team..."
                    className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                />
                <button
                    type="submit"
                    disabled={sending || !text.trim()}
                    className="bg-[var(--accent-orange)] text-black px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5 text-sm font-bold"
                >
                    <Send size={14} /> Send
                </button>
            </form>
        </div>
    );
}

/* ── Main Dashboard ─────────────────────────────────────────── */
type Tab = 'projects' | 'invoices' | 'messages';

export default function PortalDashboard() {
    const navigate = useNavigate();
    const [clientUser, setClientUser] = useState<FirebaseUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('projects');

    useEffect(() => {
        const unsub = onClientAuthChange((user) => {
            if (!user) navigate('/portal');
            else setClientUser(user);
            setAuthLoading(false);
        });
        return unsub;
    }, [navigate]);

    const clientEmail = clientUser?.email || undefined;

    // Pass clientEmail so the Firestore query includes where('clientEmail', '==', email)
    const { projects, loading: pLoading } = useProjects(clientEmail);
    const { invoices, loading: iLoading } = useInvoices(clientEmail);

    // Projects/invoices are already filtered at query level
    const clientProjects = projects;
    const clientInvoices = invoices;

    const handleLogout = async () => {
        await signOutClient();
        navigate('/portal');
    };

    if (authLoading || pLoading || iLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-orange)] border-t-transparent animate-spin" />
            </div>
        );
    }

    const tabs: { key: Tab; label: string; count?: number }[] = [
        { key: 'projects', label: 'Projects', count: clientProjects.length },
        { key: 'invoices', label: 'Invoices', count: clientInvoices.length },
        { key: 'messages', label: 'Messages' },
    ];

    return (
        <div className="h-screen bg-[var(--bg-base)] text-[var(--text-primary)] w-full flex flex-col overflow-hidden">

            {/* ── HEADER ──────────────────────────────────────────── */}
            <header className="flex-none border-b border-[var(--border-color)] bg-[var(--bg-surface)] backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Hexagon size={22} className="text-[var(--accent-orange)]" />
                        <span className="font-display font-bold text-sm tracking-tight">Talos.design</span>
                        <span className="hidden sm:inline text-[10px] font-mono text-[var(--text-muted)] px-2 py-0.5 rounded border border-[var(--border-color)] ml-1">
                            Client Portal
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-[var(--text-muted)] hidden md:block truncate max-w-[160px]">{clientEmail}</span>
                        <Link
                            to="/portal/profile"
                            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <UserIcon size={14} /> Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors"
                        >
                            <LogOut size={14} /> Sign out
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 flex flex-col min-h-0">

                {/* ── WELCOME STRIP ──────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-display font-bold mb-1">
                        Welcome back
                        {clientProjects[0]?.client ? `, ${clientProjects[0].client}` : ''}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                            <FolderKanban size={14} />
                            {clientProjects.length} {clientProjects.length === 1 ? 'project' : 'projects'}
                        </span>
                        <span className="flex items-center gap-1">
                            <FileText size={14} />
                            {clientInvoices.length} {clientInvoices.length === 1 ? 'invoice' : 'invoices'}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Portal active
                        </span>
                    </div>
                </motion.div>

                {/* ── TABS ────────────────────────────────────────── */}
                <div className="flex-none flex gap-0 border-b border-[var(--border-color)] mb-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${activeTab === tab.key
                                ? 'border-[var(--accent-orange)] text-[var(--text-primary)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-[rgba(210,193,182,0.15)] text-[var(--accent-orange)]' : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                    <AnimatePresence mode="wait">

                        {/* ── PROJECTS TAB ──────────────────────────────── */}
                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {clientProjects.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--border-color)] rounded-xl text-center">
                                        <Clock size={32} className="text-[var(--text-muted)] mb-3 opacity-40" />
                                        <h2 className="font-bold mb-1">No projects yet</h2>
                                        <p className="text-sm text-[var(--text-secondary)] max-w-sm">
                                            Your project will appear here once the Talos team assigns it to your account.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-5">
                                        {clientProjects.map(project => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                onMessageClick={() => setActiveTab('messages')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ── INVOICES TAB ──────────────────────────────── */}
                        {activeTab === 'invoices' && (
                            <motion.div
                                key="invoices"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {clientInvoices.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--border-color)] rounded-xl text-center">
                                        <FileText size={32} className="text-[var(--text-muted)] mb-3 opacity-40" />
                                        <p className="text-sm text-[var(--text-secondary)]">No invoices linked to your account yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {clientInvoices.map(inv => {
                                            const total = inv.items.reduce((s, item) => s + item.quantity * item.rate, 0);
                                            const style = INVOICE_STATUS_STYLE[inv.status] || INVOICE_STATUS_STYLE.draft;
                                            return (
                                                <motion.div
                                                    key={inv.id}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[rgba(210,193,182,0.25)] transition-all"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <div className="text-[10px] font-mono text-[var(--text-muted)] mb-1">#{inv.invoiceNumber}</div>
                                                            <div className="text-2xl font-display font-bold font-mono">${total.toFixed(2)}</div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    const statusColor = INVOICE_STATUS_STYLE[inv.status]?.color || '#fff';
                                                                    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice #${inv.invoiceNumber}</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;color:#1a1a1a;padding:48px;max-width:800px;margin:0 auto}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;padding-bottom:32px;border-bottom:2px solid #e5e5e5}.brand h1{font-size:28px;font-weight:700;letter-spacing:-0.5px}.brand p{color:#888;font-size:12px;margin-top:4px}.invoice-meta{text-align:right}.invoice-meta h2{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:700}.invoice-meta .status{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 12px;border-radius:20px;margin-top:8px;color:${statusColor};background:${statusColor}15;border:1px solid ${statusColor}40}.details{display:flex;justify-content:space-between;margin-bottom:40px}.details-block h3{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;margin-bottom:8px}.details-block p{font-size:14px;line-height:1.6}.details-block .mono{font-family:'JetBrains Mono',monospace;font-size:13px}table{width:100%;border-collapse:collapse;margin-bottom:24px}thead th{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;padding:12px 16px;border-bottom:2px solid #e5e5e5;text-align:left}thead th:nth-child(2),thead th:nth-child(3),thead th:nth-child(4){text-align:right}tbody td{padding:14px 16px;border-bottom:1px solid #f0f0f0;font-size:14px}tbody td:nth-child(2),tbody td:nth-child(3),tbody td:nth-child(4){text-align:right;font-family:'JetBrains Mono',monospace;font-size:13px}.total-row{display:flex;justify-content:flex-end;padding:20px 0;border-top:2px solid #1a1a1a;margin-top:-1px}.total-row .label{font-size:14px;font-weight:600;color:#666;margin-right:32px;padding-top:4px}.total-row .amount{font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:700}.footer{margin-top:48px;padding-top:24px;border-top:1px solid #e5e5e5;text-align:center;color:#bbb;font-size:11px}@media print{body{padding:24px}@page{margin:0.5in}}</style></head><body><div class="header"><div class="brand"><h1>TALOS.DESIGN</h1><p>Design & Development Studio</p></div><div class="invoice-meta"><h2>#${inv.invoiceNumber}</h2><div class="status">${inv.status}</div></div></div><div class="details"><div class="details-block"><h3>Bill To</h3><p><strong>${inv.clientName}</strong></p>${inv.clientEmail ? `<p>${inv.clientEmail}</p>` : ''}</div><div class="details-block" style="text-align:right"><h3>Invoice Details</h3><p>Issue Date: <span class="mono">${inv.issueDate}</span></p><p>Due Date: <span class="mono">${inv.dueDate}</span></p></div></div><table><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${inv.items.map(item => `<tr><td>${item.description}</td><td>${item.quantity}</td><td>$${item.rate.toFixed(2)}</td><td>$${(item.quantity * item.rate).toFixed(2)}</td></tr>`).join('')}</tbody></table><div class="total-row"><span class="label">Total Due</span><span class="amount">$${total.toFixed(2)}</span></div>${inv.notes ? `<div style="margin-top:40px;padding:20px;background:#fafafa;border-radius:8px;border:1px solid #f0f0f0"><h3 style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#999;font-weight:600;margin-bottom:8px">Notes & Terms</h3><p style="font-size:13px;line-height:1.6;color:#666">${inv.notes}</p></div>` : ''}<div class="footer"><p>Thank you for your business — TALOS.DESIGN</p></div></body></html>`;
                                                                    const w = window.open('', '_blank');
                                                                    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400); }
                                                                }}
                                                                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors rounded"
                                                                title="Download PDF"
                                                            >
                                                                <Download size={14} />
                                                            </button>
                                                            <span
                                                                className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full border"
                                                                style={{ color: style.color, background: style.bg, borderColor: style.border }}
                                                            >
                                                                {inv.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-[var(--border-color)] pt-3 flex justify-between text-xs text-[var(--text-muted)]">
                                                        <span>Issued: <span className="text-[var(--text-secondary)]">{inv.issueDate}</span></span>
                                                        <span>Due: <span className={inv.status === 'overdue' ? 'text-red-400' : 'text-[var(--text-secondary)]'}>{inv.dueDate}</span></span>
                                                    </div>
                                                    {inv.items.length > 0 && (
                                                        <div className="mt-3 space-y-1">
                                                            {inv.items.map((item, i) => (
                                                                <div key={i} className="flex justify-between text-xs text-[var(--text-muted)]">
                                                                    <span className="truncate max-w-[70%]">{item.description}</span>
                                                                    <span className="font-mono">${(item.quantity * item.rate).toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ── MESSAGES TAB ──────────────────────────────── */}
                        {activeTab === 'messages' && (
                            <motion.div
                                key="messages"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col min-h-0 h-full"
                            >
                                <ChatPanel projects={clientProjects} />
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

            </main>
        </div>
    );
}
