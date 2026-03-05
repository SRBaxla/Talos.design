import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { updateWorker, useActivityLogs } from '../store/adminStore';
import type { Worker } from '../store/adminStore';
import { Save, CheckCircle, AlertCircle, Clock, Shield, Activity } from 'lucide-react';

export default function AdminProfile() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [worker, setWorker] = useState<Worker | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Editable fields
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');

    // Fetch the worker document by the current user's UID
    useEffect(() => {
        async function fetchWorker() {
            if (!currentUser) { setLoading(false); return; }
            try {
                const q = query(collection(db, 'workers'), where('uid', '==', currentUser.uid));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    const doc = snap.docs[0];
                    const w = { id: doc.id, ...doc.data() } as Worker;
                    setWorker(w);
                    setName(w.name);
                    setDepartment(w.department || '');
                }
            } catch (err) {
                console.error('Error fetching worker profile:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchWorker();
    }, [currentUser]);

    const { logs } = useActivityLogs(currentUser?.uid);

    const handleSave = async () => {
        if (!worker) return;
        setSaving(true);
        setSaved(false);
        setError(null);
        try {
            await updateWorker(worker.id, { name, department });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--accent-orange)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex-none border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-4">
                <h1 className="font-display font-bold text-xl">My Profile</h1>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-1">View and manage your account details</p>
            </header>

            <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* Profile Card */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                        {/* Banner */}
                        <div className="h-24 bg-gradient-to-r from-[var(--accent-orange)]/20 via-[var(--accent-cyan)]/10 to-transparent relative">
                            <div className="absolute bottom-0 left-6 translate-y-1/2 w-16 h-16 rounded-full bg-[var(--bg-card)] border-4 border-[var(--bg-surface)] flex items-center justify-center shadow-lg">
                                <span className="font-display font-bold text-2xl text-[var(--accent-orange)]">
                                    {(worker?.name || currentUser?.email || '?').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="pt-12 px-6 pb-6">
                            {/* Auth Info (read-only) */}
                            <div className="flex items-center gap-2 mb-1">
                                <Shield size={14} className="text-[var(--accent-cyan)]" />
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-cyan)]">
                                    {worker ? 'Worker Account' : 'Admin Account'}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] font-mono mb-6">{currentUser?.email}</p>

                            {worker ? (
                                <div className="space-y-5">
                                    {/* Editable: Name */}
                                    <div>
                                        <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5">Display Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all placeholder:text-[var(--border-color)]"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    {/* Editable: Department */}
                                    <div>
                                        <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5">Department / Role</label>
                                        <input
                                            type="text"
                                            value={department}
                                            onChange={e => setDepartment(e.target.value)}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all placeholder:text-[var(--border-color)]"
                                            placeholder="E.g. Engineering, Design"
                                        />
                                    </div>

                                    {/* Read-only: UID */}
                                    <div>
                                        <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5">Firebase UID</label>
                                        <div className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-muted)] font-mono select-all">
                                            {worker.uid}
                                        </div>
                                    </div>

                                    {/* Read-only: Email */}
                                    <div>
                                        <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5">Email Address</label>
                                        <div className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-muted)]">
                                            {worker.email}
                                            <span className="ml-2 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] opacity-50">(managed by admin)</span>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-5 py-2.5 text-sm bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : (
                                                <>
                                                    <Save size={16} />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        {saved && (
                                            <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                                                <CheckCircle size={14} /> Saved successfully
                                            </span>
                                        )}
                                        {error && (
                                            <span className="text-xs text-red-400 flex items-center gap-1.5">
                                                <AlertCircle size={14} /> {error}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-[var(--text-muted)] bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg p-4">
                                    <p>Your account is not linked to a worker profile yet. Ask an admin to add you to the team.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center gap-2">
                            <Activity size={16} className="text-[var(--accent-orange)]" />
                            <h2 className="font-display font-bold text-base">Recent Activity</h2>
                            <span className="ml-auto text-[10px] font-mono text-[var(--text-muted)] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
                                {logs.length} events
                            </span>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {logs.length === 0 ? (
                                <div className="p-8 text-center text-[var(--text-muted)]">
                                    <Clock size={24} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-sm font-mono">No recent activity</p>
                                </div>
                            ) : (
                                logs.slice(0, 15).map((log) => {
                                    const date = log.timestamp?.toDate() || new Date();
                                    const isRecent = (Date.now() - date.getTime()) < 24 * 60 * 60 * 1000;
                                    return (
                                        <div key={log.id} className="px-6 py-4 border-b border-[var(--border-color)] hover:bg-[rgba(255,255,255,0.02)] transition-colors flex gap-3">
                                            <div className="mt-1.5">
                                                <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_6px_var(--accent-orange)]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white font-medium truncate">{log.description}</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded border border-[var(--border-color)]">
                                                        {log.action.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className={`text-[10px] font-mono ${isRecent ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`}>
                                                        {isRecent ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
