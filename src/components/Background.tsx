import { memo } from 'react';

export const Background = memo(({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-[#07090F]' : 'bg-[#f8fafc]'}`}>
      {/* Background static noise */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated glowing mesh gradients */}
      <div
        className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-[100%] blur-[120px] transition-all duration-1000 animate-slow-spin ${isDarkMode ? 'bg-[var(--accent-orange)] opacity-10' : 'bg-[var(--accent-orange)] opacity-[0.05]'}`}
        style={{ animationDuration: '25s' }}
      />

      <div
        className={`absolute top-[40%] right-[-10%] w-[40%] h-[60%] rounded-[100%] blur-[120px] transition-all duration-1000 animate-slow-spin-reverse ${isDarkMode ? 'bg-[var(--accent-cyan)] opacity-10' : 'bg-[var(--accent-cyan)] opacity-[0.05]'}`}
        style={{ animationDuration: '30s' }}
      />

      <div
        className={`absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] rounded-[100%] blur-[120px] transition-all duration-1000 animate-slow-spin ${isDarkMode ? 'bg-[var(--accent-magenta)] opacity-[0.08]' : 'bg-[var(--accent-magenta)] opacity-[0.05]'}`}
        style={{ animationDuration: '35s' }}
      />
    </div>
  );
});
