import {
    collection, doc, getDoc, setDoc, updateDoc, query,
    where, getDocs, Timestamp,
} from 'firebase/firestore';
import { db } from '../admin/firebase/firebaseConfig';

/* ── Types ─────────────────────────────────────────────────── */
export interface PortalUser {
    email: string;
    passwordHash: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/* ── Hashing ─────────────────────────────────────── (SHA-256) */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ── Verify access code against the project document ───────── */
export async function verifyAccessCode(email: string, code: string): Promise<boolean> {
    const q = query(collection(db, 'projects'), where('clientEmail', '==', email));
    const snap = await getDocs(q);
    if (snap.empty) return false;
    // Check any of the client's projects for a matching access code
    return snap.docs.some(d => {
        const stored = d.data().accessCode as string | undefined;
        return stored && stored === code.trim();
    });
}

/* ── Check if email has a project ──────────────────────────── */
export async function emailHasProject(email: string): Promise<boolean> {
    const q = query(collection(db, 'projects'), where('clientEmail', '==', email));
    const snap = await getDocs(q);
    return !snap.empty;
}

/* ── Portal user CRUD ───────────────────────────────────────── */
const portalUserDocRef = (email: string) =>
    doc(db, 'portalUsers', email.toLowerCase().trim());

export async function getPortalUser(email: string): Promise<PortalUser | null> {
    const snap = await getDoc(portalUserDocRef(email));
    return snap.exists() ? (snap.data() as PortalUser) : null;
}

export async function createPortalUser(email: string, password: string): Promise<void> {
    const hash = await hashPassword(password);
    await setDoc(portalUserDocRef(email), {
        email: email.toLowerCase().trim(),
        passwordHash: hash,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

export async function verifyPortalUser(email: string, password: string): Promise<boolean> {
    const user = await getPortalUser(email);
    if (!user) return false;
    const hash = await hashPassword(password);
    return hash === user.passwordHash;
}

export async function updatePortalPassword(email: string, newPassword: string): Promise<void> {
    const hash = await hashPassword(newPassword);
    await updateDoc(portalUserDocRef(email), {
        passwordHash: hash,
        updatedAt: Timestamp.now(),
    });
}
