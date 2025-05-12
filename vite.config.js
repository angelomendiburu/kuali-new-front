import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssImport,
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['@tanstack/react-table']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 5004,
    strictPort: false // Permitir que Vite use un puerto alternativo si el 5004 está ocupado
  }
})
