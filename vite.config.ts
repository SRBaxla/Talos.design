import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://talos.design/',
      dynamicRoutes: [
        '/',
        '/services',
        '/about',
        '/contact',
        '/careers',
        '/projects',
        '/projects/presence',
        '/projects/automation',
        '/projects/custom',
        '/services/web-design',
        '/services/chatbots',
        '/services/automation',
        '/offers/hospitality',
        '/offers/ecommerce',
        '/offers/professional',
        '/legal',
        '/about-us'
      ]
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Firebase — large SDK, split into its own chunk
          if (id.includes('firebase')) return 'firebase';

          // React core — loaded on every page, keep small & cacheable
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('react/')) return 'react-vendor';

          // Framer motion — only used by some pages
          if (id.includes('framer-motion')) return 'framer';

          // Lucide icons — common but can be large
          if (id.includes('lucide-react')) return 'icons';

          // Admin panel — only visited by admins
          if (id.includes('/admin/')) return 'admin-ui';

          // Client portal
          if (id.includes('/portal/')) return 'portal-ui';
        },
      },
    },
  },
})
