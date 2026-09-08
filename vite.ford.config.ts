import { defineConfig } from 'vite';
export default defineConfig({
  root: 'games/ford-frenzy', base: './',
  build: { outDir: '../../dist/ford-frenzy', emptyOutDir: true },
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
  preview: { host: '127.0.0.1', port: 4175, strictPort: true },
});
