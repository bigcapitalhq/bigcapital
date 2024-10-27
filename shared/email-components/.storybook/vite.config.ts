import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tailwindcss from 'tailwindcss';
import { UserConfigExport } from 'vite';

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
  });
};
// https://vitejs.dev/config/
export default app;
