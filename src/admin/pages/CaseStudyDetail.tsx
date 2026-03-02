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
            <div className="p-8 max-w-[1400px] mx-auto animate-fade-in text-center py-20">
                <p className="text-secondary mb-4">Case study not found.</p>
                <Link to="/admin/case-studies" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-primary font-semibold text-sm rounded-lg hover:bg-white/10 transition-all">
                    <ArrowLeft size={16} /> Back to Case Studies
                </Link>
            </div>
        );
    }

    const sc = STATUS_COLORS[study.status];

    return (
        <div className="p-6 md:p-10 w-full max-w-screen-2xl mx-auto space-y-8 animate-fade-in">
            {/* Back + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <Link to="/admin/case-studies" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors font-medium tracking-wide">
                    <ArrowLeft size={16} /> Back to Case Studies
                </Link>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)] transition-all" onClick={() => setModalOpen(true)}>
                        <Edit2 size={14} /> Edit
                    </button>
                    {study.liveUrl && (
                        <a href={study.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)] transition-all">
                            <ExternalLink size={14} /> View Live
                        </a>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-red-400 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[rgba(239,68,68,0.15)] transition-all" onClick={handleDelete}>
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${sc?.text}15`, color: sc?.text, borderColor: `${sc?.text}30` }}>
                            {study.status}
                        </span>
                        {study.industry && <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">{study.industry}</span>}
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-2">{study.title}</h1>
                    {study.client && (
                        <p className="text-[var(--text-secondary)] font-medium text-lg">Client: <span className="text-white">{study.client}</span></p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Content Sections */}
                    {study.summary && (
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-8">
                            <h3 className="font-display text-lg font-bold mb-4 text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)]" /> Summary</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{study.summary}</p>
                        </div>
                    )}
                    {study.challenge && (
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-8">
                            <h3 className="font-display text-lg font-bold mb-4 text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Challenge</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{study.challenge}</p>
                        </div>
                    )}
                    {study.solution && (
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-8">
                            <h3 className="font-display text-lg font-bold mb-4 text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]" /> Solution</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{study.solution}</p>
                        </div>
                    )}
                    {study.results && (
                        <div className="bg-[rgba(0,229,255,0.03)] border border-[rgba(0,229,255,0.15)] rounded-2xl p-8">
                            <h3 className="font-display text-lg font-bold mb-4 text-[var(--accent-cyan)] flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan)]" /> Results</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap font-medium">{study.results}</p>
                        </div>
                    )}

                    {/* Tickets */}
                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-8">
                        <TicketList tickets={tickets} parentCollection="caseStudies" parentId={study.id} />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Sidebar Info */}
                    {study.tags?.length > 0 && (
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] flex items-center gap-2">
                                <Tag size={16} className="text-[var(--accent-orange)]" />
                                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">Tags</h3>
                            </div>
                            <div className="p-5 flex flex-wrap gap-2">
                                {study.tags.map(t => <span key={t} className="px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg text-xs font-bold tracking-wide text-[var(--text-secondary)] hover:text-white transition-colors">{t}</span>)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CaseStudyModal open={modalOpen} onClose={() => setModalOpen(false)} study={study} />
        </div>
    );
}
