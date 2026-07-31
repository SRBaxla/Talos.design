import { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, X, Eye, EyeOff, ShieldCheck, Globe, Info, RefreshCw, DollarSign, Clock, CheckCircle2, Zap } from 'lucide-react';
import { updateCaseStudy, updateProject } from '../store/adminStore';

interface PreviewItem {
    id: string;
    title: string;
    client?: string;
    category?: string;
    description?: string;
    challenge?: string;
    solution?: string;
    results?: string;
    liveUrl?: string;
    showOnWebsite?: boolean;
    budget?: any;
    turnaround?: string;
    features?: string[];
    type: 'caseStudy' | 'project';
}

interface AdminPreviewWidgetModalProps {
    open: boolean;
    onClose: () => void;
    item: PreviewItem | null;
}

export default function AdminPreviewWidgetModal({ open, onClose, item }: AdminPreviewWidgetModalProps) {
    const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [displayMode, setDisplayMode] = useState<'live' | 'details'>('live');
    const [iframeLoading, setIframeLoading] = useState(true);
    const [visibleOnWebsite, setVisibleOnWebsite] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (item) {
            setVisibleOnWebsite(item.showOnWebsite !== false);
            setDisplayMode('live');
            setIframeLoading(true);
        }
    }, [item]);

    // Lock body scrolling when widget preview is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open || !item) return null;

    const handleToggleWebsiteVisibility = async () => {
        setUpdating(true);
        try {
            const nextState = !visibleOnWebsite;
            if (item.type === 'caseStudy') {
                await updateCaseStudy(item.id, { showOnWebsite: nextState, status: nextState ? 'published' : 'draft' });
            } else {
                await updateProject(item.id, { status: nextState ? 'published' : 'in-progress' });
            }
            setVisibleOnWebsite(nextState);
        } catch (err) {
            console.error('Failed to update website visibility:', err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-hidden" onClick={onClose}>
            <div 
                className="w-full max-w-6xl h-[88vh] max-h-[850px] rounded-[2rem] overflow-hidden relative glass-panel border border-[var(--border-color)] bg-[#07090E] shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header & Controls Bar */}
                <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:opacity-80" onClick={onClose} />
                            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <span className="w-3 h-3 rounded-full bg-green-400/80" />
                        </div>

                        {/* Integrated Live URL Address Bar */}
                        <div className="flex items-center gap-2 bg-[#07090E] px-3 py-1 rounded-xl border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[220px] sm:max-w-md">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                            <span className="truncate">{item.liveUrl || 'https://talos.design'}</span>
                            {item.liveUrl && (
                                <a 
                                    href={item.liveUrl} 
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

                        <button onClick={onClose} className="p-1.5 text-[var(--text-muted)] hover:text-white rounded-lg">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Direct Edge-To-Edge Preview Canvas */}
                <div className="flex-1 min-h-0 relative bg-black/70 overflow-hidden flex items-center justify-center">
                    <div 
                        className={`transition-all duration-300 w-full h-full flex flex-col items-center justify-center ${
                            deviceView === 'desktop' ? 'max-w-full' :
                            deviceView === 'tablet' ? 'max-w-[720px] py-4' : 'max-w-[360px] py-4'
                        }`}
                    >
                        <div className="w-full h-full relative bg-white overflow-hidden flex-1 min-h-0 shadow-2xl rounded-none sm:rounded-xl">
                            {/* Canvas Content: Interactive Iframe vs Case Study Overview */}
                            {displayMode === 'live' && item.liveUrl ? (
                                <div className="relative w-full h-full flex-1 min-h-0 bg-white overflow-hidden">
                                    {iframeLoading && (
                                        <div className="absolute inset-0 bg-[#07090E] flex flex-col items-center justify-center gap-3 z-10">
                                            <RefreshCw size={24} className="text-[var(--accent-cyan)] animate-spin" />
                                            <span className="text-xs font-mono text-[var(--text-muted)]">Loading live site: {item.liveUrl}</span>
                                        </div>
                                    )}
                                    <div className="w-full h-full overflow-hidden relative flex-1 min-h-0">
                                        <iframe 
                                            src={item.liveUrl} 
                                            title={item.title}
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
                                                {item.category || 'Website Project'}
                                            </span>
                                            {item.client && (
                                                <span className="text-xs font-mono text-white/70 flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                                    Client: <strong className="text-white">{item.client}</strong>
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4 tracking-tight">{item.title}</h3>
                                        <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-3xl">
                                            {item.description || item.solution || item.challenge || 'High-performance digital platform engineered by Talos.design.'}
                                        </p>
                                    </div>

                                    {/* Key Specs & Financials Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <DollarSign size={12} className="text-emerald-400" /> Estimated Cost
                                            </div>
                                            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                                                {item.budget ? (isNaN(Number(item.budget)) ? item.budget : `$${Number(item.budget).toLocaleString()}`) : '$1,500'}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <Clock size={12} className="text-sky-400" /> Turnaround
                                            </div>
                                            <div className="text-lg sm:text-xl font-bold font-mono text-white">
                                                {item.turnaround || '14 Days'}
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
                                            {(item.features || [
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
                                            <ShieldCheck size={14} className="text-emerald-400" /> Verified Production Build
                                        </div>
                                        {item.liveUrl && (
                                            <a 
                                                href={item.liveUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="px-6 py-2.5 rounded-xl bg-[var(--accent-orange)] text-[#07090E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-lg"
                                            >
                                                Open External Site <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                    <div className="h-16 w-full shrink-0 pointer-events-none" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Controls & Push-Live Action */}
                <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleToggleWebsiteVisibility}
                            disabled={updating}
                            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                                visibleOnWebsite 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30' 
                                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white'
                            }`}
                        >
                            {visibleOnWebsite ? <Eye size={16} /> : <EyeOff size={16} />}
                            {visibleOnWebsite ? 'Pushed Live On Designs Showcase' : 'Hidden From Public Showcase'}
                        </button>
                        <span className="text-[11px] font-mono text-[var(--text-muted)] hidden sm:inline">
                            {visibleOnWebsite ? '✓ Visible to website visitors' : '✕ Private to Admin'}
                        </span>
                    </div>

                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 rounded-xl border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
                    >
                        Close Preview Widget
                    </button>
                </div>
            </div>
        </div>
    );
}
