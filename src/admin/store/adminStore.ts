import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    Timestamp,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, onAuthStateChanged as onAuthChanged } from 'firebase/auth';
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

export type WorkerRole = 'admin' | 'manager' | 'developer' | 'designer';

export interface Worker {
    id: string;
    uid: string; // Firebase Auth UID
    name: string;
    email: string;
    role?: WorkerRole;
    department: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface ActivityLog {
    id: string;
    workerUid: string;
    action: string;
    description: string;
    referenceId?: string;
    referenceType?: 'project' | 'caseStudy' | 'ticket' | 'message';
    timestamp: Timestamp;
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
    showOnWebsite?: boolean;
    assignedWorkers?: string[]; // Array of worker UIDs
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

export function useProjects(clientEmail?: string) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { role, loading: roleLoading } = useCurrentWorkerRole();

    useEffect(() => {
        // Wait for role to resolve before fetching — prevents flash of all data
        if (roleLoading) return;

        const auth = getAuth();
        const currentUid = auth.currentUser?.uid;

        // If clientEmail is provided, add a query filter so Firestore rules are satisfied
        const constraints: any[] = [orderBy('createdAt', 'desc')];
        if (clientEmail) {
            constraints.unshift(where('clientEmail', '==', clientEmail));
        }
        const q = query(collection(db, 'projects'), ...constraints);

        const unsub = onSnapshot(q, (snap) => {
            let data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
            if (!clientEmail && role && role !== 'admin' && role !== 'manager' && currentUid) {
                data = data.filter(p => p.teamAllotment?.includes(currentUid));
            }
            setProjects(data);
            setLoading(false);
        });
        return unsub;
    }, [role, roleLoading, clientEmail]);

    return { projects, loading };
}

export function useCaseStudies() {
    const [studies, setStudies] = useState<CaseStudy[]>([]);
    const [loading, setLoading] = useState(true);
    const { role, loading: roleLoading } = useCurrentWorkerRole();

    useEffect(() => {
        if (roleLoading) return;

        const auth = getAuth();
        const currentUid = auth.currentUser?.uid;
        const q = query(collection(db, 'caseStudies'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            let data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CaseStudy));
            if (role && role !== 'admin' && role !== 'manager' && currentUid) {
                data = data.filter(cs => cs.assignedWorkers?.includes(currentUid));
            }
            setStudies(data);
            setLoading(false);
        });
        return unsub;
    }, [role, roleLoading]);

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

export function useWorkers() {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'workers'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Worker));
            setWorkers(data);
            setLoading(false);
        });
        return unsub;
    }, []);

    return { workers, loading };
}

export function useActivityLogs(workerUid?: string) {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!workerUid) {
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, 'activityLogs'),
            orderBy('timestamp', 'desc')
        );
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
            // In a better implementation we'd filter by workerUid in the query if we add an index.
            // For now, client side filtering is okay.
            setLogs(data.filter(log => log.workerUid === workerUid));
            setLoading(false);
        });
        return unsub;
    }, [workerUid]);

    return { logs, loading };
}

/* ── Role Management ──────────────────────────────── */

export function useCurrentWorkerRole() {
    const [role, setRole] = useState<WorkerRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsub = onAuthChanged(auth, async (user) => {
            if (user) {
                try {
                    const tokenResult = await user.getIdTokenResult(true);
                    setRole((tokenResult.claims.role as WorkerRole) || null);
                } catch {
                    setRole(null);
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });
        return unsub;
    }, []);

    return { role, loading, isAdmin: role === 'admin', isManager: role === 'manager' };
}

export async function setWorkerRoleClaim(uid: string, role: WorkerRole): Promise<void> {
    const functions = getFunctions();
    const setRole = httpsCallable(functions, 'setWorkerRole');
    await setRole({ uid, role });
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

/* ── Worker & Activity Log CRUD ────────────────────── */

export async function addWorker(data: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>) {
    return addDoc(collection(db, 'workers'), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

export async function createWorkerAuth(email: string, name: string, department?: string, role?: WorkerRole): Promise<string> {
    const functions = getFunctions();
    const createWorkerAccount = httpsCallable(functions, 'createWorkerAccount');
    const result = await createWorkerAccount({ email, name, department, role });
    return (result.data as any).uid;
}

export async function updateWorker(id: string, data: Partial<Worker>) {
    return updateDoc(doc(db, 'workers', id), {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteWorker(id: string) {
    return deleteDoc(doc(db, 'workers', id));
}

export async function addActivityLog(data: Omit<ActivityLog, 'id' | 'timestamp'>) {
    return addDoc(collection(db, 'activityLogs'), {
        ...data,
        timestamp: Timestamp.now(),
    });
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
    workerUid?: string; // Tying message to the logged-in admin
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

export async function sendMessage(projectId: string, text: string, sender: 'admin' | 'client', workerUid?: string) {
    const data: any = {
        text,
        sender,
        read: false,
        createdAt: Timestamp.now()
    };
    if (workerUid) {
        data.workerUid = workerUid;
    }
    const result = await addDoc(collection(db, 'projects', projectId, 'messages'), data);

    // Log the activity if a worker sent it
    if (workerUid && sender === 'admin') {
        await addActivityLog({
            workerUid,
            action: 'sent_message',
            description: `Sent message in project ${projectId}`,
            referenceId: result.id,
            referenceType: 'message'
        });
    }

    return result;
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

export function useInvoices(clientEmail?: string) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const constraints: any[] = [orderBy('createdAt', 'desc')];
        if (clientEmail) {
            constraints.unshift(where('clientEmail', '==', clientEmail));
        }
        const q = query(collection(db, 'invoices'), ...constraints);
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invoice));
            setInvoices(data);
            setLoading(false);
        });
        return unsub;
    }, [clientEmail]);

    return { invoices, loading };
}

