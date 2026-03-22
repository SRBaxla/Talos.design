import { motion, useMotionValueEvent, MotionValue, AnimatePresence, useSpring } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { scrollToId } from '../utils/scrollUtils';

const SECTIONS = [
  { id: 'hero', label: 'Home', progress: 0.0 },
  { id: 'solutions', label: 'Solutions', progress: 0.25 },
  { id: 'packages', label: 'Packages', progress: 0.5 },
  { id: 'studio', label: 'Studio', progress: 0.75 },
  { id: 'contact', label: 'Contact', progress: 1.0 },
];

interface ScrollTrackerProps {
  scrollProgress: MotionValue<number>;
  isDarkMode: boolean;
}

export function ScrollTracker({ scrollProgress, isDarkMode }: ScrollTrackerProps) {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dragHoveredIndex, setDragHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0% -60% 0%', // Equivalent to checking if top is <= 40% of viewport
      threshold: 0
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = SECTIONS.findIndex(s => s.id === entry.target.id);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    SECTIONS.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Track scroll progress for the percentage indicator only
  useMotionValueEvent(scrollProgress, 'change', (v) => {
    setProgress(v);
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDotClick = useCallback((index: number) => {
    scrollToId(SECTIONS[index].id);
    if (isMobile) setIsMobileOpen(false);
  }, [isMobile]);

  const radius = 120;
  const pathLength = Math.PI * radius;

  // Drive arc progress from activeIndex — the most reliable source of truth.
  // activeIndex is already computed from actual DOM section positions,
  // so it perfectly tracks snap-scroll behavior without overshoot.
  const arcMotionValue = useSpring(0, { stiffness: 60, damping: 18, restDelta: 0.001 });
  const [strokeDashoffset, setStrokeDashoffset] = useState(pathLength);

  // Update the spring target whenever activeIndex changes
  useEffect(() => {
    const targetProgress = activeIndex / (SECTIONS.length - 1);
    arcMotionValue.set(targetProgress);
  }, [activeIndex, arcMotionValue]);

  // Subscribe to the spring value and compute strokeDashoffset
  useMotionValueEvent(arcMotionValue, 'change', (v) => {
    setStrokeDashoffset(pathLength - v * pathLength);
  });


  // Mobile constants
  const mobileRadius = 100; // Refined for a tighter, more compact feel
  const mobileArcStart = Math.PI; // Starts at 9 o'clock (180 deg)
  const mobileArcSpan = Math.PI; // Full semi-circle sweep (180 deg fanned over the top)

  return (
    <>

      {/* ── Desktop Semi-Circle Scroll Tracker (right edge) ─────────────────── */}
      {!isMobile && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-end pointer-events-none hidden md:flex"
          style={{ width: `${radius + 80}px`, height: `${radius * 2 + 80}px` }}
        >
          {/* SVG Semi-Circle Track */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2" style={{ width: `${radius}px`, height: `${radius * 2}px` }}>
            <svg width={radius} height={radius * 2} className="overflow-visible absolute right-6">
              <defs>
                <linearGradient id="tracker-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-orange)" />
                  <stop offset="100%" stopColor="var(--accent-cyan)" />
                </linearGradient>
                <filter id="tracker-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background path */}
              <path
                d={`M ${radius} 0 A ${radius} ${radius} 0 0 0 ${radius} ${radius * 2}`}
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="1"
                opacity="0.4"
              />

               <motion.path
                d={`M ${radius} 0 A ${radius} ${radius} 0 0 0 ${radius} ${radius * 2}`}
                fill="none"
                stroke="url(#tracker-gradient)"
                strokeWidth="2"
                strokeDasharray={pathLength}
                strokeDashoffset={strokeDashoffset}
                filter="url(#tracker-glow)"
              />
            </svg>
          </div>

          {/* Section dots placed along the curve */}
          {SECTIONS.map((section, i) => {
            const isActive = i === activeIndex;
            const isHovered = i === hoveredIndex;
            const t = i / (SECTIONS.length - 1); // 0 to 1
            const angle = t * Math.PI; // 0 to PI

            // Center of the circle is at x = radius (right edge of svg), y = 0 relative to the center
            const yOffset = -radius * Math.cos(angle);
            const xOffset = -radius * Math.sin(angle);

            return (
              <div
                key={section.id}
                className="absolute flex items-center justify-center pointer-events-auto cursor-pointer group"
                style={{
                  top: `calc(50% + ${yOffset}px)`,
                  right: `calc(1.5rem + ${-xOffset}px)`, // 1.5rem = right-6 exactly matching SVG position
                  width: '48px', // Significantly larger hit area (w-12 block)
                  height: '48px',
                  transform: 'translate(50%, -50%)',
                }}
                onClick={() => handleDotClick(i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Section label (appears on hover or when active) */}
                <motion.div
                  className="absolute right-[100%] mr-2 whitespace-nowrap pointer-events-none"
                  initial={false}
                  animate={{
                    opacity: isActive || isHovered ? 1 : 0,
                    x: isActive || isHovered ? 0 : 8,
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <span
                    className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] px-3 py-1.5 rounded-md"
                    style={{
                      color: isActive ? 'var(--accent-orange)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-orange-glow)' : 'rgba(10, 15, 25, 0.7)',
                      border: `1px solid ${isActive ? 'var(--accent-orange)' : 'var(--border-color)'}`,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {section.label}
                  </span>
                </motion.div>

                {/* Central visible dot - scaled up */}
                <motion.div
                  className="rounded-full relative"
                  initial={false}
                  animate={{
                    width: isActive ? 14 : isHovered ? 10 : 8,
                    height: isActive ? 14 : isHovered ? 10 : 8,
                    backgroundColor: isActive ? 'var(--accent-orange)' : 'var(--text-muted)',
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{
                    boxShadow: isActive
                      ? '0 0 12px var(--accent-orange), 0 0 24px var(--accent-orange-glow)'
                      : isHovered
                        ? '0 0 8px var(--text-muted)'
                        : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Mobile Expanding Bottom Orb Tracker ────────────────────────────── */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] flex items-end justify-center pointer-events-none pb-10 overflow-visible">
          {/* Transparent hit area overlay for closing when clicking outside the expanded menu */}
          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                style={{ zIndex: -1 }}
              />
            )}
          </AnimatePresence>

          <div className="relative w-0 h-0 pointer-events-auto overflow-visible flex items-center justify-center">

            {/* Expanded Arc Container */}
            <AnimatePresence>
              {isMobileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", damping: 25, stiffness: 250 }}
                  className="absolute left-50 top-50"
                  style={{
                    width: `${mobileRadius * 2}px`,
                    height: `${mobileRadius * 2}px`,
                    transform: 'translate(-50%, -50%)', // Center the box exactly on the button center
                    pointerEvents: 'none'
                  }}
                >
                  {/* Arc SVG - Centered Upward Semi-Circle */}
                  <svg width={mobileRadius * 2} height={mobileRadius * 2} className="absolute inset-0 overflow-visible" style={{ pointerEvents: 'none' }}>
                    <path
                      d={`M 0 ${mobileRadius} A ${mobileRadius} ${mobileRadius} 0 0 1 ${mobileRadius * 2} ${mobileRadius}`}
                      fill="none"
                      stroke="var(--border-color)"
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  </svg>

                  {/* Nodes along the top arc */}
                  {SECTIONS.map((section, i) => {
                    const isActive = i === activeIndex;
                    const t = i / (SECTIONS.length - 1);
                    // Angle from 180 deg (Left) to 360 deg (Right) -> Math.PI to Math.PI * 2
                    const angle = mobileArcStart + t * mobileArcSpan;

                    const xOffset = mobileRadius + mobileRadius * Math.cos(angle);
                    const yOffset = mobileRadius + mobileRadius * Math.sin(angle);

                    return (
                      <div
                        key={section.id}
                        data-section-index={i}
                        className="absolute flex flex-col-reverse items-center justify-center gap-2 cursor-pointer pointer-events-auto"
                        style={{
                          left: `${xOffset}px`,
                          top: `${yOffset}px`,
                          transform: 'translate(-50%, -50%)',
                          width: '80px',
                          height: '80px'
                        }}
                        onClick={(e) => { e.stopPropagation(); handleDotClick(i); }}
                      >
                        <motion.div
                          className="rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border transition-all shrink-0"
                          style={{
                            width: (isActive || dragHoveredIndex === i) ? '18px' : '10px',
                            height: (isActive || dragHoveredIndex === i) ? '18px' : '10px',
                            backgroundColor: (isActive || dragHoveredIndex === i) ? 'var(--accent-orange)' : 'var(--bg-surface-elevated)',
                            borderColor: (isActive || dragHoveredIndex === i) ? '#fff' : 'var(--border-color)',
                            boxShadow: (isActive || dragHoveredIndex === i) ? '0 0 15px var(--accent-orange)' : 'none'
                          }}
                        />
                        <span className="text-[10px] font-mono tracking-widest uppercase transition-colors duration-200 text-center whitespace-nowrap"
                          style={{ color: (isActive || dragHoveredIndex === i) ? 'var(--text-primary)' : 'var(--text-muted)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                          {section.label}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Central Orb Button Hit Area Wrapper */}
            <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10 touch-none"
              onPointerDown={(e) => {
                e.stopPropagation();
                setIsMobileOpen(true);
                setDragHoveredIndex(null);
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!isMobileOpen) return;
                // Use elementFromPoint to see if hovering over a section dot
                const el = document.elementFromPoint(e.clientX, e.clientY);
                if (el) {
                  const idx = el.getAttribute('data-section-index') || el.closest('[data-section-index]')?.getAttribute('data-section-index');
                  if (idx !== null && idx !== undefined) {
                    setDragHoveredIndex(parseInt(idx, 10));
                  } else {
                    setDragHoveredIndex(null);
                  }
                }
              }}
              onPointerUp={(e) => {
                (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                if (dragHoveredIndex !== null) {
                  handleDotClick(dragHoveredIndex);
                } else if (!isMobileOpen) {
                  // If it was just a quick tap and menu was closed, open it
                  setIsMobileOpen(true);
                  return;
                }
                setIsMobileOpen(false);
                setDragHoveredIndex(null);
              }}
              onPointerCancel={(e) => {
                (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                setIsMobileOpen(false);
                setDragHoveredIndex(null);
              }}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer"
                style={{
                  background: isMobileOpen
                    ? 'var(--bg-surface-elevated)'
                    : isDarkMode
                      ? 'var(--glass-bg)'
                      : 'radial-gradient(circle at top, var(--accent-orange-hover), var(--accent-orange))',
                  border: '1px solid',
                  borderColor: isMobileOpen ? 'var(--border-color)' : (isDarkMode ? 'var(--border-color)' : 'rgba(255,255,255,0.4)'),
                  backdropFilter: (!isMobileOpen && isDarkMode) ? 'blur(16px)' : 'none',
                  WebkitBackdropFilter: (!isMobileOpen && isDarkMode) ? 'blur(16px)' : 'none',
                }}
              >
                <motion.div
                  animate={{ rotate: isMobileOpen ? 45 : 0 }}
                  className="text-white flex flex-col items-center justify-center"
                >
                  {isMobileOpen ? (
                    <span className="text-xl">+</span> // Rotates into an X
                  ) : (
                    <div className="flex gap-[3px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white relative top-1" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                    </div>
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* ── Scroll % indicator (bottom-right Desktop Only) ─────────── */}
      {!isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <span
            className="text-xs font-mono tabular-nums tracking-wider"
            style={{ color: 'var(--text-muted)', opacity: 0.6 }}
          >
            {String(Math.round(progress * 100)).padStart(3, '0')}%
          </span>
        </div>
      )}
    </>
  );
}
