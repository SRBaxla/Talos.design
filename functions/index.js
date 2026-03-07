const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Callable function to set custom claims (e.g., role)
exports.setWorkerRole = functions.https.onCall(async (data, context) => {
    // 1. Check if the user calling the function is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Only authenticated users can set worker roles.'
        );
    }

    // 2. Only admins and managers can assign roles
    const callerRole = context.auth.token.role;
    if (callerRole && callerRole !== 'admin' && callerRole !== 'manager') {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only admins and managers can set worker roles.'
        );
    }

    // 3. Extract the target uid and the role we want to assign
    const uid = data.uid;
    const role = data.role; // e.g., 'admin', 'manager', 'developer', 'designer'

    if (!uid || !role) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with "uid" and "role" arguments.'
        );
    }

    try {
        // 4. Set the custom claims on the target user
        await admin.auth().setCustomUserClaims(uid, { role: role });

        return {
            message: `Successfully set role ${role} for user ${uid}.`,
            success: true
        };
    } catch (error) {
        console.error('Error setting custom claims:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Failed to set custom claims.',
            error
        );
    }
});

// Callable function to automatically create a worker auth account
exports.createWorkerAccount = functions.https.onCall(async (data, context) => {
    // 1. Check if the user calling the function is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Only authenticated users can create worker accounts.'
        );
    }

    // 2. Only admins and managers can create worker accounts
    const callerRole = context.auth.token.role;
    if (callerRole && callerRole !== 'admin' && callerRole !== 'manager') {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only admins and managers can create worker accounts.'
        );
    }

    const { email, name, department, role } = data;

    if (!email || !name) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with "email" and "name" arguments.'
        );
    }

    try {
        let uid;
        try {
            // First, try to get existing user by email
            const userRecord = await admin.auth().getUserByEmail(email);
            uid = userRecord.uid;
        } catch (e) {
            // If user doesn't exist, create a new one
            if (e.code === 'auth/user-not-found') {
                const userRecord = await admin.auth().createUser({
                    email: email,
                    displayName: name,
                    password: 'TalosWorker2026!' // Default temporary password
                });
                uid = userRecord.uid;
            } else {
                throw e;
            }
        }

        // Set the custom claims for this user
        const claims = { worker: true };
        if (department) {
            claims.department = department;
        }
        if (role) {
            claims.role = role;
        }
        await admin.auth().setCustomUserClaims(uid, claims);

        return {
            uid: uid,
            message: `Successfully created/fetched user ${uid}.`,
            success: true
        };
    } catch (error) {
        console.error('Error creating worker auth account:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Failed to create worker auth account.',
            error
        );
    }
});

// Callable function to check if an email has a project (no auth required)
exports.checkClientEmail = functions.https.onCall(async (data) => {
    const { email } = data;
    if (!email) {
        throw new functions.https.HttpsError('invalid-argument', 'Email is required.');
    }
    const snap = await admin.firestore()
        .collection('projects')
        .where('clientEmail', '==', email)
        .get();
    return { hasProject: !snap.empty };
});

// Callable function to create/login a client account with Firebase Auth
exports.createClientAccount = functions.https.onCall(async (data, context) => {
    const { email, password, accessCode } = data;

    if (!email || !password) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Email and password are required.'
        );
    }

    // If accessCode is provided, verify it against the project
    if (accessCode) {
        const projectsSnap = await admin.firestore()
            .collection('projects')
            .where('clientEmail', '==', email)
            .get();

        if (projectsSnap.empty) {
            throw new functions.https.HttpsError(
                'not-found',
                'No project found for this email.'
            );
        }

        const validCode = projectsSnap.docs.some(d => {
            const stored = d.data().accessCode;
            return stored && stored === accessCode.trim();
        });

        if (!validCode) {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Invalid access code.'
            );
        }
    }

    try {
        let uid;
        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            uid = userRecord.uid;
            // Update password if user already exists (first-login scenario)
            await admin.auth().updateUser(uid, { password });
        } catch (e) {
            if (e.code === 'auth/user-not-found') {
                const userRecord = await admin.auth().createUser({
                    email,
                    password,
                    displayName: email.split('@')[0],
                });
                uid = userRecord.uid;
            } else {
                throw e;
            }
        }

        // Set client role custom claim
        await admin.auth().setCustomUserClaims(uid, { role: 'client' });

        return { uid, success: true };
    } catch (error) {
        console.error('Error creating client account:', error);
        throw new functions.https.HttpsError(
            'internal',
            error.message || 'Failed to create client account.'
        );
    }
});

// ── Email Setup ──────────────────────────────────────
const nodemailer = require('nodemailer');

function getTransporter() {
    const config = functions.config();
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email?.user || '',
            pass: config.email?.pass || '', // Gmail App Password
        },
    });
}

// ── Email: Invoice Status Change ─────────────────────
exports.onInvoiceStatusChange = functions.firestore
    .document('invoices/{invoiceId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();

        // Only send email when status changes to 'sent'
        if (before.status === after.status || after.status !== 'sent') {
            return null;
        }

        if (!after.clientEmail) {
            console.log('No client email on invoice, skipping notification.');
            return null;
        }

        const total = (after.items || []).reduce(
            (sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0
        );

        try {
            const transporter = getTransporter();
            await transporter.sendMail({
                from: `"TALOS.DESIGN" <${functions.config().email?.user}>`,
                to: after.clientEmail,
                subject: `Invoice #${after.invoiceNumber} from TALOS.DESIGN`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
                        <h1 style="font-size:24px;color:#1a1a1a;">New Invoice</h1>
                        <p>Hi <strong>${after.clientName}</strong>,</p>
                        <p>You have a new invoice from TALOS.DESIGN:</p>
                        <table style="width:100%;border-collapse:collapse;margin:24px 0;">
                            <tr style="background:#f8f8f8;">
                                <td style="padding:12px;border:1px solid #e0e0e0;font-weight:bold;">Invoice #</td>
                                <td style="padding:12px;border:1px solid #e0e0e0;">${after.invoiceNumber}</td>
                            </tr>
                            <tr>
                                <td style="padding:12px;border:1px solid #e0e0e0;font-weight:bold;">Amount Due</td>
                                <td style="padding:12px;border:1px solid #e0e0e0;font-size:18px;font-weight:bold;">$${total.toFixed(2)}</td>
                            </tr>
                            <tr style="background:#f8f8f8;">
                                <td style="padding:12px;border:1px solid #e0e0e0;font-weight:bold;">Due Date</td>
                                <td style="padding:12px;border:1px solid #e0e0e0;">${after.dueDate}</td>
                            </tr>
                        </table>
                        <p style="color:#888;font-size:13px;">Thank you for your business — TALOS.DESIGN</p>
                    </div>
                `,
            });
            console.log(`Invoice email sent to ${after.clientEmail}`);
        } catch (error) {
            console.error('Error sending invoice email:', error);
        }
        return null;
    });

// ── Email: Worker Assignment ─────────────────────────
exports.onWorkerAssignment = functions.firestore
    .document('projects/{projectId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();

        const oldTeam = before.teamAllotment || [];
        const newTeam = after.teamAllotment || [];

        // Find newly added UIDs
        const addedUids = newTeam.filter(uid => !oldTeam.includes(uid));
        if (addedUids.length === 0) return null;

        try {
            // Look up worker emails from their auth records
            for (const uid of addedUids) {
                const userRecord = await admin.auth().getUser(uid);
                if (userRecord.email) {
                    const transporter = getTransporter();
                    await transporter.sendMail({
                        from: `"TALOS.DESIGN" <${functions.config().email?.user}>`,
                        to: userRecord.email,
                        subject: `You've been assigned to: ${after.title}`,
                        html: `
                            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
                                <h1 style="font-size:24px;color:#1a1a1a;">New Project Assignment</h1>
                                <p>Hi ${userRecord.displayName || 'there'},</p>
                                <p>You have been assigned to the project <strong>"${after.title}"</strong> for client <strong>${after.client || 'N/A'}</strong>.</p>
                                <p>Log in to the admin dashboard to view details.</p>
                                <p style="color:#888;font-size:13px;">— TALOS.DESIGN Team</p>
                            </div>
                        `,
                    });
                    console.log(`Assignment email sent to ${userRecord.email} for project ${after.title}`);
                }
            }
        } catch (error) {
            console.error('Error sending assignment email:', error);
        }
        return null;
    });

// ── Email: New Client Message ────────────────────────
exports.onNewClientMessage = functions.firestore
    .document('projects/{projectId}/messages/{messageId}')
    .onCreate(async (snap, context) => {
        const message = snap.data();
        const { projectId } = context.params;

        // Only notify admin when a client sends a message (not admin replies)
        if (message.senderRole === 'admin') return null;

        const adminEmail = functions.config().email?.admin || functions.config().email?.user;
        if (!adminEmail) {
            console.log('No admin email configured, skipping notification.');
            return null;
        }

        // Get project info
        const projectSnap = await admin.firestore().collection('projects').doc(projectId).get();
        const project = projectSnap.exists ? projectSnap.data() : {};

        try {
            const transporter = getTransporter();
            await transporter.sendMail({
                from: `"TALOS.DESIGN" <${functions.config().email?.user}>`,
                to: adminEmail,
                subject: `New message on project: ${project.title || projectId}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
                        <h1 style="font-size:24px;color:#1a1a1a;">New Client Message</h1>
                        <p>A new message was received on project <strong>"${project.title || projectId}"</strong>:</p>
                        <div style="background:#f8f8f8;border-left:4px solid #00e5ff;padding:16px;margin:24px 0;border-radius:4px;">
                            <p style="margin:0;white-space:pre-wrap;">${message.text || ''}</p>
                        </div>
                        <p style="color:#888;font-size:13px;">From: ${message.senderName || 'Client'} &middot; ${project.client || ''}</p>
                    </div>
                `,
            });
            console.log(`Client message notification sent to ${adminEmail}`);
        } catch (error) {
            console.error('Error sending message notification email:', error);
        }
        return null;
    });

// ── Email: Welcome New Client ─────────────────────────
exports.onProjectCreated = functions.firestore
    .document('projects/{projectId}')
    .onCreate(async (snap, context) => {
        const project = snap.data();

        // We only want to send the welcome email if this is a newly converted lead
        // The frontend passes an accessCode during conversion to signal this
        if (!project.clientEmail || !project.accessCode) {
            console.log('Skipping welcome email: missing clientEmail or accessCode');
            return null;
        }

        try {
            const portalUrl = 'https://talos.design/portal'; // Replace with dynamic URL if domain changes

            const transporter = getTransporter();
            await transporter.sendMail({
                from: `"TALOS.DESIGN" <${functions.config().email?.user}>`,
                to: project.clientEmail,
                subject: `Welcome to Talos Design: ${project.title}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
                        <h1 style="font-size:24px;color:#1a1a1a;">Welcome to Talos Design</h1>
                        <p>Hi <strong>${project.client || 'there'}</strong>,</p>
                        <p>We're excited to begin working on <strong>${project.title}</strong> with you. Your project has been officially created in our system.</p>
                        
                        <div style="background:#f8f8f8;border-left:4px solid #f97316;padding:16px;margin:24px 0;border-radius:4px;">
                            <h2 style="font-size:16px;margin-top:0;">Your Client Portal Access</h2>
                            <p style="margin-bottom:8px;">You can log in to view project progress, invoices, and message our team directly.</p>
                            <p style="margin-bottom:8px;"><strong>Portal Link:</strong> <a href="${portalUrl}">${portalUrl}</a></p>
                            <p style="margin-bottom:0;font-family:monospace;font-size:16px;font-weight:bold;color:#1a1a1a;background:#e5e5e5;display:inline-block;padding:4px 8px;border-radius:4px;">Access Code: ${project.accessCode}</p>
                        </div>
                        
                        <p>When you log in for the first time, you will use your email and the access code above to create your password.</p>
                        <p style="color:#888;font-size:13px;margin-top:32px;">— The TALOS.DESIGN Team</p>
                    </div>
                `,
            });
            console.log(`Welcome email successfully sent to ${project.clientEmail}`);
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }

        return null;
    });
