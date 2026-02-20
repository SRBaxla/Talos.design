
import { LayoutGrid, Bot, Settings, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col flex-grow w-full">

      {/* HERO SECTION */}
      <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.05)]">

        {/* HERO CONTENT */}
        <div className="container relative z-10 flex flex-col items-center pt-20 pb-10">
          <div className="badge badge-online mb-12 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            Systems Online
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl text-center mb-6 max-w-5xl tracking-tight leading-[1.1]">
            Engineering the <br />
            <span className="text-gradient-orange drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Future of Work</span>
          </h1>

          <p className="text-xl text-[var(--text-secondary)] text-center max-w-3xl leading-relaxed py-4 backdrop-blur-sm rounded-3xl">
            We deploy intelligent agents and automate your critical workflows with
            cutting-edge AI solutions. Scale your ambition with digital infrastructure
            built for tomorrow.
          </p>
        </div>
      </div>

      {/* REST OF PAGE CONTENT */}
      <div className="container py-24 flex flex-col items-center flex-grow relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1 */}
          <div className="glass-panel p-8 flex flex-col transition-all duration-300 hover:border-[var(--accent-orange)] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-2 group">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[var(--accent-orange)] group-hover:scale-110 shadow-[0_0_15px_rgba(245,158,11,0.0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
                <LayoutGrid size={24} />
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] border border-[var(--border-color)] px-2 py-1 rounded">01</span>
            </div>
            <h3 className="text-2xl mb-4 font-display">Web Design</h3>
            <p className="text-[var(--text-secondary)] mb-12 flex-grow text-sm leading-relaxed">
              High-performance interfaces designed for conversion. We build responsive, accessible, and fast web applications that serve as the foundation of your digital presence.
            </p>

            <div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">Technology Stack</div>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Next.js</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Tailwind</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Framer Motion</span>
              </div>
              <a href="/services" className="inline-flex items-center text-[var(--accent-orange)] font-medium text-sm hover:text-[var(--accent-orange-hover)] transition-colors">
                Explore Architecture <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 flex flex-col transition-all duration-300 hover:border-[var(--accent-orange)] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-2 group">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[var(--accent-orange)] group-hover:scale-110 shadow-[0_0_15px_rgba(245,158,11,0.0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
                <Bot size={24} />
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] border border-[var(--border-color)] px-2 py-1 rounded">02</span>
            </div>
            <h3 className="text-2xl mb-4 font-display">AI Chatbots</h3>
            <p className="text-[var(--text-secondary)] mb-12 flex-grow text-sm leading-relaxed">
              Intelligent agents that handle customer support 24/7. Our custom LLM implementations understand context, intent, and your specific business knowledge base.
            </p>

            <div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">Technology Stack</div>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">OpenAI API</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">LangChain</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Pinecone</span>
              </div>
              <a href="/services" className="inline-flex items-center text-[var(--accent-orange)] font-medium text-sm hover:text-[var(--accent-orange-hover)] transition-colors">
                View Integration <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 flex flex-col transition-all duration-300 hover:border-[var(--accent-orange)] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-2 group">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[var(--accent-orange)] group-hover:scale-110 shadow-[0_0_15px_rgba(245,158,11,0.0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
                <Settings size={24} />
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] border border-[var(--border-color)] px-2 py-1 rounded">03</span>
            </div>
            <h3 className="text-2xl mb-4 font-display">System Automation</h3>
            <p className="text-[var(--text-secondary)] mb-12 flex-grow text-sm leading-relaxed">
              Eliminate manual data entry and repetitive tasks. We connect disparate apps and databases to create seamless, automated workflows that save hundreds of hours.
            </p>

            <div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">Technology Stack</div>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Python</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">Zapier</span>
                <span className="text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-1 rounded text-[var(--accent-cyan)]">AWS Lambda</span>
              </div>
              <a href="/services" className="inline-flex items-center text-[var(--accent-orange)] font-medium text-sm hover:text-[var(--accent-orange-hover)] transition-colors">
                See Workflows <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer CTA Section */}
        <div className="w-full max-w-5xl mt-32 border border-[var(--border-color)] p-10 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 rounded-3xl bg-[rgba(255,255,255,0.01)] backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(245,158,11,0.03)] to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl font-display mb-2">Ready to automate?</h2>
            <p className="text-[var(--text-secondary)]">Schedule a free consultation to discuss your infrastructure.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <a href="/pricing" className="btn btn-outline py-3 px-8">View Pricing</a>
            <a href="/contact" className="btn btn-primary py-3 px-8 shadow-[0_0_20px_var(--accent-orange-glow)]">Book a Call</a>
          </div>
        </div>
      </div>
    </div>
  );
}
