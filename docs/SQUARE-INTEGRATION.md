# Square Integration

OAuth-based connection to Square sandbox/production with HMAC-verified webhooks. Phase 1 ships event capture; Phase 2 (in progress) turns events into Bigcapital documents; Phase 3 (planned) adds backfill + Plaid deposit auto-match.

## Phase 1 (shipped)

OAuth-based connection to Square sandbox/production, setup wizard (Clearing / Fees / Tips Payable / Walk-in Customer / Deposit Bank / Default Sales Revenue accounts — six fields after Phase-2 added the revenue account), Catalog item mapping, event log, and HMAC-verified webhook endpoint. Phase 1 logs/dedups inbound events.

**Tenant tables**: `square_connections`, `square_event_log`, `square_item_mappings`, `square_customer_mappings`.

**System tables**: `square_application_webhooks` (one row per environment — holds the app-level subscription id and the AES-256-GCM-encrypted Square signature key) and `square_merchant_index` ((merchant_id, environment) → (organization_id, connection_id), written by the OAuth callback so the app-level webhook receiver can route inbound events without needing tenant context up front).

Tokens stored encrypted via `SQUARE_TOKEN_ENCRYPTION_KEY` (AES-256-GCM, 64 hex chars).

**`SQUARE_APPLICATION_ACCESS_TOKEN`** (the application's PAT from Developer Dashboard → Credentials) is required: Square's Subscriptions API authenticates with the PAT, not seller OAuth tokens, which is why subscriptions are app-level (one per env, shared across all sellers) rather than per-seller. Path-A "per-seller subscription via OAuth scope" was attempted but Square sandbox apps do not grant `DEVELOPER_APPLICATION_WEBHOOKS_WRITE`; the correct API requires PAT auth.

Traefik config must route `/api/integrations/square/webhooks` at priority ≥ 20 *without* OAuth forward-auth middleware — HMAC signature is the webhook's auth; all other `/api` middleware is omitted. Each Square sandbox/production OAuth app supports only one redirect URI, so separate subdomains (staging vs sandbox) require separate Square apps.

**Sandbox testing requires an active test-seller session**: before clicking "Connect to Square" against a sandbox deploy, open the Square Developer Dashboard → Sandbox Test Accounts and click **Launch** on a test seller. Without an active `squareupsandbox.com` session in the same browser, the authorize endpoint 400s with *"To start the OAuth flow for a sandbox account, first launch the seller test account from the Developer Console."*

**Webhook flow**: on OAuth callback, `EnsureSquareApplicationWebhook.ensure(env)` idempotently registers (or no-ops) one app-level subscription via `POST /v2/webhooks/subscriptions` using the PAT; Square responds with a `signature_key` we encrypt and persist. Inbound webhook receiver at `/api/integrations/square/webhooks` (no path param) verifies HMAC against the app-level key, reads `merchantId` from the (camelCase'd by `SerializeInterceptor`) body, looks up the system index to find the owning tenant, sets CLS `organizationId`, then dispatches to the per-tenant `SquareEventRouter`.

Note: Square's "Send Test Event" feature uses a synthetic placeholder merchant_id (e.g. `G7MMEBVW021Q4`), so test events get rejected as `unknown_merchant`; trigger a real event from your test seller (sandbox seller dashboard → Customers → Add Customer is fastest) to validate end-to-end.

## Phase 2 (in progress)

Turns webhook events into real Bigcapital documents. **Step 1 + Step 2 shipped (commits `0bf622a29`, `2af5cc8ac`); Step 3 pending.** Architecture decisions worth knowing before resuming:

### Idempotency table

New tenant table `square_document_links` with unique key `(connection_id, square_object_type, square_object_id)`. Each Square external object gets at most one Bigcapital document. The `SquareDocumentLinks` service (`commands/SquareDocumentLinks.service.ts`) exposes `findLink`/`createLink`/`ensureLink` — `ensureLink` is the convenience wrapper handlers should use (looks up existing, runs caller-supplied creator + persists link in the same transaction). `SquareObjectType` union = `'payment' | 'payment_tip' | 'refund' | 'payout' | 'invoice'`. The synthetic `payment_tip` type lets the tip ManualJournal coexist in the same unique-key table as the SaleReceipt for the same payment id.

### Wizard activation

When the wizard transitions from `pending` → `active`, `EnsureSquareSystemItems` auto-creates a "Square Sales" Bigcapital item with `sell_account = default_sales_account_id` (the new 6th wizard field). The item id is persisted on `square_connections.square_sales_item_id` so activation is idempotent on re-saves. There is intentionally **no** "Square Tips" item: `ItemValidator.validateItemSellAccountExistance` enforces income-class root type, so a liability sell account is rejected. Tips therefore route through a ManualJournal — see below.

### Tip handling

`HandleSquarePayment` posts the SaleReceipt for the **subtotal only** (line items, no tip), then a separate `ManualJournal`: `Debit Clearing tip_amount / Credit Tips Liability tip_amount`. Both link to the Square payment id (`payment` and `payment_tip` types). Net GL effect across the two posts: gross to clearing, subtotal to revenue, tip to liability.

### Customer attribution

`ResolveBigcapitalCustomer` returns the wizard's walk-in customer when no Square customer is attached; returns the mapped row from `square_customer_mappings` when one exists; otherwise fetches from `/v2/customers/{id}`, creates a Bigcapital `Customer` (currency=USD, customerType=business if companyName else person), writes `auto_created=true` mapping, returns the new id.

### Per-line itemization

The payment handler fetches the Square Order via `/v2/orders/{order_id}` to get `line_items[]`. Each Square line maps to a `SaleReceipt` entry via `square_item_mappings.square_catalog_object_id` → `item_id`. Unmapped lines fall back to `connection.squareSalesItemId` ("Square Sales" auto-created item). Payments without an `order_id` (rare — direct charges) post a single fallback line for the gross-minus-tip amount. Only payments with `status === 'COMPLETED'` are processed; APPROVED/PENDING/CANCELED payments mark the event log row done with a `Skipped: skipped_status_X` note.

### Dispatch wiring

`SquareEventRouter.dispatch(entryId, connection)` is now a real switch on `event_type`. The webhook controller hands the loaded connection to dispatch (it had to load it for HMAC verification + tenant routing anyway), so the router skips a redundant tenant proxy. Errors mark the row `failed` with `error_text` truncated to 1024 chars; the event-log webapp page displays `error_text` in a tooltip with intent-DANGER on failed rows.

### Cross-module wiring

`ItemsModule`, `CustomersModule`, `SaleReceiptsModule`, `ManualJournalsModule` each had their create-service added to `exports` so `SquareIntegrationModule` can call them. `CreateItemService` is `Scope.REQUEST`, which propagates request-scoping up the chain (`EnsureSquareSystemItems` → `UpdateSquareConnectionSettings` → etc.). All call sites already run within request context so this is fine.

### v1 limitations (deferred)

USD only; Square's per-line `tax_money` is ignored; order-level discounts not allocated back to lines; refund/payout/customer-sync handlers not yet wired (Step 3); reprocess UI for `failed` rows is admin-via-DB only (Step 4 candidate).

### Step 3 plan when resuming

- `HandleSquareRefund` (refund.created/refund.updated → CreditNote linked to original SaleReceipt's customer)
- `HandleSquarePayout` (payout.sent/payout.paid → ManualJournal: `Debit Bank net + Debit Fees Expense fees / Credit Clearing gross`; payout.failed → log only, no GL)
- `HandleSquareCustomer` (customer.created/customer.updated → upsert Bigcapital `Customer` and `square_customer_mappings`)

Pattern is identical to `HandleSquarePayment` — register handler in `SquareEventRouter.dispatch` switch, add to module providers, add a `SquareObjectType` value if needed (refund/payout/invoice already in the union).

### Test plan to validate Step 2 before Step 3

Run after deploy and `database_migration` recreate so the new tenant migration applies:

1. Wizard requires the 6th "Default Sales Revenue Account" field
2. On save, `SQUARE_CONNECTIONS.SQUARE_SALES_ITEM_ID` populates and `STATUS='active'`
3. `ITEMS` table has a `Square Sales` row with `SELLABLE=1` and `SELL_ACCOUNT_ID=<defaultSalesAccountId>`
4. Trigger a real seller payment via the sandbox seller dashboard's Virtual Terminal (sandbox card `4111 1111 1111 1111`, e.g. $10.50 + $1.50 tip)
5. `SQUARE_EVENT_LOG` row goes to `STATUS=done` with `ERROR_TEXT` like "Created SaleReceipt N + tip ManualJournal M"
6. `SQUARE_DOCUMENT_LINKS` has a `payment` row and a `payment_tip` row for the same Square payment id
7. GL totals: Clearing debit = gross, Revenue credit = subtotal, Tips Liability credit = tip

## Square-specific bug fixes

### `require('@/...')` doesn't resolve at runtime in Objection `relationMappings`

The `@/` TypeScript path alias is a compile-time rewrite for `import` only. `require('@/foo')` inside `static get relationMappings()` is evaluated at runtime by Node's module resolver, which has no idea what `@/` means and throws `Cannot find module`. Two Square model files (`SquareItemMapping.model.ts`, `SquareCustomerMapping.model.ts`) had `@/`-aliased `require()` calls — fixed to relative paths (`'../../Items/models/Item'`, `'../../Customers/models/Customer'`) to match every other model in the repo.

### Square OAuth callback had no tenant context

Square's redirect to `/api/integrations/square/oauth/callback` is a third-party browser hop that doesn't carry our `organization-id` header, so the CLS middleware set `organizationId` to `undefined` and the tenant DB string materialized as `bigcapital_tenant_undefined`. Fixed by carrying tenant identity through the OAuth `state` parameter (its textbook use): `/oauth/start` signs `{oid, typ: 'square-oauth-state'}` into a 10-min JWT using the existing `JwtService`; `/oauth/callback` verifies the JWT, calls `cls.set('organizationId', oid)` before invoking the handler. State token gives CSRF protection for free. `SquareIntegrationModule` had to register `JwtModule` locally (with HS384 + `jwt.secret`) since `AuthModule` doesn't re-export it, and import `TenancyModule` for `TenancyContext`.

### Square webapp hooks returned snake_case

Unlike most query hooks (which use `useRequestQuery` or pipe through `transformToCamelCase`), the Square hooks at `packages/webapp/src/hooks/query/square-integration.ts` used bare `res.data`. The global `SerializeInterceptor` converts responses to snake_case, so `connection.merchantId`, `connection.clearingAccountId`, etc. were all `undefined` in the wizard. Fixed by piping every Square query/mutation hook's `.then((res) => ...)` through `transformToCamelCase(res.data)`.

### Square setup wizard crashed: `Cannot destructure property 'setFieldValue' of 'useFormikContext(...)' as it is undefined`

The shared `AccountsSelect` and `CustomersSelect` components are hard-coupled to Formik (they call `useFormikContext()` internally). The wizard had been built with `useState`. Fixed by wrapping the form in `<Formik enableReinitialize>` and extracting a `<WizardBody>` child component so `useFormikContext` reads from a mounted provider — calling it in the same function that renders `<Formik>` returns `undefined` (parent's render scope has no Formik context yet).

### `SerializeInterceptor` mutates inbound request bodies snake→camelCase

The global interceptor at `packages/server/src/common/interceptors/serialize.interceptor.ts` runs `snakeToCamel` on `request.body` *and* `request.query` (line 68-69). For app-internal traffic (webapp → API), this is fine since the webapp's hooks now run `transformToCamelCase` on responses too. But for **third-party webhook payloads** (Square, Stripe, Plaid…), the controller sees camelCased keys, NOT the snake_case JSON the third party sent. Square's `merchant_id`, `event_id`, `created_at` arrive as `merchantId`, `eventId`, `createdAt`. `req.rawBody` still holds the original bytes (captured by Nest's `rawBody: true` body parser before the interceptor runs), which is what HMAC verifies against — but any code reading `body.field_name` returns undefined. **New webhook handlers in this codebase must read camelCase keys.**
