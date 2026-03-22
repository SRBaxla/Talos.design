import { Quote, Star, TrendingUp, Users, Target, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const CASE_STUDIES = [
    {
        client: 'Global E-commerce Hub',
        title: 'Inventory Automation & ERP Sync',
        challenge: 'The client was manually syncing inventory across 5 stores, leading to a 15% error rate and overselling issues.',
        solution: 'We built a custom Python-based logic engine that connects Shopify APIs with their ERP, featuring real-time conflict resolution.',
        outcome: '98% reduction in manual data entry errors. 24/7 real-time inventory management with zero overselling in 12 months.',
        metrics: [
            { label: 'Time Saved', value: '45h/week' },
            { label: 'Sync Delay', value: '< 2s' },
        ],
        tags: ['Automation', 'Logic Architecture'],
        color: 'var(--accent-orange)'
    },
    {
        client: 'Boutique Design Studio',
        title: 'High-Performance 3D Portfolio',
        challenge: 'A premium brand with a generic template site that failed to communicate their high-end artistic value.',
        solution: 'An immersive Three.js experience with custom shaders and motion-sensitive UI that prioritizes visual storytelling.',
        outcome: 'Increased visitor engagement by 320% and tripled project inquiries through a premium interactive experience.',
        metrics: [
            { label: 'Engagement', value: '+320%' },
            { label: 'Load Time', value: '0.8s' },
        ],
        tags: ['Design', 'Interactive'],
        color: 'var(--accent-cyan)'
    }
];

const TESTIMONIALS = [
    {
        name: 'Sarah Chen',
        role: 'COO at TechNexus',
        content: 'Talos transformed our messy workflow into a sleek, automated machine. The AI agents they built are now handling 70% of our customer queries.',
        avatar: 'S'
    },
    {
        name: 'David Mills',
        role: 'Founder of PrimeDigital',
        content: 'The engineering depth they bring is unmatched. Not just a design agency, they are true partners in technical strategy.',
        avatar: 'D'
    },
    {
        name: 'Elena Rodriguez',
        role: 'Head of Product at Arca',
        content: 'Their 3D interactive designs wowed our board and our customers. We saw an immediate jump in retention after the new launch.',
        avatar: 'E'
    }
];

const STATS = [
    { label: 'Efficiency Gained', value: '95%+', icon: TrendingUp },
    { label: 'Hours Saved Monthly', value: '1.2k', icon: Zap },
    { label: 'Client Retention', value: '100%', icon: ShieldCheck },
    { label: 'Project Success', value: '250+', icon: Target },
];

const IMPACT_DATA = [
    { label: 'Manual Work', before: 100, after: 5, color: 'var(--accent-orange)' },
    { label: 'Response Time', before: 100, after: 12, color: 'var(--accent-cyan)' },
    { label: 'Error Rate', before: 100, after: 2, color: 'var(--accent-magenta)' },
    { label: 'Client Success', before: 60, after: 100, color: 'var(--accent-orange)' },
];

const LOGOS = [
    'TechNexus', 'PrimeDigital', 'Arca', 'Vortex', 'Stellar', 'Quantum'
];

function ImpactChart() {
    return (
        <div className="glass-card p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-[var(--border-color)] mb-24 md:mb-40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-orange)] opacity-[0.03] blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
                <div className="lg:w-1/3 text-center lg:text-left">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-[0.9] md:leading-tight">Performance <br /><span className="text-gradient-orange text-glow-orange">Transformation.</span></h2>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8 opacity-80">
                        Visualizing the average shift across our client ecosystem after 6 months of Talos integration.
                    </p>
                    <div className="flex flex-row lg:flex-col justify-center lg:justify-start gap-6 lg:gap-3 mb-8 lg:mb-0">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full border border-[var(--border-color)]" /> Baseline
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--accent-orange)] uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)]" /> Optimized
                        </div>
                    </div>
                </div>
 
                <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {IMPACT_DATA.map((item, i) => (
                        <div key={item.label} className="flex flex-col items-center group/chart">
                            <div className="h-48 md:h-64 w-full relative flex items-end justify-center gap-1 md:gap-2 px-3 md:px-4 bg-[rgba(255,255,255,0.02)] rounded-2xl md:rounded-3xl border border-[rgba(255,255,255,0.05)] overflow-hidden">
                                {/* Before Bar */}
                                <motion.div 
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${item.before}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="w-2 md:w-4 bg-[rgba(255,255,255,0.05)] rounded-t-sm md:rounded-t-lg border border-[var(--border-color)] relative"
                                />
                                {/* After Bar */}
                                <motion.div 
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${item.after}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                                    className="w-6 md:w-10 rounded-t-lg md:rounded-t-xl relative group-hover/chart:scale-y-105 transition-transform origin-bottom"
                                    style={{ 
                                        backgroundColor: item.color,
                                        boxShadow: `0 0 30px ${item.color}33`,
                                        opacity: 0.8
                                    }}
                                >
                                    <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] font-mono font-bold" style={{ color: item.color }}>
                                        {item.after}%
                                    </div>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-lg md:rounded-t-xl" />
                                </motion.div>
                            </div>
                            <span className="mt-4 text-[9px] md:text-[10px] font-mono text-[var(--text-muted)] text-center uppercase tracking-widest leading-tight">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Impact() {
    return (
        <div className="container py-24 min-h-screen px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-24 md:mb-32"
            >
                <div className="badge badge-active mb-6 tracking-widest">[PROOF OF EXCELLENCE]</div>
                <h1 className="text-5xl md:text-8xl mb-6 font-black tracking-tighter uppercase leading-[0.9] md:leading-[0.85]">Engineering <br /><span className="text-gradient-orange text-glow-orange">Business Victories.</span></h1>
                <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed border-l-2 border-[var(--accent-orange)] pl-6 italic">
                    "We don't just build software — we architect competitive advantages. 
                    From surgical efficiency to exponential growth, here's our impact."
                </p>
                
                <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {LOGOS.map(logo => (
                        <div key={logo} className="text-sm md:text-xl font-display font-bold tracking-tighter uppercase">{logo}</div>
                    ))}
                </div>
            </motion.div>

            {/* Performance Chart */}
            <ImpactChart />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-24 md:mb-48">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-center border border-[var(--border-color)] group hover:border-[rgba(245,158,11,0.2)] transition-all bg-gradient-to-b from-transparent to-[rgba(255,255,255,0.02)]"
                    >
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[rgba(245,158,11,0.08)] flex items-center justify-center mx-auto mb-6 group-hover:bg-[rgba(245,158,11,0.15)] transition-colors">
                            <stat.icon className="text-[var(--accent-orange)]" size={24} />
                        </div>
                        <div className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter leading-none">{stat.value}</div>
                        <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--text-muted)]">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Case Studies */}
            <div className="mb-24 md:mb-48">
                <div className="flex items-center justify-between mb-12 md:mb-16 px-4 md:px-0">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">Selected <br /><span className="text-gradient-orange">Case Studies.</span></h2>
                    <div className="hidden md:block h-px flex-1 mx-12 bg-gradient-to-r from-[var(--accent-orange)] to-transparent opacity-20" />
                </div>
                
                <div className="space-y-20 md:space-y-32">
                    {CASE_STUDIES.map((study, index) => (
                        <motion.div
                            key={study.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
                                <div className={`lg:col-span-7 group ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                    <div className="glass-card p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-[var(--border-color)] relative overflow-hidden transition-all hover:border-[rgba(245,158,11,0.2)]">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-orange)] opacity-[0.03] blur-[60px]" />
                                        
                                        <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--accent-orange)] mb-6 block">
                                            {study.client}
                                        </span>
                                        <h3 className="text-3xl md:text-5xl font-black mb-8 md:mb-10 leading-[0.9] uppercase tracking-tighter">{study.title}</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                            <div className="space-y-6 md:space-y-8">
                                                <div>
                                                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> The Challenge
                                                    </h4>
                                                    <p className="text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed">{study.challenge}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_rgba(0,229,255,0.5)]" /> The Solution
                                                    </h4>
                                                    <p className="text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed">{study.solution}</p>
                                                </div>
                                            </div>
                                            <div className="bg-[rgba(245,158,11,0.03)] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-[rgba(245,158,11,0.05)] self-start">
                                                <h4 className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[var(--accent-orange)] mb-4 block underline underline-offset-4">Technical Outcome</h4>
                                                <p className="text-white text-base md:text-lg font-medium leading-snug italic tracking-tight">
                                                    "{study.outcome}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
 
                                <div className={`lg:col-span-5 space-y-6 md:space-y-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <div className="grid grid-cols-2 gap-4">
                                        {study.metrics.map(m => (
                                            <div key={m.label} className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] glass-panel border border-[var(--border-color)] text-center group/metric hover:border-[rgba(245,158,11,0.2)] transition-all">
                                                <div className="text-2xl md:text-3xl font-black text-[var(--accent-orange)] mb-1 group-hover/metric:scale-110 transition-transform">{m.value}</div>
                                                <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {study.tags.map(tag => (
                                            <span key={tag} className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--accent-orange)] hover:text-white transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-4 px-4 md:px-0 uppercase tracking-tighter">
                <Users className="text-[var(--accent-cyan)]" /> Client Trust
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-40">
                {TESTIMONIALS.map((review, i) => (
                    <motion.div
                        key={review.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-[var(--border-color)] relative group hover:border-[rgba(0,229,255,0.2)] transition-all"
                    >
                        <Quote className="absolute top-6 right-8 text-[var(--accent-cyan)] opacity-10 w-12 h-12 group-hover:opacity-30 transition-opacity" />
                        <div className="flex items-center gap-1 mb-8">
                            {[1, 2, 3, 4, 5].map(n => <Star key={n} size={14} className="fill-[var(--accent-orange)] text-[var(--accent-orange)]" />)}
                        </div>
                        <p className="text-[var(--text-secondary)] mb-10 leading-relaxed text-sm italic relative z-10">
                            "{review.content}"
                        </p>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[var(--bg-surface-elevated)] to-[var(--bg-base)] flex items-center justify-center font-bold text-[var(--accent-cyan)] border border-[var(--border-color)] text-base md:text-lg">
                                {review.avatar}
                            </div>
                            <div>
                                <div className="font-bold text-xs md:text-sm tracking-wide">{review.name}</div>
                                <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">{review.role}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-12 md:p-24 glass-panel rounded-[2.5rem] md:rounded-[4rem] text-center border border-[var(--accent-orange-glow)] relative overflow-hidden mb-12"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(245,158,11,0.05)] to-transparent pointer-events-none" />
                <h3 className="text-4xl md:text-6xl font-black mb-10 md:mb-12 uppercase tracking-tighter leading-[0.9]">Build Your <br /><span className="text-gradient-orange text-glow-orange">Success Story.</span></h3>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                    <button className="btn btn-primary px-10 md:px-12 py-4 md:py-5 text-sm md:text-base shadow-[0_0_40px_var(--accent-orange-glow)] flex items-center justify-center gap-3">
                        Engineer Your Future <TrendingUp size={18} />
                    </button>
                    <button className="btn btn-outline px-10 md:px-12 py-4 md:py-5 text-[10px] md:text-xs italic font-mono uppercase tracking-widest text-[var(--text-muted)]">Book briefing</button>
                </div>
            </motion.div>
        </div>
    );
}
