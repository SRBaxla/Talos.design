import { motion, useMotionValueEvent, MotionValue, AnimatePresence, useSpring } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import { scrollToId } from '../utils/scrollUtils';

const SECTIONS = [
  { id: 'hero', label: 'Home', progress: 0.0 },
  { id: 'services', label: 'Services', progress: 0.25 },
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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

  useEffect(() => {
    const checkWidth = () => setWindowWidth(window.innerWidth);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isLargePhone = windowWidth >= 430 && windowWidth < 768;
  const isOrbTracker = !isDesktop;

  const handleDotClick = useCallback((index: number) => {
    scrollToId(SECTIONS[index].id);
    if (isOrbTracker) setIsMobileOpen(false);
  }, [isOrbTracker]);

  const orbButtonRef = useRef<HTMLDivElement>(null);
  const dragHoveredIndexRef = useRef<number | null>(null);
  const isMobileOpenRef = useRef(isMobileOpen);
  const wasOpenOnPointerDownRef = useRef(false);

  useEffect(() => {
    isMobileOpenRef.current = isMobileOpen;
  }, [isMobileOpen]);

  const updateDragHoverIndex = useCallback((e: React.PointerEvent) => {
    // 1. Check elementFromPoint first
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (el) {
      const idxStr = el.getAttribute('data-section-index') || el.closest('[data-section-index]')?.getAttribute('data-section-index');
      if (idxStr !== null && idxStr !== undefined) {
        const parsed = parseInt(idxStr, 10);
        if (!isNaN(parsed)) {
          dragHoveredIndexRef.current = parsed;
          setDragHoveredIndex(parsed);
          return parsed;
        }
      }
    }

    // 2. Geometric angle math fallback relative to orb center
    if (orbButtonRef.current) {
      const rect = orbButtonRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      // Within orb button radius or dragging downward below orb -> clear hover
      if (dist < 35 || dy > 40) {
        dragHoveredIndexRef.current = null;
        setDragHoveredIndex(null);
        return null;
      }

      // Angle relative to center: Math.PI (Left) to 2 * Math.PI (Right)
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;

      let t = (angle - Math.PI) / Math.PI;
      if (t < 0) t = 0;
      if (t > 1) t = 1;

      const idx = Math.round(t * (SECTIONS.length - 1));
      dragHoveredIndexRef.current = idx;
      setDragHoveredIndex(idx);
      return idx;
    }

    dragHoveredIndexRef.current = null;
    setDragHoveredIndex(null);
    return null;
  }, []);

  const desktopRadius = windowWidth >= 1280 ? 120 : 95;
  const radius = desktopRadius;
  const pathLength = Math.PI * radius;

  // Spring for smooth, responsive arc tracking
  const arcMotionValue = useSpring(0, { stiffness: 100, damping: 20, restDelta: 0.001 });
  const [strokeDashoffset, setStrokeDashoffset] = useState(pathLength);
  const sectionTopsRef = useRef<number[]>([]);

  // Update section tops on mount, resize, and scroll
  useEffect(() => {
    const updateSectionTops = () => {
      const isOrb = typeof window !== 'undefined' && window.innerWidth < 1024;
      sectionTopsRef.current = SECTIONS.map(s => {
        let el = document.getElementById(s.id);
        if (!el) return 0;
        if (isOrb && s.id === 'contact') {
          const card = document.getElementById('contact-card') || el.querySelector('form');
          if (card) el = card as HTMLElement;
        }
        return el.getBoundingClientRect().top + window.scrollY;
      });
    };

    updateSectionTops();
    // Re-check tops after initial rendering/font loads
    const timer = setTimeout(updateSectionTops, 500);
    window.addEventListener('resize', updateSectionTops);
    window.addEventListener('orientationchange', updateSectionTops);

    const handleScroll = () => {
      const tops = sectionTopsRef.current;
      if (tops.length < SECTIONS.length) {
        updateSectionTops();
      }

      const currentScrollY = window.scrollY;
      const numSegments = SECTIONS.length - 1;

      if (numSegments <= 0 || tops.length === 0) return;

      const firstTop = tops[0];
      const lastTop = tops[tops.length - 1];

      if (currentScrollY <= firstTop) {
        arcMotionValue.set(0);
        return;
      }

      if (currentScrollY >= lastTop) {
        arcMotionValue.set(1);
        return;
      }

      // Find which segment the scroll is currently in
      for (let i = 0; i < numSegments; i++) {
        const topCurrent = tops[i];
        const topNext = tops[i + 1];

        if (currentScrollY >= topCurrent && currentScrollY <= topNext) {
          const segmentDistance = topNext - topCurrent;
          const segmentProgress = segmentDistance > 0 ? (currentScrollY - topCurrent) / segmentDistance : 0;
          const totalProgress = (i + segmentProgress) / numSegments;
          arcMotionValue.set(totalProgress);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSectionTops);
      window.removeEventListener('orientationchange', updateSectionTops);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [arcMotionValue]);

  // Subscribe to the spring value and compute strokeDashoffset
  useMotionValueEvent(arcMotionValue, 'change', (v) => {
    setStrokeDashoffset(pathLength - Math.max(0, Math.min(1, v)) * pathLength);
  });


  // Mobile / Tablet responsive constants
  const mobileRadius = isTablet ? 125 : isLargePhone ? 110 : 90;
  const mobileArcStart = Math.PI; // Starts at 9 o'clock (180 deg)
  const mobileArcSpan = Math.PI; // Full semi-circle sweep (180 deg fanned over the top)

  return (
    <>

      {/* ── Desktop Semi-Circle Scroll Tracker (right edge) ─────────────────── */}
      {isDesktop && (
        <motion.div
          layout
          layoutId="scroll-tracker-container"
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-end pointer-events-none hidden lg:flex"
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
                    className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] px-3 py-1.5 rounded-md font-semibold"
                    style={{
                      color: isActive ? 'var(--accent-orange)' : 'var(--text-primary)',
                      background: isActive ? 'var(--accent-orange-glow)' : 'var(--bg-surface-elevated)',
                      border: `1px solid ${isActive ? 'var(--accent-orange)' : 'var(--border-color)'}`,
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
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
        </motion.div>
      )}

      {/* ── Mobile & Tablet Expanding Bottom Orb Tracker ────────────────────────────── */}
      {isOrbTracker && (
        <motion.div
          layout
          layoutId="scroll-tracker-container"
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[60] flex items-end justify-center pointer-events-none pb-14 overflow-visible"
        >
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
                    const nodeWidth = isTablet ? '96px' : isLargePhone ? '84px' : '76px';

                    return (
                      <div
                        key={section.id}
                        data-section-index={i}
                        className="absolute flex flex-col-reverse items-center justify-center gap-2 cursor-pointer pointer-events-auto"
                        style={{
                          left: `${xOffset}px`,
                          top: `${yOffset}px`,
                          transform: 'translate(-50%, -50%)',
                          width: nodeWidth,
                          height: nodeWidth
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
                        <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase transition-colors duration-200 text-center whitespace-nowrap"
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
            <div
              ref={orbButtonRef}
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10 touch-none"
              onPointerDown={(e) => {
                e.stopPropagation();
                wasOpenOnPointerDownRef.current = isMobileOpenRef.current;
                setIsMobileOpen(true);
                isMobileOpenRef.current = true;
                dragHoveredIndexRef.current = null;
                setDragHoveredIndex(null);
                const target = (e.currentTarget || orbButtonRef.current) as HTMLElement;
                if (target && target.setPointerCapture) {
                  try {
                    target.setPointerCapture(e.pointerId);
                  } catch {
                    // capture fallback
                  }
                }
              }}
              onPointerMove={(e) => {
                if (!isMobileOpenRef.current) return;
                updateDragHoverIndex(e);
              }}
              onPointerUp={(e) => {
                const target = (e.currentTarget || orbButtonRef.current) as HTMLElement;
                if (target && target.releasePointerCapture) {
                  try {
                    target.releasePointerCapture(e.pointerId);
                  } catch {
                    // ignore if already released
                  }
                }
                const targetIndex = dragHoveredIndexRef.current;
                if (targetIndex !== null) {
                  handleDotClick(targetIndex);
                  setIsMobileOpen(false);
                  isMobileOpenRef.current = false;
                } else {
                  if (wasOpenOnPointerDownRef.current) {
                    setIsMobileOpen(false);
                    isMobileOpenRef.current = false;
                  } else {
                    setIsMobileOpen(true);
                    isMobileOpenRef.current = true;
                  }
                }
                dragHoveredIndexRef.current = null;
                setDragHoveredIndex(null);
              }}
              onPointerCancel={(e) => {
                const target = (e.currentTarget || orbButtonRef.current) as HTMLElement;
                if (target && target.releasePointerCapture) {
                  try {
                    target.releasePointerCapture(e.pointerId);
                  } catch {
                    // ignore if already released
                  }
                }
                setIsMobileOpen(false);
                isMobileOpenRef.current = false;
                dragHoveredIndexRef.current = null;
                setDragHoveredIndex(null);
              }}
              onLostPointerCapture={() => {
                // If system releases capture mid-drag, navigate if target was selected
                const targetIndex = dragHoveredIndexRef.current;
                if (targetIndex !== null) {
                  handleDotClick(targetIndex);
                }
                setIsMobileOpen(false);
                isMobileOpenRef.current = false;
                dragHoveredIndexRef.current = null;
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
        </motion.div>
      )}

      {/* ── Scroll % indicator (bottom-right Desktop Only) ─────────── */}
      {isDesktop && (
        <div className="fixed bottom-6 right-6 z-50">
          <span
            className="text-xs font-mono tabular-nums tracking-wider font-semibold"
            style={{ color: 'var(--text-secondary)', opacity: 0.9 }}
          >
            {String(Math.round(progress * 100)).padStart(3, '0')}%
          </span>
        </div>
      )}
    </>
  );
}
