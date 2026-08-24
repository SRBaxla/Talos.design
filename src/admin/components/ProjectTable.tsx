import { useState } from 'react';
import { Search, ArrowUpDown, Edit2, Trash2, ExternalLink, Monitor, Eye, EyeOff } from 'lucide-react';
import type { Project } from '../store/adminStore';
import { deleteProject, updateProject } from '../store/adminStore';
import AdminPreviewWidgetModal from './AdminPreviewWidgetModal';

interface ProjectTableProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onRowClick?: (project: Project) => void;
}

import AdminBadge from './AdminBadge';

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
    const [previewProject, setPreviewProject] = useState<Project | null>(null);

    const toggleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const handleToggleVisibility = async (e: React.MouseEvent, id: string, currentShow: boolean | undefined, currentStatus: string) => {
        e.stopPropagation();
        try {
            const nextState = !(currentShow === true || currentStatus === 'published');
            await updateProject(id, {
                showOnWebsite: nextState,
                status: nextState ? 'published' : 'in-progress'
            });
        } catch (err) {
            console.error('Failed to toggle project showcase visibility:', err);
        }
    };

    const filtered = projects
        .filter((p) => {
            const matchSearch =
                (p.title || (p as any).name || '').toLowerCase().includes(search.toLowerCase()) ||
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

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Delete project "${title}"? This cannot be undone.`)) {
            await deleteProject(id);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4">
                <div className="flex items-center gap-2 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 w-full max-w-sm focus-within:border-[var(--accent-orange)] transition-colors">
                    <Search size={16} className="text-[var(--text-muted)]" />
                    <input
                        className="bg-transparent border-none text-sm w-full focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                        placeholder="Search projects or clients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider hidden sm:block">Filter by Status:</span>
                    <select
                        className="bg-[var(--bg-base)] border border-[var(--border-color)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] appearance-none cursor-pointer pr-8 relative"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a1a1aa%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.5rem center',
                            backgroundSize: '1em'
                        }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option className="bg-[#111]" value="all">All Projects</option>
                        <option className="bg-[#111]" value="lead">Lead</option>
                        <option className="bg-[#111]" value="in-progress">In Progress</option>
                        <option className="bg-[#111]" value="review">Review</option>
                        <option className="bg-[#111]" value="completed">Completed</option>
                        <option className="bg-[#111]" value="published">Published</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)]">
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none" onClick={() => toggleSort('title')}>
                                <div className="flex items-center gap-2">Project <ArrowUpDown size={12} className="opacity-50" /></div>
                            </th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none" onClick={() => toggleSort('client')}>
                                <div className="flex items-center gap-2">Client <ArrowUpDown size={12} className="opacity-50" /></div>
                            </th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none" onClick={() => toggleSort('startDate')}>
                                <div className="flex items-center gap-2">Start Date <ArrowUpDown size={12} className="opacity-50" /></div>
                            </th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm">
                                    No projects found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p) => (
                                <tr
                                    key={p.id}
                                    onClick={() => onRowClick ? onRowClick(p) : onEdit(p)}
                                    className="group hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors">{p.title || (p as any).name}</div>
                                        <div className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">{p.budget ? `Budget: ${p.budget}` : 'No Budget Set'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {p.client || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        {TYPE_LABELS[p.type] || p.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <AdminBadge status={p.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <AdminBadge priority={p.priority} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono whitespace-nowrap">
                                        {p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={(e) => handleToggleVisibility(e, p.id, p.showOnWebsite, p.status)}
                                                className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                                                    p.showOnWebsite === true || p.status === 'published'
                                                        ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black border-emerald-600 dark:border-emerald-500 shadow-sm'
                                                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] shadow-sm'
                                                }`}
                                                title={p.showOnWebsite === true || p.status === 'published' ? "Pushed to Public Showcase (Click to Hide)" : "Add to Public Showcase (Click to Push Live)"}
                                            >
                                                {p.showOnWebsite === true || p.status === 'published' ? <Eye size={14} className="shrink-0" /> : <EyeOff size={14} className="shrink-0" />}
                                                <span className="whitespace-nowrap">
                                                    {p.showOnWebsite === true || p.status === 'published' ? 'Showcase: ON' : 'Add to Showcase'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setPreviewProject(p)}
                                                className="p-1.5 text-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/10 rounded transition-colors"
                                                title="Open Live Preview Widget"
                                            >
                                                <Monitor size={16} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(p)}
                                                className="p-1.5 text-[var(--text-muted)] hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            {p.liveUrl && (
                                                <a
                                                    href={p.liveUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 text-[var(--text-muted)] hover:text-green-400 hover:bg-green-400/10 rounded transition-colors"
                                                    title="View Live Site"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(p.id, p.title || (p as any).name)}
                                                className="p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Admin Live Preview Widget Modal */}
            <AdminPreviewWidgetModal
                open={!!previewProject}
                onClose={() => setPreviewProject(null)}
                item={previewProject ? {
                    id: previewProject.id,
                    title: previewProject.title || (previewProject as any).name,
                    client: previewProject.client,
                    category: TYPE_LABELS[previewProject.type] || previewProject.type,
                    description: previewProject.description || previewProject.notes,
                    liveUrl: previewProject.liveUrl,
                    showOnWebsite: previewProject.status === 'published',
                    type: 'project'
                } : null}
            />
        </div>
    );
}

