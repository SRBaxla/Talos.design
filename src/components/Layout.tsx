import { Outlet, useLocation, Link } from 'react-router-dom';
import { Footer } from './Footer';
import ThreeScene from './ThreeScene';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import logo from '../assets/bitmap.png';

function MinimalHeader() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-x-0 border-t-0 border-b border-b-[var(--border-color)]" style={{ borderRadius: 0, padding: '0.75rem 0' }}>
            <div className="container flex items-center">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Talos.design" className="h-8" />
                </Link>
            </div>
        </nav>
    );
}

export function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Initial theme detection
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('light-theme', !newMode);
    };

    return (
        <div className={`flex flex-col min-h-screen relative bg-transparent ${isDarkMode ? 'dark' : 'light'}`}>
            <ThreeScene isDarkMode={isDarkMode} />

            <div className="flex flex-col min-h-screen w-full relative z-10 bg-transparent">
                {/* Home page uses ScrollTracker (rendered inside Home.tsx), non-home pages get MinimalHeader */}
                {!isHome && <MinimalHeader />}
                <main className={`flex-grow flex flex-col bg-transparent ${isHome ? '' : 'pt-24'}`}>
                    <Outlet />
                </main>
                {!isHome && <Footer />}
            </div>

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="fixed bottom-8 right-8 z-[100] p-3 rounded-full glass-panel shadow-2xl border border-[var(--border-color)] hover:scale-110 transition-transform bg-[var(--bg-surface)] text-[var(--text-primary)]"
                aria-label="Toggle Theme"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
    );
}
