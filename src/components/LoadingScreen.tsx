import { useEffect, useState, useRef } from 'react';
import logo from '../assets/bitmap.png';
import logoLight from '../assets/logo- light-side.png';

const BOOT_STEPS = [
  'INIT / SYSTEM ARCHITECTURE',
  'LOADING DIGITAL PIPELINES',
  'TALOS STUDIO ONLINE',
];

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isFading, setIsFading] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [logoStyle, setLogoStyle] = useState<React.CSSProperties>({});
  const imgRef = useRef<HTMLImageElement>(null);

  const [isDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('talos-dark-mode-unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const currentLogo = isDarkMode ? logo : logoLight;

  useEffect(() => {
    // Clear the splash-pending lock on html now that React LoadingScreen is active
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('splash-pending');
    }

    // Step progression for boot telemetry
    const t1 = setTimeout(() => setBootStep(1), 500);
    const t2 = setTimeout(() => setBootStep(2), 1050);
    const t3 = setTimeout(() => {
      // Calculate dynamic FLIP coordinates right before triggering smooth dissolve
      if (imgRef.current) {
        const sourceRect = imgRef.current.getBoundingClientRect();
        const targetEl = document.getElementById('navbar-logo');

        if (targetEl) {
          const targetRect = targetEl.getBoundingClientRect();
          const dx = targetRect.left - sourceRect.left;
          const dy = targetRect.top - sourceRect.top;
          const scaleX = targetRect.width / sourceRect.width;
          const scaleY = targetRect.height / sourceRect.height;

          setLogoStyle({
            transformOrigin: '0 0',
            transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scaleX}, ${scaleY})`,
            opacity: 1,
            filter: 'none',
          });
        }
      }

      setIsFading(true);
      setTimeout(() => onComplete(), 1100); // 1.1s smooth dissolve
    }, 1650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Theme-Aware Ambient Background Dissolve Overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          backgroundColor: isDarkMode ? '#07090F' : '#FFFFFF',
          willChange: 'opacity' 
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 pointer-events-auto">
        
        {/* Official Talos Logo Container with Smooth Gentle Glide */}
        <div className="mb-8 flex items-center justify-center">
          <img 
            ref={imgRef}
            src={currentLogo} 
            alt="Talos.design" 
            style={{
              willChange: 'transform, opacity',
              ...logoStyle
            }}
            className={`h-10 sm:h-12 w-auto transition-all duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isDarkMode ? 'filter drop-shadow-[0_0_20px_rgba(210,193,182,0.3)]' : ''
            }`} 
          />
        </div>
        
        {/* Boot Telemetry & Progress Bar */}
        <div className={`flex flex-col items-center w-full transition-opacity duration-600 ease-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          
          {/* Progress Bar Track */}
          <div className={`w-56 h-[2px] rounded-full overflow-hidden mb-6 relative ${
            isDarkMode ? 'bg-white/10' : 'bg-slate-200'
          }`}>
            <div className="h-full bg-gradient-to-r from-[var(--accent-orange)] via-[var(--accent-cyan)] to-[#25D366] w-full origin-left animate-loading-bar shadow-[0_0_12px_rgba(37,211,102,0.8)]" />
          </div>
          
          {/* Telemetry Message Fade */}
          <div className="relative h-5 w-full flex items-center justify-center overflow-hidden">
            {BOOT_STEPS.map((text, idx) => (
              <span
                key={text}
                className={`absolute text-[10px] font-mono uppercase tracking-[0.25em] font-semibold transition-all duration-400 ease-out ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                } ${
                  bootStep === idx
                    ? 'opacity-100 translate-y-0'
                    : bootStep > idx
                    ? 'opacity-0 -translate-y-2'
                    : 'opacity-0 translate-y-2'
                }`}
              >
                {text}
              </span>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};







