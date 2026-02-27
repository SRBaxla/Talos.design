# Talos.design

> Digital infrastructure studio — Web Design, AI Chatbots & Automation

🌐 **Live**: [talos.design](https://talos.design)

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 7 |
| **Styling** | Tailwind CSS + Custom CSS |
| **Routing** | React Router v7 |
| **Backend** | Firebase (Auth + Firestore) |
| **Hosting** | Firebase Hosting |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |

## Project Structure

```
src/
├── components/          # Shared UI (Navbar, Footer, Layout)
├── pages/               # Public pages (Home, Services, Projects, etc.)
├── admin/               # Admin panel (protected)
│   ├── components/      # AdminAuth, AdminLayout, ProjectTable, KanbanBoard, TicketList, Modals
│   ├── pages/           # Dashboard, Projects, CaseStudies, Settings, Detail pages
│   ├── store/           # Firestore hooks & CRUD (Projects, CaseStudies, Tickets)
│   └── firebase/        # Firebase config
└── index.css            # Global styles + admin styles
```

## Features

### Public Site
- **Solutions** — Service pages for Web Design, AI Chatbots, Automation
- **Projects** — Portfolio showcase with project detail pages
- **Pricing** — Service packages and pricing tiers
- **Contact** — Get in touch form
- **Studio** — About the team and company story

### Admin Panel (`/admin`)
- 🔐 **Firebase Authentication** — Email/password login
- 📊 **Dashboard** — Stats cards, recent projects & case studies with clickable links
- 📁 **Project Management** — Table view + Kanban board with drag-and-drop
- 📝 **Case Study Management** — Full CRUD with status tracking
- 🎫 **Ticket System** — Per-project & per-case-study tickets with status toggle, priority, assignee, due dates
- 📄 **Detail Pages** — Full project/case study views with embedded tickets
- ⚙️ **Settings** — Data export/import, account management
- 📱 **Responsive** — Works on mobile, tablet, and desktop

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** → Email/Password
3. Enable **Cloud Firestore** → Create database
4. Add a Web app → Copy config to `src/admin/firebase/firebaseConfig.ts`
5. Create an admin user in Authentication → Add user

## Deploy

```bash
npm run build && firebase deploy --only hosting
```

Project Console: https://console.firebase.google.com/project/talos-d74d7/overview
