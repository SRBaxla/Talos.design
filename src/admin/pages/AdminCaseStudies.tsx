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
        return <div className="admin-loading"><div className="admin-spinner" /></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Case Studies</h1>
                    <p className="admin-page-subtitle">Track company case study progress and publishing</p>
                </div>
                <div className="admin-page-actions">
                    <button className="admin-btn-primary" onClick={handleNew}>
                        <Plus size={16} /> New Case Study
                    </button>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <div className="admin-table-toolbar">
                    <div className="admin-search">
                        <Search size={16} />
                        <input
                            className="admin-search-input"
                            placeholder="Search case studies..."
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
                        <option value="draft">Draft</option>
                        <option value="research">Research</option>
                        <option value="writing">Writing</option>
                        <option value="review">Review</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="admin-table-scroll">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Client</th>
                                <th>Industry</th>
                                <th>Status</th>
                                <th>Publish Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="admin-table-empty">
                                        No case studies found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s) => (
                                    <tr key={s.id} onClick={() => handleRowClick(s)}>
                                        <td className="admin-table-name">{s.title}</td>
                                        <td>{s.client || '—'}</td>
                                        <td>{s.industry || '—'}</td>
                                        <td>
                                            <span
                                                className="admin-badge"
                                                style={{
                                                    background: STATUS_COLORS[s.status]?.bg,
                                                    color: STATUS_COLORS[s.status]?.text,
                                                }}
                                            >
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="admin-table-date">{s.publishDate || '—'}</td>
                                        <td>
                                            <div
                                                className="admin-table-actions"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button onClick={() => handleEdit(s)} title="Edit">
                                                    <Edit2 size={14} />
                                                </button>
                                                {s.liveUrl && (
                                                    <a
                                                        href={s.liveUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="View Live"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(s.id, s.title)}
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

            <CaseStudyModal open={modalOpen} onClose={handleClose} study={editStudy} />
        </div>
    );
}
