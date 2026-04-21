# Claude Code Settings for Bigcapital

## Node.js Version

Always use Node.js 18.16.1 for this project. Before running any npm/pnpm/node commands:

```bash
nvm use 18.16.1
```

## Package Manager

Use `pnpm` for this project.

## Fork-Specific Changes

This fork diverges from upstream `bigcapitalhq/bigcapital` in the following areas. Keep these in mind when reviewing upstream PRs or merging.

### Features added in this fork

- **Bulk activate/inactivate accounts** — `POST /accounts/bulk-activate` and `POST /accounts/bulk-inactivate` endpoints + webapp UI (alert dialogs with correct selected count).
- **Edit categorization on bank transactions** — `PATCH /banking/categorize/:id` allows changing `creditAccountId`, `transactionType`, and `description` on categorized transactions without uncategorize/re-categorize. Rewrites GL entries when account or type changes. Webapp "Edit Category" context menu item opens a dialog.
- **Parent account name + code in CSV export** — `parentAccountName` and `parentAccountCode` computed attributes in `AccountTransformer`, exposed via `Account.meta.ts` columns.
- **Accounts import: parent-child resolution** — Two-pass import via `afterImport()` hook on the `Importable` base class, plus a `relationImportMatchDeferred` field-meta flag that tells the parser to skip DB lookup and pass the raw name/code through. `AccountsImportable` strips `parentAccountId` during creation and resolves parent relationships (by numeric ID, name, or code) after all accounts exist in the transaction.
- **Stripped seed accounts** — `SeedAccounts` array contains only predefined (required) accounts. Non-essential defaults removed. Drawings code changed from 30003 to 30004 to avoid duplicate with Owner's Equity.

### Bugs fixed in this fork

- **Redis config permissions** — `COPY --chown=redis:redis` in Redis Dockerfile.
- **Migration path** — `working_dir: /app/packages/server` in compose so system migration directory resolves correctly.
- **Empty email verification token** — `AuthMailSubscriber` skips sending verification email when `SIGNUP_EMAIL_CONFIRMATION=false` (token is empty).
- **Import preview auto-refresh** — `staleTime: Infinity` and `refetchOnWindowFocus: false` on import preview/meta queries. Added missing `Account` case to `invalidateResourcesOnImport()`.
- **Rate limit env var mismatch** — `API_RATE_LIMIT` in `.env.example` is a legacy/dead variable that the server doesn't read. Actual vars are `THROTTLE_GLOBAL_LIMIT`/`THROTTLE_GLOBAL_TTL` (default 100 req/60s) and `THROTTLE_AUTH_LIMIT`/`THROTTLE_AUTH_TTL` (default 10 req/60s). Updated deploy docs to reference the correct names.
- **UI label inconsistencies** — Standardized "Statement"→"Note", "Reference #"→"Reference No.", date/account field capitalization, "Full Amount"→"Amount", credit note using invoice date label, vendor credit using bill date label, withdrawal account mislabeled as deposit account.
- **DateInput "Invalid date" on calendar navigation** — Blueprint v4.4.37's `DatePicker.handleMonthChange` fires `onChange(null)` when the user clicks an already-selected day during month navigation. `handleDateChange` in `packages/webapp/src/utils/index.tsx` now guards against `null` before calling `moment(date).format(...)`.
- **Date format inconsistency** — All 50 date input/edit fields across the app standardized to `MM/DD/YYYY` via `momentFormatter('MM/DD/YYYY')`. Replaced `YYYY/MM/DD`, `YYYY-MM-DD`, and locale-dependent `toLocaleDateString()` patterns.
- **Vendor selector missing from expense form** — Added vendor/payee field (`payee_id`) to the expense form header, wired to `useVendors` via `ExpenseFormPageProvider`.
- **Vendor/customer duplicate code constraint** — `CONTACTS_CODE_UNIQUE` rejects a second empty-string `code` (MySQL treats `''` as duplicate but `NULL` as non-duplicate). Fixed in `CreateEditVendorDTO.ts` and `CreateEditCustomerDTO.service.ts` by coercing falsy `code` to `null` before insert/update. Existing rows with `CODE = ''` must be patched manually: `UPDATE CONTACTS SET CODE = NULL WHERE CODE = '';` on each tenant DB.

### Conventions for this fork

- **Container/image naming**: Use `bigcapital-fork-*` prefix for container names and `bigcapital-fork-*:uat-v*` for image tags to avoid collisions with upstream instances.
- **Network naming**: Internal network is `bigcapital_fork_network`, volumes are `bigcapital_prod_fork_*`.
- **i18n labels**: Use Title Case for all column headers and form labels (e.g. "Payment Date", not "Payment date"). Use "Note" not "Statement" for memo fields. Use "Reference No." consistently.

## Deployment

Production and UAT instances run in Docker via `docker-compose.prod.yml`. Traefik sits in front of everything as the reverse proxy, handling TLS termination, OAuth forward-auth, and routing between `server` (NestJS API) and `webapp` (Vite SPA).

See `docs/DEPLOY.md` for the full deployment guide including image build, transfer, Traefik config, environment setup, and troubleshooting.

### Key deployment notes

- **Migration working directory** must be `/app/packages/server` — the system migration path (`./src/database/system/migrations`) is relative to `cwd`.
- **MySQL grants**: The MariaDB init script only runs on first database initialization. If the volume pre-exists, manually grant `ALL PRIVILEGES ON *.*` to the app user.
- **API rate limit**: NestJS throttler controlled by `THROTTLE_GLOBAL_LIMIT`/`THROTTLE_GLOBAL_TTL` (default 100/60s) and `THROTTLE_AUTH_LIMIT`/`THROTTLE_AUTH_TTL` (default 10/60s). Both defaults are too strict for SPA usage — set `THROTTLE_GLOBAL_LIMIT=600`, `THROTTLE_AUTH_LIMIT=60` with `TTL=60000`. The legacy `API_RATE_LIMIT` variable is NOT used by the app. State is in Redis — restart Redis to clear lockouts.
- **Fonts**: NotoSans and Segoe font files must be in `packages/webapp/public/fonts/` for production builds (Vite's SCSS URL resolution doesn't hash them).
- **GOTENBERG_DOCS_URL**: Uses container name `http://bigcapital-fork-server:3000/public/` — must match the `container_name` in compose.

### Traefik configuration style

- **Dynamic files**, not Docker labels. Routers, services, and middlewares live in `*.yml` under Traefik's watched directory (commonly `/etc/traefik/dynamic/`). Do NOT add `traefik.*` labels to the compose file.
- Bigcapital containers must attach to Traefik's external network. Declare it as `external: true` in the compose file's `networks:` block and attach `server` and `webapp`. Keep `mysql`, `redis`, `gotenberg`, and `database_migration` on the internal network only.
- Container names drive dynamic-file service URLs. Keep the `container_name:` entries in compose stable.

### Routing split

Same host, path-prefix routing. Two routers, explicit priority so the API router beats the bare-Host webapp router:

- `bigcapital-fork-api` (priority 10): `Host(host) && (PathPrefix('/api') || PathPrefix('/socket') || PathPrefix('/public'))` → `bigcapital-fork-server:3000`
- `bigcapital-fork-webapp` (priority 1): `Host(host)` (catch-all for the SPA) → `bigcapital-fork-webapp:80`

The API service needs sticky cookies for Socket.IO correctness under replica scale-out.

### OAuth pattern — network-level gate, internal auth untouched

UAT and prod use OAuth forward-auth at the Traefik edge. The intent is **network-level access control**, not identity federation:

- OAuth wraps both routers. Unauthenticated requests get redirected to the OAuth provider.
- Bigcapital's internal `AuthModule` (JWT signin/signup/password-reset) remains the source of truth for user identity. OAuth and internal auth are separate layers.
- Users experience two logins: OAuth once per browser session, Bigcapital signin once per JWT lifetime (1 day).

### Future enhancements and known gaps

See `docs/FUTURE-ENHANCEMENTS.md` for planned work including multi-organization support per user and behavioral hardening (security/audit wiring). The hardening items must be completed before production data.
