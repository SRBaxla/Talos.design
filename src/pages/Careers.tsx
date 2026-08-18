import { Mail, Rocket, Sparkles, Users, Zap, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const VALUES = [
    {
        icon: Rocket,
        title: 'Built by Engineers',
        description:
            'We are a focused engineering team building modern digital systems, custom websites, and automation for growing businesses.',
    },
    {
        icon: Users,
        title: 'Culture of Creators',
        description:
            'Collaboration over hierarchy. Every voice matters, every idea gets heard. We build together and celebrate wins as a team.',
    },
    {
        icon: Sparkles,
        title: 'Relentless Innovation',
        description:
            'We push boundaries with AI, automation, and modern design. If it exists, we want to make it better — and if it doesn\'t, we\'ll invent it.',
    },
    {
        icon: Zap,
        title: 'Accelerated Growth',
        description:
            'Work on real projects from day one. No busy-work, no red tape — just high-impact work that stretches your skills and builds your career.',
    },
];

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function Careers() {
    return (
        <div className="container py-16 flex flex-col flex-grow">
            {/* Status Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 mb-8"
            >
                <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan-glow)]"></span>
                <div className="badge badge-active">STATUS: STANDBY</div>
            </motion.div>

            {/* Hero */}
            <div className="mb-16">
                <motion.h1
                    {...fadeUp}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-display tracking-tight mb-6"
                >
                    Careers &amp; <span className="text-[var(--accent-orange)]">Talent.</span>
                </motion.h1>
                <motion.p
                    {...fadeUp}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-[var(--text-secondary)] max-w-2xl"
                >
                    We're not actively hiring right now — but great engineering and design talent never goes unnoticed. Get on our radar for future consideration.
                </motion.p>
            </div>

            {/* Not Hiring Notice + CTA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
                {/* Not Hiring Card */}
                <motion.div
                    {...fadeUp}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-8 relative overflow-hidden border border-[rgba(0,229,255,0.15)]"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-cyan)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded bg-[rgba(0,229,255,0.1)] flex items-center justify-center mb-6">
                            <Users className="text-[var(--accent-cyan)]" size={24} />
                        </div>
                        <h2 className="text-2xl font-display font-bold mb-3">No Active Openings</h2>
                        <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                            We're a lean, engineering-led startup focused on shipping high-quality digital products. All positions are currently filled, but we're always interested in meeting sharp engineers and designers.
                        </p>
                        <p className="text-[var(--text-muted)] text-sm font-mono">
                            // Check back soon — new roles are coming.
                        </p>
                    </div>
                </motion.div>

                {/* Submit Resume CTA Card */}
                <motion.div
                    {...fadeUp}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-8 relative overflow-hidden border border-[rgba(245,158,11,0.2)]"
                >
                    <div className="absolute top-0 left-0 w-48 h-48 bg-[var(--accent-orange)] opacity-[0.05] blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center mb-6">
                            <Mail className="text-[var(--accent-orange)]" size={24} />
                        </div>
                        <h2 className="text-2xl font-display font-bold mb-3">Get First Priority</h2>
                        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                            Send us your resume and portfolio now. When we open positions, you'll be the first people we reach out to — no job boards, no waiting.
                        </p>
                        <a
                            href="mailto:hello@talos.design?subject=Resume%20%26%20Portfolio%20Submission&body=Hi%20Talos%20team%2C%0A%0AI%27d%20like%20to%20submit%20my%20resume%20and%20portfolio%20for%20future%20consideration.%0A%0A"
                            className="btn btn-primary inline-flex items-center gap-2 text-sm font-bold tracking-widest"
                        >
                            <Mail size={16} /> SEND RESUME
                            <ExternalLink size={14} />
                        </a>
                        <p className="text-[var(--text-muted)] text-xs mt-4 font-mono">
                            → hello@talos.design
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Why Talos */}
            <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="mb-8">
                <h2 className="text-3xl md:text-4xl font-display tracking-tight mb-2">
                    Why <span className="text-[var(--accent-orange)]">Talos?</span>
                </h2>
                <p className="text-[var(--text-secondary)] max-w-xl">
                    Created by the new generation, for the new generation.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {VALUES.map((item, i) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 + i * 0.1 }}
                        className="glass-panel p-6 flex items-start gap-4 hover:border-[rgba(245,158,11,0.3)] transition-colors group"
                    >
                        <div className="w-10 h-10 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(245,158,11,0.2)] transition-colors">
                            <item.icon className="text-[var(--accent-orange)]" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
