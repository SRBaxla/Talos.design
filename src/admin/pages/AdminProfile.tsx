import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useActivityLogs, addActivityLog } from '../store/adminStore';
import type { Worker, WorkerPreferences } from '../store/adminStore';
import {
    Save,
    CheckCircle,
    AlertCircle,
    Clock,
    Shield,
    Activity,
    User,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Twitter,
    Github,
    Bell,
    Palette,
    Copy,
    Check,
    Layout,
} from 'lucide-react';
import AdminBadge from '../components/AdminBadge';

const AVATAR_COLORS = [
    { id: 'orange', label: 'Talos Orange', class: 'from-amber-500 to-orange-600', ring: 'ring-orange-500' },
    { id: 'cyan', label: 'Electric Cyan', class: 'from-cyan-400 to-blue-600', ring: 'ring-cyan-400' },
    { id: 'emerald', label: 'Emerald Matrix', class: 'from-emerald-400 to-teal-600', ring: 'ring-emerald-500' },
    { id: 'purple', label: 'Royal Violet', class: 'from-purple-500 to-indigo-600', ring: 'ring-purple-500' },
    { id: 'rose', label: 'Crimson Rose', class: 'from-rose-400 to-pink-600', ring: 'ring-rose-500' },
    { id: 'slate', label: 'Midnight Slate', class: 'from-slate-600 to-zinc-800', ring: 'ring-slate-400' },
];

export default function AdminProfile() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [worker, setWorker] = useState<Worker | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedUid, setCopiedUid] = useState(false);

    // Editable fields
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [avatarColor, setAvatarColor] = useState('orange');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Social Links
    const [linkedin, setLinkedin] = useState('');
    const [twitter, setTwitter] = useState('');
    const [github, setGithub] = useState('');
    const [website, setWebsite] = useState('');

    // Preferences
    const [preferences, setPreferences] = useState<WorkerPreferences>({
        notifyOnNewInquiry: true,
        notifyOnNewLead: true,
        notifyOnTicketAssigned: true,
        notifyOnComments: true,
        themePreference: 'dark',
        defaultLandingPage: '/admin',
        accentColor: 'orange',
    });

    // Fetch worker record or fallback to user record
    useEffect(() => {
        async function fetchProfile() {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                // 1. Try fetching from workers collection
                const q = query(collection(db, 'workers'), where('uid', '==', currentUser.uid));
                const snap = await getDocs(q);

                if (!snap.empty) {
                    const docItem = snap.docs[0];
                    const w = { id: docItem.id, ...docItem.data() } as Worker;
                    setWorker(w);
                    setName(w.name || currentUser.displayName || '');
                    setDepartment(w.department || 'CEO & Founder');
                    setPhone(w.phone || '');
                    setBio(w.bio || '');
                    setLocation(w.location || '');
                    setAvatarColor(w.avatarColor || 'orange');
                    setAvatarUrl(w.avatarUrl || currentUser.photoURL || '');
                    if (w.socialLinks) {
                        setLinkedin(w.socialLinks.linkedin || '');
                        setTwitter(w.socialLinks.twitter || '');
                        setGithub(w.socialLinks.github || '');
                        setWebsite(w.socialLinks.website || '');
                    }
                    if (w.preferences) {
                        setPreferences(prev => ({ ...prev, ...w.preferences }));
                    }
                } else {
                    // Fallback to Firebase user data
                    setName(currentUser.displayName || currentUser.email?.split('@')[0] || '');
                    setDepartment('CEO & Founder');
                    setAvatarUrl(currentUser.photoURL || '');
                }
            } catch (err) {
                console.error('Error fetching worker profile:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [currentUser]);

    const { logs } = useActivityLogs(currentUser?.uid);

    const handleCopyUid = () => {
        if (!currentUser?.uid) return;
        navigator.clipboard.writeText(currentUser.uid);
        setCopiedUid(true);
        setTimeout(() => setCopiedUid(false), 2000);
    };

    const handleSave = async () => {
        if (!currentUser) return;
        setSaving(true);
        setSaved(false);
        setError(null);

        const profilePayload = {
            uid: currentUser.uid,
            name: name.trim() || currentUser.email?.split('@')[0] || 'Administrator',
            email: currentUser.email || '',
            department: department.trim() || 'Administrator',
            phone: phone.trim(),
            bio: bio.trim(),
            location: location.trim(),
            avatarColor,
            avatarUrl: avatarUrl.trim(),
            socialLinks: {
                linkedin: linkedin.trim(),
                twitter: twitter.trim(),
                github: github.trim(),
                website: website.trim(),
            },
            preferences,
            updatedAt: serverTimestamp(),
        };

        try {
            // 1. Update Firebase Auth Profile
            try {
                await updateProfile(currentUser, {
                    displayName: profilePayload.name,
                    photoURL: profilePayload.avatarUrl || undefined,
                });
            } catch (authErr) {
                console.warn('Auth profile update error (non-fatal):', authErr);
            }

            // 2. Update or Create in 'workers' collection
            if (worker?.id) {
                await updateDoc(doc(db, 'workers', worker.id), profilePayload);
            } else {
                const docRef = await addDoc(collection(db, 'workers'), {
                    ...profilePayload,
                    role: 'admin',
                    createdAt: serverTimestamp(),
                });
                setWorker({
                    id: docRef.id,
                    ...profilePayload,
                    role: 'admin',
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                } as Worker);
            }

            // 3. Sync with 'users' collection
            await setDoc(doc(db, 'users', currentUser.uid), {
                displayName: profilePayload.name,
                email: currentUser.email,
                phone: profilePayload.phone,
                bio: profilePayload.bio,
                role: 'admin',
                updatedAt: serverTimestamp(),
            }, { merge: true });

            // 4. Log the activity event
            try {
                await addActivityLog({
                    workerUid: currentUser.uid,
                    action: 'profile_updated',
                    description: `Updated profile details (${profilePayload.name})`,
                });
            } catch (logErr) {
                console.warn('Log activity error (non-fatal):', logErr);
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3500);
        } catch (err: any) {
            console.error('Error saving profile:', err);
            setError(err.message || 'Failed to save profile changes to database.');
        } finally {
            setSaving(false);
        }
    };

    const activeColorObj = AVATAR_COLORS.find(c => c.id === avatarColor) || AVATAR_COLORS[0];

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
            <header className="flex-none border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6 md:px-10 py-5">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] tracking-tight">Admin Profile & Preferences</h1>
                            <AdminBadge status="active" label="Verified" size="xs" />
                        </div>
                        <p className="text-xs text-[var(--text-muted)] font-mono">Customize executive identity, alerts, and database preferences</p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 bg-[var(--accent-orange)] text-white hover:bg-[var(--accent-orange-hover)] font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Alert Notifications */}
                    {saved && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in">
                            <CheckCircle size={18} className="shrink-0" />
                            <p className="text-sm font-bold">Profile customizations saved successfully to Firestore database!</p>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center gap-3 animate-in fade-in">
                            <AlertCircle size={18} className="shrink-0" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {/* Hero Identity Banner */}
                    <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
                        {/* Dynamic Top Banner */}
                        <div className={`h-32 bg-gradient-to-r ${activeColorObj.class} opacity-90 relative transition-all duration-300`}>
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-mono border border-white/10">
                                <Shield size={13} className="text-[var(--accent-orange)]" />
                                <span>{worker?.role ? worker.role.toUpperCase() : 'ADMIN ACCESS'}</span>
                            </div>
                        </div>

                        <div className="px-6 md:px-8 pb-8 pt-0 relative">
                            {/* Avatar & Header Info */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                    {/* Floating Avatar (only avatar has negative top margin) */}
                                    <div className="relative group shrink-0 -mt-12">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt="Avatar"
                                                className="w-24 h-24 rounded-2xl object-cover border-4 border-[var(--bg-surface-elevated)] shadow-xl bg-[var(--bg-base)]"
                                                onError={() => setAvatarUrl('')}
                                            />
                                        ) : (
                                            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${activeColorObj.class} border-4 border-[var(--bg-surface-elevated)] flex items-center justify-center text-white font-bold text-3xl shadow-xl uppercase`}>
                                                {name ? name.charAt(0) : currentUser?.email?.charAt(0) || 'A'}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-[var(--bg-surface-elevated)]" title="Active Admin" />
                                    </div>

                                    {/* Name & Department cleanly positioned inside single-color surface */}
                                    <div className="space-y-1 pt-1 sm:pt-3">
                                        <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] tracking-tight">
                                            {name || 'Administrator'}
                                        </h2>
                                        <p className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-2">
                                            <span className="font-bold text-[var(--accent-orange)]">{department || 'CEO & Founder'}</span>
                                            {location && (
                                                <>
                                                    <span className="text-[var(--border-color-light)]">•</span>
                                                    <span className="flex items-center gap-1 text-[var(--text-muted)]"><MapPin size={11} /> {location}</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 sm:pt-3">
                                    <AdminBadge priority="urgent" label="Admin Master" />
                                    <AdminBadge status="published" label="Production Live" />
                                </div>
                            </div>

                            {/* Bio / Summary Quote */}
                            {bio && (
                                <p className="text-xs md:text-sm text-[var(--text-secondary)] italic leading-relaxed p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] mb-6">
                                    "{bio}"
                                </p>
                            )}

                            {/* Avatar Theme Selector */}
                            <div className="pt-2 border-t border-[var(--border-color)]">
                                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                                    <Palette size={13} className="text-[var(--accent-orange)]" />
                                    Avatar Color Theme & Gradient
                                </label>
                                <div className="flex flex-wrap items-center gap-3">
                                    {AVATAR_COLORS.map(c => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setAvatarColor(c.id)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                                                avatarColor === c.id
                                                    ? 'bg-[var(--bg-base)] border-[var(--accent-orange)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--accent-orange)]'
                                                    : 'bg-[var(--bg-base)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--border-color-light)] hover:text-[var(--text-primary)]'
                                            }`}
                                        >
                                            <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${c.class}`} />
                                            <span>{c.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Executive Identity Details */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-color)]">
                            <User size={18} className="text-[var(--accent-orange)]" />
                            <div>
                                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Personal & Executive Identity</h3>
                                <p className="text-xs text-[var(--text-muted)] font-mono">This information appears on team rosters, assigned projects, and client activity</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5">
                                    Full Display Name <span className="text-[var(--accent-orange)]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all font-medium"
                                    placeholder="E.g. Sudeep Baxla"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5">
                                    Executive Title / Role <span className="text-[var(--accent-orange)]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={department}
                                    onChange={e => setDepartment(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all font-medium"
                                    placeholder="E.g. CEO & Founder / Design Director"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                                    <Phone size={12} className="text-[var(--accent-orange)]" /> Direct Phone / WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all font-mono"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                                    <MapPin size={12} className="text-[var(--accent-orange)]" /> Operating Location & Timezone
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all font-medium"
                                    placeholder="E.g. Bengaluru, India (IST)"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5">
                                    Custom Avatar Image URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={avatarUrl}
                                    onChange={e => setAvatarUrl(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all font-mono"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5">
                                    Professional Bio & Manifesto
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    rows={3}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all leading-relaxed custom-scrollbar font-medium"
                                    placeholder="Brief introduction, expertise areas, or agency leadership notes..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Social & Portfolio Links */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-color)]">
                            <Globe size={18} className="text-[var(--accent-cyan)]" />
                            <div>
                                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Social & Professional Channels</h3>
                                <p className="text-xs text-[var(--text-muted)] font-mono">Connect your public developer & designer channels</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                                    <Linkedin size={13} className="text-[#0a66c2]" /> LinkedIn Profile
                                </label>
                                <input
                                    type="url"
                                    value={linkedin}
                                    onChange={e => setLinkedin(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] outline-none transition-all font-mono"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                                    <Twitter size={13} className="text-[#1da1f2]" /> Twitter / X Profile
                                </label>
                                <input
                                    type="text"
                                    value={twitter}
                                    onChange={e => setTwitter(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] outline-none transition-all font-mono"
                                    placeholder="@handle or https://x.com/..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                                    <Github size={13} className="text-[var(--text-primary)]" /> GitHub Profile
                                </label>
                                <input
                                    type="url"
                                    value={github}
                                    onChange={e => setGithub(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] outline-none transition-all font-mono"
                                    placeholder="https://github.com/username"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                                    <Globe size={13} className="text-emerald-500" /> Personal Website / Portfolio
                                </label>
                                <input
                                    type="url"
                                    value={website}
                                    onChange={e => setWebsite(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] outline-none transition-all font-mono"
                                    placeholder="https://talos.design"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Notification & Admin Workflows */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-color)]">
                            <Bell size={18} className="text-amber-500" />
                            <div>
                                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Admin Alerts & Automation Preferences</h3>
                                <p className="text-xs text-[var(--text-muted)] font-mono">Control automated notifications and interface defaults</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                                <div>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">New Contact Inquiries (CRM)</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-medium">Receive real-time alerts when prospective clients submit contact inquiries</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifyOnNewInquiry !== false}
                                    onChange={e => setPreferences({ ...preferences, notifyOnNewInquiry: e.target.checked })}
                                    className="w-5 h-5 accent-[var(--accent-orange)] rounded cursor-pointer shrink-0"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                                <div>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">Automated Lead Discovery Alerts</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-medium">Get notified when new scraper leads and high-scoring outreach prospects are stored</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifyOnNewLead !== false}
                                    onChange={e => setPreferences({ ...preferences, notifyOnNewLead: e.target.checked })}
                                    className="w-5 h-5 accent-[var(--accent-orange)] rounded cursor-pointer shrink-0"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                                <div>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">Project & Ticket Assignments</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-medium">Receive updates when tasks, sprints, or deliverables are assigned to you</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifyOnTicketAssigned !== false}
                                    onChange={e => setPreferences({ ...preferences, notifyOnTicketAssigned: e.target.checked })}
                                    className="w-5 h-5 accent-[var(--accent-orange)] rounded cursor-pointer shrink-0"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                                <div>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">Reader Insight Comments</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-medium">Alerts for pending user discussions awaiting moderation on published briefs</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifyOnComments !== false}
                                    onChange={e => setPreferences({ ...preferences, notifyOnComments: e.target.checked })}
                                    className="w-5 h-5 accent-[var(--accent-orange)] rounded cursor-pointer shrink-0"
                                />
                            </div>

                            <div className="pt-2">
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
                                    <Layout size={13} className="text-[var(--accent-orange)]" />
                                    Default Admin Landing View
                                </label>
                                <select
                                    value={preferences.defaultLandingPage || '/admin'}
                                    onChange={e => setPreferences({ ...preferences, defaultLandingPage: e.target.value })}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none font-medium cursor-pointer"
                                >
                                    <option value="/admin">Executive Dashboard Overview (/admin)</option>
                                    <option value="/admin/inquiries">Inquiries CRM Inbox (/admin/inquiries)</option>
                                    <option value="/admin/leads">Leads & Automated Outreach (/admin/leads)</option>
                                    <option value="/admin/projects">Client Projects Matrix (/admin/projects)</option>
                                    <option value="/admin/insights">Insights Knowledge Base (/admin/insights)</option>
                                    <option value="/admin/invoices">Financial Billing & Invoices (/admin/invoices)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Security & System Credentials */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-color)]">
                            <Shield size={18} className="text-emerald-500" />
                            <div>
                                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">System Authentication & Credentials</h3>
                                <p className="text-xs text-[var(--text-muted)] font-mono">Immutable cryptographic identifiers managed by Google Firebase</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5">
                                    Firebase Auth UID
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-muted)] font-mono truncate select-all">
                                        {currentUser?.uid || '—'}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyUid}
                                        className="px-3 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--accent-orange)] rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--accent-orange)] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                                        title="Copy UID"
                                    >
                                        {copiedUid ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        <span className="hidden sm:inline font-mono">{copiedUid ? 'Copied' : 'Copy'}</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1.5">
                                    Registered Email Address
                                </label>
                                <div className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-muted)] font-mono truncate">
                                    {currentUser?.email || '—'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Save Action Bar */}
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] shadow-md">
                        <div>
                            <p className="text-sm font-bold text-[var(--text-primary)]">Ready to apply changes?</p>
                            <p className="text-xs text-[var(--text-muted)] font-mono">Updates sync immediately across all active team sessions</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-[var(--accent-orange)] text-white hover:bg-[var(--accent-orange-hover)] font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Section 5: Real-time Activity Timeline */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity size={16} className="text-[var(--accent-orange)]" />
                                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--text-primary)]">Account Activity Audit Log</h3>
                            </div>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[rgba(255,255,255,0.05)] px-2.5 py-1 rounded-full border border-[var(--border-color)]">
                                {logs.length} logged actions
                            </span>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar divide-y divide-[var(--border-color)]">
                            {logs.length === 0 ? (
                                <div className="p-8 text-center text-[var(--text-muted)]">
                                    <Clock size={24} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-sm font-mono">No logged activity recorded for this session yet.</p>
                                </div>
                            ) : (
                                logs.slice(0, 10).map((log) => {
                                    const date = log.timestamp?.toDate() || new Date();
                                    const isRecent = (Date.now() - date.getTime()) < 24 * 60 * 60 * 1000;
                                    return (
                                        <div key={log.id} className="p-4 hover:bg-[var(--bg-base)] transition-colors flex items-start gap-3">
                                            <div className="mt-1">
                                                <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_6px_var(--accent-orange)]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-[var(--text-primary)] font-medium truncate">{log.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded border border-[var(--border-color)]">
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
