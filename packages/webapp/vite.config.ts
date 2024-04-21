// import browserslist from 'browserslist';
// import { browserslistToTargets } from 'lightningcss';
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  define: {
    global: 'window'
  },
  server: {
    port: 4000,
    proxy: {
      // Use a wildcard pattern to match all API requests
      '/api': {
        target: 'http://localhost:3000', // Target backend base URL
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // If the backend uses self-signed certificates
        // rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite URL path
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          
        `
        // @import "./src/styles/_animations.scss";
        // @import "./src/styles/_variables.scss";
        // @import "./src/styles/_mixins.scss";
        // @import "./src/styles/_helpers.scss";
      }
    }
  },
  // build: {
  //   cssMinify: 'lightningcss',
  // },
  // css: {
  //   transformer: 'lightningcss',
  //   lightningcss: {
  //     targets: browserslistToTargets(browserslist('>= 0.25%')),
  //   },
  // },
  // build: {
  //   rollupOptions: {
  //     external: ['']
  //   }
  // },
  build: {
    rollupOptions: {
      output: {
        // Enhances chunking by separating vendor code
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendors';
          }
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^~.+/,
        replacement: (val: string) => {
          return val.replace(/^~/, "");
        },
      },
    ],
  },
  plugins: [tsconfigPaths()],
});
