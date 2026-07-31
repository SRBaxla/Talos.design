import { useRef, useState, useEffect, useCallback } from 'react';
import { LayoutGrid, Bot, Settings, CheckCircle } from 'lucide-react';

const CARDS = [
    {
        icon: LayoutGrid,
        title: 'Web Design',
        benefit: 'Websites that turn visitors into clients',
        features: ['Fully responsive', 'SEO-optimised', 'Fast load times'],
        accent: 'var(--accent-orange)',
        accentRgb: '249, 168, 37',
    },
    {
        icon: Bot,
        title: 'AI Chatbots',
        benefit: '24/7 customer handling — zero extra staff',
        features: ['Trained on your content', 'Handles enquiries', 'WhatsApp ready'],
        accent: 'var(--accent-cyan)',
        accentRgb: '100, 255, 218',
    },
    {
        icon: Settings,
        title: 'System Automation',
        benefit: 'Eliminate repetitive work eating your day',
        features: ['Connect apps', 'Auto-send invoices', 'CRM sync'],
        accent: 'var(--accent-magenta)',
        accentRgb: '240, 98, 146',
    },
];

const AUTO_INTERVAL = 3500; // ms between auto-rotations
const DRAG_THRESHOLD = 30;  // px to trigger a card switch

export default function HeroCardStack() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Auto-rotate (pauses on hover or drag) ──────────────────────────
    useEffect(() => {
        if (isHovering || isDragging) return;
        const timer = setInterval(() => {
            setActiveIndex(i => (i + 1) % CARDS.length);
        }, AUTO_INTERVAL);
        return () => clearInterval(timer);
    }, [isHovering, isDragging]);

    // ── Drag handlers ──────────────────────────────────────────────────
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        setIsDragging(true);
        dragStartX.current = e.clientX;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }, []);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        const delta = e.clientX - dragStartX.current;
        if (Math.abs(delta) > DRAG_THRESHOLD) {
            if (delta < 0) {
                setActiveIndex(i => (i + 1) % CARDS.length);
            } else {
                setActiveIndex(i => (i - 1 + CARDS.length) % CARDS.length);
            }
        }
    }, [isDragging]);

    const onPointerCancel = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div
            ref={containerRef}
            className="hero-card-stack"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => { setIsHovering(false); setIsDragging(false); }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
        >
            {CARDS.map((card, index) => {
                // Position relative to active card
                const offset = (index - activeIndex + CARDS.length) % CARDS.length;
                // 0 = front, 1 = behind-right, 2 = behind-left
                const isFront = offset === 0;

                let translateX = '0px';
                let translateY = '0px';
                let scale = 1;
                let zIndex = 3;
                let opacity = 1;
                let rotateY = '0deg';

                if (offset === 0) {
                    translateX = '0px';
                    scale = 1;
                    zIndex = 3;
                    opacity = 1;
                    rotateY = '0deg';
                } else if (offset === 1) {
                    translateX = '40px';
                    translateY = '12px';
                    scale = 0.92;
                    zIndex = 2;
                    opacity = 0.5;
                    rotateY = '-6deg';
                } else {
                    translateX = '-40px';
                    translateY = '24px';
                    scale = 0.85;
                    zIndex = 1;
                    opacity = 0.25;
                    rotateY = '6deg';
                }

                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className={`hero-card ${isFront ? 'hero-card--active' : ''}`}
                        style={{
                            transform: `translateX(${translateX}) translateY(${translateY}) scale(${scale}) rotateY(${rotateY})`,
                            zIndex,
                            opacity,
                            borderColor: isFront ? `rgba(${card.accentRgb}, 0.25)` : 'var(--border-color)',
                            cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                    >
                        {/* Card header */}
                        <div className="hero-card__header">
                            <div
                                className="hero-card__icon-wrap"
                                style={{ background: `rgba(${card.accentRgb}, 0.12)` }}
                            >
                                <Icon size={22} style={{ color: card.accent }} />
                            </div>
                            <h3 className="hero-card__title">{card.title}</h3>
                        </div>

                        {/* Benefit line */}
                        <p className="hero-card__benefit">{card.benefit}</p>

                        {/* Features */}
                        <ul className="hero-card__features">
                            {card.features.map(f => (
                                <li key={f}>
                                    <CheckCircle size={14} style={{ color: card.accent, flexShrink: 0 }} />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Accent glow line at top */}
                        {isFront && (
                            <div
                                className="hero-card__glow-line"
                                style={{ background: `linear-gradient(90deg, transparent, rgba(${card.accentRgb}, 0.5), transparent)` }}
                            />
                        )}
                    </div>
                );
            })}

            {/* Dot indicators */}
            <div className="hero-card-dots">
                {CARDS.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-card-dot ${i === activeIndex ? 'hero-card-dot--active' : ''}`}
                        onClick={() => setActiveIndex(i)}
                        aria-label={`Show card ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
