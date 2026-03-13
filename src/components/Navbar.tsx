import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToId } from '../utils/scrollUtils';
import logo from '../assets/bitmap.png';
import logoLight from '../assets/logo- light-side.png';

export function Navbar({ isDarkMode }: { isDarkMode: boolean }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Solutions', id: 'solutions' },
        { name: 'Packages', id: 'packages' },
        { name: 'Studio', id: 'studio' },
        { name: 'Contact', id: 'contact' },
    ];

    const NavItem = ({ link, mobile = false }: { link: typeof navLinks[0], mobile?: boolean }) => {
        const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            if (location.pathname !== '/') {
                navigate(`/#${link.id}`);
                return;
            }

            if (link.id !== undefined) {
                scrollToId(link.id);
            }

            if (mobile) setIsMobileMenuOpen(false);
        };

        return (
            <a
                href={`#${link.id}`}
                onClick={handleClick}
                className={mobile
                    ? "text-lg font-medium p-2 rounded-md transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]"
                    : "hover:text-[var(--text-primary)] transition-colors text-[var(--text-secondary)]"
                }
            >
                {link.name}
            </a>
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
                <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                    {navLinks.map((link) => (
                        <NavItem key={link.name} link={link} />
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => scrollToId('contact')}
                        className="btn btn-primary flex items-center justify-center p-2 sm:px-4"
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        <span className="hidden sm:inline mr-2">Get Started</span>
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
