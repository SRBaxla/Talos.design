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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
                <div key={s.label} className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)] transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: s.bg, color: s.color, borderColor: `${s.color}30` }}>
                        <s.icon size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="font-display font-bold text-3xl text-white tracking-tight">{s.value}</div>
                        <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-1">{s.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
