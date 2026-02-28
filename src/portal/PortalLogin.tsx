import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../admin/firebase/firebaseConfig';
import { motion } from 'framer-motion';
import { Hexagon, ArrowRight, Lock } from 'lucide-react';

export default function PortalLogin() {
    const [email, setEmail] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if there is a project with this email
            const q = query(collection(db, 'projects'), where('clientEmail', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Verified: Client exists and has a project
                localStorage.setItem('talosClientEmail', email);

                // For the demo: verify access code is 'talos2025' or length > 5
                if (accessCode.length < 5) {
                    setError('Invalid Access Code. Please use the code provided in your welcome email.');
                } else {
                    navigate('/portal/dashboard');
                }
            } else {
                setError('No active projects found for this email address.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('System error verifying identity. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-shell flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-2xl relative">
                    <div className="p-8">
                        <div className="flex flex-colItems-center justify-center mb-8 text-center">
                            <div className="w-16 h-16 flex items-center justify-center bg-[rgba(0,229,255,0.1)] rounded-full mx-auto mb-4 border border-[rgba(0,229,255,0.2)]">
                                <Hexagon className="text-[var(--accent-cyan)]" size={32} />
                            </div>
                            <h1 className="text-2xl font-display font-bold mb-2">Client Portal</h1>
                            <p className="text-[var(--text-secondary)] text-sm">Access your project dashboard</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded mb-6 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">Registered Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="admin-input"
                                    placeholder="client@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">Access Code</label>
                                <input
                                    type="password"
                                    required
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    className="admin-input"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn bg-[var(--accent-cyan)] text-black hover:bg-[var(--accent-cyan-glow)] border-none py-3 mt-4 flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>Access Dashboard <ArrowRight size={16} /></>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-[rgba(0,0,0,0.2)] p-4 border-t border-[var(--border-color)] flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                        <Lock size={12} /> Secure encrypted connection
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
