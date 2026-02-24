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

export interface Project {
    id: string;
    name: string;
    client: string;
    type: ProjectType;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string;
    budget: string;
    description: string;
    notes: string;
    liveUrl: string;
    tags: string[];
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

