import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AIAgents from './AIAgents';
import Systems from './Systems';
import Designs from './Designs';

const TABS = [
    { id: 'ai', label: 'AI Agents', component: AIAgents },
    { id: 'systems', label: 'Systems', component: Systems },
    { id: 'designs', label: 'Designs', component: Designs }
];

export default function Expertise() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const hashId = window.location.hash.replace('#', '');
            if (TABS.some(t => t.id === hashId)) return hashId;
        }
        return TABS[0].id;
    });

    useEffect(() => {
        if (location.hash) {
            const hashId = location.hash.replace('#', '');
            if (TABS.some(t => t.id === hashId) && hashId !== activeTab) {
                setActiveTab(hashId);
            }
        }
    }, [location.hash, activeTab]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        window.history.replaceState(null, '', `#${tabId}`);
    };

    const activeIndex = TABS.findIndex(t => t.id === activeTab);
    const ActiveComponent = TABS[activeIndex > -1 ? activeIndex : 0].component;

    return (
        <div className="w-full min-h-screen pt-24 bg-[var(--bg-base)] flex flex-col">
            {/* Top Bar for Navigation */}
            <div className="w-full border-b border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-xl z-40 sticky top-[72px] shadow-sm">
                <div className="container flex items-center justify-center gap-4 md:gap-8 py-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`relative px-4 py-1.5 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors ${
                                activeTab === tab.id ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute -bottom-[11px] left-0 right-0 h-1 bg-[var(--accent-orange)] shadow-[0_0_10px_var(--accent-orange)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ActiveComponent />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
