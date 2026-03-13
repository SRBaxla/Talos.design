import { motion, useMotionValueEvent, MotionValue } from 'framer-motion';
import { useState, useCallback } from 'react';
import { scrollToProgress, SECTION_Z_PROGRESS } from '../utils/scrollUtils';
import logo from '../assets/bitmap.png';
import { NavLink } from 'react-router-dom';

const SECTIONS = [
  { id: 'hero', label: 'Home', progress: SECTION_Z_PROGRESS.hero },
  { id: 'solutions', label: 'Solutions', progress: SECTION_Z_PROGRESS.solutions },
  { id: 'packages', label: 'Packages', progress: SECTION_Z_PROGRESS.packages },
  { id: 'studio', label: 'Studio', progress: SECTION_Z_PROGRESS.studio },
  { id: 'contact', label: 'Contact', progress: SECTION_Z_PROGRESS.contact },
];

interface ScrollTrackerProps {
  scrollProgress: MotionValue<number>;
}

export function ScrollTracker({ scrollProgress }: ScrollTrackerProps) {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Track scroll progress and determine active section
  useMotionValueEvent(scrollProgress, 'change', (v) => {
    setProgress(v);
    const ranges = [[0, 0.2], [0.2, 0.4], [0.4, 0.6], [0.6, 0.8], [0.8, 1.0]];
    for (let i = ranges.length - 1; i >= 0; i--) {
      const mid = (ranges[i][0] + ranges[i][1]) / 2;
      if (v >= mid - 0.1) {
        setActiveIndex(i);
        break;
      }
    }
  });

  const handleDotClick = useCallback((index: number) => {
    scrollToProgress(SECTIONS[index].progress);
  }, []);

  const radius = 120;
  const pathLength = Math.PI * radius;
  // Make sure progress doesn't exceed 1 or go below 0
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const strokeDashoffset = pathLength * (1 - clampedProgress);

  return (
    <>
      {/* ── Floating Logo (top-left) ─────────────────────────────── */}
      <div className="fixed top-5 left-6 z-50 flex items-center gap-3">
        <NavLink to="/" className="flex items-center">
          <img src={logo} alt="Talos.design" className="h-7 opacity-80 hover:opacity-100 transition-opacity" />
        </NavLink>
      </div>

      {/* ── Semi-Circle Scroll Tracker (right edge) ─────────────────── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-end pointer-events-none"
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
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
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
            
            {/* Overlay glow path */}
            <path
              d={`M ${radius} 0 A ${radius} ${radius} 0 0 0 ${radius} ${radius * 2}`}
              fill="none"
              stroke="url(#tracker-gradient)"
              strokeWidth="2"
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
              filter="url(#tracker-glow)"
              className="transition-all duration-150 ease-out"
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

      {/* ── Scroll % indicator (bottom-right) ─────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <span
          className="text-xs font-mono tabular-nums tracking-wider"
          style={{ color: 'var(--text-muted)', opacity: 0.6 }}
        >
          {String(Math.round(progress * 100)).padStart(3, '0')}%
        </span>
      </div>
    </>
  );
}
