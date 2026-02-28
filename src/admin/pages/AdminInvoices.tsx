import { useState } from 'react';
import type { Invoice, InvoiceItem } from '../store/adminStore';
import { useInvoices, addInvoice, updateInvoice, deleteInvoice } from '../store/adminStore';
import { FileText, Plus, Trash2, Edit } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
    'draft': '#71717a',
    'sent': '#3b82f6',
    'paid': '#22c55e',
    'overdue': '#ef4444',
};

export default function AdminInvoices() {
    const { invoices, loading } = useInvoices();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

    const [formState, setFormState] = useState<{
        invoiceNumber: string;
        clientName: string;
        clientEmail: string;
        issueDate: string;
        dueDate: string;
        notes: string;
        items: InvoiceItem[];
    }>({
        invoiceNumber: '',
        clientName: '',
        clientEmail: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
        items: [{ description: '', quantity: 1, rate: 0 }]
    });

    if (loading) {
        return <div className="admin-loading"><div className="admin-spinner" /></div>;
    }

    const openAddModal = () => {
        setFormState({
            invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
            clientName: '',
            clientEmail: '',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: '',
            items: [{ description: '', quantity: 1, rate: 0 }]
        });
        setEditingInvoice(null);
        setIsAddOpen(true);
    };

    const openEditModal = (invoice: Invoice) => {
        setFormState({
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            notes: invoice.notes || '',
            items: invoice.items
        });
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

    return (
        <div className="admin-page relative">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Invoices</h1>
                    <p className="admin-page-subtitle">Manage client billing and generated invoices</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
                    <Plus size={16} /> New Invoice
                </button>
            </div>

            <div className="admin-list">
                {invoices.length === 0 ? (
                    <div className="admin-card-empty">No invoices generated yet</div>
                ) : (
                    invoices.map((invoice) => (
                        <div key={invoice.id} className="admin-list-item flex flex-col md:flex-row gap-4 items-start md:items-center p-4 border border-[var(--border-color)] rounded bg-[rgba(255,255,255,0.02)] mb-4 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
                                    <FileText size={20} className="text-[var(--accent-orange)]" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{invoice.clientName} <span className="text-[var(--text-muted)] font-normal text-sm ml-2">#{invoice.invoiceNumber}</span></h3>
                                    <div className="text-sm text-[var(--text-secondary)] mt-1">
                                        Issued: {invoice.issueDate} • Due: {invoice.dueDate}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="font-mono text-lg font-bold">${calculateTotal(invoice.items).toFixed(2)}</div>
                                    <select
                                        value={invoice.status}
                                        onChange={(e) => updateInvoice(invoice.id, { status: e.target.value as 'draft' | 'sent' | 'paid' | 'overdue' })}
                                        className="bg-transparent border border-[var(--border-color)] text-xs rounded px-2 py-1 mt-1 focus:outline-none"
                                        style={{ color: STATUS_COLORS[invoice.status] }}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="sent">Sent</option>
                                        <option value="paid">Paid</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button className="p-2 border border-[var(--border-color)] rounded hover:bg-[var(--accent-orange)] hover:text-black transition-colors" onClick={() => openEditModal(invoice)}>
                                        <Edit size={16} />
                                    </button>
                                    <button className="p-2 border border-[var(--border-color)] rounded hover:bg-red-500 hover:text-white transition-colors" onClick={() => deleteInvoice(invoice.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6 border-b border-[var(--border-color)] pb-4">
                            <h2 className="text-xl font-bold">{editingInvoice ? 'Edit Invoice' : 'Create Invoice'}</h2>
                            <button onClick={() => setIsAddOpen(false)} className="text-[var(--text-muted)] hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-[var(--text-muted)] uppercase mb-1">Invoice Number</label>
                                    <input required type="text" className="admin-input" value={formState.invoiceNumber} onChange={(e) => setFormState({ ...formState, invoiceNumber: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-[var(--text-muted)] uppercase mb-1">Issue Date</label>
                                        <input required type="date" className="admin-input" value={formState.issueDate} onChange={(e) => setFormState({ ...formState, issueDate: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[var(--text-muted)] uppercase mb-1">Due Date</label>
                                        <input required type="date" className="admin-input" value={formState.dueDate} onChange={(e) => setFormState({ ...formState, dueDate: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-[var(--text-muted)] uppercase mb-1">Client Name</label>
                                    <input required type="text" className="admin-input" value={formState.clientName} onChange={(e) => setFormState({ ...formState, clientName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs text-[var(--text-muted)] uppercase mb-1">Client Email</label>
                                    <input type="email" className="admin-input" value={formState.clientEmail} onChange={(e) => setFormState({ ...formState, clientEmail: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs text-[var(--accent-orange)] uppercase font-bold">Line Items</label>
                                    <button type="button" onClick={addItem} className="text-xs flex items-center gap-1 text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)] px-2 py-1 rounded">
                                        <Plus size={12} /> Add Item
                                    </button>
                                </div>

                                <div className="border border-[var(--border-color)] rounded overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-[var(--text-muted)] bg-[rgba(0,0,0,0.3)] uppercase">
                                            <tr>
                                                <th className="px-4 py-2">Description</th>
                                                <th className="px-4 py-2 w-24">Qty</th>
                                                <th className="px-4 py-2 w-32">Rate ($)</th>
                                                <th className="px-4 py-2 w-32">Total ($)</th>
                                                <th className="px-4 py-2 w-12"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formState.items.map((item, index) => (
                                                <tr key={index} className="border-t border-[var(--border-color)]">
                                                    <td className="px-2 py-2">
                                                        <input required type="text" className="w-full bg-transparent border border-transparent hover:border-[var(--border-color)] px-2 py-1 focus:outline-none" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Item description" />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <input required type="number" min="1" className="w-full bg-transparent border border-transparent hover:border-[var(--border-color)] px-2 py-1 focus:outline-none text-center" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)} />
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <input required type="number" min="0" step="0.01" className="w-full bg-transparent border border-transparent hover:border-[var(--border-color)] px-2 py-1 focus:outline-none text-right" value={item.rate} onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)} />
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-[var(--text-secondary)]">
                                                        {(item.quantity * item.rate).toFixed(2)}
                                                    </td>
                                                    <td className="px-2 py-2 text-center">
                                                        <button type="button" onClick={() => removeItem(index)} className="text-[var(--text-muted)] hover:text-red-500 p-1">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-right mt-4 text-xl font-bold font-mono">
                                    Total: <span className="text-[var(--accent-orange)]">${calculateTotal(formState.items).toFixed(2)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-[var(--text-muted)] uppercase mb-1">Notes / Terms</label>
                                <textarea className="admin-input min-h-[80px]" value={formState.notes} onChange={(e) => setFormState({ ...formState, notes: e.target.value })} placeholder="Internal notes or terms..."></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border border-[var(--border-color)] rounded hover:bg-[rgba(255,255,255,0.05)] text-sm">Cancel</button>
                                <button type="submit" className="admin-btn admin-btn-primary">Save Invoice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
