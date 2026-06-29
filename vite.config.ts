import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-htaccess',
      closeBundle() {
        copyFileSync('./public/.htaccess', './dist/.htaccess');
      },
    },
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
