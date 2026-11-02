import type { ExtensionManifest } from '@bigcapital/extension-sdk';

export const exampleReportsManifest: ExtensionManifest = {
  manifestVersion: 1,
  id: 'bigcapital.example-reports',
  name: 'Example Reports',
  version: '1.0.0',
  apiVersion: '^1.0.0',
  trust: 'native',
  server: { entry: './dist/server/index.js' },
  web: { entry: './dist/web/index.js' },
  migrations: './dist/migrations',
  capabilities: ['tenant.db.read', 'ui.routes', 'ui.slots'],
  features: [],
  abilities: [],
  settings: [
    {
      key: 'default_period',
      type: 'string',
      title: 'Default period',
      defaultValue: 'this_year',
      public: true,
      required: false,
    },
  ],
  defaultEnabled: false,
};
