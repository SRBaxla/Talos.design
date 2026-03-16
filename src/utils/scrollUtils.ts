// ── Native Cinematic Scroll ──────────────────
// Uses the browser's native smooth-scroll engine for maximum compatibility
// with CSS scroll-snap and to prevent "jagged" motion.

export const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
};
