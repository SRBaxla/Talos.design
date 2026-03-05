import { useState } from 'react';
import { useWorkers } from '../store/adminStore';
import type { Worker } from '../store/adminStore';
import { Plus, Settings, Activity } from 'lucide-react';
import WorkerModal from '../components/WorkerModal';
import ActivityLogModal from '../components/ActivityLogModal';

export default function AdminTeam() {
    const { workers, loading } = useWorkers();
    const [modalOpen, setModalOpen] = useState(false);
    const [editWorker, setEditWorker] = useState<Worker | null>(null);
    const [logWorker, setLogWorker] = useState<Worker | null>(null);

    const handleEdit = (worker: Worker) => {
        setEditWorker(worker);
        setModalOpen(true);
    };

    const handleNew = () => {
        setEditWorker(null);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditWorker(null);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/10 border-t-accent-orange rounded-full animate-spin" /></div>;
    }

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex-none border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-xl">Team Members</h1>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">Manage workers, roles, and view activity logs</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-white text-black hover:bg-gray-200 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold"
                        onClick={handleNew}
                    >
                        <Plus size={14} /> Add Worker
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workers.map(worker => (
                        <div key={worker.id} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-white">{worker.name}</h3>
                                    <p className="text-xs text-[var(--text-muted)] font-mono">{worker.department}</p>
                                </div>
                                <button
                                    onClick={() => handleEdit(worker)}
                                    className="p-2 text-[var(--text-muted)] hover:text-white bg-black/20 hover:bg-black/40 rounded-lg transition-colors"
                                >
                                    <Settings size={16} />
                                </button>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                                    <span className="text-[var(--text-muted)]">Email</span>
                                    <span className="text-white truncate max-w-[150px]" title={worker.email}>{worker.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs pb-2">
                                    <span className="text-[var(--text-muted)]">Auth UID</span>
                                    <span className="text-white font-mono truncate max-w-[150px]" title={worker.uid}>{worker.uid.substring(0, 8)}...</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex gap-2">
                                <button
                                    onClick={() => setLogWorker(worker)}
                                    className="flex-1 py-2 rounded-lg text-xs font-bold text-[var(--accent-orange)] bg-[var(--accent-orange)]/10 hover:bg-[var(--accent-orange)]/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Activity size={14} />
                                    View Logs
                                </button>
                            </div>
                        </div>
                    ))}
                    {workers.length === 0 && (
                        <div className="col-span-full py-12 text-center text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-xl">
                            <p>No team members found. Add your first worker to get started.</p>
                        </div>
                    )}
                </div>
            </main>

            <WorkerModal open={modalOpen} onClose={handleClose} worker={editWorker} />
            <ActivityLogModal open={!!logWorker} onClose={() => setLogWorker(null)} worker={logWorker} />
        </div>
    );
}
