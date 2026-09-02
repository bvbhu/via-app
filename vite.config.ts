import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {splitVendorChunkPlugin} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import fs from 'fs';

const hash = fs.readFileSync('public/definitions/hash.json', 'utf8');

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
  // GitHub Pages serves this fork at https://bvbhu.github.io/via-app/, so
  // production assets must be prefixed with /via-app/. This stays in sync with
  // the wouter <Router base> in src/containers/Root.tsx (derived from
  // import.meta.env.BASE_URL) and the <%= base %> EJS tags in index.html.
  // Update all of them if the repository is ever renamed.
  const baseUrl = command === 'build' ? '/via-app/' : '/';
  return {
    base: baseUrl,
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            hash,
            // Exposed to index.html as <%= base %> so that public assets
            // (favicons, manifest, og:image) are served from the subpath.
            base: baseUrl,
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
  };
});
