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
        <div className="min-h-[calc(100vh-64px)] p-6 md:p-10 w-full max-w-screen-2xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-[var(--text-secondary)] font-medium">At-a-glance performance metrics and recent activity</p>
            </div>

            <StatsCards projects={projects} caseStudies={studies} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Projects */}
                <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden min-h-[400px]">
                    <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                        <div className="flex items-center gap-2">
                            <FolderKanban size={16} className="text-[var(--accent-orange)]" />
                            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">Recent Projects</h3>
                        </div>
                        <Link to="/admin/projects" className="text-xs font-bold font-mono text-[var(--accent-orange)] hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest bg-[rgba(245,158,11,0.1)] px-3 py-1.5 rounded hover:bg-[rgba(245,158,11,0.2)]">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                        {recentProjects.length === 0 ? (
                            <div className="flex-auto flex items-center justify-center text-sm text-[var(--text-muted)] font-mono bg-[rgba(255,255,255,0.01)] rounded-xl border border-dashed border-[var(--border-color)]">No recent project payloads.</div>
                        ) : (
                            recentProjects.map((p) => (
                                <Link key={p.id} to={`/admin/projects/${p.id}`} className="group relative flex items-center justify-between p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex items-center justify-center">
                                            <span
                                                className="absolute inset-0 rounded-full opacity-20 group-hover:animate-ping transition-opacity"
                                                style={{ background: STATUS_COLORS[p.status] || '#71717a' }}
                                            />
                                            <span
                                                className="w-2.5 h-2.5 rounded-full relative z-10 shadow-sm"
                                                style={{ background: STATUS_COLORS[p.status] || '#71717a' }}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:text-[var(--accent-orange)] transition-colors">{p.title || (p as any).name}</span>
                                            <span className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">{p.client || 'Unassigned Identifier'}</span>
                                        </div>
                                    </div>
                                    <span
                                        className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded border whitespace-nowrap hidden sm:block"
                                        style={{
                                            backgroundColor: `${STATUS_COLORS[p.status]}15`,
                                            color: STATUS_COLORS[p.status],
                                            borderColor: `${STATUS_COLORS[p.status]}30`
                                        }}
                                    >
                                        {p.status.replace('-', ' ')}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Case Studies */}
                <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden min-h-[400px]">
                    <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-[var(--accent-cyan)]" />
                            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">Recent Studies</h3>
                        </div>
                        <Link to="/admin/case-studies" className="text-xs font-bold font-mono text-[var(--accent-cyan)] hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest bg-[rgba(0,229,255,0.1)] px-3 py-1.5 rounded hover:bg-[rgba(0,229,255,0.2)]">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                        {recentStudies.length === 0 ? (
                            <div className="flex-auto flex items-center justify-center text-sm text-[var(--text-muted)] font-mono bg-[rgba(255,255,255,0.01)] rounded-xl border border-dashed border-[var(--border-color)]">No recent study payloads.</div>
                        ) : (
                            recentStudies.map((s) => (
                                <Link key={s.id} to={`/admin/case-studies/${s.id}`} className="group relative flex items-center justify-between p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex items-center justify-center">
                                            <span
                                                className="absolute inset-0 rounded-full opacity-20 group-hover:animate-ping transition-opacity"
                                                style={{ background: STATUS_COLORS[s.status] || '#71717a' }}
                                            />
                                            <span
                                                className="w-2.5 h-2.5 rounded-full relative z-10 shadow-sm"
                                                style={{ background: STATUS_COLORS[s.status] || '#71717a' }}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:text-[var(--accent-cyan)] transition-colors">{s.title}</span>
                                            <span className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">{s.industry || 'General Matrix'}</span>
                                        </div>
                                    </div>
                                    <span
                                        className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded border whitespace-nowrap hidden sm:block"
                                        style={{
                                            backgroundColor: `${STATUS_COLORS[s.status]}15`,
                                            color: STATUS_COLORS[s.status],
                                            borderColor: `${STATUS_COLORS[s.status]}30`
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
            <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden mt-8">
                <div className="p-5 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#c084fc]" />
                        <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">Velocity Overview</h3>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[var(--border-color)] bg-[var(--bg-base)]">
                    <div className="p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                            {projects.filter((p) => p.status === 'in-progress').length}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Active Ops</span>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                            {projects.filter((p) => p.status === 'review').length}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">In Review</span>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                            {projects.filter((p) => p.priority === 'urgent' || p.priority === 'high').length}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center justify-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse block"></span> Critical Priority</span>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                            {studies.filter((s) => s.status !== 'published').length}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center justify-center gap-1.5">Unpublished Studies</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
