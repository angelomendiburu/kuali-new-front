import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
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
    strictPort: false, // Permitir que Vite use un puerto alternativo si el 5004 está ocupado
    proxy: {
      '/registros': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/registros/, '/registros'),
      },
      // Puedes agregar otras rutas de API aquí si es necesario
      // '/api': {
      //   target: 'http://localhost:3003',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '/api'),
      // },
    }
  }
});