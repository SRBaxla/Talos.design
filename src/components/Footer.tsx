import { Hexagon, Twitter, Github, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="w-full border-t border-[var(--border-color)] bg-[var(--bg-surface)] relative overflow-hidden">
            {/* Bottom Footer Main Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Col 1: Brand & Headquarters */}
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <Hexagon className="text-[var(--accent-orange)] transition-transform group-hover:rotate-12" size={28} />
                            <span className="font-display font-bold text-xl tracking-tight text-white">Talos.design</span>
                        </Link>
                        <p className="text-[var(--text-secondary)] text-xs leading-relaxed max-w-[240px] opacity-85">
                            Building high-converting digital presence, 24/7 AI assistants, and automated workflows for modern businesses.
                        </p>
                        
                        <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex flex-col gap-2.5 text-xs text-[var(--text-muted)]">
                            <div className="flex items-center gap-2.5">
                                <MapPin size={14} className="text-[var(--accent-orange)] shrink-0" />
                                <span>Jhansi, Uttar Pradesh, India 🇮🇳</span>
                            </div>
                            <a href="tel:+917247250918" className="flex items-center gap-2.5 hover:text-white transition-colors">
                                <Phone size={14} className="text-[var(--accent-orange)] shrink-0" />
                                <span>+91 72472 50918</span>
                            </a>
                            <a href="mailto:hello@talos.design" className="flex items-center gap-2.5 hover:text-white transition-colors">
                                <Mail size={14} className="text-[var(--accent-orange)] shrink-0" />
                                <span>hello@talos.design</span>
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Services & Solutions */}
                    <div>
                        <h4 className="font-display font-bold uppercase tracking-widest text-xs text-white mb-6">Expertise & Services</h4>
                        <ul className="flex flex-col gap-3 text-xs text-[var(--text-secondary)]">
                            <li><Link to="/expertise#ai" className="hover:text-[var(--accent-orange)] transition-colors">24/7 AI Sales Assistants</Link></li>
                            <li><Link to="/expertise#systems" className="hover:text-[var(--accent-orange)] transition-colors">Workflow & Operations Automation</Link></li>
                            <li><Link to="/expertise#designs" className="hover:text-[var(--accent-orange)] transition-colors">High-Converting Web Design</Link></li>
                            <li><Link to="/projects/custom" className="hover:text-[var(--accent-orange)] transition-colors">Custom Enterprise Software</Link></li>
                            <li><Link to="/services" className="hover:text-[var(--accent-orange)] transition-colors">All Growth Packages</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Experience & Company */}
                    <div>
                        <h4 className="font-display font-bold uppercase tracking-widest text-xs text-white mb-6">Company & Impact</h4>
                        <ul className="flex flex-col gap-3 text-xs text-[var(--text-secondary)]">
                            <li><Link to="/impact" className="hover:text-[var(--accent-orange)] transition-colors">Client Impact & Results</Link></li>
                            <li><Link to="/insights" className="hover:text-[var(--accent-orange)] transition-colors">Engineering Insights</Link></li>
                            <li><Link to="/about" className="hover:text-[var(--accent-orange)] transition-colors">About Our Studio</Link></li>
                            <li><Link to="/careers" className="hover:text-[var(--accent-orange)] transition-colors">Careers & Open Roles</Link></li>
                            <li><Link to="/legal" className="hover:text-[var(--accent-orange)] transition-colors">Privacy & Compliance</Link></li>
                        </ul>
                    </div>

                    {/* Col 4: Connect & Consultation */}
                    <div>
                        <h4 className="font-display font-bold uppercase tracking-widest text-xs text-white mb-6">Connect With Us</h4>
                        <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
                            Have questions or ready to launch your build? Talk directly with our team.
                        </p>

                        <div className="flex flex-col gap-3 mb-6">
                            <a href="/#contact" className="w-full py-2.5 rounded-xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider text-center hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                Book Free Consultation
                            </a>
                            <a 
                                href="https://wa.me/917247250918?text=Hello%20Talos.design%2C%20I%20would%20like%20to%20discuss%20building%20my%20system." 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-full py-2.5 rounded-xl border border-white/20 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                            >
                                <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                WhatsApp Inquiry
                            </a>
                        </div>

                        <div className="flex items-center gap-3 text-[var(--text-muted)]">
                            <a href="https://x.com/talosDesign" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-[var(--accent-orange)] hover:border-[var(--accent-orange)] transition-colors" aria-label="Twitter">
                                <Twitter size={16} />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-[var(--accent-orange)] hover:border-[var(--accent-orange)] transition-colors" aria-label="Github">
                                <Github size={16} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-[var(--accent-orange)] hover:border-[var(--accent-orange)] transition-colors" aria-label="LinkedIn">
                                <Linkedin size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal Copyright Line */}
                <div className="border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-muted)] gap-4">
                    <p>© {new Date().getFullYear()} Talos.design. All rights reserved. Built for high-growth businesses.</p>
                    <div className="flex gap-6">
                        <Link to="/legal#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/legal#terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/legal#security" className="hover:text-white transition-colors">Security & Governance</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
