# @bigcapital/extension-sdk

Versioned contracts, manifest schema, namespacing helpers, and a test harness
for Bigcapital extensions.

## Entry points

| Entry point                          | Purpose                                                                    | Runtime dependencies    |
| ------------------------------------ | -------------------------------------------------------------------------- | ----------------------- |
| `@bigcapital/extension-sdk`          | Shared helpers: capabilities, events, namespaces, registry, manifest types | `zod` (types only)      |
| `@bigcapital/extension-sdk/manifest` | Zod manifest schema, parsing, and compatibility checks                     | `zod`, `semver`         |
| `@bigcapital/extension-sdk/server`   | Native extension contract, `defineServerExtension`, `@ExtensionController` | `@nestjs/common`, `zod` |
| `@bigcapital/extension-sdk/web`      | Webapp extension contract (`BigcapitalWebExtension`, contributions)        | `react` (types only)    |
| `@bigcapital/extension-sdk/testing`  | In-memory test harness for extension authors                               | none                    |

Server extensions should import from `.../server`; web extensions should import
from `.../web`. The root entry intentionally stays framework-agnostic.

## Server extension

```ts
import { Module } from '@nestjs/common';
import {
  ExtensionController,
  defineServerExtension,
} from '@bigcapital/extension-sdk/server';

@ExtensionController('acme.reports', 'reports')
export class ReportsController {
  // Mounted at /api/ext/acme.reports/reports
}

@Module({ controllers: [ReportsController] })
export class ReportsModule {}

export const extension = defineServerExtension({
  manifest: {
    id: 'acme.reports',
    name: 'Acme Reports',
    version: '1.0.0',
    trust: 'partner',
    capabilities: ['tenant.db.read', 'events.subscribe', 'ui.routes'],
    features: [{ key: 'advanced', defaultValue: false }],
    settings: [{ key: 'api_key', type: 'secret' }],
  },
  createModule: () => ({ module: ReportsModule }),
});
```

Extension controllers must use `@ExtensionController`; the host validates at
bootstrap that every extension controller is mounted under
`/api/ext/<extensionId>`. Use `@RequireFeature('ext:<id>:<key>')` from the SDK
for feature gating (the host applies the guard globally). Event handlers are
isolated and never propagate errors into the core request.

## Domain bridges

Extensions can register typed providers through `ctx.bridges`:

```ts
import { defineServerExtension } from '@bigcapital/extension-sdk/server';

export const extension = defineServerExtension({
  manifest: {
    id: 'acme.payments',
    name: 'Acme Payments',
    version: '1.0.0',
    trust: 'partner',
    capabilities: ['http.outbound', 'secrets.read'],
  },
  createModule: (ctx) => {
    ctx.bridges.payments.register({
      key: 'acme',
      createPaymentLink: async () => ({ ... }),
      handleWebhook: async () => ({ ... }),
      refund: async () => ({ ... }),
      getStatus: async () => ({ ... }),
    });

    return { module: PaymentsModule };
  },
});
```

Available bridges: `reports`, `approvals`, `payments`, and `tax`. Contracts are
exported from `@bigcapital/extension-sdk/bridges`. Provider keys are local to the
extension; the host namespaces them as `ext:<extensionId>:<key>`.

## UI slots

Web extensions can contribute React components to host slots:

```ts
import { EXTENSION_SLOT_NAMES } from '@bigcapital/extension-sdk/web';

export const extension = {
  manifest: {
    id: 'acme.reports',
    name: 'Acme Reports',
    version: '1.0.0',
    trust: 'partner',
  },
  slots: [
    {
      id: 'approval-button',
      slot: 'invoice.detail.actions',
      component: ApprovalButton,
    },
  ],
};
```

Available Phase 1 slots:

- `dashboard.widgets`
- `invoice.detail.actions`
- `invoice.detail.sidebar`
- `contact.form.fields`
- `settings.tabs`
- `app.header.actions`
- `commandPalette.commands`

The host wraps each contribution in feature/permission guards, an error
boundary, and a suspense boundary. A crashing extension renders nothing (or a
compact message in development) without affecting the rest of the page.

Route and slot components receive a `host` prop:

```ts
import type { ExtensionComponentContext } from '@bigcapital/extension-sdk/web';

interface Props {
  host: ExtensionComponentContext;
}

function MyWidget({ host }: Props) {
  // host.api, host.settings, host.extensionId, host.navigate
}
```

## Manifest defaults

Use `defineServerExtension` instead of constructing the object manually. It
parses the manifest, applies defaults, and validates the result. The host also
re-validates the manifest at boot.

## Manifest

```ts
import {
  parseExtensionManifest,
  assertExtensionCompatibility,
} from '@bigcapital/extension-sdk/manifest';

const manifest = parseExtensionManifest({
  id: 'acme.reports',
  name: 'Acme Reports',
  version: '1.0.0',
  apiVersion: '^1.0.0',
  trust: 'partner',
  server: { entry: './dist/server/index.js' },
  web: { entry: './dist/web/index.js' },
  migrations: './dist/migrations',
  capabilities: ['tenant.db.read', 'events.subscribe', 'ui.routes'],
  features: [{ key: 'revenue-by-customer', defaultValue: false }],
  settings: [{ key: 'defaultPeriod', type: 'string', public: true }],
});

assertExtensionCompatibility(manifest, { hostVersion: '0.10.2' });
```

## Namespacing

Every extension-owned concern is namespaced by the helpers in
`@bigcapital/extension-sdk`:

```ts
import {
  extensionFeatureKey,
  extensionMigrationTable,
  extensionRoutePrefix,
  extensionSubject,
} from '@bigcapital/extension-sdk';

extensionFeatureKey('acme.reports', 'revenue'); // ext:acme.reports:revenue
extensionSubject('acme.reports', 'Report'); // ext:acme.reports:Report
extensionRoutePrefix('acme.reports'); // ext/acme.reports
extensionMigrationTable('acme.reports'); // ext_migrations_acme_reports_<hash>
```

## Testing

```ts
import { createExtensionTestHarness } from '@bigcapital/extension-sdk/testing';

const harness = createExtensionTestHarness({
  id: 'acme.reports',
  name: 'Acme Reports',
  version: '1.0.0',
  trust: 'partner',
  capabilities: ['events.subscribe'],
});

await harness.context.events.on('onSaleInvoiceCreated', async (payload) => {
  // ...
});

await harness.dispatch('onSaleInvoiceCreated', { saleInvoiceId: 1 });
```

## Build

```bash
pnpm --filter @bigcapital/extension-sdk build
pnpm --filter @bigcapital/extension-sdk test
```
