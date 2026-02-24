import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useTickets, deleteCaseStudy } from '../store/adminStore';
import type { CaseStudy } from '../store/adminStore';
import TicketList from '../components/TicketList';
import CaseStudyModal from '../components/CaseStudyModal';
import { ArrowLeft, Edit2, Trash2, ExternalLink, Tag } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    draft: { bg: 'rgba(113,113,122,0.15)', text: '#a1a1aa' },
    research: { bg: 'rgba(0,229,255,0.12)', text: '#00e5ff' },
    writing: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    review: { bg: 'rgba(192,132,252,0.12)', text: '#c084fc' },
    published: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
};

export default function CaseStudyDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [study, setStudy] = useState<CaseStudy | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const { tickets, loading: ticketsLoading } = useTickets('caseStudies', id || '');

    useEffect(() => {
        if (!id) return;
        const unsub = onSnapshot(doc(db, 'caseStudies', id), (snap) => {
            if (snap.exists()) {
                setStudy({ id: snap.id, ...snap.data() } as CaseStudy);
            }
            setLoading(false);
        });
        return unsub;
    }, [id]);

    const handleDelete = async () => {
        if (!study) return;
        if (window.confirm(`Delete "${study.title}"? This will also delete all tickets.`)) {
            await deleteCaseStudy(study.id);
            navigate('/admin/case-studies');
        }
    };

    if (loading || ticketsLoading) {
        return <div className="admin-loading"><div className="admin-spinner" /></div>;
    }

    if (!study) {
        return (
            <div className="admin-page">
                <p>Case study not found.</p>
                <Link to="/admin/case-studies" className="admin-btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                    <ArrowLeft size={16} /> Back to Case Studies
                </Link>
            </div>
        );
    }

    const sc = STATUS_COLORS[study.status];

    return (
        <div className="admin-page">
            {/* Back + Actions */}
            <div className="admin-detail-top">
                <Link to="/admin/case-studies" className="admin-detail-back">
                    <ArrowLeft size={16} /> Back to Case Studies
                </Link>
                <div className="admin-detail-top-actions">
                    <button className="admin-btn-secondary" onClick={() => setModalOpen(true)}>
                        <Edit2 size={14} /> Edit
                    </button>
                    {study.liveUrl && (
                        <a href={study.liveUrl} target="_blank" rel="noreferrer" className="admin-btn-secondary">
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
                            {study.status}
                        </span>
                        {study.industry && <span className="admin-detail-type">{study.industry}</span>}
                    </div>
                    <h1 className="admin-detail-title">{study.title}</h1>
                    {study.client && (
                        <p className="admin-detail-client">Client: {study.client}</p>
                    )}
                </div>
            </div>

            {/* Tags */}
            {study.tags?.length > 0 && (
                <div className="admin-detail-info-grid">
                    <div className="admin-detail-info-card">
                        <Tag size={14} className="admin-detail-info-icon" />
                        <div>
                            <div className="admin-detail-info-label">Tags</div>
                            <div className="admin-detail-tags">
                                {study.tags.map(t => <span key={t} className="admin-tag">{t}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Sections */}
            {study.summary && (
                <div className="admin-detail-section">
                    <h3 className="admin-detail-section-title">Summary</h3>
                    <p className="admin-detail-section-text">{study.summary}</p>
                </div>
            )}
            {study.challenge && (
                <div className="admin-detail-section">
                    <h3 className="admin-detail-section-title">Challenge</h3>
                    <p className="admin-detail-section-text">{study.challenge}</p>
                </div>
            )}
            {study.solution && (
                <div className="admin-detail-section">
                    <h3 className="admin-detail-section-title">Solution</h3>
                    <p className="admin-detail-section-text">{study.solution}</p>
                </div>
            )}
            {study.results && (
                <div className="admin-detail-section">
                    <h3 className="admin-detail-section-title">Results</h3>
                    <p className="admin-detail-section-text">{study.results}</p>
                </div>
            )}

            {/* Tickets */}
            <TicketList tickets={tickets} parentCollection="caseStudies" parentId={study.id} />

            <CaseStudyModal open={modalOpen} onClose={() => setModalOpen(false)} study={study} />
        </div>
    );
}
