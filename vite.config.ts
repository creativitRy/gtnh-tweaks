import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ['core'],
    },
  },
  optimizeDeps: {
    exclude: ['brotli-wasm', '@gtnh-tweaks/core'],
  },
  ssr: {
    noExternal: ['@gtnh-tweaks/core'],
  },
});
