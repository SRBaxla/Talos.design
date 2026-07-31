import { LayoutGrid, Bot, Settings, CheckCircle, Globe, Wrench, Clock, Heart, Zap } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { useState, lazy, Suspense } from 'react';
import { scrollToId } from '../utils/scrollUtils';
import { ScrollTracker } from '../components/ScrollTracker';
import OneWayMirrorHero from '../components/OneWayMirrorHero';



const FeaturedCaseStudies = lazy(() => import('../components/FeaturedCaseStudies'));


const SERVICES = [
  {
    id: 'web-design',
    number: '01',
    icon: LayoutGrid,
    title: 'High-Converting Websites',
    benefit: 'Turn Visitors Into Paying Customers',
    description: 'Custom-designed websites engineered for speed, trust, mobile responsiveness, and maximum lead generation.',
    features: ['Mobile & speed optimized', 'Google Search & SEO setup', 'Instant WhatsApp lead button', 'Easy content manager'],
    accentColor: 'var(--accent-orange)',
    accentBg: 'var(--accent-orange-glow)',
    accentBorder: 'var(--border-color)',
  },
  {
    id: 'chatbots',
    number: '02',
    icon: Bot,
    title: '24/7 AI Sales Assistant',
    benefit: 'Capture Inquiries & Bookings 24/7',
    description: 'Intelligent AI assistants trained on your business that qualify leads and respond to clients on WhatsApp and web instantly.',
    features: ['Trained on your business', 'Instant lead qualification', '24/7 automated customer support', 'Direct WhatsApp integration'],
    accentColor: 'var(--accent-cyan)',
    accentBg: 'var(--accent-cyan-glow)',
    accentBorder: 'var(--border-color)',
  },
  {
    id: 'automation',
    number: '03',
    icon: Settings,
    title: 'Workflow Automation',
    benefit: 'Save 20+ Hours of Work Weekly',
    description: 'Eliminate repetitive manual tasks, automate client invoicing, and sync your business communication channels automatically.',
    features: ['Auto-send invoices & receipts', 'CRM & payment gateway sync', 'Instant WhatsApp notifications', 'Custom operational dashboards'],
    accentColor: 'var(--accent-orange)',
    accentBg: 'var(--accent-orange-glow)',
    accentBorder: 'var(--border-color)',
  },
];

const PROJECTS = [
  { id: 'presence', label: 'PACKAGE 01', title: 'Digital Business Launch', accent: 'orange', icon: Globe, description: 'Establish immediate market credibility and capture qualified online leads with a high-performance web presence.', highlights: ['Custom lead-generation site', 'Google Maps & SEO setup', 'Instant WhatsApp chat button'], path: '/projects/presence' },
  { id: 'automation', label: 'PACKAGE 02 — MOST POPULAR', title: 'Automated Growth Engine', accent: 'cyan', icon: Bot, description: 'Automate customer follow-ups, sales inquiries, and client bookings without hiring extra staff.', highlights: ['Everything in Digital Launch', '24/7 AI WhatsApp sales bot', 'Automated CRM & billing sync'], path: '/projects/automation' },
  { id: 'custom', label: 'PACKAGE 03 — ENTERPRISE', title: 'Custom Business Platform', accent: 'orange', icon: Wrench, description: 'Bespoke software architecture, custom operational portals, and specialized workflows tailored for your company.', highlights: ['Tailored workflow architecture', 'Custom web & client portals', 'Dedicated ongoing support'], path: '/projects/custom' },
];

const STUDIO_VALUES = [
  { icon: Zap, title: 'Business Growth Focus', description: 'We measure success in clear ROI, time saved, and revenue growth—not confusing tech jargon.', color: 'var(--accent-orange)', bgColor: 'var(--accent-orange-glow)', borderColor: 'var(--border-color)' },
  { icon: Heart, title: 'Transparent Partnership', description: 'Fixed quotes, clear milestone delivery, and zero surprise fees.', color: 'var(--accent-cyan)', bgColor: 'var(--accent-cyan-glow)', borderColor: 'var(--border-color)' },
  { icon: Globe, title: 'Engineered in Jhansi, India', description: 'Headquartered in UP, India, serving regional MSMEs and global businesses with long-term support.', color: 'var(--accent-orange)', bgColor: 'var(--accent-orange-glow)', borderColor: 'var(--border-color)' },
];

const CONTACT_STEPS = [
  { label: 'Share Your Business Goals', sub: 'Tell us about your operations or growth targets' },
  { label: 'Free Strategy Call', sub: '15-minute consultation to map out your solution' },
  { label: 'Transparent Growth Plan', sub: 'Fixed scope, clear timeline, and predictable quote' },
  { label: 'Build & Scale Operations', sub: 'Phased delivery with full team training and launch' },
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
      // Dynamic imports to prevent Firebase/EmailJS from bloating the initial bundle
      const [{ addInquiry }, { sendAutoResponderEmail }] = await Promise.all([
        import('../admin/store/adminStore'),
        import('../lib/emailService')
      ]);

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

        {/* ── SECTION 1: HERO — ONE-WAY MIRROR ─────────────────────────────── */}
        <OneWayMirrorHero />

        <main className="flex flex-col w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* ── SECTION 2: SOLUTIONS ────────────────────────────────────── */}
          <section id="solutions" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-20 sm:pt-32 lg:pt-40 pb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center md:text-left mb-12 sm:mb-16"
            >
              <div className="badge badge-active mb-4 font-mono text-[clamp(10px,1.5vw,12px)] md:mx-0 mx-auto">[SOLUTIONS]</div>
              <h2 className="text-[clamp(1.5rem,5vw,3rem)] font-display uppercase mb-4">Built for <span className="text-gradient-orange text-glow-orange">Performance</span></h2>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto md:mx-0 text-[clamp(12px,2vw,15px)]">Solving real operational bottlenecks with high-performance web systems and automation.</p>
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
              className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            >
              {SERVICES.map((svc) => (
                <motion.div
                  key={svc.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl flex flex-col h-full overflow-hidden transition-all duration-300"
                  style={{ borderColor: svc.accentBorder }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.2)]" style={{ background: svc.accentBg, border: `1px solid ${svc.accentBorder}` }}>
                      <svc.icon size={20} style={{ color: svc.accentColor }} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-display uppercase font-bold leading-tight tracking-tight">{svc.title}</h3>
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
          <section id="packages" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-20 sm:pt-32 lg:pt-40 pb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center md:text-left mb-12 sm:mb-16"
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
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl"
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
                    className="glass-card p-6 sm:p-8 lg:p-10 flex flex-col group h-full justify-between rounded-3xl"
                    style={{ borderColor: a.border }}
                  >
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[.25em] mb-4 block" style={{ color: a.color }}>{project.label}</span>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0" style={{ backgroundColor: a.bg, border: `1px solid ${a.border}` }}>
                          <project.icon size={22} style={{ color: a.color }} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-display font-bold tracking-tight">{project.title}</h3>
                      </div>
                      <p className="text-[var(--text-secondary)] text-[0.85rem] mb-8 leading-relaxed opacity-80">{project.description}</p>

                      <ul className="space-y-3 mb-10">
                        {project.highlights.map(h => (
                          <li key={h} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
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

          <Suspense fallback={<div className="min-h-[200px]" />}>
            <FeaturedCaseStudies />
          </Suspense>


          {/* ── SECTION 4: STUDIO (WHO WE ARE & FOUNDERS) ────────────────── */}
          <section id="studio" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-20 sm:pt-32 lg:pt-40 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[clamp(2rem,6vw,6rem)] items-center w-full">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="badge badge-online mb-6 shadow-[0_0_15px_rgba(34,197,94,0.2)]">Who We Are</div>
                <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-display uppercase mb-6 leading-tight tracking-tight">Engineered in <span className="text-gradient-orange text-glow-orange">Jhansi, India</span></h2>
                <p className="text-[clamp(0.9rem,2vw,1.25rem)] text-[var(--text-secondary)] mb-8 leading-relaxed opacity-90">
                  Headquartered in <strong>Jhansi, Uttar Pradesh, India</strong>, Talos.design is built by engineers dedicated to providing transparent, highly reliable digital systems and AI automation for MSMEs and growing enterprises.
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
                  Meet Our Team & Philosophy <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative mt-8 lg:mt-0"
              >
                <div className="relative glass-card rounded-2xl sm:rounded-[3rem] overflow-hidden flex items-center justify-center p-8 sm:p-12 aspect-auto sm:aspect-[4/3] min-h-[240px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange-glow)] to-transparent opacity-20" />
                  <div className="relative z-10 text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="text-5xl sm:text-7xl mb-4 sm:mb-6"
                    >
                      🇮🇳
                    </motion.div>
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--text-primary)] font-bold">Jhansi, UP, India</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mt-2">Serving Indian MSMEs & Global Clients</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── SECTION 5: CONTACT + FOOTER ─────────────────────────────────────── */}
          <section id="contact" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-20 sm:pt-32 lg:pt-40 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[clamp(2rem,5vw,6rem)] w-full items-start"
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
                className="glass-card p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2rem] w-full"
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
