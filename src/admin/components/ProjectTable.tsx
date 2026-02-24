import { useState } from 'react';
import { Search, ArrowUpDown, Edit2, Trash2, ExternalLink } from 'lucide-react';
import type { Project } from '../store/adminStore';
import { deleteProject } from '../store/adminStore';

interface ProjectTableProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onRowClick?: (project: Project) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    'lead': { bg: 'rgba(113,113,122,0.15)', text: '#a1a1aa' },
    'in-progress': { bg: 'rgba(0,229,255,0.12)', text: '#00e5ff' },
    'review': { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    'completed': { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
    'published': { bg: 'rgba(192,132,252,0.12)', text: '#c084fc' },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
    'low': { bg: 'rgba(113,113,122,0.15)', text: '#a1a1aa' },
    'medium': { bg: 'rgba(0,229,255,0.12)', text: '#00e5ff' },
    'high': { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    'urgent': { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
};

const TYPE_LABELS: Record<string, string> = {
    'web-design': 'Web Design',
    'ai-chatbot': 'AI Chatbot',
    'automation': 'Automation',
    'custom': 'Custom Build',
};

export default function ProjectTable({ projects, onEdit, onRowClick }: ProjectTableProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortKey, setSortKey] = useState<string>('createdAt');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const toggleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const filtered = projects
        .filter((p) => {
            const matchSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.client.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === 'all' || p.status === statusFilter;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            const aVal = (a as unknown as Record<string, unknown>)[sortKey];
            const bVal = (b as unknown as Record<string, unknown>)[sortKey];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDir === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            return 0;
        });

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Delete project "${name}"? This cannot be undone.`)) {
            await deleteProject(id);
        }
    };

    return (
        <div className="admin-table-wrapper">
            <div className="admin-table-toolbar">
                <div className="admin-search">
                    <Search size={16} />
                    <input
                        className="admin-search-input"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="admin-select admin-select-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="lead">Lead</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                    <option value="published">Published</option>
                </select>
            </div>

            <div className="admin-table-scroll">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th onClick={() => toggleSort('name')}>
                                <span>Name <ArrowUpDown size={12} /></span>
                            </th>
                            <th onClick={() => toggleSort('client')}>
                                <span>Client <ArrowUpDown size={12} /></span>
                            </th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th onClick={() => toggleSort('startDate')}>
                                <span>Start <ArrowUpDown size={12} /></span>
                            </th>
                            <th>Budget</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="admin-table-empty">
                                    No projects found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p) => (
                                <tr key={p.id} onClick={() => onRowClick ? onRowClick(p) : onEdit(p)}>
                                    <td className="admin-table-name">{p.name}</td>
                                    <td>{p.client || '—'}</td>
                                    <td>{TYPE_LABELS[p.type] || p.type}</td>
                                    <td>
                                        <span
                                            className="admin-badge"
                                            style={{
                                                background: STATUS_COLORS[p.status]?.bg,
                                                color: STATUS_COLORS[p.status]?.text,
                                            }}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className="admin-badge"
                                            style={{
                                                background: PRIORITY_COLORS[p.priority]?.bg,
                                                color: PRIORITY_COLORS[p.priority]?.text,
                                            }}
                                        >
                                            {p.priority}
                                        </span>
                                    </td>
                                    <td className="admin-table-date">{p.startDate || '—'}</td>
                                    <td>{p.budget || '—'}</td>
                                    <td>
                                        <div className="admin-table-actions" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => onEdit(p)} title="Edit">
                                                <Edit2 size={14} />
                                            </button>
                                            {p.liveUrl && (
                                                <a href={p.liveUrl} target="_blank" rel="noreferrer" title="View Live">
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(p.id, p.name)}
                                                className="admin-action-danger"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
