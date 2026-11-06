# @bigcapital/extension-cli

Deploy-time extension lockfile and generated-import tooling for Bigcapital.

Extensions are installed at build/deploy time, not hot-loaded. This CLI keeps
the deployment reproducible:

- `bigcapital.extensions.json` pins the exact extension package versions.
- `extension:sync` generates the static imports compiled into the server and
  webapp bundles.
- `extension:verify` checks the lockfile against the installed packages and
  flags manifest/capability changes before they reach production.

## Install an extension

The package must already be installed in the deployment root.

```bash
# 1. Install the package (pinned exact version)
pnpm add @acme/bigcapital-reports@1.0.0 -w

# 2. Add it to the extension lockfile
pnpm extensions add @acme/bigcapital-reports@1.0.0

# 3. Review capabilities, then regenerate the imports
pnpm extensions:verify
pnpm extensions:sync

# 4. Build and deploy
pnpm build:server
pnpm build:webapp
```

## Commands

| Command                                   | Purpose                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| `pnpm extensions add <package>@<version>` | Add or update an installed extension in the lockfile                       |
| `pnpm extensions remove <id\|package>`    | Remove an extension from the lockfile                                      |
| `pnpm extensions:verify`                  | Validate installed packages against the lockfile and flag capability diffs |
| `pnpm extensions:sync`                    | Regenerate server and webapp imports                                       |
| `pnpm extensions:sync --check`            | Fail if generated imports are out of date                                  |
| `pnpm extensions:check`                   | Run `verify` + `sync --check` (CI)                                         |
| `pnpm extensions:doctor`                  | Print package, capability, and generated-file status                       |

All commands accept `--root <dir>`; by default they use the directory where the
command was invoked.

## Package requirements

An extension package must:

1. Include a Bigcapital manifest:

   - a `bigcapital` field in `package.json`, or
   - a `bigcapital.extension.json` file at the package root.

   The manifest shape is the `@bigcapital/extension-sdk` manifest schema.

2. Use the same version in the manifest and `package.json`.

3. Export the extension entry points used by the generated imports:

   ```json
   {
     "exports": {
       ".": "./dist/server/index.js",
       "./server": "./dist/server/index.js",
       "./web": "./dist/web/index.js",
       "./package.json": "./package.json"
     }
   }
   ```

   `./package.json` is required when the manifest declares `migrations`; the
   generated code resolves the package root from it.

4. Export a named `extension` from the server and web entries:

   ```ts
   // server
   export const extension = defineServerExtension({ ... });

   // web
   export const extension: BigcapitalWebExtension = { ... };
   ```

5. Keep `apiVersion` compatible with the host's
   `HOST_EXTENSION_API_VERSION`.

## Lockfile

`bigcapital.extensions.json` is committed to the deployment repository:

```json
{
  "extensions": [
    {
      "id": "acme.reports",
      "package": "@acme/bigcapital-reports",
      "version": "1.0.0",
      "manifestHash": "sha256:...",
      "capabilities": ["events.subscribe", "tenant.db.read"],
      "enabledByDefault": false
    }
  ]
}
```

`manifestHash` detects manifest drift between the lockfile and the installed
package. Package signing and tarball integrity are planned for the partner
onboarding phase.

## Generated files

```text
packages/server/src/extensions/generated/extensions.generated.ts
packages/webapp/src/extensions/generated/plugins.generated.ts
```

Do not edit these files by hand. Change the lockfile and run
`pnpm extensions:sync`.

The generated server file also exports `extensionMigrationDirectories`, an
absolute-path map keyed by extension id. The host uses it for tenant-scoped
extension migrations. Extensions without migrations are omitted.

## Tenant lifecycle

The deploy-time CLI only manages the lockfile and generated imports. Tenant
enablement and migrations are server CLI commands:

```bash
pnpm extensions:list
pnpm extensions:enable -- --id <extensionId> --tenant_id <organizationId>
pnpm extensions:disable -- --id <extensionId> --tenant_id <organizationId>
pnpm extensions:migrate -- --id <extensionId> --tenant_id <organizationId>
pnpm extensions:migrate:all
```

Migrations are tracked in a per-extension table
(`ext_migrations_<slug>_<hash>`), guarded by a MySQL advisory lock, and are not
run automatically on server boot.

## Development

```bash
pnpm --filter @bigcapital/extension-cli typecheck
pnpm --filter @bigcapital/extension-cli test
pnpm --filter @bigcapital/extension-cli build
```
