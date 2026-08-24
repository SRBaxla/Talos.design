import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import {
    ArrowLeft,
    Save,
    Sparkles,
    CheckCircle2,
    Code,
    Zap,
    Tag,
    Clock,
    FileText,
    Bold,
    Italic,
    Heading3,
    Pilcrow,
    List,
    Quote,
    Minus,
    Edit3,
} from 'lucide-react';

export default function AdminInsightsEditor() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [tag, setTag] = useState('AI');
    const [color, setColor] = useState('var(--accent-orange)');
    const [readTime, setReadTime] = useState('8 min read');
    const [depth, setDepth] = useState(7);
    const [roi, setRoi] = useState('High');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [date, setDate] = useState('Mar 15, 2026');

    useEffect(() => {
        if (!id) {
            setTitle('');
            setSlug('');
            setExcerpt('');
            setContent('');
            setTag('AI');
            setColor('var(--accent-orange)');
            setReadTime('8 min read');
            setDepth(7);
            setRoi('High');
            setIsPublished(true);
            setIsFeatured(false);
            setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
            setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            try {
                const snap = await getDoc(doc(db, 'insights', id));
                if (snap.exists()) {
                    const data = snap.data();
                    setTitle(data.title || '');
                    setSlug(data.slug || id);
                    setTag(data.tag || 'AI');
                    setColor(data.color || 'var(--accent-orange)');
                    setReadTime(data.readTime || '8 min read');
                    setDepth(data.depth || 7);
                    setRoi(data.roi || 'High');
                    setExcerpt(data.excerpt || '');
                    setContent(data.content || '');
                    setIsPublished(data.isPublished !== false);
                    setIsFeatured(!!data.isFeatured);
                    setDate(data.date || 'Mar 15, 2026');
                }
            } catch (err) {
                console.error('Error loading article for edit:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        if (!id) {
            const autoSlug = newTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setSlug(autoSlug);
        }
    };

    const editorRef = useRef<HTMLDivElement | null>(null);

    // Active format state — updated on every selection/cursor change
    const [formatState, setFormatState] = useState({
        bold: false,
        italic: false,
        blockH3: false,
        blockPre: false,
        blockQuote: false,
        list: false,
    });

    // Reads current selection formatting and syncs to toolbar highlight state
    const updateFormatState = () => {
        try {
            const blockTag = document.queryCommandValue('formatBlock').toLowerCase();
            setFormatState({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                blockH3: blockTag === 'h3',
                blockPre: blockTag === 'pre',
                blockQuote: blockTag === 'blockquote',
                list: document.queryCommandState('insertUnorderedList'),
            });
        } catch {
            // Silently ignore — browser may not support queryCommandState in all cases
        }
    };

    // Sync content into contentEditable innerHTML on load or when switching modes
    useEffect(() => {
        if (editorRef.current && content && editorMode === 'visual') {
            if (editorRef.current.innerHTML !== content) {
                editorRef.current.innerHTML = content;
            }
        }
    }, [content, editorMode]);

    const handleContentInput = () => {
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
        updateFormatState();
    };

    /**
     * Smart block-level formatter.
     * For formatBlock commands (h3, pre, blockquote): detects if the current block
     * already matches the target tag and toggles back to <p> if so — preventing nesting.
     * For inline commands (bold, italic): uses execCommand which natively toggles.
     */
    const execFormat = (command: string, value?: string) => {
        if (editorMode === 'code') return;

        editorRef.current?.focus();

        if (command === 'formatBlock' && value) {
            const normalizedTarget = value.replace(/[<>]/g, '').toLowerCase();
            const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
            // Toggle: if already the same block type, switch back to paragraph
            const applyTag = currentBlock === normalizedTarget ? '<p>' : value;
            document.execCommand('formatBlock', false, applyTag);
        } else {
            document.execCommand(command, false, value);
        }

        handleContentInput();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b' || e.key === 'B') {
                e.preventDefault();
                execFormat('bold');
            } else if (e.key === 'i' || e.key === 'I') {
                e.preventDefault();
                execFormat('italic');
            } else if (e.key === 'h' || e.key === 'H') {
                e.preventDefault();
                execFormat('formatBlock', '<h3>');
            } else if (e.key === 'k' || e.key === 'K') {
                e.preventDefault();
                execFormat('formatBlock', '<pre>');
            }
        }
    };

    const handleSave = async (publishState: boolean) => {
        if (!title.trim()) {
            alert('Please enter an article title.');
            return;
        }

        const documentId = id || slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        setSaving(true);
        setSaveSuccess(false);

        try {
            const now = serverTimestamp();
            const articlePayload = {
                id: documentId,
                slug: documentId,
                title: title.trim(),
                excerpt: excerpt.trim(),
                content: content.trim(),
                date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime,
                tag,
                color,
                depth: Number(depth),
                roi,
                isPublished: publishState,
                isFeatured,
                updatedAt: now,
                author: {
                    name: 'TALOS.DESIGN Engineering Team',
                    role: 'Thought Leadership',
                },
            };

            // If creating new document, set createdAt timestamp
            if (!id) {
                (articlePayload as any).createdAt = now;
                (articlePayload as any).viewCount = 0;
                (articlePayload as any).commentCount = 0;
            }

            await setDoc(doc(db, 'insights', documentId), articlePayload, { merge: true });

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

            if (!id) {
                navigate(`/admin/insights/editor/${documentId}`, { replace: true });
            }
        } catch (error) {
            console.error('Error saving article to Firestore:', error);
            alert('Failed to save article. Check console for details.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-36 flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--accent-cyan)] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
            {/* Header / Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/insights')}
                        className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-all"
                        title="Back to Insights List"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest font-bold">
                            <Sparkles size={12} />
                            <span>{id ? 'Editing Briefing' : 'New Strategic Briefing'}</span>
                        </div>
                        <h1 className="text-xl md:text-3xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                            {id ? title || 'Edit Briefing' : 'Create Leadership Briefing'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {saveSuccess && (
                        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-500 font-bold bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 size={14} />
                            <span>Saved to Cloud!</span>
                        </div>
                    )}

                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-light)] transition-all disabled:opacity-50"
                    >
                        Save Draft
                    </button>

                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-orange)] text-[var(--bg-base)] font-bold text-xs uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_var(--accent-orange-glow)] transition-all disabled:opacity-50"
                    >
                        <Save size={14} />
                        <span>{saving ? 'Saving...' : 'Publish Briefing'}</span>
                    </button>
                </div>
            </div>

            {/* Main Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Content & Excerpt) - 2 Cols */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-2">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                            <FileText size={14} />
                            <span>Briefing Title</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. The Future of Autonomous CRM Agents"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full text-lg font-bold p-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                        />
                    </div>

                    {/* Excerpt Abstract */}
                    <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-2">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                            <Zap size={14} />
                            <span>Executive Summary Excerpt</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="A concise 2-3 line summary appearing on grid cards and meta description..."
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full p-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors resize-none"
                        />
                    </div>

                    {/* In-Place Visual WYSIWYG Content Editor */}
                    <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-4">
                        {/* Header & Mode Switcher */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
                            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                                <Edit3 size={14} />
                                <span>Article Body & Intelligence Content</span>
                            </label>

                            <div className="flex items-center gap-1 bg-[var(--bg-base)] p-1 rounded-xl border border-[var(--border-color)] text-xs font-mono">
                                <button
                                    type="button"
                                    onClick={() => setEditorMode('visual')}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                                        editorMode === 'visual'
                                            ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent-cyan)] font-bold shadow-sm'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    }`}
                                    title="In-Place Visual WYSIWYG Formatting Editor"
                                >
                                    <Sparkles size={13} /> Visual Editor
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setEditorMode('code')}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                                        editorMode === 'code'
                                            ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent-cyan)] font-bold shadow-sm'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    }`}
                                    title="Raw HTML Source Code Mode"
                                >
                                    <Code size={13} /> HTML Source
                                </button>
                            </div>
                        </div>

                        {/* Visual Formatting Toolbar */}
                        {editorMode === 'visual' && (
                            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[var(--bg-base)] rounded-xl border border-[var(--border-color)]">
                                {/* H3 — active when cursor block is h3 */}
                                <button
                                    type="button"
                                    onClick={() => execFormat('formatBlock', '<h3>')}
                                    className={`p-2 rounded-lg transition-colors text-xs font-mono font-bold flex items-center gap-1 ${
                                        formatState.blockH3
                                            ? 'bg-[var(--accent-cyan)] text-white'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-surface-elevated)]'
                                    }`}
                                    title="Toggle Heading 3 (Ctrl+H)"
                                >
                                    <Heading3 size={14} /> H3
                                </button>

                                {/* Paragraph — always plain */}
                                <button
                                    type="button"
                                    onClick={() => execFormat('formatBlock', '<p>')}
                                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-surface-elevated)] transition-colors text-xs font-mono font-bold flex items-center gap-1"
                                    title="Reset to Paragraph"
                                >
                                    <Pilcrow size={14} /> Para
                                </button>

                                <div className="w-px h-4 bg-[var(--border-color)] mx-1" />

                                {/* Bold — active when selection is bold */}
                                <button
                                    type="button"
                                    onClick={() => execFormat('bold')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        formatState.bold
                                            ? 'bg-[var(--accent-cyan)] text-white'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-surface-elevated)]'
                                    }`}
                                    title="Toggle Bold (Ctrl+B)"
                                >
                                    <Bold size={14} />
                                </button>

                                {/* Italic — active when selection is italic */}
                                <button
                                    type="button"
                                    onClick={() => execFormat('italic')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        formatState.italic
                                            ? 'bg-[var(--accent-cyan)] text-white'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-surface-elevated)]'
                                    }`}
                                    title="Toggle Italic (Ctrl+I)"
                                >
                                    <Italic size={14} />
                                </button>

                                {/* Code Block — active when block is pre */}
                                <button
                                    type="button"
                                    onClick={() => execFormat('formatBlock', '<pre>')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        formatState.blockPre
                                            ? 'bg-[var(--accent-cyan)] text-white'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-surface-elevated)]'
                                    }`}
                                    title="Toggle Code Block (Ctrl+K)"
                                >
                                    <Code size={14} />
                                </button>

                                <div className="w-px h-4 bg-[var(--border-color)] mx-1" />

                                {/* Bullet List — active when list is active */}
                                <button
                                    type="button"
                                    onClick={() => execFormat('insertUnorderedList')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        formatState.list
                                            ? 'bg-[var(--accent-cyan)] text-white'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-surface-elevated)]'
                                    }`}
                                    title="Toggle Bullet List"
                                >
                                    <List size={14} />
                                </button>

                                {/* Blockquote */}
                                <button
                                    type="button"
                                    onClick={() => execFormat('formatBlock', 'blockquote')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        formatState.blockQuote
                                            ? 'bg-[var(--accent-cyan)] text-white'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-surface-elevated)]'
                                    }`}
                                    title="Toggle Quote Callout"
                                >
                                    <Quote size={14} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => execFormat('insertHorizontalRule')}
                                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                                    title="Insert Horizontal Divider"
                                >
                                    <Minus size={14} />
                                </button>

                                <span className="ml-auto text-[9px] font-mono text-[var(--text-muted)] hidden md:inline">
                                    Shortcuts: <strong className="text-[var(--accent-cyan)]">Ctrl+B</strong> Bold · <strong className="text-[var(--accent-cyan)]">Ctrl+I</strong> Italic · <strong className="text-[var(--accent-cyan)]">Ctrl+H</strong> H3
                                </span>
                            </div>
                        )}

                        {/* Editor Canvas Area */}
                        {editorMode === 'visual' ? (
                            <div
                                ref={editorRef}
                                contentEditable
                                onInput={handleContentInput}
                                onBlur={handleContentInput}
                                onKeyDown={handleKeyDown}
                                onKeyUp={updateFormatState}
                                onMouseUp={updateFormatState}
                                onSelect={updateFormatState}
                                className="prose dark:prose-invert prose-talos max-w-none text-xs leading-relaxed text-[var(--text-primary)] min-h-[350px] p-5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                                suppressContentEditableWarning
                            />
                        ) : (
                            <textarea
                                rows={16}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-4 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl font-mono text-xs leading-relaxed text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                                placeholder="<p>Raw HTML content...</p>"
                            />
                        )}
                    </div>
                </div>

                {/* Right Column (Metadata & Settings) - 1 Col */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-5">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent-cyan)] pb-2 border-b border-[var(--border-color)]">
                            Article Metadata
                        </h3>

                        {/* Category Tag */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                                <Tag size={12} /> Category Topic
                            </label>
                            <select
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="w-full p-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                            >
                                <option value="AI">AI</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Design">Design</option>
                                <option value="Strategy">Strategy</option>
                            </select>
                        </div>

                        {/* Read Time */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                                <Clock size={12} /> Read Time
                            </label>
                            <input
                                type="text"
                                value={readTime}
                                onChange={(e) => setReadTime(e.target.value)}
                                className="w-full p-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                            />
                        </div>

                        {/* Depth Score */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                                <span>Technical Depth Level</span>
                                <span className="font-bold text-[var(--accent-cyan)]">{depth}/10</span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={10}
                                value={depth}
                                onChange={(e) => setDepth(Number(e.target.value))}
                                className="w-full accent-[var(--accent-cyan)] cursor-pointer"
                            />
                        </div>

                        {/* ROI Impact Rating */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                                Business Impact ROI
                            </label>
                            <select
                                value={roi}
                                onChange={(e) => setRoi(e.target.value)}
                                className="w-full p-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                            >
                                <option value="Critical">Critical</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Standard">Standard</option>
                            </select>
                        </div>

                        {/* Publication Date */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                                Display Date
                            </label>
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="pt-3 border-t border-[var(--border-color)] space-y-3">
                            {/* Featured Toggle */}
                            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                                <span className="text-xs font-semibold text-[var(--text-primary)]">Spotlight Featured</span>
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-4 h-4 accent-[var(--accent-orange)] cursor-pointer"
                                />
                            </label>

                            {/* Publish Status Toggle */}
                            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                                <span className="text-xs font-semibold text-[var(--text-primary)]">Publish to Live Site</span>
                                <input
                                    type="checkbox"
                                    checked={isPublished}
                                    onChange={(e) => setIsPublished(e.target.checked)}
                                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
