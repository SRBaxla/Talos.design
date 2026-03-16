import { useState, useEffect } from 'react';
import { addWorker, updateWorker, createWorkerAuth } from '../store/adminStore';
import type { Worker, WorkerRole } from '../store/adminStore';
import { X, Save, AlertCircle } from 'lucide-react';

interface WorkerModalProps {
    open: boolean;
    onClose: () => void;
    worker: Worker | null;
}

export default function WorkerModal({ open, onClose, worker }: WorkerModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<WorkerRole>('developer');
    const [department, setDepartment] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            if (worker) {
                setName(worker.name);
                setEmail(worker.email);
                setRole(worker.role || 'developer');
                setDepartment(worker.department || '');
            } else {
                setName('');
                setEmail('');
                setRole('developer');
                setDepartment('');
            }
            setError(null);
        }
    }, [open, worker]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!name.trim() || !email.trim() || !department.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            if (worker) {
                // When updating, we retain the original UID
                await updateWorker(worker.id, { name, email, role, department });
            } else {
                // When creating, we ping Firebase Functions to create an Auth user and get the fresh UID
                const autoUid = await createWorkerAuth(email, name, department, role);
                await addWorker({ name, email, uid: autoUid, role, department });
            }
            onClose();
        } catch (err: any) {
            console.error('Error saving worker:', err);
            setError(err.message || 'Failed to save worker.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                    <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">{worker ? 'Edit Worker' : 'New Worker'}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded flex items-start gap-2 text-red-400 text-sm">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form id="worker-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1 uppercase tracking-wider">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                                placeholder="Jane Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                                placeholder="jane@talos.design"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1 uppercase tracking-wider">Role</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value as WorkerRole)}
                                className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option className="bg-[var(--bg-surface)]" value="admin">Admin</option>
                                <option className="bg-[var(--bg-surface)]" value="manager">Manager</option>
                                <option className="bg-[var(--bg-surface)]" value="developer">Developer</option>
                                <option className="bg-[var(--bg-surface)]" value="designer">Designer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1 uppercase tracking-wider">Department</label>
                            <input
                                type="text"
                                value={department}
                                onChange={e => setDepartment(e.target.value)}
                                className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                                placeholder="E.g. Engineering, Design, Management"
                                required
                            />
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-[var(--border-color)] flex justify-end gap-3 bg-[var(--bg-base)] rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-bold uppercase tracking-wider"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="worker-form"
                        disabled={loading}
                        className="px-6 py-2 text-sm bg-[var(--accent-cyan)] text-black font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm uppercase tracking-wider"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={16} />
                                Save Worker
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
