import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../admin/firebase/firebaseConfig';
import type { CaseStudy } from '../admin/store/adminStore';

export function FeaturedCaseStudies() {
    const [studies, setStudies] = useState<CaseStudy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                // Fetch published case studies
                const q = query(
                    collection(db, 'caseStudies'),
                    where('status', '==', 'published'),
                    // orderBy might require an composite index in Firestore if combined with 'where' on a different field, 
                    // so we'll fetch and sort locally to avoid sudden index errors for the user
                );

                const snap = await getDocs(q);
                let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CaseStudy));

                // Filter out those explicitly hidden from the website
                data = data.filter(s => s.showOnWebsite !== false);

                // Sort by creation date descending
                data.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                    return timeB - timeA;
                });

                setStudies(data);
            } catch (error) {
                console.error("Error fetching case studies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudies();
    }, []);

    if (loading || studies.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-5xl my-24 px-4 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2 self-start md:self-center">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]" />
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Real Results</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-display uppercase tracking-tight mb-4 self-start md:self-center text-left md:text-center">
                Featured <span className="text-[var(--accent-orange)]">Case Studies</span>
            </h2>

            <p className="text-[var(--text-secondary)] mb-12 self-start md:self-center text-left md:text-center max-w-2xl">
                See how we've deployed customized digital infrastructure to scale real businesses.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {studies.slice(0, 3).map((study, i) => (
                    <motion.div
                        key={study.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-8 flex flex-col relative overflow-hidden group hover:border-[rgba(245,158,11,0.4)] transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-cyan)] opacity-[0.03] group-hover:opacity-[0.08] blur-[50px] rounded-full pointer-events-none transition-opacity" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest bg-[rgba(0,229,255,0.1)] text-[var(--accent-cyan)] px-2 py-0.5 rounded-full border border-[rgba(0,229,255,0.2)]">
                                    {study.industry || 'Tech'}
                                </span>
                                {study.publishDate && (
                                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                                        {study.publishDate}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-display font-bold mb-2 group-hover:text-[var(--accent-orange)] transition-colors">
                                {study.title}
                            </h3>

                            {study.client && (
                                <p className="text-xs text-[var(--text-secondary)] font-mono mb-4">
                                    Client: {study.client}
                                </p>
                            )}

                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-grow mb-8">
                                {study.summary || study.challenge}
                            </p>

                            <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                                {study.liveUrl ? (
                                    <a
                                        href={study.liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-cyan)] transition-colors group/link"
                                    >
                                        View Live Project
                                        <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </a>
                                ) : (
                                    <span className="text-xs font-mono text-[var(--text-muted)] italic">
                                        Internal Project
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
