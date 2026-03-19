import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useTickets, deleteCaseStudy, updateCaseStudy, useWorkers, addActivityLog } from '../store/adminStore';
import type { CaseStudy } from '../store/adminStore';
import TicketList from '../components/TicketList';
import CaseStudyModal from '../components/CaseStudyModal';
import { ArrowLeft, Edit2, Trash2, ExternalLink, Tag, Users, X } from 'lucide-react';

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
    const { tickets, loading: ticketsLoading, refresh: refreshTickets } = useTickets('caseStudies', id || '');
    const { workers } = useWorkers();

    const [promptModal, setPromptModal] = useState<{
        isOpen: boolean;
        title: string;
        fields: { name: string; label: string; type?: string; placeholder?: string; options?: { value: string; label: string }[] }[];
        onConfirm: (values: Record<string, string>) => void;
    }>({ isOpen: false, title: '', fields: [], onConfirm: () => { } });

    const openPrompt = (
        title: string,
        fields: { name: string; label: string; type?: string; placeholder?: string; options?: { value: string; label: string }[] }[],
        onConfirm: (values: Record<string, string>) => void
    ) => {
        setPromptModal({ isOpen: true, title, fields, onConfirm });
    };

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

    const handleUpdateArray = async (field: keyof CaseStudy, newArray: any[]) => {
        if (!study) return;
        try {
            await updateCaseStudy(study.id, { [field]: newArray });
        } catch (err) {
            console.error(`Failed to update ${field}:`, err);
            alert(`Failed to update ${field}`);
        }
    };

    const addTeamMember = () => {
        const availableOptions = workers.map(w => ({ value: w.uid, label: w.name }));
        if (availableOptions.length === 0) {
            alert("No workers available. Please add some in the Team section.");
            return;
        }

        openPrompt('Assign Team Member', [
            { name: 'uid', label: 'Select Worker', type: 'select', options: availableOptions }
        ], async (values) => {
            const uid = values.uid;
            if (uid && study) {
                const current = study.assignedWorkers || [];
                if (!current.includes(uid)) {
                    await handleUpdateArray('assignedWorkers', [...current, uid]);
                    await addActivityLog({
                        workerUid: uid,
                        action: 'assigned_case_study',
                        description: `Assigned to case study: ${study.title}`,
                        referenceId: study.id,
                        referenceType: 'caseStudy'
                    });
                }
            }
        });
    };

    const removeTeamMember = async (index: number) => {
        if (!study || !study.assignedWorkers) return;
        const current = [...study.assignedWorkers];
        const removedUid = current[index];
        current.splice(index, 1);
        await handleUpdateArray('assignedWorkers', current);

        if (removedUid) {
            await addActivityLog({
                workerUid: removedUid,
                action: 'removed_from_case_study',
                description: `Removed from case study: ${study.title}`,
                referenceId: study.id,
                referenceType: 'caseStudy'
            });
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
                <Link to="/admin/case-studies" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-medium tracking-wide">
                    <ArrowLeft size={16} /> Back to Case Studies
                </Link>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 transition-all" onClick={() => setModalOpen(true)}>
                        <Edit2 size={14} /> Edit
                    </button>
                    {study.liveUrl && (
                        <a href={study.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 transition-all">
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
                    <h1 className="font-display text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-primary)]/70 mb-2">{study.title}</h1>
                    {study.client && (
                        <p className="text-[var(--text-secondary)] font-medium text-lg">Client: <span className="text-[var(--text-primary)]">{study.client}</span></p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Content Sections */}
                    {study.summary && (
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-8">
                            <h3 className="font-display text-lg font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)]" /> Summary</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{study.summary}</p>
                        </div>
                    )}
                    {study.challenge && (
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-8">
                            <h3 className="font-display text-lg font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Challenge</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{study.challenge}</p>
                        </div>
                    )}
                    {study.solution && (
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-8">
                            <h3 className="font-display text-lg font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]" /> Solution</h3>
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
                        <TicketList tickets={tickets} parentCollection="caseStudies" parentId={study.id} onRefresh={refreshTickets} />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Sidebar Info */}
                    {study.tags?.length > 0 && (
                        <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] flex items-center gap-2">
                                <Tag size={16} className="text-[var(--accent-orange)]" />
                                <h3 className="font-display font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">Tags</h3>
                            </div>
                            <div className="p-5 flex flex-wrap gap-2">
                                {study.tags.map(t => <span key={t} className="px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg text-xs font-bold tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{t}</span>)}
                            </div>
                        </div>
                    )}

                    {/* Team Allocation */}
                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                            <h3 className="font-display font-bold text-[var(--text-primary)] flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Users size={16} className="text-[var(--accent-orange)]" /> Team Allocation
                            </h3>
                            <button onClick={addTeamMember} className="text-[10px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded transition-colors text-[var(--text-secondary)]">Assign</button>
                        </div>
                        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                            {(!study.assignedWorkers || study.assignedWorkers.length === 0) ? (
                                <div className="h-full flex items-center justify-center text-sm text-[var(--text-muted)] font-mono bg-[rgba(255,255,255,0.01)] rounded-xl border border-dashed border-[var(--border-color)] min-h-[100px]">No members assigned.</div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {study.assignedWorkers.map((memberUid, idx) => {
                                        const worker = workers.find(w => w.uid === memberUid);
                                        const dispName = worker ? worker.name : 'Unknown Worker';
                                        return (
                                            <div key={idx} className="flex items-center gap-3 bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)] pl-4 pr-2 py-3 rounded-xl w-full justify-between group transition-colors hover:border-[rgba(245,158,11,0.4)]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-[rgba(245,158,11,0.2)] text-[var(--accent-orange)] flex items-center justify-center text-[10px] font-bold uppercase">{dispName.charAt(0)}</div>
                                                    <span className="text-sm text-[var(--text-primary)] font-medium tracking-wide">{dispName}</span>
                                                </div>
                                                <button onClick={() => removeTeamMember(idx)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[rgba(245,158,11,0.2)] text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <CaseStudyModal open={modalOpen} onClose={() => setModalOpen(false)} study={study} />

            {/* Prompt Modal */}
            {promptModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-orange)] opacity-5 rounded-bl-full pointer-events-none"></div>
                        <div className="flex justify-between items-center relative z-10">
                            <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">{promptModal.title}</h2>
                            <button onClick={() => setPromptModal({ ...promptModal, isOpen: false })} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] p-1.5 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            className="flex flex-col gap-5 relative z-10"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const values: Record<string, string> = {};
                                promptModal.fields.forEach(f => {
                                    values[f.name] = formData.get(f.name) as string;
                                });
                                promptModal.onConfirm(values);
                                setPromptModal({ ...promptModal, isOpen: false });
                            }}
                        >
                            {promptModal.fields.map((field) => (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">{field.label}</label>
                                    {field.type === 'select' ? (
                                        <select
                                            name={field.name}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] focus:ring-opacity-30 transition-all font-medium shadow-sm appearance-none"
                                            required
                                        >
                                            <option value="" disabled selected>Select an option</option>
                                            {field.options?.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            name={field.name}
                                            type={field.type || "text"}
                                            placeholder={field.placeholder}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] focus:ring-opacity-30 transition-all font-medium shadow-sm"
                                            required
                                            autoFocus={field.name === promptModal.fields[0].name}
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[var(--border-color)]">
                                <button type="button" onClick={() => setPromptModal({ ...promptModal, isOpen: false })} className="px-5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] hover:brightness-110 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-[var(--accent-orange)] text-black hover:bg-[rgba(245,158,11,0.9)] rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
