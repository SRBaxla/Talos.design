// ── Cinematic scroll animation with cubic easing ──────────────────────────
// Replaces native smooth scroll with a controlled RAF-based animation
// that matches the scroll-jacking transition feel.

let isAnimating = false;

const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const scrollToProgress = (progress: number) => {
    if (isAnimating) return;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const targetScroll = progress * scrollHeight;
    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;

    if (Math.abs(distance) < 5) return; // Already there

    isAnimating = true;
    const duration = Math.min(1800, Math.max(1000, Math.abs(distance) / 3));
    const startTime = performance.now();

    const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(t);

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
