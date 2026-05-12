# Claude Code Settings for Bigcapital

## Node.js Version

Always use Node.js 18.16.1 for this project. Before running any npm/pnpm/node commands:

```bash
nvm use 18.16.1
```

## Package Manager

Use `pnpm` for this project.

## Commits & Hooks

Husky hooks are tracked as 100755 and active on every commit.

- **`.husky/pre-commit`** runs `pnpm exec lint-staged`, which formats staged JS/TS/JSON/MD/YAML/SCSS/CSS files via Prettier. Each package's local `.prettierrc` is auto-resolved by Prettier based on file path, so `packages/server` and `packages/webapp` keep their own formatting preferences.
- **`.husky/commit-msg`** runs `pnpm exec commitlint --edit "$1"`, enforcing Conventional Commits. The `scope-enum` in `commitlint.config.js` is restricted:
  - **Workspace packages** (auto-derived equivalents): `server`, `webapp`, `utils`, `email-components`, `pdf-templates`, `sdk-ts`.
  - **Domain scopes**: `accounts`, `banking`, `ci`, `contacts`, `currency`, `docker`, `docs`, `expenses`, `financial-statements`, `husky`, `import`, `infra`, `inventory`, `ledger`, `models`, `organization`, `payment-received`, `reports`, `resource`, `sandbox`, `square`, `square-pull`, `ui`.
  - To add a new scope, edit `commitlint.config.js` — don't bypass with `--no-verify`.

**Never use `pnpx` / `pnpm dlx` in committed hooks or scripts.** Both fetch the _latest_ version from the registry, ignoring whatever is pinned in `node_modules`. Use `pnpm exec <bin>` so the local devDependency version runs.

**Tooling deps must stay Node-18-compatible** (this project pins Node 18.16.1):

- `@commitlint/cli@^17` — v19+ pulls `yargs-parser@22` (Node 20+).
- `lint-staged@^15` — v16+ pulls `listr2@10`, which uses `node:util.styleText` (Node 20+).
- Same trap likely lurks in future bumps of husky/prettier/eslint plugins. Run `pnpm exec <bin> --version` after any tooling install — ES-module Node-version errors fire on import.

## Fork-Specific Changes

This fork diverges from upstream `bigcapitalhq/bigcapital`. Keep these in mind when reviewing upstream PRs or merging.

### Features added in this fork

- **Bulk activate/inactivate accounts** — `POST /accounts/bulk-activate` and `POST /accounts/bulk-inactivate` endpoints + webapp UI.
- **Edit categorization on bank transactions** — `PATCH /banking/categorize/:id` allows changing `creditAccountId`, `transactionType`, and `description` on categorized transactions without uncategorize/re-categorize. Rewrites GL entries when account or type changes. Webapp "Edit Category" context menu item opens a dialog.
- **Parent account name + code in CSV export** — `parentAccountName` and `parentAccountCode` computed attributes in `AccountTransformer`, exposed via `Account.meta.ts` columns.
- **Accounts import: parent-child resolution** — Two-pass import via `afterImport()` hook on the `Importable` base class, plus a `relationImportMatchDeferred` field-meta flag that tells the parser to skip DB lookup and pass the raw name/code through. `AccountsImportable` strips `parentAccountId` during creation and resolves parent relationships (by numeric ID, name, or code) after all accounts exist in the transaction.
- **Stripped seed accounts** — `SeedAccounts` array contains only predefined (required) accounts. Drawings code changed from 30003 to 30004 to avoid duplicate with Owner's Equity.
- **Split-payment expenses + percent-based category allocation** — A single expense can draw from multiple payment accounts, and categories can allocate by percent of total or fixed dollar amount. New `expense_payment_splits` table; `expense_transaction_categories` gains `amount_type` (`fixed`|`percent`) and `percent` columns. GL subscriber emits one credit entry per split. Validator tolerance `0.005 + 0.005 × N_percent_rows` absorbs 3dp rounding (e.g. 33/33/33%). Header `paymentAccountId` kept as denormalized "primary payment account" for list views/exports. **Tenant migrations must run on deploy** — after upgrading the server image run `docker compose up -d --force-recreate database_migration`. PDF voucher and CSV export still show only the primary account (intentional v1 scope).
- **Split-payment-aware bank transaction matching** — Each payment split is an independent match candidate. `matched_bank_transactions.reference_sub_id` (nullable) points at `expense_payment_splits.id`. `GetMatchedTransactionsByExpenses` filters by the bank transaction's account (CC transactions previously showed bank-side expenses as candidates — fixed). Unmatch is per-split. Expense form preserves split `id` across edits so `upsertGraph` updates in place.
- **Square integration** — OAuth-based connection, setup wizard, HMAC webhooks, SaleReceipt/CreditNote/ManualJournal posting. Phase 1 shipped (event capture); Phase 2 partial (payment handler done; refund/payout/customer pending); Phase 3 planned (180-day backfill + Plaid auto-match). **Architecture, env vars, idempotency model, test plan, and Step 3 plan in `docs/SQUARE-INTEGRATION.md`.**
- **Bidirectional cashflow categorization for refunds** — `OtherIncome` and `OtherExpense` cashflow categorizations work in either direction. A deposit categorized as `OtherExpense` is a vendor refund (DR cash, CR original expense → reduces the expense). A withdrawal categorized as `OtherIncome` is a customer refund issued (DR original income, CR cash → reduces income). Other type pairs (`OwnerContribution`↔`OwnerDrawing`, `TransferFromAccount`↔`TransferToAccount`) keep direction match because each pair already models the opposite direction explicitly. Categorize-form sub-form labels are direction-aware via `autofillCategorizeValues.isDepositTransaction`.
- **Reconcile aside accepts equity accounts (Owner Drawings / Owner Contribution)** — the matching-aside's "Add Reconcile Transaction +" button now lets equity accounts back the leftover-amount cashflow transaction. Category dropdown filter allows `equity` in both directions; `transformToReq` looks up `account_root_type` to map equity selections to the correct cashflow type (`owner_drawing` for withdrawals, `owner_contribution` for deposits). Server validators already enforce equity credit accounts for these types. Unblocks the "owner withdrew $1200, used $1176.47 for an expense and kept $23.53" workflow. The Reconcile aside was restructured so the boot's `accounts` list flows into `transformToReq`.

### Bugs fixed in this fork

For full post-mortems on every fix, see `docs/FORK-BUG-HISTORY.md`. The active gotchas — rules you must follow when adding new code — are pulled out below.

#### Active gotchas (rules to remember)

- **`SerializeInterceptor` mutates inbound request bodies snake→camelCase.** The global interceptor at `packages/server/src/common/interceptors/serialize.interceptor.ts` runs `snakeToCamel` on `request.body` and `request.query`. **New webhook handlers (Square, Stripe, Plaid, …) must read camelCase keys** — Square's `merchant_id` arrives as `merchantId`, etc. `req.rawBody` still holds the original bytes for HMAC verification.
- **CSV authoring rule for enum fields**: emit the lowercase key (`service`, `inventory`, `non-inventory`, …), not the localized label. The import-row parser matches against `option.key` case-insensitively.
- **`require('@/...')` does NOT resolve at runtime in Objection `relationMappings`.** The `@/` alias is a compile-time `import` rewrite only. Use relative paths inside `static get relationMappings()`.
- **`filterSupportFeatures` is async** — callers must `await`. The path goes through `getResourceFields2(...)` which is async; non-awaited Promises are truthy and silently keep Branch/Warehouse fields required.
- **New importables need `@ImportableService({ name })`.** Sanity check: `grep -L '@ImportableService' packages/server/src/modules/**/*Importable*.ts` should print nothing. Use the literal resource name string the webapp sends if it differs from the model class name.
- **Resource-name aliases**: when the webapp's resource string mismatches the model class (e.g. `PaymentReceive` vs `PaymentReceived` model), add an entry to `RESOURCE_NAME_ALIASES` in `Resource/_utils.ts` — don't rename the model.
- **`CustomersImportable` does NOT dedupe by Display Name.** Re-uploading customers.csv doubles the contact list. Items / invoices / invoice_payments / receipts are safe to re-upload (collisions silently skip); customers is NOT. If duplicates land, run the `MERGE + DELETE` SQL pass against `CONTACTS`.
- **`FSelect` dropdowns filter in-memory** — the form provider must request `page_size: 10000` (or similar large value) on `useVendors` / `useCustomers` / etc., or records beyond page 1 are invisible and unsearchable.
- **MariaDB on Linux is case-sensitive for table names.** `knexSnakeCaseMappers({ upperCase: true })` emits identifiers in UPPER CASE — actual tables are `SQUARE_CONNECTIONS`, `EXPENSE_PAYMENT_SPLITS`, etc. When debugging via mysql CLI, use the uppercase name.
- **Knex unique/index names overshoot MySQL's 64-char limit** because of UPPER-CASE mapping. When `table.unique([...])` touches long table + column names, pass an explicit short name: `table.unique([cols], 'uq_short_name')`.
- **Stuck Knex migration lock**: if a tenant migration crashes mid-run, release with `UPDATE knex_migrations_lock SET is_locked = 0;` on each affected tenant DB.
- **Vendor/customer empty `code` constraint**: `CONTACTS_CODE_UNIQUE` rejects a second empty-string `code` (MySQL treats `''` as duplicate, `NULL` as non-duplicate). DTOs coerce falsy `code` to `null` before insert/update. Existing rows with `CODE = ''` need `UPDATE CONTACTS SET CODE = NULL WHERE CODE = '';`.
- **Never use `whereRaw` with literal table/column names.** `whereRaw` is verbatim and bypasses Knex's `snakeCaseMappers({ upperCase: true })`. On MariaDB-on-Linux the real tables are uppercase (`MATCHED_BANK_TRANSACTIONS`, `EXPENSE_PAYMENT_SPLITS`, …) and a lowercase reference throws "table doesn't exist". Worse: callers wrapped in `PromisePool` (e.g. `GetMatchedTransactions.service.ts`) silently swallow per-task errors, so the bug surfaces as missing UI rows with a 200 response, not a 500. Use `whereColumn('a.col', 'b.col')`, `?? = ??` bindings, or structured `.where()`/`.whereNull()` — anything that routes identifiers through the mapper. Same rule applies to `joinRaw` / `select(knex.raw(...))` with literal identifiers.
- **When adding a child table whose FK references an existing parent, audit the parent's Delete service.** The fork's pattern is service-side cascade — explicit `.where('parentId', id).delete()` lines under the parent's UoW transaction, not DB-level `ON DELETE CASCADE` (precedent: `expense_transaction_categories`, `expense_payment_splits`). A missing line surfaces as a 500 with an FK-violation error. Especially dangerous when paired with a backfill migration: every parent row gets a child row, so the bug is universal from day one rather than only hitting "real" data.
- **Never run parallel writes on a Knex transaction; never use `async.queue` without an error handler.** Knex transactions are not safe for concurrent queries — running multiple `INSERT`s in parallel against the same `trx` produces non-deterministic per-row failures that the underlying mysql2 driver surfaces as transient errors. `async.queue` (and similar fire-and-forget concurrent runners) silently swallow per-task failures unless you wire an `error` event listener; `await queue.drain()` resolves regardless. Combined: a single bad row vanishes silently, the unit-of-work commits, and the only symptom is a trial-balance imbalance weeks later. Use a sequential `for…await` loop for any per-row write that must all succeed (or fail loudly together). Same trap shape: any "queue with concurrency > 1 inside a UoW trx" is suspicious by default.
- **`UnitOfWork.withTransaction` must `await` both `commit()` and `rollback()`.** Knex/Objection's commit/rollback return Promises; non-awaited calls let the wrapping function return before the trx finishes, producing partial-completion symptoms (callers see "success", later reads see stale state). Already fixed in `Tenancy/TenancyDB/UnitOfWork.service.ts` — keep it that way.
- **Trial-balance audit recipe**: `SELECT REFERENCE_TYPE, REFERENCE_ID, SUM(DEBIT)-SUM(CREDIT) AS diff FROM ACCOUNTS_TRANSACTIONS GROUP BY 1, 2 HAVING ABS(SUM(DEBIT)-SUM(CREDIT)) > 0.005` names every unbalanced (transaction, leg-set) pair in one query; join to `ITEMS_ENTRIES` (or the relevant child table) by `(REFERENCE_ID, ITEM_ID, ACCOUNT_ID)` to find missing-leg lines. Pattern from the SaleInvoice GL incident: 19 invoices, one missing CR each, fixed via 20 backfill INSERTs in `START TRANSACTION` with per-invoice + per-month + master verification before `COMMIT`.

### Conventions for this fork

- **Container/image naming**: `bigcapital-fork-*` prefix for container names. Image tags follow the environment: `:uat-v*` for staging, `:sandbox-v*` for sandbox. Containers: `bigcapital-fork-*` for staging, `bigcapital-sandbox-*` for sandbox.
- **Network naming**: Staging uses `bigcapital_fork_network` + volumes `bigcapital_prod_fork_*`. Sandbox uses `bigcapital_sandbox_network` + volumes `bigcapital_sandbox_*`. Both stacks attach their public-facing containers to the external `portal-net` network where Traefik lives.
- **i18n labels**: Title Case for column headers and form labels (e.g. "Payment Date", not "Payment date"). "Note" not "Statement" for memo fields. "Reference No." consistently.
- **Date format on financial reports** flows from a single source: tenant-level Preferences → General → Date Format. The server's `FinancialSheetMeta.meta()` exposes it as `dateFormat` in every report response (camel→snake → `date_format` on the webapp). The shared `FinancialSheet.tsx` footer now reads `meta?.date_format` and appends `HH:mm` for the timestamp; never hardcode a date format in a report container. Watch out for moment.js's `MM` (month) vs `mm` (minutes) — `HH:MM` silently renders the current month as the minute and was the long-standing footer bug.

## Deployment

Production and UAT instances run in Docker via `docker-compose.prod.yml`. Traefik handles TLS termination, OAuth forward-auth, and routing between `server` (NestJS API) and `webapp` (Vite SPA).

**See `docs/DEPLOY.md` for the full guide** (image build, transfer, Traefik config, environment setup, troubleshooting).

### Push-to-deploy pipeline (GHCR — sandbox + UAT)

Newer alternative to the tarball flow: `git push origin develop` triggers `.github/workflows/deploy.yml`, which builds linux/arm64 images for both `server` and `webapp`, pushes to `ghcr.io/crxnit/bigcapital-{server,webapp}:sha-<short>`, runs a Trivy HIGH/CRITICAL gate, then SSHs into the VPS to run `deploy.sh` which pulls the new images, runs the tenant migration container, and brings up server+webapp with a `/api/health` smoke gate.

**Operator runbook: `docs/CI-CD.md`** — covers triggers, secrets, SSH lockdown, cutover from tarball, rollback, common failures, backup/restore (nightly restic to existing JJOC S3 bucket).

Sandbox is wired first (auto-deploys on push to `develop`); UAT triggers via `gh workflow run deploy.yml -f environment=uat`. Until cutover is verified, the legacy tarball compose files (`docker-compose.prod.yml`, `docker/sandbox-bc/docker-compose.yml`) remain as rollback paths.

### Always-relevant deployment notes

- **Colima memory for image builds** — Webapp Vite build needs ~4 GB heap alone. Run Colima with at least 8 GB: `colima stop && colima start --cpu 2 --memory 8 --disk 20`. Without enough memory the build OOMs with `ResourceExhausted: cannot allocate memory`.
- **Built image tarballs → `current-images/<env>/`** — When `docker save | gzip > ...`, write the tarball into `current-images/<env>/` (`staging`, `sandbox`, etc.). Keeps environments separate. Directory is gitignored.
- **Migration working directory** must be `/app/packages/server` — system migration path (`./src/database/system/migrations`) is relative to `cwd`.
- **API rate limit**: NestJS throttler controlled by `THROTTLE_GLOBAL_LIMIT`/`THROTTLE_GLOBAL_TTL` (default 100/60s) and `THROTTLE_AUTH_LIMIT`/`THROTTLE_AUTH_TTL` (default 10/60s). Both defaults are too strict for SPA usage — set `THROTTLE_GLOBAL_LIMIT=600`, `THROTTLE_AUTH_LIMIT=60`, `TTL=60000`. Legacy `API_RATE_LIMIT` is NOT used. State is in Redis — restart Redis to clear lockouts.
- **MinIO env vars** (self-hosted S3 for attachments): `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION=us-east-1`, `S3_ENDPOINT=http://bigcapital-fork-minio:9000`, `S3_BUCKET=bigcapital-attachments`, `S3_FORCE_PATH_STYLE=true`. The `createbuckets` one-shot service creates the bucket idempotently on every `docker compose up`.
- **`docker compose restart` does not apply compose-file changes** — use `docker compose up -d <service>` after any compose or env update.
- **Fonts**: NotoSans and Segoe font files must be in `packages/webapp/public/fonts/` for production builds (Vite's SCSS URL resolution doesn't hash them).
- **GOTENBERG_DOCS_URL**: uses container name `http://bigcapital-fork-server:3000/public/` — must match the `container_name` in compose.

### Traefik

- **Dynamic files**, not Docker labels. Routers, services, and middlewares live in `*.yml` under Traefik's watched directory. Do NOT add `traefik.*` labels to compose.
- Bigcapital containers attach to Traefik's external network (`external: true` in compose). Keep `mysql`, `redis`, `gotenberg`, and `database_migration` on the internal network only.
- Container names drive dynamic-file service URLs. Keep `container_name:` entries stable.

**Routing split** (same host, path-prefix):

- `bigcapital-fork-api` (priority 10): `Host(host) && (PathPrefix('/api') || PathPrefix('/socket') || PathPrefix('/public'))` → `bigcapital-fork-server:3000`
- `bigcapital-fork-webapp` (priority 1): `Host(host)` (catch-all SPA) → `bigcapital-fork-webapp:80`

The API service needs sticky cookies for Socket.IO correctness under replica scale-out.

### OAuth pattern — network-level gate, internal auth untouched

OAuth forward-auth at the Traefik edge is a **network-level access gate**, not identity federation:

- OAuth wraps both routers; unauthenticated requests redirect to the OAuth provider.
- Bigcapital's internal `AuthModule` (JWT signin/signup/password-reset) remains the source of truth for user identity.
- Users experience two logins: OAuth once per browser session, Bigcapital signin once per JWT lifetime (1 day).
- OAuth callback centralized at `https://portal.jjocllc.com/oauth2/callback`, session cookie scoped to `.jjocllc.com` — every `*.jjocllc.com` subdomain inherits the auth session. Adding a new subdomain needs **no Google Cloud OAuth client change** — DNS + Traefik router is enough.
- Middleware chain on API + webapp routers: `oauth2-jjoc-auth`, `security-headers`, `rate-limit`, `portal-expose-email` (defined in `jjocllc.yml`). ACME resolver: `letsencrypt`. Webhook routers (Square, Stripe, Plaid) deliberately omit every middleware — signature verification is the auth.

### Sandbox environment

Parallel deployment at `https://sandbox.bc.jjocllc.com` mirrors staging on the same host, fully isolated at container/volume/network layer. Used for pre-release feature testing (Square Phase 2/3 land here first). Lives at `/srv/portal/clients/sandbox-bc/` on the host. See `docker/sandbox-bc/README.md` for the full runbook (mysqldump + MinIO clone from staging, first boot, post-clone Square-row wipe since token encryption key differs).

### Future enhancements and known gaps

See `docs/FUTURE-ENHANCEMENTS.md` for planned work including multi-organization support per user and behavioral hardening (security/audit wiring). The hardening items must be completed before production data.

### Deferred ideas

- **Receipts/invoices CSV import from scanning app** — Shelved pending rethink. The user has a separate app that OCRs scanned receipts and emits two paired CSVs (header row per receipt + line items, linked by `receipt_id`, with a column indicating Bill vs Expense). Intended as a dedicated import flow (not the generic `Importable` pipeline), with fuzzy-match confirmation for vendors and for line items (→ Items for bills, → Accounts for expenses), fallback to "Unknown Vendor" and ad-hoc items. Open design questions before restart: exact CSV column contract, whether expenses should map line items to expense accounts or consolidate to a single category, and tax handling (leading candidate: use the bill `adjustment` field).
