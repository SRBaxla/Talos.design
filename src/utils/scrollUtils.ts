// ── Cinematic scroll animation — continuous sweep easing ──────────────────
// Accelerates through the journey, with a soft landing at the end.
// Feels like one fluid camera sweep from source → destination.

let isAnimating = false;

// Custom sweep easing: accelerates for 80%, gently decelerates for the final 20%
// This creates the feeling of a single, continuous motion.
const easeSweep = (t: number): number => {
    if (t < 0.8) {
        // Smooth acceleration (cubic ease-in, normalized to 0→0.92 over 80% of time)
        const p = t / 0.8;
        return p * p * p * 0.92;
    }
    // Gentle deceleration for the final 20% (soft landing)
    const p = (t - 0.8) / 0.2;
    return 0.92 + (1 - (1 - p) * (1 - p)) * 0.08;
};

export const scrollToProgress = (progress: number) => {
    if (isAnimating) return;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const targetScroll = progress * scrollHeight;
    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;

    if (Math.abs(distance) < 5) return; // Already there

    isAnimating = true;
    const duration = Math.min(1600, Math.max(900, Math.abs(distance) / 4));
    const startTime = performance.now();

    const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeSweep(t);

        window.scrollTo(0, startScroll + distance * eased);

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            // Dispatch a custom event so the snap system can sync its currentSection
            window.dispatchEvent(new CustomEvent('scroll-snap-sync', { detail: { progress } }));
            setTimeout(() => { isAnimating = false; }, 100);
        }
    };

    requestAnimationFrame(animate);
};

export const SECTION_Z_PROGRESS = {
    hero: 0.1,
    solutions: 0.3,
    packages: 0.5,
    studio: 0.7,
    contact: 0.9
};
