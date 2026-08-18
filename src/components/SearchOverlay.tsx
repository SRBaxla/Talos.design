import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, ArrowRight, Cpu, Globe, Bot, Settings, Wrench, Shield, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ARTICLES } from '../pages/Insights';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'Service' | 'Package' | 'Solution' | 'Insight' | 'Company';
  path: string;
  icon: any;
  color: string;
}

// Base static pages & routes
const STATIC_DATA: SearchResult[] = [
  // Services
  { id: 'web-design', title: 'High-Converting Web Design', description: 'Sub-second, mobile-first websites designed for lead generation.', category: 'Service', path: '/services/web-design', icon: Globe, color: 'var(--accent-orange)' },
  { id: 'chatbots', title: 'AI Sales & Inquiry Assistants', description: '24/7 AI assistants that answer routine questions and qualify leads on Web & WhatsApp.', category: 'Service', path: '/services/chatbots', icon: Bot, color: 'var(--accent-cyan)' },
  { id: 'automation', title: 'Workflow Automation', description: 'Automated invoicing, CRM sync, and operational pipelines.', category: 'Service', path: '/services/automation', icon: Settings, color: 'var(--accent-orange)' },
  
  // Packages
  { id: 'pkg-presence', title: 'Digital Business Launch', description: 'Custom website, branding, SEO, and WhatsApp setup in 2-4 weeks.', category: 'Package', path: '/packages/presence', icon: Globe, color: 'var(--accent-orange)' },
  { id: 'pkg-automation', title: 'Automated Growth Engine', description: 'Complete stack: 24/7 AI assistant + automated CRM/billing sync.', category: 'Package', path: '/packages/automation', icon: Bot, color: 'var(--accent-cyan)' },
  { id: 'pkg-custom', title: 'Custom Business Platform', description: 'Bespoke software architectures, internal portals, and custom pipelines.', category: 'Package', path: '/packages/custom', icon: Wrench, color: 'var(--accent-orange)' },
  
  // Solutions
  { id: 'sol-hospitality', title: 'Hospitality & Booking Platform', description: 'Direct booking engines, room galleries, and WhatsApp reservations.', category: 'Solution', path: '/solutions/hospitality', icon: Globe, color: 'var(--accent-orange)' },
  { id: 'sol-ecommerce', title: 'E-Commerce & Retail Solution', description: 'Sub-second catalog storefronts and multi-channel inventory sync.', category: 'Solution', path: '/solutions/ecommerce', icon: Globe, color: 'var(--accent-cyan)' },
  { id: 'sol-appointments', title: 'Appointment & Booking Platform', description: 'Automated scheduling and customer management for clinics and salons.', category: 'Solution', path: '/solutions/appointments', icon: Globe, color: 'var(--accent-orange)' },
  { id: 'sol-medilife', title: 'MediLife Diagnostic Platform', description: 'Pre-built diagnostic lab software with online booking and PDF reports.', category: 'Solution', path: '/solutions/medilife', icon: Shield, color: 'var(--accent-cyan)' },
  
  // Expertise & Company
  { id: 'expertise-ai', title: 'AI Assistants Expertise', description: 'Conversational assistant design, RAG knowledge bases, and escalation logic.', category: 'Service', path: '/expertise#ai', icon: Bot, color: 'var(--accent-cyan)' },
  { id: 'expertise-systems', title: 'Systems Architecture', description: 'PostgreSQL, APIs, event-driven pipelines, and cloud infrastructure.', category: 'Service', path: '/expertise#systems', icon: Cpu, color: 'var(--accent-cyan)' },
  { id: 'expertise-designs', title: 'Frontend & Visual Engineering', description: 'Design tokens, fluid typography, WebGL shaders, and performance.', category: 'Service', path: '/expertise#designs', icon: Globe, color: '#f06292' },
  { id: 'about', title: 'About Talos Studio', description: 'Remote-first digital engineering studio based in Jhansi, India.', category: 'Company', path: '/about', icon: Heart, color: 'var(--accent-orange)' },
  { id: 'contact', title: 'Contact & Free Discovery Call', description: 'Start your project with a free 30-minute discovery consultation.', category: 'Company', path: '/contact', icon: Globe, color: 'var(--accent-orange)' },
];

// Dynamically generate the full index on load
const getDynamicSearchData = (): SearchResult[] => {
  const dynamicInsights: SearchResult[] = ARTICLES.map((article: any) => ({
    id: `insight-${article.id}`,
    title: article.title,
    description: article.excerpt,
    category: 'Insight',
    path: '/insights',
    icon: article.icon || Cpu,
    color: article.color || 'var(--accent-cyan)'
  }));

  return [...STATIC_DATA, ...dynamicInsights];
};

const SEARCH_DATA = getDynamicSearchData();

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredResults = SEARCH_DATA.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % Math.max(1, filteredResults.length));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    }
    if (e.key === 'Enter' && filteredResults.length > 0) {
      navigate(filteredResults[selectedIndex].path);
      onClose();
    }
  }, [filteredResults, selectedIndex, navigate, onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4 sm:px-6"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden relative z-10"
          >
            {/* Search Input Area */}
            <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-4 bg-[var(--bg-surface-elevated)]">
              <Search className="text-[var(--text-muted)]" size={20} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Find services, stories, or insights..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] p-0"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)]">
                <Command size={12} className="text-[var(--text-muted)]" />
                <span className="text-[10px] font-mono text-[var(--text-muted)]">K</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors"
              >
                <X size={20} className="text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
              {filteredResults.length > 0 ? (
                <div className="space-y-1">
                  {filteredResults.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        navigate(result.path);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                        index === selectedIndex ? 'bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] shadow-lg' : 'border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--bg-base)] border border-[var(--border-color)] group-hover:scale-110 transition-transform"
                          style={{ borderColor: index === selectedIndex ? result.color : undefined }}
                        >
                          <result.icon size={18} style={{ color: result.color }} />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight">{result.title}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] uppercase tracking-widest">{result.category}</span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{result.description}</p>
                        </div>
                      </div>
                      <ArrowRight 
                        size={16} 
                        className={`text-[var(--text-muted)] transition-all ${index === selectedIndex ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} 
                        style={{ color: result.color }}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-[var(--text-muted)]">
                  <Search size={32} className="mb-3 opacity-20" />
                  <p className="text-sm">No matches found for "<span className="text-[var(--text-primary)]">{query}</span>"</p>
                </div>
              )}
            </div>

            {/* Footer / Shortcuts */}
            <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface-elevated)] flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <span className="text-[10px] bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] px-1.5 py-0.5 rounded font-mono">↑↓</span>
                  <span className="text-[10px] font-medium">Navigate</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <span className="text-[10px] bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] px-1.5 py-0.5 rounded font-mono">Enter</span>
                  <span className="text-[10px] font-medium">Select</span>
                </div>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">Talos // OS_v2.0</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
