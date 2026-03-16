import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
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
    { name: 'Team', path: '/admin/team', icon: Users, end: false, adminOnly: true },
    { name: 'Settings', path: '/admin/settings', icon: Settings, end: false, adminOnly: true },
];

export default function AdminLayout() {
    const [user, setUser] = useState<User | null>(null);
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

                <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-base)] relative z-10 shrink-0 space-y-2">
                    {sidebarOpen && user && (
                        <NavLink
                            to="/admin/profile"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 w-full rounded-xl border shadow-sm mb-4 transition-all duration-200
                                ${isActive
                                    ? 'bg-[var(--bg-surface)] border-[var(--accent-orange)]/30 ring-1 ring-inset ring-[var(--accent-orange)]/20 text-[var(--text-primary)]'
                                    : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--border-color-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`
                            }
                            title="My Profile"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
                                <span className="font-mono font-bold text-[var(--text-primary)] text-xs">{user.email?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-mono font-bold mb-0.5">My Profile</p>
                                <span className="text-[13px] text-[var(--text-primary)] font-medium truncate block">{user.email}</span>
                            </div>
                        </NavLink>
                    )}

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
