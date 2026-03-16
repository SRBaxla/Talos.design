import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseStudies } from '../store/adminStore';
import CaseStudyTable from '../components/CaseStudyTable';
import CaseStudyKanbanBoard from '../components/CaseStudyKanbanBoard';
import CaseStudyModal from '../components/CaseStudyModal';
import type { CaseStudy } from '../store/adminStore';
import { Plus, Table, Columns3 } from 'lucide-react';

export default function AdminCaseStudies() {
    const { studies, loading } = useCaseStudies();
    const navigate = useNavigate();
    const [view, setView] = useState<'table' | 'kanban'>('table');
    const [modalOpen, setModalOpen] = useState(false);
    const [editStudy, setEditStudy] = useState<CaseStudy | null>(null);

    const handleRowClick = (study: CaseStudy) => {
        navigate(`/admin/case-studies/${study.id}`);
    };

    const handleEdit = (study: CaseStudy) => {
        setEditStudy(study);
        setModalOpen(true);
    };

    const handleNew = () => {
        setEditStudy(null);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditStudy(null);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/10 border-t-accent-orange rounded-full animate-spin" /></div>;
    }

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex-none border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-xl text-[var(--text-primary)]">Case Studies</h1>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">Track company case study progress and publishing</p>
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
                        className="bg-white text-black hover:bg-gray-200 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold"
                        onClick={handleNew}
                    >
                        <Plus size={14} /> New Case Study
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-x-hidden">
                {view === 'table' ? (
                    <CaseStudyTable studies={studies} onEdit={handleEdit} onRowClick={handleRowClick} />
                ) : (
                    <CaseStudyKanbanBoard studies={studies} onEdit={handleEdit} onCardClick={handleRowClick} />
                )}
            </main>

            <CaseStudyModal open={modalOpen} onClose={handleClose} study={editStudy} />
        </div>
    );
}
