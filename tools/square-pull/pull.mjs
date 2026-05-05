#!/usr/bin/env node
// Pull a date-range slice of Square seller data into NDJSON files for later
// transformation into Bigcapital-shaped CSVs. Uses the Square REST API
// directly via fetch — no SDK install required (Node 18+).
//
// Usage:
//   SQUARE_ACCESS_TOKEN=... node tools/square-pull/pull.mjs \
//     --since 2025-04-01 --until 2025-04-08
//
// Optional:
//   SQUARE_ENV=sandbox        # default: production
//   --out path/to/dir         # default: square-import-sample
//
// Outputs (one JSON object per line):
//   locations.ndjson, customers.ndjson, items.ndjson,
//   payments.ndjson, refunds.ndjson, payouts.ndjson (with _entries),
//   invoices.ndjson, orders.ndjson

import { mkdir, appendFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const ENV = process.env.SQUARE_ENV ?? 'production';
const BASE =
  ENV === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';
const SQUARE_VERSION = '2024-09-19';

if (!TOKEN) {
  console.error('SQUARE_ACCESS_TOKEN env var required');
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const since = args.since;
const until = args.until;
const outDir = args.out ?? 'square-import-sample';

if (!since || !until) {
  console.error('--since and --until required (YYYY-MM-DD)');
  process.exit(1);
}

const beginTime = `${since}T00:00:00.000Z`;
const endTime = `${until}T23:59:59.999Z`;

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

console.log(`Pulling ${since} → ${until} from Square ${ENV} → ${outDir}/`);

const locations = await pullLocations();
const locationIds = locations.map((l) => l.id);

await pullPaginated('customers.ndjson', 'GET', '/v2/customers', {}, 'customers');

await pullPaginated(
  'items.ndjson',
  'GET',
  '/v2/catalog/list',
  { types: 'ITEM,ITEM_VARIATION,CATEGORY,MODIFIER,MODIFIER_LIST,TAX' },
  'objects',
);

await pullPaginated(
  'payments.ndjson',
  'GET',
  '/v2/payments',
  { begin_time: beginTime, end_time: endTime },
  'payments',
);

await pullPaginated(
  'refunds.ndjson',
  'GET',
  '/v2/refunds',
  { begin_time: beginTime, end_time: endTime },
  'refunds',
);

await pullPayouts(locationIds);

await pullPaginated(
  'invoices.ndjson',
  'POST',
  '/v2/invoices/search',
  {
    query: { filter: { location_ids: locationIds } },
    limit: 200,
  },
  'invoices',
);

await pullPaginated(
  'orders.ndjson',
  'POST',
  '/v2/orders/search',
  {
    location_ids: locationIds,
    query: {
      filter: {
        date_time_filter: {
          created_at: { start_at: beginTime, end_at: endTime },
        },
        state_filter: { states: ['COMPLETED', 'OPEN', 'CANCELED'] },
      },
    },
    limit: 500,
  },
  'orders',
);

console.log(`\nDone. ${outDir}/ ready.`);

// ---------------------------------------------------------------------------

async function pullLocations() {
  console.log('Locations…');
  const data = await api('GET', '/v2/locations');
  const locs = data.locations ?? [];
  await writeNdjson('locations.ndjson', locs);
  console.log(`  locations.ndjson: ${locs.length}`);
  return locs;
}

async function pullPayouts(locationIds) {
  console.log('Payouts (+ entries)…');
  await touchFile('payouts.ndjson');
  let count = 0;
  for (const locationId of locationIds) {
    for await (const page of paginate('GET', '/v2/payouts', {
      location_id: locationId,
      begin_time: beginTime,
      end_time: endTime,
    })) {
      const payouts = page.payouts ?? [];
      for (const payout of payouts) {
        const entries = [];
        for await (const epage of paginate(
          'GET',
          `/v2/payouts/${payout.id}/payout-entries`,
          {},
        )) {
          entries.push(...(epage.payout_entries ?? []));
        }
        payout._entries = entries;
      }
      if (payouts.length) await writeNdjson('payouts.ndjson', payouts);
      count += payouts.length;
      process.stdout.write(`  payouts.ndjson: ${count}\r`);
    }
  }
  console.log(`  payouts.ndjson: ${count}`);
}

async function pullPaginated(file, method, path, params, dataKey) {
  console.log(`${file.replace('.ndjson', '')}…`);
  await touchFile(file);
  let count = 0;
  for await (const page of paginate(method, path, params)) {
    const items = page[dataKey] ?? [];
    if (items.length) await writeNdjson(file, items);
    count += items.length;
    process.stdout.write(`  ${file}: ${count}\r`);
  }
  console.log(`  ${file}: ${count}`);
}

async function touchFile(file) {
  await appendFile(join(outDir, file), '');
}

async function* paginate(method, path, params = {}) {
  let cursor;
  while (true) {
    const allParams = cursor ? { ...params, cursor } : params;
    let url = path;
    let body = null;
    if (method === 'GET') {
      const qs = buildQuery(allParams);
      url = qs ? `${path}?${qs}` : path;
    } else {
      body = allParams;
    }
    const data = await api(method, url, body);
    yield data;
    cursor = data.cursor;
    if (!cursor) break;
  }
}

function buildQuery(params) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) usp.append(k, String(v));
  }
  return usp.toString();
}

async function api(method, path, body = null) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Square-Version': SQUARE_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status} ${text.slice(0, 500)}`);
  }
  return res.json();
}

async function writeNdjson(file, items) {
  const lines = items.map((it) => JSON.stringify(it)).join('\n') + '\n';
  await appendFile(join(outDir, file), lines);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[key] = val;
    }
  }
  return out;
}
