/**
 * StructuredData.tsx
 *
 * Centralized JSON-LD structured data component for Talos.design.
 *
 * Architecture notes:
 * - This component renders <script type="application/ld+json"> tags directly into the DOM.
 * - It is mounted inside RouteMetadataManager so it responds to route changes on client navigation.
 * - The prerender.mjs script injects these via SSR renderToString, so structured data is
 *   present in the static prerendered HTML without requiring client-side hydration.
 *
 * Rules:
 * - Only use information that is explicitly supported by the codebase / public website.
 * - Do not invent social profiles, ratings, reviews, founding dates, employee counts,
 *   certifications, or revenue.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Business constants -- only use what is explicitly confirmed in the codebase
// ---------------------------------------------------------------------------
const ORG = {
  name: 'Talos.design',
  url: 'https://talos.design',
  logo: 'https://talos.design/og-banner.png',
  email: 'hello@talos.design',
  telephone: '+918090489112',
};

// ---------------------------------------------------------------------------
// Static sitewide schemas (Organization + WebSite)
// These are constant and included on every page.
// ---------------------------------------------------------------------------
const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORG.name,
  url: ORG.url,
  logo: {
    '@type': 'ImageObject',
    url: ORG.logo,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: ORG.telephone,
    email: ORG.email,
    contactType: 'customer support',
    availableLanguage: ['English', 'Hindi'],
  },
  // Social profiles confirmed present in Footer component
  sameAs: [
    'https://x.com/talosDesign',
    'https://www.instagram.com/talos.design/',
    'https://www.linkedin.com/company/talos-design-solutions',
  ],
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: ORG.name,
  url: ORG.url,
  // No SearchAction — the site does not have a server-side search endpoint
};

// ---------------------------------------------------------------------------
// BreadcrumbList definitions for hierarchical subpages
// ---------------------------------------------------------------------------
type BreadcrumbItem = { name: string; item: string };
type BreadcrumbSchema = {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
};

function makeBreadcrumb(items: BreadcrumbItem[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

const BASE = 'https://talos.design';

const BREADCRUMBS: Record<string, BreadcrumbSchema> = {
  '/services/web-design': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Services', item: `${BASE}/services` },
    { name: 'Web Design', item: `${BASE}/services/web-design` },
  ]),
  '/services/chatbots': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Services', item: `${BASE}/services` },
    { name: 'AI Sales & Inquiry Assistants', item: `${BASE}/services/chatbots` },
  ]),
  '/services/automation': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Services', item: `${BASE}/services` },
    { name: 'Workflow Automation', item: `${BASE}/services/automation` },
  ]),
  '/packages/presence': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Packages', item: `${BASE}/packages` },
    { name: 'Digital Business Launch', item: `${BASE}/packages/presence` },
  ]),
  '/packages/automation': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Packages', item: `${BASE}/packages` },
    { name: 'Automated Growth Engine', item: `${BASE}/packages/automation` },
  ]),
  '/packages/custom': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Packages', item: `${BASE}/packages` },
    { name: 'Custom Business Platform', item: `${BASE}/packages/custom` },
  ]),
  '/solutions/hospitality': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Solutions', item: `${BASE}/solutions` },
    { name: 'Hospitality & Booking', item: `${BASE}/solutions/hospitality` },
  ]),
  '/solutions/ecommerce': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Solutions', item: `${BASE}/solutions` },
    { name: 'E-Commerce & Retail', item: `${BASE}/solutions/ecommerce` },
  ]),
  '/solutions/appointments': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Solutions', item: `${BASE}/solutions` },
    { name: 'Appointment & Booking Platform', item: `${BASE}/solutions/appointments` },
  ]),
  '/solutions/medilife': makeBreadcrumb([
    { name: 'Home', item: `${BASE}/` },
    { name: 'Solutions', item: `${BASE}/solutions` },
    { name: 'MediLife Clinic Platform', item: `${BASE}/solutions/medilife` },
  ]),
};

// ---------------------------------------------------------------------------
// Helper: write JSON-LD to a <script> element by ID
// ---------------------------------------------------------------------------
function upsertJsonLd(id: string, data: object): void {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string): void {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function StructuredData() {
  const location = useLocation();

  useEffect(() => {
    // Guard: only run in browser context
    if (typeof window === 'undefined') return;

    // Sitewide schemas -- always present
    upsertJsonLd('ld-organization', ORGANIZATION_SCHEMA);
    upsertJsonLd('ld-website', WEBSITE_SCHEMA);

    // Route-specific breadcrumb schema
    const breadcrumb = BREADCRUMBS[location.pathname];
    if (breadcrumb) {
      upsertJsonLd('ld-breadcrumb', breadcrumb);
    } else {
      removeJsonLd('ld-breadcrumb');
    }
  }, [location.pathname]);

  return null;
}

// ---------------------------------------------------------------------------
// SSG helper: render JSON-LD script tags as HTML strings for prerendering
// ---------------------------------------------------------------------------
export function renderStructuredDataHtml(pathname: string): string {
  const schemas: object[] = [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA];

  const breadcrumb = BREADCRUMBS[pathname];
  if (breadcrumb) {
    schemas.push(breadcrumb);
  }

  return schemas
    .map(
      (schema, i) =>
        `<script type="application/ld+json" id="ld-${i === 0 ? 'organization' : i === 1 ? 'website' : 'breadcrumb'}">${JSON.stringify(schema)}</script>`
    )
    .join('\n  ');
}
