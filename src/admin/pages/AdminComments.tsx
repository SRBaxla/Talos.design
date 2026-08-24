import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import {
    MessageSquare,
    CheckCircle2,
    XCircle,
    Trash2,
    Search,
    Clock,
    User,
    Mail,
} from 'lucide-react';
import AdminBadge from '../components/AdminBadge';

export interface InsightComment {
    id: string;
    articleId: string;
    authorName: string;
    authorEmail: string;
    commentText: string;
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    createdAt?: any;
}

export default function AdminComments() {
    const [comments, setComments] = useState<InsightComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('pending');

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'insights_comments'), (snap) => {
            const list = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as InsightComment[];

            setComments(list);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching comments:', err);
            setLoading(false);
        });

        return unsub;
    }, []);

    const handleUpdateStatus = async (commentId: string, newStatus: 'approved' | 'rejected') => {
        try {
            await updateDoc(doc(db, 'insights_comments', commentId), {
                status: newStatus,
                moderatedAt: new Date(),
            });
        } catch (err) {
            console.error('Failed to update comment status:', err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        try {
            await deleteDoc(doc(db, 'insights_comments', commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const filteredComments = comments.filter((c) => {
        const matchesSearch =
            c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.authorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.commentText.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.articleId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' || c.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const pendingCount = comments.filter((c) => c.status === 'pending').length;
    const approvedCount = comments.filter((c) => c.status === 'approved').length;
    const rejectedCount = comments.filter((c) => c.status === 'rejected').length;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            {/* Title Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-cyan)] uppercase tracking-widest mb-1.5 font-bold">
                        <MessageSquare size={14} />
                        <span>Lead & Moderation Queue</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                        Reader Comments & Leads
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Moderate article comments, approve community discussions, and capture inbound engineering leads.
                    </p>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                        <Clock size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Pending Moderation</p>
                        <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{pendingCount}</p>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Approved Live</p>
                        <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{approvedCount}</p>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
                        <XCircle size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Rejected / Spam</p>
                        <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{rejectedCount}</p>
                    </div>
                </div>
            </div>

            {/* Filter & Controls Bar */}
            <div className="glass-panel p-4 rounded-2xl border border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                        type="text"
                        placeholder="Search name, email, comment text..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {['pending', 'approved', 'rejected', 'all'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setFilterStatus(st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
                                filterStatus === st
                                    ? 'bg-[var(--accent-cyan)] text-white border-[var(--accent-cyan)] shadow-sm'
                                    : 'bg-[var(--bg-base)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--border-color-light)]'
                            }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="py-20 flex justify-center items-center">
                    <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--accent-cyan)] rounded-full animate-spin" />
                </div>
            ) : filteredComments.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border border-[var(--border-color)] space-y-4">
                    <MessageSquare className="mx-auto text-[var(--text-muted)]" size={32} />
                    <p className="text-base font-semibold text-[var(--text-primary)]">No comments match the filter criteria</p>
                    <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                        Readers will submit comments and lead details from the live article reader view.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredComments.map((comment) => (
                        <div
                            key={comment.id}
                            className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-4 hover:border-[var(--border-color-light)] transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20 flex items-center justify-center shrink-0">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-primary)]">{comment.authorName}</p>
                                        <p className="text-xs text-[var(--accent-cyan)] font-mono flex items-center gap-1">
                                            <Mail size={12} />
                                            <span>{comment.authorEmail}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                                        Target Article: <strong className="text-[var(--text-primary)]">{comment.articleId}</strong>
                                    </span>
                                    <AdminBadge status={comment.status} size="xs" />
                                </div>
                            </div>

                            <p className="text-xs leading-relaxed text-[var(--text-secondary)] italic">
                                "{comment.commentText}"
                            </p>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                                    Submitted via Insights Article Reader View
                                </span>

                                <div className="flex items-center gap-2">
                                    {comment.status !== 'approved' && (
                                        <button
                                            onClick={() => handleUpdateStatus(comment.id, 'approved')}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/25 transition-all"
                                        >
                                            <CheckCircle2 size={14} />
                                            <span>Approve</span>
                                        </button>
                                    )}

                                    {comment.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold hover:bg-amber-500/25 transition-all"
                                        >
                                            <XCircle size={14} />
                                            <span>Reject</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                                        title="Delete Comment"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
