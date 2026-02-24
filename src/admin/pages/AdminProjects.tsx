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
        return <div className="admin-loading"><div className="admin-spinner" /></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Client Projects</h1>
                    <p className="admin-page-subtitle">Track and manage all active client work</p>
                </div>
                <div className="admin-page-actions">
                    <div className="admin-view-toggle">
                        <button
                            className={`admin-view-btn ${view === 'table' ? 'active' : ''}`}
                            onClick={() => setView('table')}
                        >
                            <Table size={16} /> Table
                        </button>
                        <button
                            className={`admin-view-btn ${view === 'kanban' ? 'active' : ''}`}
                            onClick={() => setView('kanban')}
                        >
                            <Columns3 size={16} /> Kanban
                        </button>
                    </div>
                    <button className="admin-btn-primary" onClick={handleNew}>
                        <Plus size={16} /> New Project
                    </button>
                </div>
            </div>

            {view === 'table' ? (
                <ProjectTable projects={projects} onEdit={handleEdit} onRowClick={handleRowClick} />
            ) : (
                <KanbanBoard projects={projects} onEdit={handleEdit} onCardClick={handleRowClick} />
            )}

            <ProjectModal open={modalOpen} onClose={handleClose} project={editProject} />
        </div>
    );
}
