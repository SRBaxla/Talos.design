import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../store/adminStore';
import ProjectTable from '../components/ProjectTable';
import KanbanBoard from '../components/KanbanBoard';
import ProjectModal from '../components/ProjectModal';
import type { Project } from '../store/adminStore';
import { Plus, Table, Columns3 } from 'lucide-react';

export default function AdminProjects() {
    const { projects, loading } = useProjects();
    const navigate = useNavigate();
    const [view, setView] = useState<'table' | 'kanban'>('table');
    const [modalOpen, setModalOpen] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);

    const handleRowClick = (project: Project) => {
        navigate(`/admin/projects/${project.id}`);
    };

    const handleEdit = (project: Project) => {
        setEditProject(project);
        setModalOpen(true);
    };

    const handleNew = () => {
        setEditProject(null);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditProject(null);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--accent-orange)] rounded-full animate-spin" /></div>;
    }

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex-none border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-xl text-[var(--text-primary)]">Client Projects</h1>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">Track and manage all active client work</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="flex bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-1">
                        <button
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded transition-colors ${view === 'table' ? 'bg-[var(--accent-orange)] text-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                            onClick={() => setView('table')}
                        >
                            <Table size={14} /> Table
                        </button>
                        <button
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded transition-colors ${view === 'kanban' ? 'bg-[var(--accent-orange)] text-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                            onClick={() => setView('kanban')}
                        >
                            <Columns3 size={14} /> Kanban
                        </button>
                    </div>
                    <button
                        className="bg-[var(--accent-orange)] text-[var(--bg-base)] hover:bg-[var(--accent-orange-hover)] transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold shadow-sm"
                        onClick={handleNew}
                    >
                        <Plus size={14} /> New Project
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-x-hidden">

                {view === 'table' ? (
                    <ProjectTable projects={projects} onEdit={handleEdit} onRowClick={handleRowClick} />
                ) : (
                    <KanbanBoard projects={projects} onEdit={handleEdit} onCardClick={handleRowClick} />
                )}

            </main>

            <ProjectModal open={modalOpen} onClose={handleClose} project={editProject} />
        </div>
    );
}
