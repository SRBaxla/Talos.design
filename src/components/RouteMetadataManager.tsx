import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMetadata } from '../data/routeMetadata';
import { StructuredData } from './StructuredData';

export function RouteMetadataManager() {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const meta = getRouteMetadata(location.pathname);

    // Update document title
    document.title = meta.title;

    // Helper to update or create meta tags by attribute name/property
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to update or create link tags — was incorrectly setting rel attr to rel value
    const setLinkTag = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Standard SEO
    setMetaTag('name', 'description', meta.description);
    setLinkTag('canonical', meta.canonical);

    // Open Graph
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'Talos.design');
    setMetaTag('property', 'og:title', meta.ogTitle);
    setMetaTag('property', 'og:description', meta.ogDescription);
    setMetaTag('property', 'og:url', meta.ogUrl);
    setMetaTag('property', 'og:image', meta.ogImage);

    // Twitter Card
    setMetaTag('property', 'twitter:card', meta.twitterCard);
    setMetaTag('property', 'twitter:title', meta.twitterTitle);
    setMetaTag('property', 'twitter:description', meta.twitterDescription);
    setMetaTag('property', 'twitter:url', meta.ogUrl);
    setMetaTag('property', 'twitter:image', meta.twitterImage);
  }, [location.pathname]);

  return <StructuredData />;
}
