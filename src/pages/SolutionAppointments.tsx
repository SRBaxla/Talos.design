import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, ArrowRight, Briefcase, CalendarClock, Bot, FileText, Blocks } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const OFFER_ITEMS = [
    {
        id: 'client-portal',
        title: 'Client Portal & Dashboard',
        description: 'Secure environment for clients to manage profiles, view updates, and communicate.',
        price: 900,
        isBase: true,
        icon: Briefcase
    },
    {
        id: 'scheduling',
        title: 'Appointment Scheduling',
        description: 'Integrated booking engine to easily manage consultations and meetings.',
        price: 400,
        isBase: false,
        icon: CalendarClock
    },
    {
        id: 'ai-chatbot',
        title: 'AI Support Chatbot',
        description: 'Custom-trained LLM assistant to handle initial inquiries and FAQs 24/7.',
        price: 700,
        isBase: true,
        icon: Bot
    },
    {
        id: 'doc-management',
        title: 'Document Management',
        description: 'Secure file sharing, digital signatures, and record keeping functionality.',
        price: 500,
        isBase: false,
        icon: FileText
    },
    {
        id: 'workflow-automation',
        title: 'Workflow Automation',
        description: 'Zapier or custom API integrations to minimize manual admin tasks.',
        price: 600,
        isBase: false,
        icon: Blocks
    }
];

export default function SolutionAppointments() {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<string[]>(
        OFFER_ITEMS.filter(item => item.isBase).map(item => item.id)
    );

    const toggleItem = (id: string, isBase: boolean) => {
        if (isBase) return; // Base items strictly selected
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const totalCost = OFFER_ITEMS
        .filter(item => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0);

    const handleCreateProject = () => {
        const selectedModules = OFFER_ITEMS.filter(item => selectedItems.includes(item.id));
        navigate('/contact', {
            state: {
                bundleType: 'Appointment & Booking Platform',
                estimatedValue: totalCost,
                modules: selectedModules.map(m => m.title)
            }
        });
    };

    return (
        <div className="container py-16 flex flex-col flex-grow">
            <motion.div {...fadeUp} className="mb-8">
                <Link to="/solutions" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back to Solutions
                </Link>
            </motion.div>

            <div className="mb-16">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 mb-6">
                    <span className="text-[10px] font-mono bg-[rgba(192,132,252,0.1)] text-[#c084fc] px-3 py-1 rounded-full border border-[rgba(192,132,252,0.2)]">Appointment &amp; Booking Suite</span>
                </motion.div>
                <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-display tracking-tight mb-6">
                    Appointment &amp; <span className="text-[#c084fc]">Booking Platforms.</span>
                </motion.h1>
                <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                    Automate scheduling, client consultations, and operations for clinics, salons, wellness studios, practices, and appointment-driven businesses. Select the modules that match your workflows. Core booking components are active by default.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
                <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-display mb-6">Select your modules</h2>
                    {OFFER_ITEMS.map((item) => {
                        const isSelected = selectedItems.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => toggleItem(item.id, item.isBase)}
                                className={`glass-panel p-6 flex items-start gap-4 cursor-pointer transition-all duration-300 border ${isSelected ? 'border-[#c084fc] shadow-[0_0_15px_rgba(192,132,252,0.1)]' : 'border-[rgba(255,255,255,0.05)] hover:border-[rgba(192,132,252,0.3)]'}`}
                            >
                                <div className="mt-1">
                                    {isSelected ? (
                                        <CheckCircle2 className="text-[#c084fc]" size={24} />
                                    ) : (
                                        <Circle className="text-[var(--text-muted)]" size={24} />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <item.icon size={18} className="text-[#c084fc]" />
                                            {item.title}
                                            {item.isBase && (
                                                <span className="text-[10px] bg-[#c084fc] text-black px-2 py-0.5 rounded uppercase font-bold tracking-wider ml-2">Base Item</span>
                                            )}
                                        </h3>
                                        <span className="font-mono font-bold text-[#c084fc]">${item.price}</span>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="lg:col-span-1">
                    <div className="glass-panel p-8 sticky top-24 border-[rgba(192,132,252,0.2)]">
                        <h3 className="text-xl font-display font-bold mb-6">Estimated Scope</h3>
                        <div className="space-y-4 mb-8">
                            {OFFER_ITEMS.filter(item => selectedItems.includes(item.id)).map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--text-secondary)]">{item.title}</span>
                                    <span className="font-mono">${item.price}</span>
                                </div>
                            ))}
                            <div className="h-px w-full bg-[var(--border-color)] my-4"></div>
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Estimated Value</span>
                                <span className="text-[#c084fc] font-mono">~${totalCost}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCreateProject}
                            className="w-full btn bg-[#c084fc] text-black hover:bg-[#a855f7] border-none py-3 px-6 flex items-center justify-center gap-2 font-bold shadow-[0_0_20px_rgba(192,132,252,0.3)]"
                        >
                            Deploy Booking Platform <ArrowRight size={16} />
                        </button>
                        <p className="text-xs text-[var(--text-muted)] mt-4 text-center">
                            This is an initial estimate. Final costs may vary based on specific requirements.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
