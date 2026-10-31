import { useRef, useEffect } from 'react';

/**
 * LivingAura — 2D animated hero visual.
 *
 * Three behaviours running in a single rAF loop:
 *  1. Breathing: scale 0.90→1.10, opacity 0.40→0.70 on an 8s sine cycle.
 *  2. Mouse follow: the aura centre lazily lerps toward the cursor
 *     (lerp α = 0.018 ≈ ~1s perceived lag — feels like dragging a gas cloud).
 *  3. Outer halo: a second, larger, slower blob adds depth.
 */
export default function LivingAura() {
    const containerRef = useRef<HTMLDivElement>(null);
    const coreRef      = useRef<HTMLDivElement>(null);
    const haloRef      = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const core      = coreRef.current;
        const halo      = haloRef.current;
        if (!container || !core || !halo) return;

        // Mouse target in % of container dimensions
        let targetX = 50, targetY = 45;
        // Current (lagged) position
        let curX = 50, curY = 45;

        const onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            targetX = ((e.clientX - rect.left) / rect.width)  * 100;
            targetY = ((e.clientY - rect.top)  / rect.height) * 100;
        };
        window.addEventListener('mousemove', onMouseMove);

        let rafId: number;

        const tick = (ms: number) => {
            const t = ms / 1000; // seconds

            // ── 1. Breathing ──────────────────────────────────────────────
            // 9-second sine — matches a resting breath rate (~6–8 breaths/min)
            const breath  = (Math.sin((t / 9)  * Math.PI * 2) + 1) / 2;
            // Halo on a 12s cycle for organic asynchrony
            const breath2 = (Math.sin((t / 12) * Math.PI * 2) + 1) / 2;

            const scale   = 0.90 + breath  * 0.20;   // 0.90 → 1.10
            const scale2  = 0.95 + breath2 * 0.15;
            const opacity  = 0.40 + breath  * 0.30;   // 0.40 → 0.70
            const opacity2 = 0.18 + breath2 * 0.14;

            // ── 2. Lagged mouse follow ────────────────────────────────────
            // α = 0.012 → ~75 frames to close 60% of the gap at 60fps ≈ 1.5s
            const α = 0.012;
            curX += (targetX - curX) * α;
            curY += (targetY - curY) * α;

            // ── Apply ─────────────────────────────────────────────────────
            core.style.left    = `${curX}%`;
            core.style.top     = `${curY}%`;
            core.style.transform  = `translate(-50%, -50%) scale(${scale})`;
            core.style.opacity    = String(opacity);

            // Halo follows at half speed for extra depth
            const haloX = 50 + (curX - 50) * 0.5;
            const haloY = 50 + (curY - 50) * 0.5;
            halo.style.left    = `${haloX}%`;
            halo.style.top     = `${haloY}%`;
            halo.style.transform  = `translate(-50%, -50%) scale(${scale2})`;
            halo.style.opacity    = String(opacity2);

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div ref={containerRef} className="living-aura-container">
            {/* Outer halo — larger, slower, offset for depth */}
            <div ref={haloRef} className="living-aura-halo" />
            {/* Core glow — brighter, tighter, direct mouse follow */}
            <div ref={coreRef} className="living-aura-core" />
        </div>
    );
}
