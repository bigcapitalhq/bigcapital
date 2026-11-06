# @bigcapital/example-reports

Reference Bigcapital extension that proves the end-to-end extension stack:

- a native server extension registering a `ReportProvider`
- a web extension contributing a route, a menu item, and a dashboard widget
- an extension-owned tenant migration
- the deploy-time lockfile and generated imports

The extension is `defaultEnabled: false`, so it is compiled into the bundle but
not enabled for any tenant until an operator enables it.

## Build

```bash
pnpm --filter @bigcapital/example-reports build
```

## Add to a deployment

```bash
pnpm extensions add @bigcapital/example-reports@1.0.0
pnpm extensions:sync
```

## Enable for a tenant

```bash
pnpm extensions:enable -- --id bigcapital.example-reports --tenant_id <organizationId>
```

This runs the packaged tenant migration, records it in
`ext_migrations_bigcapital_example_reports_<hash>`, and flips the tenant status
to `enabled`. Disabling keeps the data:

```bash
pnpm extensions:disable -- --id bigcapital.example-reports --tenant_id <organizationId>
```

Re-enabling does not re-run applied migrations.

## Report endpoint

The generic host controller runs registered reports at:

```text
GET /api/ext/bigcapital.example-reports/reports/default/revenue-by-customer
```

The provider is registered in `src/server/index.ts` through
`ctx.bridges.reports.register(...)`; no extension-specific controller is needed.

## Web contributions

- Route: `/ext/bigcapital.example-reports/reports`
- Menu item: under the Reports sidebar group
- Slot: `dashboard.widgets`

## Migration

`src/migrations/20261102000001_create_example_report_runs_table.ts` creates
`ext_bigcapital_example_reports_runs`. It is packaged under `dist/migrations`
and executed by the tenant extension migration runner, which tracks applied
migrations in a per-extension table.
