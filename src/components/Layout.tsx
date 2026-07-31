import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { useState, useEffect } from 'react';

import { Background } from './Background';
import { Navbar } from './Navbar';
import { SearchOverlay } from './SearchOverlay';

export function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isExpertise = location.pathname === '/expertise';
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Enforce dark theme and scroll-snap management
    useEffect(() => {
        document.documentElement.classList.remove('light-theme');
        updateMetaThemeColor();

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

    const updateMetaThemeColor = () => {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', '#07090E');
    };

    return (
        <div className="flex flex-col min-h-dvh relative bg-transparent dark">
            <Background isDarkMode={true} />

            <div className="flex flex-col min-h-dvh w-full relative z-10 bg-transparent">
                <Navbar isDarkMode={true} onSearchClick={() => setIsSearchOpen(true)} />
                <main className={`flex-grow flex flex-col bg-transparent ${isHome || isExpertise ? '' : 'pt-24'}`}>
                    <Outlet context={{ isDarkMode: true }} />
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
