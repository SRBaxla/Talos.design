import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, ShoppingCart, CalendarClock, Cpu, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const SOLUTIONS = [
  {
    id: 'hospitality',
    badge: 'HOSPITALITY SUITE',
    title: 'Hotel & Restaurant Systems',
    color: 'var(--accent-cyan)',
    glow: 'var(--accent-cyan-glow)',
    bg: 'rgba(0,229,255,0.08)',
    border: 'rgba(0,229,255,0.25)',
    icon: Building,
    description:
      'Direct booking engines, room galleries, QR digital menus, and availability dashboards engineered to eliminate third-party OTA commissions for hotels, resorts, and restaurants.',
    highlights: [
      'Commission-free direct booking engine',
      'Instant WhatsApp booking integration',
      'QR-code dynamic digital menus',
      'Real-time staff availability dashboard',
    ],
    cta: 'Explore Hospitality Suite',
    path: '/solutions/hospitality',
  },
  {
    id: 'ecommerce',
    badge: 'RETAIL & COMMERCE',
    title: 'Online Stores & Brand Sites',
    color: 'var(--accent-orange)',
    glow: 'var(--accent-orange-glow)',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    icon: ShoppingCart,
    description:
      'High-converting storefronts connected to product catalogs, real-time warehouse inventory tracking, multi-payment gateways, and automated marketing flows.',
    highlights: [
      'Sub-second catalog browsing & checkout',
      'Real-time stock & inventory sync',
      'Secure multi-currency payment integration',
      'Automated marketing & cart recovery',
    ],
    cta: 'Explore Commerce Suite',
    path: '/solutions/ecommerce',
  },
  {
    id: 'appointments',
    badge: 'APPOINTMENT PLATFORM',
    title: 'Appointment & Booking Platforms',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.4)',
    bg: 'rgba(192,132,252,0.08)',
    border: 'rgba(192,132,252,0.25)',
    icon: CalendarClock,
    description:
      'Automated scheduling, 24/7 client booking, client portals, and inquiry handling built for clinics, salons, wellness practices, consultancies, and slot-driven businesses.',
    highlights: [
      '24/7 automated slot scheduling',
      'Client portal & document management',
      'AI assistant for inquiries & FAQs',
      'Automated reminder notifications',
    ],
    cta: 'Explore Booking Platform',
    path: '/solutions/appointments',
  },
  {
    id: 'medilife',
    badge: 'HEALTHCARE PLATFORM',
    title: 'MediLife Diagnostic Clinic Platform',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.4)',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.25)',
    icon: Cpu,
    description:
      'Complete diagnostic lab software platform featuring branded online test booking, pathologist peer-review verification, and 1-click WhatsApp PDF report delivery.',
    highlights: [
      'Branded online clinic storefront',
      'Pathologist peer-review gatekeeper',
      '1-Click NABL PDF WhatsApp dispatch',
      '100% direct margins without aggregator cuts',
    ],
    cta: 'Explore Clinic Platform',
    path: '/solutions/medilife',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Solutions() {
  return (
    <div className="container py-16 flex flex-col flex-grow items-center">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="badge badge-active mb-8 font-mono text-xs text-[var(--accent-cyan)] border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.1)]"
      >
        [SOLUTIONS: VERTICAL SOFTWARE]
      </motion.div>

      {/* Hero */}
      <motion.h1
        {...fadeUp}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-5xl md:text-7xl font-display tracking-tight mb-6 text-center"
      >
        Industry <span className="text-gradient-orange">Solutions.</span>
      </motion.h1>

      <motion.p
        {...fadeUp}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl text-[var(--text-secondary)] text-center max-w-2xl mb-16 leading-relaxed"
      >
        Pre-engineered, modular software systems and vertical platforms tailored for specific business models. Deploy customized digital infrastructure with ongoing technical support and zero third-party commissions.
      </motion.p>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mb-20">
        {SOLUTIONS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
            className="glass-panel p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group hover:border-opacity-60 transition-all duration-300 rounded-3xl"
            style={{ borderColor: item.border }}
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute top-0 right-0 w-56 h-56 rounded-full blur-[90px] opacity-[0.06] pointer-events-none group-hover:opacity-[0.14] transition-opacity"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col flex-grow">
              {/* Header Badge + Icon */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span
                  className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border font-bold"
                  style={{ color: item.color, borderColor: item.border, backgroundColor: item.bg }}
                >
                  {item.badge}
                </span>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ backgroundColor: item.bg, borderColor: item.border }}
                >
                  <item.icon size={22} style={{ color: item.color }} />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 tracking-tight text-[var(--text-primary)]">
                {item.title}
              </h2>

              {/* Description */}
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Highlights */}
              <ul className="flex flex-col gap-2.5 mb-8 flex-grow">
                {item.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: item.color }} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                to={item.path}
                className="btn btn-outline w-full flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase tracking-wider py-3 rounded-xl"
                style={{
                  borderColor: item.border,
                  color: item.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = item.bg;
                  e.currentTarget.style.boxShadow = `0 0 20px ${item.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {item.cta} <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Consultation Banner */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="glass-panel p-8 md:p-10 max-w-4xl w-full text-center rounded-3xl border border-[var(--border-color)] flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[var(--accent-orange)]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-orange)] font-bold">
            CUSTOM VERTICAL DEPLOYMENTS
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-display font-bold mb-3 text-[var(--text-primary)]">
          Operating in a different industry?
        </h3>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xl mb-6">
          We engineer bespoke digital systems, custom ERP connectors, and tailored operational platforms for unique business workflows.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/contact" className="btn btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-bold">
            Discuss Your Setup
          </Link>
          <Link to="/packages/custom" className="btn btn-outline py-2.5 px-6 text-xs uppercase tracking-wider font-bold">
            Configure Custom Build
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
