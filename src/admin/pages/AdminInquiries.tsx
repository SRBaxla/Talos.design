import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInquiries, updateInquiry, deleteInquiry, addProject, addActivityLog } from '../store/adminStore';
import type { InquiryStatus } from '../store/adminStore';
import { getAuth } from 'firebase/auth';
import { DollarSign, CheckCircle, Archive, ArchiveRestore, Trash2, CheckSquare, Square } from 'lucide-react';

const STATUS_COLORS: Record<InquiryStatus, string> = {
    unread: '#f59e0b',
    read: '#3b82f6',
    contacted: '#00e5ff',
    negotiating: '#8b5cf6',
    won: '#22c55e',
    lost: '#ef4444',
    archived: '#71717a'
};

export default function AdminInquiries() {
    const { inquiries, loading } = useInquiries();
    const [convertingId, setConvertingId] = useState<string | null>(null);
    const [showArchived, setShowArchived] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/10 border-t-accent-orange rounded-full animate-spin" /></div>;
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateInquiry(id, { status: newStatus as InquiryStatus });
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleValueChange = async (id: string, newValue: string) => {
        try {
            await updateInquiry(id, { value: newValue });
        } catch (err) {
            console.error('Failed to update value:', err);
        }
    };

    const handleConvertToProject = async (inquiry: any) => {
        if (!window.confirm(`Accept & Convert "${inquiry.company || inquiry.name}" into a Project?`)) return;
        setConvertingId(inquiry.id);

        try {
            // Create the new project based on inquiry data
            const projectTitle = `${inquiry.company || inquiry.name} - Project`;

            // Generate a temporary access code for the client
            const accessCode = Math.random().toString(36).slice(-8).toUpperCase();

            const newProjectRef = await addProject({
                title: projectTitle,
                client: inquiry.name,
                clientEmail: inquiry.email,
                type: 'custom',
                status: 'lead',
                priority: 'medium',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                budget: inquiry.value || '',
                description: `Automatically created from inquiry ID: ${inquiry.id}\n\nOriginal Message:\n${inquiry.message}`,
                notes: 'Pending final scope and team allotment.',
                tags: ['converted-lead'],
                technologies: [],
                liveUrl: '',
                link: '',
                accessCode: accessCode,
                teamAllotment: [],
                selectedFeatures: [],
                clientRequirements: [],
                meetings: []
            });

            // Log activity
            const auth = getAuth();
            const workerUid = auth.currentUser?.uid;
            if (workerUid) {
                await addActivityLog({
                    workerUid,
                    action: 'converted_inquiry_to_project',
                    description: `Converted inquiry from ${inquiry.company || inquiry.name} to project: ${projectTitle}`,
                    referenceId: newProjectRef.id,
                    referenceType: 'project'
                });
            }

            // Auto-archive the lead so it doesn't clutter the view
            await updateInquiry(inquiry.id, { status: 'archived' });

            // Navigate to projects to manage it
            navigate('/admin/projects');

            // Show a quick success alert, or just silently succeed
            alert(`Project created successfully! An automated welcome email with access code ${accessCode} will be sent to the client.`);

        } catch (err) {
            console.error('Failed to convert to project:', err);
            alert('Failed to convert to project. Check console for details.');
        } finally {
            setConvertingId(null);
        }
    };

    const handleUnarchive = async (inquiryId: string) => {
        try {
            await updateInquiry(inquiryId, { status: 'unread' });
        } catch (err) {
            console.error('Failed to unarchive inquiry:', err);
        }
    };

    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleSelectAll = (ids: string[]) => {
        if (selectedIds.size >= ids.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(ids));
        }
    };

    const handleBulkDelete = async () => {
        const count = selectedIds.size;
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete ${count} selected archived inquiries? This cannot be undone.`)) return;

        setIsDeleting(true);
        try {
            const promises = Array.from(selectedIds).map(id => deleteInquiry(id));
            await Promise.all(promises);
            setSelectedIds(new Set());
        } catch (err) {
            console.error('Bulk delete failed:', err);
            alert('Failed to delete some inquiries.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Group inquiries for Kanban
    let columns: { title: string; keys: InquiryStatus[] }[] = [
        { title: 'New Leads', keys: ['unread', 'read'] },
        { title: 'In Discussion', keys: ['contacted', 'negotiating'] },
        { title: 'Decided', keys: ['won', 'lost'] },
    ];

    if (showArchived) {
        columns = [{ title: 'Archived', keys: ['archived'] }];
    }

    return (
        <div className="h-full w-full flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex-none border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="font-display font-bold text-xl text-[var(--text-primary)]">Deals & Inquiries</h1>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">Manage neural link transmissions</p>
                </div>
                <div className="flex items-center gap-3">
                    {showArchived && inquiries.filter(i => i.status === 'archived').length > 0 && (
                        <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-color)] p-1 rounded-lg">
                            <button
                                onClick={() => toggleSelectAll(inquiries.filter(i => i.status === 'archived').map(i => i.id))}
                                className="px-3 py-1.5 rounded hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                            >
                                {selectedIds.size > 0 ? <CheckSquare size={14} /> : <Square size={14} />}
                                {selectedIds.size > 0 ? 'Deselect All' : 'Select All'}
                            </button>
                            {selectedIds.size > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={isDeleting}
                                    className="px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Trash2 size={14} />
                                    {isDeleting ? 'Deleting...' : `Delete (${selectedIds.size})`}
                                </button>
                            )}
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setShowArchived(!showArchived);
                            setSelectedIds(new Set());
                        }}
                        className="bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-mono"
                    >
                        {showArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                        {showArchived ? 'Hide Archived' : 'Show Archived'}
                    </button>
                </div>
            </header>

            {/* Kanban Board */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex gap-6 h-full min-w-max items-start">
                    {columns.map((col) => {
                        const colInquiries = inquiries.filter(i => col.keys.includes(i.status as InquiryStatus));

                        return (
                            <div key={col.title} className="w-[380px] flex flex-col h-full max-h-full">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="font-display font-bold text-sm text-[var(--text-secondary)]">{col.title}</h3>
                                    <span className="text-[10px] font-mono bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] px-2 py-0.5 rounded-full">
                                        {colInquiries.length}
                                    </span>
                                </div>

                                {/* Column Track */}
                                <div className="flex-1 overflow-y-auto space-y-3 pb-8 pr-2 custom-scrollbar">
                                    {colInquiries.length === 0 ? (
                                        <div className="border border-dashed border-[var(--border-color)] rounded-xl h-24 flex items-center justify-center text-[var(--text-muted)] text-xs font-mono">
                                            Empty
                                        </div>
                                    ) : (
                                        colInquiries.map(inquiry => (
                                            <div
                                                key={inquiry.id}
                                                className={`bg-[var(--bg-surface)] border rounded-xl p-4 transition-all group relative ${selectedIds.has(inquiry.id) ? 'border-[var(--accent-orange)] shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-[var(--border-color)] hover:border-[var(--accent-orange)]'}`}
                                            >
                                                {/* Selection Checkbox */}
                                                {showArchived && (
                                                    <button
                                                        onClick={() => toggleSelect(inquiry.id)}
                                                        className={`absolute top-4 left-4 z-10 p-1 rounded-md transition-all ${selectedIds.has(inquiry.id) ? 'bg-[var(--accent-orange)] text-black shadow-lg scale-110' : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 border border-[var(--border-color)] hover:border-[var(--accent-orange)]'}`}
                                                    >
                                                        {selectedIds.has(inquiry.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                                                    </button>
                                                )}

                                                <div className={showArchived ? 'pl-8' : ''}>
                                                    {/* Status dot */}
                                                    <div
                                                        className="absolute top-4 right-4 w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: STATUS_COLORS[inquiry.status] || '#71717a' }}
                                                    />

                                                    <h4 className="font-bold text-[15px] mb-1 pr-6 truncate">{inquiry.company || inquiry.name}</h4>
                                                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mb-4 font-mono">
                                                        <span>{inquiry.name}</span>
                                                        <span>•</span>
                                                        <span className="truncate">{inquiry.email}</span>
                                                    </div>

                                                    <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg p-3 mb-4 text-[12px] text-[var(--text-secondary)] line-clamp-3">
                                                        {inquiry.message}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border-color)]">
                                                     <div className="flex items-center gap-1.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded px-2 py-1 focus-within:border-[var(--accent-orange)] transition-colors">
                                                        <DollarSign size={12} className="text-[var(--text-muted)]" />
                                                        <input
                                                            type="text"
                                                            placeholder="Value"
                                                            defaultValue={inquiry.value || ''}
                                                            onBlur={(e) => handleValueChange(inquiry.id, e.target.value)}
                                                            className="bg-transparent border-none text-[11px] font-mono w-16 focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                                        />
                                                    </div>

                                                    <select
                                                        value={inquiry.status}
                                                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                                                        className="bg-transparent text-[11px] font-mono font-medium focus:outline-none appearance-none cursor-pointer pr-4 hover:opacity-80 transition-opacity text-right"
                                                        style={{ color: STATUS_COLORS[inquiry.status] }}
                                                    >
                                                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="unread">Unread</option>
                                                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="read">Read</option>
                                                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="contacted">Contacted</option>
                                                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="negotiating">Negotiating</option>
                                                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="won">Won</option>
                                                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="lost">Lost</option>
                                                        <option className="bg-[var(--bg-surface)] text-[var(--text-primary)]" value="archived">Archived</option>
                                                    </select>
                                                </div>

                                                {/* Convert Button */}
                                                {inquiry.status === 'won' && (
                                                    <button
                                                        onClick={() => handleConvertToProject(inquiry)}
                                                        disabled={convertingId === inquiry.id}
                                                        className="w-full mt-3 bg-[rgba(34,197,94,0.1)] hover:bg-[rgba(34,197,94,0.2)] text-[#22c55e] border border-[rgba(34,197,94,0.2)] hover:border-[#22c55e] transition-colors rounded-lg py-2 flex items-center justify-center gap-2 text-xs font-bold"
                                                    >
                                                        <CheckCircle size={14} />
                                                        {convertingId === inquiry.id ? 'Converting...' : 'Convert to Project'}
                                                    </button>
                                                )}

                                                {/* Unarchive Button */}
                                                {inquiry.status === 'archived' && (
                                                    <button
                                                        onClick={() => handleUnarchive(inquiry.id)}
                                                        className="w-full mt-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[var(--text-primary)] border border-[var(--border-color)] transition-colors rounded-lg py-2 flex items-center justify-center gap-2 text-xs font-bold"
                                                    >
                                                        <ArchiveRestore size={14} />
                                                        Unarchive Lead
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

