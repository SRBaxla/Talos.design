import { LayoutGrid, Bot, Settings, CheckCircle, Globe, Wrench, Mail, Clock, Send, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { addInquiry } from '../admin/store/adminStore';
import { sendAutoResponderEmail } from '../lib/emailService';
import { scrollToProgress, SECTION_Z_PROGRESS } from '../utils/scrollUtils';
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
  magenta: { color: 'var(--accent-magenta)', glow: 'var(--accent-magenta-glow)', bg: 'var(--accent-magenta-glow)', border: 'var(--border-color)' },
};

interface ZSectionProps {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

// ── Scroll-snap section boundaries and snap targets ──────────────────────────
const SECTION_RANGES: [number, number][] = [
  [0, 0.2], [0.2, 0.4], [0.4, 0.6], [0.6, 0.8], [0.8, 1.0],
];
const SNAP_TARGETS = SECTION_RANGES.map(([s, e]) => (s + e) / 2); // center of each section

// ── Debounced idle-snap hook ─────────────────────────────────────────────────
// After user stops scrolling for IDLE_MS, auto-snap to nearest section center.
const IDLE_MS = 400;

function useIdleSnap() {
  const isSnapping = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snapToNearest = useCallback(() => {
    if (isSnapping.current) return;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const currentProgress = window.scrollY / scrollHeight;

    // Find nearest snap target
    let closest = 0;
    let minDist = Infinity;
    SNAP_TARGETS.forEach((t, i) => {
      const dist = Math.abs(currentProgress - t);
      if (dist < minDist) { minDist = dist; closest = i; }
    });

    // If already very close, skip
    const targetScroll = SNAP_TARGETS[closest] * scrollHeight;
    if (Math.abs(window.scrollY - targetScroll) < 3) return;

    isSnapping.current = true;

    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;
    const duration = Math.min(800, Math.max(400, Math.abs(distance) * 1.5));
    const startTime = performance.now();

    // Smooth cubic ease-out
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startScroll + distance * easeOut(t));

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        window.dispatchEvent(new CustomEvent('scroll-snap-sync', {
          detail: { progress: SNAP_TARGETS[closest] }
        }));
        setTimeout(() => { isSnapping.current = false; }, 100);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const handleScrollEnd = () => {
      if (isSnapping.current) return;
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(snapToNearest, IDLE_MS);
    };

    // Block default scroll during snap animation
    const handleWheel = (e: WheelEvent) => {
      if (isSnapping.current) e.preventDefault();
    };

    window.addEventListener('scroll', handleScrollEnd, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Sync from programmatic scroll (buttons, tracker dots)
    const handleSnapSync = () => {
      isSnapping.current = false;
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
    window.addEventListener('scroll-snap-sync', handleSnapSync);

    return () => {
      window.removeEventListener('scroll', handleScrollEnd);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll-snap-sync', handleSnapSync);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [snapToNearest]);
}

function ZSection({ children, progress, range }: ZSectionProps) {
  const [s, e] = range;
  const span = e - s;
  const isFirst = s === 0;
  const isLast = e === 1;

  // Near-continuous transitions: 40% enter → 20% hold → 40% exit
  const enterEnd = s + span * 0.4;
  const exitStart = e - span * 0.4;

  // Scale: ease in from 0.88, hold at 1, swoop out to 2.2
  const scale = useTransform(progress,
    [s, enterEnd, exitStart, e],
    [isFirst ? 1 : 0.88, 1, 1, isLast ? 1 : 2.2]
  );

  // Opacity: fade in smoothly, hold, fade out during exit
  const opacity = useTransform(progress,
    [s, enterEnd, exitStart, e],
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]
  );

  // Y offset: slide in from below, slide out upward
  const y = useTransform(progress,
    [s, enterEnd, exitStart, e],
    [isFirst ? 0 : 50, 0, 0, isLast ? 0 : -60]
  );

  // Blur: smooth entrance blur, more on exit for depth
  const blurValue = useTransform(progress,
    [s, enterEnd, exitStart, e],
    [isFirst ? 0 : 5, 0, 0, isLast ? 0 : 6]
  );
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  const pointerEvents = useTransform(progress, (v) =>
    v >= s && v <= e ? 'auto' : 'none'
  );

  return (
    <motion.div
      style={{
        scale,
        opacity,
        y,
        filter,
        pointerEvents: pointerEvents as any,
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Auto-snap: after user stops scrolling, snap to nearest section
  useIdleSnap();

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
    <>
      {/* Scroll Progress Tracker — replaces the old Navbar */}
      <ScrollTracker scrollProgress={scrollYProgress} />

      <div ref={containerRef} className="relative h-[300vh] w-full bg-transparent">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-transparent">

        {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
        <ZSection progress={scrollYProgress} range={[0, 0.2]}>
          <section id="hero" className="relative w-full flex flex-col items-center justify-center px-6">
            <div className="container relative z-10 flex flex-col items-center py-10 md:py-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-online mb-6 md:mb-10 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
              >
                Systems Online
              </motion.div>

              <h1 className="text-4xl md:text-7xl lg:text-8xl text-center mb-4 md:mb-6 max-w-5xl tracking-tight leading-[1.1]">
                Engineering the <br />
                <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(236,204,110,0.2)]">Future of Work</span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-secondary)] text-center max-w-2xl leading-relaxed mb-8 md:mb-10">
                We deploy intelligent agents and automate your critical workflows.
                Scale your ambition with digital infrastructure built for tomorrow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToProgress(SECTION_Z_PROGRESS.contact)}
                  className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)] text-sm md:text-base"
                >
                  Book a Free Call
                </button>
                <button
                  onClick={() => scrollToProgress(SECTION_Z_PROGRESS.packages)}
                  className="btn btn-outline py-3 px-8 text-sm md:text-base"
                >
                  See Our Packages
                </button>
              </div>
            </div>
          </section>
        </ZSection>

        {/* ── SECTION 2: SOLUTIONS ────────────────────────────────────── */}
        <ZSection progress={scrollYProgress} range={[0.2, 0.4]}>
          <section id="solutions" className="container flex flex-col items-center px-6">
            <div className="text-center mb-4 md:mb-8">
              <div className="badge badge-active mb-2 md:mb-4 font-mono text-xs mx-auto">[SOLUTIONS]</div>
              <h2 className="text-2xl md:text-5xl font-display uppercase mb-2 md:mb-3">Built for <span className="text-gradient-orange">Performance</span></h2>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-xs md:text-sm">Three focused services delivered end-to-end for businesses that want results.</p>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
              {SERVICES.map((svc) => (
                <div key={svc.id} className="glass-panel p-3 md:p-5 rounded-2xl flex flex-col" style={{ borderColor: svc.accentBorder }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: svc.accentBg, border: `1px solid ${svc.accentBorder}` }}>
                      <svc.icon size={16} style={{ color: svc.accentColor }} />
                    </div>
                    <div>
                      <h3 className="text-base font-display uppercase font-bold leading-tight">{svc.title}</h3>
                      <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">{svc.number}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium mb-2" style={{ color: svc.accentColor }}>{svc.benefit}</p>
                  <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed mb-3">{svc.description}</p>
                  <div className="mt-auto pt-3 border-t border-[var(--border-color)]">
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
                      {svc.features.map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                          <CheckCircle size={10} className="shrink-0" style={{ color: svc.accentColor }} /> {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/services/${svc.id}`}
                      className="text-[11px] font-semibold transition-colors hover:brightness-125 flex items-center gap-1"
                      style={{ color: svc.accentColor }}
                    >
                      Learn More <span className="text-xs">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ZSection>

        {/* ── SECTION 3: PACKAGES ─────────────────────────────────────── */}
        <ZSection progress={scrollYProgress} range={[0.4, 0.6]}>
          <section id="packages" className="container flex flex-col items-center px-6">
            <div className="text-center mb-4 md:mb-8">
              <div className="badge badge-active mb-2 md:mb-4 font-mono text-xs mx-auto">[PACKAGES]</div>
              <h2 className="text-2xl md:text-5xl font-display uppercase mb-2 md:mb-3">Choose Your <span className="text-[var(--accent-cyan)]">Setup</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-6xl">
              {PROJECTS.map((project) => {
                const a = accentMap[project.accent];
                return (
                  <div key={project.id} className="glass-panel p-4 md:p-6 flex flex-col group" style={{ borderColor: a.border }}>
                    <span className="text-[10px] font-mono uppercase tracking-widest mb-2 md:mb-4" style={{ color: a.color }}>{project.label}</span>
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: a.bg }}>
                        <project.icon size={20} style={{ color: a.color }} />
                      </div>
                      <h3 className="text-lg font-display font-bold">{project.title}</h3>
                    </div>
                    <p className="text-[var(--text-secondary)] text-xs mb-2 md:mb-4 flex-grow">{project.description}</p>
                    <div className="flex gap-2">
                      <Link
                        to={project.path}
                        className="btn btn-outline flex-1 text-center text-xs py-2"
                        style={{ color: a.color, borderColor: a.border }}
                      >
                        Learn More
                      </Link>
                      <button
                        onClick={() => scrollToProgress(SECTION_Z_PROGRESS.contact)}
                        className="btn btn-primary flex-1 text-center text-xs py-2"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </ZSection>

        {/* ── SECTION 4: STUDIO ───────────────────────────────────────── */}
        <ZSection progress={scrollYProgress} range={[0.6, 0.8]}>
          <section id="studio" className="container flex flex-col items-center px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center w-full max-w-5xl">
              <div>
                <div className="badge badge-online mb-6 shadow-[0_0_15px_rgba(34,197,94,0.2)]">The Studio</div>
                <h2 className="text-3xl md:text-5xl font-display uppercase mb-6 leading-tight">We Are <span className="text-gradient-orange">Talos</span></h2>
                <p className="text-base md:text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                  Based in India, we engineer high-performance digital systems for ambitious businesses worldwide.
                </p>
                <div className="flex flex-col gap-4">
                  {STUDIO_VALUES.map(val => (
                    <div key={val.title} className="flex gap-4 items-start p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)]">
                      <val.icon className="shrink-0 mt-1" size={18} style={{ color: val.color }} />
                      <div>
                        <h4 className="font-bold text-sm mb-1">{val.title}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{val.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/about"
                  className="btn btn-outline mt-6 text-sm py-2 px-6 inline-flex items-center gap-2"
                >
                  About Us <span>→</span>
                </Link>
              </div>

              <div className="relative glass-panel rounded-3xl overflow-hidden flex items-center justify-center p-8 md:p-12" style={{ minHeight: '280px' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange-glow)] to-transparent opacity-20" />
                <div className="relative z-10 text-center">
                  <div className="text-5xl md:text-6xl mb-4">🇮🇳</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Engineered in India</div>
                </div>
              </div>
            </div>
          </section>
        </ZSection>

        {/* ── SECTION 5: CONTACT ──────────────────────────────────────── */}
        <ZSection progress={scrollYProgress} range={[0.8, 1.0]}>
          <section id="contact" className="container px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">We're available</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-display tracking-tight mb-4 uppercase">Let's <span className="text-gradient-orange">Talk.</span></h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7">
                  <form className="glass-panel p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-2 text-sm focus:border-[var(--accent-orange)] transition-colors text-white"
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-2 text-sm focus:border-[var(--accent-orange)] transition-colors text-white"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company / Business Name"
                      className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-2 text-sm focus:border-[var(--accent-orange)] transition-colors text-white"
                    />
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project..."
                      rows={3}
                      className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md px-4 py-2 text-sm focus:border-[var(--accent-orange)] transition-colors text-white resize-none"
                    />
                    <button
                      type="submit"
                      disabled={isTransmitting}
                      className="btn btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
                    >
                      {status === 'success' ? <><CheckCircle size={16} /> Sent!</> : isTransmitting ? 'Sending...' : <><Send size={16} /> Send</>}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="glass-panel p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-orange-glow)] flex items-center justify-center shrink-0"><Mail className="text-[var(--accent-orange)]" size={18} /></div>
                    <div>
                      <h4 className="text-xs font-bold mb-1">Email us</h4>
                      <a href="mailto:hello@talos.design" className="text-[var(--accent-orange)] text-xs font-mono">hello@talos.design</a>
                    </div>
                  </div>
                  <div className="glass-panel p-4">
                    <h4 className="text-xs font-bold mb-4 flex items-center gap-2"><Clock size={12} className="text-[var(--accent-magenta)]" /> Process</h4>
                    <div className="flex flex-col gap-3">
                      {CONTACT_STEPS.map((step, i) => (
                        <div key={step.label} className="flex gap-3">
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">0{i + 1}</span>
                          <div className="text-[10px] font-bold text-white">{step.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <footer className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between border-t border-[var(--border-color)] opacity-40">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 md:mb-0">© 2026 TALOS DESIGN</div>
                <div className="flex gap-8">
                  <button
                    onClick={() => scrollToProgress(SECTION_Z_PROGRESS.hero)}
                    className="text-[10px] font-mono uppercase hover:text-[var(--accent-orange)]"
                  >
                    Back to Top
                  </button>
                  <Link to="/admin" className="text-[10px] font-mono uppercase hover:text-[var(--accent-orange)]">Admin</Link>
                </div>
              </footer>
            </div>
          </section>
        </ZSection>

        </div>
      </div>
    </>
  );
}
