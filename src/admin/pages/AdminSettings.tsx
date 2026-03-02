import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Download, Upload, Trash2, Shield } from 'lucide-react';

export default function AdminSettings() {
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState('');

    const handleExport = async () => {
        try {
            const projectsSnap = await getDocs(collection(db, 'projects'));
            const studiesSnap = await getDocs(collection(db, 'caseStudies'));

            const data = {
                exportDate: new Date().toISOString(),
                projects: projectsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
                caseStudies: studiesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `talos-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            setMessage('Data exported successfully!');
        } catch {
            setMessage('Export failed. Please try again.');
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const { addDoc, collection: col, Timestamp } = await import('firebase/firestore');

            if (data.projects) {
                for (const p of data.projects) {
                    const { id, ...rest } = p;
                    void id;
                    await addDoc(col(db, 'projects'), {
                        ...rest,
                        createdAt: rest.createdAt || Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    });
                }
            }

            if (data.caseStudies) {
                for (const s of data.caseStudies) {
                    const { id, ...rest } = s;
                    void id;
                    await addDoc(col(db, 'caseStudies'), {
                        ...rest,
                        createdAt: rest.createdAt || Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    });
                }
            }

            setMessage(`Imported ${data.projects?.length || 0} projects and ${data.caseStudies?.length || 0} case studies.`);
        } catch {
            setMessage('Import failed. Please check the file format.');
        } finally {
            setImporting(false);
            e.target.value = '';
        }
    };

    const handleClearAll = async () => {
        if (
            !window.confirm(
                'Are you absolutely sure? This will delete ALL projects and case studies. This cannot be undone.'
            )
        )
            return;

        if (!window.confirm('Final confirmation: DELETE everything?')) return;

        try {
            const { deleteDoc, doc } = await import('firebase/firestore');

            const projectsSnap = await getDocs(collection(db, 'projects'));
            for (const d of projectsSnap.docs) {
                await deleteDoc(doc(db, 'projects', d.id));
            }

            const studiesSnap = await getDocs(collection(db, 'caseStudies'));
            for (const d of studiesSnap.docs) {
                await deleteDoc(doc(db, 'caseStudies', d.id));
            }

            setMessage('All data has been deleted.');
        } catch {
            setMessage('Failed to clear data.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] p-6 md:p-10 w-full max-w-screen-2xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">System Settings</h1>
                <p className="text-[var(--text-secondary)] font-medium">Manage administrative data, backups, and global configurations</p>
            </div>

            {message && (
                <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-lg font-mono text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Data Management */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-[var(--bg-surface-elevated)] bg-opacity-80 backdrop-blur-md border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden relative">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)] relative z-10">
                            <div className="flex items-center gap-2">
                                <Shield size={18} className="text-emerald-400" />
                                <h3 className="font-display font-bold text-white text-base">Data Operations</h3>
                            </div>
                        </div>

                        <div className="p-0 divide-y divide-[var(--border-color)] relative z-10">
                            {/* Export */}
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                                <div>
                                    <h4 className="font-bold text-white text-base">Export Dataset</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                        Download all current project payloads and case study records as a JSON backup archive.
                                    </p>
                                </div>
                                <button
                                    onClick={handleExport}
                                    className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[rgba(255,255,255,0.05)] text-white font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors border border-[rgba(255,255,255,0.1)] shadow-sm"
                                >
                                    <Download size={16} className="text-emerald-400" />
                                    <span>Export JSON</span>
                                </button>
                            </div>

                            {/* Import */}
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                                <div>
                                    <h4 className="font-bold text-white text-base">Import Dataset</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                        Restore projects and case studies from a JSON archive. Operations are additive and will not overwrite existing records.
                                    </p>
                                </div>
                                <label className={`shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors border shadow-sm cursor-pointer
                                    ${importing
                                        ? 'bg-[rgba(255,255,255,0.02)] text-[var(--text-muted)] border-[rgba(255,255,255,0.05)] cursor-wait'
                                        : 'bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.1)]'
                                    }
                                `}>
                                    <Upload size={16} className={importing ? 'text-[var(--text-muted)] animate-bounce' : 'text-blue-400'} />
                                    <span>{importing ? 'Processing...' : 'Import JSON'}</span>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImport}
                                        hidden
                                        disabled={importing}
                                    />
                                </label>
                            </div>

                            {/* Danger Zone */}
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[rgba(239,68,68,0.02)] hover:bg-[rgba(239,68,68,0.05)] transition-colors">
                                <div>
                                    <h4 className="font-bold text-red-400 text-base">Purge Database</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                        Permanently delete all projects and case studies. This action is irreversible and requires confirmation.
                                    </p>
                                </div>
                                <button
                                    onClick={handleClearAll}
                                    className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[rgba(239,68,68,0.1)] text-red-500 font-bold hover:bg-[rgba(239,68,68,0.2)] transition-colors border border-[rgba(239,68,68,0.3)] hover:border-red-500 shadow-sm"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete All</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="xl:col-span-1">
                    <div className="bg-[var(--bg-surface-elevated)] bg-opacity-80 backdrop-blur-md border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-purple-500/5 blur-3xl pointer-events-none" />

                        <div className="p-5 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] relative z-10">
                            <h3 className="font-display font-bold text-white text-base">System Integrity</h3>
                        </div>

                        <div className="p-6 flex flex-col gap-4 relative z-10">
                            <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.05)]">
                                <span className="text-sm text-[var(--text-secondary)]">Module</span>
                                <span className="text-sm font-bold text-white">Talos Control Center</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.05)]">
                                <span className="text-sm text-[var(--text-secondary)]">Build Version</span>
                                <span className="text-sm font-mono text-[var(--accent-orange)]">v2.4.0</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.05)]">
                                <span className="text-sm text-[var(--text-secondary)]">Data Core</span>
                                <span className="text-sm font-bold text-white">Firestore DB</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-[var(--text-secondary)]">Security Protocol</span>
                                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5"><Shield size={12} /> Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
