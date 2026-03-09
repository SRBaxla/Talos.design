import { ExternalLink, LayoutGrid, Bot, Settings, CheckCircle, Globe, Wrench, Sparkles, Mail, Clock, Send, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { useState, useRef } from 'react';
import { addInquiry } from '../admin/store/adminStore';
import { sendAutoResponderEmail } from '../lib/emailService';

const SERVICES = [
  {
    id: 'web-design',
    number: '01',
    icon: LayoutGrid,
    title: 'Web Design',
    benefit: 'A website that turns visitors into clients',
    description: 'We build high-performance, fully custom websites that are fast, accessible, and designed to convert.',
    features: ['Fully responsive', 'SEO-optimised', 'Fast load times', 'Clean admin panel'],
    accentColor: 'var(--accent-orange)',
    accentBg: 'var(--accent-orange-glow)',
    accentBorder: 'var(--border-color)',
  },
  {
    id: 'chatbots',
    number: '02',
    icon: Bot,
    title: 'AI Chatbots',
    benefit: '24/7 customer handling — no extra staff needed',
    description: 'We deploy custom AI agents trained on your business content.',
    features: ['Trained on your content', 'Handles enquiries', 'Seamless hand-off', 'Integrates with WhatsApp'],
    accentColor: 'var(--accent-cyan)',
    accentBg: 'var(--accent-cyan-glow)',
    accentBorder: 'var(--border-color)',
  },
  {
    id: 'automation',
    number: '03',
    icon: Settings,
    title: 'System Automation',
    benefit: 'Eliminate the repetitive work eating your day',
    description: 'We build automated pipelines that connect your apps and communications.',
    features: ['Connect apps', 'Auto-send invoices', 'CRM sync', 'Custom dashboards'],
    accentColor: 'var(--accent-magenta)',
    accentBg: 'var(--accent-magenta-glow)',
    accentBorder: 'var(--border-color)',
  },
];

const PROJECTS = [
  { id: 'presence', label: 'Package 01', title: 'Digital Presence', accent: 'orange', icon: Globe, description: 'Your complete online identity — designed, built, and deployed.', highlights: ['Custom design', 'Brand identity', 'SEO optimization'], path: '/projects/presence' },
  { id: 'automation', label: 'Package 02', title: 'Smart Automation', accent: 'cyan', icon: Bot, description: 'Automate bookings and queries with intelligent systems.', highlights: ['AI booking', 'Query handling', 'CRM integration'], path: '/projects/automation' },
  { id: 'custom', label: 'Package 03', title: 'Custom Build', accent: 'magenta', icon: Wrench, description: 'Mix and match features or request something unique.', highlights: ['Pick features', 'Tailored architecture', 'Priority support'], path: '/projects/custom' },
];

const STUDIO_VALUES = [
  { icon: Zap, title: 'Speed & Precision', description: 'We move fast without cutting corners.', color: 'var(--accent-orange)', bgColor: 'var(--accent-orange-glow)', borderColor: 'var(--border-color)' },
  { icon: Heart, title: 'Client Obsessed', description: 'Your success is our success.', color: 'var(--accent-cyan)', bgColor: 'var(--accent-cyan-glow)', borderColor: 'var(--border-color)' },
  { icon: Globe, title: 'Remote First', description: 'Based in India, serving clients worldwide.', color: 'var(--accent-magenta)', bgColor: 'var(--accent-magenta-glow)', borderColor: 'var(--border-color)' },
];

const CONTACT_STEPS = [
  { label: 'We read your message', sub: 'Usually within a few hours' },
  { label: 'We schedule a call', sub: 'Free 30-min discovery session' },
  { label: 'You get a proposal', sub: 'Scope, timeline & fixed price' },
  { label: 'We build', sub: 'Phased delivery with check-ins' },
];

const accentMap: Record<string, { color: string; glow: string; bg: string; border: string }> = {
  orange: { color: 'var(--accent-orange)', glow: 'var(--accent-orange-glow)', bg: 'var(--accent-orange-glow)', border: 'var(--border-color)' },
  cyan: { color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)', bg: 'var(--accent-cyan-glow)', border: 'var(--border-color)' },
  magenta: { color: 'var(--accent-magenta)', glow: 'var(--accent-magenta-glow)', bg: 'var(--accent-magenta-glow)', border: 'var(--border-color)' },
};

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    try {
      await addInquiry({ name, email, company, message });
      try {
        await sendAutoResponderEmail({ clientName: name, clientEmail: email });
      } catch (emailErr) {
        console.error("Failed to send auto-responder email.", emailErr);
      }
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setName('');
        setEmail('');
        setCompany('');
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col flex-grow w-full">

      {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
      <section id="hero" className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container relative z-10 flex flex-col items-center pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge badge-online mb-10 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          >
            Systems Online
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl text-center mb-6 max-w-5xl tracking-tight leading-[1.1]"
          >
            Engineering the <br />
            <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(236,204,110,0.2)]">Future of Work</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[var(--text-secondary)] text-center max-w-2xl leading-relaxed mb-10"
          >
            We deploy intelligent agents and automate your critical workflows.
            Scale your ambition with digital infrastructure built for tomorrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)]">
              Book a Free Call
            </a>
            <a href="#packages" className="btn btn-outline py-3 px-8">
              See Our Packages
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: SOLUTIONS ────────────────────────────────────── */}
      <section id="solutions" className="container py-32 md:py-40 flex flex-col items-center border-b border-[var(--border-color)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="badge badge-active mb-6 font-mono text-xs mx-auto">[SOLUTIONS]</div>
          <h2 className="text-4xl md:text-6xl font-display uppercase mb-6">Built for <span className="text-gradient-orange">Performance</span></h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Three focused services delivered end-to-end for businesses that want results.</p>
        </motion.div>

        <div className="w-full max-w-5xl grid grid-cols-1 gap-16 md:gap-24">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center glass-panel p-8 rounded-3xl"
                style={{ borderColor: svc.accentBorder }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: svc.accentBg, border: `1px solid ${svc.accentBorder}` }}>
                      <Icon size={22} style={{ color: svc.accentColor }} />
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">{svc.number}</span>
                  </div>
                  <h3 className="text-3xl font-display uppercase mb-3">{svc.title}</h3>
                  <p className="text-lg font-medium mb-4" style={{ color: svc.accentColor }}>{svc.benefit}</p>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{svc.description}</p>
                </div>
                <div className="bg-[var(--bg-surface-elevated)] p-6 rounded-2xl border border-[var(--border-color)]">
                  <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-4">Core Infrastructure</div>
                  <ul className="grid grid-cols-1 gap-3">
                    {svc.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <CheckCircle size={14} style={{ color: svc.accentColor }} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 3: PACKAGES ─────────────────────────────────────── */}
      <section id="packages" className="container py-32 md:py-40 flex flex-col items-center border-b border-[var(--border-color)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="badge badge-active mb-6 font-mono text-xs mx-auto">[PACKAGES]</div>
          <h2 className="text-4xl md:text-6xl font-display uppercase mb-6">Choose Your <span className="text-[var(--accent-cyan)]">Setup</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-6xl">
          {PROJECTS.map((project, i) => {
            const a = accentMap[project.accent];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 flex flex-col group hover:-translate-y-2 transition-all duration-300"
                style={{ borderColor: a.border }}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest mb-6" style={{ color: a.color }}>{project.label}</span>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: a.bg }}>
                    <project.icon size={24} style={{ color: a.color }} />
                  </div>
                  <h3 className="text-xl font-display font-bold">{project.title}</h3>
                </div>
                <p className="text-[var(--text-secondary)] text-sm mb-6 flex-grow">{project.description}</p>
                <ul className="flex flex-col gap-3 mb-8">
                  {project.highlights.map(h => (
                    <li key={h} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Sparkles size={12} style={{ color: a.color }} /> {h}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="btn btn-outline w-full text-center" style={{ color: a.color, borderColor: a.border }}>Book Now</a>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 4: STUDIO ───────────────────────────────────────── */}
      <section id="studio" className="container py-32 md:py-40 flex flex-col items-center border-b border-[var(--border-color)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="badge badge-online mb-6 shadow-[0_0_15px_rgba(34,197,94,0.2)]">The Studio</div>
            <h2 className="text-4xl md:text-6xl font-display uppercase mb-6 leading-tight">We Are <span className="text-gradient-orange">Talos</span></h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
              Based in India, we engineer high-performance digital systems for ambitious businesses worldwide. We focus on results, speed, and precision.
            </p>
            <div className="flex flex-col gap-4">
              {STUDIO_VALUES.map(val => (
                <div key={val.title} className="flex gap-4 items-start p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)]">
                  <val.icon className="shrink-0 mt-1" size={20} style={{ color: val.color }} />
                  <div>
                    <h4 className="font-bold text-sm mb-1">{val.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{val.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative glass-panel rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange-glow)] to-transparent opacity-20" />
            <div className="relative z-10 text-center">
              <div className="text-8xl mb-4">🇮🇳</div>
              <div className="text-sm font-mono uppercase tracking-widest text-[var(--text-muted)]">Engineered in India</div>
              <div className="text-xs font-mono text-[var(--text-muted)] mt-2 opacity-50">Async-Friendly Worldwide</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5: INDUSTRIES ───────────────────────────────────── */}
      <section id="industries" className="container py-32 md:py-40 flex flex-col items-center border-b border-[var(--border-color)]">
        <div className="w-full max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]" />
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Industries & Live Work</span>
          </div>
          <h2 className="text-4xl font-display uppercase tracking-tight mb-12">
            Who We Build <span className="text-[var(--accent-cyan)]">For</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-4">
              {[
                { label: 'Hospitality', desc: 'Hotels, restaurants, booking engines & guest CRM systems.', color: 'rgba(69,104,130,0.2)', border: 'rgba(69,104,130,0.4)' },
                { label: 'E-Commerce', desc: 'High-converting stores, payment integration & inventory management.', color: 'rgba(236,204,110,0.1)', border: 'rgba(236,204,110,0.3)' },
                { label: 'Professional Services', desc: 'Client portals, scheduling, AI assistants & custom SaaS tools.', color: 'rgba(166,5,111,0.1)', border: 'rgba(166,5,111,0.3)' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-panel p-5 flex items-center justify-between group cursor-default"
                  style={{ borderColor: item.border }}
                >
                  <div>
                    <div
                      className="text-xs font-mono font-semibold uppercase tracking-widest mb-1 px-2 py-0.5 rounded-full self-start inline-block"
                      style={{ background: item.color, color: 'var(--text-primary)' }}
                    >
                      {item.label}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent-orange)] opacity-[0.04] blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-mono bg-[rgba(34,197,94,0.1)] text-green-400 px-3 py-1 rounded-full border border-[rgba(34,197,94,0.2)]">● Live</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Delivered Dec 2025</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Boutique Hotel — Full Digital Suite</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  Complete digital overhaul for a 40-room boutique hotel — custom website, booking engine, real-time availability dashboard.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {['Website', 'Booking', 'CRM', 'Notifications'].map(tag => (
                    <span key={tag} className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-primary)]">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] font-mono">6 week build</span>
                  <a href="https://jhansi-hotel.web.app/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-orange)] font-medium hover:text-white transition-colors">
                    View Live <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CONTACT ──────────────────────────────────────── */}
      <section id="contact" className="container py-32 md:py-40 border-b border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-12 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">We're available</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-display tracking-tight mb-5 uppercase">Let's <span className="text-gradient-orange">Talk.</span></h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl">Tell us about your project and we'll get back to you with a clear plan.</p>
            </div>

            <div className="lg:col-span-7">
              <form className="glass-panel p-8 flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-colors text-white"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-colors text-white"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company / Business Name"
                  className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-colors text-white"
                />
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project..."
                  rows={4}
                  className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-colors text-white resize-none"
                />
                <button
                  type="submit"
                  disabled={isTransmitting}
                  className="btn btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_var(--accent-orange-glow)] disabled:opacity-50"
                >
                  {status === 'success' ? <><CheckCircle size={16} /> Message Sent!</> : isTransmitting ? 'Sending...' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="glass-panel p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-orange-glow)] flex items-center justify-center shrink-0"><Mail className="text-[var(--accent-orange)]" size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold mb-1">Email us</h4>
                  <a href="mailto:hello@talos.design" className="text-[var(--accent-orange)] text-sm font-mono">hello@talos.design</a>
                </div>
              </div>
              <div className="glass-panel p-6">
                <h4 className="text-sm font-bold mb-4 flex items-center gap-2"><Clock size={14} className="text-[var(--accent-magenta)]" /> What's next?</h4>
                <div className="flex flex-col gap-4">
                  {CONTACT_STEPS.map((step, i) => (
                    <div key={step.label} className="flex gap-3">
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">0{i + 1}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{step.label}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{step.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FOOTER ───────────────────────────────────────── */}
      <footer className="container py-12 flex flex-col md:flex-row items-center justify-between border-t border-[var(--border-color)] opacity-60">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 md:mb-0">© 2026 TALOS DESIGN · DIGITAL INFRASTRUCTURE</div>
        <div className="flex gap-8">
          <a href="#hero" className="text-[10px] font-mono uppercase hover:text-[var(--accent-orange)]">Back to Top</a>
          <Link to="/admin" className="text-[10px] font-mono uppercase hover:text-[var(--accent-orange)]">Admin Login</Link>
        </div>
      </footer>

    </div>
  );
}

