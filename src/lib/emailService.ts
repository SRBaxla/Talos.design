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
        project_title: params.projectTitle,
        portal_url: portalUrl,
        access_code: params.accessCode,
        from_name: 'Talos Design',
        reply_to: 'hello@talos.design',
    };

    const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
    );

    return response;
}
