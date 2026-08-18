import { useState } from 'react';
import { 
    Copy, Check, ExternalLink, Key, Mail, ShieldCheck, 
    UserPlus, ClipboardList, CheckSquare, Send, UserCheck, Shield
} from 'lucide-react';

const DEMO_ACCOUNTS = [
    {
        role: 'Lab Admin',
        badge: 'Recommended for Demo',
        email: 'admin@medilife.in',
        password: 'Admin@2026!',
        desc: 'Peer-review reports, clinic settings & WhatsApp dispatches',
        color: 'text-[var(--accent-orange)]',
        bgColor: 'bg-[var(--accent-orange)]/10',
        borderColor: 'border-[var(--accent-orange)]/30',
        icon: ShieldCheck
    },
    {
        role: 'Lab Tech',
        badge: 'Technical Entry',
        email: 'tech@medilife.in',
        password: 'Tech@2026!',
        desc: 'Log test parameter values & send for pathologist review',
        color: 'text-sky-400',
        bgColor: 'bg-sky-500/10',
        borderColor: 'border-sky-500/30',
        icon: ClipboardList
    },
    {
        role: 'Super Admin',
        badge: 'WaaS Manager',
        email: 'superadmin@medilife.in',
        password: 'SuperAdmin@2026!',
        desc: 'Multi-tenant provisioning & platform subscription control',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        icon: Shield
    },
    {
        role: 'Patient',
        badge: 'Patient Portal',
        email: 'patient@medilife.in',
        password: 'Patient@2026!',
        desc: 'Test booking, appointment history & PDF report download',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        icon: UserCheck
    }
];

const WORKFLOW_STEPS = [
    { id: '01', title: 'Patient Intake', desc: 'Online storefront booking', icon: UserPlus, color: 'text-amber-400' },
    { id: '02', title: 'Admin Queue', desc: 'Real-time order tracking', icon: ClipboardList, color: 'text-sky-400' },
    { id: '03', title: 'Peer Review', desc: 'Pathologist verification', icon: CheckSquare, color: 'text-emerald-400' },
    { id: '04', title: 'WhatsApp Dispatch', desc: '1-Click PDF delivery', icon: Send, color: 'text-purple-400' }
];

export default function MedilifeClinicDemo() {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

    const demoUrl = 'https://medlife-three.vercel.app/';
    const activeAccount = DEMO_ACCOUNTS[selectedRoleIndex];

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    return (
        <div className="glass-panel rounded-[2rem] border border-[var(--accent-cyan)]/40 p-6 md:p-10 bg-gradient-to-br from-[#07090E] via-[#0E131F] to-[#07090E] shadow-2xl relative overflow-hidden text-white">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--accent-cyan)] opacity-[0.05] blur-[80px] pointer-events-none" />

            {/* Top Bar Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 font-bold uppercase tracking-wider mb-2">
                        <ShieldCheck size={14} /> Live Demo Portal Credentials
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                        Access Live Platform Accounts
                    </h2>
                </div>

                <a
                    href={demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-xl bg-[var(--accent-cyan)] text-[#07090E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] shrink-0 w-fit"
                >
                    Launch Live Demo Portal <ExternalLink size={14} />
                </a>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {DEMO_ACCOUNTS.map((acc, idx) => {
                    const IconComp = acc.icon;
                    const isSelected = selectedRoleIndex === idx;
                    return (
                        <button
                            key={acc.role}
                            onClick={() => setSelectedRoleIndex(idx)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 font-mono text-xs ${
                                isSelected
                                    ? `${acc.bgColor} ${acc.borderColor} text-white shadow-md ring-1 ring-white/20`
                                    : 'bg-white/5 border-white/10 text-[var(--text-muted)] hover:text-white'
                            }`}
                        >
                            <IconComp size={16} className={isSelected ? acc.color : ''} />
                            <div className="min-w-0">
                                <div className="font-bold truncate">{acc.role}</div>
                                <div className="text-[10px] text-[var(--text-muted)] truncate">{acc.badge}</div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Active Account Credentials Highlight Card */}
            <div className="p-5 md:p-6 rounded-2xl bg-black/60 border border-white/15 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${activeAccount.bgColor} border ${activeAccount.borderColor} flex items-center justify-center ${activeAccount.color}`}>
                            <activeAccount.icon size={18} />
                        </div>
                        <div>
                            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                                <span>{activeAccount.role} Credentials</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${activeAccount.bgColor} ${activeAccount.borderColor} ${activeAccount.color}`}>
                                    {activeAccount.badge}
                                </span>
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)]">{activeAccount.desc}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* User Email */}
                    <div className="flex items-center justify-between gap-2 bg-white/5 p-3 rounded-xl border border-white/10 text-xs font-mono">
                        <div className="flex items-center gap-2 min-w-0">
                            <Mail size={14} className="text-[var(--text-muted)] shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[9px] text-[var(--text-muted)] uppercase">User Email</div>
                                <div className="font-bold text-white truncate">{activeAccount.email}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => copyToClipboard(activeAccount.email, `${activeAccount.role}-email`)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 active:scale-95"
                            title="Copy Email"
                        >
                            {copiedKey === `${activeAccount.role}-email` ? (
                                <>
                                    <Check size={12} className="text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={12} />
                                    <span>Copy Email</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between gap-2 bg-white/5 p-3 rounded-xl border border-white/10 text-xs font-mono">
                        <div className="flex items-center gap-2 min-w-0">
                            <Key size={14} className="text-[var(--accent-orange)] shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[9px] text-[var(--text-muted)] uppercase">Password</div>
                                <div className="font-bold text-[var(--accent-orange)] truncate">{activeAccount.password}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => copyToClipboard(activeAccount.password, `${activeAccount.role}-pass`)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 active:scale-95"
                            title="Copy Password"
                        >
                            {copiedKey === `${activeAccount.role}-pass` ? (
                                <>
                                    <Check size={12} className="text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={12} />
                                    <span>Copy Pass</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Concise Workflow Pipeline */}
            <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold mb-3">
                    Demo Testing Roadmap
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {WORKFLOW_STEPS.map((step) => {
                        const IconComp = step.icon;
                        return (
                            <div key={step.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 ${step.color}`}>
                                    <IconComp size={16} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-bold text-white truncate">{step.title}</div>
                                    <div className="text-[10px] text-[var(--text-muted)] truncate">{step.desc}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
