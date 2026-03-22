import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, ArrowRight, BookOpen, Cpu, Globe, Rocket, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ARTICLES } from '../pages/Insights';
import { CASE_STUDIES } from '../pages/Impact';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'Service' | 'Project' | 'Insight';
  path: string;
  icon: any;
  color: string;
}

// Base static pages 
const STATIC_DATA: SearchResult[] = [
  { id: 'ai-agents', title: 'AI Agents', description: 'Autonomous agents for business automation and support.', category: 'Service', path: '/expertise#ai', icon: Rocket, color: 'var(--accent-orange)' },
  { id: 'systems', title: 'Systems', description: 'Deep infrastructure and workflow automation.', category: 'Service', path: '/expertise#systems', icon: Zap, color: 'var(--accent-cyan)' },
  { id: 'designs', title: 'Designs', description: 'Premium web design and brand identity.', category: 'Service', path: '/expertise#designs', icon: Globe, color: '#f06292' },
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

  const dynamicImpact: SearchResult[] = CASE_STUDIES.map((study: any, idx: number) => ({
    id: `impact-${idx}`,
    title: study.title,
    description: study.challenge,
    category: 'Project',
    path: '/impact',
    icon: BookOpen,
    color: study.color || 'var(--accent-orange)'
  }));

  return [...STATIC_DATA, ...dynamicImpact, ...dynamicInsights];
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
