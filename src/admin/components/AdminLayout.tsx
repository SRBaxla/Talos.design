import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    BookOpen,
    Settings,
    LogOut,
    Hexagon,
    PanelLeftClose,
    PanelLeftOpen,
    Home,
    Mail,
    FileText,
    Users,
    Target,
    Sun,
    Moon,
    Sparkles,
    MessageSquare,
    ChevronRight,
} from 'lucide-react';
import AdminAuth from './AdminAuth';
import { useCurrentWorkerRole } from '../store/adminStore';

const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true, adminOnly: false },
    { name: 'Inquiries (CRM)', path: '/admin/inquiries', icon: Mail, end: false, adminOnly: false },
    { name: 'Leads & Outreach', path: '/admin/leads', icon: Target, end: false, adminOnly: false },
    { name: 'Invoices', path: '/admin/invoices', icon: FileText, end: false, adminOnly: false },
    { name: 'Client Projects', path: '/admin/projects', icon: FolderKanban, end: false, adminOnly: false },
    { name: 'Case Studies', path: '/admin/case-studies', icon: BookOpen, end: false, adminOnly: false },
    { name: 'Insights CMS', path: '/admin/insights', icon: Sparkles, end: false, adminOnly: false },
    { name: 'Reader Comments', path: '/admin/comments', icon: MessageSquare, end: false, adminOnly: false },
    { name: 'Team', path: '/admin/team', icon: Users, end: false, adminOnly: true },
    { name: 'Settings', path: '/admin/settings', icon: Settings, end: false, adminOnly: true },
];

export default function AdminLayout() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<{ name?: string; department?: string; avatarColor?: string; avatarUrl?: string } | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { role, isAdmin, isManager, loading: roleLoading } = useCurrentWorkerRole();
    const [isDarkMode, setIsDarkMode] = useState(true);

    // No role set = original admin (show all), or admin/manager = show all
    const canSeeAdminPages = !role || isAdmin || isManager;
    const visibleLinks = sidebarLinks.filter(l => !l.adminOnly || canSeeAdminPages);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setAuthLoading(false);
        });

        // Theme initialization
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('light-theme', !isDark);
        updateMetaThemeColor(isDark);

        return unsub;
    }, []);

    // Listen to real-time worker profile for display name, department and avatar
    useEffect(() => {
        if (!user) {
            setUserProfile(null);
            return;
        }

        const q = query(collection(db, 'workers'), where('uid', '==', user.uid));
        const unsubWorker = onSnapshot(q, (snap) => {
            if (!snap.empty) {
                const data = snap.docs[0].data();
                setUserProfile({
                    name: data.name,
                    department: data.department,
                    avatarColor: data.avatarColor,
                    avatarUrl: data.avatarUrl,
                });
            } else {
                // Fallback to users collection
                const unsubUser = onSnapshot(doc(db, 'users', user.uid), (uSnap) => {
                    if (uSnap.exists()) {
                        const uData = uSnap.data();
                        setUserProfile({
                            name: uData.displayName || uData.name,
                            department: uData.role,
                            avatarUrl: uData.photoURL,
                        });
                    }
                }, (err) => console.warn('User doc read error:', err));
                return () => unsubUser();
            }
        }, (err) => {
            console.warn('Worker snapshot error:', err);
        });

        return () => unsubWorker();
    }, [user]);

    const updateMetaThemeColor = (isDark: boolean) => {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', isDark ? '#0a0f19' : '#ffffff');
    };

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('light-theme', !newMode);
        updateMetaThemeColor(newMode);
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
                <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--accent-orange)] rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <AdminAuth />;
    }

    if (!roleLoading && role === 'client') {
        return <Navigate to="/portal/dashboard" replace />;
    }

    return (
        <div className="flex h-screen w-full bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden selection:bg-[var(--accent-cyan)] selection:text-[var(--text-primary)] font-sans">
            {/* Sidebar */}
            <aside
                className={`
                    flex flex-col h-full bg-[var(--bg-surface-elevated)] border-r border-[var(--border-color)] 
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-40 relative shadow-xl
                    ${sidebarOpen ? 'w-64' : 'w-20'}
                `}
            >
                {/* Decorative glow */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--bg-surface)]/10 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-base)] relative z-10 shrink-0 h-16">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center shadow-inner shrink-0 group">
                                <Hexagon className="text-[var(--accent-orange)] group-hover:scale-110 transition-transform duration-300" size={18} strokeWidth={2.5} />
                            </div>
                            <span className="font-display font-bold text-base tracking-wide text-[var(--text-primary)] whitespace-nowrap">Talos Admin</span>
                        </div>
                    )}
                    <button
                        className={`text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-md hover:bg-[var(--bg-surface-elevated)] ${!sidebarOpen && 'mx-auto'}`}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 relative z-10">
                    {visibleLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) =>
                                `flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 w-full rounded-xl transition-all duration-200 group relative
                                ${isActive
                                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm ring-1 ring-inset ring-[var(--border-color-light)] font-medium'
                                    : 'text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                                }`
                            }
                            title={!sidebarOpen ? link.name : undefined}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && sidebarOpen && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[var(--accent-cyan)] rounded-r-md shadow-[0_0_8px_var(--accent-cyan)]" />
                                    )}
                                    <link.icon
                                        size={20}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={`shrink-0 ${isActive ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors'}`}
                                    />
                                    {sidebarOpen && (
                                        <span className="whitespace-nowrap tracking-wide text-sm">{link.name}</span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-base)] relative z-10 shrink-0 space-y-2">
                    {user && (() => {
                        const displayName = userProfile?.name || user.displayName || user.email?.split('@')[0] || 'Administrator';
                        const displayRole = userProfile?.department || (role ? role.toUpperCase() : 'ADMIN');
                        const initialLetter = displayName.charAt(0).toUpperCase();
                        const gradientClass = (() => {
                            switch (userProfile?.avatarColor) {
                                case 'cyan': return 'from-cyan-400 to-blue-600';
                                case 'emerald': return 'from-emerald-400 to-teal-600';
                                case 'purple': return 'from-purple-500 to-indigo-600';
                                case 'rose': return 'from-rose-400 to-pink-600';
                                case 'slate': return 'from-slate-600 to-zinc-800';
                                case 'orange':
                                default: return 'from-[var(--accent-orange)] to-amber-500';
                            }
                        })();

                        return (
                            <NavLink
                                to="/admin/profile"
                                className={({ isActive }) =>
                                    `group flex items-center ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2'} w-full rounded-xl border transition-all duration-200 shadow-sm mb-2
                                    ${isActive
                                        ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent-orange)] text-[var(--text-primary)] ring-1 ring-[var(--accent-orange)]/30'
                                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--border-color-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`
                                }
                                title={!sidebarOpen ? `${displayName} (${displayRole})` : undefined}
                            >
                                <div className="relative shrink-0">
                                    {userProfile?.avatarUrl ? (
                                        <img
                                            src={userProfile.avatarUrl}
                                            alt={displayName}
                                            className="w-9 h-9 rounded-xl object-cover border border-[var(--border-color)] shadow-md"
                                        />
                                    ) : (
                                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${gradientClass} text-white flex items-center justify-center font-bold text-sm shadow-md uppercase`}>
                                            {initialLetter}
                                        </div>
                                    )}
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-base)]" />
                                </div>

                                {sidebarOpen && (
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-sm font-bold text-[var(--text-primary)] truncate leading-tight">
                                                {displayName}
                                            </p>
                                            <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </div>
                                        <p className="text-[11px] text-[var(--text-muted)] font-mono truncate flex items-center gap-1 mt-0.5">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] shrink-0" />
                                            <span className="font-bold text-[var(--text-secondary)] truncate">{displayRole}</span>
                                            <span className="text-[var(--border-color-light)] opacity-50">•</span>
                                            <span className="truncate">{user.email}</span>
                                        </p>
                                    </div>
                                )}
                            </NavLink>
                        );
                    })()}

                    <div className="flex flex-col gap-1">
                        <NavLink
                            to="/"
                            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-2.5 w-full rounded-xl text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-all duration-200 group`}
                            title={!sidebarOpen ? "Back to Website" : undefined}
                        >
                            <Home size={18} className="shrink-0 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                            {sidebarOpen && <span className="whitespace-nowrap tracking-wide text-sm">Back to Website</span>}
                        </NavLink>

                        <button
                            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-2.5 w-full rounded-xl text-[var(--text-secondary)] font-medium hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group`}
                            onClick={handleLogout}
                            title={!sidebarOpen ? "Logout" : undefined}
                        >
                            <LogOut size={18} className="shrink-0 text-[var(--text-muted)] group-hover:text-red-400 transition-colors" />
                            {sidebarOpen && <span className="whitespace-nowrap tracking-wide text-sm">Logout</span>}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-2.5 w-full rounded-xl text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--accent-orange)] transition-all duration-200 group mt-1`}
                            title={!sidebarOpen ? "Toggle Theme" : undefined}
                        >
                            {isDarkMode ? (
                                <Sun size={18} className="shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] transition-colors" />
                            ) : (
                                <Moon size={18} className="shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] transition-colors" />
                            )}
                            {sidebarOpen && <span className="whitespace-nowrap tracking-wide text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background grid pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                {/* Header Gradient */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[var(--bg-surface)]/20 to-transparent pointer-events-none z-0" />

                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
