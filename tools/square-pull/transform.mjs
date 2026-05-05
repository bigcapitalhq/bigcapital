#!/usr/bin/env node
// transform.mjs — turn the NDJSON pull into Bigcapital-ready CSVs.
//
// Inputs: square-import-sample/{customers,items,invoices,orders,payments,refunds}.ndjson
// Outputs: square-import-sample/csv/{customers,items,invoices,invoice_payments,receipts}.csv
//
// Import order in Bigcapital (each is one importable run via the UI):
//   1. customers.csv         → Customer
//   2. items.csv             → Item
//   3. invoices.csv          → SaleInvoice
//   4. invoice_payments.csv  → PaymentReceived (closes the PAID invoices)
//   5. receipts.csv          → SaleReceipt
//
// Refunds and payouts are deferred — handle in Bigcapital UI for v1.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const inDir = 'square-import-sample';
const outDir = join(inDir, 'csv');
await mkdir(outDir, { recursive: true });

// Account/customer names that must already exist in Bigcapital. The
// Phase-2 setup wizard creates all three. If your wizard used different
// names, edit the produced CSVs (or these constants and re-run).
const SELL_ACCOUNT = 'Square Sales';
const DEPOSIT_ACCOUNT = 'Square Clearing';
const WALKIN_CUSTOMER_NAME = 'Walk-in Customer';
const DEFAULT_CURRENCY = 'USD';

const customers = await loadNdjson('customers.ndjson');
const items = await loadNdjson('items.ndjson');
const invoices = await loadNdjson('invoices.ndjson');
const orders = await loadNdjson('orders.ndjson');
const payments = await loadNdjson('payments.ndjson');

const orderById = new Map(orders.map((o) => [o.id, o]));

// catalog_object_id (variation id) → resolved Bigcapital item name
const itemNameByCatalogId = new Map();
const variationByItemId = new Map();
for (const obj of items) {
  if (obj.type !== 'ITEM') continue;
  for (const v of obj.item_data?.variations || []) {
    variationByItemId.set(v.id, { item: obj, variation: v });
  }
}

// --- customers.csv ---------------------------------------------------------

const displayNameByCustomerId = new Map();
const customerRows = [];
const displayNameUseCount = new Map();
for (const c of customers) {
  let name = composeDisplayName(c);
  if (!name) {
    name = `Square Customer ${c.id.slice(-6)}`;
  }
  if (displayNameUseCount.get(name)) {
    name = `${name} (${c.id.slice(-4)})`;
  }
  displayNameUseCount.set(name, 1);
  displayNameByCustomerId.set(c.id, name);
  customerRows.push({
    'Customer Type': c.company_name ? 'Business' : 'Individual',
    'First Name': c.given_name || '',
    'Last Name': c.family_name || '',
    'Company Name': c.company_name || '',
    'Display Name': name,
    Email: c.email_address || '',
    'Personal Phone Number': c.phone_number || '',
    Currency: DEFAULT_CURRENCY,
    Active: 'T',
    Note: c.note || '',
  });
}

// --- items.csv -------------------------------------------------------------

const itemNameSet = new Set();
const itemRows = [];

// Step 1: every catalog variation becomes one Bigcapital item.
for (const [vid, { item, variation }] of variationByItemId) {
  const itemName = composeItemName(item, variation);
  itemNameByCatalogId.set(vid, itemName);
  if (itemNameSet.has(itemName)) continue;
  itemNameSet.add(itemName);
  const price = (variation.item_variation_data?.price_money?.amount || 0) / 100;
  itemRows.push({
    'Item Type': 'service',
    'Item Name': itemName,
    'Item Code': '',
    Sellable: 'T',
    Purchasable: 'F',
    'Cost Price': '',
    'Sell Price': price,
    'Sell Account': SELL_ACCOUNT,
    'Sell Description': item.item_data?.description_plaintext || '',
    Active: 'T',
  });
}

// Step 2: every ad-hoc line item name (no catalog_object_id) becomes one
// item too, so invoice/receipt rows have something to reference.
// De-duped against catalog items by name.
for (const order of orders) {
  for (const line of order.line_items || []) {
    if (line.catalog_object_id) continue;
    const name = (line.name || '').trim();
    if (!name) continue;
    if (itemNameSet.has(name)) continue;
    itemNameSet.add(name);
    const price = (line.base_price_money?.amount || 0) / 100;
    itemRows.push({
      'Item Type': 'service',
      'Item Name': name,
      'Item Code': '',
      Sellable: 'T',
      Purchasable: 'F',
      'Cost Price': '',
      'Sell Price': price,
      'Sell Account': SELL_ACCOUNT,
      'Sell Description': '',
      Active: 'T',
    });
  }
}

// --- invoices.csv + invoice_payments.csv -----------------------------------

const invoiceRows = [];
const invoicePaymentRows = [];
const skippedInvoices = [];

for (const inv of invoices) {
  if (inv.status === 'CANCELED') {
    skippedInvoices.push({ inv: inv.invoice_number, reason: 'CANCELED' });
    continue;
  }
  const order = orderById.get(inv.order_id);
  if (!order) {
    skippedInvoices.push({
      inv: inv.invoice_number,
      reason: `order ${inv.order_id} not in pull (try widening --since)`,
    });
    continue;
  }

  const customerId = inv.primary_recipient?.customer_id;
  const customerName =
    displayNameByCustomerId.get(customerId) ||
    composeDisplayName(inv.primary_recipient || {}) ||
    WALKIN_CUSTOMER_NAME;

  const invoiceDate = (inv.created_at || '').slice(0, 10);
  const dueDate = inv.payment_requests?.[0]?.due_date || invoiceDate;
  const message = inv.title || '';
  const delivered = ['PAID', 'PARTIALLY_PAID', 'UNPAID'].includes(inv.status)
    ? 'T'
    : 'F';

  let lineCount = 0;
  for (const line of order.line_items || []) {
    const itemName = resolveLineItemName(line);
    if (!itemName) continue;
    invoiceRows.push({
      'Invoice No.': inv.invoice_number,
      'Reference No.': '',
      'Invoice Date': invoiceDate,
      'Due Date': dueDate,
      Customer: customerName,
      'Exchange Rate': 1,
      'Invoice Message': message,
      'Terms & Conditions': '',
      Delivered: delivered,
      Item: itemName,
      Quantity: line.quantity || 1,
      Rate: (line.base_price_money?.amount || 0) / 100,
      Description: line.note || '',
    });
    lineCount++;
  }

  if (lineCount === 0) {
    skippedInvoices.push({
      inv: inv.invoice_number,
      reason: 'order has no line items',
    });
    continue;
  }

  if (inv.status === 'PAID') {
    const amount =
      (inv.payment_requests?.[0]?.total_completed_amount_money?.amount || 0) /
      100;
    const matchedPayment = payments.find(
      (p) => p.order_id === inv.order_id && p.status === 'COMPLETED',
    );
    const payDate =
      matchedPayment?.created_at?.slice(0, 10) || invoiceDate;
    invoicePaymentRows.push({
      Customer: customerName,
      'Payment Date': payDate,
      'Payment Receive No.': `PAY-${inv.invoice_number}`,
      'Reference No.': inv.id,
      'Deposit Account': DEPOSIT_ACCOUNT,
      'Exchange Rate': 1,
      Statement: '',
      Invoice: inv.invoice_number,
      'Payment Amount': amount,
    });
  }
}

// --- receipts.csv (POS payments only) --------------------------------------

const invoiceOrderIds = new Set(invoices.map((i) => i.order_id));
const receiptRows = [];
const skippedReceipts = [];

for (const p of payments) {
  if (p.status !== 'COMPLETED') continue;
  if (invoiceOrderIds.has(p.order_id)) continue;
  if (!p.order_id) {
    receiptRows.push(makeFallbackReceipt(p));
    continue;
  }
  const order = orderById.get(p.order_id);
  if (!order) {
    skippedReceipts.push({
      payment: p.id,
      reason: `order ${p.order_id} not in pull`,
    });
    continue;
  }
  const customerName = p.customer_id
    ? displayNameByCustomerId.get(p.customer_id) || WALKIN_CUSTOMER_NAME
    : WALKIN_CUSTOMER_NAME;
  const date = (p.created_at || '').slice(0, 10);
  const lines = order.line_items || [];

  if (lines.length === 0) {
    receiptRows.push(makeFallbackReceipt(p, customerName, date));
    continue;
  }
  for (const line of lines) {
    const itemName = resolveLineItemName(line);
    if (!itemName) continue;
    receiptRows.push({
      'Receipt Date': date,
      Customer: customerName,
      'Deposit Account': DEPOSIT_ACCOUNT,
      'Exchange Rate': 1,
      'Receipt Number': `REC-${p.id.slice(-8)}`,
      'Reference No.': p.id,
      Statement: '',
      'Receipt Message': '',
      Closed: 'T',
      Item: itemName,
      Quantity: line.quantity || 1,
      Rate: (line.base_price_money?.amount || 0) / 100,
      'Line Description': line.note || '',
    });
  }
}

// --- write everything ------------------------------------------------------

await writeCsv('customers.csv', customerRows);
await writeCsv('items.csv', itemRows);
await writeCsv('invoices.csv', invoiceRows);
await writeCsv('invoice_payments.csv', invoicePaymentRows);
await writeCsv('receipts.csv', receiptRows);

console.log('Rows written:');
console.log(`  customers.csv:         ${customerRows.length}`);
console.log(`  items.csv:             ${itemRows.length}`);
console.log(`  invoices.csv:          ${invoiceRows.length}`);
console.log(`  invoice_payments.csv:  ${invoicePaymentRows.length}`);
console.log(`  receipts.csv:          ${receiptRows.length}`);

if (skippedInvoices.length) {
  console.log(`\nSkipped ${skippedInvoices.length} invoices:`);
  for (const s of skippedInvoices) console.log(`  ${s.inv}: ${s.reason}`);
}
if (skippedReceipts.length) {
  console.log(`\nSkipped ${skippedReceipts.length} receipts:`);
  for (const s of skippedReceipts) console.log(`  ${s.payment}: ${s.reason}`);
}

console.log(`\nCSVs in ${outDir}/`);

// ---------------------------------------------------------------------------

function resolveLineItemName(line) {
  if (line.catalog_object_id) {
    return (
      itemNameByCatalogId.get(line.catalog_object_id) ||
      (line.name || '').trim() ||
      null
    );
  }
  return (line.name || '').trim() || null;
}

function makeFallbackReceipt(p, customerName, date) {
  return {
    'Receipt Date': date || (p.created_at || '').slice(0, 10),
    Customer: customerName || WALKIN_CUSTOMER_NAME,
    'Deposit Account': DEPOSIT_ACCOUNT,
    'Exchange Rate': 1,
    'Receipt Number': `REC-${p.id.slice(-8)}`,
    'Reference No.': p.id,
    Statement: '',
    'Receipt Message': '',
    Closed: 'T',
    Item: SELL_ACCOUNT, // bare item with the same name as the sell account
    Quantity: 1,
    Rate: (p.amount_money?.amount || 0) / 100,
    'Line Description': '',
  };
}

function composeDisplayName(c) {
  const first = (c.given_name || '').trim();
  const last = (c.family_name || '').trim();
  const company = (c.company_name || '').trim();
  const email = (c.email_address || '').trim();
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (last) return last;
  if (company) return company;
  if (email) return email;
  return null;
}

function composeItemName(item, variation) {
  const itemName = (item.item_data?.name || 'Unnamed').trim();
  const varName = (variation.item_variation_data?.name || '').trim();
  if (varName && varName !== 'Regular') return `${itemName} - ${varName}`;
  return itemName;
}

async function loadNdjson(file) {
  let text;
  try {
    text = await readFile(join(inDir, file), 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
  return text
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
}

async function writeCsv(name, rows) {
  if (!rows.length) {
    await writeFile(join(outDir, name), '');
    return;
  }
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const out = [cols.join(',')];
  for (const r of rows) out.push(cols.map((c) => esc(r[c])).join(','));
  await writeFile(join(outDir, name), out.join('\n') + '\n');
}
