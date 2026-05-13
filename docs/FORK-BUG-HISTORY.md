# Fork Bug-Fix History

Post-mortems for bugs fixed in this fork. Active gotchas (rules to remember) live in `.claude/CLAUDE.md`; this file is the archive of context for _why_ a fix was made.

For Square-specific bugs, see `docs/SQUARE-INTEGRATION.md`.

## Infrastructure / build

### Redis config permissions

`COPY --chown=redis:redis` in Redis Dockerfile.

### Migration path

`working_dir: /app/packages/server` in compose so system migration directory resolves correctly.

### Empty email verification token

`AuthMailSubscriber` skips sending verification email when `SIGNUP_EMAIL_CONFIRMATION=false` (token is empty).

### Rate limit env var mismatch

`API_RATE_LIMIT` in `.env.example` is a legacy/dead variable that the server doesn't read. Actual vars are `THROTTLE_GLOBAL_LIMIT`/`THROTTLE_GLOBAL_TTL` (default 100 req/60s) and `THROTTLE_AUTH_LIMIT`/`THROTTLE_AUTH_TTL` (default 10 req/60s). Updated deploy docs to reference the correct names.

### `sed` `|` delimiter conflicts with regex alternation

The sed snippet for image-tag bumps in `deploy.sh` uses `|` as the substitute delimiter to avoid escaping path slashes. That works fine for simple patterns but breaks when the regex itself uses `|` for alternation (e.g. `(server|webapp)`) — sed reads the inner `|` as another delimiter and errors with `unknown option to 's'`. Fix: switch the delimiter to `#` or run two simpler `sed` commands without alternation. The deploy.sh script uses the latter approach (per-target sed in a loop) and is unaffected.

### `docker/sandbox-bc/deploy.sh` syncs image tags but not other compose changes

The script's remote step runs a targeted `sed` against `docker-compose.yml` to bump only `bigcapital-fork-{server,webapp}:<env>-v<N>` tags. Any other compose change (new env-var passthrough, port change, new service, etc.) is invisible to the script and won't reach the host. After making such a change in the repo, manually edit `/srv/portal/clients/<env>-bc/docker-compose.yml` on the host (or `scp` the updated file in) before running `up -d --force-recreate`. Otherwise the new env var is in the image but won't be injected into the running container.

## UI labels and date handling

### UI label inconsistencies

Standardized "Statement"→"Note", "Reference #"→"Reference No.", date/account field capitalization, "Full Amount"→"Amount", credit note using invoice date label, vendor credit using bill date label, withdrawal account mislabeled as deposit account.

### DateInput "Invalid date" on calendar navigation

Blueprint v4.4.37's `DatePicker.handleMonthChange` fires `onChange(null)` when the user clicks an already-selected day during month navigation. `handleDateChange` in `packages/webapp/src/utils/index.tsx` now guards against `null` before calling `moment(date).format(...)`.

### Date format inconsistency

All 50 date input/edit fields across the app standardized to `MM/DD/YYYY` via `momentFormatter('MM/DD/YYYY')`. Replaced `YYYY/MM/DD`, `YYYY-MM-DD`, and locale-dependent `toLocaleDateString()` patterns.

### Date inputs shifted by ±1 calendar day on save / display

Every form built on `FDateInput` from `@blueprintjs-formik/datetime` — invoice / money in & out / expense / journal / vendor financial / project / etc. — saved dates on the wrong calendar day. The picker's `parseDate` returns a JS Date at _local_ midnight, but the upstream Formik bridge then calls `Date.toISOString()` on it, tagging the instant `Z` and shifting the calendar day in any non-UTC client. The default parser compounds it on edit by reading a bare `YYYY-MM-DD` string with `new Date(str)`, which JS treats as **UTC** midnight, then re-displaying it in local tz. Direction of the shift depends on the user's tz vs the server's, but the round trip is always unstable. Fixed by overriding `formFormatDate` and `formParseDate` in the shared `momentFormatter` helper (`packages/webapp/src/utils/index.tsx`) so every FDateInput site round-trips through Formik as a tz-free `YYYY-MM-DD` string. `formParseDate` slices the first 10 characters of the incoming value so existing server responses (DATE columns serialized as ISO instants like `"2026-05-13T00:00:00.000Z"`) still round-trip without a server-side change.

### "Other Income" label confusing in Category dropdown

`banking.other_income` i18n key in `src/lang/en/index.json` renamed from "Other income" to "Income". The underlying value `other_income` is kept as-is (accounting term for non-operating income; stored in DB). The label "Expenses" (for `other_expense`) already omitted "Other" — this makes income consistent.

## List pages, filters, pagination

### Import preview auto-refresh

`staleTime: Infinity` and `refetchOnWindowFocus: false` on import preview/meta queries. Added missing `Account` case to `invalidateResourcesOnImport()`.

### List pagination broken

`DynamicFilterQueryDto` was missing `page` and `pageSize` fields so the whitelist validator stripped them and server defaults always won. Added both fields to the shared DTO so all list endpoints (expenses, bills, invoices, etc.) respect the client's requested page and page size. Also corrected the expense list default from 12 to 20 to match the UI selector.

### Filter button crashes all list pages

`GET /resources/:model/meta` returned the meta object directly. After `SerializeInterceptor` applies camelToSnake the response body IS the meta object, but the webapp does `res.data.resource_meta` expecting it wrapped. Always received `undefined`, fell back to empty fields, and the filter component crashed. Fixed by returning `{ resourceMeta }` from the controller so the interceptor emits `{ resource_meta: {...} }`.

## Forms and selects

### Vendor selector missing from expense form

Added vendor/payee field (`payee_id`) to the expense form header, wired to `useVendors` via `ExpenseFormPageProvider`.

### Vendor/customer duplicate code constraint

`CONTACTS_CODE_UNIQUE` rejects a second empty-string `code` (MySQL treats `''` as duplicate but `NULL` as non-duplicate). Fixed in `CreateEditVendorDTO.ts` and `CreateEditCustomerDTO.service.ts` by coercing falsy `code` to `null` before insert/update. Existing rows with `CODE = ''` must be patched manually: `UPDATE CONTACTS SET CODE = NULL WHERE CODE = '';` on each tenant DB. **Done on staging 2026-04-21** for both tenant DBs (`bigcapital_tenant_35i5f1mo1oztqd` and `bigcapital_tenant_35i5f1mo1phc5w`).

### Expense form vendor/customer dropdowns missed older records

`ExpenseFormPageProvider` called `useVendors({}, {})` and `useCustomers()` with no `page_size`, so the server returned only the default first page. `VendorsSelect` / `CustomersSelect` filter purely client-side over the `items` prop, so vendors and customers beyond page 1 never appeared in the dropdown and weren't searchable either. Fixed to `useVendors({ page_size: 10000 })` and `useCustomers({ page_size: 10000 })` to match the bill / invoice / vendor-credit-note form providers. **Reminder for any new form**: dropdowns built on `FSelect` filter in-memory — the provider must request a large enough page or those records are invisible.

## Attachments / S3

### Attachment upload S3 endpoint crash

`S3.module.ts` now only passes `endpoint` and `forcePathStyle` to `S3Client` when `S3_ENDPOINT` is non-empty. An empty/missing `S3_ENDPOINT` previously caused `ERR_INVALID_URL` (500) on every file upload.

### Attachment upload ACL error

Removed hardcoded `acl: 'public-read'` from `multerS3` config in `Attachment.module.ts`. Modern S3 buckets and MinIO have ACLs disabled by default; the setting was also dead code (`true ? 'public-read' : 'private'`). Files are served via presigned URLs so no public ACL is needed.

### Attachment upload path-style routing

`S3_FORCE_PATH_STYLE` was missing from the server's environment block in `docker-compose.prod.yml`. Without it the AWS SDK constructs virtual-hosted URLs (`{bucket}.{host}`) which fail DNS on MinIO. Added `- S3_FORCE_PATH_STYLE=${S3_FORCE_PATH_STYLE}` to the compose env block. Note: `docker compose restart` does not apply compose file changes — use `docker compose up -d server` after any compose or env update.

### Attachment view URL unreachable from browser

`GetAttachmentPresignedUrl.ts` now returns a server-proxied URL (`BASE_URL/api/attachments/:key`) when `S3_ENDPOINT` is set, instead of a presigned URL containing the internal MinIO hostname. Real AWS S3 (no custom endpoint) continues using presigned URLs.

### Attachment view 401

`GET /attachments/:id` marked `@PublicRoute()` so it is accessible without a JWT. The file key acts as the implicit auth token (same model as a real presigned URL); Traefik OAuth gates the deployment at the network level.

### Attachment view 500

`mime-types` is a CJS module with no default export; changed `import mime from 'mime-types'` to `import * as mime from 'mime-types'` in `Attachments.controller.ts`.

## Bank-transaction categorize / match flows

### Categorize transaction category dropdown resets to "Other income"

All six account sub-components in `CategorizeTransactionFormContent.tsx` were `React.lazy`-loaded. The `<Suspense>` boundary sits above `<Formik>`, so selecting any new type suspended the lazy module, unmounted the entire form, and remounted it from `initialValues` (always `other_income` from the server autofill). Fixed by converting to static imports — the sub-components are in the same lazy chunk as the drawer anyway.

### Categorize transaction sub-form doesn't switch when type changes

`CategorizeTransactionFormSubContent` used `useFormikContext()` to read `transactionType`, but the `FastField[name='category']` ancestor was blocking re-renders triggered by changes to a different field. Fixed by calling `useField('transactionType')` directly in `CategorizeTransactionFormContent` (the parent) and passing the value as a prop to `CategorizeTransactionFormSubContent` — guaranteeing a re-render whenever the field changes.

### Edit categorization dialog: account dropdown empty and unfiltered

`AccountsSelect` was called with `items={[]}` so no accounts ever appeared. Added `useAccounts()` and a `CATEGORY_ACCOUNT_ROOT_TYPES` map so the dropdown filters to the correct account type when the transaction type changes. Also fixed `'OwnerDrawings'` → `'OwnerDrawing'` to match the server's `CASHFLOW_TRANSACTION_TYPE` constant (mismatch would cause a server validation error on save).

### Categorize transaction Category dropdown limited to 3 options

`CategorizeTransactionFormContent` filtered `transactionTypes` to only MoneyIn or MoneyOut options based on `isDepositTransaction`. Fixed to show all 6 types always, with the direction-relevant options ordered first (`[...MoneyInOptions, ...MoneyOutOptions]` for deposits, reversed for withdrawals).

### Match aside silently dropped _all_ expense candidates on MariaDB-on-Linux

After the split-payment-aware matching feature shipped, the matching aside on every bank transaction stopped showing expense candidates entirely — bills, invoices, manual journals, and cashflow candidates kept appearing, so it looked like matching "mostly worked" and the missing rows seemed account-/date-specific. Root cause: `GetMatchedTransactionsByExpenses.ts` filters out already-matched splits with a `whereNotExists(...)` subquery whose inner JOIN was written with two `whereRaw('matched_bank_transactions.reference_id = expense.id')` / `... .reference_sub_id = expense_payment_splits.id` clauses. `whereRaw` is verbatim and bypasses Knex's `snakeCaseMappers({ upperCase: true })`. On MariaDB-on-Linux (`lower_case_table_names=0`) the actual tables are `MATCHED_BANK_TRANSACTIONS` / `EXPENSE_PAYMENT_SPLITS`, so the subquery threw `Table 'tenant.matched_bank_transactions' doesn't exist`. The error was swallowed by `GetMatchedTransactions.service.ts`'s `PromisePool.withConcurrency(2).process(...)` — per-task errors go to `results.errors` and are never read; only `results.results` is flattened — so the API returned a 200 with the other four candidate types intact and zero expense candidates, no log unless you went looking. Fixed by replacing both `whereRaw` calls with `whereColumn(...)` so the identifier mapper runs and the qualifiers come out as `MATCHED_BANK_TRANSACTIONS.REFERENCE_ID` / `EXPENSE_PAYMENT_SPLITS.ID` etc. Diagnostic that nailed it: running the service's effective SQL by hand — uppercase identifiers returned the expected splits, lowercase identifiers errored with "table doesn't exist".

### Match aside showed "undefined for $X" on cashflow-typed possible matches

Five sibling transformers populate `transsactionTypeFormatted` (typo intentional, both webapp and server agree). Bills/Expenses/Invoices/ManualJournals hardcode their label string; only `GetMatchedTransactionCashflowTransformer` read `transaction.transactionTypeFormatted` from the model. That virtual attribute was listed in `BankTransaction.virtualAttributes` but its getter was commented out, so the field was always undefined → `${undefined} for $X` rendered as the literal string. Fixed the cashflow transformer to compute the label via `getCashflowTransactionFormattedType(...)` + `i18n.t(...)`. Also cleaned up two related issues at the same time: removed the orphan `'transactionTypeFormatted'` from `BankTransaction.virtualAttributes` (and deleted the commented-out getter), and fixed `BankTransactionTransformer.transactionTypeFormatted` which was calling `i18n.t('OtherIncome')` directly (PascalCase, no namespace match) instead of mapping through `getCashflowTransactionFormattedType` first to get `'transaction_type.other_income'`.

## CSV import

### CSV import 500 for Customer / Vendor / SaleReceipt / Bill / TaxRate

`POST /api/import/file` errored with `No importable service found for resource "X". Make sure the resource has an @ImportableService decorator registered.` `@ImportableService({ name })` registers the importable in a `Map` at module-load time via the decorator side-effect, but five upstream importables shipped _without_ the decorator: `CustomersImportable`, `VendorsImportable`, `BillsImportable`, `SaleReceiptsImportable`, `TaxRatesImportable`. (Items, SaleInvoices, Expenses, etc. all had it.) Fixed by adding the decorator to each. `TaxRate` is registered with the literal string `'TaxRate'` because the model class is `TaxRateModel` while the webapp sends `TaxRate` as the resource name; using `TaxRateModel.name` would mismatch.

**Sanity check for any new importable**: `grep -L '@ImportableService' packages/server/src/modules/**/*Importable*.ts` should print nothing.

### CSV import enum fields silently rejected ("X is a required field")

For fields with `fieldType: 'enumeration'` (e.g. `Item.type` with options `inventory|service|non-inventory`), the import-row parser at `Import/_utils.ts` was matching CSV values only against `option.label` case-insensitively. But option labels in the model meta are i18n _keys_ (`'item.field.type.service'`) and `ResourceService.localizeField` only translates `field.name` and `field.importHint` — never the option labels. So no possible CSV value could match: neither the localized label (`Service`), nor the lowercase key (`service`), nor anything reasonable. The parser silently set the field to `undefined`, then the Yup `required()` check fired with the misleading message _"Item Type is a required field"_ even though every CSV row populated it. Fixed by also matching against `option.key` (case-insensitive). Lowercase enum keys (`service`, `inventory`, `non-inventory`) now work directly.

**CSV authoring rule for enum fields**: emit the lowercase key — `service`, `inventory`, `non-inventory`, etc. — not the labels.

### `filterSupportFeatures` ignored its async dependencies, leaving Branch/Warehouse fields always required

`ResourceService.filterSupportFeatures` filters out fields gated by `Features.BRANCHES` / `Features.WAREHOUSES` when those features are off. But it called the async `branchesSettings.isMultiBranchesActive()` / `warehousesSettings.isMultiWarehousesActive()` _without_ awaiting them, capturing the returned `Promise<bool>` into `isMultiFeaturesEnabled`. Promises are objects → always truthy → `!isMultiFeaturesEnabled` is always `false` → the filter never removed the field, regardless of what was in the SETTINGS table. Symptom: SaleInvoice (and any model with `features: [Features.BRANCHES]` on a field) imports failed with _"Branch is a required field"_ / _"Warehouse is a required field"_ on every row, even with no `features` rows in `SETTINGS` and no UI toggle. Fixed by making `filterSupportFeatures` async and awaiting the two settings calls. Cascaded `async`/`await` through `getResourceFields2`, `getResourceColumns` (now both return Promises), and the five callers across Import + Export modules.

**Lesson for any new feature-gated field**: the `features:` array on a field's meta only takes effect if `filterSupportFeatures` actually runs against awaited booleans — the path goes through `getResourceFields2(...)` which is now async, so callers must `await`.

### `PaymentReceive` resource name doesn't match the `PaymentReceived` model class

The webapp sends `PaymentReceive` (no `-d`) as the resource for both the importable lookup and `getResourceModel`, but the Nest provider + Importable were registered under `PaymentReceived`. CSV import errored with _"Nest could not find PaymentReceive element"_ at `ResourceService.getResourceModel`. Fixed in two places: (1) added a `RESOURCE_NAME_ALIASES` map in `Resource/_utils.ts` so `resourceToModelName('PaymentReceive')` returns `'PaymentReceived'`, and (2) registered `PaymentsReceivedImportable` under the literal string `'PaymentReceive'` (same precedent as `TaxRate`/`TaxRateModel`).

When you see _"Nest could not find X element"_ on import for some resource, add an alias entry — don't rename the model class.

### `CustomersImportable` doesn't dedupe by Display Name — re-imports bloat the table 1:1

Every row in customers.csv calls `createCustomer` unconditionally, no upsert by Display Name. Re-uploading the same customers.csv (e.g. to pick up new Square customers) creates a fresh row for every existing customer, doubling the contact list. The other transactional importables don't have this problem because their natural keys are deterministic and unique-checked: items by `Item Name` (Bigcapital errors `name already exists`), invoices by `Invoice No.` (errors `INVOICE_NUMBER_NOT_UNIQUE`), payment-received by `Payment Receive No.`, sale-receipts by `Receipt Number` (we use `REC-${payment.id.slice(-8)}` deterministic per Square payment).

Fix when this happens: a `MERGE + DELETE` pass against `CONTACTS` keyed on (DISPLAY_NAME, CONTACT_SERVICE) — keep the lower ID (older, has transactions), copy any non-empty newer email/company onto it via COALESCE, delete the higher ID. The bulk SQL is a single `UPDATE ... JOIN` + `DELETE c2 FROM ... INNER JOIN c2 ON c1.ID < c2.ID`.

**Practical workflow rule for refreshing Square data into an already-imported tenant**: items / invoices / invoice_payments / receipts are safe to re-upload (collisions silently skip); customers is NOT — either skip the re-upload or run the dedupe SQL after.

## Expenses

### `DELETE /expenses/:id` 500 — `expense_payment_splits` FK never cleaned up

After the split-payment-expenses feature shipped, `DELETE /api/expenses/:id` returned 500 on every attempt. The fork's `20260423100000_create_expense_payment_splits_table.ts` migration declares `expense_id` as a plain FK to `expenses_transactions(id)` with no `ON DELETE CASCADE`, and the companion backfill `20260423100001_backfill_expense_payment_splits.ts` inserts a split row for every existing expense — so post-migration, _every_ expense had at least one child row, and _every_ delete tripped the FK. `DeleteExpense.service.ts` already deletes `expense_transaction_categories` rows explicitly under the same `trx` before deleting the expense; the new `expense_payment_splits` table needed the same treatment but was missed when the feature landed. Fix: inject `ExpensePaymentSplit` and add a `.where('expenseId', expenseId).delete()` line right after the categories cleanup. `BulkDeleteExpensesService` delegates per-row to `DeleteExpense`, so it's covered too. The frontend `Cannot read properties of undefined (reading 'find')` from `ExpenseDeleteAlert` was downstream noise — the alert's error-handler tried to look up an i18n message on the empty 500 body and threw; it disappears once delete succeeds.

**Lesson — when adding a child table whose FK references an existing parent**: the fork's pattern is service-side cascade (explicit `.delete()` lines under the parent's UoW transaction), not DB-level `ON DELETE CASCADE`. Audit the parent's Delete service whenever you add a child table — a missing line is a 500 waiting to happen, and won't surface in dev until something populates the child row. The backfill migration here meant "production-only" cases were instantly universal.

## Ledger / GL emission

### Trial Balance off by clean dollar amounts — silent partial commits in `LedgerEntriesStorage.saveEntries`

The trial balance was off by $260 in Feb and $1,312.51 in March (cumulative). Drilling in by `(REFERENCE_TYPE, REFERENCE_ID)` showed 19 SaleInvoices across Feb–May 2026 each missing exactly one credit leg — the A/R debit and most credits were present, but one specific line item's CR row was simply absent from `accounts_transactions`. The missing row's amount always equalled the per-invoice imbalance to the cent, and no obvious data attribute (sell account, item id, line position, rate, quantity, discount) distinguished missing rows from present ones — strong signal of a non-deterministic write failure. Root cause: `LedgerEntriesStorage.service.ts:saveEntries` ran ledger-entry inserts via `async.queue(this.saveEntryTask, 10)` — concurrency 10 inside a single Knex transaction, with no `error` listener and `await drain()` that resolves regardless of per-task failures. Whichever entry's `INSERT` happened to lose a connection-state race (Knex transactions are not safe for concurrent queries; the underlying mysql2 driver serializes via its own queue and surfaces errors like "Cannot reuse trx", "lock wait timeout", or transient state mismatches) had its task error swallowed by the queue's missing handler — the queue continued, `drain()` resolved cleanly, and the wrapping unit-of-work committed thinking everything succeeded. Fix: replace the queue with a sequential `for…await` loop. While there, also fixed `UnitOfWork.withTransaction` which called `_trx.commit()` and `_trx.rollback()` without `await`, so the surrounding function could return before the trx finished — a separate latent bug that didn't cause this issue but was the same shape (silent partial completion). Removed the now-dead `saveEntryTask` and `ISaveLedgerEntryQueuePayload` interface in the same pass.

**Data backfill**: 20 INSERTs total — 19 missing CR legs (one per affected invoice) plus a $18 A/R top-up on invoice 106 (whose A/R debit was emitted as the subtotal $1593 instead of subtotal + $18 adjustment = $1611, so the $18 OtherCharges CR leg sat on top of an under-emitted A/R DR). Verification chain: per-invoice diff = 0, per-month diff = 0 across all months in the books, and the master `HAVING ABS(SUM(DEBIT)-SUM(CREDIT)) > 0.005` master query returns Empty Set.

**Diagnostic recipe for future GL audits** (kept in CLAUDE.md): trial-balance imbalance → group `ACCOUNTS_TRANSACTIONS` by `(REFERENCE_TYPE, REFERENCE_ID)` and `HAVING ABS(SUM(DEBIT)-SUM(CREDIT)) > 0.005` — names the offending transactions in seconds. Then per-invoice/expense, join `ITEMS_ENTRIES` (or relevant child table) to existing GL legs by `ITEM_ID + ACCOUNT_ID` to spot which line wasn't emitted. Generate INSERTs that mirror the existing GL pattern; wrap in `START TRANSACTION` and verify before `COMMIT`.
