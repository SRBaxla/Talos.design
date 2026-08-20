// ── Native Cinematic Scroll ──────────────────
// Uses the browser's native smooth-scroll engine for maximum compatibility
// with CSS scroll-snap and to prevent "jagged" motion.

export const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;
    const isLargePhone = width >= 430 && width < 768;

    if (!isDesktop) {
        const headerOffset = isTablet ? 72 : 64; // Sticky navbar height
        const bottomClearance = isTablet ? 130 : isLargePhone ? 115 : 100; // Orb tracker bottom clearance area
        const viewportHeight = window.innerHeight;
        const usableHeight = Math.max(200, viewportHeight - headerOffset - bottomClearance);

        let targetEl: HTMLElement = el;

        if (id === 'contact') {
            // On mobile/tablet single-column layouts, target the contact form card directly
            const card = document.getElementById('contact-card') || el.querySelector('form');
            if (card) {
                targetEl = card as HTMLElement;
            }
        }

        const rect = targetEl.getBoundingClientRect();
        const elementHeight = rect.height;
        const elementTopWorld = window.scrollY + rect.top;

        let targetScrollTop: number;

        if (elementHeight < usableHeight) {
            // Center the target element within the available visible screen area
            const verticalPadding = (usableHeight - elementHeight) / 2;
            targetScrollTop = elementTopWorld - headerOffset - verticalPadding;
        } else {
            // Align top of element with comfortable padding below header
            targetScrollTop = elementTopWorld - headerOffset - 16;
        }

        const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
        targetScrollTop = Math.max(0, Math.min(maxScroll, targetScrollTop));

        window.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    } else {
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};
