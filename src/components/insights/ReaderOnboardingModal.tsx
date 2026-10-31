import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Cpu, Globe, Zap, Bot, Check, ArrowRight, ArrowLeft,
    Sparkles, Mail, Lock, User as UserIcon, X, CheckCircle, ShieldCheck,
    Briefcase, MessageSquare, AlertCircle
} from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../../admin/firebase/firebaseConfig';
import { INSIGHT_TOPICS, getOrCreateUserProfile, saveReaderOnboarding } from '../../lib/userService';
import type { UserProfile, ReaderPreferences } from '../../lib/userService';
import { Link } from 'react-router-dom';

interface ReaderOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialEmail?: string;
    currentUser: User | null;
    onCompleted?: (profile: UserProfile) => void;
}

export default function ReaderOnboardingModal({
    isOpen,
    onClose,
    initialEmail = '',
    currentUser,
    onCompleted
}: ReaderOnboardingModalProps) {
    const [step, setStep] = useState<number>(1);
    const [user, setUser] = useState<User | null>(currentUser);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // Auth Form State (if unauthenticated)
    const [isSignUp, setIsSignUp] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // Preferences State
    const [selectedTopics, setSelectedTopics] = useState<string[]>([
        'ai-agents',
        'logic-pipelines',
        'spatial-design'
    ]);
    const [frequency, setFrequency] = useState<'instant' | 'weekly' | 'monthly'>('weekly');
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [whatsappUpdates, setWhatsappUpdates] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser);
            getOrCreateUserProfile(currentUser).then((profile) => {
                setUserProfile(profile);
                if (profile.readerPreferences?.topics?.length) {
                    setSelectedTopics(profile.readerPreferences.topics);
                    setFrequency(profile.readerPreferences.frequency || 'weekly');
                    setEmailUpdates(profile.readerPreferences.emailUpdates !== false);
                    setWhatsappUpdates(!!profile.readerPreferences.whatsappUpdates);
                    setWhatsappNumber(profile.readerPreferences.whatsappNumber || '');
                }
                // Skip auth step if already logged in
                setStep(2);
            });
        } else {
            if (initialEmail) setEmail(initialEmail);
            setStep(1);
        }
    }, [currentUser, initialEmail, isOpen]);

    if (!isOpen) return null;

    const toggleTopic = (id: string) => {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError(null);

        try {
            let activeUser: User;
            if (isSignUp) {
                if (!name.trim()) {
                    setAuthError('Please enter your full name');
                    setAuthLoading(false);
                    return;
                }
                const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
                activeUser = res.user;
                await updateProfile(activeUser, { displayName: name.trim() });
            } else {
                const res = await signInWithEmailAndPassword(auth, email.trim(), password);
                activeUser = res.user;
            }

            setUser(activeUser);
            const profile = await getOrCreateUserProfile(activeUser);
            setUserProfile(profile);
            setStep(2);
        } catch (err: any) {
            console.error('Onboarding auth error:', err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setAuthError('Invalid email or password. If you have a Client Portal account, enter your existing password.');
            } else if (err.code === 'auth/email-already-in-use') {
                setAuthError('An account with this email already exists. Switch to Sign In.');
            } else if (err.code === 'auth/weak-password') {
                setAuthError('Password must be at least 6 characters.');
            } else {
                setAuthError(err.message || 'Authentication failed.');
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const handleFinishPreferences = async () => {
        if (!user) return;
        setSaving(true);

        const prefs: ReaderPreferences = {
            topics: selectedTopics,
            frequency,
            emailUpdates,
            whatsappUpdates,
            whatsappNumber: (whatsappUpdates && whatsappNumber) ? whatsappNumber.trim() : '',
            onboardingCompleted: true,
        };

        try {
            await saveReaderOnboarding(user.uid, prefs);
            const updated = await getOrCreateUserProfile(user);
            setUserProfile(updated);
            if (onCompleted) onCompleted(updated);
            setStep(4); // Completion celebration & hub
        } catch (err) {
            console.error('Failed to save preferences:', err);
            // Graceful fallback to proceed to activation screen
            setStep(4);
        } finally {
            setSaving(false);
        }
    };

    const getTopicIcon = (iconName: string) => {
        switch (iconName) {
            case 'Brain': return Brain;
            case 'Cpu': return Cpu;
            case 'Globe': return Globe;
            case 'Zap': return Zap;
            case 'Bot': return Bot;
            default: return Sparkles;
        }
    };

    const isClient = userProfile?.roles.includes('client');
    const isAdmin = userProfile?.roles.includes('admin');

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="glass-panel w-full max-w-xl p-6 md:p-10 rounded-[2.5rem] border border-[var(--border-color)] relative shadow-2xl space-y-6 my-8">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-all"
                >
                    <X size={18} />
                </button>

                {/* Header & Step Tracker */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest font-bold">
                            <Sparkles size={14} />
                            <span>Reader Onboarding & Intelligence Hub</span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                            Step {step} of 4
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[#25D366] transition-all duration-300"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* ── STEP 1: AUTHENTICATION / UNIFIED ACCOUNT ── */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                                    {isSignUp ? 'Create Your Reader Account' : 'Sign In with Talos ID'}
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                                    One unified account connects your Reader profile and Client Portal. Clients can sign in using their existing Client Portal credentials.
                                </p>
                            </div>

                            {authError && (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
                                    <AlertCircle size={16} className="shrink-0" />
                                    <span>{authError}</span>
                                </div>
                            )}

                            <form onSubmit={handleAuthSubmit} className="space-y-4">
                                {isSignUp && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Full Name</label>
                                        <div className="relative">
                                            <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Alex Mercer"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Work / Personal Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="lead@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
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
                                            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={authLoading}
                                    className="w-full py-3.5 rounded-xl bg-[var(--accent-cyan)] text-black font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent-cyan-glow)] transition-all disabled:opacity-50"
                                >
                                    {authLoading ? 'Verifying...' : isSignUp ? 'Continue to Topic Selection →' : 'Sign In & Configure Profile →'}
                                </button>
                            </form>

                            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setAuthError(null);
                                    }}
                                    className="text-[var(--accent-cyan)] hover:underline font-semibold"
                                >
                                    {isSignUp ? 'Already registered? Sign In' : "Don't have an account? Register"}
                                </button>
                                <span className="text-[10px] text-[var(--text-muted)] font-mono">Unified Auth</span>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 2: TOPIC SELECTION ── */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                                    Curate Your Technical Focus
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                                    Select the engineering paradigms, AI architectures, and design topics you want prioritized in your briefings.
                                </p>
                            </div>

                            <div className="space-y-2.5">
                                {INSIGHT_TOPICS.map((topic) => {
                                    const IconComponent = getTopicIcon(topic.icon);
                                    const isSelected = selectedTopics.includes(topic.id);

                                    return (
                                        <button
                                            key={topic.id}
                                            type="button"
                                            onClick={() => toggleTopic(topic.id)}
                                            className={`w-full flex items-center justify-between p-3.5 md:p-4 rounded-2xl border transition-all text-left ${
                                                isSelected
                                                    ? 'bg-[rgba(0,229,255,0.08)] border-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,229,255,0.1)]'
                                                    : 'bg-[var(--bg-base)] border-[var(--border-color)] hover:border-[var(--accent-cyan)]/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className={`p-2.5 rounded-xl border ${
                                                    isSelected
                                                        ? 'bg-[var(--accent-cyan)] text-black border-[var(--accent-cyan)]'
                                                        : 'bg-[var(--bg-surface-elevated)] text-[var(--accent-cyan)] border-[var(--border-color)]'
                                                }`}>
                                                    <IconComponent size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-[var(--text-primary)]">{topic.label}</div>
                                                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">{topic.tag} Stream</div>
                                                </div>
                                            </div>

                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                                isSelected
                                                    ? 'bg-[var(--accent-cyan)] border-[var(--accent-cyan)] text-black'
                                                    : 'border-[var(--border-color)]'
                                            }`}>
                                                {isSelected && <Check size={14} strokeWidth={3} />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex gap-3">
                                {currentUser === null && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-4 py-3 rounded-xl border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    disabled={selectedTopics.length === 0}
                                    className="flex-1 py-3.5 rounded-xl bg-[var(--accent-cyan)] text-black font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent-cyan-glow)] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                                >
                                    <span>Configure Delivery ({selectedTopics.length} selected)</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 3: NOTIFICATION & FREQUENCY ── */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                                    Delivery & Notifications
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                                    Choose how and when you receive executive briefs and deep-dives.
                                </p>
                            </div>

                            {/* Frequency Selector */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Dispatch Frequency</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFrequency('weekly')}
                                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                                            frequency === 'weekly'
                                                ? 'bg-[var(--accent-cyan)]/15 border-[var(--accent-cyan)] text-[var(--text-primary)] font-bold'
                                                : 'bg-[var(--bg-base)] border-[var(--border-color)] text-[var(--text-secondary)]'
                                        }`}
                                    >
                                        <div className="text-xs font-bold">Weekly Digest</div>
                                        <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">Every Tuesday morning</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFrequency('instant')}
                                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                                            frequency === 'instant'
                                                ? 'bg-[var(--accent-cyan)]/15 border-[var(--accent-cyan)] text-[var(--text-primary)] font-bold'
                                                : 'bg-[var(--bg-base)] border-[var(--border-color)] text-[var(--text-secondary)]'
                                        }`}
                                    >
                                        <div className="text-xs font-bold">Immediate Drops</div>
                                        <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">As briefs are published</div>
                                    </button>
                                </div>
                            </div>

                            {/* Channel Options */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-[var(--accent-cyan)]" />
                                        <div>
                                            <div className="text-xs font-bold text-[var(--text-primary)]">Email Intelligence Briefs</div>
                                            <div className="text-[10px] text-[var(--text-muted)]">Delivered cleanly to {user?.email || 'your inbox'}</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={emailUpdates}
                                        onChange={(e) => setEmailUpdates(e.target.checked)}
                                        className="w-4 h-4 accent-[var(--accent-cyan)]"
                                    />
                                </div>

                                <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <MessageSquare size={18} className="text-[#25D366]" />
                                            <div>
                                                <div className="text-xs font-bold text-[var(--text-primary)]">WhatsApp VIP Drops (Optional)</div>
                                                <div className="text-[10px] text-[var(--text-muted)]">Direct executive briefing summary link on WhatsApp</div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={whatsappUpdates}
                                            onChange={(e) => setWhatsappUpdates(e.target.checked)}
                                            className="w-4 h-4 accent-[#25D366]"
                                        />
                                    </div>

                                    {whatsappUpdates && (
                                        <input
                                            type="tel"
                                            placeholder="WhatsApp Number (e.g. +1 555-0199)"
                                            value={whatsappNumber}
                                            onChange={(e) => setWhatsappNumber(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#25D366]"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-4 py-3 rounded-xl border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleFinishPreferences}
                                    disabled={saving}
                                    className="flex-1 py-3.5 rounded-xl bg-[var(--accent-cyan)] text-black font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent-cyan-glow)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <span>{saving ? 'Activating Profile...' : 'Complete Reader Activation →'}</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 4: CELEBRATION & ROLE HUB ── */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6 text-center py-2"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-[rgba(0,229,255,0.1)] border border-[var(--accent-cyan)] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                                <CheckCircle size={32} className="text-[var(--accent-cyan)]" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                                    Account Activated
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                                    Welcome, <strong className="text-[var(--text-primary)]">{userProfile?.displayName || user?.email}</strong>. Your account has been synchronized across the Talos ecosystem.
                                </p>
                            </div>

                            {/* Overlappable Roles Hub */}
                            <div className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] text-left space-y-3">
                                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">
                                    Active Permissions on this Account:
                                </div>

                                <div className="space-y-2">
                                    {/* Reader Role */}
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                                        <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)]">
                                            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
                                            <span>Verified Reader</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-[var(--accent-cyan)] font-bold bg-[var(--accent-cyan)]/15 px-2 py-0.5 rounded">
                                            Active
                                        </span>
                                    </div>

                                    {/* Client Role */}
                                    {isClient && (
                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                                            <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)]">
                                                <Briefcase size={14} className="text-[var(--accent-orange)]" />
                                                <span>Client Portal Access</span>
                                            </div>
                                            <Link
                                                to="/portal/dashboard"
                                                onClick={onClose}
                                                className="text-[10px] font-mono text-[var(--accent-orange)] font-bold bg-[var(--accent-orange)]/15 px-2 py-0.5 rounded hover:underline"
                                            >
                                                Open Portal →
                                            </Link>
                                        </div>
                                    )}

                                    {/* Admin Role */}
                                    {isAdmin && (
                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                                            <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)]">
                                                <ShieldCheck size={14} className="text-purple-400" />
                                                <span>Studio Administration</span>
                                            </div>
                                            <Link
                                                to="/admin/insights"
                                                onClick={onClose}
                                                className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/15 px-2 py-0.5 rounded hover:underline"
                                            >
                                                CMS Mode →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3.5 rounded-xl bg-[var(--accent-cyan)] text-black font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent-cyan-glow)] transition-all"
                                >
                                    Explore Technical Briefings →
                                </button>
                                {isClient && (
                                    <Link
                                        to="/portal/dashboard"
                                        onClick={onClose}
                                        className="px-6 py-3.5 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-cyan)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] inline-flex items-center justify-center gap-1.5"
                                    >
                                        Client Portal
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
