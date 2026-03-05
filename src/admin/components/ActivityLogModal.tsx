import { useActivityLogs } from '../store/adminStore';
import type { Worker } from '../store/adminStore';
import { X, Activity } from 'lucide-react';

interface ActivityLogModalProps {
    open: boolean;
    onClose: () => void;
    worker: Worker | null;
}

export default function ActivityLogModal({ open, onClose, worker }: ActivityLogModalProps) {
    const { logs, loading } = useActivityLogs(worker?.uid);

    if (!open || !worker) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
                <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] flex items-center justify-center font-bold uppercase shrink-0">
                            {worker.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-lg text-white">{worker.name}'s Activity</h2>
                            <p className="text-xs text-[var(--text-muted)] font-mono">{worker.department}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-white rounded-lg transition-colors border border-transparent hover:border-[var(--border-color)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="p-8 flex justify-center items-center h-40">
                            <div className="w-6 h-6 border-2 border-[var(--accent-orange)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center text-[var(--text-muted)] text-center h-40">
                            <Activity size={32} className="mb-3 opacity-20" />
                            <p className="font-mono text-sm">No recent activity found.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {logs.map((log) => {
                                const date = log.timestamp?.toDate() || new Date();
                                const isRecent = (Date.now() - date.getTime()) < 24 * 60 * 60 * 1000;
                                return (
                                    <div key={log.id} className="p-5 border-b border-[var(--border-color)] hover:bg-[rgba(255,255,255,0.02)] transition-colors flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange)]"></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start gap-4 mb-1">
                                                <h4 className="font-bold text-sm text-white">{log.description}</h4>
                                                <span className={`text-[10px] font-mono whitespace-nowrap ${isRecent ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`}>
                                                    {isRecent ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded border border-[var(--border-color)]">
                                                    {log.action.replace(/_/g, ' ')}
                                                </span>
                                                {log.referenceType && (
                                                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 px-2 py-0.5 rounded border border-[var(--accent-cyan)]/20">
                                                        {log.referenceType}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-[var(--border-color)] flex justify-end gap-3 bg-[var(--bg-surface)] rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg font-bold transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
