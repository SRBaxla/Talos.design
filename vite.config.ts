import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Firebase — large SDK, split into its own chunk
          if (id.includes('firebase')) return 'firebase';

          // React core — loaded on every page, keep small & cacheable
          if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';

          // Framer motion — only used by some pages
          if (id.includes('framer-motion')) return 'framer';

          // Admin panel — only visited by admins, large chunk
          if (id.includes('/admin/')) return 'admin';

          // Client portal
          if (id.includes('/portal/')) return 'portal';
        },
      },
    },
  },
})
