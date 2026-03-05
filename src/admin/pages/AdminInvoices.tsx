import { useState, useRef, useEffect } from 'react';
import type { Invoice, InvoiceItem, Project } from '../store/adminStore';
import { useInvoices, addInvoice, updateInvoice, deleteInvoice, useProjects } from '../store/adminStore';
import { FileText, Plus, Trash2, Edit, FolderKanban, Search, X, Download } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
    'draft': '#71717a',
    'sent': '#3b82f6',
    'paid': '#22c55e',
    'overdue': '#ef4444',
};

export default function AdminInvoices() {
    const { invoices, loading } = useInvoices();
    const { projects } = useProjects();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [projectSearch, setProjectSearch] = useState('');
    const [showProjectResults, setShowProjectResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close search results when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowProjectResults(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const [formState, setFormState] = useState<{
        invoiceNumber: string;
        clientName: string;
        clientEmail: string;
        projectId: string;
        issueDate: string;
        dueDate: string;
        notes: string;
        items: InvoiceItem[];
    }>({
        invoiceNumber: '',
        clientName: '',
        clientEmail: '',
        projectId: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
        items: [{ description: '', quantity: 1, rate: 0 }]
    });

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/10 border-t-accent-orange rounded-full animate-spin" /></div>;
    }

    // Build line items from a project's data
    const buildItemsFromProject = (project: Project): InvoiceItem[] => {
        const items: InvoiceItem[] = [];

        // Base project budget as primary line item
        const budgetNum = parseFloat(project.budget?.replace(/[^0-9.]/g, '') || '0');
        if (budgetNum > 0) {
            items.push({
                description: `${project.title} — Project Development`,
                quantity: 1,
                rate: budgetNum,
            });
        }

        // Add each selected feature as a line item
        if (project.selectedFeatures && project.selectedFeatures.length > 0) {
            project.selectedFeatures.forEach(feature => {
                items.push({
                    description: `Feature: ${feature}`,
                    quantity: 1,
                    rate: 0,
                });
            });
        }

        // Add cost revisions as line items
        if (project.costRevisions && project.costRevisions.length > 0) {
            project.costRevisions.forEach(rev => {
                items.push({
                    description: `Cost Revision: ${rev.reason} (${rev.date})`,
                    quantity: 1,
                    rate: rev.amount,
                });
            });
        }

        // Ensure at least one empty item
        if (items.length === 0) {
            items.push({ description: '', quantity: 1, rate: 0 });
        }

        return items;
    };

    const handleProjectSelect = (projectId: string) => {
        setSelectedProjectId(projectId);
        if (!projectId) {
            // Reset to blank
            setFormState(prev => ({
                ...prev,
                projectId: '',
                clientName: '',
                clientEmail: '',
                items: [{ description: '', quantity: 1, rate: 0 }],
            }));
            return;
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        setFormState(prev => ({
            ...prev,
            projectId: project.id,
            clientName: project.client || '',
            clientEmail: project.clientEmail || '',
            items: buildItemsFromProject(project),
            notes: prev.notes || `Invoice for project: ${project.title}`,
        }));
    };

    const openAddModal = () => {
        setFormState({
            invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
            clientName: '',
            clientEmail: '',
            projectId: '',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: '',
            items: [{ description: '', quantity: 1, rate: 0 }]
        });
        setSelectedProjectId('');
        setEditingInvoice(null);
        setIsAddOpen(true);
    };

    const openEditModal = (invoice: Invoice) => {
        setFormState({
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            projectId: invoice.projectId || '',
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            notes: invoice.notes || '',
            items: invoice.items
        });
        setSelectedProjectId(invoice.projectId || '');
        setEditingInvoice(invoice);
        setIsAddOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingInvoice) {
                await updateInvoice(editingInvoice.id, formState);
            } else {
                await addInvoice({
                    ...formState,
                    status: 'draft',
                });
            }
            setIsAddOpen(false);
        } catch (err) {
            console.error('Failed to save invoice:', err);
        }
    };

    const addItem = () => {
        setFormState({
            ...formState,
            items: [...formState.items, { description: '', quantity: 1, rate: 0 }]
        });
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...formState.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormState({ ...formState, items: newItems });
    };

    const removeItem = (index: number) => {
        const newItems = [...formState.items];
        newItems.splice(index, 1);
        setFormState({ ...formState, items: newItems });
    };

    const calculateTotal = (items: InvoiceItem[]) => {
        return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    };

    const generateInvoicePDF = (invoice: Invoice) => {
        const total = calculateTotal(invoice.items);
        const projectTitle = getProjectTitle(invoice.projectId);
        const statusColor = STATUS_COLORS[invoice.status] || '#fff';

        const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Invoice #${invoice.invoiceNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1a1a1a; padding: 48px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #e5e5e5; }
  .brand h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
  .brand p { color: #888; font-size: 12px; margin-top: 4px; }
  .invoice-meta { text-align: right; }
  .invoice-meta h2 { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: #1a1a1a; }
  .invoice-meta .status { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; margin-top: 8px; color: ${statusColor}; background: ${statusColor}15; border: 1px solid ${statusColor}40; }
  .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
  .details-block h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; font-weight: 600; margin-bottom: 8px; }
  .details-block p { font-size: 14px; line-height: 1.6; }
  .details-block .mono { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead th { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; font-weight: 600; padding: 12px 16px; border-bottom: 2px solid #e5e5e5; text-align: left; }
  thead th:nth-child(2), thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
  tbody td { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
  tbody td:nth-child(2), tbody td:nth-child(3), tbody td:nth-child(4) { text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
  .total-row { display: flex; justify-content: flex-end; padding: 20px 0; border-top: 2px solid #1a1a1a; margin-top: -1px; }
  .total-row .label { font-size: 14px; font-weight: 600; color: #666; margin-right: 32px; padding-top: 4px; }
  .total-row .amount { font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 700; }
  .notes { margin-top: 40px; padding: 20px; background: #fafafa; border-radius: 8px; border: 1px solid #f0f0f0; }
  .notes h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; font-weight: 600; margin-bottom: 8px; }
  .notes p { font-size: 13px; line-height: 1.6; color: #666; }
  .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e5e5; text-align: center; color: #bbb; font-size: 11px; }
  @media print { body { padding: 24px; } @page { margin: 0.5in; } }
</style>
</head><body>
  <div class="header">
    <div class="brand">
      <h1>TALOS.DESIGN</h1>
      <p>Design & Development Studio</p>
    </div>
    <div class="invoice-meta">
      <h2>#${invoice.invoiceNumber}</h2>
      <div class="status">${invoice.status}</div>
    </div>
  </div>

  <div class="details">
    <div class="details-block">
      <h3>Bill To</h3>
      <p><strong>${invoice.clientName}</strong></p>
      ${invoice.clientEmail ? `<p>${invoice.clientEmail}</p>` : ''}
      ${projectTitle ? `<p style="color:#888; margin-top:4px;">Project: ${projectTitle}</p>` : ''}
    </div>
    <div class="details-block" style="text-align:right;">
      <h3>Invoice Details</h3>
      <p>Issue Date: <span class="mono">${invoice.issueDate}</span></p>
      <p>Due Date: <span class="mono">${invoice.dueDate}</span></p>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
    </thead>
    <tbody>
      ${invoice.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>$${item.rate.toFixed(2)}</td>
          <td>$${(item.quantity * item.rate).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="total-row">
    <span class="label">Total Due</span>
    <span class="amount">$${total.toFixed(2)}</span>
  </div>

  ${invoice.notes ? `
    <div class="notes">
      <h3>Notes &amp; Terms</h3>
      <p>${invoice.notes.replace(/\n/g, '<br>')}</p>
    </div>
  ` : ''}

  <div class="footer">
    <p>Thank you for your business — TALOS.DESIGN</p>
  </div>
</body></html>`;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 400);
        }
    };

    // Find linked project title for display
    const getProjectTitle = (projectId?: string) => {
        if (!projectId) return null;
        const p = projects.find(proj => proj.id === projectId);
        return p ? p.title : null;
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] w-full flex flex-col">
            <header className="flex-none border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-xl">Invoices</h1>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">Manage client billing and generated invoices</p>
                </div>
                <button
                    className="bg-white text-black hover:bg-gray-200 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold"
                    onClick={openAddModal}
                >
                    <Plus size={14} /> New Invoice
                </button>
            </header>

            <main className="flex-1 p-6 overflow-x-hidden">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]">
                                <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Invoice</th>
                                <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Project</th>
                                <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider text-right">Amount</th>
                                <th className="px-6 py-4 text-xs font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm">
                                        No invoices generated yet.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.id} className="group hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center shrink-0">
                                                    <FileText size={14} className="text-[var(--accent-orange)]" />
                                                </div>
                                                <span className="font-mono text-sm font-bold text-[var(--text-primary)]">#{invoice.invoiceNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[var(--text-primary)] text-sm">{invoice.clientName}</div>
                                            <div className="text-[11px] text-[var(--text-muted)] mt-1 truncate max-w-[150px]">{invoice.clientEmail || '—'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getProjectTitle(invoice.projectId) ? (
                                                <div className="flex items-center gap-1.5 text-xs text-[var(--accent-cyan)]">
                                                    <FolderKanban size={12} />
                                                    <span className="truncate max-w-[120px]">{getProjectTitle(invoice.projectId)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-[var(--text-muted)]">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-[var(--text-secondary)]">Issued: <span className="font-mono text-[var(--text-primary)]">{invoice.issueDate}</span></div>
                                            <div className="text-[11px] text-[var(--text-muted)] mt-1">Due: <span className="font-mono">{invoice.dueDate}</span></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={invoice.status}
                                                onChange={(e) => updateInvoice(invoice.id, { status: e.target.value as 'draft' | 'sent' | 'paid' | 'overdue' })}
                                                className="bg-transparent text-[11px] font-mono font-bold tracking-wide uppercase focus:outline-none appearance-none cursor-pointer pr-4 hover:opacity-80 transition-opacity border-b border-transparent hover:border-current"
                                                style={{ color: STATUS_COLORS[invoice.status] || '#fff' }}
                                            >
                                                <option className="bg-[#111] text-white" value="draft">Draft</option>
                                                <option className="bg-[#111] text-white" value="sent">Sent</option>
                                                <option className="bg-[#111] text-white" value="paid">Paid</option>
                                                <option className="bg-[#111] text-white" value="overdue">Overdue</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-mono text-sm font-bold">${calculateTotal(invoice.items).toFixed(2)}</div>
                                            <div className="text-[10px] text-[var(--text-muted)] mt-1">{invoice.items.length} item(s)</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => generateInvoicePDF(invoice)}
                                                    className="p-1.5 text-[var(--text-muted)] hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <Download size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(invoice)}
                                                    className="p-1.5 text-[var(--text-muted)] hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                    title="Edit Invoice"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteInvoice(invoice.id)}
                                                    className="p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                                    title="Delete Invoice"
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
            </main>

            {/* Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl custom-scrollbar">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border-color)]">
                            <h2 className="font-display font-bold text-2xl">{editingInvoice ? 'Edit Invoice' : 'Create Invoice'}</h2>
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col gap-8">
                            {/* Project Selector — Type & Search */}
                            <div className="bg-gradient-to-r from-[var(--accent-cyan)]/5 to-transparent border border-[var(--accent-cyan)]/20 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <FolderKanban size={16} className="text-[var(--accent-cyan)]" />
                                    <label className="text-xs font-mono text-[var(--accent-cyan)] uppercase font-bold tracking-wider">Import from Project</label>
                                </div>
                                <div className="relative" ref={searchRef}>
                                    <div className="relative">
                                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            value={projectSearch}
                                            onChange={(e) => {
                                                setProjectSearch(e.target.value);
                                                setShowProjectResults(true);
                                                if (!e.target.value) {
                                                    handleProjectSelect('');
                                                }
                                            }}
                                            onFocus={() => setShowProjectResults(true)}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg pl-10 pr-10 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors placeholder:text-[var(--text-muted)]"
                                            placeholder="Search by project name or client..."
                                        />
                                        {projectSearch && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProjectSearch('');
                                                    handleProjectSelect('');
                                                    setShowProjectResults(false);
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-white rounded transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Results Dropdown */}
                                    {showProjectResults && projectSearch.trim().length > 0 && (() => {
                                        const q = projectSearch.toLowerCase();
                                        const filtered = projects.filter(p => {
                                            const t = (p.title || '').toLowerCase();
                                            const c = (p.client || '').toLowerCase();
                                            const e = (p.clientEmail || '').toLowerCase();
                                            const s = (p.status || '').toLowerCase();
                                            return t.includes(q) || c.includes(q) || e.includes(q) || s.includes(q);
                                        });
                                        return (
                                            <div className="absolute z-50 top-full mt-1 w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-lg shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                                                {filtered.length === 0 ? (
                                                    <div className="px-4 py-6 text-center text-[var(--text-muted)] text-xs font-mono">No projects match your search</div>
                                                ) : (
                                                    filtered.map(p => (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => {
                                                                handleProjectSelect(p.id);
                                                                setProjectSearch(p.title || '');
                                                                setShowProjectResults(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center gap-3 border-b border-[var(--border-color)] last:border-b-0 ${selectedProjectId === p.id ? 'bg-[rgba(0,200,200,0.05)]' : ''}`}
                                                        >
                                                            <div className="w-7 h-7 rounded-lg bg-[rgba(0,200,200,0.1)] flex items-center justify-center shrink-0">
                                                                <FolderKanban size={12} className="text-[var(--accent-cyan)]" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-bold text-white truncate">{p.title}</div>
                                                                <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">{p.client || 'No client'} · {p.status}</div>
                                                            </div>
                                                            {p.budget && (
                                                                <span className="text-[10px] font-mono text-[var(--text-secondary)] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded shrink-0">{p.budget}</span>
                                                            )}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                                {selectedProjectId && (
                                    <p className="text-[11px] text-[var(--accent-cyan)] mt-2 font-mono">
                                        ✓ Client info, budget, and features have been imported from the project.
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Invoice Number</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors font-mono"
                                        value={formState.invoiceNumber}
                                        onChange={(e) => setFormState({ ...formState, invoiceNumber: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Issue Date</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors font-mono"
                                            value={formState.issueDate}
                                            onChange={(e) => setFormState({ ...formState, issueDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Due Date</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors font-mono"
                                            value={formState.dueDate}
                                            onChange={(e) => setFormState({ ...formState, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Client Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                                        value={formState.clientName}
                                        onChange={(e) => setFormState({ ...formState, clientName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Client Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                                        value={formState.clientEmail}
                                        onChange={(e) => setFormState({ ...formState, clientEmail: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="bg-[rgba(255,255,255,0.01)] border border-[var(--border-color)] rounded-xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <label className="block text-sm text-[var(--accent-orange)] uppercase font-bold tracking-wider">Line Items</label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-xs font-bold flex items-center gap-2 text-[var(--text-primary)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Plus size={14} /> Add Item
                                    </button>
                                </div>

                                <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-[var(--text-secondary)] bg-[rgba(255,255,255,0.02)] uppercase tracking-wider font-mono">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Description</th>
                                                <th className="px-4 py-3 font-medium w-24">Qty</th>
                                                <th className="px-4 py-3 font-medium w-32 text-right">Rate ($)</th>
                                                <th className="px-4 py-3 font-medium w-32 text-right">Total ($)</th>
                                                <th className="px-4 py-3 font-medium w-12 text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-color)]">
                                            {formState.items.map((item, index) => (
                                                <tr key={index} className="group hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                                                    <td className="px-2 py-2">
                                                        <input
                                                            required
                                                            type="text"
                                                            className="w-full bg-transparent border border-transparent rounded px-2 py-1.5 focus:outline-none focus:border-[var(--accent-orange)] focus:bg-[rgba(255,255,255,0.02)] transition-colors"
                                                            value={item.description}
                                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                            placeholder="Item description"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <input
                                                            required
                                                            type="number"
                                                            min="1"
                                                            className="w-full bg-transparent border border-transparent rounded px-2 py-1.5 focus:outline-none focus:border-[var(--accent-orange)] focus:bg-[rgba(255,255,255,0.02)] transition-colors text-center font-mono"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <input
                                                            required
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="w-full bg-transparent border border-transparent rounded px-2 py-1.5 focus:outline-none focus:border-[var(--accent-orange)] focus:bg-[rgba(255,255,255,0.02)] transition-colors text-right font-mono"
                                                            value={item.rate}
                                                            onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-[var(--text-secondary)] font-mono">
                                                        {(item.quantity * item.rate).toFixed(2)}
                                                    </td>
                                                    <td className="px-2 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-right mt-6 text-xl font-bold font-mono">
                                    Total: <span className="text-[var(--accent-orange)] ml-4">${calculateTotal(formState.items).toFixed(2)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Notes / Terms</label>
                                <textarea
                                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors min-h-[100px] resize-y custom-scrollbar"
                                    value={formState.notes}
                                    onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                                    placeholder="Internal notes or terms... e.g., Net 30, Please pay via wire transfer"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-6 mt-2 border-t border-[var(--border-color)]">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="px-6 py-2.5 rounded-lg font-bold text-sm text-[var(--text-secondary)] hover:text-white bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg font-bold text-sm bg-white text-black hover:bg-gray-200 transition-colors"
                                >
                                    Save Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
