import {
    signInWithEmailAndPassword, signInWithCustomToken,
    signOut, onAuthStateChanged, updatePassword,
    EmailAuthProvider, reauthenticateWithCredential,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '../admin/firebase/firebaseConfig';

/* ── Check if email has a project (via Cloud Function) ── */
export async function emailHasProject(email: string): Promise<boolean> {
    const fn = httpsCallable<{ email: string }, { hasProject: boolean }>(
        functions, 'checkClientEmail'
    );
    const result = await fn({ email });
    return result.data.hasProject;
}

/* ── Create client account via Cloud Function ────────── */
export async function createClientAccount(
    email: string, password: string, accessCode: string
): Promise<void> {
    const fn = httpsCallable<
        { email: string; password: string; accessCode: string },
        { uid: string; customToken: string; success: boolean }
    >(functions, 'createClientAccount');

    const result = await fn({ email, password, accessCode });

    // Sign in with the custom token returned by the Cloud Function
    await signInWithCustomToken(auth, result.data.customToken);
}

/* ── Sign in existing client ─────────────────────────── */
export async function signInClient(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
}

/* ── Sign out ────────────────────────────────────────── */
export async function signOutClient(): Promise<void> {
    await signOut(auth);
}

/* ── Change password (authenticated) ─────────────────── */
export async function changeClientPassword(
    currentPassword: string, newPassword: string
): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('Not authenticated');

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
}

/* ── Auth state listener ─────────────────────────────── */
export function onClientAuthChange(cb: (user: User | null) => void) {
    return onAuthStateChanged(auth, cb);
}

/* ── Get current user ────────────────────────────────── */
export function getCurrentClient(): User | null {
    return auth.currentUser;
}
