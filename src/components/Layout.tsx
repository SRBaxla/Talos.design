import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import ThreeScene from './ThreeScene';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Navbar } from './Navbar';

export function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Initial theme detection and scroll-snap management
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('light-theme', !isDark);
        updateMetaThemeColor(isDark);

        // Apply scroll-snap only on Home page
        if (isHome) {
            document.documentElement.classList.add('home-snap-active');
        } else {
            document.documentElement.classList.remove('home-snap-active');
        }

        return () => {
            document.documentElement.classList.remove('home-snap-active');
        };
    }, [isHome]);

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

    return (
        <div className={`flex flex-col min-h-dvh relative bg-transparent ${isDarkMode ? 'dark' : 'light'}`}>
            <ThreeScene isDarkMode={isDarkMode} />

            <div className="flex flex-col min-h-dvh w-full relative z-10 bg-transparent">
                {/* Navbar is rendered on all pages now */}
                <Navbar isDarkMode={isDarkMode} />
                <main className={`flex-grow flex flex-col bg-transparent ${isHome ? '' : 'pt-24'}`}>
                    <Outlet context={{ isDarkMode }} />
                </main>
                {!isHome && <Footer />}
            </div>

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="flex fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] p-3 rounded-full glass-panel shadow-2xl border border-[var(--border-color)] hover:scale-110 transition-transform bg-[var(--bg-surface)] text-[var(--text-primary)]"
                aria-label="Toggle Theme"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
    );
}
