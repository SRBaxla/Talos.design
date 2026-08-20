import { LayoutGrid, Bot, Settings, CheckCircle, Globe, Wrench, Clock, Heart, Zap } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { useState } from 'react';
import { scrollToId } from '../utils/scrollUtils';
import { ScrollTracker } from '../components/ScrollTracker';
import OneWayMirrorHero from '../components/OneWayMirrorHero';


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
    title: 'AI Sales & Inquiry Assistants',
    benefit: 'Answer Routine Inquiries & Qualify Leads 24/7',
    description: 'Deploy practical AI assistants trained on your business info to answer customer questions, capture contact details, and route conversations to your team on WhatsApp and Web.',
    features: ['Answers FAQs & pricing details', 'Captures & qualifies inquiries', 'Direct WhatsApp & Web integration', 'Seamless human team handoff'],
    accentColor: 'var(--accent-cyan)',
    accentBg: 'var(--accent-cyan-glow)',
    accentBorder: 'var(--border-color)',
  },
  {
    id: 'automation',
    number: '03',
    icon: Settings,
    title: 'Workflow Automation',
    benefit: 'Eliminate Repetitive Manual Admin',
    description: 'Eliminate repetitive manual tasks, automate client invoicing, and sync your business communication channels automatically.',
    features: ['Auto-send invoices & receipts', 'CRM & payment gateway sync', 'Instant WhatsApp notifications', 'Custom operational dashboards'],
    accentColor: 'var(--accent-orange)',
    accentBg: 'var(--accent-orange-glow)',
    accentBorder: 'var(--border-color)',
  },
];

const PROJECTS = [
  { id: 'presence', label: 'PACKAGE 01', title: 'Digital Business Launch', accent: 'orange', icon: Globe, description: 'Establish immediate market credibility and capture qualified online leads with a high-performance web presence.', highlights: ['Custom lead-generation site', 'Google Maps & SEO setup', 'Instant WhatsApp chat button'], path: '/packages/presence' },
  { id: 'automation', label: 'PACKAGE 02 — POPULAR', title: 'Automated Growth Engine', accent: 'cyan', icon: Bot, description: 'Automate routine inquiries, customer follow-ups, and booking workflows with integrated AI assistants.', highlights: ['Everything in Digital Launch', 'AI WhatsApp inquiry assistant', 'Automated CRM & billing sync'], path: '/packages/automation' },
  { id: 'custom', label: 'PACKAGE 03 — CUSTOM BUILD', title: 'Custom Business Platform', accent: 'orange', icon: Wrench, description: 'Tailored software architecture, custom portals, internal dashboards, and specialized workflows built for your business.', highlights: ['Tailored workflow architecture', 'Custom web & client portals', 'Dedicated technical support'], path: '/packages/custom' },
];

const STUDIO_VALUES = [
  { icon: Zap, title: 'Practical Engineering', description: 'We measure success in reliable software, time saved, and smooth operations — not confusing tech jargon.', color: 'var(--accent-orange)', bgColor: 'var(--accent-orange-glow)', borderColor: 'var(--border-color)' },
  { icon: Heart, title: 'Transparent Partnership', description: 'Fixed quotes, clear milestone delivery, and zero surprise fees.', color: 'var(--accent-cyan)', bgColor: 'var(--accent-cyan-glow)', borderColor: 'var(--border-color)' },
  { icon: Globe, title: 'Engineered in Jhansi, India', description: 'Headquartered in UP, India, serving regional MSMEs and growing businesses with direct engineering collaboration.', color: 'var(--accent-orange)', bgColor: 'var(--accent-orange-glow)', borderColor: 'var(--border-color)' },
];

const CONTACT_STEPS = [
  { label: 'Share Your Business Goals', sub: 'Tell us about your operations or growth targets' },
  { label: 'Free Strategy Call', sub: '15-minute consultation to map out your solution' },
  { label: 'Transparent Growth Plan', sub: 'Fixed scope, clear timeline, and predictable quote' },
  { label: 'Build & Scale Operations', sub: 'Phased delivery with full team training and launch' },
];

const MAP_PROVIDERS = [
  {
    id: 'google',
    name: 'Google Maps',
    url: 'https://www.google.com/maps/search/?api=1&query=Jhansi,+Uttar+Pradesh,+India',
    icon: '📍',
  },
  {
    id: 'apple',
    name: 'Apple Maps',
    url: 'https://maps.apple.com/?q=Jhansi,+Uttar+Pradesh,+India&ll=25.4484,78.5685',
    icon: '🍎',
  },
  {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://www.openstreetmap.org/search?query=Jhansi%20Uttar%20Pradesh#map=13/25.4484/78.5685',
    icon: '🗺️',
  },
];

function JhansiNeonMapCard() {
  const handleDefaultClick = () => {
    window.open(MAP_PROVIDERS[0].url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative glass-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden p-6 sm:p-8 flex flex-col justify-between border border-[var(--border-color)] hover:border-[var(--accent-orange)]/40 transition-all group shadow-xl">
      {/* Background Neon Grid & Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--accent-orange)] opacity-[0.08] blur-[60px] rounded-full pointer-events-none group-hover:opacity-[0.15] transition-opacity" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[var(--accent-cyan)] opacity-[0.06] blur-[60px] rounded-full pointer-events-none" />

      {/* Header telemetry badge */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[10px] font-mono uppercase tracking-widest text-[var(--accent-orange)] font-bold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange)] animate-ping" />
          Jhansi Node [25.44°N, 78.56°E]
        </div>
        <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider font-semibold">
          HQ / INDIA 🇮🇳
        </span>
      </div>

      {/* Main Interactive Neon Outline Map Graphic */}
      <div 
        onClick={handleDefaultClick}
        className="relative z-10 cursor-pointer w-full py-2 flex flex-col items-center justify-center group/map"
        title="Click to open Jhansi on Google Maps (Default)"
      >
        {/* Neon Vector Map Outline of India with glowing Jhansi node */}
        <div className="relative w-full max-w-[280px] h-[170px] flex items-center justify-center">
          <svg
            viewBox="0 0 300 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full filter drop-shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-transform duration-500 group-hover/map:scale-105"
          >
            {/* Background Grid Lines */}
            <pattern id="neon-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.4" />
            </pattern>
            <rect width="300" height="320" fill="url(#neon-grid)" opacity="0.5" />

            {/* Stylized Futuristic Outline Map of India */}
            <path
              d="M 125,25 L 140,28 L 155,20 L 165,30 L 175,45 L 195,50 L 210,65 L 235,75 L 245,90 L 230,105 L 240,120 L 255,125 L 270,135 L 260,150 L 245,155 L 230,145 L 215,160 L 205,175 L 195,190 L 180,215 L 165,240 L 150,270 L 142,295 L 138,295 L 130,265 L 120,240 L 105,215 L 90,195 L 80,180 L 70,170 L 55,165 L 45,150 L 50,135 L 60,125 L 75,120 L 85,105 L 95,95 L 100,75 L 110,60 L 115,40 Z"
              stroke="var(--accent-orange)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(245, 158, 11, 0.04)"
              className="transition-all duration-300 group-hover/map:stroke-[var(--accent-cyan)]"
            />

            {/* Tactical Grid / Lat-Long Lines */}
            <line x1="40" y1="130" x2="260" y2="130" stroke="var(--accent-orange)" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.3" />
            <line x1="138" y1="30" x2="138" y2="290" stroke="var(--accent-orange)" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.3" />

            {/* Jhansi Pulsing Beacon Node */}
            <g transform="translate(138, 130)">
              <circle r="22" fill="none" stroke="var(--accent-cyan)" strokeWidth="1" opacity="0.2" />
              <circle r="14" fill="none" stroke="var(--accent-orange)" strokeWidth="1.5" opacity="0.5" className="animate-ping" />
              <circle r="8" fill="var(--accent-orange)" opacity="0.3" />
              <circle r="4" fill="var(--accent-orange)" className="shadow-[0_0_12px_var(--accent-orange)]" />
              
              <g transform="translate(12, -8)">
                <rect x="0" y="-12" width="76" height="18" rx="4" fill="var(--bg-surface-elevated)" stroke="var(--accent-orange)" strokeWidth="1" opacity="0.95" />
                <text x="6" y="0" fill="var(--text-primary)" fontSize="9" fontFamily="monospace" fontWeight="bold">JHANSI HQ ↗</text>
              </g>
            </g>
          </svg>
        </div>

        {/* Action Callout Prompt */}
        <div className="mt-2 text-center">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--text-primary)] font-bold group-hover/map:text-[var(--accent-orange)] transition-colors flex items-center justify-center gap-1.5">
            Jhansi, UP, India <span className="text-[var(--accent-orange)] transition-transform group-hover/map:translate-x-1">↗</span>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mt-1">
            Serving Indian MSMEs &amp; Global Clients
          </div>
        </div>
      </div>

      {/* Map Provider Selection Bar */}
      <div className="relative z-20 mt-4 pt-4 border-t border-[var(--border-color)] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
          <span>Open Map In:</span>
          <span className="text-[var(--accent-orange)] font-bold">Default: Google Maps</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MAP_PROVIDERS.map((provider) => (
            <a
              key={provider.id}
              href={provider.url}
              target="_blank"
              rel="noreferrer"
              className="px-2 py-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--accent-orange)] hover:text-white border border-[var(--border-color)] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all text-[var(--text-primary)] shadow-sm hover:shadow-[0_0_12px_var(--accent-orange-glow)]"
              title={`Open Jhansi in ${provider.name}`}
            >
              <span>{provider.icon}</span>
              <span className="truncate">{provider.name.split(' ')[0]}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

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

          {/* ── SECTION 2: SERVICES ─────────────────────────────────────── */}
          <section id="services" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-20 sm:pt-32 lg:pt-40 pb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center md:text-left mb-12 sm:mb-16"
            >
              <div className="badge badge-active mb-4 font-mono text-[clamp(10px,1.5vw,12px)] md:mx-0 mx-auto">[SERVICES]</div>
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
              className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {SERVICES.map((svc) => (
                <motion.div
                  key={svc.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 sm:p-7 lg:p-8 rounded-3xl flex flex-col h-full overflow-hidden transition-all duration-300"
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

                  <div className="mt-auto pt-5 border-t border-[var(--border-color)] flex flex-col justify-between flex-grow">
                    <ul className="grid grid-cols-1 gap-y-2 mb-6">
                      {svc.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <CheckCircle size={14} className="shrink-0" style={{ color: svc.accentColor }} /> {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={svc.id === 'chatbots' ? '/services/chatbots' : svc.id === 'automation' ? '/services/automation' : '/services/web-design'}
                      className="btn btn-outline w-full text-center text-xs py-3 px-4 rounded-xl font-bold uppercase tracking-wider whitespace-nowrap min-w-0 flex items-center justify-center gap-2 group transition-all"
                      style={{ color: svc.accentColor, borderColor: svc.accentBorder }}
                    >
                      Explore Service <span className="transition-transform group-hover:translate-x-1">→</span>
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
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl"
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
                    className="glass-card p-6 sm:p-7 lg:p-8 flex flex-col group h-full justify-between rounded-3xl"
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

                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 sm:gap-3 mt-auto">
                      <Link
                        to={project.path}
                        className="btn btn-outline flex-1 text-center text-xs py-3 px-3 rounded-xl font-bold uppercase tracking-wider whitespace-nowrap min-w-0 flex items-center justify-center"
                        style={{ color: a.color, borderColor: a.border }}
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => scrollToId('contact')}
                        className="btn btn-primary flex-1 text-center text-xs py-3 px-3 rounded-xl font-bold uppercase tracking-wider shadow-xl whitespace-nowrap min-w-0 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${a.color} 0%, rgba(210, 193, 182, 0.8) 100%)` }}
                      >
                        Get Started
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>




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
                  Headquartered in <strong>Jhansi, Uttar Pradesh, India</strong>, Talos.design is built by engineers dedicated to delivering clean, reliable digital systems, custom websites, and practical automation for growing businesses.
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
                <JhansiNeonMapCard />
              </motion.div>
            </div>
          </section>

          {/* ── SECTION 5: CONTACT + FOOTER ─────────────────────────────────────── */}
          <section id="contact" className="container flex flex-col items-center md:items-start w-full min-h-[100dvh] justify-start pt-20 sm:pt-32 lg:pt-40 pb-32 md:pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[clamp(2rem,5vw,6rem)] w-full items-start"
            >
              <div>
                <div className="badge badge-active mb-6 font-mono text-xs">[START A PROJECT]</div>
                <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-display uppercase mb-6 leading-tight tracking-tight">Let's build your <br /><span className="text-gradient-orange text-glow-orange">Digital System</span></h2>
                <p className="text-[var(--text-secondary)] mb-12 max-w-md leading-relaxed opacity-90">
                  Tell us what you're trying to build. We'll review your requirements and respond with a practical technical proposal and fixed quote.
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
                id="contact-card"
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
                    <h3 className="text-2xl font-display font-bold mb-2">Inquiry Received</h3>
                    <p className="text-[var(--text-secondary)]">We'll review your project details and get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] font-semibold ml-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-all outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                          placeholder="John Smith"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] font-semibold ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-all outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] font-semibold ml-1">Company / Business Name</label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-all outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                        placeholder="Your business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] font-semibold ml-1">Tell us about your project</label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-orange)] transition-all outline-none resize-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
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
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <span>Send Project Inquiry</span>
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
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold">© 2026 TALOS.DESIGN — DIGITAL SYSTEMS &amp; AUTOMATION</div>
              <div className="flex gap-8">
                <button
                  onClick={() => scrollToId('hero')}
                  className="text-[10px] font-mono uppercase text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors tracking-widest"
                >
                  Back to Top
                </button>
                <Link to="/admin" className="text-[10px] font-mono uppercase text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors tracking-widest">Admin Portal</Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
