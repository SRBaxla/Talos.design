import { useProjects, useCaseStudies } from '../store/adminStore';
import StatsCards from '../components/StatsCards';
import { FolderKanban, BookOpen, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
    'lead': '#71717a',
    'in-progress': '#00e5ff',
    'review': '#f59e0b',
    'completed': '#22c55e',
    'published': '#c084fc',
    'draft': '#71717a',
    'research': '#00e5ff',
    'writing': '#f59e0b',
};

export default function AdminDashboard() {
    const { projects, loading: pLoading } = useProjects();
    const { studies, loading: sLoading } = useCaseStudies();

    if (pLoading || sLoading) {
        return <div className="admin-loading"><div className="admin-spinner" /></div>;
    }

    // Recent items (last 5 combined)
    const recentProjects = projects.slice(0, 5);
    const recentStudies = studies.slice(0, 5);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Dashboard</h1>
                    <p className="admin-page-subtitle">Overview of all projects and case studies</p>
                </div>
            </div>

            <StatsCards projects={projects} caseStudies={studies} />

            <div className="admin-dashboard-grid">
                {/* Recent Projects */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <FolderKanban size={16} className="text-[var(--accent-orange)]" />
                            <h3>Recent Projects</h3>
                        </div>
                        <Link to="/admin/projects" className="admin-card-link">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="admin-card-body">
                        {recentProjects.length === 0 ? (
                            <div className="admin-card-empty">No projects yet</div>
                        ) : (
                            recentProjects.map((p) => (
                                <Link key={p.id} to={`/admin/projects/${p.id}`} className="admin-activity-item">
                                    <span
                                        className="admin-activity-dot"
                                        style={{ background: STATUS_COLORS[p.status] || '#71717a' }}
                                    />
                                    <div className="admin-activity-info">
                                        <span className="admin-activity-name">{p.name}</span>
                                        <span className="admin-activity-meta">{p.client || 'No client'}</span>
                                    </div>
                                    <span
                                        className="admin-badge"
                                        style={{
                                            background: `${STATUS_COLORS[p.status]}20`,
                                            color: STATUS_COLORS[p.status],
                                        }}
                                    >
                                        {p.status}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Case Studies */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-header-left">
                            <BookOpen size={16} className="text-[var(--accent-cyan)]" />
                            <h3>Recent Case Studies</h3>
                        </div>
                        <Link to="/admin/case-studies" className="admin-card-link">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="admin-card-body">
                        {recentStudies.length === 0 ? (
                            <div className="admin-card-empty">No case studies yet</div>
                        ) : (
                            recentStudies.map((s) => (
                                <Link key={s.id} to={`/admin/case-studies/${s.id}`} className="admin-activity-item">
                                    <span
                                        className="admin-activity-dot"
                                        style={{ background: STATUS_COLORS[s.status] || '#71717a' }}
                                    />
                                    <div className="admin-activity-info">
                                        <span className="admin-activity-name">{s.title}</span>
                                        <span className="admin-activity-meta">{s.industry || 'No industry'}</span>
                                    </div>
                                    <span
                                        className="admin-badge"
                                        style={{
                                            background: `${STATUS_COLORS[s.status]}20`,
                                            color: STATUS_COLORS[s.status],
                                        }}
                                    >
                                        {s.status}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                <div className="admin-card-header">
                    <div className="admin-card-header-left">
                        <Clock size={16} className="text-[var(--text-muted)]" />
                        <h3>Quick Overview</h3>
                    </div>
                </div>
                <div className="admin-quick-stats">
                    <div className="admin-quick-stat">
                        <span className="admin-quick-stat-value">
                            {projects.filter((p) => p.status === 'in-progress').length}
                        </span>
                        <span className="admin-quick-stat-label">In Progress</span>
                    </div>
                    <div className="admin-quick-stat">
                        <span className="admin-quick-stat-value">
                            {projects.filter((p) => p.status === 'review').length}
                        </span>
                        <span className="admin-quick-stat-label">In Review</span>
                    </div>
                    <div className="admin-quick-stat">
                        <span className="admin-quick-stat-value">
                            {projects.filter((p) => p.priority === 'urgent' || p.priority === 'high').length}
                        </span>
                        <span className="admin-quick-stat-label">High Priority</span>
                    </div>
                    <div className="admin-quick-stat">
                        <span className="admin-quick-stat-value">
                            {studies.filter((s) => s.status !== 'published').length}
                        </span>
                        <span className="admin-quick-stat-label">Unpublished Studies</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
