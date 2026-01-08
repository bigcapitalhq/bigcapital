import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import path from 'node:path';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';

const allowedEnvPrefixes = ['VITE_', 'REACT_APP_', 'PUBLIC_URL'];

const pickClientEnv = (env: Record<string, string>) =>
  Object.keys(env).reduce<Record<string, string>>((acc, key) => {
    if (allowedEnvPrefixes.some((prefix) => key.startsWith(prefix))) {
      acc[key] = env[key];
    }

    return acc;
  }, {});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const rootDir = __dirname;
  const env = loadEnv(mode, rootDir, '');
  const clientEnv = pickClientEnv(env);
  const port = Number(env.PORT) || 4000;
  const plugins: PluginOption[] = [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ];

  return {
    plugins,
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
        '/socket': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
          ws: true,
        },
      },
    },
    build: {
      outDir: 'dist',
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [fixReactVirtualized as any],
      },
    },
  };
});
