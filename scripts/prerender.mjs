import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distSsrDir = path.resolve(rootDir, 'dist-ssr');

const PUBLIC_ROUTES = [
  '/',
  '/expertise',
  '/insights',
  '/services',
  '/about',
  '/contact',
  '/careers',
  '/packages',
  '/packages/presence',
  '/packages/automation',
  '/packages/custom',
  '/solutions',
  '/solutions/medilife',
  '/services/web-design',
  '/services/chatbots',
  '/services/automation',
  '/solutions/hospitality',
  '/solutions/ecommerce',
  '/solutions/appointments',
  '/legal',
];

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectMetadata(html, meta) {
  let updated = html;

  // 1. Replace <title>
  updated = updated.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(meta.title)}</title>`);

  // 2. Replace meta description
  updated = updated.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/is,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );

  // 3. Replace canonical link
  updated = updated.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/is,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`
  );

  // 4. Replace Open Graph tags
  updated = updated.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/is,
    `<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`
  );
  updated = updated.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/is,
    `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`
  );
  updated = updated.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/is,
    `<meta property="og:url" content="${escapeHtml(meta.ogUrl)}" />`
  );
  updated = updated.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/is,
    `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`
  );

  // 5. Replace Twitter tags
  updated = updated.replace(
    /<meta\s+property="twitter:title"\s+content=".*?"\s*\/?>/is,
    `<meta property="twitter:title" content="${escapeHtml(meta.twitterTitle)}" />`
  );
  updated = updated.replace(
    /<meta\s+property="twitter:description"\s+content=".*?"\s*\/?>/is,
    `<meta property="twitter:description" content="${escapeHtml(meta.twitterDescription)}" />`
  );
  updated = updated.replace(
    /<meta\s+property="twitter:url"\s+content=".*?"\s*\/?>/is,
    `<meta property="twitter:url" content="${escapeHtml(meta.ogUrl)}" />`
  );
  updated = updated.replace(
    /<meta\s+property="twitter:image"\s+content=".*?"\s*\/?>/is,
    `<meta property="twitter:image" content="${escapeHtml(meta.twitterImage)}" />`
  );
  updated = updated.replace(
    /<meta\s+property="twitter:card"\s+content=".*?"\s*\/?>/is,
    `<meta property="twitter:card" content="${escapeHtml(meta.twitterCard)}" />`
  );

  return updated;
}

/**
 * injectStructuredData
 * Replaces the placeholder JSON-LD <script> tags in the template with
 * the actual Organization, WebSite, and optional BreadcrumbList schemas.
 */
function injectStructuredData(html, route, renderStructuredDataHtml) {
  if (typeof renderStructuredDataHtml !== 'function') return html;

  // Remove the empty placeholder script tags first
  let updated = html
    .replace(/<script type="application\/ld\+json" id="ld-organization">\{\}<\/script>\n?\s*/i, '')
    .replace(/<script type="application\/ld\+json" id="ld-website">\{\}<\/script>/i, '');

  // Inject the real schemas before </head>
  const structuredDataHtml = renderStructuredDataHtml(route);
  updated = updated.replace('</head>', `  ${structuredDataHtml}\n</head>`);

  return updated;
}

async function prerender() {
  console.log('\n--- Starting Static Prerendering (SSG) ---');

  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Client build template not found at ${templatePath}. Run 'vite build' first.`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Dynamic import of the server entry bundle
  const serverEntryPath = path.join(distSsrDir, 'entry-server.js');
  const serverEntryUrl = pathToFileURL(serverEntryPath).href;
  const { render, getRouteMetadata, renderStructuredDataHtml } = await import(serverEntryUrl);

  let successCount = 0;

  for (const route of PUBLIC_ROUTES) {
    try {
      const { html } = render(route);
      const meta = getRouteMetadata(route);
      
      // Inject metadata into <head>
      const pageWithMeta = injectMetadata(template, meta);

      // Inject JSON-LD structured data into placeholder script tags
      const pageWithStructuredData = injectStructuredData(pageWithMeta, route, renderStructuredDataHtml);

      // Inject rendered HTML into #root container
      const renderedPage = pageWithStructuredData.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      );

      let outputPath;
      if (route === '/') {
        outputPath = path.join(distDir, 'index.html');
      } else {
        const routeDir = path.join(distDir, ...route.split('/').filter(Boolean));
        fs.mkdirSync(routeDir, { recursive: true });
        outputPath = path.join(routeDir, 'index.html');
      }

      fs.writeFileSync(outputPath, renderedPage, 'utf-8');
      console.log(`✓ Prerendered: ${route} -> ${path.relative(rootDir, outputPath)} (${Buffer.byteLength(renderedPage)} bytes) [canonical: ${meta.canonical}]`);
      successCount++;
    } catch (err) {
      console.error(`✗ Failed to prerender ${route}:`, err);
      throw err;
    }
  }

  // Cleanup temporary SSR build directory
  try {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
    console.log('✓ Cleaned up temporary SSR build directory');
  } catch (cleanupErr) {
    console.warn('Warning: Could not remove dist-ssr:', cleanupErr);
  }

  console.log(`--- SSG Complete: ${successCount}/${PUBLIC_ROUTES.length} routes pre-rendered successfully ---\n`);
}

prerender().catch((err) => {
  console.error('SSG Prerender process failed:', err);
  process.exit(1);
});
