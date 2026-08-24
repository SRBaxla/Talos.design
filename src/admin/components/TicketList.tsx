import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Trash2, Edit2, RefreshCw } from 'lucide-react';
import type { Ticket, TicketStatus, TicketPriority } from '../store/adminStore';
import { addTicket, updateTicket, deleteTicket, useWorkers, addActivityLog } from '../store/adminStore';
import { Timestamp } from 'firebase/firestore';

interface TicketListProps {
    tickets: Ticket[];
    parentCollection: string;
    parentId: string;
    onRefresh?: () => void;
}

const STATUS_ICONS: Record<TicketStatus, typeof Circle> = {
    'todo': Circle,
    'in-progress': Clock,
    'done': CheckCircle2,
};

const STATUS_COLORS: Record<TicketStatus, string> = {
    'todo': '#71717a',
    'in-progress': '#00e5ff',
    'done': '#22c55e',
};

const PRIORITY_COLORS: Record<TicketPriority, string> = {
    'low': '#71717a',
    'medium': '#00e5ff',
    'high': '#f59e0b',
    'urgent': '#ef4444',
};

export default function TicketList({ tickets, parentCollection, parentId, onRefresh }: TicketListProps) {
    const [showForm, setShowForm] = useState(false);
    const [editTicket, setEditTicket] = useState<Ticket | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TicketStatus>('todo');
    const [priority, setPriority] = useState<TicketPriority>('medium');
    const [assignee, setAssignee] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [filter, setFilter] = useState<'all' | TicketStatus>('all');
    const [isSaving, setIsSaving] = useState(false);

    const { workers } = useWorkers();

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStatus('todo');
        setPriority('medium');
        setAssignee('');
        setDueDate('');
        setEditTicket(null);
        setShowForm(false);
    };

    const handleEdit = (t: Ticket) => {
        setTitle(t.title);
        setDescription(t.description);
        setStatus(t.status);
        setPriority(t.priority);
        setAssignee(t.assignee);
        setDueDate(t.dueDate);
        setEditTicket(t);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!title.trim()) return;
        setIsSaving(true);
        try {
            let createdTicketId = '';
            if (editTicket) {
                await updateTicket(parentCollection, parentId, editTicket.id, {
                    title, description, status, priority, assignee, dueDate,
                });
                createdTicketId = editTicket.id;
            } else {
                const newTicket = await addTicket(parentCollection, parentId, {
                    title, description, status, priority, assignee, dueDate,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                } as unknown as Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>);
                createdTicketId = newTicket.id;
            }

            // Log if assignee exists and was changed/set
            if (assignee && (!editTicket || editTicket.assignee !== assignee)) {
                await addActivityLog({
                    workerUid: assignee,
                    action: 'assigned_ticket',
                    description: `Assigned to ticket: ${title}`,
                    referenceId: createdTicketId,
                    referenceType: 'ticket'
                });
            }
            resetForm();
        } catch (err) {
            console.error('Failed to save ticket:', err);
            alert('Failed to save ticket. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (ticketId: string) => {
        if (window.confirm('Delete this ticket?')) {
            await deleteTicket(parentCollection, parentId, ticketId);
        }
    };

    const handleToggleStatus = async (t: Ticket) => {
        const next: Record<TicketStatus, TicketStatus> = {
            'todo': 'in-progress',
            'in-progress': 'done',
            'done': 'todo',
        };
        await updateTicket(parentCollection, parentId, t.id, { status: next[t.status] });
    };

    const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);
    const todoCount = tickets.filter(t => t.status === 'todo').length;
    const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
    const doneCount = tickets.filter(t => t.status === 'done').length;

    return (
        <div className="flex flex-col h-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-base)] gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-display font-bold text-[var(--text-primary)] text-base tracking-wide flex items-center gap-2">
                        Project Tickets
                        <span className="bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] text-[10px] px-2 py-0.5 rounded-full font-mono border border-[var(--border-color)]">{tickets.length}</span>
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="p-2 text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-all"
                            title="Refresh Tickets"
                        >
                            <RefreshCw size={14} className="hover:rotate-180 transition-transform duration-500" />
                        </button>
                    )}
                    <button
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent-orange)] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[var(--accent-orange-hover)] transition-all shadow-sm"
                        onClick={() => { resetForm(); setShowForm(true); }}
                    >
                        <Plus size={14} strokeWidth={2.5} /> Add Ticket
                    </button>
                </div>
            </div>

            {/* Filter pills */}
            <div className="px-5 py-4 flex flex-wrap gap-2 border-b border-[var(--border-color)]">
                <button className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${filter === 'all' ? 'bg-[var(--accent-cyan)] text-white' : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--accent-cyan)]'}`} onClick={() => setFilter('all')}>
                    All ({tickets.length})
                </button>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${filter === 'todo' ? 'bg-[#71717a] text-white' : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]'}`} onClick={() => setFilter('todo')}>
                    To Do ({todoCount})
                </button>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${filter === 'in-progress' ? 'bg-[var(--accent-cyan)] text-white' : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]'}`} onClick={() => setFilter('in-progress')}>
                    In Progress ({inProgressCount})
                </button>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${filter === 'done' ? 'bg-[#22c55e] text-white' : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]'}`} onClick={() => setFilter('done')}>
                    Done ({doneCount})
                </button>
            </div>

            {/* Inline add/edit form */}
            {showForm && (
                <div className="p-5 bg-[var(--bg-base)] border-b border-[var(--border-color)] flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                    <input
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] focus:ring-opacity-30 transition-all font-medium"
                        placeholder="Ticket title *"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-secondary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] focus:ring-opacity-30 transition-all min-h-[80px]"
                        rows={2}
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <select className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-orange)]" value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)}>
                            <option className="bg-[var(--bg-surface)]" value="todo">To Do</option>
                            <option className="bg-[var(--bg-surface)]" value="in-progress">In Progress</option>
                            <option className="bg-[var(--bg-surface)]" value="done">Done</option>
                        </select>
                        <select className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-orange)]" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
                            <option className="bg-[var(--bg-surface)]" value="low">Low Priority</option>
                            <option className="bg-[var(--bg-surface)]" value="medium">Medium Priority</option>
                            <option className="bg-[var(--bg-surface)]" value="high">High Priority</option>
                            <option className="bg-[var(--bg-surface)]" value="urgent">Urgent</option>
                        </select>
                        <select className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-orange)]" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                            <option className="bg-[var(--bg-surface)]" value="">Unassigned</option>
                            {workers.map(w => (
                                <option className="bg-[var(--bg-surface)]" key={w.uid} value={w.uid}>{w.name}</option>
                            ))}
                        </select>
                        <input type="date" className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-orange)]" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                        <button className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-lg text-sm font-bold transition-colors" onClick={resetForm}>Cancel</button>
                        <button 
                            className="px-5 py-2 bg-[var(--accent-cyan)] text-white hover:bg-[var(--accent-cyan-hover)] rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50" 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <><RefreshCw size={14} className="animate-spin" /> Saving...</>
                            ) : (
                                editTicket ? 'Update Ticket' : 'Create Ticket'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Ticket list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-3 h-[400px]">
                {filtered.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[var(--bg-base)] rounded-xl border border-dashed border-[var(--border-color)] min-h-[200px]">
                        <Clock className="text-[var(--text-muted)] mb-3" size={32} />
                        <p className="text-[var(--text-secondary)] font-medium text-sm">No tickets found.</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Add a ticket to start tracking work.</p>
                    </div>
                ) : (
                    filtered.map((t) => {
                        const StatusIcon = STATUS_ICONS[t.status];
                        return (
                            <div key={t.id} className="group flex items-start sm:items-center gap-4 p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--accent-orange)] hover:bg-[var(--bg-surface)] transition-all">
                                <button
                                    className="pt-0.5 sm:pt-0 shrink-0 hover:scale-110 transition-transform"
                                    onClick={() => handleToggleStatus(t)}
                                    style={{ color: STATUS_COLORS[t.status] }}
                                    title={`Status: ${t.status} — click to advance`}
                                >
                                    <StatusIcon size={20} strokeWidth={2.5} />
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                                            style={{ background: PRIORITY_COLORS[t.priority] }}
                                            title={`Priority: ${t.priority}`}
                                        />
                                        <h4 className={`text-sm font-bold truncate transition-colors ${t.status === 'done' ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)]'}`}>
                                            {t.title}
                                        </h4>
                                    </div>

                                    {t.description && (
                                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2 leading-relaxed">
                                            {t.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono font-medium text-[var(--text-muted)]">
                                        {t.assignee && (() => {
                                            const worker = workers.find(w => w.uid === t.assignee);
                                            const dispName = worker ? worker.name : t.assignee;
                                            return <span className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[8px] text-[var(--text-primary)]">{dispName.charAt(0).toUpperCase()}</div> <span className="truncate max-w-[100px]">{dispName}</span></span>;
                                        })()}
                                        {t.dueDate && <span className="flex items-center gap-1"><Clock size={10} /> {t.dueDate}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button onClick={() => handleEdit(t)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-lg transition-colors" title="Edit">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(t.id)} className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
