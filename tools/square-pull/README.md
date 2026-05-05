# square-pull

One-shot CLI for pulling a date-range slice of seller data from the Square REST API into NDJSON files. Used as the first step of a Square → Bigcapital CSV import pipeline.

## Get an access token

The fastest path: **Square Developer Dashboard → Applications → [your app] → Production tab → Access token**. This token is bound to the seller account that owns the app. (For sandbox, use the Sandbox tab.)

## Run

```bash
SQUARE_ACCESS_TOKEN=EAAAEx... \
  node tools/square-pull/pull.mjs --since 2026-04-01 --until 2026-04-08
```

For sandbox:

```bash
SQUARE_ACCESS_TOKEN=EAAAEx... SQUARE_ENV=sandbox \
  node tools/square-pull/pull.mjs --since 2026-04-01 --until 2026-04-08
```

The `--since` and `--until` dates are interpreted in UTC (start-of-day to end-of-day). They constrain the time-bounded endpoints (payments, refunds, payouts, orders, invoices). Customers, items, and locations are full-list pulls — no date filter.

Output writes to `square-import-sample/` at the repo root by default (gitignored). Pass `--out path/to/dir` to override. The directory is **wiped on each run** so re-pulls are deterministic. Endpoints that return zero rows still create a zero-byte file, so you can tell "called, empty" from "didn't run".

> **Note:** `/v2/invoices/search` does not support a date filter (Square's `InvoiceFilter` only takes `customer_ids` + `location_ids`), so `invoices.ndjson` always contains *all* invoices for the location regardless of `--since/--until`. Convenient for backfill — just be aware.

## Files produced

| File | Endpoint | Notes |
|---|---|---|
| `locations.ndjson` | `GET /v2/locations` | needed for invoice/order queries |
| `customers.ndjson` | `GET /v2/customers` | full directory |
| `items.ndjson` | `GET /v2/catalog/list` | items, variations, categories, modifiers, taxes |
| `payments.ndjson` | `GET /v2/payments` | date-bounded |
| `refunds.ndjson` | `GET /v2/refunds` | date-bounded |
| `payouts.ndjson` | `GET /v2/payouts` (per location) + `/payout-entries` | each payout has an injected `_entries` array with the per-payment fee breakdown |
| `invoices.ndjson` | `POST /v2/invoices/search` | filtered by location |
| `orders.ndjson` | `POST /v2/orders/search` | provides `line_items` for payments + invoices |

## Format

Newline-delimited JSON (one Square API object per line), unmodified except for the `_entries` field added to each payout. Easy to inspect (`head`, `jq`, `wc -l`) and re-process without re-hitting the API.

```bash
wc -l square-import-sample/*.ndjson
jq -s '.[0] | keys' square-import-sample/payments.ndjson
```

## Limits

- No retry on rate limits (429). Square's quota is generous for read endpoints; if you hit it, wait a minute and re-run with a smaller date window.
- Payouts in **Square sandbox don't actually settle**, so sandbox payout pulls usually return zero. Pull production for real payout data.

## Step 2 — transform NDJSON to Bigcapital CSVs

```bash
node tools/square-pull/transform.mjs
```

Reads `square-import-sample/*.ndjson` and writes `square-import-sample/csv/*.csv`. No flags — date range and account names are baked in (edit constants at the top of `transform.mjs` if needed).

| CSV | Importable | Source |
|---|---|---|
| `customers.csv` | Customer | Square `/v2/customers` |
| `items.csv` | Item | Catalog ITEM_VARIATIONs + de-duped ad-hoc line item names from orders |
| `invoices.csv` | SaleInvoice | Non-CANCELED Square invoices, joined with their orders for line items (one row per line) |
| `invoice_payments.csv` | PaymentReceived | One row per PAID invoice (closes the open invoice) |
| `receipts.csv` | SaleReceipt | COMPLETED non-invoice payments, joined with orders for line items |

**What the transform does NOT produce yet:** refunds (zero in test data), payouts (deferred to Bigcapital UI — match each bank deposit against contributing receipts and reconcile fees as `OtherExpense` via the Reconcile aside).

## Step 3 — import into Bigcapital (staging)

**Prerequisites in your Bigcapital tenant before importing:**

1. Phase-2 Square wizard must be activated. It creates the three names the CSVs reference: `Square Sales` (account + sellable item), `Square Clearing` (account), `Walk-in Customer`. If your wizard used different names, search-and-replace the CSVs (or edit the constants at the top of `transform.mjs` and re-run).
2. (Optional but recommended.) Take a tenant DB snapshot — these are large imports and rolling back row-by-row is tedious if something looks wrong.

**Run the imports in this order** (Settings → Import in the webapp; pick the resource, upload the CSV):

1. `customers.csv`
2. `items.csv`
3. `invoices.csv`
4. `invoice_payments.csv` — must run AFTER invoices, references invoices by `Invoice No.`
5. `receipts.csv`

Each importable runs sequentially (concurrency=1) so a 50-row import is roughly 30s–1min. Watch the import preview for column-mapping warnings before clicking Import.
