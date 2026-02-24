import { FolderKanban, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import type { Project, CaseStudy } from '../store/adminStore';

interface StatsCardsProps {
    projects: Project[];
    caseStudies: CaseStudy[];
}

export default function StatsCards({ projects, caseStudies }: StatsCardsProps) {
    const activeProjects = projects.filter(
        (p) => p.status === 'in-progress' || p.status === 'review'
    ).length;
    const activeStudies = caseStudies.filter(
        (s) => s.status === 'research' || s.status === 'writing' || s.status === 'review'
    ).length;
    const completedProjects = projects.filter(
        (p) => p.status === 'completed' || p.status === 'published'
    ).length;
    const totalCaseStudies = caseStudies.length;

    const stats = [
        {
            label: 'Total Projects',
            value: projects.length,
            icon: FolderKanban,
            color: 'var(--accent-orange)',
            bg: 'rgba(245,158,11,0.1)',
        },
        {
            label: 'Active Work',
            value: activeProjects + activeStudies,
            icon: Clock,
            color: 'var(--accent-cyan)',
            bg: 'rgba(0,229,255,0.1)',
        },
        {
            label: 'Completed',
            value: completedProjects,
            icon: CheckCircle2,
            color: '#22c55e',
            bg: 'rgba(34,197,94,0.1)',
        },
        {
            label: 'Case Studies',
            value: totalCaseStudies,
            icon: BookOpen,
            color: '#c084fc',
            bg: 'rgba(192,132,252,0.1)',
        },
    ];

    return (
        <div className="admin-stats-grid">
            {stats.map((s) => (
                <div key={s.label} className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: s.bg, color: s.color }}>
                        <s.icon size={20} />
                    </div>
                    <div>
                        <div className="admin-stat-value">{s.value}</div>
                        <div className="admin-stat-label">{s.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
