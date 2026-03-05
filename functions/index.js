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

    // 2. Check if the user calling the function has admin rights
    // In a real application, you would check context.auth.token.admin === true.
    // However, to bootstrap the first admin, you might temporarily allow any authenticated 
    // user to run this, OR hardcode a specific UID here to become the first admin.
    // For this implementation, we will assume you (the owner) will set the first admin
    // manually via script or temporarily commenting this out. 

    // Uncomment this after setting up the first admin:
    // if (context.auth.token.role !== 'admin') {
    //     throw new functions.https.HttpsError(
    //         'permission-denied',
    //         'Only admins can set worker roles.'
    //     );
    // }

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

    const { email, name, department } = data;

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

        // Set the custom claim for this user so they are recognized as a worker
        const claims = { worker: true };
        if (department) {
            claims.department = department;
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
