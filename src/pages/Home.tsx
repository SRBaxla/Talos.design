import { LayoutGrid, Bot, Settings, CheckCircle, Globe, Wrench, Clock, Heart, Zap } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { useState } from 'react';
import { addInquiry } from '../admin/store/adminStore';
import { sendAutoResponderEmail } from '../lib/emailService';
import { scrollToId } from '../utils/scrollUtils';
import { ScrollTracker } from '../components/ScrollTracker';

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
  magenta: {
    color: '#f06292',
    glow: 'rgba(240, 98, 146, 0.2)',
    bg: 'rgba(240, 98, 146, 0.08)',
    border: 'rgba(240, 98, 146, 0.15)'
  },
};


export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const { scrollYProgress } = useScroll();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    try {
      await addInquiry({ name, email, company, message });

      // Send the auto-responder email to the user
      try {
        await sendAutoResponderEmail({ clientName: name, clientEmail: email });
      } catch (emailErr) {
        console.error("Failed to send auto-responder email. Inquiry was still saved.", emailErr);
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
    <>
      {/* Scroll Progress Tracker — replaces the old Navbar */}
      <ScrollTracker scrollProgress={scrollYProgress} isDarkMode={isDarkMode} />

      <div className="relative w-full z-10 pointer-events-auto">
        <main className="flex flex-col w-full md:w-[90%] lg:w-[85%] md:mr-auto px-4 sm:px-8 xl:pl-16">

          {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
          <section id="hero" className="relative w-full flex flex-col items-center md:items-start justify-center min-h-[100dvh] pt-40 pb-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                }
              }}
              className="container relative z-10 flex flex-col items-center md:items-start text-center md:text-left py-10 md:py-0"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="badge badge-online mb-6 md:mb-10 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
              >
                Systems Online
              </motion.div>

              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(2.5rem,8vw,5.5rem)] text-center md:text-left mb-[clamp(0.5rem,2vh,1.5rem)] max-w-5xl tracking-tighter leading-[0.95]"
              >
                Engineering the <br />
                <span className="text-gradient-orange text-glow-orange">Future of Work</span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[clamp(1rem,3vw,1.35rem)] text-[var(--text-secondary)] text-center md:text-left max-w-2xl leading-relaxed mb-[clamp(1.5rem,4vh,3rem)] opacity-90"
              >
                We deploy intelligent agents and automate your critical workflows.
                Scale your ambition with digital infrastructure built for tomorrow.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 }
                }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <button
                  onClick={() => scrollToId('contact')}
                  className="btn btn-primary py-4 px-10 shadow-[0_0_30px_var(--accent-orange-glow)] text-base"
                >
                  Book a Free Call
                </button>
                <button
                  onClick={() => scrollToId('packages')}
                  className="btn btn-outline py-4 px-10 text-base"
                >
                  See Our Packages
                </button>
              </motion.div>
            </motion.div>
          </section>

          {/* ── SECTION 2: SOLUTIONS ────────────────────────────────────── */}
          <section id="solutions" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-40 pb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center md:text-left mb-16"
            >
              <div className="badge badge-active mb-4 font-mono text-[clamp(10px,1.5vw,12px)] md:mx-0 mx-auto">[SOLUTIONS]</div>
              <h2 className="text-[clamp(1.5rem,5vw,3rem)] font-display uppercase mb-4">Built for <span className="text-gradient-orange text-glow-orange">Performance</span></h2>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto md:mx-0 text-[clamp(10px,2vw,14px)]">Three focused services delivered end-to-end for businesses that want results.</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-8"
            >
              {SERVICES.map((svc) => (
                <motion.div
                  key={svc.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-10 rounded-3xl flex flex-col h-full overflow-hidden transition-all duration-300"
                  style={{ borderColor: svc.accentBorder }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.2)]" style={{ background: svc.accentBg, border: `1px solid ${svc.accentBorder}` }}>
                      <svc.icon size={20} style={{ color: svc.accentColor }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-display uppercase font-bold leading-tight tracking-tight">{svc.title}</h3>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">{svc.number}</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: svc.accentColor }}>{svc.benefit}</p>
                  <p className="text-[var(--text-secondary)] text-[0.8rem] leading-relaxed mb-6 opacity-80">{svc.description}</p>

                  <div className="mt-auto pt-5 border-t border-[var(--border-color)]">
                    <ul className="grid grid-cols-1 gap-y-2 mb-6">
                      {svc.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <CheckCircle size={14} className="shrink-0" style={{ color: svc.accentColor }} /> {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={svc.id === 'chatbots' ? '/ai-agents' : svc.id === 'automation' ? '/systems' : '/designs'}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all hover:gap-3"
                      style={{ color: svc.accentColor }}
                    >
                      Explore Service <span>→</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── SECTION 3: PACKAGES ─────────────────────────────────────── */}
          <section id="packages" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-40 pb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center md:text-left mb-16"
            >
              <div className="badge badge-active mb-4 font-mono text-[clamp(10px,1.5vw,12px)] md:mx-0 mx-auto">[PACKAGES]</div>
              <h2 className="text-[clamp(1.5rem,5vw,3rem)] font-display uppercase mb-4">Choose Your <span className="text-[var(--accent-cyan)] text-glow">Setup</span></h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-6xl"
            >
              {PROJECTS.map((project) => {
                const a = accentMap[project.accent];
                return (
                  <motion.div
                    key={project.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-10 flex flex-col group h-full justify-between rounded-3xl"
                    style={{ borderColor: a.border }}
                  >
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[.25em] mb-4 block" style={{ color: a.color }}>{project.label}</span>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: a.bg, border: `1px solid ${a.border}` }}>
                          <project.icon size={22} style={{ color: a.color }} />
                        </div>
                        <h3 className="text-xl font-display font-bold tracking-tight">{project.title}</h3>
                      </div>
                      <p className="text-[var(--text-secondary)] text-[0.85rem] mb-8 leading-relaxed opacity-80">{project.description}</p>

                      <ul className="space-y-3 mb-10">
                        {project.highlights.map(h => (
                          <li key={h} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={project.path}
                        className="btn btn-outline flex-1 text-center text-xs py-3 rounded-xl font-bold uppercase tracking-widest"
                        style={{ color: a.color, borderColor: a.border }}
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => scrollToId('contact')}
                        className="btn btn-primary flex-1 text-center text-xs py-3 rounded-xl font-bold uppercase tracking-widest shadow-xl"
                        style={{ background: `linear-gradient(135deg, ${a.color} 0%, rgba(210, 193, 182, 0.8) 100%)` }}
                      >
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>

          {/* ── SECTION 4: STUDIO ───────────────────────────────────────── */}
          <section id="studio" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-40 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2rem,6vw,6rem)] items-center w-full">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="badge badge-online mb-6 shadow-[0_0_15px_rgba(34,197,94,0.2)]">The Studio</div>
                <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-display uppercase mb-6 leading-tight tracking-tight">We Are <span className="text-gradient-orange text-glow-orange">Talos</span></h2>
                <p className="text-[clamp(0.9rem,2vw,1.25rem)] text-[var(--text-secondary)] mb-10 leading-relaxed opacity-90">
                  Based in India, we engineer high-performance digital systems for ambitious businesses worldwide. We bridge the gap between complex AI and practical business outcomes.
                </p>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                  className="flex flex-col gap-4"
                >
                  {STUDIO_VALUES.map(val => (
                    <motion.div
                      key={val.title}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      className="flex gap-4 items-start p-5 rounded-2xl bg-[var(--bg-surface-elevated)] bg-opacity-20 border border-[var(--border-color)] hover:border-[var(--border-color-light)] transition-colors group"
                    >
                      <val.icon className="shrink-0 mt-1 transition-transform group-hover:scale-110" size={20} style={{ color: val.color }} />
                      <div>
                        <h4 className="font-bold text-base mb-1 text-[var(--text-primary)] tracking-tight">{val.title}</h4>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{val.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <Link
                  to="/about"
                  className="btn btn-outline mt-10 text-sm py-3 px-8 inline-flex items-center gap-2 group"
                >
                  Our Philosophy <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block relative"
              >
                <div className="relative glass-card rounded-[3rem] overflow-hidden flex items-center justify-center p-12 aspect-[4/3]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange-glow)] to-transparent opacity-20" />
                  <div className="relative z-10 text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="text-7xl mb-6"
                    >
                      🇮🇳
                    </motion.div>
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--text-primary)] font-bold">Engineered in India</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mt-2">Serving the World</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── SECTION 5: CONTACT + FOOTER ─────────────────────────────────────── */}
          <section id="contact" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-40 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2rem,5vw,6rem)] w-full items-start"
            >
              <div>
                <div className="badge badge-active mb-6 font-mono text-xs">[TRANSMISSION]</div>
                <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-display uppercase mb-6 leading-tight tracking-tight">Let's start your <br /><span className="text-gradient-orange text-glow-orange">Digital Ascent</span></h2>
                <p className="text-[var(--text-secondary)] mb-12 max-w-md leading-relaxed opacity-90">
                  Ready to automate? Send us a briefing and we'll get back to you with a custom roadmap.
                </p>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.15 }
                    }
                  }}
                  className="space-y-8"
                >
                  {CONTACT_STEPS.map((step, i) => (
                    <motion.div
                      key={step.label}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      className="flex gap-5 items-center group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--border-color)] flex items-center justify-center font-mono text-sm text-[var(--text-muted)] group-hover:border-[var(--accent-orange)] group-hover:text-[var(--accent-orange)] transition-colors">
                        0{i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm tracking-wide uppercase">{step.label}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">{step.sub}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-10 rounded-[2rem] w-full"
              >
                {status === 'success' ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                      <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-2">Message Transmitted</h3>
                    <p className="text-[var(--text-secondary)]">We'll respond within the next orbital cycle.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] ml-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-all outline-none"
                          placeholder="John Smith"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-all outline-none"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] ml-1">Company / Business Name</label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-all outline-none"
                        placeholder="Your business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] ml-1">Tell us about your project</label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-all outline-none resize-none"
                        placeholder="What do you need built? What problem are you trying to solve?"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isTransmitting}
                      className="btn btn-primary w-full py-4 text-base font-bold uppercase tracking-[0.2em] shadow-xl relative overflow-hidden group"
                    >
                      {isTransmitting ? (
                        <div className="flex items-center gap-3 justify-center">
                          <Clock className="animate-spin text-accent-orange" size={18} />
                          <span>Transmitting...</span>
                        </div>
                      ) : (
                        <span>Initiate Contact</span>
                      )}

                      {!isTransmitting && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>

            {/* ── Inline Footer ─────────────────────────────────────────── */}
            <div className="w-full mt-12 pt-6 pb-12 flex flex-col md:flex-row items-center justify-between border-t border-[var(--border-color)] gap-4">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold">© 2026 TALOS DESIGN — FUTURE PROOF SYSTEMS</div>
              <div className="flex gap-8">
                <button
                  onClick={() => scrollToId('hero')}
                  className="text-[10px] font-mono uppercase text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors tracking-widest"
                >
                  Back to Top
                </button>
                <Link to="/admin" className="text-[10px] font-mono uppercase text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors tracking-widest">Orbital Portal</Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
