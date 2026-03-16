import { useState } from 'react';
import type { Project, ProjectStatus } from '../store/adminStore';
import { updateProject } from '../store/adminStore';

interface KanbanBoardProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onCardClick?: (project: Project) => void;
}

const COLUMNS: { key: ProjectStatus; label: string; color: string }[] = [
    { key: 'lead', label: 'Lead', color: '#71717a' },
    { key: 'in-progress', label: 'In Progress', color: '#00e5ff' },
    { key: 'review', label: 'Review', color: '#f59e0b' },
    { key: 'completed', label: 'Completed', color: '#22c55e' },
    { key: 'published', label: 'Published', color: '#c084fc' },
];

const PRIORITY_DOT: Record<string, string> = {
    low: '#71717a',
    medium: '#00e5ff',
    high: '#f59e0b',
    urgent: '#ef4444',
};

export default function KanbanBoard({ projects, onEdit, onCardClick }: KanbanBoardProps) {
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleDragStart = (id: string) => {
        setDraggedId(id);
    };

    const handleDrop = async (status: ProjectStatus) => {
        if (draggedId) {
            await updateProject(draggedId, { status });
            setDraggedId(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="flex gap-6 h-full min-w-max items-start overflow-x-auto pb-4 custom-scrollbar">
            {COLUMNS.map((col) => {
                const cards = projects.filter((p) => p.status === col.key);
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
                                <h3 className="font-display font-bold text-sm text-[var(--text-secondary)]">{col.label}</h3>
                            </div>
                            <span className="text-[10px] font-mono bg-[var(--bg-base)] border border-[var(--border-color)] px-2 py-0.5 rounded-full text-[var(--text-muted)]">
                                {cards.length}
                            </span>
                        </div>

                        {/* Drop Zone / Cards List */}
                        <div className="flex-1 overflow-y-auto space-y-3 pb-8 pr-2 custom-scrollbar min-h-[150px]">
                            {cards.length === 0 ? (
                                <div className="border border-dashed border-[var(--border-color)] rounded-xl h-24 flex items-center justify-center text-[var(--text-muted)] text-xs font-mono bg-[var(--bg-base)]">
                                    Drop here
                                </div>
                            ) : (
                                cards.map((p) => (
                                    <div
                                        key={p.id}
                                        className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 hover:border-[var(--accent-orange)] transition-colors cursor-grab active:cursor-grabbing group relative ${draggedId === p.id ? 'opacity-50 scale-95 border-dashed border-[var(--text-muted)]' : ''}`}
                                        draggable
                                        onDragStart={() => handleDragStart(p.id)}
                                        onClick={() => onCardClick ? onCardClick(p) : onEdit(p)}
                                    >
                                        <div className="font-bold text-[14px] mb-1 pr-6 truncate text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors">
                                            {p.title || (p as any).name}
                                        </div>

                                        {p.client ? (
                                            <div className="text-[11px] text-[var(--text-muted)] mb-3 font-mono truncate">
                                                {p.client}
                                            </div>
                                        ) : (
                                            <div className="h-3 mb-3" />
                                        )}

                                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--border-color)]">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ background: PRIORITY_DOT[p.priority] || '#71717a' }}
                                                title={`Priority: ${p.priority}`}
                                            />
                                            <span className="text-[10px] font-mono font-medium text-[var(--text-secondary)] uppercase tracking-wide bg-[var(--bg-base)] px-2 py-1 rounded">
                                                {p.type === 'web-design' ? 'Web' : p.type === 'ai-chatbot' ? 'AI' : p.type === 'automation' ? 'Auto' : 'Custom'}
                                            </span>
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
