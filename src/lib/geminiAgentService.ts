import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatHistoryMessage {
    role: 'user' | 'model';
    text: string;
}

export interface AgentResponse {
    text: string;
    actions?: { label: string; link?: string; prompt?: string }[];
    isLiveLLM: boolean;
}

const TALOS_SYSTEM_INSTRUCTION = `
You are the official AI Assistant for "Talos" (talos.design), an executive digital design and AI engineering studio founded by Sudeep Baxla.

YOUR ROLE:
You represent Talos to prospective clients, founders, and engineers. Your job is to answer questions about Talos's services, pricing, technology stack, case studies, and engineering philosophy accurately, concisely, and professionally.

CORE FACTS & KNOWLEDGE BASE ABOUT TALOS:
1. SERVICES:
   - High-Performance Web Development: Bespoke websites built on React 19, TypeScript, Vite, Tailwind CSS with 95+ Core Web Vitals, SSG pre-rendering, and fluid micro-animations.
   - Conversational AI & Inquiry Assistants: Retrieval-Augmented Generation (RAG) agents for web and Meta WhatsApp Business Cloud API. Engineered for zero hallucinations, multi-turn lead capture, and deterministic human escalation.
   - Custom Automation & Cloud Systems: End-to-end webhook architecture connecting CRM tools (HubSpot, Airtable), payment gateways (Stripe), and databases (PostgreSQL, Supabase, Firebase).

2. PRICING & PACKAGES:
   - "Digital Business Launch" — $1,499 (Turnaround: 2–4 weeks): Complete custom lead-generation website, SEO setup, WhatsApp click-to-chat integration, and full analytics.
   - "Conversational AI & Growth" — $2,999 (Turnaround: 3–5 weeks): Bespoke RAG AI sales assistant, CRM sync, WhatsApp Cloud API integration, automated lead ingestion, and analytics dashboard.
   - "Enterprise Custom Architecture" — Tailored Quote (Turnaround: 6–10 weeks): Full-stack SaaS, headless backend systems, custom database pipelines, and dedicated SLA support.

3. TECH STACK:
   - Frontend: React 19, TypeScript, Tailwind CSS, Vite, Framer Motion, Three.js.
   - Backend/Cloud: Firebase Suite (Auth, Firestore, Cloud Functions), Node.js, Python.
   - AI Frameworks: Modern Foundation LLMs & Neural APIs with vector embeddings and RAG grounding.
   - Integrations: Meta WhatsApp Cloud API, Stripe Billing, Resend / SendGrid.

4. ENGINEERING VALUES:
   - Factual answers with zero hallucinations.
   - Strict prompt context isolation and deterministic guardrails.
   - Fixed-quote transparent pricing without hidden hourly retainers.
   - Transparent 4-step process: 1. 30-minute Discovery Call, 2. Blueprint & Quote, 3. Sprint Execution with staging demos, 4. Launch & Support.

RESPONSE GUIDELINES:
- Keep answers concise, structured, and easy to read (use bullet points or bold text where appropriate).
- Be polite, knowledgeable, and helpful.
- When relevant, encourage the user to schedule a discovery call or visit the contact page.
- Do not make up fake partners or services outside of Talos's real digital design, web development, and AI agent domains.
`;

const SELECTED_MODEL = 'gemini-3.1-flash-lite';

export async function askTalosAgent(
    history: ChatHistoryMessage[],
    userMessage: string
): Promise<AgentResponse> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('No VITE_GEMINI_API_KEY configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Convert history format
    const formattedHistory = history.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
    }));

    const model = genAI.getGenerativeModel({
        model: SELECTED_MODEL,
        systemInstruction: TALOS_SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 600,
        },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const replyText = response.text();

    if (!replyText) {
        throw new Error(`Empty response from ${SELECTED_MODEL}`);
    }

    // Generate smart action buttons
    const lower = (userMessage + ' ' + replyText).toLowerCase();
    const actions: { label: string; link?: string; prompt?: string }[] = [];

    if (lower.includes('contact') || lower.includes('call') || lower.includes('consultation') || lower.includes('quote') || lower.includes('hire') || lower.includes('start')) {
        actions.push({ label: 'Book Discovery Call', link: '/contact' });
    }
    if (lower.includes('package') || lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('$')) {
        actions.push({ label: 'View Pricing Packages', link: '/packages' });
    }
    if (lower.includes('service') || lower.includes('web') || lower.includes('design') || lower.includes('app')) {
        actions.push({ label: 'Explore Web Design', link: '/services/web-design' });
    }
    if (lower.includes('bot') || lower.includes('agent') || lower.includes('whatsapp') || lower.includes('rag')) {
        actions.push({ label: 'AI Chatbot Services', link: '/services/chatbots' });
    }

    if (actions.length === 0) {
        actions.push(
            { label: 'Explore Packages', link: '/packages' },
            { label: 'Schedule Call', link: '/contact' }
        );
    }

    return {
        text: replyText.trim(),
        actions: actions.slice(0, 3),
        isLiveLLM: true,
    };
}
