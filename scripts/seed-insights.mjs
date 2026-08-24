/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TALOS.DESIGN — Insights Firestore Data Seed Script
 * ─────────────────────────────────────────────────────────────────────────────
 * File: scripts/seed-insights.mjs
 * Description: Standalone ES module script that seeds the 6 baseline technical
 *              articles into Cloud Firestore (`insights` collection).
 *
 * AUTHENTICATION MODES:
 * 1. Admin SDK Mode (Recommended — Bypasses all Firestore Security Rules):
 *    Set GOOGLE_APPLICATION_CREDENTIALS to your Service Account JSON file path:
 *    $ $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account.json"
 *    $ node scripts/seed-insights.mjs
 *
 * 2. Client Auth Mode (Requires deployed rules or Admin User Auth):
 *    $ node scripts/seed-insights.mjs <admin-email> <admin-password>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from 'node:fs';
import path from 'node:path';

// ── 1. Baseline Technical Articles ─────────────────────────────────────────
const STATIC_ARTICLES = [
  {
    id: 'autonomous-crm',
    title: 'The Future of Autonomous CRM Agents',
    excerpt: 'How LLMs are transforming customer relationship management from static databases to proactive business intelligence.',
    content: `
      <p>The traditional CRM is a passive repository of data. It waits for a human to enter a lead, update a status, or send an email. But the era of passive software is ending.</p>
      <h3>The Shift to Proactivity</h3>
      <p>Autonomous AI agents are turning CRMs into proactive engines. These agents don't just store lead data; they research the lead's company, identify intent signals across the web, and draft personalized outreach before a human even opens the tab.</p>
      <h3>Key Technical Pillars</h3>
      <ul>
        <li><strong>Vector Embeddings:</strong> Mapping customer interactions into high-dimensional space to understand sentiment and intent.</li>
        <li><strong>RAG (Retrieval-Augmented Generation):</strong> Ensuring the agent has up-to-the-minute product knowledge.</li>
        <li><strong>Logic Orchestration:</strong> Defining clear boundaries for agent autonomy vs human intervention.</li>
      </ul>
    `,
    date: 'Mar 15, 2026',
    readTime: '8 min',
    tag: 'AI',
    color: 'var(--accent-orange)',
    depth: 7,
    roi: 'High',
    isFeatured: true
  },
  {
    id: 'logic-pipelines',
    title: 'Scaling Agencies with Logic Pipelines',
    excerpt: 'A technical deep-dive into the architecture of automated workflow systems that eliminate administrative overhead.',
    content: `
      <p>For high-growth agencies, the biggest bottleneck isn't talent — it's administration. Handing off data between project managers, designers, and accountants consumes 30% of billable time.</p>
      <h3>The Architecture of Logic</h3>
      <p>We build "Logic Pipelines" — interconnected flows that handle complex business processes. From automated client onboarding to real-time project status dashboards triggered by GitHub commits or Figma updates.</p>
      <h3>Implementation Strategy</h3>
      <p>Start with the high-frequency, low-variance tasks. These are the "admin taxes" that, when removed, provide immediate ROI. Our pipelines leverage Python-based microservices to handle complex transformations that off-the-shelf tools like Zapier can't touch.</p>
    `,
    date: 'Feb 28, 2026',
    readTime: '12 min',
    tag: 'Engineering',
    color: 'var(--accent-cyan)',
    depth: 9,
    roi: 'Critical',
    isFeatured: false
  },
  {
    id: 'ux-inversion',
    title: 'Designing for Inversion: A New UX Paradigm',
    excerpt: 'Why traditional UI is evolving and why the future of user experience lies in predictive, context-aware interfaces.',
    content: `
      <p>Traditional UX is reactive. The user wants something, they click a button, the system responds. But in the era of pervasive AI, this "Pull" model is being replaced by an "Inverted" model.</p>
      <h3>The Push Paradigm</h3>
      <p>Interfaces will soon manifest only when needed. A "Zero-UI" approach where the system anticipates the user's intent based on historical patterns and real-time environmental data.</p>
      <h3>Engineering Anticipation</h3>
      <p>The technical challenge isn't just prediction — it's <strong>Contextual Awareness</strong>. Systems must maintain a high-fidelity graph of user state to ensure that "Push" interactions are helpful, not intrusive.</p>
    `,
    date: 'Jan 12, 2026',
    readTime: '6 min',
    tag: 'Design',
    color: '#f06292',
    depth: 5,
    roi: 'Medium',
    isFeatured: false
  },
  {
    id: 'agentic-workflows-2026',
    title: 'Architecting Multi-Agent Reasoning Systems',
    excerpt: 'Deconstructing multi-agent orchestration frameworks for deterministic execution and fault-tolerant tool calling.',
    content: `
      <p>Single LLM calls are prone to hallucinations and deadlocks when executed in open-ended domain environments. Multi-agent architectures divide complex goals into deterministic micro-tasks.</p>
      <h3>Supervisor vs Swarm Topologies</h3>
      <p>We analyze the trade-offs between centralized supervisor agents enforcing state machine constraints versus decentralized agent swarms passing contextual hands-off messages.</p>
      <h3>Resilience & Retry Policies</h3>
      <p>Implementing exponential backoff, schema validation interceptors, and human-in-the-loop fallback gates guarantees system stability in production environments.</p>
    `,
    date: 'Apr 02, 2026',
    readTime: '10 min',
    tag: 'AI',
    color: '#a855f7',
    depth: 8,
    roi: 'High',
    isFeatured: false
  },
  {
    id: 'sub-second-ssg',
    title: 'Sub-Second SSG & Edge Hydration at Scale',
    excerpt: 'Optimizing static pre-rendering, edge asset caching, and dynamic partial hydration for enterprise Web apps.',
    content: `
      <p>Page load performance directly dictates digital conversion rates. Pre-rendering pages into static HTML while streaming hydration scripts guarantees 100/100 Google Lighthouse performance scores.</p>
      <h3>Edge CDN Routing</h3>
      <p>By shifting page compilation to cloud edge nodes, server responses achieve global sub-50ms Time-To-First-Byte (TTFB) performance everywhere in the world.</p>
    `,
    date: 'Mar 28, 2026',
    readTime: '7 min',
    tag: 'Engineering',
    color: '#3b82f6',
    depth: 6,
    roi: 'High',
    isFeatured: false
  },
  {
    id: 'spatial-design-systems',
    title: 'Glassmorphism & Spatial Design Tokens in 2026',
    excerpt: 'Creating mathematical color scales, backdrop blur elevation layers, and high-contrast accessibility standards.',
    content: `
      <p>Modern UI design balances rich visual depth with ruthless accessibility. We explore CSS custom property tokens that dynamically scale contrast in both light and dark display modes.</p>
      <h3>Glass & Micro-Interactions</h3>
      <p>Using hardware-accelerated CSS backdrops, subtle border gradients, and reactive spring animations gives web interfaces a tactile, state-of-the-art feel.</p>
    `,
    date: 'Mar 08, 2026',
    readTime: '5 min',
    tag: 'Design',
    color: '#ec4899',
    depth: 4,
    roi: 'Medium',
    isFeatured: false
  }
];

async function runSeed() {
  console.log('\n--- Starting TALOS.DESIGN Insights Seed Process ---');

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (credPath && fs.existsSync(credPath)) {
    console.log(`🔑 Using Admin SDK with service account: ${credPath}`);
    const admin = await import('firebase-admin');
    const serviceAccount = JSON.parse(fs.readFileSync(credPath, 'utf-8'));

    if (!admin.getApps().length) {
      admin.initializeApp({
        credential: admin.cert(serviceAccount)
      });
    }

    const db = admin.firestore();
    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    for (const article of STATIC_ARTICLES) {
      const docRef = db.collection('insights').doc(article.id);
      batch.set(docRef, {
        ...article,
        slug: article.id,
        publishedAt: now,
        isPublished: true,
        viewCount: 0,
        commentCount: 0,
        author: { name: 'TALOS.DESIGN Engineering Team', role: 'Thought Leadership' },
        createdAt: now,
        updatedAt: now
      }, { merge: true });
      console.log(`  + Staged article [${article.id}]: "${article.title}"`);
    }

    await batch.commit();
    console.log(`✅ Success! Seeded ${STATIC_ARTICLES.length} articles using Admin SDK.\n`);
    process.exit(0);
  }

  console.log('🌐 Using Client Firebase SDK (talos-d74d7)...');
  const { initializeApp } = await import('firebase/app');
  const { getFirestore, doc, writeBatch, Timestamp } = await import('firebase/firestore');
  const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');

  const firebaseConfig = {
    apiKey: "AIzaSyAwa43RYZTxwkHLv5dvsw-iGFuTld9GHQE",
    authDomain: "talos-d74d7.firebaseapp.com",
    projectId: "talos-d74d7",
    storageBucket: "talos-d74d7.firebasestorage.app",
    messagingSenderId: "101652642009",
    appId: "1:101652642009:web:4c8acbf0adadd84362e6c8",
    measurementId: "G-9MNQFWQWVZ"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const email = process.argv[2];
  const password = process.argv[3];

  if (email && password) {
    console.log(`🔑 Authenticating as ${email}...`);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Authentication successful!');
    } catch (authErr) {
      console.error('❌ Authentication failed:', authErr.message);
      process.exit(1);
    }
  }

  const batch = writeBatch(db);
  const now = Timestamp.now();

  for (const article of STATIC_ARTICLES) {
    const docRef = doc(db, 'insights', article.id);
    batch.set(docRef, {
      ...article,
      slug: article.id,
      publishedAt: now,
      isPublished: true,
      viewCount: 0,
      commentCount: 0,
      author: { name: 'TALOS.DESIGN Engineering Team', role: 'Thought Leadership' },
      createdAt: now,
      updatedAt: now
    }, { merge: true });
    console.log(`  + Staged article [${article.id}]: "${article.title}"`);
  }

  try {
    await batch.commit();
    console.log(`✅ Success! Seeded ${STATIC_ARTICLES.length} articles using Client SDK.\n`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Write Failed: PERMISSION_DENIED');
    console.error('Reason: The remote Cloud Firestore Security Rules currently enforce role restrictions on write operations.');
    console.error('\nTo deploy the new firestore.rules to your live Firebase project, run:');
    console.error('  $ npx firebase deploy --only firestore:rules');
    console.error('\nOr download a Service Account Key JSON from Firebase Console and run:');
    console.error('  $ $env:GOOGLE_APPLICATION_CREDENTIALS="C:\\path\\to\\service-account.json"');
    console.error('  $ node scripts/seed-insights.mjs\n');
    process.exit(1);
  }
}

runSeed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
