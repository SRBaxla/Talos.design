import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, ArrowRight, ArrowLeft, Home, Lock, Eye, EyeOff, CheckCircle, KeyRound } from 'lucide-react';
import {
    emailHasProject, createClientAccount, signInClient,
} from './portalStore';

type Step = 'email' | 'first-login' | 'returning';

export default function PortalLogin() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    /* ── Step 1: check email ──────────────────────────────────── */
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const hasProject = await emailHasProject(email);
            if (!hasProject) {
                setError('No active project found for this email. Contact Talos if you think this is a mistake.');
                setLoading(false);
                return;
            }
            // Try signing in with a dummy password to check if account exists
            try {
                await signInClient(email, '__check_existence__');
                // Won't reach here normally
                setStep('returning');
            } catch (err: any) {
                if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                    setStep('first-login');
                } else if (err.code === 'auth/wrong-password') {
                    setStep('returning');
                } else {
                    // Could be invalid-credential (Firebase v9+), assume first-login
                    setStep('first-login');
                }
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /* ── Step 2a: first login — verify code + create password ── */
    const handleFirstLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!accessCode.trim()) {
            setError('Please enter the access code from your welcome email.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            // Cloud Function verifies access code + creates Firebase Auth user + returns custom token
            await createClientAccount(email, password, accessCode);
            navigate('/portal/dashboard');
        } catch (err: any) {
            console.error(err);
            const msg = err?.message || '';
            if (msg.includes('access code') || msg.includes('Invalid')) {
                setError('Invalid access code. Check the code in your welcome email from Talos.');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    /* ── Step 2b: returning login ─────────────────────────────── */
    const handleReturningLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInClient(email, password);
            navigate('/portal/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Incorrect password. Please try again.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-3"
            >
                {/* Back to Homepage Header */}
                <div className="flex items-center justify-between px-1">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Homepage</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl">

                    {/* Top brand strip */}
                    <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-[rgba(210,193,182,0.08)] rounded-xl border border-[rgba(210,193,182,0.2)]">
                                <Hexagon className="text-[var(--accent-orange)]" size={20} />
                            </div>
                            <div>
                                <div className="font-display font-bold text-sm">Talos.design</div>
                                <div className="text-[10px] text-[var(--text-muted)] font-mono">Client Portal</div>
                            </div>
                        </div>
                        <Link
                            to="/"
                            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-surface-elevated)] transition-all flex items-center gap-1.5"
                            title="Return to Main Website"
                        >
                            <Home size={13} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    </div>

                    <div className="p-8">

                        {/* Step indicator */}
                        <div className="flex items-center gap-2 mb-6">
                            {['email', 'first-login', 'returning'].map((s, i) => {
                                if (s === 'returning' && step === 'first-login') return null;
                                if (s === 'first-login' && step === 'returning') return null;
                                const stepLabels: Record<string, string> = {
                                    email: 'Email',
                                    'first-login': 'Set Password',
                                    returning: 'Password',
                                };
                                const isActive = step === s;
                                const isDone = (step === 'first-login' || step === 'returning') && s === 'email';
                                return (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-full transition-all ${isActive ? 'bg-[rgba(210,193,182,0.12)] text-[var(--accent-orange)] border border-[rgba(210,193,182,0.3)]' : isDone ? 'text-green-500' : 'text-[var(--text-muted)]'}`}>
                                            {isDone ? <CheckCircle size={11} /> : null}
                                            {stepLabels[s]}
                                        </div>
                                        {i < 1 && <ChevronIcon />}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-5"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">

                            {/* ── Step 1: Email ────────────── */}
                            {step === 'email' && (
                                <motion.form
                                    key="email"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleEmailSubmit}
                                    className="space-y-5"
                                >
                                    <div>
                                        <h2 className="text-xl font-display font-bold mb-1">Welcome</h2>
                                        <p className="text-sm text-[var(--text-muted)]">Enter your registered email to continue.</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                        />
                                    </div>
                                    <SubmitButton loading={loading} label="Continue" />
                                </motion.form>
                            )}

                            {/* ── Step 2a: First login ──────── */}
                            {step === 'first-login' && (
                                <motion.form
                                    key="first-login"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleFirstLogin}
                                    className="space-y-5"
                                >
                                    <div>
                                        <h2 className="text-xl font-display font-bold mb-1">Create Your Password</h2>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            First time here! Enter the access code from your welcome email, then set a password.
                                            <span className="block mt-1 text-[var(--accent-orange)] font-mono text-[11px]">{email}</span>
                                        </p>
                                    </div>
                                    {/* Access code */}
                                    <div>
                                        <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">
                                            Access Code
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                value={accessCode}
                                                onChange={e => setAccessCode(e.target.value)}
                                                placeholder="Code from your welcome email"
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                            />
                                            <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                        </div>
                                        <p className="text-[10px] text-[var(--text-muted)] mt-1">Can't find your code? Contact hello@talos.design</p>
                                    </div>
                                    <PasswordInput
                                        label="New Password"
                                        value={password}
                                        onChange={setPassword}
                                        show={showPassword}
                                        onToggle={() => setShowPassword(v => !v)}
                                        placeholder="Min. 8 characters"
                                    />
                                    <PasswordInput
                                        label="Confirm Password"
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                        show={showPassword}
                                        onToggle={() => setShowPassword(v => !v)}
                                        placeholder="Repeat password"
                                    />
                                    <StrengthBar password={password} />
                                    <SubmitButton loading={loading} label="Create Account & Sign In" />
                                    <button type="button" onClick={() => { setStep('email'); setError(''); }} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] w-full text-center">← Back</button>
                                </motion.form>
                            )}

                            {/* ── Step 2b: Returning login ──── */}
                            {step === 'returning' && (
                                <motion.form
                                    key="returning"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleReturningLogin}
                                    className="space-y-5"
                                >
                                    <div>
                                        <h2 className="text-xl font-display font-bold mb-1">Welcome back</h2>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            Enter your password to access your dashboard.
                                            <span className="block mt-1 text-[var(--accent-orange)] font-mono text-[11px]">{email}</span>
                                        </p>
                                    </div>
                                    <PasswordInput
                                        label="Password"
                                        value={password}
                                        onChange={setPassword}
                                        show={showPassword}
                                        onToggle={() => setShowPassword(v => !v)}
                                        placeholder="Your password"
                                    />
                                    <SubmitButton loading={loading} label="Sign In" />
                                    <button type="button" onClick={() => { setStep('email'); setError(''); }} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] w-full text-center">← Use a different email</button>
                                </motion.form>
                            )}

                        </AnimatePresence>
                    </div>

                    <div className="bg-[rgba(0,0,0,0.15)] px-8 py-3 border-t border-[var(--border-color)] flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)]">
                        <Lock size={10} /> Secured connection · Firebase Authentication
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/* ── Small helper components ────────────────────────────────── */
function ChevronIcon() {
    return <ArrowRight size={10} className="text-[var(--text-muted)]" />;
}

function PasswordInput({ label, value, onChange, show, onToggle, placeholder }: {
    label: string; value: string; onChange: (v: string) => void;
    show: boolean; onToggle: () => void; placeholder: string;
}) {
    return (
        <div>
            <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    required
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                />
                <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
}

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

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 flex items-center justify-center gap-2 font-bold shadow-[0_0_20px_var(--accent-orange-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
                <>{label} <ArrowRight size={16} /></>
            )}
        </button>
    );
}
