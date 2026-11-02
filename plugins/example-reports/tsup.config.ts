import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'server/index': 'src/server/index.ts',
    'web/index': 'src/web/index.ts',
    'migrations/20261102000001_create_example_report_runs_table':
      'src/migrations/20261102000001_create_example_report_runs_table.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ['react', '@nestjs/common', '@bigcapital/extension-sdk', 'knex'],
});
