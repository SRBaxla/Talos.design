import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInquiries, updateInquiry, addProject } from '../store/adminStore';
import type { InquiryStatus } from '../store/adminStore';
import { sendWelcomeEmail } from '../../lib/emailService';
import { Mail, Building, Clock, DollarSign, CheckCircle } from 'lucide-react';

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
    const navigate = useNavigate();

    if (loading) {
        return <div className="admin-loading"><div className="admin-spinner" /></div>;
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

            await addProject({
                title: projectTitle,
                client: inquiry.name,
                clientEmail: inquiry.email,
                type: 'custom',
                status: 'lead',
                priority: 'medium',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                budget: inquiry.value || '',
                description: `Automatically created from Neural Link ID: ${inquiry.id}\n\nOriginal Message:\n${inquiry.message}`,
                notes: 'Pending final scope and team allotment.',
                tags: ['converted-lead'],
                technologies: [],
                liveUrl: '',
                link: '',
                teamAllotment: [],
                selectedFeatures: [],
                costRevisions: [],
                clientRequirements: [],
                meetings: []
            });

            // Send welcome email to the client
            let emailSent = false;
            try {
                await sendWelcomeEmail({
                    clientName: inquiry.name,
                    clientEmail: inquiry.email,
                    projectTitle: projectTitle,
                    accessCode: accessCode,
                });
                emailSent = true;
            } catch (emailErr) {
                console.warn('Email send failed (check EmailJS config):', emailErr);
            }

            // Auto-archive the lead so it doesn't clutter the view
            await updateInquiry(inquiry.id, { status: 'archived' });

            // Navigate to projects to manage it
            navigate('/admin/projects');

            // Show the access code to admin so they can also share manually
            if (!emailSent) {
                alert(`Project created! Welcome email could not be sent automatically.\n\nPlease share manually:\nEmail: ${inquiry.email}\nAccess Code: ${accessCode}\nPortal: ${window.location.origin}/portal`);
            }

        } catch (err) {
            console.error('Failed to convert to project:', err);
            alert('Failed to convert to project. Check console for details.');
        } finally {
            setConvertingId(null);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Lead CRM</h1>
                    <p className="admin-page-subtitle">Manage neural link transmissions and deal pipeline</p>
                </div>
            </div>

            <div className="admin-dashboard-grid mt-6">
                <div className="admin-card" style={{ gridColumn: 'span 2' }}>
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <Mail size={16} className="text-[var(--accent-orange)]" />
                            <h3>All Leads & Transmissions</h3>
                        </div>
                    </div>
                    <div className="admin-card-body p-0">
                        {inquiries.length === 0 ? (
                            <div className="admin-card-empty py-12">No inquiries received yet</div>
                        ) : (
                            <div className="flex flex-col">
                                {inquiries.map((inquiry) => (
                                    <div key={inquiry.id} className="admin-activity-item border-b border-[var(--border-color)] last:border-0 rounded-none p-4 hover:bg-[rgba(245,158,11,0.05)] transition-colors">
                                        <div className="flex flex-col w-full gap-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className="admin-activity-dot mt-1"
                                                        style={{ background: STATUS_COLORS[inquiry.status] || '#71717a' }}
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-lg mb-1">{inquiry.name} <span className="text-sm font-normal text-[var(--text-muted)] ml-2">({inquiry.email})</span></h4>
                                                        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                                                            <span className="flex items-center gap-1"><Building size={14} /> {inquiry.company}</span>
                                                            <span className="flex items-center gap-1"><Clock size={14} /> {inquiry.createdAt?.toDate().toLocaleDateString() || 'Recent'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border border-[var(--border-color)] bg-[rgba(0,0,0,0.2)] rounded px-2">
                                                        <DollarSign size={14} className="text-[var(--text-muted)]" />
                                                        <input
                                                            type="text"
                                                            placeholder="Deal Value"
                                                            defaultValue={inquiry.value || ''}
                                                            onBlur={(e) => handleValueChange(inquiry.id, e.target.value)}
                                                            className="bg-transparent border-none text-sm w-24 py-1 px-2 focus:outline-none text-white"
                                                        />
                                                    </div>
                                                    <select
                                                        value={inquiry.status}
                                                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                                                        className="bg-[rgba(0,0,0,0.3)] border border-[var(--border-color)] text-xs rounded px-2 py-1 focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                                                        style={{ color: STATUS_COLORS[inquiry.status] }}
                                                    >
                                                        <option value="unread">Unread</option>
                                                        <option value="read">Read</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="negotiating">Negotiating</option>
                                                        <option value="won">Won / Converted</option>
                                                        <option value="lost">Lost</option>
                                                        <option value="archived">Archived</option>
                                                    </select>
                                                </div>
                                                {inquiry.status === 'won' && (
                                                    <button
                                                        onClick={() => handleConvertToProject(inquiry)}
                                                        disabled={convertingId === inquiry.id}
                                                        className="admin-btn-primary ml-2 flex items-center gap-2 px-3 py-1 text-xs h-auto"
                                                    >
                                                        <CheckCircle size={14} />
                                                        {convertingId === inquiry.id ? 'Converting...' : 'Accept & Convert'}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="bg-[rgba(0,0,0,0.2)] p-4 rounded border border-[var(--border-color)]">
                                                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap font-mono relative pl-4 border-l-2 border-[var(--accent-cyan)]">
                                                    {inquiry.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
