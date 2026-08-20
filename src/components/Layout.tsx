import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { useState, useEffect } from 'react';

import { Background } from './Background';
import { Navbar } from './Navbar';
import { SearchOverlay } from './SearchOverlay';

const STORAGE_KEY = 'talos-dark-mode-unlocked';

export function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isExpertise = location.pathname === '/expertise';
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Default is light (false). Dark is the hidden easter-egg.
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'true';
        } catch {
            return false;
        }
    });

    // Apply / remove .dark-theme on <html> and persist
    useEffect(() => {
        const html = document.documentElement;
        if (isDarkMode) {
            html.classList.add('dark-theme');
            html.classList.remove('light-theme');
        } else {
            html.classList.remove('dark-theme');
            html.classList.remove('light-theme');
        }
        try {
            localStorage.setItem(STORAGE_KEY, String(isDarkMode));
        } catch { /* ignore */ }
        updateMetaThemeColor(isDarkMode);
    }, [isDarkMode]);

    // Apply scroll-snap only on Home page
    useEffect(() => {
        if (isHome) {
            document.documentElement.classList.add('home-snap-active');
        } else {
            document.documentElement.classList.remove('home-snap-active');
        }
        return () => {
            document.documentElement.classList.remove('home-snap-active');
        };
    }, [isHome]);

    // Global CMD+K shortcut
    useEffect(() => {
        const handleCmdK = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleCmdK);
        return () => window.removeEventListener('keydown', handleCmdK);
    }, []);

    const updateMetaThemeColor = (dark: boolean) => {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', dark ? '#07090E' : '#FFFFFF');
    };

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return (
        <div className="flex flex-col min-h-dvh relative bg-transparent">
            <Background isDarkMode={isDarkMode} />

            <div className="flex flex-col min-h-dvh w-full relative z-10 bg-transparent">
                <Navbar isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
                <main className={`flex-grow flex flex-col bg-transparent ${isHome || isExpertise ? '' : 'pt-24'}`}>
                    <Outlet context={{ isDarkMode, toggleTheme }} />
                </main>
                {!isHome && <Footer />}
            </div>

            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </div>
    );
}
