import react from '@vitejs/plugin-react';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig, loadEnv, Plugin } from 'vite';

const allowedEnvPrefixes = ['VITE_', 'REACT_APP_', 'PUBLIC_URL'];

const reactVirtualizedCompat = (): Plugin => ({
  name: 'react-virtualized-compat',
  enforce: 'pre',
  transform(code, id) {
    const needsShim =
      id.includes(
        'node_modules/react-virtualized/dist/es/WindowScroller/utils/onScroll.js',
      ) ||
      id.includes(
        'node_modules/react-virtualized/dist/es/WindowScroller/utils/dimensions.js',
      );
    if (needsShim) {
      console.info('Applying react-virtualized shim:', id);
      return code.replace(
        /import \{ bpfrpt_proptype_WindowScroller \} from "\.\.\/WindowScroller\.js";/g,
        'const bpfrpt_proptype_WindowScroller = null;',
      );
    }

    return null;
  },
});

const reactVirtualizedOptimizePatch = () => ({
  name: 'react-virtualized-optimize-patch',
  setup(build) {
    const filter =
      /react-virtualized\/dist\/es\/WindowScroller\/utils\/(onScroll|dimensions)\.js$/;
    build.onLoad({ filter }, async args => {
      const contents = await readFile(args.path, 'utf-8');
      return {
        contents: contents.replace(
          /import \{ bpfrpt_proptype_WindowScroller \} from "\.\.\/WindowScroller\.js";/g,
          'const bpfrpt_proptype_WindowScroller = null;',
        ),
        loader: 'js',
      };
    });
  },
});

const pickClientEnv = (env: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(env).filter(([key]) =>
      allowedEnvPrefixes.some(prefix => key.startsWith(prefix)),
    ),
  );

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const rootDir = __dirname;
  const env = loadEnv(mode, rootDir, '');
  const clientEnv = pickClientEnv(env);
  const port = Number(env.PORT) || 4000;

  return {
    plugins: [react(), reactVirtualizedCompat()],
    root: rootDir,
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
        '@public': path.resolve(rootDir, 'public'),
        path: 'path-browserify',
      },
    },
    define: {
      'process.env': {
        NODE_ENV: mode,
        PUBLIC_URL: clientEnv.PUBLIC_URL ?? '/',
        ...clientEnv,
      },
    },
    server: {
      host: true,
      port,
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [reactVirtualizedOptimizePatch()],
      },
    },
  };
});

