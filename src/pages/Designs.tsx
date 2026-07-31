import { ExternalLink, ZoomIn, Zap, Box, Code2, Layers, BarChart3, Binary, Monitor, Smartphone, Tablet, ArrowRight, ShieldCheck, Globe, Info, RefreshCw, X, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../admin/firebase/firebaseConfig';
import type { CaseStudy, Project } from '../admin/store/adminStore';

const FEATURES = [
    { icon: Zap, title: 'Sub-Second Load Speed', description: 'Websites engineered to load in under 1 second on mobile networks so you never lose prospective buyers.' },
    { icon: Layers, title: 'High-Converting Structure', description: 'Layouts structured to guide visitors directly toward placing an order or booking a sales call.' },
    { icon: BarChart3, title: 'SEO & Search Rank Built-In', description: 'Optimized technical structure and Schema metadata to rank at the top of Google search results.' },
    { icon: Code2, title: 'Clean Maintainable Codebase', description: 'Modern React & TypeScript foundation with zero bloat and lightning-fast client-side navigation.' },
    { icon: Box, title: 'Interactive WebGL & Animations', description: 'Smooth, impressive motion graphics and glassmorphic UI elements tailored to elevate your brand.' },
    { icon: Binary, title: 'Built-in Admin Dashboard', description: 'Easily update content, manage leads, and review live website analytics anytime without code.' }
];

const PROCESS = [
    { step: '01', title: 'Business Discovery', description: 'We analyze your target market, competitors, and revenue goals to build a winning site strategy.' },
    { step: '02', title: 'High-Converting Design', description: 'We craft a premium visual brand identity and clear page hierarchy tailored to build market trust.' },
    { step: '03', title: 'Mobile & Speed Build', description: 'We engineer clean, ultra-fast code to ensure instant loading speeds on every mobile device.' },
    { step: '04', title: 'Launch & Growth Setup', description: 'We configure Google Search indexing, WhatsApp CTAs, analytics, and launch your site live.' },
];

function usePublicShowcaseData() {
    const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const bgGradients = [
        'from-amber-500/20 via-orange-500/10 to-red-500/20',
        'from-cyan-500/20 via-blue-500/10 to-indigo-500/20',
        'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
        'from-purple-500/20 via-violet-500/10 to-indigo-500/20',
        'from-rose-500/20 via-pink-500/10 to-purple-500/20'
    ];

    useEffect(() => {
        let rawStudies: CaseStudy[] = [];
        let rawProjects: Project[] = [];

        const updateCombinedList = () => {
            const dynamicList: any[] = [];

            const activeStudies = rawStudies.filter(s => s.status === 'published' || s.showOnWebsite !== false);
            const activeProjects = rawProjects.filter(p => p.showOnWebsite === true || p.status === 'published' || p.status === 'completed');

            activeStudies.forEach((s, idx) => {
                dynamicList.push({
                    id: `cs-${s.id}`,
                    title: s.title,
                    client: s.client || 'Client Project',
                    category: s.industry || 'Case Study',
                    description: s.summary || s.solution || s.challenge || 'Custom digital platform engineered by Talos.design.',
                    liveUrl: s.liveUrl || 'https://talos.design',
                    budget: (s as any).budget || '1,500',
                    turnaround: (s as any).turnaround || '14 Days',
                    features: (s as any).features || [
                        'Sub-Second Mobile Page Load',
                        'SEO Schema & Google Indexing',
                        'WhatsApp Direct Lead Form',
                        'High-Converting Layouts',
                        'SSL 256-bit Encrypted Hosting',
                        'Easy Admin Content Updates'
                    ],
                    imageBg: bgGradients[idx % bgGradients.length],
                    accent: 'var(--accent-orange)'
                });
            });

            activeProjects.forEach((p, idx) => {
                if (!dynamicList.some(item => item.title === (p.title || (p as any).name))) {
                    dynamicList.push({
                        id: `prj-${p.id}`,
                        title: p.title || (p as any).name,
                        client: p.client || 'Client Build',
                        category: 'Published Build',
                        description: p.description || p.notes || 'High-performance website delivered live for client operations.',
                        liveUrl: p.liveUrl || 'https://talos.design',
                        budget: p.budget ? `$${p.budget.toLocaleString()}` : '$1,200',
                        turnaround: '10-14 Days',
                        features: p.selectedFeatures || [
                            'Responsive Desktop & Mobile Views',
                            'Lead Generation Contact Forms',
                            'Optimized Asset Loading & CDN',
                            'SEO Technical Foundation',
                            '24/7 Server Monitoring & Security',
                            'Talos Client Portal Sync'
                        ],
                        imageBg: bgGradients[(idx + activeStudies.length) % bgGradients.length],
                        accent: 'var(--accent-cyan)'
                    });
                }
            });

            setPortfolioItems(dynamicList);
            setLoading(false);
        };

        // Real-time listener 1: Case Studies
        const unsubStudies = onSnapshot(query(collection(db, 'caseStudies')), (snap) => {
            rawStudies = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CaseStudy));
            updateCombinedList();
        }, (err) => {
            console.error('Real-time caseStudies error:', err);
            setLoading(false);
        });

        // Real-time listener 2: Projects
        const unsubProjects = onSnapshot(query(collection(db, 'projects')), (snap) => {
            rawProjects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
            updateCombinedList();
        }, (err) => {
            console.error('Real-time projects error:', err);
            setLoading(false);
        });

        return () => {
            unsubStudies();
            unsubProjects();
        };
    }, []);

    return { portfolioItems, loading };
}

function DesignGallery() {
    const { portfolioItems, loading } = usePublicShowcaseData();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [displayMode, setDisplayMode] = useState<'live' | 'details'>('live');
    const [iframeLoading, setIframeLoading] = useState(true);

    // Prevent background page scrolling when preview modal is active
    useEffect(() => {
        if (selectedItemId) {
            document.body.style.overflow = 'hidden';
            setDisplayMode('live');
            setIframeLoading(true);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedItemId]);

    const activeItem = useMemo(() => {
        return portfolioItems.find(item => item.id === selectedItemId);
    }, [selectedItemId, portfolioItems]);

    return (
        <div id="portfolio-gallery" className="w-full max-w-6xl mx-auto mb-36">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 px-2">
                <div>
                    <div className="badge badge-active mb-3 font-mono text-xs flex items-center gap-1.5 w-fit">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        [LIVE REAL-TIME BACKEND SYNC]
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Featured <span className="text-gradient-orange text-glow-orange">Live Projects</span></h2>
                </div>
                <p className="text-xs font-mono text-[var(--text-muted)] max-w-xs">
                    Live dynamic data fetched directly from backend database. Click to test live interactive previews.
                </p>
            </div>

            {loading ? (
                <div className="w-full py-20 flex flex-col items-center justify-center gap-4 glass-panel rounded-3xl">
                    <div className="w-10 h-10 border-2 border-[var(--accent-orange)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Connecting to real-time backend database...</span>
                </div>
            ) : portfolioItems.length === 0 ? (
                <div className="w-full py-16 px-8 glass-panel rounded-3xl text-center border border-[var(--border-color)]">
                    <ShieldCheck size={36} className="text-[var(--accent-orange)] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Published Case Studies Yet</h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">
                        Log into the Admin Panel → Case Studies to create or publish live projects to this showcase gallery.
                    </p>
                    <a href="/admin/case-studies" className="btn-hero-primary py-2.5 text-xs inline-flex">
                        Open Admin Portal
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {portfolioItems.map((item) => (
                        <motion.div
                            key={item.id}
                            layoutId={`card-${item.id}`}
                            onClick={() => setSelectedItemId(item.id)}
                            className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden cursor-pointer group glass-panel border border-[var(--border-color)] hover:border-[var(--accent-orange)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.18)] transition-all duration-300"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-105 ${item.imageBg}`} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                <div className="w-14 h-14 rounded-full bg-[var(--accent-orange)] text-[#07090E] flex items-center justify-center shadow-xl">
                                    <ZoomIn size={24} />
                                </div>
                                <span className="text-xs font-bold font-mono uppercase tracking-widest text-white">Preview & Inspect →</span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                <div className="text-[10px] font-mono tracking-widest uppercase font-bold text-[var(--accent-orange)] mb-2">{item.category}</div>
                                <h4 className="text-2xl font-bold text-white mb-1 font-display tracking-tight">{item.title}</h4>
                                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed opacity-90">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Interactive Live Website Frame Preview Modal */}
            <AnimatePresence>
                {activeItem && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItemId(null)}
                        className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-hidden"
                    >
                        <motion.div 
                            layoutId={`card-${activeItem.id}`}
                            className="w-full max-w-6xl h-[88vh] max-h-[850px] rounded-[2rem] overflow-hidden relative glass-panel border border-[var(--border-color)] bg-[#07090E] shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Single Unified Header: Traffic Light Dots + Address Bar + Mode & View Controls */}
                            <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 shrink-0">
                                <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:opacity-80" onClick={() => setSelectedItemId(null)} />
                                        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <span className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>

                                    {/* Integrated Live URL Address Bar */}
                                    <div className="flex items-center gap-2 bg-[#07090E] px-3 py-1 rounded-xl border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[220px] sm:max-w-md">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                                        <span className="truncate">{activeItem.liveUrl || 'https://talos.design'}</span>
                                        {activeItem.liveUrl && (
                                            <a 
                                                href={activeItem.liveUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-[10px] text-[var(--accent-orange)] hover:underline flex items-center gap-0.5 ml-auto shrink-0 font-bold"
                                                title="Open in external browser tab"
                                            >
                                                <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Display Mode: Live Interactive Site vs Overview Details */}
                                    <div className="flex items-center gap-1 bg-[#07090E] p-1 rounded-xl border border-[var(--border-color)]">
                                        <button 
                                            onClick={() => setDisplayMode('live')}
                                            className={`px-3 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-all ${displayMode === 'live' ? 'bg-[var(--accent-cyan)] text-[#07090E] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            <Globe size={13} /> Interactive Site
                                        </button>
                                        <button 
                                            onClick={() => setDisplayMode('details')}
                                            className={`px-3 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-all ${displayMode === 'details' ? 'bg-[var(--accent-cyan)] text-[#07090E] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            <Info size={13} /> Overview
                                        </button>
                                    </div>

                                    {/* Device Frame View Switcher */}
                                    <div className="flex items-center gap-1 bg-[#07090E] p-1 rounded-xl border border-[var(--border-color)]">
                                        <button 
                                            onClick={() => setDeviceView('desktop')}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1 transition-all ${deviceView === 'desktop' ? 'bg-[var(--accent-orange)] text-[#07090E] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            <Monitor size={13} /> Desktop
                                        </button>
                                        <button 
                                            onClick={() => setDeviceView('tablet')}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1 transition-all ${deviceView === 'tablet' ? 'bg-[var(--accent-orange)] text-[#07090E] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            <Tablet size={13} /> Tablet
                                        </button>
                                        <button 
                                            onClick={() => setDeviceView('mobile')}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1 transition-all ${deviceView === 'mobile' ? 'bg-[var(--accent-orange)] text-[#07090E] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            <Smartphone size={13} /> Mobile
                                        </button>
                                    </div>

                                    <button onClick={() => setSelectedItemId(null)} className="p-1.5 text-[var(--text-muted)] hover:text-white rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Direct Edge-To-Edge Preview Canvas (No nested inner box!) */}
                            <div className="flex-1 min-h-0 relative bg-black/70 overflow-hidden flex items-center justify-center">
                                <div 
                                    className={`transition-all duration-300 w-full h-full flex flex-col items-center justify-center ${
                                        deviceView === 'desktop' ? 'max-w-full' :
                                        deviceView === 'tablet' ? 'max-w-[720px] py-4' : 'max-w-[360px] py-4'
                                    }`}
                                >
                                    <div className="w-full h-full relative bg-white overflow-hidden flex-1 min-h-0 shadow-2xl rounded-none sm:rounded-xl">
                                        {displayMode === 'live' && activeItem.liveUrl ? (
                                            <div className="relative w-full h-full flex-1 min-h-0 overflow-hidden">
                                                {iframeLoading && (
                                                    <div className="absolute inset-0 bg-[#07090E] flex flex-col items-center justify-center gap-3 z-10">
                                                        <RefreshCw size={24} className="text-[var(--accent-cyan)] animate-spin" />
                                                        <span className="text-xs font-mono text-[var(--text-muted)]">Loading live site: {activeItem.liveUrl}</span>
                                                    </div>
                                                )}
                                                <div className="w-full h-full overflow-hidden relative flex-1 min-h-0">
                                                    <iframe 
                                                        src={activeItem.liveUrl} 
                                                        title={activeItem.title}
                                                        onLoad={() => setIframeLoading(false)}
                                                        className="w-[calc(100%+24px)] h-full -mr-[24px] border-none"
                                                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 min-h-0 p-6 sm:p-10 flex flex-col justify-start relative bg-gradient-to-br from-[#0b0f19] via-[#0f172a] to-[#1e293b] overflow-y-auto no-scrollbar pb-32 text-white space-y-8">
                                                {/* Header & Meta */}
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                                                            {activeItem.category}
                                                        </span>
                                                        {activeItem.client && (
                                                            <span className="text-xs font-mono text-white/70 flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                                                Client: <strong className="text-white">{activeItem.client}</strong>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-3xl sm:text-5xl font-bold font-display text-white mb-4 tracking-tight">{activeItem.title}</h3>
                                                    <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-3xl">{activeItem.description}</p>
                                                </div>

                                                {/* Key Specs & Financials Grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                        <div className="text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                            <DollarSign size={12} className="text-emerald-400" /> Estimated Cost
                                                        </div>
                                                        <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                                                            {activeItem.budget ? (isNaN(Number(activeItem.budget)) ? activeItem.budget : `$${Number(activeItem.budget).toLocaleString()}`) : '$1,500'}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                        <div className="text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                            <Clock size={12} className="text-sky-400" /> Turnaround
                                                        </div>
                                                        <div className="text-lg sm:text-xl font-bold font-mono text-white">
                                                            {activeItem.turnaround || '14 Days'}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                        <div className="text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                            <Zap size={12} className="text-amber-400" /> Speed Index
                                                        </div>
                                                        <div className="text-lg sm:text-xl font-bold font-mono text-amber-400">
                                                            99/100 Mobile
                                                        </div>
                                                    </div>

                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                        <div className="text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                            <ShieldCheck size={12} className="text-indigo-400" /> SLA Guarantee
                                                        </div>
                                                        <div className="text-lg sm:text-xl font-bold font-mono text-white">
                                                            99.9% Uptime
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Delivered Features & Modules Grid */}
                                                <div>
                                                    <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent-orange)] mb-3 flex items-center gap-2">
                                                        <CheckCircle2 size={14} /> Delivered Features & Key Modules
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {(activeItem.features || [
                                                            'Sub-Second Mobile Page Load',
                                                            'SEO Schema & Google Indexing',
                                                            'WhatsApp Direct Lead Form',
                                                            'High-Converting Layouts',
                                                            'SSL 256-bit Encrypted Hosting',
                                                            'Easy Admin Content Updates'
                                                        ]).map((feat: string, i: number) => (
                                                            <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/90">
                                                                <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shrink-0" />
                                                                <span>{feat}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Footer Action & Link */}
                                                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
                                                    <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                                                        <CheckCircle2 size={14} className="text-emerald-400" /> Verified Live Production Build
                                                    </div>
                                                    <a 
                                                        href={activeItem.liveUrl} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="px-6 py-2.5 rounded-xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-lg"
                                                    >
                                                        Open Full Website <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                                <div className="h-16 w-full shrink-0 pointer-events-none" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Action Bar */}
                            <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-4 shrink-0">
                                <a 
                                    href="/#contact" 
                                    className="px-5 py-2.5 rounded-xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center gap-2"
                                >
                                    Build A Website Like This →
                                </a>
                                <button 
                                    onClick={() => setSelectedItemId(null)} 
                                    className="px-5 py-2.5 rounded-xl border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Designs() {
    return (
        <div className="container py-24 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-20 md:mb-32"
            >
                <div className="badge badge-active mb-8 md:mb-10 px-4 md:px-6 py-2 uppercase tracking-[0.3em] font-bold text-[10px] md:text-xs">[HIGH-CONVERTING WEB DESIGN]</div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl mb-8 md:mb-10 font-display font-bold tracking-tight uppercase leading-[1.05] max-w-5xl">
                    High-Converting <br />
                    <span className="text-gradient-orange text-glow-orange leading-none">Custom Websites</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-[var(--accent-orange)] pl-6 italic">
                    "Engineered to build instant market trust, load in under 1 second on mobile, and turn casual visitors into paying customers on every device."
                </p>
            </motion.div>

            {/* Design Gallery connected directly to backend Firestore data */}
            <DesignGallery />

            {/* Design Infrastructure */}
            <div className="mb-24 md:mb-48">
                <div className="flex items-center gap-4 mb-12 md:mb-20">
                    <div className="h-px bg-gradient-to-r from-[var(--accent-orange)] to-transparent flex-grow" />
                    <h3 className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-[var(--text-muted)] uppercase text-center">Technical Design Infrastructure</h3>
                    <div className="h-px bg-gradient-to-l from-[var(--accent-orange)] to-transparent flex-grow" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-8 md:p-10 group hover:border-[rgba(245,158,11,0.2)] transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[rgba(245,158,11,0.08)] flex items-center justify-center mb-6 border border-[rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform">
                                <f.icon size={28} className="text-[var(--accent-orange)]" />
                            </div>
                            <h4 className="text-lg font-bold mb-3 uppercase tracking-tight">{f.title}</h4>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* The Logic of Aesthetics */}
            <div className="mb-24 md:mb-48">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-12 md:mb-20">
                    <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
                        <h3 className="text-4xl md:text-6xl font-display font-bold mb-6 uppercase tracking-tight leading-none">The Process of <br /><span className="text-gradient-orange">High Conversion.</span></h3>
                        <p className="text-[var(--text-secondary)] text-xs md:text-sm uppercase tracking-widest font-mono opacity-80">A 4-step framework for turning visitors into clients.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {PROCESS.map((p, i) => (
                        <motion.div 
                            key={p.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-8 relative overflow-hidden group border border-[var(--border-color)] hover:border-[var(--accent-orange)] transition-all"
                        >
                            <div className="text-6xl font-display font-bold text-[rgba(245,158,11,0.08)] absolute -top-2 -right-2 transform group-hover:-translate-x-2 transition-transform">{p.step}</div>
                            <div className="relative z-10">
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-[var(--accent-orange)]">{p.title}</h4>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Call to action */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-8 md:p-20 glass-panel rounded-[2.5rem] md:rounded-[4rem] text-center relative overflow-hidden border border-[var(--accent-orange-glow)] mb-24"
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(245,158,11,0.05)] to-transparent pointer-events-none" />
                <h2 className="text-3xl md:text-7xl font-display font-bold mb-8 uppercase tracking-tight leading-[1.05]">Ready To Build Your <br /><span className="text-gradient-orange">Custom Website?</span></h2>
                <p className="text-[var(--text-secondary)] mb-12 max-w-xl mx-auto text-base md:text-lg leading-relaxed italic opacity-90 px-4">
                    "Delivered with fixed pricing, clear milestone timelines, sub-second mobile performance, and full search engine optimization."
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/#contact" className="btn-hero-primary">
                        Start Your Website Brief <ArrowRight size={18} />
                    </a>
                    <a href="https://wa.me/917247250918?text=Hello%20Talos.design%2C%20I%20would%20like%20to%20discuss%20building%20my%20website." target="_blank" rel="noreferrer" className="btn-hero-secondary">
                        Consult On WhatsApp
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
