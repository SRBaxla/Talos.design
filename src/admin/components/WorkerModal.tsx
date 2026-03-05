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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                    <h2 className="font-display font-bold text-lg">{worker ? 'Edit Worker' : 'New Worker'}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-white rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded flex items-start gap-2 text-red-400 text-sm">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form id="worker-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-sm focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all placeholder:text-[var(--border-color)]"
                                placeholder="Jane Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-sm focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all placeholder:text-[var(--border-color)]"
                                placeholder="jane@talos.design"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">Role</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value as WorkerRole)}
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-sm focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="developer">Developer</option>
                                <option value="designer">Designer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">Department</label>
                            <input
                                type="text"
                                value={department}
                                onChange={e => setDepartment(e.target.value)}
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-sm focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all placeholder:text-[var(--border-color)]"
                                placeholder="E.g. Engineering, Design, Management"
                                required
                            />
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-[var(--border-color)] flex justify-end gap-3 bg-[var(--bg-surface)] rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="worker-form"
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
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
