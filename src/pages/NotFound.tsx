import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageSquare, AlertTriangle } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function NotFound() {
  return (
    <div className="container py-24 sm:py-32 flex flex-col flex-grow items-center justify-center text-center relative z-10 w-full min-h-[70vh]">
      {/* Background Accent Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ backgroundColor: 'var(--accent-orange)' }}
        aria-hidden="true"
      />

      {/* Status Badge */}
      <motion.div
        {...fadeUp}
        className="badge font-mono text-xs text-amber-400 border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 mb-8 font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.15)]"
      >
        <AlertTriangle size={14} className="text-amber-400" />
        <span>ERROR 404 // ROUTE_NOT_FOUND</span>
      </motion.div>

      {/* Hero 404 Heading */}
      <motion.h1
        {...fadeUp}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-6xl sm:text-8xl md:text-9xl font-display font-bold tracking-tight mb-6 uppercase"
      >
        404 <span className="text-gradient-orange">Lost.</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        {...fadeUp}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-base sm:text-lg text-[var(--text-secondary)] max-w-md mx-auto mb-10 leading-relaxed"
      >
        The requested digital infrastructure coordinate does not exist or has been relocated.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4 w-full max-w-md"
      >
        <Link
          to="/"
          className="btn btn-primary py-3 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 flex-1 shadow-[0_0_20px_var(--accent-orange-glow)]"
        >
          <Home size={16} />
          Return Home
        </Link>
        <Link
          to="/contact"
          className="btn btn-outline py-3 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 flex-1"
        >
          <MessageSquare size={16} />
          Contact Studio
        </Link>
      </motion.div>

      {/* Secondary Helpful Links */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-14 pt-8 border-t border-[var(--border-color)] flex flex-wrap justify-center items-center gap-6 text-xs text-[var(--text-muted)] font-mono"
      >
        <span>Looking for something specific?</span>
        <Link to="/services" className="hover:text-[var(--accent-orange)] transition-colors underline underline-offset-4">
          Services
        </Link>
        <Link to="/packages" className="hover:text-[var(--accent-orange)] transition-colors underline underline-offset-4">
          Packages
        </Link>
        <Link to="/solutions" className="hover:text-[var(--accent-orange)] transition-colors underline underline-offset-4">
          Solutions
        </Link>
      </motion.div>
    </div>
  );
}
