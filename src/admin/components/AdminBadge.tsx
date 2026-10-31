import React from 'react';

export type BadgeVariant =
    | 'emerald'
    | 'sky'
    | 'amber'
    | 'rose'
    | 'purple'
    | 'slate'
    | 'zinc';

export interface AdminBadgeProps {
    status?: string;
    priority?: string;
    roi?: string;
    variant?: BadgeVariant;
    label?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    pill?: boolean;
    size?: 'xs' | 'sm' | 'md';
}

export function getBadgeClasses(type?: string): string {
    const key = (type || '').toLowerCase().trim().replace(/_/g, '-');
    switch (key) {
        // Emerald (Success / Published / Completed / Paid / Done / Approved)
        case 'published':
        case 'completed':
        case 'paid':
        case 'approved':
        case 'done':
        case 'active':
        case 'emerald':
            return 'bg-emerald-200 text-emerald-950 border-emerald-300';

        // Sky (In-Progress / Research / Sent / Processing / Info)
        case 'in-progress':
        case 'research':
        case 'sent':
        case 'processing':
        case 'sky':
        case 'cyan':
            return 'bg-sky-200 text-sky-950 border-sky-300';

        // Amber (Warning / Review / Writing / Pending / Medium / High Priority)
        case 'review':
        case 'writing':
        case 'pending':
        case 'medium':
        case 'high':
        case 'amber':
        case 'yellow':
            return 'bg-amber-200 text-amber-950 border-amber-300';

        // Rose (Danger / Urgent / Overdue / Rejected / Flagged)
        case 'urgent':
        case 'overdue':
        case 'rejected':
        case 'flagged':
        case 'rose':
        case 'red':
            return 'bg-rose-200 text-rose-950 border-rose-300';

        // Purple (Critical / Specialty)
        case 'critical':
        case 'purple':
        case 'special':
            return 'bg-purple-200 text-purple-950 border-purple-300';

        // Slate (Draft / Lead / Todo / Low / Neutral Default)
        case 'draft':
        case 'lead':
        case 'todo':
        case 'low':
        case 'archived':
        case 'slate':
        case 'zinc':
        default:
            return 'bg-slate-200 text-slate-900 border-slate-300';
    }
}

export default function AdminBadge({
    status,
    priority,
    roi,
    variant,
    label,
    icon,
    children,
    className = '',
    pill = true,
    size = 'sm',
}: AdminBadgeProps) {
    const targetKey = status || priority || roi || variant || (typeof children === 'string' ? children : '') || '';
    const badgeClasses = getBadgeClasses(targetKey);

    const displayLabel = label || children || (status ? status.replace('-', ' ') : priority || roi || '');

    const sizeClasses = size === 'xs'
        ? 'px-2 py-0.5 text-[9px]'
        : size === 'md'
            ? 'px-3.5 py-1.5 text-xs'
            : 'px-2.5 py-1 text-[10px]';

    const roundedClass = pill ? 'rounded-full' : 'rounded-lg';

    return (
        <span
            className={`inline-flex items-center justify-center gap-1.5 font-mono font-extrabold uppercase tracking-wider border shadow-sm shrink-0 whitespace-nowrap ${badgeClasses} ${roundedClass} ${sizeClasses} ${className}`}
        >
            {icon && <span className="shrink-0 flex items-center">{icon}</span>}
            <span>{displayLabel}</span>
        </span>
    );
}
