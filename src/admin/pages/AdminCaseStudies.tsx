import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseStudies, deleteCaseStudy } from '../store/adminStore';
import CaseStudyModal from '../components/CaseStudyModal';
import type { CaseStudy } from '../store/adminStore';
import { Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    draft: { bg: 'rgba(113,113,122,0.15)', text: '#a1a1aa' },
    research: { bg: 'rgba(0,229,255,0.12)', text: '#00e5ff' },
    writing: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    review: { bg: 'rgba(192,132,252,0.12)', text: '#c084fc' },
    published: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
};

export default function AdminCaseStudies() {
    const { studies, loading } = useCaseStudies();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [editStudy, setEditStudy] = useState<CaseStudy | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const handleEdit = (study: CaseStudy) => {
        setEditStudy(study);
        setModalOpen(true);
    };

    const handleNew = () => {
        setEditStudy(null);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditStudy(null);
    };

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Delete case study "${title}"? This cannot be undone.`)) {
            await deleteCaseStudy(id);
        }
    };

    const handleRowClick = (study: CaseStudy) => {
        navigate(`/admin/case-studies/${study.id}`);
    };

    const filtered = studies.filter((s) => {
        const matchSearch =
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.industry.toLowerCase().includes(search.toLowerCase()) ||
            s.client.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/10 border-t-accent-orange rounded-full animate-spin" /></div>;
    }

    return (
        <div className="p-6 md:p-10 w-full max-w-screen-2xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">Case Studies</h1>
                <p className="text-[var(--text-secondary)] font-medium">Track company case study progress and publishing</p>
                <div className="flex items-center gap-3 mt-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-accent-orange text-bg-base font-bold text-sm tracking-wide rounded-lg hover:bg-accent-orange-hover hover:shadow-[0_0_16px_rgba(210,193,182,0.35)] transition-all" onClick={handleNew}>
                        <Plus size={16} strokeWidth={2.5} /> New Case Study
                    </button>
                </div>
            </div>

            <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] gap-4">
                    <div className="flex items-center gap-2 text-[var(--text-muted)] flex-1 max-w-sm px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus-within:border-[var(--accent-orange)] focus-within:ring-1 focus-within:ring-[var(--accent-orange)] focus-within:ring-opacity-30 transition-all">
                        <Search size={16} />
                        <input
                            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-[var(--text-muted)] font-medium"
                            placeholder="Search case studies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-white text-sm font-medium focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] focus:ring-opacity-30 outline-none min-w-[140px]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="research">Research</option>
                        <option value="writing">Writing</option>
                        <option value="review">Review</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="border-b border-[var(--border-color)] bg-[var(--bg-base)]">
                            <tr>
                                <th className="px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Title</th>
                                <th className="px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Client</th>
                                <th className="px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Industry</th>
                                <th className="px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                                <th className="px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Publish Date</th>
                                <th className="px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-[var(--text-muted)] py-12 font-mono text-sm">
                                        No case studies found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s) => (
                                    <tr key={s.id} onClick={() => handleRowClick(s)} className="hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors border-b border-[var(--border-color)] last:border-0 group">
                                        <td className="px-5 py-4 text-sm text-white font-bold group-hover:text-[var(--accent-cyan)] transition-colors">{s.title}</td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)] font-medium">{s.client || '—'}</td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)] font-medium">{s.industry || '—'}</td>
                                        <td className="px-5 py-4 text-sm">
                                            <span
                                                className="inline-flex items-center px-2.5 py-1 rounded border text-[10px] uppercase font-bold tracking-wider"
                                                style={{
                                                    backgroundColor: `${STATUS_COLORS[s.status]?.text}15`,
                                                    color: STATUS_COLORS[s.status]?.text,
                                                    borderColor: `${STATUS_COLORS[s.status]?.text}30`
                                                }}
                                            >
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)] font-mono text-xs">{s.publishDate || '—'}</td>
                                        <td className="px-5 py-4 text-sm text-right">
                                            <div
                                                className="flex items-center justify-end gap-1.5"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button onClick={() => handleEdit(s)} title="Edit" className="text-[var(--text-muted)] p-2 rounded-lg hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                {s.liveUrl && (
                                                    <a
                                                        href={s.liveUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="View Live"
                                                        className="text-[var(--text-muted)] p-2 rounded-lg hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors inline-block"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(s.id, s.title)}
                                                    className="text-[var(--text-muted)] p-2 rounded-lg hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] transition-colors"
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
            </div>

            <CaseStudyModal open={modalOpen} onClose={handleClose} study={editStudy} />
        </div>
    );
}
