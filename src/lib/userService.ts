import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '../admin/firebase/firebaseConfig';

export type UserRole = 'reader' | 'client' | 'admin' | 'worker';

export interface ReaderPreferences {
    topics: string[];
    frequency: 'instant' | 'weekly' | 'monthly';
    emailUpdates: boolean;
    whatsappUpdates?: boolean;
    whatsappNumber?: string;
    onboardingCompleted: boolean;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    roles: UserRole[];
    readerPreferences?: ReaderPreferences;
    createdAt?: any;
    updatedAt?: any;
}

export const INSIGHT_TOPICS = [
    { id: 'ai-agents', label: 'Autonomous AI & CRM Agents', icon: 'Brain', tag: 'AI' },
    { id: 'logic-pipelines', label: 'Workflow Logic & Automation', icon: 'Cpu', tag: 'Engineering' },
    { id: 'spatial-design', label: 'Spatial UI & Modern Design Systems', icon: 'Globe', tag: 'Design' },
    { id: 'edge-performance', label: 'Sub-Second SSG & Edge Hydration', icon: 'Zap', tag: 'Performance' },
    { id: 'chatbots', label: 'Conversational Sales & WhatsApp Bots', icon: 'Bot', tag: 'Automation' },
];

/**
 * Resolves all active roles for an authenticated Firebase user.
 * Combines Reader, Client (if email has projects), and Admin/Worker status into an overlappable array.
 */
export async function resolveUserRoles(user: User): Promise<UserRole[]> {
    const roles: Set<UserRole> = new Set(['reader']); // All authenticated users are readers by default

    const email = user.email?.toLowerCase().trim();

    if (email) {
        try {
            // Check if user has active client projects
            const projectQ = query(collection(db, 'projects'), where('clientEmail', '==', email));
            const projectSnap = await getDocs(projectQ);
            if (!projectSnap.empty) {
                roles.add('client');
            }
        } catch {
            // Non-blocking
        }

        try {
            // Check if user is an internal worker or admin
            const workerQ = query(collection(db, 'workers'), where('email', '==', email));
            const workerSnap = await getDocs(workerQ);
            if (!workerSnap.empty) {
                const workerData = workerSnap.docs[0].data();
                if (workerData.role === 'admin' || workerData.role === 'manager') {
                    roles.add('admin');
                } else {
                    roles.add('worker');
                }
            }
        } catch {
            // Non-blocking
        }
    }

    return Array.from(roles);
}

/**
 * Fetches or creates a unified UserProfile in Firestore (/users/{uid})
 * Merging overlappable roles dynamically.
 */
export async function getOrCreateUserProfile(user: User): Promise<UserProfile> {
    const userRef = doc(db, 'users', user.uid);
    const resolvedRoles = await resolveUserRoles(user);

    try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            const data = snap.data() as Partial<UserProfile>;
            const mergedRoles = Array.from(new Set([...(data.roles || ['reader']), ...resolvedRoles]));
            
            // Sync roles if new overlap detected
            if (JSON.stringify(mergedRoles.sort()) !== JSON.stringify((data.roles || []).sort())) {
                await setDoc(userRef, {
                    roles: mergedRoles,
                    updatedAt: serverTimestamp(),
                }, { merge: true });
            }

            return {
                uid: user.uid,
                email: user.email || '',
                displayName: data.displayName || user.displayName || user.email?.split('@')[0] || 'Member',
                roles: mergedRoles,
                readerPreferences: data.readerPreferences,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            };
        } else {
            // Create initial profile
            const newProfile: UserProfile = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || user.email?.split('@')[0] || 'Member',
                roles: resolvedRoles,
                readerPreferences: {
                    topics: ['ai-agents', 'logic-pipelines'],
                    frequency: 'weekly',
                    emailUpdates: true,
                    onboardingCompleted: false,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(userRef, newProfile);
            return newProfile;
        }
    } catch (err) {
        console.warn('Failed to sync user profile, returning fallback:', err);
        return {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Member',
            roles: resolvedRoles,
        };
    }
}

/**
 * Saves reader onboarding & topic preferences to Firestore
 */
export async function saveReaderOnboarding(
    uid: string,
    preferences: ReaderPreferences
): Promise<void> {
    const userRef = doc(db, 'users', uid);
    const sanitizedPrefs = {
        topics: Array.isArray(preferences.topics) ? preferences.topics : [],
        frequency: preferences.frequency || 'weekly',
        emailUpdates: preferences.emailUpdates !== false,
        whatsappUpdates: Boolean(preferences.whatsappUpdates),
        whatsappNumber: (preferences.whatsappUpdates && preferences.whatsappNumber) ? preferences.whatsappNumber.trim() : '',
        onboardingCompleted: true,
    };

    await setDoc(userRef, {
        readerPreferences: sanitizedPrefs,
        updatedAt: serverTimestamp(),
    }, { merge: true });
}


