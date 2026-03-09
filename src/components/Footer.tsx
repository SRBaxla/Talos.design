import { Hexagon, Twitter, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="border-t border-[var(--border-color)] mt-32 bg-[var(--bg-surface)] pt-24 pb-12">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4">
                    <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Hexagon className="text-[var(--accent-orange)]" size={24} />
                            <span className="font-display font-bold text-lg tracking-tight">Talos.design</span>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm max-w-[200px]">
                            Building the digital infrastructure for the next generation of business.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-6">Services</h3>
                        <ul className="flex flex-col gap-4 text-sm text-[var(--text-muted)]">
                            <li><Link to="/services/web-design" className="hover:text-white transition-colors">Web Design</Link></li>
                            <li><Link to="/services/chatbots" className="hover:text-white transition-colors">AI Chatbots</Link></li>
                            <li><Link to="/services/automation" className="hover:text-white transition-colors">Automation</Link></li>
                            <li><Link to="/projects" className="hover:text-white transition-colors">Packages</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-6">Company</h3>
                        <ul className="flex flex-col gap-4 text-sm text-[var(--text-muted)]">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link to="/legal" className="hover:text-white transition-colors">Legal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-6">Connect</h3>
                        <div className="flex gap-4 text-[var(--text-muted)]">
                            <a href="https://x.com/talosDesign" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors" aria-label="Github"><Github size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-muted)]">
                    <p>© {new Date().getFullYear()} Talos.design. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/legal#privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link to="/legal#terms" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
