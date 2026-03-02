import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import AdminAuth from './AdminAuth';

const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Inquiries (CRM)', path: '/admin/inquiries', icon: Mail, end: false },
    { name: 'Invoices', path: '/admin/invoices', icon: FileText, end: false },
    { name: 'Client Projects', path: '/admin/projects', icon: FolderKanban, end: false },
    { name: 'Case Studies', path: '/admin/case-studies', icon: BookOpen, end: false },
    { name: 'Settings', path: '/admin/settings', icon: Settings, end: false },
];

export default function AdminLayout() {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setAuthLoading(false);
        });
        return unsub;
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030303]">
                <div className="w-8 h-8 border-2 border-white/10 border-t-accent-orange rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <AdminAuth />;
    }

    return (
        <div className="flex h-screen w-full bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden selection:bg-[var(--accent-cyan)] selection:text-white font-sans">
            {/* Sidebar */}
            <aside
                className={`
                    flex flex-col h-full bg-[var(--bg-surface-elevated)] border-r border-[var(--border-color)] 
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-40 relative shadow-xl
                    ${sidebarOpen ? 'w-64' : 'w-20'}
                `}
            >
                {/* Decorative glow */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-transparent pointer-events-none" />

                <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.01)] relative z-10 shrink-0 h-16">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--bg-card)] to-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center shadow-inner shrink-0 group">
                                <Hexagon className="text-[var(--accent-orange)] group-hover:scale-110 transition-transform duration-300" size={18} strokeWidth={2.5} />
                            </div>
                            <span className="font-display font-bold text-base tracking-wide text-white whitespace-nowrap">Talos Admin</span>
                        </div>
                    )}
                    <button
                        className={`text-[var(--text-muted)] hover:text-white transition-colors p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)] ${!sidebarOpen && 'mx-auto'}`}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 relative z-10">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) =>
                                `flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-3 w-full rounded-xl transition-all duration-200 group relative
                                ${isActive
                                    ? 'bg-[rgba(255,255,255,0.06)] text-white shadow-sm ring-1 ring-inset ring-[rgba(255,255,255,0.1)] font-medium'
                                    : 'text-[var(--text-secondary)] font-medium hover:bg-[rgba(255,255,255,0.03)] hover:text-white'
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
                                        className={`shrink-0 ${isActive ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)] group-hover:text-white transition-colors'}`}
                                    />
                                    {sidebarOpen && (
                                        <span className="whitespace-nowrap tracking-wide text-sm">{link.name}</span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-[var(--border-color)] bg-[rgba(255,255,255,0.01)] relative z-10 shrink-0 space-y-2">
                    {sidebarOpen && user && (
                        <div className="flex items-center gap-3 px-3 py-3 w-full rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] shadow-sm mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--bg-card)] to-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                                <span className="font-mono font-bold text-white text-xs">{user.email?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-mono font-bold mb-0.5">Admin Ops</p>
                                <span className="text-[13px] text-white font-medium truncate block">{user.email}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <NavLink
                            to="/"
                            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-2.5 w-full rounded-xl text-[var(--text-secondary)] font-medium hover:bg-[rgba(255,255,255,0.03)] hover:text-white transition-all duration-200 group`}
                            title={!sidebarOpen ? "Back to Website" : undefined}
                        >
                            <Home size={18} className="shrink-0 text-[var(--text-muted)] group-hover:text-white transition-colors" />
                            {sidebarOpen && <span className="whitespace-nowrap tracking-wide text-sm">Back to Website</span>}
                        </NavLink>

                        <button
                            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center'} py-2.5 w-full rounded-xl text-[var(--text-secondary)] font-medium hover:bg-[rgba(239,68,68,0.1)] hover:text-red-400 transition-all duration-200 group`}
                            onClick={handleLogout}
                            title={!sidebarOpen ? "Logout" : undefined}
                        >
                            <LogOut size={18} className="shrink-0 text-[var(--text-muted)] group-hover:text-red-400 transition-colors" />
                            {sidebarOpen && <span className="whitespace-nowrap tracking-wide text-sm">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background grid pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                {/* Header Gradient */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-transparent pointer-events-none z-0" />

                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
