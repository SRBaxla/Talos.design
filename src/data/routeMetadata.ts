export interface RouteMetadata {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export const SITE_CONFIG = {
  baseUrl: 'https://talos.design',
  siteName: 'Talos.design',
  defaultTitle: 'Talos.design | Digital Systems & Automation Studio',
  defaultDescription:
    'Talos.design is a digital engineering studio building custom websites, AI sales & inquiry assistants, and workflow automation for growing businesses.',
  defaultOgDescription:
    'Digital engineering studio building custom websites, AI sales & inquiry assistants, and workflow automation for growing businesses.',
  defaultOgImage: 'https://talos.design/og-banner.png',
  defaultTwitterCard: 'summary_large_image',
};

// Centralized registry for all 20 public routes -- each entry has unique, page-accurate metadata.
export const PUBLIC_ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': {
    path: '/',
    title: 'Talos.design | Digital Systems & Automation Studio',
    description:
      'Talos.design is a digital engineering studio building custom websites, AI sales & inquiry assistants, and workflow automation for growing businesses.',
    canonical: `${SITE_CONFIG.baseUrl}/`,
    ogTitle: 'Talos.design | Digital Systems & Automation Studio',
    ogDescription:
      'Digital engineering studio building custom websites, AI sales & inquiry assistants, and workflow automation for growing businesses.',
    ogUrl: `${SITE_CONFIG.baseUrl}/`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Talos.design | Digital Systems & Automation Studio',
    twitterDescription:
      'Digital engineering studio building custom websites, AI sales & inquiry assistants, and workflow automation for growing businesses.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },

  // -- SERVICES --
  '/services': {
    path: '/services',
    title: 'Services | Talos.design - Web Design, AI Assistants & Automation',
    description:
      'Talos.design offers three core services: high-converting web design, 24/7 AI sales assistants, and workflow automation. Explore what we build and how each service drives measurable business growth.',
    canonical: `${SITE_CONFIG.baseUrl}/services`,
    ogTitle: 'Services | Talos.design - Web Design, AI & Automation',
    ogDescription:
      'High-converting websites, 24/7 AI sales assistants, and workflow automation -- three focused services engineered to grow your business.',
    ogUrl: `${SITE_CONFIG.baseUrl}/services`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Services | Talos.design - Web Design, AI & Automation',
    twitterDescription:
      'High-converting websites, 24/7 AI sales assistants, and workflow automation -- three focused services engineered to grow your business.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/services/web-design': {
    path: '/services/web-design',
    title: 'Web Design Service | Talos.design - High-Converting Websites',
    description:
      'Talos.design builds mobile-first, sub-second loading websites designed to convert visitors into leads. Custom design, SEO-optimized, with built-in WhatsApp lead capture and content management.',
    canonical: `${SITE_CONFIG.baseUrl}/services/web-design`,
    ogTitle: 'Web Design Service | High-Converting Websites by Talos.design',
    ogDescription:
      'Mobile-first, sub-second websites with SEO, WhatsApp lead capture, and a built-in CMS. Custom web design engineered for measurable business growth.',
    ogUrl: `${SITE_CONFIG.baseUrl}/services/web-design`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Web Design Service | High-Converting Websites by Talos.design',
    twitterDescription:
      'Mobile-first, sub-second websites with SEO, WhatsApp lead capture, and a built-in CMS. Custom web design engineered for measurable business growth.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/services/chatbots': {
    path: '/services/chatbots',
    title: 'AI Sales & Inquiry Assistants | Talos.design - Website & WhatsApp Lead Capture',
    description:
      'Deploy an AI-powered assistant that answers routine customer questions, captures inquiries, qualifies leads, and routes conversations to your team 24/7 on web and WhatsApp.',
    canonical: `${SITE_CONFIG.baseUrl}/services/chatbots`,
    ogTitle: 'AI Sales & Inquiry Assistants | Lead Capture & Support by Talos.design',
    ogDescription:
      'Custom-configured AI assistants that handle routine inquiries, qualify leads, and connect to WhatsApp and your CRM. Never miss a customer conversation.',
    ogUrl: `${SITE_CONFIG.baseUrl}/services/chatbots`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'AI Sales & Inquiry Assistants | Lead Capture & Support by Talos.design',
    twitterDescription:
      'Custom-configured AI assistants that handle routine inquiries, qualify leads, and connect to WhatsApp and your CRM. Never miss a customer conversation.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/services/automation': {
    path: '/services/automation',
    title: 'Workflow Automation | Talos.design - Eliminate Manual Operations',
    description:
      'Talos.design engineers workflow automation systems that connect payment gateways, CRMs, invoicing, and communication channels -- eliminating repetitive admin work and operational bottlenecks.',
    canonical: `${SITE_CONFIG.baseUrl}/services/automation`,
    ogTitle: 'Workflow Automation | Eliminate Manual Operations by Talos.design',
    ogDescription:
      'Operational logic pipelines that automate invoicing, CRM sync, payment flows, and communication -- so your team focuses on growth, not admin.',
    ogUrl: `${SITE_CONFIG.baseUrl}/services/automation`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Workflow Automation | Eliminate Manual Operations by Talos.design',
    twitterDescription:
      'Operational logic pipelines that automate invoicing, CRM sync, payment flows, and communication -- so your team focuses on growth, not admin.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },

  // -- PACKAGES --
  '/packages': {
    path: '/packages',
    title: 'Packages | Talos.design - Productized Digital Growth Protocols',
    description:
      'Talos.design offers three productized engagement protocols: Digital Business Launch, Automated Growth Engine, and Custom Business Platform. Transparent scope, fixed pricing, phased delivery.',
    canonical: `${SITE_CONFIG.baseUrl}/packages`,
    ogTitle: 'Packages | Productized Digital Growth Protocols by Talos.design',
    ogDescription:
      'Three productized packages -- Digital Presence, Automated Growth Engine, and Custom Platform -- with fixed pricing and phased milestone delivery.',
    ogUrl: `${SITE_CONFIG.baseUrl}/packages`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Packages | Productized Digital Growth Protocols by Talos.design',
    twitterDescription:
      'Three productized packages -- Digital Presence, Automated Growth Engine, and Custom Platform -- with fixed pricing and phased milestone delivery.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/packages/presence': {
    path: '/packages/presence',
    title: 'Package 01: Digital Business Launch | Talos.design',
    description:
      'Establish your online presence with a custom high-converting website, brand identity system, SEO setup, WhatsApp lead capture, analytics dashboard, and domain/hosting. Fixed price, delivered in 2-4 weeks.',
    canonical: `${SITE_CONFIG.baseUrl}/packages/presence`,
    ogTitle: 'Package 01: Digital Business Launch | Talos.design',
    ogDescription:
      'Custom website, brand identity, SEO, WhatsApp lead capture, and analytics -- everything you need to launch and grow your online presence. Fixed price, 2-4 week delivery.',
    ogUrl: `${SITE_CONFIG.baseUrl}/packages/presence`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Package 01: Digital Business Launch | Talos.design',
    twitterDescription:
      'Custom website, brand identity, SEO, WhatsApp lead capture, and analytics -- everything you need to launch and grow your online presence.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/packages/automation': {
    path: '/packages/automation',
    title: 'Package 02: Automated Growth Engine | Talos.design',
    description:
      'The complete automation stack: 24/7 AI WhatsApp sales assistant, automated lead qualification, CRM synchronization, invoice generation, and real-time business reporting. Zero extra staff required.',
    canonical: `${SITE_CONFIG.baseUrl}/packages/automation`,
    ogTitle: 'Package 02: Automated Growth Engine | Talos.design',
    ogDescription:
      '24/7 AI WhatsApp assistant, automated CRM sync, invoice generation, and real-time reporting -- the complete growth automation stack.',
    ogUrl: `${SITE_CONFIG.baseUrl}/packages/automation`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Package 02: Automated Growth Engine | Talos.design',
    twitterDescription:
      '24/7 AI WhatsApp assistant, automated CRM sync, invoice generation, and real-time reporting -- the complete growth automation stack.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/packages/custom': {
    path: '/packages/custom',
    title: 'Package 03: Custom Business Platform | Talos.design',
    description:
      'Custom software architecture, bespoke portals, internal dashboards, and specialized operational workflows built for your business. Tailored scope, fixed pricing, and dedicated support.',
    canonical: `${SITE_CONFIG.baseUrl}/packages/custom`,
    ogTitle: 'Package 03: Custom Business Platform | Talos.design',
    ogDescription:
      'Custom software architecture, bespoke portals, and specialized operational workflows built for your business. Tailored scope, fixed pricing, dedicated support.',
    ogUrl: `${SITE_CONFIG.baseUrl}/packages/custom`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Package 03: Custom Business Platform | Talos.design',
    twitterDescription:
      'Custom software architecture, bespoke portals, and specialized operational workflows built for your business. Tailored scope, fixed pricing, dedicated support.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },

  // -- SOLUTIONS --
  '/solutions': {
    path: '/solutions',
    title: 'Industry Solutions | Talos.design - Pre-Built Vertical Software',
    description:
      'Talos.design offers pre-built, deployable software platforms for hospitality, e-commerce, appointment businesses, and diagnostic clinics. Industry-specific solutions ready to customize and deploy.',
    canonical: `${SITE_CONFIG.baseUrl}/solutions`,
    ogTitle: 'Industry Solutions | Pre-Built Vertical Software by Talos.design',
    ogDescription:
      'Deployable software platforms purpose-built for hospitality, e-commerce, appointment businesses, and diagnostic clinics. Customize and deploy rapidly.',
    ogUrl: `${SITE_CONFIG.baseUrl}/solutions`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Industry Solutions | Pre-Built Vertical Software by Talos.design',
    twitterDescription:
      'Deployable software platforms purpose-built for hospitality, e-commerce, appointment businesses, and diagnostic clinics. Customize and deploy rapidly.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/solutions/hospitality': {
    path: '/solutions/hospitality',
    title: 'Hospitality & Booking Solution | Talos.design',
    description:
      'A deployable hotel and restaurant software suite: commission-free direct booking engine, room galleries, QR digital menus, WhatsApp reservations, and real-time staff availability dashboard.',
    canonical: `${SITE_CONFIG.baseUrl}/solutions/hospitality`,
    ogTitle: 'Hospitality & Booking Solution | Talos.design',
    ogDescription:
      'Commission-free direct booking, QR digital menus, WhatsApp reservations, and availability dashboards -- pre-built hospitality software ready to deploy.',
    ogUrl: `${SITE_CONFIG.baseUrl}/solutions/hospitality`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Hospitality & Booking Solution | Talos.design',
    twitterDescription:
      'Commission-free direct booking, QR digital menus, WhatsApp reservations, and availability dashboards -- pre-built hospitality software ready to deploy.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/solutions/ecommerce': {
    path: '/solutions/ecommerce',
    title: 'E-Commerce & Retail Solution | Talos.design',
    description:
      'A deployable e-commerce platform: sub-second storefronts, real-time inventory sync, multi-currency payment integration, and automated marketing and cart recovery flows.',
    canonical: `${SITE_CONFIG.baseUrl}/solutions/ecommerce`,
    ogTitle: 'E-Commerce & Retail Solution | Talos.design',
    ogDescription:
      'Sub-second storefronts, real-time inventory sync, multi-currency payments, and automated cart recovery -- pre-built e-commerce software ready to deploy.',
    ogUrl: `${SITE_CONFIG.baseUrl}/solutions/ecommerce`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'E-Commerce & Retail Solution | Talos.design',
    twitterDescription:
      'Sub-second storefronts, real-time inventory sync, multi-currency payments, and automated cart recovery -- pre-built e-commerce software ready to deploy.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/solutions/appointments': {
    path: '/solutions/appointments',
    title: 'Appointment & Booking Platform | Talos.design',
    description:
      'A deployable appointment platform for clinics, salons, consultancies, and slot-driven businesses: 24/7 automated scheduling, client portals, AI inquiry assistant, and automated reminders.',
    canonical: `${SITE_CONFIG.baseUrl}/solutions/appointments`,
    ogTitle: 'Appointment & Booking Platform | Talos.design',
    ogDescription:
      '24/7 automated scheduling, client portals, AI inquiry assistant, and reminders -- pre-built appointment software for clinics, salons, and consultancies.',
    ogUrl: `${SITE_CONFIG.baseUrl}/solutions/appointments`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Appointment & Booking Platform | Talos.design',
    twitterDescription:
      '24/7 automated scheduling, client portals, AI inquiry assistant, and reminders -- pre-built appointment software for clinics, salons, and consultancies.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
  '/solutions/medilife': {
    path: '/solutions/medilife',
    title: 'MediLife Clinic Platform | Talos.design - Diagnostic Lab Software',
    description:
      'MediLife is a deployable diagnostic clinic software platform: branded online test booking, pathologist peer-review verification, and one-click WhatsApp PDF report dispatch. Available for clinic deployment.',
    canonical: `${SITE_CONFIG.baseUrl}/solutions/medilife`,
    ogTitle: 'MediLife Clinic Platform | Diagnostic Lab Software by Talos.design',
    ogDescription:
      'Deployable diagnostic clinic software with branded booking, pathologist peer-review, and one-click WhatsApp PDF report dispatch. Ready for clinic deployment.',
    ogUrl: `${SITE_CONFIG.baseUrl}/solutions/medilife`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'MediLife Clinic Platform | Diagnostic Lab Software by Talos.design',
    twitterDescription:
      'Deployable diagnostic clinic software with branded booking, pathologist peer-review, and one-click WhatsApp PDF report dispatch. Ready for clinic deployment.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },

  // -- EXPERTISE --
  '/expertise': {
    path: '/expertise',
    title: 'Engineering Expertise | Talos.design - AI, Systems & Frontend',
    description:
      'Explore Talos.design technical capabilities: conversational AI assistants, backend systems and infrastructure engineering, and visual and frontend engineering.',
    canonical: `${SITE_CONFIG.baseUrl}/expertise`,
    ogTitle: 'Engineering Expertise | AI, Systems & Frontend by Talos.design',
    ogDescription:
      'Three technical disciplines: conversational AI assistants, backend systems and infrastructure engineering, and visual and frontend engineering.',
    ogUrl: `${SITE_CONFIG.baseUrl}/expertise`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Engineering Expertise | AI, Systems & Frontend by Talos.design',
    twitterDescription:
      'Three technical disciplines: conversational AI assistants, backend systems and infrastructure engineering, and visual and frontend engineering.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },

  // -- INSIGHTS --
  '/insights': {
    path: '/insights',
    title: 'Engineering Insights | Talos.design - AI, Automation & Design',
    description:
      'Technical articles and engineering perspectives from Talos.design on conversational AI, workflow automation architecture, and modern UX paradigms.',
    canonical: `${SITE_CONFIG.baseUrl}/insights`,
    ogTitle: 'Engineering Insights | AI, Automation & Design by Talos.design',
    ogDescription:
      'Technical articles on conversational AI, workflow automation architecture, and modern UX -- engineering perspectives from Talos.design.',
    ogUrl: `${SITE_CONFIG.baseUrl}/insights`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Engineering Insights | AI, Automation & Design by Talos.design',
    twitterDescription:
      'Technical articles on conversational AI, workflow automation architecture, and modern UX -- engineering perspectives from Talos.design.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },

  // -- ABOUT --
  '/about': {
    path: '/about',
    title: 'About Talos.design | Remote-First Digital Engineering Studio',
    description:
      'Talos.design is a remote-first digital engineering studio based in Jhansi, India, serving clients worldwide. We build websites, AI systems, and automation with speed, precision, and transparency.',
    canonical: `${SITE_CONFIG.baseUrl}/about`,
    ogTitle: 'About Talos.design | Remote-First Digital Engineering Studio',
    ogDescription:
      'Remote-first engineering studio based in India. We build websites, AI systems, and automation for clients worldwide -- fast, precise, and transparent.',
    ogUrl: `${SITE_CONFIG.baseUrl}/about`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'About Talos.design | Remote-First Digital Engineering Studio',
    twitterDescription:
      'Remote-first engineering studio based in India. We build websites, AI systems, and automation for clients worldwide -- fast, precise, and transparent.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },

  // -- CONTACT --
  '/contact': {
    path: '/contact',
    title: 'Contact Talos.design | Start a Free Discovery Call',
    description:
      'Get in touch with Talos.design. Tell us about your project and we will get back with a clear plan. Free 30-minute discovery call, no sales pitch, fixed-price proposal included.',
    canonical: `${SITE_CONFIG.baseUrl}/contact`,
    ogTitle: 'Contact Talos.design | Start a Free Discovery Call',
    ogDescription:
      'Tell us about your project. We will respond with a clear plan -- free 30-minute discovery call, fixed-price proposal, no surprises.',
    ogUrl: `${SITE_CONFIG.baseUrl}/contact`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Contact Talos.design | Start a Free Discovery Call',
    twitterDescription:
      'Tell us about your project. We will respond with a clear plan -- free 30-minute discovery call, fixed-price proposal, no surprises.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },

  // -- CAREERS --
  '/careers': {
    path: '/careers',
    title: 'Careers | Talos.design - Join the Studio',
    description:
      'Talos.design is not actively hiring but always looking for exceptional talent. Submit your profile to be considered for future roles in engineering, design, and AI development.',
    canonical: `${SITE_CONFIG.baseUrl}/careers`,
    ogTitle: 'Careers | Join Talos.design - Digital Engineering Studio',
    ogDescription:
      'No active openings right now, but we are always looking for exceptional talent. Get on our radar for first-priority consideration when roles open.',
    ogUrl: `${SITE_CONFIG.baseUrl}/careers`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Careers | Join Talos.design - Digital Engineering Studio',
    twitterDescription:
      'No active openings right now, but we are always looking for exceptional talent. Get on our radar for first-priority consideration when roles open.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },

  // -- LEGAL --
  '/legal': {
    path: '/legal',
    title: 'Legal & Governance | Talos.design - Terms, Privacy & Security',
    description:
      'Talos.design legal and governance documents: Terms of Service, Privacy Policy, and Security and Compliance information for clients and visitors.',
    canonical: `${SITE_CONFIG.baseUrl}/legal`,
    ogTitle: 'Legal & Governance | Talos.design',
    ogDescription:
      'Terms of Service, Privacy Policy, and Security and Compliance documents for Talos.design clients and visitors.',
    ogUrl: `${SITE_CONFIG.baseUrl}/legal`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: 'Legal & Governance | Talos.design',
    twitterDescription:
      'Terms of Service, Privacy Policy, and Security and Compliance documents for Talos.design clients and visitors.',
    twitterImage: SITE_CONFIG.defaultOgImage,
  },
};

export function getRouteMetadata(pathname: string): RouteMetadata {
  const normalizedPath = pathname === '' ? '/' : pathname.replace(/\/+$/, '') || '/';
  if (PUBLIC_ROUTE_METADATA[normalizedPath]) {
    return PUBLIC_ROUTE_METADATA[normalizedPath];
  }

  // Fallback for dynamic/unregistered routes
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return {
    path: cleanPath,
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    canonical: `${SITE_CONFIG.baseUrl}${cleanPath}`,
    ogTitle: SITE_CONFIG.defaultTitle,
    ogDescription: SITE_CONFIG.defaultOgDescription,
    ogUrl: `${SITE_CONFIG.baseUrl}${cleanPath}`,
    ogImage: SITE_CONFIG.defaultOgImage,
    twitterCard: SITE_CONFIG.defaultTwitterCard,
    twitterTitle: SITE_CONFIG.defaultTitle,
    twitterDescription: SITE_CONFIG.defaultOgDescription,
    twitterImage: SITE_CONFIG.defaultOgImage,
  };
}