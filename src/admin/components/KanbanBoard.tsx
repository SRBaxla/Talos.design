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
        <div className="admin-kanban">
            {COLUMNS.map((col) => {
                const cards = projects.filter((p) => p.status === col.key);
                return (
                    <div
                        key={col.key}
                        className="admin-kanban-col"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(col.key)}
                    >
                        <div className="admin-kanban-col-header">
                            <span
                                className="admin-kanban-dot"
                                style={{ background: col.color }}
                            />
                            <span className="admin-kanban-col-title">{col.label}</span>
                            <span className="admin-kanban-count">{cards.length}</span>
                        </div>

                        <div className="admin-kanban-cards">
                            {cards.map((p) => (
                                <div
                                    key={p.id}
                                    className={`admin-kanban-card ${draggedId === p.id ? 'dragging' : ''}`}
                                    draggable
                                    onDragStart={() => handleDragStart(p.id)}
                                    onClick={() => onCardClick ? onCardClick(p) : onEdit(p)}
                                >
                                    <div className="admin-kanban-card-name">{p.title || (p as any).name}</div>
                                    {p.client && (
                                        <div className="admin-kanban-card-client">{p.client}</div>
                                    )}
                                    <div className="admin-kanban-card-footer">
                                        <span
                                            className="admin-kanban-priority"
                                            style={{ background: PRIORITY_DOT[p.priority] || '#71717a' }}
                                        />
                                        <span className="admin-kanban-card-type">
                                            {p.type === 'web-design' ? 'Web' : p.type === 'ai-chatbot' ? 'AI' : p.type === 'automation' ? 'Auto' : 'Custom'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
