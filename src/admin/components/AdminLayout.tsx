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
} from 'lucide-react';
import AdminAuth from './AdminAuth';

const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
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
            <div className="admin-loading">
                <div className="admin-spinner" />
            </div>
        );
    }

    if (!user) {
        return <AdminAuth />;
    }

    return (
        <div className="admin-shell">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="admin-sidebar-header">
                    {sidebarOpen && (
                        <div className="admin-sidebar-brand">
                            <Hexagon className="text-[var(--accent-orange)]" size={24} />
                            <span className="admin-sidebar-brand-text">Talos Admin</span>
                        </div>
                    )}
                    <button
                        className="admin-sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                    </button>
                </div>

                <nav className="admin-sidebar-nav">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) =>
                                `admin-sidebar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <link.icon size={18} />
                            {sidebarOpen && <span>{link.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    {sidebarOpen && (
                        <div className="admin-sidebar-user">
                            <div className="admin-sidebar-avatar">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="admin-sidebar-email">{user.email}</span>
                        </div>
                    )}
                    <NavLink to="/" className="admin-sidebar-link">
                        <Home size={18} />
                        {sidebarOpen && <span>Back to Website</span>}
                    </NavLink>
                    <button className="admin-sidebar-link" onClick={handleLogout}>
                        <LogOut size={18} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`admin-main ${sidebarOpen ? '' : 'expanded'}`}>
                <Outlet />
            </main>
        </div>
    );
}
