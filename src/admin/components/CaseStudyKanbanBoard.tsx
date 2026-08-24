import { useState } from 'react';
import type { CaseStudy } from '../store/adminStore';
import { updateCaseStudy } from '../store/adminStore';

interface CaseStudyKanbanBoardProps {
    studies: CaseStudy[];
    onEdit: (study: CaseStudy) => void;
    onCardClick?: (study: CaseStudy) => void;
}

const COLUMNS: { key: string; label: string; color: string }[] = [
    { key: 'draft', label: 'Draft', color: '#a1a1aa' },
    { key: 'research', label: 'Research', color: '#00e5ff' },
    { key: 'writing', label: 'Writing', color: '#f59e0b' },
    { key: 'review', label: 'Review', color: '#c084fc' },
    { key: 'published', label: 'Published', color: '#22c55e' },
];

export default function CaseStudyKanbanBoard({ studies, onEdit, onCardClick }: CaseStudyKanbanBoardProps) {
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleDragStart = (id: string) => {
        setDraggedId(id);
    };

    const handleDrop = async (status: string) => {
        if (draggedId) {
            await updateCaseStudy(draggedId, { status } as Partial<CaseStudy>);
            setDraggedId(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="flex gap-6 h-full min-w-max items-start overflow-x-auto pb-4 custom-scrollbar">
            {COLUMNS.map((col) => {
                const cards = studies.filter((s) => s.status === col.key);
                return (
                    <div
                        key={col.key}
                        className="w-[320px] flex flex-col max-h-[calc(100vh-180px)]"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(col.key)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: col.color }}
                                />
                                <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">{col.label}</h3>
                            </div>
                            <span className="text-[10px] font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 rounded-full text-[var(--text-secondary)] font-bold">
                                {cards.length}
                            </span>
                        </div>

                        {/* Drop Zone / Cards List */}
                        <div className="flex-1 overflow-y-auto space-y-3 pb-8 pr-2 custom-scrollbar min-h-[150px]">
                            {cards.length === 0 ? (
                                <div className="border border-dashed border-[var(--border-color)] rounded-xl h-24 flex items-center justify-center text-[var(--text-muted)] text-xs font-mono bg-[var(--bg-surface-elevated)]/50">
                                    Drop here
                                </div>
                            ) : (
                                cards.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 hover:border-[var(--accent-orange)] transition-colors cursor-grab active:cursor-grabbing group relative ${draggedId === s.id ? 'opacity-50 scale-95 border-dashed border-[var(--text-muted)]' : ''}`}
                                        draggable
                                        onDragStart={() => handleDragStart(s.id)}
                                        onClick={() => onCardClick ? onCardClick(s) : onEdit(s)}
                                    >
                                        <div className="font-bold text-[14px] mb-1 pr-6 truncate text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                                            {s.title}
                                        </div>

                                        {s.client ? (
                                            <div className="text-[11px] text-[var(--text-muted)] mb-3 font-mono truncate">
                                                {s.client}
                                            </div>
                                        ) : (
                                            <div className="h-3 mb-3" />
                                        )}

                                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--border-color)]">
                                            <span className="text-[10px] font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wide bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded">
                                                {s.industry || 'Unspecified'}
                                            </span>
                                            {s.publishDate && (
                                                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                                                    {s.publishDate}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
