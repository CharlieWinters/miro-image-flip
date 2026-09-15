import path from 'path';
import fs from 'fs';
import dns from 'dns';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim');

// make sure vite picks up all html files in root, needed for vite build
const allHtmlEntries = fs
  .readdirSync('.')
  .filter((file) => path.extname(file) === '.html')
  .reduce((acc, file) => {
    acc[path.basename(file, '.html')] = path.resolve(__dirname, file);

    return acc;
  }, {});

// https://vitejs.dev/config/
export default defineConfig({
  base: '/miro-image-flip/',
  build: {
    rollupOptions: {
      input: allHtmlEntries,
      // Stable, unhashed filenames. GitHub Pages serves HTML with
      // `cache-control: max-age=600`, and each deploy replaces the contents of
      // the branch. With hashed names, a browser holding a cached HTML entry
      // point requests an asset that the new deploy just deleted, gets a 404,
      // and the app silently stops working for up to ten minutes. Stable names
      // always resolve; the worst case is briefly serving the previous build.
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  server: {
    port: 3000,
  },
});
