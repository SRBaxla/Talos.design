import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Project, ProjectStatus, ProjectPriority, ProjectType } from '../store/adminStore';
import { addProject, updateProject } from '../store/adminStore';
import { Timestamp } from 'firebase/firestore';

interface ProjectModalProps {
    open: boolean;
    onClose: () => void;
    project?: Project | null;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
    { value: 'lead', label: 'Lead' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'published', label: 'Published' },
];

const PRIORITY_OPTIONS: { value: ProjectPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

const TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
    { value: 'web-design', label: 'Web Design' },
    { value: 'ai-chatbot', label: 'AI Chatbot' },
    { value: 'automation', label: 'Automation' },
    { value: 'custom', label: 'Custom Build' },
];

const emptyForm = {
    title: '',
    client: '',
    clientEmail: '',
    type: 'web-design' as ProjectType,
    status: 'lead' as ProjectStatus,
    priority: 'medium' as ProjectPriority,
    startDate: '',
    endDate: '',
    budget: '',
    description: '',
    notes: '',
    liveUrl: '',
    link: '',
    tags: [] as string[],
    technologies: [] as string[],
};

export default function ProjectModal({ open, onClose, project }: ProjectModalProps) {
    const [form, setForm] = useState(emptyForm);
    const [tagInput, setTagInput] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (project) {
            setForm({
                title: project.title || (project as any).name || '',
                client: project.client,
                clientEmail: project.clientEmail || '',
                type: project.type,
                status: project.status,
                priority: project.priority,
                startDate: project.startDate || '',
                endDate: project.endDate || '',
                budget: project.budget || '',
                description: project.description || '',
                notes: project.notes || '',
                liveUrl: project.liveUrl || '',
                link: project.link || '',
                tags: project.tags || [],
                technologies: project.technologies || [],
            });
        } else {
            setForm(emptyForm);
        }
    }, [project, open]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (project) {
                await updateProject(project.id, form);
            } else {
                await addProject({
                    ...form,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                } as unknown as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);
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
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h2 className="admin-modal-title">
                        {project ? 'Edit Project' : 'New Project'}
                    </h2>
                    <button className="admin-modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="admin-modal-body">
                    <div className="admin-form-grid admin-form-grid-3">
                        <div className="admin-field">
                            <label className="admin-label">Project Title</label>
                            <input className="admin-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label className="admin-label">Client Name</label>
                            <input className="admin-input" required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
                        </div>
                        <div className="admin-field">
                            <label className="admin-label">Client Email</label>
                            <input className="admin-input" type="email" value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} />
                        </div>
                    </div>

                    <div className="admin-form-grid admin-form-grid-3">
                        <div className="admin-field">
                            <label className="admin-label">Type</label>
                            <select
                                className="admin-select"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value as ProjectType })}
                            >
                                {TYPE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-field">
                            <label className="admin-label">Status</label>
                            <select
                                className="admin-select"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
                            >
                                {STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-field">
                            <label className="admin-label">Priority</label>
                            <select
                                className="admin-select"
                                value={form.priority}
                                onChange={(e) =>
                                    setForm({ ...form, priority: e.target.value as ProjectPriority })
                                }
                            >
                                {PRIORITY_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="admin-form-grid admin-form-grid-3">
                        <div className="admin-field">
                            <label className="admin-label">Start Date</label>
                            <input
                                type="date"
                                className="admin-input"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            />
                        </div>
                        <div className="admin-field">
                            <label className="admin-label">End Date</label>
                            <input
                                type="date"
                                className="admin-input"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            />
                        </div>
                        <div className="admin-field">
                            <label className="admin-label">Budget</label>
                            <input
                                className="admin-input"
                                placeholder="e.g. ₹50,000"
                                value={form.budget}
                                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Description</label>
                        <textarea
                            className="admin-textarea"
                            rows={3}
                            placeholder="Brief project description..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Notes</label>
                        <textarea
                            className="admin-textarea"
                            rows={3}
                            placeholder="Internal notes, requirements, links..."
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                            {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
