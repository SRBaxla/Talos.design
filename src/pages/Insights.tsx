import { Zap, Calendar, Clock, ArrowRight, Brain, Cpu, Globe, ChevronLeft, Share2, Bookmark, Search, Edit3, Plus, ShieldCheck, MessageSquare, Edit2, Trash, UserCheck, LogOut, KeyRound, Sparkles, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, doc, updateDoc, increment, onSnapshot, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { db, auth } from '../admin/firebase/firebaseConfig';
import ReaderAuthModal from '../components/insights/ReaderAuthModal';
import ReaderOnboardingModal from '../components/insights/ReaderOnboardingModal';
import { getOrCreateUserProfile } from '../lib/userService';
import type { UserProfile } from '../lib/userService';


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
        excerpt: 'A technical deep-dive into the architecture of automated workflow systems that eliminate administrative overhead.',
        content: `
            <p>For high-growth agencies, the biggest bottleneck isn't talent — it's administration. Handing off data between project managers, designers, and accountants consumes 30% of billable time.</p>
            <h3>The Architecture of Logic</h3>
            <p>We build "Logic Pipelines" — interconnected flows that handle complex business processes. From automated client onboarding to real-time project status dashboards triggered by GitHub commits or Figma updates.</p>
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
        excerpt: 'Why traditional UI is evolving and why the future of user experience lies in predictive, context-aware interfaces.',
        content: `
            <p>Traditional UX is reactive. The user wants something, they click a button, the system responds. But in the era of pervasive AI, this "Pull" model is being replaced by an "Inverted" model.</p>
            <h3>The Push Paradigm</h3>
            <p>Interfaces will soon manifest only when needed. A "Zero-UI" approach where the system anticipates the user's intent based on historical patterns and real-time environmental data.</p>
            <h3>Engineering Anticipation</h3>
            <p>The technical challenge isn't just prediction — it's <strong>Contextual Awareness</strong>. Systems must maintain a high-fidelity graph of user state to ensure that "Push" interactions are helpful, not intrusive.</p>
        `,
        date: 'Jan 12, 2026',
        readTime: '6 min',
        tag: 'Design',
        icon: Globe,
        color: '#f06292',
        depth: 5,
        roi: 'Medium'
    },
    {
        id: 'agentic-workflows-2026',
        title: 'Architecting Multi-Agent Reasoning Systems',
        excerpt: 'Deconstructing multi-agent orchestration frameworks for deterministic execution and fault-tolerant tool calling.',
        content: `
            <p>Single LLM calls are prone to hallucinations and deadlocks when executed in open-ended domain environments. Multi-agent architectures divide complex goals into deterministic micro-tasks.</p>
            <h3>Supervisor vs Swarm Topologies</h3>
            <p>We analyze the trade-offs between centralized supervisor agents enforcing state machine constraints versus decentralized agent swarms passing contextual hands-off messages.</p>
            <h3>Resilience & Retry Policies</h3>
            <p>Implementing exponential backoff, schema validation interceptors, and human-in-the-loop fallback gates guarantees system stability in production environments.</p>
        `,
        date: 'Apr 02, 2026',
        readTime: '10 min',
        tag: 'AI',
        icon: Brain,
        color: '#a855f7',
        depth: 8,
        roi: 'High'
    },
    {
        id: 'sub-second-ssg',
        title: 'Sub-Second SSG & Edge Hydration at Scale',
        excerpt: 'Optimizing static pre-rendering, edge asset caching, and dynamic partial hydration for enterprise Web apps.',
        content: `
            <p>Page load performance directly dictates digital conversion rates. Pre-rendering pages into static HTML while streaming hydration scripts guarantees 100/100 Google Lighthouse performance scores.</p>
            <h3>Edge CDN Routing</h3>
            <p>By shifting page compilation to cloud edge nodes, server responses achieve global sub-50ms Time-To-First-Byte (TTFB) performance everywhere in the world.</p>
        `,
        date: 'Mar 28, 2026',
        readTime: '7 min',
        tag: 'Engineering',
        icon: Cpu,
        color: '#3b82f6',
        depth: 6,
        roi: 'High'
    },
    {
        id: 'spatial-design-systems',
        title: 'Glassmorphism & Spatial Design Tokens in 2026',
        excerpt: 'Creating mathematical color scales, backdrop blur elevation layers, and high-contrast accessibility standards.',
        content: `
            <p>Modern UI design balances rich visual depth with ruthless accessibility. We explore CSS custom property tokens that dynamically scale contrast in both light and dark display modes.</p>
            <h3>Glass & Micro-Interactions</h3>
            <p>Using hardware-accelerated CSS backdrops, subtle border gradients, and reactive spring animations gives web interfaces a tactile, state-of-the-art feel.</p>
        `,
        date: 'Mar 08, 2026',
        readTime: '5 min',
        tag: 'Design',
        icon: Globe,
        color: '#ec4899',
        depth: 4,
        roi: 'Medium'
    }
];

const CATEGORIES = ['All', 'AI', 'Engineering', 'Design'];

function getCategoryIcon(tag: string) {
    switch (tag?.toUpperCase()) {
        case 'AI': return Brain;
        case 'ENGINEERING': return Cpu;
        case 'DESIGN': return Globe;
        default: return Zap;
    }
}

export default function Insights() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [emailInput, setEmailInput] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [adminUser, setAdminUser] = useState<User | null>(null);

    // Phase 4: Comments & Subscriber State
    const [approvedComments, setApprovedComments] = useState<any[]>([]);
    const [commentAuthorName, setCommentAuthorName] = useState('');
    const [commentAuthorEmail, setCommentAuthorEmail] = useState('');
    const [commentText, setCommentText] = useState('');
    const [commentSubmitted, setCommentSubmitted] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

    // Reader Auth & Editing state
    const [readerUser, setReaderUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [onboardingInitialEmail, setOnboardingInitialEmail] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const navigate = useNavigate();

    // Fetch real subscriber count from Firestore stats
    useEffect(() => {
        try {
            const unsub = onSnapshot(doc(db, 'system_stats', 'insights_summary'), (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    if (typeof data.totalSubscribers === 'number') {
                        setSubscriberCount(data.totalSubscribers);
                    }
                }
            }, () => {});
            return unsub;
        } catch {
            // ignore
        }
    }, []);

    // Check if an Admin user or Reader user session is active
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setAdminUser(u);
            setReaderUser(u);
            if (u) {
                if (u.displayName) setCommentAuthorName(u.displayName);
                if (u.email) setCommentAuthorEmail(u.email);
                getOrCreateUserProfile(u).then((prof) => {
                    setUserProfile(prof);
                });
            } else {
                setUserProfile(null);
            }
        });
        return unsub;
    }, []);

    const handleSignOutReader = async () => {
        try {
            await signOut(auth);
            setReaderUser(null);
            setCommentAuthorName('');
            setCommentAuthorEmail('');
        } catch (err) {
            console.error('Sign out error:', err);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedArticleId) return;

        // Prompt reader auth modal if user is unauthenticated
        if (!readerUser) {
            setIsAuthModalOpen(true);
            return;
        }

        const nameToUse = (commentAuthorName.trim() || readerUser.displayName || readerUser.email?.split('@')[0] || 'Verified Reader');
        const emailToUse = (commentAuthorEmail.trim() || readerUser.email || '');

        if (!commentText.trim()) return;

        try {
            const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
            await addDoc(collection(db, 'insights_comments'), {
                articleId: selectedArticleId,
                userId: readerUser.uid,
                authorName: nameToUse,
                authorEmail: emailToUse,
                commentText: commentText.trim(),
                status: 'approved',
                createdAt: serverTimestamp(),
            });

            setCommentSubmitted(true);
            setCommentText('');
            setTimeout(() => setCommentSubmitted(false), 5000);
        } catch (err) {
            console.error('Failed to submit comment:', err);
        }
    };

    const handleStartEdit = (comment: any) => {
        setEditingCommentId(comment.id);
        setEditText(comment.commentText);
    };

    const handleSaveEdit = async (commentId: string) => {
        if (!editText.trim()) return;
        try {
            await updateDoc(doc(db, 'insights_comments', commentId), {
                commentText: editText.trim(),
                updatedAt: new Date(),
            });
            setEditingCommentId(null);
            setEditText('');
        } catch (err) {
            console.error('Failed to edit comment:', err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete your comment?')) return;
        try {
            await deleteDoc(doc(db, 'insights_comments', commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    // Dynamic Real-time Client Hydration from Cloud Firestore
    useEffect(() => {
        try {
            const q = query(
                collection(db, 'insights'),
                where('isPublished', '==', true)
            );

            const unsub = onSnapshot(q, (snap) => {
                if (!snap.empty) {
                    const dynamicList = snap.docs.map((d) => {
                        const data = d.data();
                        return {
                            id: d.id,
                            title: data.title || '',
                            excerpt: data.excerpt || '',
                            content: data.content || '',
                            date: data.date || '',
                            readTime: data.readTime || '5 min',
                            tag: data.tag || 'AI',
                            icon: getCategoryIcon(data.tag),
                            color: data.color || 'var(--accent-cyan)',
                            depth: data.depth || 5,
                            roi: data.roi || 'High',
                        };
                    });
                    setArticles(dynamicList);
                } else {
                    setArticles([]);
                }
                setLoading(false);
            }, (err) => {
                console.warn('Firestore insights real-time listener error:', err);
                setArticles([]);
                setLoading(false);
            });

            return unsub;
        } catch (err) {
            console.warn('Failed to attach Firestore insights listener:', err);
            setArticles([]);
            setLoading(false);
        }
    }, []);

    // Real-time listener for comments on selected article
    useEffect(() => {
        if (!selectedArticleId) return;

        const q = query(
            collection(db, 'insights_comments'),
            where('articleId', '==', selectedArticleId)
        );

        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter((c: any) => c.status !== 'rejected');
            setApprovedComments(list);
        }, (err) => {
            console.warn('Comment listener error:', err);
        });

        return unsub;
    }, [selectedArticleId]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('talos_bookmarks');
            if (saved) {
                setBookmarks(JSON.parse(saved));
            }
        } catch {
            // Ignore localStorage errors
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Track article page view count in Firestore
        if (selectedArticleId) {
            try {
                updateDoc(doc(db, 'insights', selectedArticleId), {
                    viewCount: increment(1),
                }).catch(() => {});
            } catch {}
        }
    }, [selectedArticleId]);

    const toggleBookmark = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newBookmarks = bookmarks.includes(id) 
            ? bookmarks.filter(b => b !== id) 
            : [...bookmarks, id];
        setBookmarks(newBookmarks);
        try {
            localStorage.setItem('talos_bookmarks', JSON.stringify(newBookmarks));
        } catch {
            // Ignore localStorage errors
        }
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        const enteredEmail = emailInput.trim();
        if (enteredEmail) {
            try {
                const { addDoc, collection, serverTimestamp, setDoc, doc, increment } = await import('firebase/firestore');
                await addDoc(collection(db, 'subscribers'), {
                    email: enteredEmail,
                    status: 'active',
                    source: '/insights#newsletter',
                    subscribedAt: serverTimestamp(),
                });

                await setDoc(doc(db, 'system_stats', 'insights_summary'), {
                    totalSubscribers: increment(1),
                    lastUpdated: serverTimestamp(),
                }, { merge: true });

                setSubscriberCount((prev) => (prev !== null ? prev + 1 : 1));
            } catch (err) {
                console.warn('Subscription saved locally:', err);
            }

            setSubscribed(true);
            setOnboardingInitialEmail(enteredEmail);
            setEmailInput('');
            setIsOnboardingOpen(true);
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const filteredArticles = useMemo(() => {
        return articles.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 a.tag.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || a.tag === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [articles, searchQuery, activeCategory]);

    const activeArticle = useMemo(() => 
        articles.find(a => a.id === selectedArticleId), 
    [articles, selectedArticleId]);

    return (
        <div className="container py-24 min-h-screen px-4">
            {/* Admin Floating Quick-Edit Control Bar */}
            {adminUser && (
                <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 p-2 pl-4 rounded-full bg-[var(--bg-surface-elevated)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-cyan)]">
                        <ShieldCheck size={16} />
                        <span className="hidden sm:inline">ADMIN CMS MODE</span>
                    </div>

                    {selectedArticleId ? (
                        <button
                            onClick={() => navigate(`/admin/insights/editor/${selectedArticleId}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent-cyan)] text-black font-bold text-xs hover:scale-105 transition-transform"
                            title="Edit this article in Admin CMS"
                        >
                            <Edit3 size={14} />
                            <span>Edit Article</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/admin/insights/editor')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent-orange)] text-[var(--bg-base)] font-bold text-xs hover:scale-105 transition-transform"
                            title="Create new article in Admin CMS"
                        >
                            <Plus size={14} />
                            <span>New Article</span>
                        </button>
                    )}

                    <Link
                        to="/admin/insights"
                        className="px-3 py-1.5 rounded-full bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold"
                    >
                        Dashboard
                    </Link>
                </div>
            )}

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

                        {loading ? (
                            /* Loading Skeleton */
                            <div className="space-y-12 mb-24">
                                <div className="glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-[var(--border-color)] animate-pulse h-64 flex flex-col justify-center">
                                    <div className="h-4 bg-[var(--bg-surface-elevated)] rounded w-1/4 mb-4" />
                                    <div className="h-8 bg-[var(--bg-surface-elevated)] rounded w-3/4 mb-4" />
                                    <div className="h-4 bg-[var(--bg-surface-elevated)] rounded w-1/2" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                                    {[1, 2, 3].map((n) => (
                                        <div key={n} className="glass-panel p-8 rounded-[2rem] border border-[var(--border-color)] animate-pulse h-72">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-elevated)] mb-6" />
                                            <div className="h-5 bg-[var(--bg-surface-elevated)] rounded w-3/4 mb-4" />
                                            <div className="h-3 bg-[var(--bg-surface-elevated)] rounded w-full mb-2" />
                                            <div className="h-3 bg-[var(--bg-surface-elevated)] rounded w-2/3" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : articles.length === 0 ? (
                            /* Null State: No Published Articles */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-10 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] border border-[var(--border-color)] text-center max-w-3xl mx-auto my-12 mb-24 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.03)] to-transparent pointer-events-none" />
                                
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                                    <Brain className="w-8 h-8 md:w-10 md:h-10 text-[var(--accent-cyan)] animate-pulse" />
                                </div>

                                <div className="badge badge-active mb-6 px-4 py-1 uppercase tracking-[0.25em] text-[9px] md:text-[10px] font-mono">
                                    [ARCHIVE UNDER PREPARATION]
                                </div>

                                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 leading-tight">
                                    No Published Briefings <br />
                                    <span className="text-gradient-cyan">Currently Available.</span>
                                </h2>

                                <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8 opacity-85">
                                    Our engineering team is currently updating, peer-reviewing, and drafting fresh deep-dives on autonomous AI agents, logic pipelines, and system architectures. Check back soon or subscribe to be notified.
                                </p>

                                {adminUser && (
                                    <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-mono max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                                        <span>Admin Notice: All articles are currently in Draft status.</span>
                                        <Link
                                            to="/admin/insights"
                                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs uppercase tracking-wider shrink-0 hover:scale-105 transition-transform"
                                        >
                                            Open CMS
                                        </Link>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-4 justify-center">
                                    <Link to="/services" className="btn btn-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg">
                                        Explore Services →
                                    </Link>
                                    <Link to="/contact" className="px-6 py-3.5 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-cyan)] text-xs font-bold uppercase tracking-wider transition-colors text-[var(--text-primary)]">
                                        Contact Engineering Team
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* Featured Highlight */}
                                {articles.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={() => setSelectedArticleId(articles[0].id)}
                                        className="glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-[var(--border-color)] group hover:border-[var(--accent-cyan)] transition-all flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-24 md:mb-32 relative overflow-hidden cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(0,229,255,0.03)] to-transparent pointer-events-none" />
                                        <div className="w-full md:w-1/2 relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <span className="text-[10px] font-mono tracking-[0.3em] text-[var(--accent-cyan)] uppercase font-bold px-3 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--accent-cyan-glow)]">Featured Brief</span>
                                                <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] uppercase font-mono tracking-widest">
                                                    <Calendar size={12} /> {articles[0].date}
                                                </div>
                                            </div>
                                            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter group-hover:text-glow-cyan transition-all uppercase leading-[0.9]">
                                                {articles[0].title}
                                            </h2>
                                            <p className="text-[var(--text-secondary)] mb-10 leading-relaxed text-base md:text-lg italic md:pr-12">
                                                "{articles[0].excerpt}"
                                            </p>
                                            <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent-cyan)] group-hover:translate-x-3 transition-transform">
                                                Open Full Briefing <ArrowRight size={18} />
                                            </button>
                                        </div>
                                        <div className="w-full md:w-1/2 flex justify-center items-center relative z-10 p-6 md:p-10 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-[2rem] md:border-none md:bg-transparent">
                                            {(() => {
                                                const FeaturedIcon = articles[0]?.icon || Brain;
                                                return <FeaturedIcon className="text-[var(--accent-cyan)] w-24 h-24 md:w-32 md:h-32 group-hover:scale-110 transition-transform duration-700 blur-[0.3px] filter drop-shadow-[0_0_30px_var(--accent-cyan-glow)] animate-float" />;
                                            })()}
                                        </div>
                                    </motion.div>
                                )}

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
                                                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent-cyan)]'
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4 w-full lg:w-auto">
                                            <div className="text-[10px] font-mono text-[var(--text-secondary)] font-bold uppercase tracking-wider whitespace-nowrap hidden sm:block">
                                                {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'}
                                            </div>
                                            <div className="relative group w-full lg:min-w-[320px] lg:w-auto">
                                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors" size={16} />
                                                <input 
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Library Search..."
                                                    className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl px-12 md:px-14 py-3 md:py-4 text-xs focus:border-[var(--accent-cyan)] outline-none w-full transition-all ring-0 focus:ring-4 focus:ring-[rgba(0,229,255,0.1)] text-[var(--text-primary)]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Empty State */}
                                {filteredArticles.length === 0 ? (
                                    <div className="glass-card p-12 rounded-[2rem] border border-[var(--border-color)] text-center my-12 mb-24 max-w-xl mx-auto">
                                        <Search size={36} className="text-[var(--text-muted)] mx-auto mb-4" />
                                        <h3 className="text-xl font-bold uppercase mb-2">No Matching Briefings</h3>
                                        <p className="text-xs md:text-sm text-[var(--text-secondary)] mb-6">
                                            No articles found matching "{searchQuery}" in category "{activeCategory}".
                                        </p>
                                        <button
                                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                            className="btn btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                ) : (
                                    /* Grid */
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
                                                        className={`p-2 rounded-lg transition-colors ${bookmarks.includes(article.id) ? 'text-[var(--accent-cyan)] bg-[rgba(0,229,255,0.1)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                                    >
                                                        <Bookmark size={16} fill={bookmarks.includes(article.id) ? "currentColor" : "none"} />
                                                    </button>
                                                </div>
            
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--bg-surface-elevated)] flex items-center justify-center mb-6 md:mb-8 border border-[var(--border-color)] group-hover:border-[var(--accent-cyan)] transition-all">
                                                    <article.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: article.color }} />
                                                </div>
            
                                                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                                                    <span style={{ color: article.color }} className="font-black">{article.tag}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime}</span>
                                                </div>
            
                                                <h3 className="text-xl md:text-2xl font-black mb-6 text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-all leading-[1.1] uppercase tracking-tighter">
                                                    {article.title}
                                                </h3>
                                                <div className="flex items-center justify-between gap-4 mb-8 p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center justify-between text-[8px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5 font-mono">
                                                            <span>Technical Depth</span>
                                                            <span className="font-bold text-[var(--accent-cyan)]">{(article as any).depth}/10</span>
                                                        </div>
                                                        <div className="flex gap-1" title={`Complexity: ${(article as any).depth}/10`}>
                                                            {[...Array(10)].map((_, idx) => (
                                                                <div key={idx} className={`w-1.5 h-3 rounded-full transition-all ${idx < (article as any).depth ? 'bg-[var(--accent-cyan)] shadow-[0_0_6px_var(--accent-cyan-glow)]' : 'bg-[var(--border-color)]'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end border-l border-[var(--border-color)] pl-4 shrink-0">
                                                        <span className="text-[8px] uppercase tracking-widest text-[var(--text-muted)] mb-1 font-mono">Impact ROI</span>
                                                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                                            (article as any).roi === 'Critical' ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30' :
                                                            (article as any).roi === 'High' ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' :
                                                            'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                                                        }`}>
                                                            {(article as any).roi}
                                                        </span>
                                                    </div>
                                                </div>
            
                                                <p className="text-[var(--text-secondary)] text-sm mb-10 leading-relaxed flex-grow">
                                                    {article.excerpt}
                                                </p>
                                                
                                                <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-cyan)] group-hover:gap-4 transition-all mt-auto border-t border-[var(--border-color)] pt-8 w-full">
                                                    Open Intelligence <ArrowRight size={14} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}


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

                                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <input 
                                        type="email"
                                        required
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl px-6 md:px-8 py-4 md:py-5 text-sm md:text-base focus:border-[var(--accent-cyan)] outline-none w-full sm:w-[400px] ring-0 focus:ring-4 focus:ring-[rgba(0,229,255,0.1)] transition-all" 
                                        placeholder="Engineering Lead Email" 
                                    />
                                    <button type="submit" className="btn btn-primary w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 text-xs md:text-sm font-black uppercase tracking-widest shadow-[0_0_50px_rgba(0,229,255,0.15)] group">
                                        Secure Access <ArrowRight className="inline ml-2 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </form>
                                {subscribed && (
                                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-400 font-mono text-xs mt-4">
                                        ✓ Successfully subscribed! Check your inbox for briefing access code.
                                    </motion.p>
                                )}
                                <p className="text-[var(--text-muted)] text-[9px] md:text-[10px] mt-8 uppercase tracking-[0.25em] sm:tracking-[0.4em] font-mono">
                                    {subscriberCount !== null && subscriberCount >= 1000 ? (
                                        `${subscriberCount.toLocaleString()}+ DECISION MAKERS ENROLLED`
                                    ) : (
                                        "DON'T MISS CUTTING-EDGE TECH & ARCHITECTURE UPDATES — 100% FREE"
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : !activeArticle ? (
                    <motion.div
                        key="not-found"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-12 rounded-[2.5rem] border border-[var(--border-color)] text-center max-w-xl mx-auto my-24"
                    >
                        <Brain className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                        <h3 className="text-xl font-bold uppercase mb-2">Briefing Not Available</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">
                            This briefing is currently unpublished or has been saved as a draft.
                        </p>
                        <button
                            onClick={() => setSelectedArticleId(null)}
                            className="btn btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                        >
                            ← Return to All Insights
                        </button>
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
                            className="prose dark:prose-invert prose-talos max-w-none mb-24 text-[var(--text-primary)]"
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
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={(e) => activeArticle && toggleBookmark(activeArticle.id, e)} 
                                    className={`p-3 glass-panel rounded-xl hover:text-[var(--accent-cyan)] transition-colors ${activeArticle && bookmarks.includes(activeArticle.id) ? 'text-[var(--accent-cyan)]' : ''}`}
                                >
                                    <Bookmark size={18} fill={activeArticle && bookmarks.includes(activeArticle.id) ? "currentColor" : "none"} />
                                </button>
                                <button onClick={handleShare} className="p-3 glass-panel rounded-xl hover:text-[var(--accent-cyan)] transition-colors relative">
                                    <Share2 size={18} />
                                    {copied && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--accent-cyan)] text-black font-mono text-[9px] px-2 py-0.5 rounded font-bold whitespace-nowrap">
                                            Copied!
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Interactive Reader Comments & Lead Form */}
                        <div className="glass-panel p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-[var(--border-color)] mb-16 space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest font-bold mb-1">
                                        <MessageSquare size={14} />
                                        <span>Engineering Discussion</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                                        Reader Comments & Insights ({approvedComments.length})
                                    </h3>
                                </div>

                                {/* Reader Session Badge / Auth Button */}
                                <div>
                                    {readerUser ? (
                                        <div className="flex flex-wrap items-center gap-2 bg-[var(--bg-base)] border border-[var(--border-color)] px-3.5 py-1.5 rounded-full text-xs">
                                            <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                                                <UserCheck size={14} className="text-emerald-500" />
                                                <span>{userProfile?.displayName || readerUser.displayName || readerUser.email?.split('@')[0]}</span>
                                            </div>

                                            {/* Unified Role Badges */}
                                            <span className="text-[9px] font-mono font-bold bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)] px-2 py-0.5 rounded border border-[var(--accent-cyan)]/30">
                                                Reader
                                            </span>

                                            {userProfile?.roles.includes('client') && (
                                                <Link
                                                    to="/portal/dashboard"
                                                    className="text-[9px] font-mono font-bold bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] px-2 py-0.5 rounded border border-[var(--accent-orange)]/30 flex items-center gap-1 hover:underline"
                                                    title="Open Client Portal"
                                                >
                                                    <Briefcase size={10} /> Portal →
                                                </Link>
                                            )}

                                            {userProfile?.roles.includes('admin') && (
                                                <Link
                                                    to="/admin/insights"
                                                    className="text-[9px] font-mono font-bold bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 hover:underline"
                                                    title="Open Admin CMS"
                                                >
                                                    CMS
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => setIsOnboardingOpen(true)}
                                                className="text-[10px] font-mono text-[var(--accent-cyan)] hover:underline flex items-center gap-1 pl-1.5 border-l border-[var(--border-color)] transition-colors"
                                                title="Configure Reading Topics"
                                            >
                                                <Sparkles size={11} /> Preferences
                                            </button>

                                            <button
                                                onClick={handleSignOutReader}
                                                className="text-[10px] font-mono text-[var(--text-muted)] hover:text-rose-400 flex items-center gap-1 pl-1.5 border-l border-[var(--border-color)] transition-colors"
                                                title="Sign Out"
                                            >
                                                <LogOut size={11} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setOnboardingInitialEmail('');
                                                    setIsOnboardingOpen(true);
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--accent-cyan)] text-black font-bold text-xs hover:shadow-[0_0_15px_var(--accent-cyan-glow)] transition-all"
                                            >
                                                <Sparkles size={13} />
                                                <span>Join / Topics</span>
                                            </button>
                                            <button
                                                onClick={() => setIsAuthModalOpen(true)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs transition-all"
                                            >
                                                <KeyRound size={13} />
                                                <span>Sign In</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Approved Comments List with Edit & Delete for Owners */}
                            {approvedComments.length > 0 && (
                                <div className="space-y-6 divide-y divide-[var(--border-color)]">
                                    {approvedComments.map((c) => {
                                        const isOwner = readerUser && (c.userId === readerUser.uid || (c.authorEmail && c.authorEmail.toLowerCase() === readerUser.email?.toLowerCase()));
                                        const isEditing = editingCommentId === c.id;

                                        return (
                                            <div key={c.id} className="pt-6 first:pt-0 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-[var(--text-primary)]">{c.authorName}</span>
                                                        {isOwner && (
                                                            <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                                                You (Author)
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-mono text-[var(--text-muted)]">Verified Reader</span>
                                                        {isOwner && !isEditing && (
                                                            <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--border-color)]">
                                                                <button
                                                                    onClick={() => handleStartEdit(c)}
                                                                    className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
                                                                    title="Edit your comment"
                                                                >
                                                                    <Edit2 size={13} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteComment(c.id)}
                                                                    className="p-1 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                                                                    title="Delete your comment"
                                                                >
                                                                    <Trash size={13} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Inline Editor or Display Text */}
                                                {isEditing ? (
                                                    <div className="space-y-2 pt-1">
                                                        <textarea
                                                            rows={2}
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            className="w-full p-3 bg-[var(--bg-base)] border border-[var(--accent-cyan)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                                                        />
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <button
                                                                onClick={() => setEditingCommentId(null)}
                                                                className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[10px] font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleSaveEdit(c.id)}
                                                                className="px-3 py-1.5 rounded-lg bg-[var(--accent-cyan)] text-black text-[10px] font-mono font-bold hover:scale-105 transition-transform"
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                                                        "{c.commentText}"
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Comment Capture Form */}
                            <form onSubmit={handleCommentSubmit} className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-[var(--text-primary)]">
                                        Join the Technical Discussion
                                    </h4>
                                    {readerUser && (
                                        <span className="text-xs text-[var(--text-secondary)] font-mono">
                                            Posting as: <strong className="text-[var(--accent-cyan)]">{userProfile?.displayName || readerUser.displayName || readerUser.email}</strong>
                                        </span>
                                    )}
                                </div>

                                {!readerUser ? (
                                    <div className="p-4 rounded-2xl bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="text-xs text-[var(--text-secondary)]">
                                            <strong className="text-[var(--text-primary)]">Unified Talos ID:</strong> Sign in to post, edit comments, or customize your briefing streams. Clients can use their existing portal login.
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOnboardingInitialEmail('');
                                                    setIsOnboardingOpen(true);
                                                }}
                                                className="px-3.5 py-2 rounded-xl bg-[var(--accent-cyan)] text-black font-bold text-xs hover:scale-105 transition-transform"
                                            >
                                                Register & Customize
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsAuthModalOpen(true)}
                                                className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] font-bold text-xs hover:bg-[var(--bg-surface-elevated)] transition-all"
                                            >
                                                Sign In
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Your Name / Title"
                                            value={commentAuthorName || readerUser.displayName || ''}
                                            onChange={(e) => setCommentAuthorName(e.target.value)}
                                            className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-cyan)] outline-none"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Engineering Email"
                                            value={commentAuthorEmail || readerUser.email || ''}
                                            onChange={(e) => setCommentAuthorEmail(e.target.value)}
                                            className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-cyan)] outline-none"
                                        />
                                    </div>
                                )}

                                <textarea
                                    required={!!readerUser}
                                    rows={3}
                                    onClick={() => !readerUser && setIsAuthModalOpen(true)}
                                    placeholder={readerUser ? "Share your technical feedback or questions regarding this briefing..." : "Click to sign in and share your feedback..."}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-cyan)] outline-none resize-none"
                                />

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest shadow-lg"
                                    >
                                        {readerUser ? 'Submit Comment →' : 'Sign In to Comment'}
                                    </button>

                                    {commentSubmitted && (
                                        <span className="text-xs font-mono text-emerald-400 font-bold">
                                            ✓ Comment published live!
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="p-8 md:p-12 glass-panel rounded-[2rem] md:rounded-[3rem] text-center border border-[var(--border-color)] mb-12 md:24">
                            <h3 className="text-xl md:text-2xl font-bold mb-6">Want deeper technical expertise?</h3>
                            <p className="text-sm md:text-base text-[var(--text-secondary)] mb-8">Schedule a technical briefing with our lead engineers to discuss your specific infrastructure needs.</p>
                            <Link to="/contact" className="btn btn-primary px-8 md:px-10 py-3.5 md:py-4 text-xs md:text-sm font-bold uppercase tracking-widest shadow-xl inline-flex items-center gap-2">
                                Start Technical Briefing →
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reader Authentication Modal */}
            <ReaderAuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {}}
                onOpenOnboarding={() => {
                    setIsAuthModalOpen(false);
                    setIsOnboardingOpen(true);
                }}
            />

            {/* Reader Onboarding & Topic Preferences Modal */}
            <ReaderOnboardingModal
                isOpen={isOnboardingOpen}
                onClose={() => setIsOnboardingOpen(false)}
                initialEmail={onboardingInitialEmail}
                currentUser={readerUser}
                onCompleted={(prof) => setUserProfile(prof)}
            />

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
