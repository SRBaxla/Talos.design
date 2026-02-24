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
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Settings</h1>
                    <p className="admin-page-subtitle">Manage admin data and configurations</p>
                </div>
            </div>

            {message && (
                <div className="admin-message">{message}</div>
            )}

            <div className="admin-settings-grid">
                {/* Data Management */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <Shield size={16} className="text-[var(--accent-orange)]" />
                            <h3>Data Management</h3>
                        </div>
                    </div>
                    <div className="admin-card-body admin-settings-section">
                        <div className="admin-setting-item">
                            <div>
                                <h4 className="admin-setting-title">Export Data</h4>
                                <p className="admin-setting-desc">
                                    Download all projects and case studies as a JSON backup file.
                                </p>
                            </div>
                            <button className="admin-btn-secondary" onClick={handleExport}>
                                <Download size={16} /> Export JSON
                            </button>
                        </div>

                        <div className="admin-setting-item">
                            <div>
                                <h4 className="admin-setting-title">Import Data</h4>
                                <p className="admin-setting-desc">
                                    Import projects and case studies from a JSON backup file. This will add new records (not overwrite).
                                </p>
                            </div>
                            <label className="admin-btn-secondary admin-file-btn">
                                <Upload size={16} /> {importing ? 'Importing...' : 'Import JSON'}
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    hidden
                                    disabled={importing}
                                />
                            </label>
                        </div>

                        <div className="admin-setting-item admin-setting-danger">
                            <div>
                                <h4 className="admin-setting-title">Clear All Data</h4>
                                <p className="admin-setting-desc">
                                    Permanently delete all projects and case studies. This cannot be undone.
                                </p>
                            </div>
                            <button className="admin-btn-danger" onClick={handleClearAll}>
                                <Trash2 size={16} /> Delete Everything
                            </button>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <h3>About</h3>
                        </div>
                    </div>
                    <div className="admin-card-body admin-settings-section">
                        <div className="admin-about-info">
                            <div className="admin-about-row">
                                <span className="admin-about-label">App</span>
                                <span>Talos Admin Panel</span>
                            </div>
                            <div className="admin-about-row">
                                <span className="admin-about-label">Version</span>
                                <span>1.0.0</span>
                            </div>
                            <div className="admin-about-row">
                                <span className="admin-about-label">Backend</span>
                                <span>Firebase Firestore</span>
                            </div>
                            <div className="admin-about-row">
                                <span className="admin-about-label">Auth</span>
                                <span>Firebase Authentication</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
