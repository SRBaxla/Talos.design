import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Trash2, Edit2 } from 'lucide-react';
import type { Ticket, TicketStatus, TicketPriority } from '../store/adminStore';
import { addTicket, updateTicket, deleteTicket } from '../store/adminStore';
import { Timestamp } from 'firebase/firestore';

interface TicketListProps {
    tickets: Ticket[];
    parentCollection: string;
    parentId: string;
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

export default function TicketList({ tickets, parentCollection, parentId }: TicketListProps) {
    const [showForm, setShowForm] = useState(false);
    const [editTicket, setEditTicket] = useState<Ticket | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TicketStatus>('todo');
    const [priority, setPriority] = useState<TicketPriority>('medium');
    const [assignee, setAssignee] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [filter, setFilter] = useState<'all' | TicketStatus>('all');

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
        if (editTicket) {
            await updateTicket(parentCollection, parentId, editTicket.id, {
                title, description, status, priority, assignee, dueDate,
            });
        } else {
            await addTicket(parentCollection, parentId, {
                title, description, status, priority, assignee, dueDate,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            } as unknown as Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>);
        }
        resetForm();
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
        <div className="admin-tickets">
            <div className="admin-tickets-header">
                <h3 className="admin-tickets-title">
                    Tickets
                    <span className="admin-tickets-count">{tickets.length}</span>
                </h3>
                <button className="admin-btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                    <Plus size={14} /> Add Ticket
                </button>
            </div>

            {/* Filter pills */}
            <div className="admin-ticket-filters">
                <button className={`admin-ticket-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                    All ({tickets.length})
                </button>
                <button className={`admin-ticket-filter ${filter === 'todo' ? 'active' : ''}`} onClick={() => setFilter('todo')}>
                    To Do ({todoCount})
                </button>
                <button className={`admin-ticket-filter ${filter === 'in-progress' ? 'active' : ''}`} onClick={() => setFilter('in-progress')}>
                    In Progress ({inProgressCount})
                </button>
                <button className={`admin-ticket-filter ${filter === 'done' ? 'active' : ''}`} onClick={() => setFilter('done')}>
                    Done ({doneCount})
                </button>
            </div>

            {/* Inline add/edit form */}
            {showForm && (
                <div className="admin-ticket-form">
                    <input
                        className="admin-input"
                        placeholder="Ticket title *"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        className="admin-textarea"
                        rows={2}
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="admin-ticket-form-row">
                        <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)}>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                        <select className="admin-select" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                        <input className="admin-input" placeholder="Assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
                        <input type="date" className="admin-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div className="admin-ticket-form-actions">
                        <button className="admin-btn-secondary" onClick={resetForm}>Cancel</button>
                        <button className="admin-btn-primary" onClick={handleSave}>
                            {editTicket ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            )}

            {/* Ticket list */}
            <div className="admin-ticket-list">
                {filtered.length === 0 ? (
                    <div className="admin-ticket-empty">No tickets yet. Add one to start tracking work.</div>
                ) : (
                    filtered.map((t) => {
                        const StatusIcon = STATUS_ICONS[t.status];
                        return (
                            <div key={t.id} className="admin-ticket-item">
                                <button
                                    className="admin-ticket-status-btn"
                                    onClick={() => handleToggleStatus(t)}
                                    style={{ color: STATUS_COLORS[t.status] }}
                                    title={`Status: ${t.status} — click to advance`}
                                >
                                    <StatusIcon size={18} />
                                </button>
                                <div className="admin-ticket-info">
                                    <div className="admin-ticket-title-row">
                                        <span className={`admin-ticket-name ${t.status === 'done' ? 'done' : ''}`}>
                                            {t.title}
                                        </span>
                                        <span
                                            className="admin-ticket-priority-dot"
                                            style={{ background: PRIORITY_COLORS[t.priority] }}
                                            title={t.priority}
                                        />
                                    </div>
                                    {t.description && (
                                        <div className="admin-ticket-desc">{t.description}</div>
                                    )}
                                    <div className="admin-ticket-meta">
                                        {t.assignee && <span>{t.assignee}</span>}
                                        {t.dueDate && <span>Due: {t.dueDate}</span>}
                                    </div>
                                </div>
                                <div className="admin-ticket-actions">
                                    <button onClick={() => handleEdit(t)}><Edit2 size={13} /></button>
                                    <button className="admin-action-danger" onClick={() => handleDelete(t.id)}><Trash2 size={13} /></button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
