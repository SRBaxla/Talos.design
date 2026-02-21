import { LayoutGrid, Bot, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col flex-grow w-full">

      {/* HERO SECTION */}
      <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.05)]">

        {/* HERO CONTENT */}
        <div className="container relative z-10 flex flex-col items-center pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge badge-online mb-12 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
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
            className="text-xl text-[var(--text-secondary)] text-center max-w-3xl leading-relaxed py-4 backdrop-blur-sm rounded-3xl"
          >
            We deploy intelligent agents and automate your critical workflows with
            cutting-edge AI solutions. Scale your ambition with digital infrastructure
            built for tomorrow.
          </motion.p>
        </div>
      </div>

      {/* REST OF PAGE CONTENT */}
      <div className="container py-24 flex flex-col items-center flex-grow relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 flex flex-col transition-all duration-300 hover:border-[var(--accent-orange)] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-2 group"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[var(--accent-orange)] group-hover:scale-110 shadow-[0_0_15px_rgba(245,158,11,0.0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
                <LayoutGrid size={24} />
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] border border-[var(--border-color)] px-2 py-1 rounded">01</span>
            </div>
            <h3 className="text-2xl mb-4 font-display">Web Design</h3>
            <p className="text-[var(--text-secondary)] mb-12 flex-grow text-sm leading-relaxed">
              High-performance interfaces designed for conversion. We build responsive, accessible, and fast web applications that serve as the foundation of your digital presence.
            </p>

            <div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">Technology Stack</div>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Next.js</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Tailwind</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Framer Motion</span>
              </div>
              <Link to="/services" className="inline-flex items-center text-[var(--accent-orange)] font-medium text-sm hover:text-[var(--accent-orange-hover)] transition-colors">
                Explore Architecture <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 flex flex-col transition-all duration-300 hover:border-[var(--accent-orange)] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-2 group"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[var(--accent-orange)] group-hover:scale-110 shadow-[0_0_15px_rgba(245,158,11,0.0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
                <Bot size={24} />
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] border border-[var(--border-color)] px-2 py-1 rounded">02</span>
            </div>
            <h3 className="text-2xl mb-4 font-display">AI Chatbots</h3>
            <p className="text-[var(--text-secondary)] mb-12 flex-grow text-sm leading-relaxed">
              Intelligent agents that handle customer support 24/7. Our custom LLM implementations understand context, intent, and your specific business knowledge base.
            </p>

            <div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">Technology Stack</div>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">OpenAI API</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">LangChain</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Pinecone</span>
              </div>
              <Link to="/services" className="inline-flex items-center text-[var(--accent-orange)] font-medium text-sm hover:text-[var(--accent-orange-hover)] transition-colors">
                View Integration <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 flex flex-col transition-all duration-300 hover:border-[var(--accent-orange)] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-2 group"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[var(--accent-orange)] group-hover:scale-110 shadow-[0_0_15px_rgba(245,158,11,0.0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
                <Settings size={24} />
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] border border-[var(--border-color)] px-2 py-1 rounded">03</span>
            </div>
            <h3 className="text-2xl mb-4 font-display">System Automation</h3>
            <p className="text-[var(--text-secondary)] mb-12 flex-grow text-sm leading-relaxed">
              Eliminate manual data entry and repetitive tasks. We connect disparate apps and databases to create seamless, automated workflows that save hundreds of hours.
            </p>

            <div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">Technology Stack</div>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Python</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Zapier</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">AWS Lambda</span>
              </div>
              <Link to="/services" className="inline-flex items-center text-[var(--accent-orange)] font-medium text-sm hover:text-[var(--accent-orange-hover)] transition-colors">
                See Workflows <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ═══════ CASE STUDY — Project Types We Can Build ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-5xl mt-32"
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Case Studies</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <h2 className="text-4xl font-display uppercase tracking-tight">
              What We Can <span className="text-[var(--accent-cyan)]">Create</span>
            </h2>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm text-[var(--accent-cyan)] font-medium hover:text-white transition-colors"
            >
              Explore All Services <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case 1 — Hospitality */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 flex flex-col group hover:border-[rgba(0,229,255,0.3)] transition-all"
            >
              <span className="text-[10px] font-mono bg-[rgba(0,229,255,0.1)] text-[var(--accent-cyan)] px-3 py-1 rounded-full border border-[rgba(0,229,255,0.2)] self-start mb-5">Hospitality</span>
              <h3 className="text-lg font-display font-bold mb-2">Hotel & Restaurant Systems</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 flex-grow">
                Automated booking engines, reservation management, guest CRM, menu systems, and real-time availability dashboards for hospitality businesses.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-muted)]">Booking</span>
                <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-muted)]">CRM</span>
                <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-muted)]">Dashboard</span>
              </div>
              <Link to="/projects/automation" className="text-xs text-[var(--accent-cyan)] flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn More <ArrowRight size={12} />
              </Link>
            </motion.div>

            {/* Case 2 — E-Commerce */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 flex flex-col group hover:border-[rgba(245,158,11,0.3)] transition-all"
            >
              <span className="text-[10px] font-mono bg-[rgba(245,158,11,0.1)] text-[var(--accent-orange)] px-3 py-1 rounded-full border border-[rgba(245,158,11,0.2)] self-start mb-5">E-Commerce</span>
              <h3 className="text-lg font-display font-bold mb-2">Online Stores & Brand Sites</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 flex-grow">
                High-converting storefronts, product catalogs, payment integration, inventory management, and marketing automation for online retail.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-muted)]">Storefront</span>
                <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-muted)]">Payments</span>
                <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-muted)]">SEO</span>
              </div>
              <Link to="/projects/presence" className="text-xs text-[var(--accent-orange)] flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn More <ArrowRight size={12} />
              </Link>
            </motion.div>

            {/* Case 3 — Professional Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6 flex flex-col group hover:border-[rgba(192,132,252,0.3)] transition-all"
            >
              <span className="text-[10px] font-mono bg-[rgba(192,132,252,0.1)] text-[#c084fc] px-3 py-1 rounded-full border border-[rgba(192,132,252,0.2)] self-start mb-5">Professional Services</span>
              <h3 className="text-lg font-display font-bold mb-2">Consultation & SaaS Platforms</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 flex-grow">
                Appointment scheduling, client portals, document management, AI chatbots, and custom workflow automation for service-based businesses.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-muted)]">Scheduling</span>
                <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-muted)]">AI Chat</span>
                <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-muted)]">Workflow</span>
              </div>
              <Link to="/projects/custom" className="text-xs text-[#c084fc] flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn More <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ═══════ PUBLISHED PROJECTS — Completed Portfolio ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-5xl mt-32"
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]"></span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Published Projects</span>
          </div>
          <h2 className="text-4xl font-display uppercase tracking-tight mb-3">
            Delivered & <span className="text-[var(--accent-orange)]">Live</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-12 max-w-2xl">
            Projects we've built, delivered, and deployed. Each one is live and running in production.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portfolio 1 — Hotel Website */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 flex flex-col group hover:border-[rgba(245,158,11,0.3)] transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-orange)] opacity-[0.04] blur-[60px] rounded-full pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono bg-[rgba(34,197,94,0.1)] text-green-400 px-3 py-1 rounded-full border border-[rgba(34,197,94,0.2)]">● Live</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Delivered Dec 2025</span>
                </div>
                <h3 className="text-lg font-display font-bold mb-2">Boutique Hotel — Full Digital Suite</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Complete digital overhaul for a 40-room boutique hotel. Includes custom website, booking engine, real-time availability dashboard, guest CRM, and automated email/SMS notifications.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--accent-cyan)]">Website</span>
                  <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--accent-cyan)]">Booking</span>
                  <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--accent-cyan)]">CRM</span>
                  <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--accent-cyan)]">Notifications</span>
                </div>
                <div className="flex items-center gap-6 text-xs text-[var(--text-muted)] font-mono">
                  <span>Presence + Automation</span>
                  <span>•</span>
                  <span>6 week build</span>
                </div>
              </div>
            </motion.div>

            {/* Portfolio 2 — Talos.design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 flex flex-col group hover:border-[rgba(0,229,255,0.3)] transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-cyan)] opacity-[0.04] blur-[60px] rounded-full pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono bg-[rgba(34,197,94,0.1)] text-green-400 px-3 py-1 rounded-full border border-[rgba(34,197,94,0.2)]">● Live</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Delivered Feb 2026</span>
                </div>
                <h3 className="text-lg font-display font-bold mb-2">Talos.design — Studio Portfolio</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Our own studio website. Built with React, Framer Motion, and a custom design system. Features dynamic project pages, interactive pricing calculator, and a fully responsive dark-mode interface.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--accent-cyan)]">React</span>
                  <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--accent-cyan)]">Framer Motion</span>
                  <span className="text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--accent-cyan)]">Design System</span>
                </div>
                <div className="flex items-center gap-6 text-xs text-[var(--text-muted)] font-mono">
                  <span>Custom Build</span>
                  <span>•</span>
                  <span>4 week build</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-5xl mt-32 border border-[var(--border-color)] p-10 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 rounded-3xl bg-[rgba(255,255,255,0.01)] backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(245,158,11,0.03)] to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl font-display mb-2">Ready to automate?</h2>
            <p className="text-[var(--text-secondary)]">Schedule a free consultation to discuss your infrastructure.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Link to="/pricing" className="btn btn-outline py-3 px-8">View Pricing</Link>
            <Link to="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)]">Book a Call</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
