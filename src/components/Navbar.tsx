import { useState, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToId } from '../utils/scrollUtils';
import logo from '../assets/bitmap.png';
import logoLight from '../assets/logo- light-side.png';

interface NavbarProps {
    isDarkMode: boolean;
    onSearchClick?: () => void;
    onThemeToggle?: () => void;
}

export function Navbar({ isDarkMode, onSearchClick, onThemeToggle }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // ── Easter egg: triple-click on logo unlocks dark mode ──────────────────
    const clickCountRef = useRef(0);
    const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleLogoClick = useCallback((e: React.MouseEvent) => {
        // Handle normal home navigation
        if (location.pathname === '/') {
            e.preventDefault();
            scrollToId('hero');
        }

        // Track rapid clicks for easter egg
        clickCountRef.current += 1;
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        clickTimerRef.current = setTimeout(() => {
            if (clickCountRef.current >= 3 && onThemeToggle) {
                onThemeToggle();
            }
            clickCountRef.current = 0;
        }, 600);
    }, [location.pathname, onThemeToggle]);

    const navLinks = [
        { name: 'Services', path: '/services' },
        { name: 'Packages', path: '/packages' },
        { name: 'Solutions', path: '/solutions' },
        { name: 'Expertise', path: '/expertise' },
        { name: 'Insights', path: '/insights' },
    ];

    const NavItem = ({ link, mobile = false }: { link: typeof navLinks[0], mobile?: boolean }) => {
        return (
            <NavLink
                to={link.path}
                onClick={() => mobile && setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                    (mobile
                        ? "text-lg font-medium p-2 rounded-md transition-colors "
                        : "text-sm font-medium transition-colors ") +
                    (isActive 
                        ? "text-[var(--accent-orange)]" 
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
                }
            >
                {link.name}
            </NavLink>
        );
    };

    // Search KBD hint — adapts background for light vs dark
    const kbdBg = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-x-0 border-t-0 border-b border-b-[var(--border-color)]" style={{ borderRadius: 0, padding: '1rem 0' }}>
            <div className="container flex items-center justify-between">
                <NavLink
                    to="/"
                    className="flex items-center gap-2"
                    onClick={handleLogoClick}
                    title={isDarkMode ? 'Click × 3 to return to light mode' : 'Click × 3 for a surprise'}
                >
                    <img id="navbar-logo" src={isDarkMode ? logo : logoLight} alt="Talos.design" width="120" height="32" className="h-8 w-auto" />
                </NavLink>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavItem key={link.name} link={link} />
                    ))}
                    
                    {/* Search Trigger */}
                    <button 
                        onClick={onSearchClick}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-[var(--border-color)] transition-colors"
                        style={{ background: 'transparent' }}
                        aria-label="Search"
                        title="Search (CMD+K)"
                    >
                        <Search size={18} className="text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] transition-colors" />
                        <div
                            className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded border border-[var(--border-color)]"
                            style={{ background: kbdBg }}
                        >
                            <Command size={10} className="text-[var(--text-muted)]" />
                            <span className="text-[9px] font-mono text-[var(--text-muted)]">K</span>
                        </div>
                    </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => navigate('/contact')}
                        className="btn btn-primary flex items-center justify-center p-2 sm:px-4"
                        style={{ padding: '0.5rem 1rem' }}
                        aria-label="Contact Us"
                    >
                        <span className="hidden sm:inline mr-2">Contact</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Mobile Menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-base)] border-b border-[var(--border-color)] flex flex-col p-4 gap-4 shadow-2xl"
                    >
                        {navLinks.map((link) => (
                            <NavItem key={link.name} link={link} mobile />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
