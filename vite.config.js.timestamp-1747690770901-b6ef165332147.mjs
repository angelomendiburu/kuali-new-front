// vite.config.js
import path from "path";
import { defineConfig } from "file:///C:/Users/OBSER/dev/kuali-new-front/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/OBSER/dev/kuali-new-front/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///C:/Users/OBSER/dev/kuali-new-front/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/OBSER/dev/kuali-new-front/node_modules/autoprefixer/lib/autoprefixer.js";
import postcssImport from "file:///C:/Users/OBSER/dev/kuali-new-front/node_modules/postcss-import/index.js";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/OBSER/dev/kuali-new-front/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssImport,
        tailwindcss,
        autoprefixer
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },
  optimizeDeps: {
    include: ["@tanstack/react-table"]
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  server: {
    port: 5004,
    strictPort: false,
    // Permitir que Vite use un puerto alternativo si el 5004 está ocupado
    proxy: {
      "/registros": {
        target: "http://localhost:3003",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/registros/, "/registros")
      }
      // Puedes agregar otras rutas de API aquí si es necesario
      // '/api': {
      //   target: 'http://localhost:3003',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '/api'),
      // },
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPQlNFUlxcXFxkZXZcXFxca3VhbGktbmV3LWZyb250XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPQlNFUlxcXFxkZXZcXFxca3VhbGktbmV3LWZyb250XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9PQlNFUi9kZXYva3VhbGktbmV3LWZyb250L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnO1xyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XHJcbmltcG9ydCBwb3N0Y3NzSW1wb3J0IGZyb20gJ3Bvc3Rjc3MtaW1wb3J0JztcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XHJcblxyXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBjc3M6IHtcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHBvc3Rjc3NJbXBvcnQsXHJcbiAgICAgICAgdGFpbHdpbmRjc3MsXHJcbiAgICAgICAgYXV0b3ByZWZpeGVyLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICAgIGV4dGVuc2lvbnM6IFtcIi5qc1wiLCBcIi5qc3hcIiwgXCIudHNcIiwgXCIudHN4XCIsIFwiLmpzb25cIl0sXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFsnQHRhbnN0YWNrL3JlYWN0LXRhYmxlJ11cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBjb21tb25qc09wdGlvbnM6IHtcclxuICAgICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWUsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA1MDA0LFxyXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsIC8vIFBlcm1pdGlyIHF1ZSBWaXRlIHVzZSB1biBwdWVydG8gYWx0ZXJuYXRpdm8gc2kgZWwgNTAwNCBlc3RcdTAwRTEgb2N1cGFkb1xyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9yZWdpc3Ryb3MnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAzJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3JlZ2lzdHJvcy8sICcvcmVnaXN0cm9zJyksXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIFB1ZWRlcyBhZ3JlZ2FyIG90cmFzIHJ1dGFzIGRlIEFQSSBhcXVcdTAwRUQgc2kgZXMgbmVjZXNhcmlvXHJcbiAgICAgIC8vICcvYXBpJzoge1xyXG4gICAgICAvLyAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMycsXHJcbiAgICAgIC8vICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAvLyAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnL2FwaScpLFxyXG4gICAgICAvLyB9LFxyXG4gICAgfVxyXG4gIH1cclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUyxPQUFPLFVBQVU7QUFDblQsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBQ3pCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMscUJBQXFCO0FBTnVKLElBQU0sMkNBQTJDO0FBUXRPLElBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELElBQU0sWUFBWSxLQUFLLFFBQVEsVUFBVTtBQUV6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxJQUNBLFlBQVksQ0FBQyxPQUFPLFFBQVEsT0FBTyxRQUFRLE9BQU87QUFBQSxFQUNwRDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLHVCQUF1QjtBQUFBLEVBQ25DO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxpQkFBaUI7QUFBQSxNQUNmLHlCQUF5QjtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBO0FBQUEsSUFDWixPQUFPO0FBQUEsTUFDTCxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxnQkFBZ0IsWUFBWTtBQUFBLE1BQzlEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
