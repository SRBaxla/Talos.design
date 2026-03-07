import emailjs from '@emailjs/browser';

// ─── EmailJS Configuration ────────────────────────────────
// TODO: Replace these with your actual EmailJS credentials from https://www.emailjs.com/
// 1. Sign up at emailjs.com (free)
// 2. Create a service (Gmail, Outlook, etc.) → copy the Service ID
// 3. Create an email template → copy the Template ID
// 4. Go to Account → API Keys → copy your Public Key

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

// ─── Welcome Email ────────────────────────────────────────
// Call this when a lead is "Accepted & Converted"
// The EmailJS template should use these variable names:
//   {{to_name}}         → client's name
//   {{to_email}}        → client's email
//   {{project_title}}   → name of the project created
//   {{portal_url}}      → link to the client portal
//   {{access_code}}     → temporary access code
//   {{from_name}}       → "Talos Design"

export async function sendWelcomeEmail(params: {
    clientName: string;
    clientEmail: string;
    projectTitle: string;
    accessCode: string;
}) {
    const portalUrl = `${window.location.origin}/portal`;

    const templateParams = {
        to_name: params.clientName,
        to_email: params.clientEmail,
        from_name: 'Talos Design',
        reply_to: 'hello@talos.design',
        subject: `Welcome to Talos Design - ${params.projectTitle}`,
        message: `
Hi ${params.clientName},

Your project "${params.projectTitle}" has been set up successfully.

You can access your client portal here: ${portalUrl}
Your temporary access code is: ${params.accessCode}

Looking forward to working with you!
The Talos Design Team
        `.trim()
    };

    const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
    );

    return response;
}

// ─── Auto-Responder (Enquiry Received) ────────────────────
// Call this when a user submits the Contact Form
// We assume you have a separate template in EmailJS for auto-responders.
// The template should use:
//   {{to_name}}     → client's name
//   {{to_email}}    → client's email
//   {{from_name}}   → "Talos Design"
//   {{reply_to}}    → "noreply@talos.design"

export async function sendAutoResponderEmail(params: {
    clientName: string;
    clientEmail: string;
}) {
    // Both functions now use the exact same template.
    const templateParams = {
        to_name: params.clientName,
        to_email: params.clientEmail,
        from_name: 'Talos Design',
        reply_to: 'noreply@talos.design',
        subject: 'Enquiry Received - Talos Design',
        // We pass the entire email content as the 'message' variable.
        // This allows us to use one single EmailJS template for any kind of email!
        message: `
Hi ${params.clientName},

Thank you for reaching out to Talos Design. We have successfully received your project enquiry and our team is currently reviewing your requirements.

What happens next?
1. Review: We are looking over the details you provided.
2. Connect: We will reach out soon (usually within a few business hours) to schedule a brief discovery call or ask any clarifying questions.
3. Proposal: Following our chat, we will prepare a clear proposal with timeline and fixed pricing.

Speak soon,
The Talos Design Team

---
Please do not reply to this email.
Talos Design. Building digital infrastructure for the next generation of business.
        `.trim()
    };

    const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
    );

    return response;
}
