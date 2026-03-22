import { useEffect, useState } from 'react';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Pre-load common components and perform artificial minimum delay for premium intro
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => onComplete(), 1000); // 1s fade duration
    }, 1500); // 1.5s display minimum

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0f19] text-white transition-all transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Startup Logo Element */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-magenta)] opacity-80 border border-white/10 animate-pulse shadow-[0_0_40px_var(--accent-orange-glow)] mb-10 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[#0a0f19] m-[1px] rounded-[15px] flex items-center justify-center">
                <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-cyan)]">T</span>
            </div>
        </div>
        
        {/* Loading Bar */}
        <div className="w-48 h-[1px] bg-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--accent-orange)] via-[var(--accent-cyan)] to-[var(--accent-magenta)] w-full origin-left animate-loading-bar" />
        </div>
        
        <div className="mt-8 text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 animate-pulse">
            Booting Systems
        </div>
      </div>
    </div>
  );
};
