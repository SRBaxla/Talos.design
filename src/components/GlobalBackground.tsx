const CIRCUIT_PATHS = [
    { id: 1, d: "M -10 20 L 20 20 L 20 50 L 110 50", color: "rgba(210,193,182,0.25)" },
    { id: 2, d: "M 40 -10 L 40 40 L 80 40 L 80 110", color: "rgba(69,104,130,0.35)" },
    { id: 3, d: "M 110 30 L 70 30 L 70 80 L -10 80", color: "rgba(210,193,182,0.25)" },
    { id: 4, d: "M 60 110 L 60 60 L 10 60 L 10 -10", color: "rgba(69,104,130,0.35)" },
    { id: 5, d: "M -10 70 L 35 70 L 35 15 L 110 15", color: "rgba(210,193,182,0.25)" },
    { id: 6, d: "M 85 -10 L 85 55 L 50 55 L 50 110", color: "rgba(69,104,130,0.35)" },
];


const NODES = [
    { x: 20, y: 20 }, { x: 20, y: 50 }, { x: 40, y: 40 }, { x: 80, y: 40 },
    { x: 70, y: 30 }, { x: 70, y: 80 }, { x: 60, y: 60 }, { x: 10, y: 60 },
    { x: 35, y: 15 }, { x: 85, y: 55 }, { x: 50, y: 55 }, { x: 90, y: 25 },
];

export function GlobalBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--bg-base)]">
            {/* Central glow — teal-tinted */}
            <div
                className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle, rgba(69,104,130,0.18) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Static grid */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                    maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                }}
            />

            {/* Static SVG circuit traces + nodes — no animation whatsoever */}
            <svg
                className="absolute inset-0 w-full h-full opacity-40"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                {CIRCUIT_PATHS.map((path) => (
                    <path
                        key={path.id}
                        d={path.d}
                        stroke={path.color}
                        strokeWidth="0.6"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                    />
                ))}

                {NODES.map((node, i) => (
                    <circle
                        key={i}
                        cx={node.x}
                        cy={node.y}
                        r="0.5"
                        fill="rgba(255,255,255,0.2)"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
            </svg>
        </div>
    );
}
