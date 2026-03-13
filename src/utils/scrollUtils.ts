// ── Cinematic scroll animation — continuous sweep easing ──────────────────
// Accelerates through the journey, with a soft landing at the end.
// Feels like one fluid camera sweep from source → destination.

let isAnimating = false;

// Balanced ease-in-out cubic easing for a premium, symmetrical feel
const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const scrollToId = (id: string) => {
    if (isAnimating) return;

    const el = document.getElementById(id);
    if (!el) return;

    // Get absolute offset relative to document
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // We scroll slightly above the element so it doesn't hug the top edge perfectly.
    const targetScroll = rect.top + scrollTop - (window.innerHeight * 0.1); 
    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;

    if (Math.abs(distance) < 5) return; // Already there

    isAnimating = true;
    const duration = Math.min(1600, Math.max(900, Math.abs(distance) / 4));
    const startTime = performance.now();

    const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(t);

        window.scrollTo(0, startScroll + distance * eased);

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            setTimeout(() => { isAnimating = false; }, 100);
        }
    };

    requestAnimationFrame(animate);
};
