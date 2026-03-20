import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToId } from '../utils/scrollUtils';
import logo from '../assets/bitmap.png';
import logoLight from '../assets/logo- light-side.png';

export function Navbar({ isDarkMode, onSearchClick }: { isDarkMode: boolean, onSearchClick?: () => void }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'AI Agents', path: '/ai-agents' },
        { name: 'Systems', path: '/systems' },
        { name: 'Designs', path: '/designs' },
        { name: 'Impact', path: '/impact' },
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

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-x-0 border-t-0 border-b border-b-[var(--border-color)]" style={{ borderRadius: 0, padding: '1rem 0' }}>
            <div className="container flex items-center justify-between">
                <NavLink
                    to="/"
                    className="flex items-center gap-2"
                    onClick={(e) => {
                        if (location.pathname === '/') {
                            e.preventDefault();
                            scrollToId('hero');
                        }
                    }}
                >
                    <img src={isDarkMode ? logo : logoLight} alt="Talos.design" className="h-8" />
                </NavLink>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavItem key={link.name} link={link} />
                    ))}
                    
                    {/* Search Trigger */}
                    <button 
                        onClick={onSearchClick}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] border border-transparent hover:border-[var(--border-color)] transition-all"
                        title="Search (CMD+K)"
                    >
                        <Search size={18} className="text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] transition-colors" />
                        <div className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)]">
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
