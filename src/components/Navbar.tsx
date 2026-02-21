import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Hexagon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Solutions', path: '/services' },
        { name: 'Projects', path: '/projects' },
        { name: 'Studio', path: '/about' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-x-0 border-t-0 border-b border-b-[var(--border-color)]" style={{ borderRadius: 0, padding: '1rem 0' }}>
            <div className="container flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-2">
                    <Hexagon className="text-[var(--accent-orange)]" size={32} />
                    <span className="font-display font-bold text-xl tracking-tight">Talos.design</span>
                </NavLink>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[var(--text-secondary)]">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) => `hover:text-white transition-colors ${isActive ? 'text-white border-b-2 border-[var(--accent-orange)] pb-1' : ''}`}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <NavLink to="/contact" className="btn btn-primary flex items-center justify-center p-2 sm:px-4" style={{ padding: '0.5rem 1rem' }}>
                        <span className="hidden sm:inline mr-2">Get Started</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </NavLink>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        className="md:hidden text-[var(--text-secondary)] hover:text-white transition-colors p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `text-lg font-medium p-2 rounded-md transition-colors ${isActive ? 'bg-[rgba(245,158,11,0.1)] text-[var(--accent-orange)]' : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
