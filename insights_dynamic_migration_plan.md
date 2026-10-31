# Codebase Tech Stack Audit & Dynamic Insights Architecture Plan

**Project:** TALOS.DESIGN  
**Document Name:** `insights_dynamic_migration_plan.md`  
**Execution Mode:** Read-Only Audit & Architectural Strategy  
**Date:** August 21, 2026  

---

## 1. Executive Summary of Detected Tech Stack & Existing Dependencies

Following a read-only technical audit of `package.json`, build configuration files (`vite.config.ts`, `scripts/prerender.mjs`), routing definitions (`src/App.tsx`), and existing Firebase integration (`src/admin/firebase/firebaseConfig.ts`), the underlying architecture of TALOS.DESIGN is documented as follows:

### A. Core Frontend Architecture
- **Framework & Runtime:** React 19.2.0 (`react`, `react-dom`), TypeScript 5.9.3 (`~5.9.3`), Vite 7.3.1 (`vite`).
- **Client & SSR Routing:** React Router DOM v7.13.0 (`react-router-dom`), utilizing `BrowserRouter` for client routing and `StaticRouter` for SSR/SSG rendering (`src/entry-server.tsx`).
- **Styling & UI System:** Vanilla CSS custom property design system augmented by Tailwind CSS 3.4.19 (`tailwindcss`), PostCSS 8.5.6 (`postcss`), Autoprefixer 10.4.24 (`autoprefixer`), Framer Motion 12.34.3 (`framer-motion`), and Lucide React 0.575.0 (`lucide-react`).
- **3D & Animation Engines:** Three.js 0.183.2 (`three`), React Three Fiber 9.5.0 (`@react-three/fiber`), React Three Drei 10.7.7 (`@react-three/drei`), Theatre.js 0.7.2 (`@theatre/core`, `@theatre/studio`).

### B. BaaS & Backend Connectivity
- **Backend-as-a-Service:** Firebase Web SDK v12.9.0 (`firebase`).
- **Active Firebase Modules:**
  - **Firebase Auth (`firebase/auth`):** Currently utilized for admin and client portal authentication (`src/admin/components/AdminAuth.tsx`, `src/portal/PortalLogin.tsx`).
  - **Cloud Firestore (`firebase/firestore`):** Utilized for managing inquiries, projects, case studies, and lead captures (`src/admin/pages/AdminLeads.tsx`).
  - **Cloud Functions (`firebase/functions`):** Utilized for backend serverless triggers and administrative callables.
- **Configured Firebase App ID:** `talos-d74d7` (`talos-d74d7.firebaseapp.com`).
- **Communication & Email Services:** EmailJS Web SDK (`@emailjs/browser` v4.4.1).

### C. Build & Static Site Generation (SSG) Pipeline
- **Production Build Sequence (`npm run build`):**
  1. `tsc -b` (TypeScript type checking across build targets).
  2. `vite build` (Production client bundle compilation to `dist/`).
  3. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` (SSR bundle compilation to `dist-ssr/`).
  4. `node scripts/prerender.mjs` (Node.js static pre-rendering script generating static `index.html` files across 20 public routes).

---

## 2. Database Collection Schema Proposals

To transition `/insights` from static array constants (`export const ARTICLES = [...]`) into a dynamic, real-time CMS with reader engagement capabilities, we propose three Cloud Firestore collection schemas:

### A. Collection: `insights` (Articles & Technical Briefings)
```typescript
interface InsightArticleDocument {
  id: string;                      // Document ID (slug matching route e.g. "autonomous-crm")
  title: string;                    // Article Title (e.g., "The Future of Autonomous CRM Agents")
  slug: string;                     // URL Slug (e.g., "autonomous-crm")
  excerpt: string;                  // Short abstract for grid cards and meta description
  content: string;                  // HTML/Markdown content body
  date: string;                     // Formatted date string (e.g., "Mar 15, 2026")
  publishedAt: Timestamp;           // Firestore Timestamp for chronological query sorting
  readTime: string;                 // Estimated read time (e.g., "8 min read")
  tag: 'AI' | 'Engineering' | 'Design' | string; // Topic classification category
  color: string;                    // Brand accent color (e.g., "var(--accent-orange)", "#a855f7")
  depth: number;                    // Technical depth score (Integer 1 to 10)
  roi: 'Critical' | 'High' | 'Medium' | 'Standard'; // Business impact metric
  isPublished: boolean;             // Draft / Published state toggle
  isFeatured: boolean;              // Spotlight card flag (hero section feature)
  viewCount: number;                // Aggregate page view counter
  commentCount: number;             // Aggregate approved comment counter
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  createdAt: Timestamp;             // Record creation timestamp
  updatedAt: Timestamp;             // Record last modified timestamp
}
```

### B. Collection: `insights_comments` (Reader Comments & Lead Generation)
```typescript
interface InsightCommentDocument {
  id: string;                      // Auto-generated Firestore Document ID
  articleId: string;               // Reference to `insights` document ID or slug
  authorName: string;              // Commenter's display name
  authorEmail: string;             // Commenter's email address (Lead Capture)
  commentText: string;             // Body text of the comment
  status: 'pending' | 'approved' | 'flagged' | 'rejected'; // Moderation Queue State
  ipHash?: string;                 // Anonymized hash for anti-spam rate limiting
  isLeadConsent: boolean;          // Checkbox opt-in for technical newsletter updates
  createdAt: Timestamp;            // Submission timestamp
  moderatedAt?: Timestamp;         // Moderation timestamp
  moderatedBy?: string;            // User ID of the admin who approved/rejected
}
```

### C. Collection: `subscribers` & Aggregated System Counters
```typescript
// Path: subscribers/{subscriberId}
interface SubscriberDocument {
  id: string;                      // Auto-generated ID or email hash
  email: string;                   // Subscriber email address
  source: string;                  // Source page (e.g., "/insights#newsletter", "/insights/autonomous-crm")
  status: 'active' | 'unsubscribed'; // Subscription state
  subscribedAt: Timestamp;         // Registration timestamp
}

// Path: system_stats/insights_summary
interface SystemStatsDocument {
  totalSubscribers: number;        // Aggregate count of active newsletter subscribers
  totalInsightsViews: number;      // Aggregate view counter across all articles
  totalApprovedComments: number;   // Aggregate count of published comments
  lastUpdated: Timestamp;          // Timestamp of last atomic increment
}
```

---

## 3. Session & Authentication Architecture Recommendation

### A. Role-Based Access Control (RBAC) Extension
The existing repository already has a functional Firebase Auth layer (`src/admin/firebase/firebaseConfig.ts`). We recommend extending the existing auth architecture with two explicit role tiers:
1. **`Admin` (Full Administrative Access):** Complete CRUD rights across all collections (`insights`, `insights_comments`, `subscribers`, `leads`, `projects`, `settings`).
2. **`Editor` (Content Manager Access):** Create, edit, and publish `insights` articles; moderate `insights_comments`; view `subscribers`. Restricted from global settings or financial invoices.

Role verification will be enforced via **Firebase Auth Custom Claims** (`admin: true`, `editor: true`) or a fast lookup against `users/{uid}` in Firestore.

### B. Live Inline "Edit Mode" Session Mechanism
To enable seamless inline editing directly on the live `/insights` public route without disrupting standard visitors:
1. **Active Session Observer (`useAuthSession`):**
   - Public route `/insights` listens to `onAuthStateChanged(auth, user)`.
   - If an authenticated user with `admin` or `editor` role is detected, an **"Editor Control Bar"** renders fixed at the bottom of the screen.
2. **Inline Edit Mode State (`isInlineEditActive`):**
   - Activating "Edit Mode" converts textual fields (Title, Excerpt, Content sections) into live editable inputs (`contentEditable` or rich Markdown textareas).
   - Changes are saved directly to Firestore via `updateDoc(doc(db, 'insights', articleId), ...)` with real-time UI feedback.
3. **Visitor Protection:**
   - Non-authenticated visitors receive zero administrative JS overhead and see only rendered HTML/SSG content.

---

## 4. Step-by-Step Phased Rollout Plan

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PHASED ROLLOUT ROADMAP                             │
├─────────────────────────────────────────────────────────────────────────┤
│ [Phase 1] Backend & Firestore Setup                                      │
│  ├── Create Firestore Security Rules & Indexes                          │
│  └── Execute One-Time Migration Script (Static ARTICLES → Firestore)    │
├─────────────────────────────────────────────────────────────────────────┤
│ [Phase 2] Admin Portal CMS Dashboard                                    │
│  ├── Build `/admin/insights` Article Management Dashboard               │
│  └── Build `/admin/insights/editor` Article Creation & Editor Form       │
├─────────────────────────────────────────────────────────────────────────┤
│ [Phase 3] Dynamic Public Route Hydration                                │
│  ├── Upgrade `src/pages/Insights.tsx` with Hybrid Data Fetching          │
│  └── Maintain Static Fallback Array for 100/100 SSG Pre-Rendering        │
├─────────────────────────────────────────────────────────────────────────┤
│ [Phase 4] Comments, Lead Pipeline & Real-Time Counters                  │
│  ├── Deploy `insights_comments` collection & moderation UI in `/admin`  │
│  └── Implement atomic Firestore subscriber counter (`increment(1)`)      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Detailed Phase Breakdown:

#### **Phase 1: Backend & Firestore Setup (Zero Downtime)**
- Configure Firestore Security Rules to permit public read access for published `insights` documents while restricting write operations to authenticated `admin`/`editor` UIDs.
- Run a Node.js seed script (`scripts/seed-insights.mjs`) to upload existing static `ARTICLES` into the Firestore `insights` collection.

#### **Phase 2: Admin Portal CMS Dashboard (`/admin/insights`)**
- Register new routes inside `src/App.tsx` under the existing `/admin` layout:
  - `/admin/insights` — Article inventory table (Title, Tag, Status, Views, Comments, Actions).
  - `/admin/insights/editor` & `/admin/insights/editor/:id` — Rich article editor with preview.
  - `/admin/comments` — Comment moderation queue (Approve / Reject / Flag as Spam).

#### **Phase 3: Public Page Dynamic Integration (`/insights`)**
- Refactor `src/pages/Insights.tsx` to utilize a **Hybrid SSG + Client Hydration strategy**:
  - Initial HTML render uses pre-rendered SSG static data.
  - Upon client mount (`useEffect`), query Firestore `insights` for newly published articles or updated view counts.
  - If network is offline or Firebase is unreachable, fallback seamlessly to static baseline data.

#### **Phase 4: Reader Comments, Lead Capture & Real-Time Counter Pipeline**
- Add comment form on the article detail view in `Insights.tsx` capturing user comments and lead emails (`isLeadConsent`).
- Replace hardcoded "1,200+ DECISION MAKERS ENROLLED" text with a live Firestore listener (`onSnapshot`) listening to `system_stats/insights_summary.totalSubscribers`.
- Use atomic `FieldValue.increment(1)` for subscriber signups to guarantee zero race conditions under concurrent submissions.

---

## 5. Risk Assessment & Compatibility Checks

| Potential Risk | Severity | Technical Impact | Mitigation & Prevention Strategy |
| :--- | :---: | :--- | :--- |
| **SSG Build Breakdown (`prerender.mjs`)** | **High** | Node.js SSR bundle fails if Firebase client SDK evaluates `window` or `localStorage` during build time. | Wrap Firebase client initialization inside conditional environment checks (`typeof window !== 'undefined'`). Ensure `scripts/prerender.mjs` uses static fallback data during SSR execution. |
| **Public Lead Data Exposure** | **Critical** | Unprotected comment collections could expose reader email addresses to public API scraping. | Enforce strict Firestore Security Rules: `insights_comments` public `read` access must ONLY return documents where `status == 'approved'`, explicitly excluding the `authorEmail` field from public queries via projection or Functions. |
| **Firebase Free Tier Quota Exhaustion** | **Medium** | High visitor traffic triggering un-cached Firestore reads on every page load could exceed free tier limits (50k reads/day). | Implement local memory caching (`sessionStorage` / SWR cache) with a 5-minute TTL for public articles, and rely on SSG pre-rendered HTML for search engine crawlers. |
| **SEO & Canonical Route Shift** | **Low** | Dynamic routes changing article URLs could impact Google Search indexation. | Maintain existing slug patterns (`/insights?id=autonomous-crm` or `/insights/:slug`) and preserve canonical URL generators in `scripts/prerender.mjs`. |

---

## Summary & Next Steps

This document serves as the complete, read-only architectural specification for transitioning TALOS.DESIGN's `/insights` route into a dynamic CMS with an admin portal, inline editor, comment moderation pipeline, and real-time subscriber counters.

**Zero code modifications have been made during this audit phase.** Proceeding to implementation will follow the approved phases outlined above.
