import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FeaturedCaseStudies } from '../components/FeaturedCaseStudies';

export default function Home() {
  return (
    <div className="flex flex-col flex-grow w-full">

      {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
      <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
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
            <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Future of Work</span>
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
            <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)]">
              Book a Free Call
            </Link>
            <Link to="/projects" className="btn btn-outline py-3 px-8">
              See Our Packages
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── SECTION 2: WHAT WE BUILD ────────────────────────────────── */}
      <div className="container py-24 flex flex-col items-center flex-grow relative z-10">

        <FeaturedCaseStudies />

        {/* ── SECTION 3: PROOF STRIP ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-5xl mt-28"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]" />
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Industries & Live Work</span>
          </div>
          <h2 className="text-4xl font-display uppercase tracking-tight mb-12">
            Who We Build <span className="text-[var(--accent-cyan)]">For</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left — Industry verticals */}
            <div className="flex flex-col gap-4">
              {[
                { label: 'Hospitality', desc: 'Hotels, restaurants, booking engines & guest CRM systems.', to: '/offers/hospitality', color: 'rgba(69,104,130,0.2)', border: 'rgba(69,104,130,0.4)' },
                { label: 'E-Commerce', desc: 'High-converting stores, payment integration & inventory management.', to: '/offers/ecommerce', color: 'rgba(210,193,182,0.1)', border: 'rgba(210,193,182,0.3)' },
                { label: 'Professional Services', desc: 'Client portals, scheduling, AI assistants & custom SaaS tools.', to: '/offers/professional', color: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="glass-panel p-5 flex items-center justify-between group hover:-translate-y-1 transition-all duration-200"
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
                  <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                </Link>
              ))}
            </div>

            {/* Right — Featured live project */}
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
                  Complete digital overhaul for a 40-room boutique hotel — custom website, booking engine, real-time availability dashboard, guest CRM, and automated email/SMS notifications.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {['Website', 'Booking', 'CRM', 'Notifications'].map(tag => (
                    <span key={tag} className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-primary)]">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] font-mono">Presence + Automation · 6 week build</span>
                  <a href="https://jhansi-hotel.web.app/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-orange)] font-medium hover:text-white transition-colors">
                    View Live <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* ── SECTION 4: CTA ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-5xl mt-28 mb-16 border border-[var(--border-color)] p-10 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl bg-[rgba(255,255,255,0.01)] backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(210,193,182,0.04)] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl font-display mb-2">Ready to automate?</h2>
            <p className="text-[var(--text-secondary)]">Schedule a free consultation to discuss your infrastructure.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)]">Book a Call</Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

