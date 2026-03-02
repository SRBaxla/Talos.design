import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useState, useEffect } from 'react';

/* ── Types ─────────────────────────────────────────── */

export type ProjectStatus = 'lead' | 'in-progress' | 'review' | 'completed' | 'published';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectType = 'web-design' | 'ai-chatbot' | 'automation' | 'custom';

export interface CostRevision {
    id: string;
    reason: string;
    amount: number;
    date: string;
}

export interface ClientRequirement {
    id: string;
    task: string;
    completed: boolean;
}

export interface ProjectMeeting {
    id: string;
    date: string;
    topic: string;
}

export interface Project {
    id: string;
    title: string;
    client: string;
    clientEmail?: string;
    type: ProjectType;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string;
    budget: string;
    description: string;
    notes: string;
    technologies?: string[];
    link?: string;
    liveUrl: string;
    tags: string[];
    // Advanced CRM Tracking
    clientUid?: string;
    accessCode?: string;           // One-time code given to client for first portal login
    teamAllotment?: string[];
    selectedFeatures?: string[];
    costRevisions?: CostRevision[];
    clientRequirements?: ClientRequirement[];
    meetings?: ProjectMeeting[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type CaseStudyStatus = 'draft' | 'research' | 'writing' | 'review' | 'published';

export interface CaseStudy {
    id: string;
    title: string;
    industry: string;
    client: string;
    status: CaseStudyStatus;
    summary: string;
    challenge: string;
    solution: string;
    results: string;
    tags: string[];
    liveUrl: string;
    publishDate: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type TicketStatus = 'todo' | 'in-progress' | 'done';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    assignee: string;
    dueDate: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/* ── Firestore Hooks ───────────────────────────────── */

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
            setProjects(data);
            setLoading(false);
        });
        return unsub;
    }, []);

    return { projects, loading };
}

export function useCaseStudies() {
    const [studies, setStudies] = useState<CaseStudy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'caseStudies'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CaseStudy));
            setStudies(data);
            setLoading(false);
        });
        return unsub;
    }, []);

    return { studies, loading };
}

/** parentCollection = 'projects' | 'caseStudies' */
export function useTickets(parentCollection: string, parentId: string) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!parentId) { setLoading(false); return; }
        const q = query(
            collection(db, parentCollection, parentId, 'tickets'),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Ticket));
            setTickets(data);
            setLoading(false);
        });
        return unsub;
    }, [parentCollection, parentId]);

    return { tickets, loading };
}

/* ── CRUD Operations ───────────────────────────────── */

export async function addProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    return addDoc(collection(db, 'projects'), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

export async function updateProject(id: string, data: Partial<Project>) {
    return updateDoc(doc(db, 'projects', id), {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteProject(id: string) {
    return deleteDoc(doc(db, 'projects', id));
}

export async function addCaseStudy(data: Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt'>) {
    return addDoc(collection(db, 'caseStudies'), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudy>) {
    return updateDoc(doc(db, 'caseStudies', id), {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteCaseStudy(id: string) {
    return deleteDoc(doc(db, 'caseStudies', id));
}

/* ── Ticket CRUD ───────────────────────────────────── */

export async function addTicket(
    parentCollection: string,
    parentId: string,
    data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>
) {
    return addDoc(collection(db, parentCollection, parentId, 'tickets'), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

export async function updateTicket(
    parentCollection: string,
    parentId: string,
    ticketId: string,
    data: Partial<Ticket>
) {
    return updateDoc(doc(db, parentCollection, parentId, 'tickets', ticketId), {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteTicket(
    parentCollection: string,
    parentId: string,
    ticketId: string
) {
    return deleteDoc(doc(db, parentCollection, parentId, 'tickets', ticketId));
}

/* ── Inquiries (CRM) ───────────────────────────────── */

export type InquiryStatus = 'unread' | 'read' | 'contacted' | 'negotiating' | 'won' | 'lost' | 'archived';

export interface Inquiry {
    id: string;
    name: string;
    email: string;
    company: string;
    message: string;
    status: InquiryStatus;
    value?: string; // Potential deal value
    notes?: string; // Internal notes
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export async function addInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    return addDoc(collection(db, 'inquiries'), {
        ...data,
        status: 'unread',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

export async function updateInquiry(id: string, data: Partial<Inquiry>) {
    return updateDoc(doc(db, 'inquiries', id), {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

export function useInquiries() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Inquiry));
            setInquiries(data);
            setLoading(false);
        });
        return unsub;
    }, []);

    return { inquiries, loading };
}

/* ── Chat Messaging ────────────────────────────────── */

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'admin' | 'client';
    read: boolean;
    createdAt: Timestamp;
}

export function useMessages(projectId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) {
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, 'projects', projectId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
            setMessages(data);
            setLoading(false);
        });
        return unsub;
    }, [projectId]);

    return { messages, loading };
}

export async function sendMessage(projectId: string, text: string, sender: 'admin' | 'client') {
    return addDoc(collection(db, 'projects', projectId, 'messages'), {
        text,
        sender,
        read: false,
        createdAt: Timestamp.now()
    });
}

/* ── Invoices ──────────────────────────────────────── */

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    projectId?: string; // Optional link to a project
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    items: InvoiceItem[];
    notes?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export async function addInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) {
    return addDoc(collection(db, 'invoices'), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

export async function updateInvoice(id: string, data: Partial<Invoice>) {
    return updateDoc(doc(db, 'invoices', id), {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteInvoice(id: string) {
    return deleteDoc(doc(db, 'invoices', id));
}

export function useInvoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invoice));
            setInvoices(data);
            setLoading(false);
        });
        return unsub;
    }, []);

    return { invoices, loading };
}

