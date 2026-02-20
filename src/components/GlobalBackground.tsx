import { motion } from 'framer-motion';

const ELECTRON_PATHS = [
    { id: 1, d: "M -10 20 L 20 20 L 20 50 L 110 50", color: "var(--accent-orange)", delay: 0, duration: 4 },
    { id: 2, d: "M 40 -10 L 40 40 L 80 40 L 80 110", color: "var(--accent-cyan)", delay: 1.5, duration: 5 },
    { id: 3, d: "M 110 30 L 70 30 L 70 80 L -10 80", color: "var(--accent-orange)", delay: 0.5, duration: 4.5 },
    { id: 4, d: "M 60 110 L 60 60 L 10 60 L 10 -10", color: "var(--accent-cyan)", delay: 2, duration: 4 },
    { id: 5, d: "M -10 70 L 35 70 L 35 15 L 110 15", color: "var(--accent-orange)", delay: 1, duration: 5.5 },
    { id: 6, d: "M 85 -10 L 85 55 L 50 55 L 50 110", color: "var(--accent-cyan)", delay: 2.5, duration: 4.2 },
    { id: 7, d: "M 110 75 L 90 75 L 90 25 L -10 25", color: "var(--accent-orange)", delay: 3, duration: 5 },
    { id: 8, d: "M 25 110 L 25 65 L 95 65 L 95 -10", color: "var(--accent-cyan)", delay: 0.8, duration: 4.8 },
    { id: 9, d: "M -10 40 L 65 40 L 65 90 L 110 90", color: "var(--accent-orange)", delay: 4, duration: 5.2 },
    { id: 10, d: "M 15 -10 L 15 85 L 85 85 L 85 110", color: "var(--accent-cyan)", delay: 3.5, duration: 6 },
    { id: 11, d: "M 110 10 L 55 10 L 55 75 L -10 75", color: "var(--accent-orange)", delay: 2.8, duration: 5.8 },
    { id: 12, d: "M 75 110 L 75 45 L 5 45 L 5 -10", color: "var(--accent-cyan)", delay: 4.5, duration: 5.5 },
];

export function GlobalBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--bg-base)]">
            {/* Central glow */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(245,158,11,0.03)_0%,_transparent_70%)] blur-[120px] rounded-full mix-blend-screen" />

            {/* Moving Tech Grid Overlay */}
            <motion.div
                animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-[0.2]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
                    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)'
                }}
            />

            {/* SVG Circuit Traces */}
            <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                {ELECTRON_PATHS.map((path) => (
                    <g key={path.id}>
                        {/* Static faint trace */}
                        <path
                            d={path.d}
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth="0.5"
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* Fast moving electron */}
                        <motion.path
                            d={path.d}
                            stroke={path.color}
                            strokeWidth="2.5"
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            initial={{ pathLength: 0.1, pathOffset: -0.1, opacity: 0 }}
                            animate={{
                                pathOffset: 1.1,
                                opacity: [0, 1, 1, 0]
                            }}
                            transition={{
                                duration: path.duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: path.delay,
                            }}
                        />
                    </g>
                ))}

                {/* Draw some static nodes at intersections */}
                {[
                    { x: 20, y: 20 }, { x: 20, y: 50 }, { x: 40, y: 40 }, { x: 80, y: 40 },
                    { x: 70, y: 30 }, { x: 70, y: 80 }, { x: 60, y: 60 }, { x: 10, y: 60 },
                    { x: 35, y: 70 }, { x: 35, y: 15 }, { x: 85, y: 55 }, { x: 50, y: 55 },
                    { x: 90, y: 75 }, { x: 90, y: 25 }, { x: 25, y: 65 }, { x: 95, y: 65 },
                    { x: 65, y: 40 }, { x: 65, y: 90 }, { x: 15, y: 85 }, { x: 85, y: 85 },
                    { x: 55, y: 10 }, { x: 55, y: 75 }, { x: 75, y: 45 }, { x: 5, y: 45 }
                ].map((node, i) => (
                    <circle key={i} cx={node.x} cy={node.y} r="0.4" fill="rgba(255,255,255,0.3)" vectorEffect="non-scaling-stroke" />
                ))}
            </svg>

            {/* Frosted Glass Fog Overlay */}
            <div className="absolute inset-0 backdrop-blur-[3px] pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        </div>
    );
}
