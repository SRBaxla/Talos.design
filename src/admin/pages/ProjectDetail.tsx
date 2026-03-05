import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { useTickets, deleteProject, updateProject, useMessages, sendMessage, useWorkers, addActivityLog } from '../store/adminStore';
import type { Project } from '../store/adminStore';
import TicketList from '../components/TicketList';
import ProjectModal from '../components/ProjectModal';
import {
    ArrowLeft, Edit2, Trash2, ExternalLink, Calendar, DollarSign, Tag, Users, CheckSquare, List, Clock, Send, MessageSquare, KeyRound, Copy, RefreshCw, X
} from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    'lead': { bg: 'rgba(113,113,122,0.15)', text: '#a1a1aa' },
    'in-progress': { bg: 'rgba(0,229,255,0.12)', text: '#00e5ff' },
    'review': { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    'completed': { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
    'published': { bg: 'rgba(192,132,252,0.12)', text: '#c084fc' },
};

const TYPE_LABELS: Record<string, string> = {
    'web-design': 'Web Design',
    'ai-chatbot': 'AI Chatbot',
    'automation': 'Automation',
    'custom': 'Custom Build',
};

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const { tickets, loading: ticketsLoading } = useTickets('projects', id || '');
    const { messages, loading: mLoading } = useMessages(id || '');
    const { workers } = useWorkers(); // Get workers for assigning
    const [newMessage, setNewMessage] = useState('');
    const [sendingMsg, setSendingMsg] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'tickets'>('overview');

    useEffect(() => {
        if (!id) return;
        const unsub = onSnapshot(doc(db, 'projects', id), (snap) => {
            if (snap.exists()) {
                setProject({ id: snap.id, ...snap.data() } as Project);
            }
            setLoading(false);
        });
        return unsub;
    }, [id]);

    const [promptModal, setPromptModal] = useState<{
        isOpen: boolean;
        title: string;
        fields: { name: string; label: string; type?: string; placeholder?: string; options?: { value: string; label: string }[] }[];
        onConfirm: (values: Record<string, string>) => void;
    }>({ isOpen: false, title: '', fields: [], onConfirm: () => { } });

    const openPrompt = (
        title: string,
        fields: { name: string; label: string; type?: string; placeholder?: string; options?: { value: string; label: string }[] }[],
        onConfirm: (values: Record<string, string>) => void
    ) => {
        setPromptModal({ isOpen: true, title, fields, onConfirm });
    };

    const handleDelete = async () => {
        if (!project) return;
        if (window.confirm(`Delete "${project.title || (project as any).name}"? This will also delete all tickets.`)) {
            await deleteProject(project.id);
            navigate('/admin/projects');
        }
    };

    const handleUpdateArray = async (field: keyof Project, newArray: any[]) => {
        if (!project) return;
        try {
            await updateProject(project.id, { [field]: newArray });
        } catch (err) {
            console.error(`Failed to update ${field}:`, err);
            alert(`Failed to update ${field}`);
        }
    };

    const addTeamMember = () => {
        const availableOptions = workers.map(w => ({ value: w.uid, label: w.name }));
        if (availableOptions.length === 0) {
            alert("No workers available. Please add some in the Team section.");
            return;
        }

        openPrompt('Assign Team Member', [
            { name: 'uid', label: 'Select Worker', type: 'select', options: availableOptions }
        ], async (values) => {
            const uid = values.uid;
            if (uid && project) {
                // Prevent duplicate assignment
                const current = project.teamAllotment || [];
                if (!current.includes(uid)) {
                    await handleUpdateArray('teamAllotment', [...current, uid]);
                    await addActivityLog({
                        workerUid: uid,
                        action: 'assigned_project',
                        description: `Assigned to project: ${project.title}`,
                        referenceId: project.id,
                        referenceType: 'project'
                    });
                }
            }
        });
    };

    const removeTeamMember = async (index: number) => {
        if (!project || !project.teamAllotment) return;
        const current = [...project.teamAllotment];
        const removedUid = current[index];
        current.splice(index, 1);
        await handleUpdateArray('teamAllotment', current);

        if (removedUid) {
            await addActivityLog({
                workerUid: removedUid,
                action: 'removed_from_project',
                description: `Removed from project: ${project.title}`,
                referenceId: project.id,
                referenceType: 'project'
            });
        }
    };

    const addFeature = () => {
        openPrompt('Append Feature', [{ name: 'feature', label: 'Feature Name', placeholder: 'Enter feature name' }], (values) => {
            const feature = values.feature;
            if (feature && project) {
                const current = project.selectedFeatures || [];
                handleUpdateArray('selectedFeatures', [...current, feature]);
            }
        });
    };

    const removeFeature = (index: number) => {
        if (!project || !project.selectedFeatures) return;
        const current = [...project.selectedFeatures];
        current.splice(index, 1);
        handleUpdateArray('selectedFeatures', current);
    };

    const addCostRevision = () => {
        openPrompt('Log Cost Revision', [
            { name: 'reason', label: 'Reason', placeholder: 'e.g., Added E-commerce module' },
            { name: 'amount', label: 'Amount', type: 'number', placeholder: 'e.g., 500 or -200' }
        ], (values) => {
            const reason = values.reason;
            const amountStr = values.amount;
            if (!reason || !amountStr) return;
            const amount = parseFloat(amountStr);
            if (isNaN(amount)) return alert('Invalid amount');

            if (project) {
                const current = project.costRevisions || [];
                handleUpdateArray('costRevisions', [...current, { id: Date.now().toString(), reason, amount, date: new Date().toISOString() }]);
            }
        });
    };

    const removeCostRevision = (id: string) => {
        if (!project || !project.costRevisions) return;
        handleUpdateArray('costRevisions', project.costRevisions.filter(r => r.id !== id));
    };

    const addRequirement = () => {
        openPrompt('Request Client Pre-Req', [{ name: 'task', label: 'Requirement / Document Needed', placeholder: 'Enter client requirement' }], (values) => {
            const task = values.task;
            if (task && project) {
                const current = project.clientRequirements || [];
                handleUpdateArray('clientRequirements', [...current, { id: Date.now().toString(), task, completed: false }]);
            }
        });
    };

    const toggleRequirement = (id: string) => {
        if (!project || !project.clientRequirements) return;
        const current = project.clientRequirements.map(r =>
            r.id === id ? { ...r, completed: !r.completed } : r
        );
        handleUpdateArray('clientRequirements', current);
    };

    const removeRequirement = (id: string) => {
        if (!project || !project.clientRequirements) return;
        handleUpdateArray('clientRequirements', project.clientRequirements.filter(r => r.id !== id));
    };

    const addMeeting = () => {
        openPrompt('Create Schedule Meeting', [
            { name: 'topic', label: 'Meeting Topic', placeholder: 'Enter meeting topic' },
            { name: 'date', label: 'Date / Time', placeholder: 'e.g., Oct 24, 2:00 PM' }
        ], (values) => {
            const topic = values.topic;
            const date = values.date;
            if (topic && date && project) {
                const current = project.meetings || [];
                handleUpdateArray('meetings', [...current, { id: Date.now().toString(), date, topic }]);
            }
        });
    };

    const removeMeeting = (id: string) => {
        if (!project || !project.meetings) return;
        handleUpdateArray('meetings', project.meetings.filter(m => m.id !== id));
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !project) return;
        setSendingMsg(true);
        try {
            const auth = getAuth();
            const currentUid = auth.currentUser?.uid;
            await sendMessage(project.id, newMessage, 'admin', currentUid);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSendingMsg(false);
        }
    };

    if (loading || ticketsLoading || mLoading) {
        return <div className="flex items-center justify-center min-h-[calc(100vh-64px)]"><div className="w-8 h-8 border-2 border-[var(--accent-orange)] border-t-transparent rounded-full animate-spin" /></div>;
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8">
                <p className="text-xl font-bold font-display mb-6">Project not found.</p>
                <Link to="/admin/projects" className="flex items-center gap-2 px-6 py-3 bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <ArrowLeft size={16} /> Back to Projects
                </Link>
            </div>
        );
    }

    const sc = STATUS_COLORS[project.status] || { bg: 'rgba(255,255,255,0.1)', text: '#fff' };

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col font-sans w-full">
            {/* Header Area */}
            <div className="flex-none bg-[var(--bg-surface-elevated)] border-b border-[var(--border-color)] pb-0 relative z-10 w-full">
                <div className="px-6 md:px-10 py-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full max-w-none">
                    <div className="flex flex-col gap-5 w-full">
                        <Link to="/admin/projects" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-white transition-colors w-fit bg-[rgba(255,255,255,0.02)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">
                            <ArrowLeft size={14} /> Back to Projects
                        </Link>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border" style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.bg }}>
                                    {project.status.replace('-', ' ')}
                                </span>
                                <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] rounded text-[var(--text-secondary)]">
                                    {TYPE_LABELS[project.type] || project.type}
                                </span>
                            </div>
                            <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight">{project.title || (project as any).name}</h1>
                            {project.client && (
                                <p className="text-[var(--text-secondary)] text-sm flex items-center gap-2 font-medium">
                                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--accent-cyan)] to-[#3b82f6] text-black flex items-center justify-center text-[10px] font-bold shadow-lg">{project.client.charAt(0).toUpperCase()}</span>
                                    {project.client}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 border-[var(--border-color)] pt-6 lg:pt-0">
                        <button className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-[#1e1e1e] border border-[var(--border-color)] rounded-lg text-sm hover:bg-[rgba(255,255,255,0.05)] transition-all font-medium" onClick={() => setModalOpen(true)}>
                            <Edit2 size={16} /> Edit Info
                        </button>
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[var(--accent-cyan)] rounded-lg text-sm hover:bg-[rgba(0,229,255,0.1)] transition-all font-mono">
                                <ExternalLink size={16} /> Live URL
                            </a>
                        )}
                        <button className="flex-none justify-center flex items-center px-4 py-2.5 bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)] text-[#ef4444] rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-all" onClick={handleDelete} title="Delete Project">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs Layer */}
                <div className="px-6 md:px-10 flex gap-8 overflow-x-auto custom-scrollbar pt-2 w-full max-w-none">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 text-xs font-bold font-mono uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'border-[var(--accent-orange)] text-[var(--accent-orange)]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
                    >
                        <List size={14} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('crm')}
                        className={`pb-4 text-xs font-bold font-mono uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'crm' ? 'border-[var(--accent-cyan)] text-[var(--accent-cyan)]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
                    >
                        <Users size={14} /> CRM & Planning
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`pb-4 text-xs font-bold font-mono uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'tickets' ? 'border-[#a855f7] text-[#a855f7]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
                    >
                        <MessageSquare size={14} /> Tickets
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${activeTab === 'tickets' ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]'}`}>{tickets.length}</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 relative z-0 w-full max-w-none">

                {/* ---------- OVERVIEW TAB ---------- */}
                {activeTab === 'overview' && (
                    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-none">
                        <div className="flex-1 flex flex-col gap-6">

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {project.startDate && (
                                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
                                        <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest">
                                            <Calendar size={14} className="text-[#3b82f6]" /> Timeline
                                        </div>
                                        <div className="text-sm font-bold text-white flex items-center gap-3">
                                            <span>{project.startDate}</span>
                                            {project.endDate && <span className="text-[var(--text-muted)] font-normal">→</span>}
                                            {project.endDate && <span>{project.endDate}</span>}
                                        </div>
                                    </div>
                                )}
                                {project.budget && (
                                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
                                        <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest">
                                            <DollarSign size={14} className="text-[#22c55e]" /> Allocated Budget
                                        </div>
                                        <div className="text-xl font-bold font-mono text-white">
                                            {project.budget}
                                        </div>
                                    </div>
                                )}
                                {project.tags && project.tags.length > 0 && (
                                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col gap-3 sm:col-span-2 xl:col-span-1 shadow-sm">
                                        <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest">
                                            <Tag size={14} className="text-[#c084fc]" /> Identifiers
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map(t => (
                                                <span key={t} className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-[#c084fc]/10 text-[#c084fc] border border-[#c084fc]/20 rounded whitespace-nowrap">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-orange)] opacity-[0.02] rounded-bl-full group-hover:opacity-[0.05] transition-opacity pointer-events-none"></div>
                                <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
                                    <List size={14} className="text-[var(--accent-orange)]" /> Project Scope
                                </h3>
                                {project.description ? (
                                    <p className="text-[var(--text-primary)] leading-relaxed text-sm lg:text-base font-light">{project.description}</p>
                                ) : (
                                    <p className="text-[var(--text-muted)] text-sm italic font-mono">No description provided.</p>
                                )}
                            </div>

                            <div className="bg-[#1a1a1a] border border-[var(--border-color)] rounded-2xl p-8 shadow-inner">
                                <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
                                    <Edit2 size={14} /> Admin Notes
                                </h3>
                                {project.notes ? (
                                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm whitespace-pre-wrap font-mono relative pl-4 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[var(--border-color)] before:rounded-full">{project.notes}</p>
                                ) : (
                                    <p className="text-[var(--text-muted)] text-sm italic font-mono">No internal notes.</p>
                                )}
                            </div>
                        </div>

                        {/* Secure Client Chat via Desktop UI rules */}
                        <div className="w-full lg:w-[450px] xl:w-[500px] flex-shrink-0 flex flex-col h-[700px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl relative">
                            {/* Glass overlay effect on top edge */}
                            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--bg-surface-elevated)] to-transparent z-10 pointer-events-none"></div>

                            <div className="flex-none p-5 pb-0 z-20 border-b border-[rgba(255,255,255,0.05)] mb-2">
                                <h3 className="font-display font-bold text-lg flex items-center justify-between text-white tracking-wide">
                                    <span className="flex items-center gap-2"><MessageSquare size={18} className="text-[#a855f7]" /> Comm Channel</span>
                                    <span className="flex h-2 w-2 rounded-full bg-[#22c55e] relative shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                                    </span>
                                </h3>
                                <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono uppercase tracking-widest mb-4">Secure End-to-End</p>
                            </div>

                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 z-0 custom-scrollbar flex flex-col">
                                {messages.length === 0 ? (
                                    <div className="text-center text-[var(--text-muted)] text-sm my-auto font-mono bg-[rgba(255,255,255,0.02)] p-4 rounded-xl border border-dashed border-[var(--border-color)]">No messages yet. Open the channel.</div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className={`flex flex-col relative w-full ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                                            <span className={`text-[9px] font-mono text-[var(--text-muted)] mb-1.5 uppercase tracking-widest font-bold ${msg.sender === 'admin' ? 'mr-1 text-[var(--accent-orange)]' : 'ml-1'}`}>
                                                {msg.sender === 'admin' ? 'Admin' : project.client || 'Client'}
                                            </span>
                                            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-lg relative ${msg.sender === 'admin'
                                                ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border border-[rgba(255,255,255,0.1)] text-white rounded-tr-sm'
                                                : 'bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-tl-sm'
                                                }`}>
                                                <div className="whitespace-pre-wrap leading-relaxed relative z-10 font-medium">{msg.text}</div>
                                                <div className={`flex items-center gap-1 text-[9px] mt-3 font-mono opacity-60 ${msg.sender === 'admin' ? 'justify-end text-[var(--accent-orange)]' : 'justify-start'}`}>
                                                    <Clock size={10} /> {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex-none p-5 bg-[rgba(0,0,0,0.3)] backdrop-blur-md border-t border-[rgba(255,255,255,0.05)] relative z-20">
                                <form onSubmit={handleSendMessage} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type transmission..."
                                        className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#a855f7] focus:bg-[rgba(255,255,255,0.08)] transition-all text-white shadow-inner placeholder:text-[var(--text-muted)] font-mono"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sendingMsg || !newMessage.trim()}
                                        className="bg-[#a855f7] text-white p-3.5 rounded-xl hover:bg-[#9333ea] disabled:opacity-50 disabled:bg-[#1e1e1e] disabled:text-[var(--text-muted)] transition-colors flex items-center justify-center shadow-lg"
                                    >
                                        <Send size={18} className={sendingMsg ? 'opacity-50' : 'ml-0.5'} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* ---------- CRM TAB ---------- */}
                {activeTab === 'crm' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-none">

                        {/* Team Allotment */}
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden max-h-[500px] shadow-sm">
                            <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="font-display font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Users size={16} className="text-[var(--accent-orange)]" /> Allocation
                                </h3>
                                <button onClick={addTeamMember} className="text-[10px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded transition-colors text-[var(--text-secondary)]">Assign</button>
                            </div>
                            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                                {(!project.teamAllotment || project.teamAllotment.length === 0) ? (
                                    <div className="h-full flex items-center justify-center text-sm text-[var(--text-muted)] font-mono bg-[rgba(255,255,255,0.01)] rounded-xl border border-dashed border-[var(--border-color)] min-h-[100px]">No members.</div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {project.teamAllotment.map((memberUid, idx) => {
                                            const worker = workers.find(w => w.uid === memberUid);
                                            const dispName = worker ? worker.name : 'Unknown Worker';
                                            return (
                                                <div key={idx} className="flex items-center gap-3 bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)] pl-4 pr-2 py-3 rounded-xl w-full justify-between group transition-colors hover:border-[rgba(245,158,11,0.4)]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-[rgba(245,158,11,0.2)] text-[var(--accent-orange)] flex items-center justify-center text-[10px] font-bold uppercase">{dispName.charAt(0)}</div>
                                                        <span className="text-sm text-white font-medium tracking-wide">{dispName}</span>
                                                    </div>
                                                    <button onClick={() => removeTeamMember(idx)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[rgba(245,158,11,0.2)] text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected Features */}
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden max-h-[500px] shadow-sm">
                            <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="font-display font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <List size={16} className="text-[var(--accent-cyan)]" /> Features
                                </h3>
                                <button onClick={addFeature} className="text-[10px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded transition-colors text-[var(--text-secondary)]">Append</button>
                            </div>
                            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                                {(!project.selectedFeatures || project.selectedFeatures.length === 0) ? (
                                    <div className="h-full flex items-center justify-center text-sm text-[var(--text-muted)] font-mono bg-[rgba(255,255,255,0.01)] rounded-xl border border-dashed border-[var(--border-color)] min-h-[100px]">No features tracked.</div>
                                ) : (
                                    <div className="flex flex-col gap-2 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-gradient-to-b before:from-[var(--accent-cyan)] before:to-transparent">
                                        {project.selectedFeatures.map((feature, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-[var(--bg-base)] p-3 pr-2 rounded-xl group transition-all border border-[var(--border-color)] hover:border-[rgba(0,229,255,0.3)] ml-6 relative">
                                                <div className="absolute -left-[27px] w-3 h-3 rounded-full bg-[var(--bg-base)] border-2 border-[var(--accent-cyan)] shadow-[0_0_10px_rgba(0,229,255,0.5)]"></div>
                                                <span className="text-sm text-[var(--text-primary)] font-medium">{feature}</span>
                                                <button onClick={() => removeFeature(idx)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-all shrink-0">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Client Requirements  */}
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden max-h-[500px] shadow-sm">
                            <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="font-display font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <CheckSquare size={16} className="text-[#c084fc]" /> Pre-Reqs
                                </h3>
                                <button onClick={addRequirement} className="text-[10px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded transition-colors text-[var(--text-secondary)]">Request</button>
                            </div>
                            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                                {(!project.clientRequirements || project.clientRequirements.length === 0) ? (
                                    <div className="h-full flex items-center justify-center text-sm text-[var(--text-muted)] font-mono bg-[rgba(255,255,255,0.01)] rounded-xl border border-dashed border-[var(--border-color)] min-h-[100px]">No pending items.</div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {project.clientRequirements.map((req) => (
                                            <div key={req.id} className="flex items-center justify-between bg-transparent hover:bg-[rgba(255,255,255,0.03)] p-3 pr-2 rounded-xl group transition-all border border-[var(--border-color)]">
                                                <label className="flex items-center gap-4 cursor-pointer w-full group/label">
                                                    <div className="relative flex items-center justify-center w-5 h-5 ml-1 shrink-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={req.completed}
                                                            onChange={() => toggleRequirement(req.id)}
                                                            className="peer appearance-none w-5 h-5 border-2 border-[var(--border-color)] rounded cursor-pointer checked:bg-[#c084fc] checked:border-[#c084fc] transition-all bg-[var(--bg-base)] group-hover/label:border-[#c084fc]"
                                                        />
                                                        <CheckSquare size={12} className="absolute text-black opacity-0 peer-checked:opacity-100 pointer-events-none stroke-[3]" />
                                                    </div>
                                                    <span className={`text-sm font-medium transition-all ${req.completed ? 'text-[var(--text-muted)] line-through' : 'text-white group-hover/label:text-[#c084fc]'} break-words`}>{req.task}</span>
                                                </label>
                                                <button onClick={() => removeRequirement(req.id)} className="p-1.5 ml-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-all shrink-0">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cost Tracker */}
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden max-h-[500px] shadow-sm">
                            <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="font-display font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <DollarSign size={16} className="text-[#22c55e]" /> Cost Ledger
                                </h3>
                                <button onClick={addCostRevision} className="text-[10px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded transition-colors text-[var(--text-secondary)]">Log</button>
                            </div>
                            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar flex flex-col pt-0 mt-5">
                                <div className="p-5 mb-5 rounded-xl bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.2)] flex justify-between items-center shrink-0">
                                    <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Initial Base</div>
                                    <div className="text-2xl font-bold font-mono text-white">{project.budget || '$0'}</div>
                                </div>

                                {(!project.costRevisions || project.costRevisions.length === 0) ? (
                                    <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)] font-mono py-4 min-h-[100px]">No ledgers.</div>
                                ) : (
                                    <div className="flex flex-col gap-4 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-gradient-to-b before:from-[#22c55e]/50 before:to-red-500/50 pb-4">
                                        {project.costRevisions.map((rev) => (
                                            <div key={rev.id} className="relative pl-12 group">
                                                <div className={`absolute left-[13px] top-3 w-3 h-3 rounded-full border-2 ${rev.amount >= 0 ? 'bg-[var(--bg-base)] border-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-[var(--bg-base)] border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'} transition-transform group-hover:scale-125`}></div>
                                                <div className="flex justify-between items-center bg-[var(--bg-base)] border border-[var(--border-color)] p-4 pr-3 rounded-xl group-hover:border-[var(--text-muted)] transition-colors shadow-sm">
                                                    <div>
                                                        <div className={`font-bold font-mono text-xl ${rev.amount >= 0 ? 'text-[#22c55e]' : 'text-red-400'}`}>
                                                            {rev.amount >= 0 ? '+' : ''}{rev.amount}
                                                        </div>
                                                        <div className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mt-1 font-bold">{rev.reason}</div>
                                                    </div>
                                                    <button onClick={() => removeCostRevision(rev.id)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-all shrink-0">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Meetings */}
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden max-h-[500px] shadow-sm lg:col-span-2">
                            <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="font-display font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Clock size={16} className="text-[#3b82f6]" /> Schedule
                                </h3>
                                <button onClick={addMeeting} className="text-[10px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded transition-colors text-[var(--text-secondary)]">Create</button>
                            </div>
                            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                                {(!project.meetings || project.meetings.length === 0) ? (
                                    <div className="h-full flex items-center justify-center text-sm text-[var(--text-muted)] font-mono bg-[rgba(255,255,255,0.01)] rounded-xl border border-dashed border-[var(--border-color)] min-h-[100px]">No meetings generated.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {project.meetings.map((m) => (
                                            <div key={m.id} className="flex flex-col gap-3 bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.2)] p-5 rounded-2xl group transition-all hover:border-[rgba(59,130,246,0.5)] hover:bg-[rgba(59,130,246,0.08)] relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#3b82f6] opacity-[0.05] rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                                                <div className="flex justify-between items-start w-full relative z-10">
                                                    <h4 className="font-bold text-white text-base leading-tight pr-4">{m.topic}</h4>
                                                    <button onClick={() => removeMeeting(m.id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-all shrink-0 -mt-1 -mr-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] mt-auto pt-2 border-t border-[rgba(59,130,246,0.1)] relative z-10">
                                                    <Calendar size={12} className="text-[#3b82f6]" /> {m.date}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Portal Access */}
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm lg:col-span-3">
                            <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="font-display font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <KeyRound size={16} className="text-[var(--accent-orange)]" /> Portal Access
                                </h3>
                                <button
                                    onClick={() => {
                                        const newCode = Math.random().toString(36).slice(-8).toUpperCase();
                                        handleUpdateArray('accessCode' as keyof Project, newCode as any);
                                    }}
                                    className="text-[10px] font-bold shadow-sm uppercase tracking-widest bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded transition-colors text-[var(--text-secondary)] flex items-center gap-1.5"
                                    title="Generate a new access code"
                                >
                                    <RefreshCw size={12} /> Regenerate
                                </button>
                            </div>
                            <div className="p-5 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 w-full">
                                    <div className="mb-3">
                                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-mono font-bold">Registration Code</span>
                                    </div>
                                    {project.accessCode ? (
                                        <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] px-5 py-4 rounded-xl w-full group hover:border-[rgba(255,255,255,0.1)] transition-colors">
                                            <span className="font-mono text-xl sm:text-2xl font-bold tracking-[0.2em] sm:tracking-[0.3em] text-[var(--accent-orange)] flex-1 select-all break-all">{project.accessCode}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(project.accessCode!);
                                                    alert('Access code copied to clipboard!');
                                                }}
                                                className="text-[var(--text-muted)] hover:text-white transition-colors p-3 bg-[rgba(255,255,255,0.05)] rounded-lg hover:bg-[rgba(255,255,255,0.1)] shrink-0"
                                                title="Copy to clipboard"
                                            >
                                                <Copy size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center p-6 border border-dashed border-[var(--border-color)] rounded-xl bg-[rgba(255,255,255,0.01)] min-h-[90px]">
                                            <p className="text-sm text-[var(--text-muted)] font-mono">No initial access code set.</p>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 text-xs text-[var(--text-muted)] leading-relaxed p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--border-color)] flex items-start gap-3">
                                    <div className="mt-0.5 text-[#a855f7] shrink-0"><List size={16} /></div>
                                    <p>This code is uniquely generated for the client's <strong>first secure login</strong> to establish their credential state. If they possess an active session token, this acts redundantly.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* ---------- TICKETS TAB ---------- */}
                {activeTab === 'tickets' && (
                    <div className="max-w-screen-xl mx-auto space-y-8 w-full">
                        <div className="bg-[rgba(168,85,247,0.05)] border border-[rgba(168,85,247,0.2)] rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-[#a855f7] opacity-10 rounded-bl-full pointer-events-none"></div>
                            <MessageSquare className="shrink-0 text-[#a855f7] mt-1" size={24} />
                            <div>
                                <h3 className="text-white font-bold font-display uppercase tracking-wider text-sm mb-2">Support Management</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    Monitor and resolve technical or support requests filed directly by the client payload. This isolates bug fixing and service requests from general strategic chat.
                                </p>
                            </div>
                        </div>
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm min-h-[500px]">
                            <TicketList tickets={tickets} parentCollection="projects" parentId={project.id} />
                        </div>
                    </div>
                )}

            </main>

            <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} project={project} />

            {/* Prompt Modal */}
            {promptModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-orange)] opacity-5 rounded-bl-full pointer-events-none"></div>
                        <div className="flex justify-between items-center relative z-10">
                            <h2 className="font-display font-bold text-xl text-white">{promptModal.title}</h2>
                            <button onClick={() => setPromptModal({ ...promptModal, isOpen: false })} className="text-[var(--text-muted)] hover:text-white transition-colors bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] p-1.5 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            className="flex flex-col gap-5 relative z-10"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const values: Record<string, string> = {};
                                promptModal.fields.forEach(f => {
                                    values[f.name] = formData.get(f.name) as string;
                                });
                                promptModal.onConfirm(values);
                                setPromptModal({ ...promptModal, isOpen: false });
                            }}
                        >
                            {promptModal.fields.map((field) => (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">{field.label}</label>
                                    {field.type === 'select' ? (
                                        <select
                                            name={field.name}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] focus:ring-opacity-30 transition-all font-medium shadow-sm appearance-none"
                                            required
                                        >
                                            <option value="" disabled selected>Select an option</option>
                                            {field.options?.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            name={field.name}
                                            type={field.type || "text"}
                                            placeholder={field.placeholder}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] focus:ring-opacity-30 transition-all font-medium shadow-sm"
                                            required
                                            autoFocus={field.name === promptModal.fields[0].name}
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[var(--border-color)]">
                                <button type="button" onClick={() => setPromptModal({ ...promptModal, isOpen: false })} className="px-5 py-2.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg text-sm font-bold transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-[var(--accent-orange)] text-black hover:bg-[rgba(245,158,11,0.9)] rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
