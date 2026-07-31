import { Zap, Calendar, Clock, ArrowRight, Brain, Cpu, Globe, Rocket, ChevronLeft, Share2, Bookmark, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';

export const ARTICLES = [
    {
        id: 'autonomous-crm',
        title: 'The Future of Autonomous CRM Agents',
        excerpt: 'How LLMs are transforming customer relationship management from static databases to proactive business intelligence.',
        content: `
            <p>The traditional CRM is a passive repository of data. It waits for a human to enter a lead, update a status, or send an email. But the era of passive software is ending.</p>
            <h3>The Shift to Proactivity</h3>
            <p>Autonomous AI agents are turning CRMs into proactive engines. These agents don't just store lead data; they research the lead's company, identify intent signals across the web, and draft personalized outreach before a human even opens the tab.</p>
            <h3>Key Technical Pillars</h3>
            <ul>
                <li><strong>Vector Embeddings:</strong> Mapping customer interactions into high-dimensional space to understand sentiment and intent.</li>
                <li><strong>RAG (Retrieval-Augmented Generation):</strong> Ensuring the agent has up-to-the-minute product knowledge.</li>
                <li><strong>Logic Orchestration:</strong> Defining clear boundaries for agent autonomy vs human intervention.</li>
            </ul>
        `,
        date: 'Mar 15, 2026',
        readTime: '8 min',
        tag: 'AI',
        icon: Brain,
        color: 'var(--accent-orange)',
        depth: 7,
        roi: 'High'
    },
    {
        id: 'logic-pipelines',
        title: 'Scaling Agencies with Logic Pipelines',
        excerpt: 'A technical deep-dive into the architecture of automated workflow systems that eliminate the need for admin staff.',
        content: `
            <p>For high-growth agencies, the biggest bottleneck isn't talent — it's administration. Handing off data between project managers, designers, and accountants consumes 30% of billable time.</p>
            <h3>The Architecture of Logic</h3>
            <p>We build "Logic Pipelines" — interconnected flows that handle the boring stuff. From automated client onboarding to real-time project status dashboards triggered by GitHub commits or Figma updates.</p>
            <h3>Implementation Strategy</h3>
            <p>Start with the high-frequency, low-variance tasks. These are the "admin taxes" that, when removed, provide immediate ROI. Our pipelines leverage Python-based microservices to handle complex transformations that off-the-shelf tools like Zapier can't touch.</p>
        `,
        date: 'Feb 28, 2026',
        readTime: '12 min',
        tag: 'Engineering',
        icon: Cpu,
        color: 'var(--accent-cyan)',
        depth: 9,
        roi: 'Critical'
    },
    {
        id: 'ux-inversion',
        title: 'Designing for Inversion: A New UX Paradigm',
        excerpt: 'Why traditional UI is dead and why the future of user experience lies in predictive, AI-driven interfaces.',
        date: 'Jan 12, 2026',
        readTime: '6 min',
        tag: 'Design',
        icon: Globe,
        color: '#f06292',
        depth: 5,
        roi: 'Medium',
        content: `
            <p>Traditional UX is reactive. The user wants something, they click a button, the system responds. But in the era of pervasive AI, this "Pull" model is being replaced by an "Inverted" model.</p>
            <h3>The Push Paradigm</h3>
            <p>Interfaces will soon manifest only when needed. A "Zero-UI" approach where the system anticipates the user's intent based on historical patterns and real-time environmental data.</p>
            <h3>Engineering Anticipation</h3>
            <p>The technical challenge isn't just prediction — it's <strong>Contextual Awareness</strong>. Systems must maintain a high-fidelity graph of user state to ensure that "Push" interactions are helpful, not intrusive.</p>
        `
    }
];

const CATEGORIES = ['All', 'AI', 'Engineering', 'Design'];

export default function Insights() {
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [bookmarks, setBookmarks] = useState<string[]>(() => {
        const saved = localStorage.getItem('talos_bookmarks');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedArticleId]);

    const toggleBookmark = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newBookmarks = bookmarks.includes(id) 
            ? bookmarks.filter(b => b !== id) 
            : [...bookmarks, id];
        setBookmarks(newBookmarks);
        localStorage.setItem('talos_bookmarks', JSON.stringify(newBookmarks));
    };

    const filteredArticles = useMemo(() => {
        return ARTICLES.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 a.tag.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || a.tag === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const activeArticle = useMemo(() => 
        ARTICLES.find(a => a.id === selectedArticleId), 
    [selectedArticleId]);

    return (
        <div className="container py-24 min-h-screen px-4">
            <AnimatePresence mode="wait">
                {!selectedArticleId ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="max-w-4xl mb-16 md:mb-20">
                            <div className="badge badge-active mb-8 md:mb-10 uppercase tracking-[0.3em] font-black underline underline-offset-4 decoration-[var(--accent-cyan)] decoration-4">[LEADERSHIP INSIGHTS]</div>
                            <h1 className="text-5xl md:text-9xl mb-8 font-black tracking-tighter uppercase leading-[0.85] md:leading-[0.8]">Decoding <br /><span className="text-gradient-cyan text-glow-cyan">The Future.</span></h1>
                            <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-2xl opacity-80 border-l-2 border-[var(--accent-cyan)] pl-6 italic">
                                Strategic deep dives into engineering logic, AI architecture, and the digital standards of the hyper-automated era.
                            </p>
                        </div>

                        {/* Featured Highlight */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSelectedArticleId(ARTICLES[0].id)}
                            className="glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-[var(--border-color)] group hover:border-[var(--accent-cyan)] transition-all flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-24 md:mb-32 relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(0,229,255,0.03)] to-transparent pointer-events-none" />
                            <div className="w-full md:w-1/2 relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[10px] font-mono tracking-[0.3em] text-[var(--accent-cyan)] uppercase font-bold px-3 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--accent-cyan-glow)]">Latest Brief</span>
                                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] uppercase font-mono tracking-widest">
                                        <Calendar size={12} /> {ARTICLES[0].date}
                                    </div>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter group-hover:text-glow-cyan transition-all uppercase leading-[0.9]">
                                    Engineering the <br /><span className="text-gradient-cyan">Digital Core.</span>
                                </h2>
                                <p className="text-[var(--text-secondary)] mb-10 leading-relaxed text-base md:text-lg italic md:pr-12">
                                    "The next decade belongs to the hyper-automated. Those who can engineer logic into their business DNA will lead the market."
                                </p>
                                <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent-cyan)] group-hover:translate-x-3 transition-transform">
                                    Open Full Briefing <ArrowRight size={18} />
                                </button>
                            </div>
                            <div className="w-full md:w-1/2 flex justify-center items-center relative z-10 p-6 md:p-10 bg-white/5 rounded-[2rem] md:bg-transparent">
                                <Rocket className="text-[var(--accent-cyan)] w-24 h-24 md:w-32 md:h-32 group-hover:scale-110 transition-transform duration-700 blur-[0.3px] filter drop-shadow-[0_0_30px_var(--accent-cyan-glow)] animate-float" />
                            </div>
                        </motion.div>

                        {/* Inventory Controls */}
                        <div className="sticky top-[72px] z-[40] bg-[var(--bg-base)]/90 backdrop-blur-xl -mx-4 px-4 py-6 mb-12 border-b border-[rgba(0,229,255,0.1)] transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 max-w-7xl mx-auto">
                                <div className="flex flex-wrap md:flex-nowrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-6 md:px-8 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-mono uppercase tracking-widest transition-all border whitespace-nowrap min-w-fit ${
                                                activeCategory === cat 
                                                ? 'bg-[var(--accent-cyan)] text-black border-[var(--accent-cyan)] font-black shadow-[0_0_20px_var(--accent-cyan-glow)]' 
                                                : 'bg-transparent text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--accent-cyan)]'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative group w-full lg:min-w-[320px] lg:w-auto">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors" size={16} />
                                    <input 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Library Search..."
                                        className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl px-12 md:px-14 py-3 md:py-4 text-xs focus:border-[var(--accent-cyan)] outline-none w-full transition-all ring-0 focus:ring-4 focus:ring-[rgba(0,229,255,0.1)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 mb-24">
                            {filteredArticles.map((article, i) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setSelectedArticleId(article.id)}
                                    className="glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-[var(--border-color)] group hover:border-[var(--accent-cyan-glow)] transition-all flex flex-col h-full cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-6 right-8 flex gap-2">
                                        <button 
                                            onClick={(e) => toggleBookmark(article.id, e)}
                                            className={`p-2 rounded-lg transition-colors ${bookmarks.includes(article.id) ? 'text-[var(--accent-cyan)] bg-[rgba(0,229,255,0.1)]' : 'text-[var(--text-muted)] hover:text-white'}`}
                                        >
                                            <Bookmark size={16} fill={bookmarks.includes(article.id) ? "currentColor" : "none"} />
                                        </button>
                                    </div>
 
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--bg-surface-elevated)] flex items-center justify-center mb-6 md:mb-8 border border-[var(--border-color)] group-hover:bg-[rgba(255,255,255,0.05)] transition-all">
                                        <article.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: article.color }} />
                                    </div>
 
                                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                                        <span style={{ color: article.color }} className="font-black">{article.tag}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime}</span>
                                    </div>
 
                                    <h3 className="text-xl md:text-2xl font-black mb-6 group-hover:text-glow-cyan transition-all leading-[1.1] uppercase tracking-tighter">
                                        {article.title}
                                    </h3>
                                    
                                    <div className="flex gap-4 mb-8">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] md:text-[8px] uppercase tracking-widest text-[var(--text-muted)] mb-1">Depth</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(10)].map((_, i) => (
                                                    <div key={i} className={`w-1 md:w-1.5 h-2.5 md:h-3 rounded-full ${i < (article as any).depth ? 'bg-[var(--accent-cyan)]' : 'bg-white/5'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col border-l border-[var(--border-color)] pl-4">
                                            <span className="text-[7px] md:text-[8px] uppercase tracking-widest text-[var(--text-muted)] mb-1">ROI</span>
                                            <span className="text-[9px] md:text-[10px] font-black text-white italic uppercase tracking-widest">{(article as any).roi}</span>
                                        </div>
                                    </div>
 
                                    <p className="text-[var(--text-secondary)] text-sm mb-10 leading-relaxed opacity-70 flex-grow">
                                        {article.excerpt}
                                    </p>
                                    
                                    <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-cyan)] group-hover:gap-4 transition-all mt-auto border-t border-[var(--border-color)] pt-8 w-full">
                                        Open Intelligence <ArrowRight size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Newsletter */}
                        <div className="mt-40 md:mt-64 relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,229,255,0.05)] to-transparent pointer-events-none" />
                            <div className="max-w-4xl mx-auto text-center relative z-10 px-4 md:px-6">
                                <div className="badge badge-active mb-10 px-6 py-2">INSTITUTIONAL KNOWLEDGE</div>
                                <h3 className="text-5xl md:text-8xl font-black mb-8 md:mb-10 uppercase tracking-tighter leading-[0.85] md:leading-none">
                                    Join The <br /><span className="text-gradient-cyan text-glow-cyan text-7xl md:text-9xl">Circle.</span>
                                </h3>
                                <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed opacity-80 italic">
                                    "The technical edge isn't just found in code, but in the community of engineers who master it."
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <input 
                                        className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl px-6 md:px-8 py-4 md:py-5 text-sm md:text-base focus:border-[var(--accent-cyan)] outline-none w-full sm:w-[400px] ring-0 focus:ring-4 focus:ring-[rgba(0,229,255,0.1)] transition-all" 
                                        placeholder="Engineering Lead Email" 
                                    />
                                    <button className="btn btn-primary w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 text-xs md:text-sm font-black uppercase tracking-widest shadow-[0_0_50px_rgba(0,229,255,0.15)] group">
                                        Secure Access <ArrowRight className="inline ml-2 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                                <p className="text-[var(--text-muted)] text-[9px] md:text-[10px] mt-8 uppercase tracking-[0.4em] font-mono">1,200+ DECISION MAKERS ENROLLED</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="article"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-4xl mx-auto relative pt-8"
                    >
                        {/* Reading Progress */}
                        <ReadingProgress />
                        <button 
                            onClick={() => setSelectedArticleId(null)}
                            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors mb-8 md:mb-12"
                        >
                            <ChevronLeft size={18} /> Back to Insights
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-[10px] font-mono tracking-[0.3em] font-bold uppercase px-3 py-1 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]" style={{ color: activeArticle?.color }}>
                                {activeArticle?.tag}
                            </span>
                            <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono tracking-widest uppercase">
                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {activeArticle?.date}</span>
                                <span className="flex items-center gap-1.5"><Clock size={12} /> {activeArticle?.readTime} read</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-6xl font-bold mb-10 md:mb-12 uppercase tracking-tighter leading-[0.9] decoration-[var(--accent-cyan)] decoration-4 underline underline-offset-[12px]">
                            {activeArticle?.title}
                        </h1>

                        <div className="aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] md:rounded-[4.5rem] bg-gradient-to-br from-[var(--bg-surface-elevated)] to-[var(--bg-base)] mb-12 md:16 border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden p-8 md:p-12 shadow-2xl">
                            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            {activeArticle && <activeArticle.icon className="w-20 h-20 md:w-32 md:h-32 opacity-40 filter drop-shadow-[0_0_60px_var(--accent-cyan-glow)] animate-float" style={{ color: activeArticle.color }} />}
                            <div className="absolute bottom-6 md:bottom-10 left-8 md:left-12 right-8 md:right-12 flex justify-between items-end">
                                <div className="text-[8px] md:text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">Architecture Visualization</div>
                                <div className="flex gap-1.5 md:gap-2">
                                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
                                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-white/20" />
                                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-white/20" />
                                </div>
                            </div>
                        </div>

                        {/* Key Takeaways */}
                        <div className="glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-[var(--accent-cyan-glow)] mb-12 md:16 relative overflow-hidden bg-[rgba(0,229,255,0.02)]">
                            <div className="flex items-center gap-3 mb-6 text-[var(--accent-cyan)] uppercase font-black tracking-widest text-[10px] md:text-xs">
                                <Zap size={16} fill="currentColor" /> Executive Briefing
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <li className="flex items-start gap-4 text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed italic">
                                    <span className="text-[var(--accent-cyan)] font-mono">01</span>
                                    Autonomous shift from passive data storage to proactive business intelligence.
                                </li>
                                <li className="flex items-start gap-4 text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed italic">
                                    <span className="text-[var(--accent-cyan)] font-mono">02</span>
                                    Leveraging Vector Embeddings and RAG logic for 100% accuracy.
                                </li>
                            </ul>
                        </div>

                        <div 
                            className="prose prose-invert prose-talos max-w-none mb-24"
                            dangerouslySetInnerHTML={{ __html: activeArticle?.content || '' }}
                        />

                        <div className="flex items-center justify-between border-t border-b border-[var(--border-color)] py-10 mb-24">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--bg-surface-elevated)] flex items-center justify-center border border-[var(--border-color)]">
                                    <Brain size={20} className="text-[var(--accent-cyan)]" />
                                </div>
                                <div className="text-sm">
                                    <div className="font-bold">Engineering Team</div>
                                    <div className="text-[var(--text-muted)] text-[10px] uppercase font-mono tracking-widest">Thought Leadership</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="p-3 glass-panel rounded-xl hover:text-[var(--accent-cyan)] transition-colors"><Bookmark size={18} /></button>
                                <button className="p-3 glass-panel rounded-xl hover:text-[var(--accent-cyan)] transition-colors"><Share2 size={18} /></button>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 glass-panel rounded-[2rem] md:rounded-[3rem] text-center border border-[var(--border-color)] mb-12 md:24">
                            <h3 className="text-xl md:text-2xl font-bold mb-6">Want deeper technical expertise?</h3>
                            <p className="text-sm md:text-base text-[var(--text-secondary)] mb-8">Schedule a technical briefing with our lead engineers to discuss your specific infrastructure needs.</p>
                            <button className="btn btn-primary px-8 md:px-10 py-3.5 md:py-4 text-xs md:text-sm font-bold uppercase tracking-widest shadow-xl">Start Technical Briefing</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const h = document.documentElement;
            const b = document.body;
            const st = 'scrollTop';
            const sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            setProgress(percent);
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-1.5 z-[200] pointer-events-none">
            <motion.div 
                className="h-full bg-[var(--accent-cyan)] shadow-[0_0_20px_var(--accent-cyan-glow)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
            />
        </div>
    );
}
