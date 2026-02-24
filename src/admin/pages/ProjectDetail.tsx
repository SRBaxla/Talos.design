import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useTickets, deleteProject } from '../store/adminStore';
import type { Project } from '../store/adminStore';
import TicketList from '../components/TicketList';
import ProjectModal from '../components/ProjectModal';
import {
    ArrowLeft, Edit2, Trash2, ExternalLink, Calendar, DollarSign, Tag,
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
        if (window.confirm(`Delete "${project.name}"? This will also delete all tickets.`)) {
            await deleteProject(project.id);
            navigate('/admin/projects');
        }
    };

    if (loading || ticketsLoading) {
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
                    <h1 className="admin-detail-title">{project.name}</h1>
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
            {project.description && (
                <div className="admin-detail-section">
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

            {/* Tickets */}
            <TicketList tickets={tickets} parentCollection="projects" parentId={project.id} />

            <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} project={project} />
        </div>
    );
}
