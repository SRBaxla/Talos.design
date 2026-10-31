import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../admin/firebase/firebaseConfig';
import { getOrCreateUserProfile } from '../../lib/userService';
import { User, Lock, Mail, UserPlus, LogIn, X, AlertCircle, Sparkles } from 'lucide-react';

interface ReaderAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onOpenOnboarding?: () => void;
}

export default function ReaderAuthModal({ isOpen, onClose, onSuccess, onOpenOnboarding }: ReaderAuthModalProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                if (!name.trim()) {
                    setError('Please enter your full name');
                    setLoading(false);
                    return;
                }
                const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
                if (res.user) {
                    await updateProfile(res.user, { displayName: name.trim() });
                    await getOrCreateUserProfile(res.user);
                }
            } else {
                const res = await signInWithEmailAndPassword(auth, email.trim(), password);
                if (res.user) {
                    await getOrCreateUserProfile(res.user);
                }
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Reader Auth Error:', err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password. If you have a Client Portal account, use your existing password.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists. Switch to Sign In.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password must be at least 6 characters.');
            } else {
                setError(err.message || 'Authentication failed.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="glass-panel w-full max-w-md p-6 md:p-8 rounded-3xl border border-[var(--border-color)] relative shadow-2xl space-y-6">
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-all"
                >
                    <X size={18} />
                </button>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest font-bold">
                        {isSignUp ? <UserPlus size={14} /> : <LogIn size={14} />}
                        <span>Reader Portal</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                        {isSignUp ? 'Create Reader Account' : 'Reader Sign In'}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                        {isSignUp
                            ? 'Sign up to post, edit, or manage your comments across all briefings.'
                            : 'Sign in to access your comments and join engineering discussions.'}
                    </p>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Your Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Alex Mercer"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            <input
                                type="email"
                                required
                                placeholder="reader@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-[var(--accent-cyan)] text-black font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent-cyan-glow)] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : isSignUp ? 'Create Account & Sign In' : 'Sign In as Reader'}
                    </button>
                </form>

                <div className="pt-4 border-t border-[var(--border-color)] space-y-3 text-center">
                    <div className="flex items-center justify-between text-xs">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError(null);
                            }}
                            className="text-[var(--accent-cyan)] hover:underline font-semibold"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have a reader account? Register"}
                        </button>
                        
                        {onOpenOnboarding && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onOpenOnboarding();
                                }}
                                className="text-[11px] font-mono text-[var(--accent-orange)] hover:underline flex items-center gap-1"
                            >
                                <Sparkles size={12} />
                                <span>Customize Topics</span>
                            </button>
                        )}
                    </div>

                    <p className="text-[10px] text-[var(--text-muted)] font-mono text-center">
                        Unified Talos ID • Client Portal members can sign in with their existing credentials.
                    </p>
                </div>
            </div>
        </div>
    );
}

