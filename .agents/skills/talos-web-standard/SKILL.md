---
name: talos-web-standard
description: Maintains TALOS.DESIGN as a high-quality, accessible, performant, semantic, search-engine-readable, and AI-readable SaaS agency website. Use whenever modifying public website pages, routing, content, metadata, SEO, accessibility, performance, or frontend architecture.
---

# TALOS.DESIGN Web Standard

TALOS.DESIGN is a custom SaaS/product engineering agency website built with Vite, TypeScript, Tailwind CSS, and Firebase Hosting.

## Core principle

Preserve TALOS.DESIGN's existing visual identity, animations, interactive experiences, and premium design.

Do not sacrifice visual quality for SEO.

Instead, use progressive enhancement:

1. Semantic, crawlable HTML provides the information.
2. CSS provides presentation.
3. JavaScript/WebGL/Three.js provides enhanced interaction and visual experience.

Important business information must never exist only inside canvas, WebGL, images, animations, or client-side visual effects.

## Before modifying architecture

Inspect the existing project first.

Determine:

- Vite configuration
- framework and component structure
- routing
- whether pages are CSR, SSR, SSG, or prerendered
- Firebase Hosting configuration
- current sitemap
- robots.txt
- metadata
- structured data
- canonical URLs
- Open Graph metadata
- existing accessibility implementation
- existing performance optimizations

Do not assume the rendering architecture.

Do not introduce a new framework or major architectural change unless there is a demonstrated need.

## Semantic HTML

Public pages must use meaningful semantic HTML.

Prefer:

- header
- nav
- main
- section
- article
- footer
- headings
- paragraphs
- lists
- buttons
- real anchor links

Avoid using generic div elements when a semantic element is appropriate.

Important content must be present in the rendered HTML and understandable without relying on visual effects.

## SEO and discoverability

Every important public page should have, where appropriate:

- unique title
- useful meta description
- canonical URL
- Open Graph metadata
- Twitter/X metadata
- correct heading hierarchy
- descriptive links
- crawlable internal links
- appropriate structured data
- inclusion in the XML sitemap

Do not generate SEO content merely for search engines.

Content must be useful, specific, accurate, and relevant to TALOS.DESIGN.

## AI readability

Design public content so search engines, AI search systems, LLM-based agents, and other retrieval systems can clearly determine:

- what TALOS.DESIGN is
- what TALOS.DESIGN builds
- who TALOS.DESIGN serves
- what services TALOS.DESIGN provides
- what differentiates TALOS.DESIGN
- what projects TALOS.DESIGN has completed
- how a potential client can contact TALOS.DESIGN

Do not hide essential business meaning inside visual effects.

Use explicit language where appropriate instead of relying entirely on slogans or abstract visual storytelling.

Maintain machine-readable resources such as:

- robots.txt
- sitemap.xml
- llms.txt

when appropriate.

## Structured data

Use Schema.org structured data when it accurately represents the visible page.

Consider appropriate types such as:

- Organization
- WebSite
- Service
- SoftwareApplication
- Article
- BreadcrumbList

Never add misleading, invisible, or fabricated structured data.

## Accessibility

Maintain accessible:

- keyboard navigation
- focus states
- color contrast
- semantic controls
- alt text where appropriate
- form labels
- reduced-motion behavior
- readable text

Interactive visual experiences must have usable alternatives.

## Performance

Protect:

- Core Web Vitals
- page-load performance
- JavaScript bundle size
- image optimization
- font loading
- WebGL performance
- mobile performance

Do not add large dependencies when a lightweight existing solution is sufficient.

## Firebase

Respect the existing Firebase Hosting architecture.

Do not modify Firebase configuration blindly.

Before changing hosting rewrites, redirects, headers, or deployment configuration, inspect the current configuration and understand its purpose.

Ensure machine-readable files such as robots.txt, sitemap.xml, and llms.txt remain directly accessible.

## Change discipline

Before making significant changes:

1. Inspect the existing implementation.
2. Explain the problem.
3. Identify the smallest appropriate solution.
4. Preserve existing functionality.
5. Implement the change.
6. Run the relevant build/tests/checks.
7. Verify the resulting behavior.

Never rewrite working sections simply because another implementation is more fashionable.

## Design principle

TALOS.DESIGN should be:

Human-first in presentation.

Machine-readable in structure.

Accessible by default.

Fast by design.

Technically credible.

Visually distinctive.