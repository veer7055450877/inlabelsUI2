import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        emotional: resolve(__dirname, 'emotional/index.html'),
        funny: resolve(__dirname, 'funny/index.html'),
        professional: resolve(__dirname, 'professional/index.html'),
        retention: resolve(__dirname, 'retention/index.html'),
        minimal: resolve(__dirname, 'minimal/index.html'),
        meme: resolve(__dirname, 'meme/index.html'),
      },
    },
  },
});
