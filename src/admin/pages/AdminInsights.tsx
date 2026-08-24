import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    EyeOff,
    BookOpen,
    Sparkles,
    CheckCircle2,
    Clock,
    Tag,
    BarChart2,
    ArrowUpRight,
} from 'lucide-react';
import AdminBadge from '../components/AdminBadge';

export interface InsightArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    tag: string;
    color: string;
    depth: number;
    roi: string;
    isPublished: boolean;
    isFeatured?: boolean;
    viewCount?: number;
    commentCount?: number;
    author?: {
        name: string;
        role: string;
    };
    createdAt?: any;
    updatedAt?: any;
}

export default function AdminInsights() {
    const [articles, setArticles] = useState<InsightArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'insights'), (snap) => {
            const list = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as InsightArticle[];

            setArticles(list);
            setLoading(false);
        }, (err) => {
            console.error('Error listening to insights collection:', err);
            setLoading(false);
        });

        return unsub;
    }, []);

    const togglePublishStatus = async (article: InsightArticle) => {
        try {
            await updateDoc(doc(db, 'insights', article.id), {
                isPublished: !article.isPublished,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Failed to update publication status:', error);
        }
    };

    const handleDeleteArticle = async () => {
        if (!deleteModalId) return;
        try {
            await deleteDoc(doc(db, 'insights', deleteModalId));
            setDeleteModalId(null);
        } catch (error) {
            console.error('Failed to delete article:', error);
        }
    };

    const filteredArticles = articles.filter((a) => {
        const matchesSearch =
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat =
            filterCategory === 'all' || a.tag.toLowerCase() === filterCategory.toLowerCase();

        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'published' && a.isPublished) ||
            (filterStatus === 'draft' && !a.isPublished);

        return matchesSearch && matchesCat && matchesStatus;
    });

    const totalPublished = articles.filter((a) => a.isPublished).length;
    const totalDrafts = articles.filter((a) => !a.isPublished).length;
    const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header Title Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-1.5 font-bold">
                        <BookOpen size={14} />
                        <span>CMS Content Engine</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                        Leadership Insights
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Manage technical briefings, draft strategic insights, and publish to the live site.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/insights"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-light)] transition-all"
                    >
                        <span>View Live Page</span>
                        <ArrowUpRight size={14} />
                    </Link>

                    <button
                        onClick={() => navigate('/admin/insights/editor')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-orange)] text-[var(--bg-base)] font-bold text-xs uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_var(--accent-orange-glow)] transition-all"
                    >
                        <Plus size={16} />
                        <span>New Briefing</span>
                    </button>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] flex items-center justify-center border border-[var(--accent-cyan)]/20">
                        <BookOpen size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Total Briefings</p>
                        <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{articles.length}</p>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Published Live</p>
                        <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{totalPublished}</p>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                        <Tag size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Draft In-Progress</p>
                        <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{totalDrafts}</p>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                        <BarChart2 size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Total Reader Views</p>
                        <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{totalViews}</p>
                    </div>
                </div>
            </div>

            {/* Filter & Controls Bar */}
            <div className="glass-panel p-4 rounded-2xl border border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                        type="text"
                        placeholder="Search title, tag, content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                    >
                        <option value="all">All Categories</option>
                        <option value="AI">AI</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                    >
                        <option value="all">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Drafts</option>
                    </select>
                </div>
            </div>

            {/* Content Table */}
            {loading ? (
                <div className="py-20 flex justify-center items-center">
                    <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--accent-cyan)] rounded-full animate-spin" />
                </div>
            ) : filteredArticles.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border border-[var(--border-color)] space-y-4">
                    <Sparkles className="mx-auto text-[var(--text-muted)]" size={32} />
                    <p className="text-base font-semibold text-[var(--text-primary)]">No briefing articles found</p>
                    <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                        Try adjusting your search criteria or click below to draft your first technical briefing.
                    </p>
                    <button
                        onClick={() => navigate('/admin/insights/editor')}
                        className="px-4 py-2 bg-[var(--accent-orange)] text-[var(--bg-base)] font-bold text-xs rounded-xl"
                    >
                        + Create First Article
                    </button>
                </div>
            ) : (
                <div className="glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-elevated)] text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                                    <th className="py-4 px-6">Briefing Title</th>
                                    <th className="py-4 px-4">Tag</th>
                                    <th className="py-4 px-4 text-center">Depth</th>
                                    <th className="py-4 px-4 text-center">Impact ROI</th>
                                    <th className="py-4 px-4 text-center">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)] text-xs">
                                {filteredArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-[var(--bg-surface-elevated)]/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                                                        {article.title}
                                                    </span>
                                                    {article.isFeatured && (
                                                        <span className="text-[8px] font-mono bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] px-2 py-0.5 rounded border border-[var(--accent-cyan)]/20 uppercase tracking-widest font-bold">
                                                            Spotlight
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-mono">
                                                    <span>{article.date}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)]" style={{ color: article.color }}>
                                                {article.tag}
                                            </span>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="font-mono font-bold text-[var(--accent-cyan)] text-xs">{article.depth}/10</span>
                                                <div className="flex gap-0.5 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-1 h-2 rounded-full ${i < Math.round(article.depth / 2) ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--border-color)]'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <AdminBadge
                                                roi={article.roi}
                                                size="xs"
                                                pill={false}
                                            />
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <button
                                                onClick={() => togglePublishStatus(article)}
                                                className="hover:opacity-90 transition-opacity"
                                                title={article.isPublished ? "Click to set Draft" : "Click to Publish"}
                                            >
                                                <AdminBadge
                                                    status={article.isPublished ? 'published' : 'draft'}
                                                    icon={article.isPublished ? <Eye size={11} /> : <EyeOff size={11} />}
                                                    label={article.isPublished ? 'Published' : 'Draft'}
                                                    size="xs"
                                                />
                                            </button>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/insights/editor/${article.id}`)}
                                                    className="p-2 rounded-lg bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] border border-[var(--border-color)] transition-all"
                                                    title="Edit Article"
                                                >
                                                    <Edit3 size={14} />
                                                </button>

                                                <button
                                                    onClick={() => setDeleteModalId(article.id)}
                                                    className="p-2 rounded-lg bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-rose-500 hover:border-rose-500/30 border border-[var(--border-color)] transition-all"
                                                    title="Delete Article"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] max-w-sm w-full space-y-4 shadow-2xl">
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Delete Briefing?</h3>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Are you sure you want to permanently delete this article? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModalId(null)}
                                className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteArticle}
                                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
