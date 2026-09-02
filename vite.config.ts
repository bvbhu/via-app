import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {splitVendorChunkPlugin} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import fs from 'fs';

const hash = fs.readFileSync('public/definitions/hash.json', 'utf8');

// https://vitejs.dev/config/
export default defineConfig(({command}) => ({
  // GitHub Pages serves this fork at https://bvbhu.github.io/via-app/, so
  // production assets must be prefixed with /via-app/. This stays in sync with
  // the wouter <Router base> in src/containers/Root.tsx (which is derived from
  // import.meta.env.BASE_URL). Update both if the repository is ever renamed.
  base: command === 'build' ? '/via-app/' : '/',
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          hash,
        },
      },
    }),
    splitVendorChunkPlugin(),
  ],
  assetsInclude: ['**/*.glb'],
  envDir: '.',
  server: {open: true},
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      assets: path.resolve(__dirname, './src/assets'),
    },
  },
  optimizeDeps: {
    include: ['@the-via/reader'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [],
    },
  },
}));
