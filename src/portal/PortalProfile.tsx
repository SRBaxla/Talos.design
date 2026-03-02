import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, User } from 'lucide-react';
import { updatePortalPassword, verifyPortalUser } from './portalStore';

function StrengthBar({ password }: { password: string }) {
    const len = password.length;
    const strength = len === 0 ? 0 : len < 8 ? 1 : len < 12 ? 2 : len < 16 ? 3 : 4;
    const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    if (len === 0) return null;
    return (
        <div className="space-y-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex-1 h-1 rounded-full transition-all" style={{ backgroundColor: s <= strength ? colors[strength] : 'var(--border-color)' }} />
                ))}
            </div>
            <div className="text-[10px] font-mono" style={{ color: colors[strength] }}>{labels[strength]}</div>
        </div>
    );
}

export default function PortalProfile() {
    const navigate = useNavigate();
    const [clientEmail, setClientEmail] = useState<string | null>(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('talosClientEmail');
        if (!email) navigate('/portal');
        else setClientEmail(email);
    }, [navigate]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const valid = await verifyPortalUser(clientEmail!, currentPassword);
            if (!valid) {
                setError('Current password is incorrect.');
                setLoading(false);
                return;
            }
            await updatePortalPassword(clientEmail!, newPassword);
            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            setError('Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-surface)] backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/portal/dashboard')}
                        className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <span className="text-xs font-mono text-[var(--text-muted)]">Profile</span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-12">

                {/* User info card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 mb-6 flex items-center gap-4"
                >
                    <div className="w-14 h-14 rounded-full bg-[rgba(210,193,182,0.1)] border border-[rgba(210,193,182,0.2)] flex items-center justify-center">
                        <User size={24} className="text-[var(--accent-orange)]" />
                    </div>
                    <div>
                        <div className="font-display font-bold">Client Account</div>
                        <div className="text-sm text-[var(--text-muted)] font-mono mt-0.5">{clientEmail}</div>
                    </div>
                </motion.div>

                {/* Change password card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center gap-2">
                        <Lock size={16} className="text-[var(--accent-orange)]" />
                        <h2 className="font-display font-bold">Change Password</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="p-6 space-y-5">

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg flex items-center gap-2"
                            >
                                <CheckCircle size={16} /> Password updated successfully!
                            </motion.div>
                        )}

                        {/* Current password */}
                        <div>
                            <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    required
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    placeholder="Your current password"
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                />
                                <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* New password */}
                        <div>
                            <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    required
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                />
                                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div className="mt-2">
                                <StrengthBar password={newPassword} />
                            </div>
                        </div>

                        {/* Confirm new password */}
                        <div>
                            <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Confirm New Password</label>
                            <input
                                type={showNew ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 flex items-center justify-center gap-2 font-bold shadow-[0_0_20px_var(--accent-orange-glow)] disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Update Password</>
                            )}
                        </button>
                    </form>
                </motion.div>

            </main>
        </div>
    );
}
