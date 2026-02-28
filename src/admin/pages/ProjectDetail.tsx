import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useTickets, deleteProject, updateProject, useMessages, sendMessage } from '../store/adminStore';
import type { Project } from '../store/adminStore';
import TicketList from '../components/TicketList';
import ProjectModal from '../components/ProjectModal';
import {
    ArrowLeft, Edit2, Trash2, ExternalLink, Calendar, DollarSign, Tag, Users, CheckSquare, List, Clock, Send, MessageSquare
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
    const [newMessage, setNewMessage] = useState('');
    const [sendingMsg, setSendingMsg] = useState(false);

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
        const name = prompt('Enter team member name:');
        if (name && project) {
            const current = project.teamAllotment || [];
            handleUpdateArray('teamAllotment', [...current, name]);
        }
    };

    const removeTeamMember = (index: number) => {
        if (!project || !project.teamAllotment) return;
        const current = [...project.teamAllotment];
        current.splice(index, 1);
        handleUpdateArray('teamAllotment', current);
    };

    const addFeature = () => {
        const feature = prompt('Enter feature name:');
        if (feature && project) {
            const current = project.selectedFeatures || [];
            handleUpdateArray('selectedFeatures', [...current, feature]);
        }
    };

    const removeFeature = (index: number) => {
        if (!project || !project.selectedFeatures) return;
        const current = [...project.selectedFeatures];
        current.splice(index, 1);
        handleUpdateArray('selectedFeatures', current);
    };

    const addCostRevision = () => {
        const reason = prompt('Enter reason for cost change (e.g., "Added E-commerce module"):');
        if (!reason) return;
        const amountStr = prompt('Enter amount (e.g., 500 or -200):');
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount)) return alert('Invalid amount');

        if (project) {
            const current = project.costRevisions || [];
            handleUpdateArray('costRevisions', [...current, { id: Date.now().toString(), reason, amount, date: new Date().toISOString() }]);
        }
    };

    const removeCostRevision = (id: string) => {
        if (!project || !project.costRevisions) return;
        handleUpdateArray('costRevisions', project.costRevisions.filter(r => r.id !== id));
    };

    const addRequirement = () => {
        const task = prompt('Enter client requirement/document needed:');
        if (task && project) {
            const current = project.clientRequirements || [];
            handleUpdateArray('clientRequirements', [...current, { id: Date.now().toString(), task, completed: false }]);
        }
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
        const topic = prompt('Enter meeting topic:');
        if (!topic) return;
        const date = prompt('Enter meeting date/time (e.g., Oct 24, 2:00 PM):');
        if (date && project) {
            const current = project.meetings || [];
            handleUpdateArray('meetings', [...current, { id: Date.now().toString(), date, topic }]);
        }
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
            await sendMessage(project.id, newMessage, 'admin');
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSendingMsg(false);
        }
    };

    if (loading || ticketsLoading || mLoading) {
        return <div className="admin-loading"><div className="admin-spinner" /></div>;
    }

    if (!project) {
        return (
            <div className="admin-page">
                <p>Project not found.</p>
                <Link to="/admin/projects" className="admin-btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                    <ArrowLeft size={16} /> Back to Projects
                </Link>
            </div>
        );
    }

    const sc = STATUS_COLORS[project.status];

    return (
        <div className="admin-page">
            {/* Back + Actions */}
            <div className="admin-detail-top">
                <Link to="/admin/projects" className="admin-detail-back">
                    <ArrowLeft size={16} /> Back to Projects
                </Link>
                <div className="admin-detail-top-actions">
                    <button className="admin-btn-secondary" onClick={() => setModalOpen(true)}>
                        <Edit2 size={14} /> Edit
                    </button>
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="admin-btn-secondary">
                            <ExternalLink size={14} /> View Live
                        </a>
                    )}
                    <button className="admin-btn-danger" onClick={handleDelete}>
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="admin-detail-header">
                <div>
                    <div className="admin-detail-meta-row">
                        <span className="admin-badge" style={{ background: sc?.bg, color: sc?.text }}>
                            {project.status}
                        </span>
                        <span className="admin-detail-type">{TYPE_LABELS[project.type] || project.type}</span>
                    </div>
                    <h1 className="admin-detail-title">{project.title || (project as any).name}</h1>
                    {project.client && (
                        <p className="admin-detail-client">Client: {project.client}</p>
                    )}
                </div>
            </div>

            {/* Info Cards */}
            <div className="admin-detail-info-grid">
                {project.startDate && (
                    <div className="admin-detail-info-card">
                        <Calendar size={14} className="admin-detail-info-icon" />
                        <div>
                            <div className="admin-detail-info-label">Timeline</div>
                            <div className="admin-detail-info-value">
                                {project.startDate}{project.endDate ? ` → ${project.endDate}` : ''}
                            </div>
                        </div>
                    </div>
                )}
                {project.budget && (
                    <div className="admin-detail-info-card">
                        <DollarSign size={14} className="admin-detail-info-icon" />
                        <div>
                            <div className="admin-detail-info-label">Budget</div>
                            <div className="admin-detail-info-value">{project.budget}</div>
                        </div>
                    </div>
                )}
                {project.tags?.length > 0 && (
                    <div className="admin-detail-info-card">
                        <Tag size={14} className="admin-detail-info-icon" />
                        <div>
                            <div className="admin-detail-info-label">Tags</div>
                            <div className="admin-detail-tags">
                                {project.tags.map(t => <span key={t} className="admin-tag">{t}</span>)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Description & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {project.description && (
                        <div className="admin-detail-section mb-8">
                            <h3 className="admin-detail-section-title">Description</h3>
                            <p className="admin-detail-section-text">{project.description}</p>
                        </div>
                    )}
                    {project.notes && (
                        <div className="admin-detail-section">
                            <h3 className="admin-detail-section-title">Notes</h3>
                            <p className="admin-detail-section-text">{project.notes}</p>
                        </div>
                    )}
                </div>

                {/* Secure Client Chat */}
                <div className="admin-detail-section mb-0 flex flex-col h-[400px]">
                    <h3 className="admin-detail-section-title flex items-center gap-2">
                        <MessageSquare size={16} className="text-[#a855f7]" /> Client Comms
                    </h3>
                    <div className="bg-[#1e1e1e] border border-[var(--border-color)] rounded-t-lg p-4 flex-1 overflow-y-auto space-y-4 flex flex-col">
                        {messages.length === 0 ? (
                            <div className="text-center text-[var(--text-muted)] text-sm my-auto">No messages with the client yet.</div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.sender === 'admin'
                                        ? 'bg-[var(--accent-orange)] text-black rounded-br-none'
                                        : 'bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] text-white rounded-bl-none'
                                        }`}>
                                        <div className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-70">
                                            {msg.sender === 'admin' ? 'You (Admin)' : project.client || 'Client'}
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
                    <div className="bg-[#1e1e1e] border border-[var(--border-color)] border-t-0 p-3 rounded-b-lg">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Message client..."
                                className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors text-white"
                            />
                            <button
                                type="submit"
                                disabled={sendingMsg || !newMessage.trim()}
                                className="bg-[var(--accent-orange)] text-black p-2 rounded hover:brightness-110 disabled:opacity-50 transition-colors flex items-center justify-center"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Advanced CRM Tracking */}
            <div className="admin-dashboard-grid mt-8 mb-8">

                {/* Team Allotment */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <Users size={16} className="text-[var(--accent-orange)]" />
                            <h3>Team Allotment</h3>
                        </div>
                        <button onClick={addTeamMember} className="admin-btn-secondary py-1 px-2 text-xs">Add</button>
                    </div>
                    <div className="admin-card-body">
                        {(!project.teamAllotment || project.teamAllotment.length === 0) ? (
                            <p className="text-sm text-[var(--text-muted)] italic">No team members assigned.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {project.teamAllotment.map((member, idx) => (
                                    <span key={idx} className="admin-tag flex items-center gap-1 bg-[rgba(245,158,11,0.1)] text-[var(--accent-orange)] border border-[rgba(245,158,11,0.2)]">
                                        {member} <button onClick={() => removeTeamMember(idx)} className="hover:text-white ml-1">&times;</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Features */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <List size={16} className="text-[var(--accent-cyan)]" />
                            <h3>Selected Features</h3>
                        </div>
                        <button onClick={addFeature} className="admin-btn-secondary py-1 px-2 text-xs">Add</button>
                    </div>
                    <div className="admin-card-body">
                        {(!project.selectedFeatures || project.selectedFeatures.length === 0) ? (
                            <p className="text-sm text-[var(--text-muted)] italic">No specific features tracked.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {project.selectedFeatures.map((feature, idx) => (
                                    <li key={idx} className="text-sm flex justify-between items-center bg-[rgba(0,0,0,0.2)] px-3 py-2 rounded border border-[var(--border-color)]">
                                        <span>• {feature}</span>
                                        <button onClick={() => removeFeature(idx)} className="text-[var(--text-muted)] hover:text-[#ef4444] transition-colors">&times;</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Cost Tracker */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <DollarSign size={16} className="text-[#22c55e]" />
                            <h3>Cost Revisions</h3>
                        </div>
                        <button onClick={addCostRevision} className="admin-btn-secondary py-1 px-2 text-xs">Revise</button>
                    </div>
                    <div className="admin-card-body">
                        <div className="text-sm font-bold mb-4 pb-2 border-b border-[var(--border-color)]">
                            Base Budget: {project.budget || '$0'}
                        </div>
                        {(!project.costRevisions || project.costRevisions.length === 0) ? (
                            <p className="text-sm text-[var(--text-muted)] italic">No cost revisions tracked.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {project.costRevisions.map((rev) => (
                                    <li key={rev.id} className="text-sm flex justify-between items-center bg-[rgba(34,197,94,0.05)] px-3 py-2 rounded border border-[rgba(34,197,94,0.2)]">
                                        <div>
                                            <div className="font-bold text-[#22c55e]">{rev.amount >= 0 ? '+' : ''}{rev.amount}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{rev.reason}</div>
                                        </div>
                                        <button onClick={() => removeCostRevision(rev.id)} className="text-[var(--text-muted)] hover:text-[#ef4444] transition-colors">&times;</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Client Requirements */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <CheckSquare size={16} className="text-[#c084fc]" />
                            <h3>Client Requirements</h3>
                        </div>
                        <button onClick={addRequirement} className="admin-btn-secondary py-1 px-2 text-xs">Add</button>
                    </div>
                    <div className="admin-card-body">
                        {(!project.clientRequirements || project.clientRequirements.length === 0) ? (
                            <p className="text-sm text-[var(--text-muted)] italic">No pending requirements from client.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {project.clientRequirements.map((req) => (
                                    <li key={req.id} className="text-sm flex justify-between items-center bg-[rgba(0,0,0,0.2)] px-3 py-2 rounded border border-[var(--border-color)]">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={req.completed}
                                                onChange={() => toggleRequirement(req.id)}
                                                className="accent-[#c084fc] w-4 h-4 cursor-pointer"
                                            />
                                            <span style={{ textDecoration: req.completed ? 'line-through' : 'none', opacity: req.completed ? 0.5 : 1 }}>{req.task}</span>
                                        </div>
                                        <button onClick={() => removeRequirement(req.id)} className="text-[var(--text-muted)] hover:text-[#ef4444] transition-colors">&times;</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Meetings */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <Clock size={16} className="text-[#3b82f6]" />
                            <h3>Scheduled Meetings</h3>
                        </div>
                        <button onClick={addMeeting} className="admin-btn-secondary py-1 px-2 text-xs">Schedule</button>
                    </div>
                    <div className="admin-card-body">
                        {(!project.meetings || project.meetings.length === 0) ? (
                            <p className="text-sm text-[var(--text-muted)] italic">No meetings scheduled.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {project.meetings.map((meeting) => (
                                    <li key={meeting.id} className="text-sm flex flex-col gap-1 bg-[rgba(59,130,246,0.05)] px-3 py-2 rounded border border-[rgba(59,130,246,0.2)] relative">
                                        <div className="font-bold text-[#3b82f6] text-xs">{meeting.date}</div>
                                        <div>{meeting.topic}</div>
                                        <button onClick={() => removeMeeting(meeting.id)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-[#ef4444] transition-colors">&times;</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>

            {/* Tickets */}
            <TicketList tickets={tickets} parentCollection="projects" parentId={project.id} />

            <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} project={project} />
        </div>
    );
}
