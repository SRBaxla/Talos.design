import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Bot,
    Shield,
    Brain,
    Clock,
    Database,
    CheckCircle,
    ArrowRight,
    UserCheck,
    Smartphone,
    Send,
    RotateCcw,
    Sparkles,
    Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

const TECHNICAL_PILLARS = [
    {
        icon: Brain,
        title: 'Retrieval-Augmented Grounding',
        description: 'Contextually ground model responses against company service catalogs, pricing guides, and FAQs to prevent hallucinations and maintain factual answers.',
        accent: 'var(--accent-cyan)',
        bg: 'rgba(0,229,255,0.08)',
        border: 'rgba(0,229,255,0.2)',
    },
    {
        icon: UserCheck,
        title: 'Structured Lead Extraction',
        description: 'Multi-turn extraction logic that identifies visitor intent, collects contact information, and formats structured payloads for CRM ingestion.',
        accent: 'var(--accent-orange)',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
    },
    {
        icon: Shield,
        title: 'Deterministic Human Escalation',
        description: 'Rule-based confidence boundaries that immediately transfer conversations to human team members when queries exceed configured scope.',
        accent: '#c084fc',
        bg: 'rgba(192,132,252,0.08)',
        border: 'rgba(192,132,252,0.2)',
    },
    {
        icon: Smartphone,
        title: 'WhatsApp Business & Web Relays',
        description: 'Event-driven webhook infrastructure connecting Meta WhatsApp Cloud APIs and lightweight React web widgets simultaneously.',
        accent: 'var(--accent-cyan)',
        bg: 'rgba(0,229,255,0.08)',
        border: 'rgba(0,229,255,0.2)',
    },
    {
        icon: Database,
        title: 'Pipeline & CRM Synchronization',
        description: 'Asynchronous webhook dispatches that log qualified lead events into Google Sheets, Airtable, HubSpot, or custom PostgreSQL databases.',
        accent: 'var(--accent-orange)',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
    },
    {
        icon: Clock,
        title: 'Continuous Response Monitoring',
        description: 'Admin review workflows to inspect unanswered questions, fine-tune knowledge base prompts, and expand answer coverage over time.',
        accent: '#c084fc',
        bg: 'rgba(192,132,252,0.08)',
        border: 'rgba(192,132,252,0.2)',
    },
];

const ARCHITECTURE_LAYERS = [
    {
        layer: '01',
        title: 'Inbound Ingestion & Normalization',
        description: 'Receives user messages via WebSocket (Web) or Webhook (WhatsApp), strips formatting anomalies, and establishes session identity.',
    },
    {
        layer: '02',
        title: 'Intent Classification & Guardrails',
        description: 'Evaluates if the query is a routine FAQ, a qualification trigger, or an escalation request before invoking generation logic.',
    },
    {
        layer: '03',
        title: 'Knowledge Grounding & Generation',
        description: 'Injects relevant chunks from your verified documentation into the prompt context to generate precise, grounded answers.',
    },
    {
        layer: '04',
        title: 'Action Dispatch & Human Notification',
        description: 'Formats and dispatches lead data to business storage while sending instant push/email alerts to staff when attention is needed.',
    },
];

interface ChatMessage {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    timestamp: string;
    grounded?: boolean;
    actions?: { label: string; link?: string; prompt?: string }[];
}

const TALOS_PRESET_QUESTIONS = [
    { label: '💼 Services', prompt: 'What services does Talos offer?' },
    { label: '💰 Pricing & Packages', prompt: 'What are your pricing packages and timelines?' },
    { label: '🤖 AI & Chatbots', prompt: 'Can you build a custom WhatsApp & web AI chatbot?' },
    { label: '🛠️ Tech Stack', prompt: 'What technologies and frameworks do you use?' },
    { label: '🚀 How to Start', prompt: 'How do we book a discovery call or consultation?' },
    { label: '🛡️ RAG Guardrails', prompt: 'How do you prevent hallucinations and ensure accuracy?' },
];

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: 'msg-1',
        sender: 'bot',
        text: "Hello! I'm the **Talos AI Assistant**, grounded in our official services, packages, and technical capabilities. Ask me anything about building high-performance websites, AI conversational agents, or custom software automation.",
        timestamp: 'Just now',
        grounded: true,
        actions: [
            { label: 'Explore Packages', prompt: 'What are your pricing packages and timelines?' },
            { label: 'Book Discovery Call', link: '/contact' },
        ],
    },
];

function generateTalosResponse(query: string): { text: string; actions?: { label: string; link?: string; prompt?: string }[] } {
    const q = query.toLowerCase();

    // 1. Services & Offerings
    if (q.includes('service') || q.includes('what do you do') || q.includes('offer') || q.includes('help with')) {
        return {
            text: "Talos specializes in three core engineering pillars:\n\n1. **High-Performance Web Design & Full-Stack Apps**: Custom, ultra-fast websites with 95+ Core Web Vitals, SSG rendering, and modern animations.\n2. **Conversational AI & Lead Bots**: Multi-turn assistants integrated with WhatsApp Business API, CRM ingestion, and knowledge grounding.\n3. **Custom Automation & Integrations**: End-to-end webhook architecture connecting HubSpot, Airtable, Stripe, and PostgreSQL.",
            actions: [
                { label: 'View Web Design', link: '/services/web-design' },
                { label: 'View AI Chatbots', link: '/services/chatbots' },
                { label: 'Schedule Consultation', link: '/contact' },
            ],
        };
    }

    // 2. Pricing & Packages
    if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('package') || q.includes('rate') || q.includes('budget')) {
        return {
            text: "We offer clear, transparent fixed-quote packages:\n\n• **Digital Business Launch ($1,499)**: Complete custom lead-generation website, SEO setup, analytics, and WhatsApp relay. (2–4 weeks)\n• **Conversational AI & Growth ($2,999)**: Bespoke RAG AI sales assistant, CRM sync, WhatsApp Cloud API integration, and analytics dashboard. (3–5 weeks)\n• **Custom Enterprise Architecture**: Full-stack tailored web apps, custom database pipelines, and dedicated SLA support.",
            actions: [
                { label: 'View Packages Page', link: '/packages' },
                { label: 'Request Custom Quote', link: '/contact' },
            ],
        };
    }

    // 3. AI Chatbots & WhatsApp Integration
    if (q.includes('chatbot') || q.includes('ai') || q.includes('agent') || q.includes('whatsapp') || q.includes('bot')) {
        return {
            text: "Yes! We build **Retrieval-Augmented (RAG)** conversational systems for both web and WhatsApp Business.\n\nKey features include:\n• **Zero Hallucination Guarantee**: Answers only from your verified company knowledge base.\n• **Automated Lead Capture**: Formats visitor contact info into structured CRM records.\n• **Deterministic Human Escalation**: Automatically alerts your staff when high-priority or complex questions arise.",
            actions: [
                { label: 'Chatbot Service Specs', link: '/services/chatbots' },
                { label: 'Ask About Timeline', prompt: 'How long does a website project take?' },
            ],
        };
    }

    // 4. Tech Stack & Engineering
    if (q.includes('tech') || q.includes('stack') || q.includes('framework') || q.includes('code') || q.includes('technology') || q.includes('react')) {
        return {
            text: "Our core production stack is built for speed, scalability, and zero technical debt:\n\n• **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion.\n• **Backend & Cloud**: Firebase Suite (Auth, Firestore, Cloud Functions, Security Rules), Node.js, Python.\n• **AI Infrastructure**: State-of-the-Art Foundation LLMs with structured vector embeddings & RAG grounding.\n• **Integrations**: Meta WhatsApp Cloud APIs, Stripe Billing, Resend / SendGrid.",
            actions: [
                { label: 'Explore Systems', link: '/expertise' },
                { label: 'Book Discovery Call', link: '/contact' },
            ],
        };
    }

    // 5. Booking / Discovery Call / Contact
    if (q.includes('book') || q.includes('call') || q.includes('contact') || q.includes('start') || q.includes('consultation') || q.includes('hire') || q.includes('quote')) {
        return {
            text: "Getting started with Talos is straightforward:\n\n1. **Discovery Call (30 mins)**: We review your business requirements, timeline, and goals.\n2. **Architecture Blueprint & Fixed Quote**: We provide a clear scope without hidden hourly billing.\n3. **Sprint Execution & Delivery**: Regular staging previews and transparent milestone demos.\n\nReady to get started? Submit our quick project form or book directly!",
            actions: [
                { label: 'Go to Contact Page', link: '/contact' },
                { label: 'Ask About Services', prompt: 'What services does Talos offer?' },
            ],
        };
    }

    // 6. Timelines & Delivery
    if (q.includes('timeline') || q.includes('time') || q.includes('how long') || q.includes('fast') || q.includes('turnaround')) {
        return {
            text: "Our typical project turnaround times:\n\n• **Custom Websites & Landing Systems**: 2 to 4 weeks.\n• **AI Chatbot & CRM Integrations**: 3 to 5 weeks.\n• **Full-Stack Web Applications**: 6 to 10 weeks depending on custom integrations.\n\nAll projects include end-to-end QA, mobile responsiveness testing, and search-engine index preparation.",
            actions: [
                { label: 'Check Pricing Packages', link: '/packages' },
                { label: 'Contact Team', link: '/contact' },
            ],
        };
    }

    // 7. Hallucinations & Guardrails (RAG)
    if (q.includes('hallucin') || q.includes('guardrail') || q.includes('rag') || q.includes('accuracy') || q.includes('truth')) {
        return {
            text: "We prevent hallucinations using a multi-layer defense:\n\n1. **Prompt Isolation**: The model is restricted strictly to provided document chunks.\n2. **Confidence Boundaries**: If the query falls outside verified knowledge, the bot safely defers to human team members.\n3. **Structured Response Output**: Formats lead payloads and quotes deterministically.",
            actions: [
                { label: 'Read Technical Specs', link: '/expertise' },
                { label: 'Book Technical Call', link: '/contact' },
            ],
        };
    }

    // 8. Lead Capture / Contact Info Provided
    if (q.includes('@') || q.match(/\d{7,15}/) || q.includes('.com') || q.includes('email') || q.includes('phone')) {
        return {
            text: "Thank you for sharing your details! Our engineering team has logged this request. A Talos specialist will reach out within 24 business hours to schedule your technical consultation.",
            actions: [
                { label: 'Submit Full Project Brief', link: '/contact' },
                { label: 'Explore Case Studies', link: '/about' },
            ],
        };
    }

    // 9. Greetings & Conversational
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('good morning') || q.includes('good afternoon')) {
        return {
            text: "Hello! Great to have you here. I'm ready to answer any questions about Talos web development, conversational AI agents, pricing packages, or our engineering process. What would you like to explore?",
            actions: [
                { label: 'What services do you offer?', prompt: 'What services does Talos offer?' },
                { label: 'What are your packages?', prompt: 'What are your pricing packages and timelines?' },
            ],
        };
    }

    // Default Fallback
    return {
        text: `Thanks for asking! As an inquiry assistant for **Talos**, I can give you exact details on our **Web Development services**, **AI Conversational Agents**, **Pricing Packages ($1,499–$2,999)**, or connect you with our engineering leadership directly on a discovery call.`,
        actions: [
            { label: 'View Pricing Packages', link: '/packages' },
            { label: 'Schedule Discovery Call', link: '/contact' },
            { label: 'Ask About Services', prompt: 'What services does Talos offer?' },
        ],
    };
}

import { askTalosAgent } from '../lib/geminiAgentService';
import type { ChatHistoryMessage } from '../lib/geminiAgentService';

const CHAT_SESSION_STORAGE_KEY = 'talos_ai_agent_session_v1';

const THINKING_STEPS = [
    'Thinking...',
    'Searching Talos knowledge base...',
    'Evaluating context & architecture...',
    'Synthesizing neural response...',
];

function parseInlineBold(text: string) {
    // Clean broken markdown links like [talos.design](https://talos.design) -> talos.design
    const cleanedText = text.replace(/\[([^\]]+)\]\([^\)]*\)/g, '$1');
    const parts = cleanedText.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx} className="font-semibold text-[var(--text-primary)]">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}

function renderFormattedMessage(content: string) {
    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
            return <div key={lineIdx} className="h-1" />;
        }

        // Header ###
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            const headerText = trimmed.replace(/^#+\s*/, '');
            return (
                <div key={lineIdx} className="font-bold text-[var(--accent-orange)] text-[11px] sm:text-xs mt-1.5 mb-0.5 break-words [overflow-wrap:anywhere]">
                    {parseInlineBold(headerText)}
                </div>
            );
        }

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            const bulletText = trimmed.replace(/^[\*\-•]\s*/, '');
            return (
                <div key={lineIdx} className="flex items-start gap-1.5 my-0.5 pl-0.5">
                    <span className="text-[var(--accent-orange)] font-bold shrink-0 mt-0.5">•</span>
                    <span className="flex-1 break-words [overflow-wrap:anywhere]">{parseInlineBold(bulletText)}</span>
                </div>
            );
        }

        // Regular line
        return (
            <div key={lineIdx} className="break-words [overflow-wrap:anywhere] leading-relaxed my-0.5">
                {parseInlineBold(line)}
            </div>
        );
    });
}

function InteractiveChatDemo() {
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        if (typeof window === 'undefined') return INITIAL_MESSAGES;
        try {
            const saved = sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Chat session restore error:', e);
        }
        return INITIAL_MESSAGES;
    });

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLiveAgent, setIsLiveAgent] = useState(true);
    const [thinkingStepIndex, setThinkingStepIndex] = useState(0);
    const messageListRef = useRef<HTMLDivElement>(null);

    // Dynamic rotating thinking indicator
    useEffect(() => {
        if (!isTyping) {
            setThinkingStepIndex(0);
            return;
        }
        const interval = setInterval(() => {
            setThinkingStepIndex((prev) => (prev + 1) % THINKING_STEPS.length);
        }, 1300);
        return () => clearInterval(interval);
    }, [isTyping]);

    // Save session automatically on every message update
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {
            console.warn('Chat session save error:', e);
        }
    }, [messages]);

    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTo({
                top: messageListRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        if (messages.length > 1 || isTyping) {
            scrollToBottom();
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (textToSend: string) => {
        if (!textToSend.trim() || isTyping) return;

        const userMsg: ChatMessage = {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text: textToSend.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setInput('');
        setIsTyping(true);

        try {
            // Build conversation history for the live LLM
            const history: ChatHistoryMessage[] = nextMessages
                .filter(m => m.id !== 'msg-1')
                .map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    text: m.text,
                }));

            // Call live Gemini 3.1 Flash Lite agent
            const response = await askTalosAgent(history, textToSend);

            const botMsg: ChatMessage = {
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: response.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                grounded: true,
                actions: response.actions,
            };

            setMessages(prev => [...prev, botMsg]);
            setIsLiveAgent(true);
        } catch (err) {
            console.warn('Live Gemini agent error, using local fallback:', err);
            setIsLiveAgent(false);

            // Graceful fallback to verified local knowledge base
            const fallbackReply = generateTalosResponse(textToSend);
            const botMsg: ChatMessage = {
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: fallbackReply.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                grounded: true,
                actions: fallbackReply.actions,
            };

            setMessages(prev => [...prev, botMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleResetChat = () => {
        try {
            sessionStorage.removeItem(CHAT_SESSION_STORAGE_KEY);
        } catch (e) {}
        setMessages(INITIAL_MESSAGES);
        setIsTyping(false);
        setInput('');
    };

    return (
        <div className="w-full max-w-full sm:max-w-xl mx-auto glass-panel rounded-2xl sm:rounded-3xl border border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col h-[490px] sm:h-[540px] md:h-[560px] bg-[var(--bg-surface)] transition-all">
            {/* Chat Top Navigation Bar */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] px-3.5 sm:px-5 py-2.5 sm:py-3.5 bg-[var(--bg-base)] shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="relative shrink-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-tr from-[var(--accent-orange)] to-amber-500 flex items-center justify-center text-white shadow-md">
                            <Bot size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-base)]" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="text-[11px] sm:text-xs font-bold font-display uppercase tracking-wider text-[var(--text-primary)] truncate">Talos Assistant</h4>
                            <span className="text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                                <Sparkles size={9} /> {isLiveAgent ? 'LIVE AI AGENT' : 'RAG KNOWLEDGE'}
                            </span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-[var(--accent-cyan)] flex items-center gap-1 font-mono truncate">
                            <span className="w-1.5 h-1.5 bg-[var(--accent-cyan)] rounded-full animate-pulse shrink-0" />
                            Grounded in Talos Knowledge Base
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={handleResetChat}
                        className="p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-lg transition-colors cursor-pointer"
                        title="Reset Demo Chat"
                        aria-label="Reset Demo Chat"
                    >
                        <RotateCcw size={14} className="sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>

            {/* Quick Prompt Questions Bar */}
            <div className="w-full min-w-0 max-w-full px-3 sm:px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-surface-elevated)] flex items-center gap-2 shrink-0 overflow-hidden">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1 shrink-0">
                    <Sparkles size={11} className="text-[var(--accent-orange)]" /> Ask:
                </span>
                <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5 touch-pan-x">
                    {TALOS_PRESET_QUESTIONS.map((pq, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendMessage(pq.prompt)}
                            className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] text-[var(--text-secondary)] whitespace-nowrap transition-all cursor-pointer shadow-2xs shrink-0"
                        >
                            {pq.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Message Stream */}
            <div ref={messageListRef} className="w-full min-w-0 max-w-full space-y-3 sm:space-y-4 p-3 sm:p-4 flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar text-[11px] sm:text-xs">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[95%] sm:max-w-[88%] ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
                    >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="text-[9px] font-mono text-[var(--text-muted)]">
                                {msg.sender === 'user' ? 'You' : 'Talos AI Agent'} • {msg.timestamp}
                            </span>
                            {msg.grounded && (
                                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[var(--accent-cyan)] flex items-center gap-0.5">
                                    <Check size={9} /> Verified Grounding
                                </span>
                            )}
                        </div>

                        <div
                            className={`p-3 sm:p-3.5 rounded-2xl leading-relaxed text-[11px] sm:text-xs break-words [overflow-wrap:anywhere] overflow-hidden ${
                                msg.sender === 'user'
                                    ? 'bg-[var(--accent-orange)] text-white font-medium rounded-tr-xs shadow-md'
                                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] rounded-tl-xs border border-[var(--border-color)] shadow-xs'
                            }`}
                        >
                            {msg.sender === 'user' ? (
                                <div className="break-words [overflow-wrap:anywhere]">{msg.text}</div>
                            ) : (
                                renderFormattedMessage(msg.text)
                            )}
                        </div>

                        {/* Interactive Suggestion Actions */}
                        {msg.actions && msg.actions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 pt-1 max-w-full overflow-hidden">
                                {msg.actions.map((act, i) => (
                                    act.link ? (
                                        <Link
                                            key={i}
                                            to={act.link}
                                            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-[var(--bg-base)] border border-[var(--accent-orange)]/40 hover:border-[var(--accent-orange)] text-[var(--accent-orange)] text-[10px] sm:text-[11px] font-bold transition-all shadow-2xs hover:scale-[1.02] max-w-full"
                                        >
                                            <span className="truncate">{act.label}</span>
                                            <ArrowRight size={11} className="shrink-0" />
                                        </Link>
                                    ) : (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => act.prompt && handleSendMessage(act.prompt)}
                                            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--accent-cyan)] text-[var(--text-primary)] text-[10px] sm:text-[11px] font-medium transition-all shadow-2xs cursor-pointer hover:scale-[1.02] max-w-full"
                                        >
                                            <span className="truncate">{act.label}</span>
                                            <Sparkles size={10} className="text-[var(--accent-cyan)] shrink-0" />
                                        </button>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Animated Thinking & Reasoning Indicator */}
                {isTyping && (
                    <div className="flex flex-col items-start mr-auto max-w-[95%] sm:max-w-[88%] animate-in fade-in duration-300">
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-cyan)]"></span>
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-wider font-semibold">
                                Reasoning &amp; Synthesizing
                            </span>
                        </div>

                        <div className="p-3 sm:p-3.5 rounded-2xl rounded-tl-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] shadow-xs space-y-2">
                            {/* Thinking Pill with rotating step message */}
                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)]/70 max-w-full overflow-hidden">
                                <Brain size={12} className="text-[var(--accent-orange)] animate-pulse shrink-0 sm:w-3.5 sm:h-3.5" />
                                <span className="text-[10px] sm:text-[11px] font-mono text-[var(--text-secondary)] italic transition-all duration-300 truncate">
                                    {THINKING_STEPS[thinkingStepIndex]}
                                </span>
                            </div>

                            {/* Pulsating Waveform Dots */}
                            <div className="flex items-center gap-1.5 px-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(input);
                }}
                className="p-2 sm:p-3 border-t border-[var(--border-color)] bg-[var(--bg-base)] flex gap-2 items-center shrink-0"
            >
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about pricing, packages, agents..."
                        className="w-full text-[11px] sm:text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-[var(--bg-surface)] px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] outline-none transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="p-2.5 sm:p-3 bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    title="Send message"
                    aria-label="Send message"
                >
                    <Send size={14} className="sm:w-4 sm:h-4" />
                </button>
            </form>
        </div>
    );
}

export default function AIAgents() {
    return (
        <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-8 sm:pt-10 md:pt-14 pb-12 sm:pb-16 min-h-screen min-w-0 overflow-hidden">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 sm:mb-14 md:mb-20 max-w-full"
            >
                <div className="badge badge-active mb-3 sm:mb-5 tracking-widest text-[9px] sm:text-xs px-2.5 py-0.5 sm:py-1">
                    [TECHNICAL EXPERTISE: CONVERSATIONAL SYSTEMS]
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl mb-3 sm:mb-5 font-display font-bold uppercase leading-[1.1] sm:leading-[1.05] tracking-tight">
                    Conversational AI &amp; <br className="hidden sm:inline" />
                    <span className="text-gradient-orange text-glow-orange">Inquiry Architecture</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed border-l-2 border-[var(--accent-orange)] pl-3 sm:pl-6 italic text-left sm:text-center">
                    "How we engineer practical, retrieval-grounded conversational systems that answer routine business questions, capture qualified leads, and safely escalate complex conversations to human teams."
                </p>
            </motion.div>

            {/* Interactive Concept & RAG Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center mb-16 sm:mb-24 md:mb-40 w-full min-w-0 max-w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-full"
                >
                    <div className="badge badge-online">Grounded In Verified Data</div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-tight">
                        Factual Answers. <br />
                        <span className="text-[var(--accent-orange)]">Zero Made-Up Claims.</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-xs sm:text-sm md:text-base leading-relaxed">
                        Language models without strict grounding frequently invent information. We engineer assistants that reference structured company documentation — price tiers, operating hours, service catalogs, and policy FAQs — so customers receive reliable information every time.
                    </p>
                    <div className="space-y-2.5 sm:space-y-3 pt-2">
                        {[
                            'Strict prompt context isolation to minimize hallucinations',
                            'Hard rule-based fallbacks when questions are out of scope',
                            'WhatsApp Business Cloud API webhook synchronization',
                            'Instant escalation alerts via email and messaging channels',
                        ].map((point) => (
                            <div key={point} className="flex items-start sm:items-center gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                                <CheckCircle size={15} className="text-[var(--accent-cyan)] shrink-0 mt-0.5 sm:mt-0" />
                                <span>{point}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center w-full min-w-0 max-w-full overflow-hidden"
                >
                    <InteractiveChatDemo />
                </motion.div>
            </div>

            {/* Architecture Pipeline */}
            <div className="mb-16 sm:mb-24 md:mb-40">
                <div className="text-center mb-10 sm:mb-14 md:mb-16">
                    <div className="badge badge-outline mb-3 sm:mb-4 text-[var(--accent-orange)] tracking-widest uppercase text-[10px] sm:text-xs">
                        System Design
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-display uppercase tracking-tight">
                        The Ingestion &amp; <span className="text-gradient-orange">Routing Flow</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {ARCHITECTURE_LAYERS.map((layer, i) => (
                        <motion.div
                            key={layer.layer}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="glass-panel p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between hover:border-[var(--accent-orange)]/40 transition-all"
                        >
                            <div>
                                <span className="text-[10px] sm:text-xs font-mono font-bold text-[var(--accent-orange)] px-2 py-0.5 rounded bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] mb-3 sm:mb-4 inline-block">
                                    LAYER {layer.layer}
                                </span>
                                <h3 className="text-sm sm:text-base font-bold mb-2 text-[var(--text-primary)]">{layer.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{layer.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Technical Pillars */}
            <div className="mb-16 sm:mb-24 md:mb-40">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase tracking-tight mb-8 sm:mb-12 flex items-center gap-2.5 sm:gap-3">
                    <Brain className="text-[var(--accent-orange)] w-6 h-6 sm:w-8 sm:h-8" /> Engineering Pillars
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {TECHNICAL_PILLARS.map((pillar, i) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-[var(--border-color)] group hover:border-[rgba(245,158,11,0.3)] transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 transition-colors shrink-0"
                                    style={{ backgroundColor: pillar.bg }}
                                >
                                    <pillar.icon size={20} className="sm:w-[22px] sm:h-[22px]" style={{ color: pillar.accent }} />
                                </div>
                                <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 uppercase tracking-tight">{pillar.title}</h4>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{pillar.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA to Commercial Service */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-6 sm:p-10 md:p-14 glass-panel rounded-2xl sm:rounded-3xl text-center relative overflow-hidden border border-[var(--border-color)] mb-8 sm:mb-12"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(245,158,11,0.04)] to-transparent pointer-events-none" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase tracking-tight mb-3 sm:mb-4">
                    Looking to Deploy an <span className="text-gradient-orange">Inquiry Assistant?</span>
                </h2>
                <p className="text-[var(--text-secondary)] mb-6 sm:mb-8 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed opacity-90">
                    Explore our commercial AI Sales Assistant service to see full deliverables, package options, and deployment timelines.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                    <Link
                        to="/services/chatbots"
                        className="btn btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_var(--accent-orange-glow)] flex items-center justify-center gap-2"
                    >
                        View AI Service Details <ArrowRight size={15} />
                    </Link>
                    <Link
                        to="/contact"
                        className="btn btn-outline w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center"
                    >
                        Schedule Discovery Call
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
