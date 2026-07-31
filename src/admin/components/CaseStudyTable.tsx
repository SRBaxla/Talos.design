import { useState } from 'react';
import { Search, ArrowUpDown, Edit2, Trash2, ExternalLink, Eye, EyeOff, Monitor } from 'lucide-react';
import type { CaseStudy } from '../store/adminStore';
import { deleteCaseStudy, updateCaseStudy } from '../store/adminStore';
import AdminPreviewWidgetModal from './AdminPreviewWidgetModal';

interface CaseStudyTableProps {
    studies: CaseStudy[];
    onEdit: (study: CaseStudy) => void;
    onRowClick?: (study: CaseStudy) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    draft: { bg: 'rgba(113,113,122,0.15)', text: '#a1a1aa' },
    research: { bg: 'rgba(0,229,255,0.12)', text: '#00e5ff' },
    writing: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    review: { bg: 'rgba(192,132,252,0.12)', text: '#c084fc' },
    published: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
};

export default function CaseStudyTable({ studies, onEdit, onRowClick }: CaseStudyTableProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortKey, setSortKey] = useState<string>('createdAt');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [previewStudy, setPreviewStudy] = useState<CaseStudy | null>(null);

    const toggleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const filtered = studies
        .filter((s) => {
            const matchSearch =
                s.title.toLowerCase().includes(search.toLowerCase()) ||
                s.industry.toLowerCase().includes(search.toLowerCase()) ||
                s.client.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === 'all' || s.status === statusFilter;
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
        if (window.confirm(`Delete case study "${title}"? This cannot be undone.`)) {
            await deleteCaseStudy(id);
        }
    };

    const handleToggleVisibility = async (e: React.MouseEvent, id: string, currentStatus: boolean | undefined) => {
        e.stopPropagation();
        await updateCaseStudy(id, { showOnWebsite: !(currentStatus ?? true) });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4">
                <div className="flex items-center gap-2 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 w-full max-w-sm focus-within:border-[var(--accent-cyan)] transition-colors">
                    <Search size={16} className="text-[var(--text-muted)]" />
                    <input
                        className="bg-transparent border-none text-sm w-full focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                        placeholder="Search case studies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider hidden sm:block">Filter by Status:</span>
                    <select
                        className="bg-[var(--bg-base)] border border-[var(--border-color)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent-cyan)] transition-colors text-[var(--text-primary)] appearance-none cursor-pointer pr-8 relative"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a1a1aa%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.5rem center',
                            backgroundSize: '1em'
                        }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="all">All Status</option>
                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="draft">Draft</option>
                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="research">Research</option>
                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="writing">Writing</option>
                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="review">Review</option>
                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="published">Published</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)]">
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none" onClick={() => toggleSort('title')}>
                                <div className="flex items-center gap-2">Title <ArrowUpDown size={12} className="opacity-50" /></div>
                            </th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none" onClick={() => toggleSort('client')}>
                                <div className="flex items-center gap-2">Client <ArrowUpDown size={12} className="opacity-50" /></div>
                            </th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Industry</th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none" onClick={() => toggleSort('publishDate')}>
                                <div className="flex items-center gap-2">Publish Date <ArrowUpDown size={12} className="opacity-50" /></div>
                            </th>
                            <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm">
                                    No case studies found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((s) => (
                                <tr
                                    key={s.id}
                                    onClick={() => onRowClick ? onRowClick(s) : onEdit(s)}
                                    className="group hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">{s.title}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {s.client || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        {s.industry || '—'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border"
                                            style={{
                                                backgroundColor: STATUS_COLORS[s.status]?.bg || 'rgba(255,255,255,0.1)',
                                                color: STATUS_COLORS[s.status]?.text || '#fff',
                                                borderColor: STATUS_COLORS[s.status]?.bg || 'rgba(255,255,255,0.2)'
                                            }}
                                        >
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-mono">
                                        {s.publishDate || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => setPreviewStudy(s)}
                                                className="p-1.5 text-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/10 rounded transition-colors"
                                                title="Open Live Preview Widget"
                                            >
                                                <Monitor size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleToggleVisibility(e, s.id, s.showOnWebsite)}
                                                className={`px-2 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                                                    s.showOnWebsite !== false
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                                        : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700 hover:text-white hover:border-zinc-500'
                                                }`}
                                                title={s.showOnWebsite !== false ? "Pushed to Public Showcase (Click to Hide)" : "Add to Public Showcase (Click to Push Live)"}
                                            >
                                                {s.showOnWebsite !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                                                <span className="hidden sm:inline">
                                                    {s.showOnWebsite !== false ? 'Showcase: ON' : 'Add to Showcase'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => onEdit(s)}
                                                className="p-1.5 text-[var(--text-muted)] hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            {s.liveUrl && (
                                                <a
                                                    href={s.liveUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 text-[var(--text-muted)] hover:text-green-400 hover:bg-green-400/10 rounded transition-colors"
                                                    title="View Live Site"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(s.id, s.title)}
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
                open={!!previewStudy}
                onClose={() => setPreviewStudy(null)}
                item={previewStudy ? {
                    id: previewStudy.id,
                    title: previewStudy.title,
                    client: previewStudy.client,
                    category: previewStudy.industry,
                    description: previewStudy.summary || previewStudy.solution || previewStudy.challenge,
                    challenge: previewStudy.challenge,
                    solution: previewStudy.solution,
                    results: previewStudy.results,
                    liveUrl: previewStudy.liveUrl,
                    showOnWebsite: previewStudy.showOnWebsite,
                    type: 'caseStudy'
                } : null}
            />
        </div>
    );
}

