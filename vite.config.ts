import { defineConfig } from 'vite';

export default defineConfig({
  root: 'games/journey',
  base: './',
  build: { outDir: '../../dist/journey', emptyOutDir: true },
  server: { port: 5173, strictPort: true },
});
