import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CaseStudy, CaseStudyStatus } from '../store/adminStore';
import { addCaseStudy, updateCaseStudy } from '../store/adminStore';
import { Timestamp } from 'firebase/firestore';

interface CaseStudyModalProps {
    open: boolean;
    onClose: () => void;
    study?: CaseStudy | null;
}

const STATUS_OPTIONS: { value: CaseStudyStatus; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'research', label: 'Research' },
    { value: 'writing', label: 'Writing' },
    { value: 'review', label: 'Review' },
    { value: 'published', label: 'Published' },
];

const emptyForm = {
    title: '',
    industry: '',
    client: '',
    status: 'draft' as CaseStudyStatus,
    summary: '',
    challenge: '',
    solution: '',
    results: '',
    tags: [] as string[],
    liveUrl: '',
    publishDate: '',
    showOnWebsite: true,
};

export default function CaseStudyModal({ open, onClose, study }: CaseStudyModalProps) {
    const [form, setForm] = useState(emptyForm);
    const [tagInput, setTagInput] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (study) {
            setForm({
                title: study.title,
                industry: study.industry,
                client: study.client,
                status: study.status,
                summary: study.summary,
                challenge: study.challenge,
                solution: study.solution,
                results: study.results,
                tags: study.tags || [],
                liveUrl: study.liveUrl,
                publishDate: study.publishDate,
                showOnWebsite: study.showOnWebsite ?? true,
            });
        } else {
            setForm(emptyForm);
        }
    }, [study, open]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (study) {
                await updateCaseStudy(study.id, form);
            } else {
                await addCaseStudy({
                    ...form,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                } as unknown as Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt'>);
            }
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const handleAddTag = () => {
        const tag = tagInput.trim();
        if (tag && !form.tags.includes(tag)) {
            setForm({ ...form, tags: [...form.tags, tag] });
        }
        setTagInput('');
    };

    const handleRemoveTag = (tag: string) => {
        setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
    };

    if (!open) return null;

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h2 className="admin-modal-title">
                        {study ? 'Edit Case Study' : 'New Case Study'}
                    </h2>
                    <button className="admin-modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="admin-modal-body">
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label className="admin-label">Title *</label>
                            <input
                                className="admin-input"
                                placeholder="e.g. Hotel Booking Platform"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="admin-field">
                            <label className="admin-label">Client</label>
                            <input
                                className="admin-input"
                                placeholder="e.g. Grand Palace Hotel"
                                value={form.client}
                                onChange={(e) => setForm({ ...form, client: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="admin-form-grid admin-form-grid-3">
                        <div className="admin-field">
                            <label className="admin-label">Industry</label>
                            <input
                                className="admin-input"
                                placeholder="e.g. Hospitality"
                                value={form.industry}
                                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                            />
                        </div>
                        <div className="admin-field">
                            <label className="admin-label">Status</label>
                            <select
                                className="admin-select"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value as CaseStudyStatus })
                                }
                            >
                                {STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-field">
                            <label className="admin-label">Publish Date</label>
                            <input
                                type="date"
                                className="admin-input"
                                value={form.publishDate}
                                onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                            />
                        </div>
                        <div className="admin-field flex items-center pt-8">
                            <label className="admin-label !mb-0 flex items-center gap-2 cursor-pointer select-none text-[var(--text-primary)] hover:text-[var(--accent-orange)] transition-colors">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-surface)] accent-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] cursor-pointer"
                                    checked={form.showOnWebsite}
                                    onChange={(e) => setForm({ ...form, showOnWebsite: e.target.checked })}
                                />
                                Show on Website
                            </label>
                        </div>
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Summary</label>
                        <textarea
                            className="admin-textarea"
                            rows={2}
                            placeholder="One-line overview of the case study..."
                            value={form.summary}
                            onChange={(e) => setForm({ ...form, summary: e.target.value })}
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Challenge</label>
                        <textarea
                            className="admin-textarea"
                            rows={3}
                            placeholder="What problem did the client face?"
                            value={form.challenge}
                            onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Solution</label>
                        <textarea
                            className="admin-textarea"
                            rows={3}
                            placeholder="How did Talos solve it?"
                            value={form.solution}
                            onChange={(e) => setForm({ ...form, solution: e.target.value })}
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Results</label>
                        <textarea
                            className="admin-textarea"
                            rows={3}
                            placeholder="Measurable outcomes, metrics..."
                            value={form.results}
                            onChange={(e) => setForm({ ...form, results: e.target.value })}
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Live URL</label>
                        <input
                            className="admin-input"
                            placeholder="https://..."
                            value={form.liveUrl}
                            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Tags</label>
                        <div className="admin-tags-input">
                            <div className="admin-tags-list">
                                {form.tags.map((tag) => (
                                    <span key={tag} className="admin-tag">
                                        {tag}
                                        <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                                    </span>
                                ))}
                            </div>
                            <input
                                className="admin-input"
                                placeholder="Add tag and press Enter"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="admin-modal-actions">
                        <button type="button" className="admin-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="admin-btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : study ? 'Update Case Study' : 'Create Case Study'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
