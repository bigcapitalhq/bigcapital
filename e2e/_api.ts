import fs from 'fs';

const API_PREFIX = '/api';

export interface ApiAuth {
  accessToken: string;
  organizationId: string;
  tenantId: string;
}

export interface ExpenseSeedInput {
  referenceNo: string;
  amount: number;
  paymentDate?: string;
  paymentAccountName?: string;
  expenseAccountName?: string;
}

export interface AccountSeed {
  id: number;
  name: string;
  code: string;
  accountType?: string;
}

export interface ContactSeedInput {
  displayName: string;
  currencyCode?: string;
}

export interface ItemSeedInput {
  name: string;
  type: 'service' | 'non-inventory' | 'inventory';
  sellPrice?: number;
  costPrice?: number;
}

export interface InvoiceSeedInput {
  customerId: number;
  itemId: number;
  rate: number;
  quantity?: number;
  date?: string;
  taxRateId?: number;
}

export interface BillSeedInput {
  vendorId: number;
  itemId: number;
  rate: number;
  quantity?: number;
  date?: string;
}

export interface InventoryAdjustmentSeedInput {
  itemId: number;
  quantity?: number;
  cost?: number;
  date?: string;
}

/**
 * Reads the authenticated session cookies written by the Playwright
 * global-setup and exposes them as bearer-token/header values for direct
 * REST API calls (used to seed report data).
 */
export function readApiAuth(
  storageStatePath = 'e2e/.auth/user.json',
): ApiAuth {
  const state = JSON.parse(fs.readFileSync(storageStatePath, 'utf8')) as {
    cookies: Array<{ name: string; value: string }>;
  };
  const cookieValue = (name: string) =>
    state.cookies.find((cookie) => cookie.name === name)?.value;

  const accessToken = cookieValue('token');
  const organizationId = cookieValue('organization_id');
  const tenantId = cookieValue('tenant_id');

  if (!accessToken || !organizationId || !tenantId) {
    throw new Error(
      `[e2e] Missing auth cookies in ${storageStatePath}. ` +
        `Run the Playwright global setup first.`,
    );
  }
  return { accessToken, organizationId, tenantId };
}

async function send(
  apiBase: string,
  auth: ApiAuth,
  path: string,
  init: RequestInit,
): Promise<any> {
  let res: Response;
  try {
    res = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`,
        'organization-id': auth.organizationId,
        ...(init.headers ?? {}),
      },
    });
  } catch (err: any) {
    const cause = err?.cause
      ? ` (cause: ${err.cause.code ?? err.cause.message ?? err.cause})`
      : '';
    throw new Error(
      `[e2e] ${init.method ?? 'GET'} ${path}: could not reach ${apiBase}${cause}.`,
    );
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      `[e2e] ${init.method ?? 'GET'} ${path} failed: ${res.status} ` +
        `${res.statusText} ${JSON.stringify(body)}`,
    );
  }
  return body;
}

/**
 * Retrieves the tenant accounts chart.
 */
export async function fetchAccounts(
  apiBase: string,
  auth: ApiAuth,
): Promise<AccountSeed[]> {
  const body = await send(apiBase, auth, `${API_PREFIX}/accounts`, {
    method: 'GET',
  });
  return Array.isArray(body) ? body : body?.accounts ?? [];
}

/**
 * Posts a published expense to the REST API. Publishing the expense writes
 * the associated journal entries, which seeds the accounts transactions
 * ledger so the balance sheet report renders rows.
 */
export async function createExpenseViaApi(
  apiBase: string,
  auth: ApiAuth,
  input: ExpenseSeedInput,
): Promise<any> {
  const accounts = await fetchAccounts(apiBase, auth);

  const paymentAccount = accounts.find(
    (account) => account.name === (input.paymentAccountName ?? 'Petty Cash'),
  );
  const expenseAccount = accounts.find(
    (account) => account.name === (input.expenseAccountName ?? 'Rent'),
  );
  if (!paymentAccount || !expenseAccount) {
    throw new Error(
      `[e2e] Could not resolve seed accounts. ` +
        `Payment account (${input.paymentAccountName ?? 'Petty Cash'}): ` +
        `${paymentAccount?.name}, Expense account (` +
        `${input.expenseAccountName ?? 'Rent'}): ${expenseAccount?.name}.`,
    );
  }

  return send(apiBase, auth, `${API_PREFIX}/expenses`, {
    method: 'POST',
    body: JSON.stringify({
      referenceNo: input.referenceNo,
      paymentDate: input.paymentDate ?? new Date().toISOString().slice(0, 10),
      paymentAccountId: paymentAccount.id,
      description: `e2e balance sheet seed (${input.referenceNo})`,
      publish: true,
      categories: [
        {
          index: 1,
          expenseAccountId: expenseAccount.id,
          amount: input.amount,
        },
      ],
    }),
  });
}

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Resolves an account by name, falling back to the given account type.
 */
async function resolveAccount(
  apiBase: string,
  auth: ApiAuth,
  { name, accountType }: { name: string; accountType?: string },
): Promise<AccountSeed> {
  const accounts = await fetchAccounts(apiBase, auth);
  const account = accounts.find((a) => a.name === name);
  if (!account) {
    throw new Error(
      `[e2e] Could not resolve account "${name}" (type: ${accountType}).`,
    );
  }
  return account;
}

/**
 * Creates a customer contact.
 */
export async function createCustomerViaApi(
  apiBase: string,
  auth: ApiAuth,
  input: ContactSeedInput,
): Promise<any> {
  return send(apiBase, auth, `${API_PREFIX}/customers`, {
    method: 'POST',
    body: JSON.stringify({
      customerType: 'business',
      displayName: input.displayName,
      currencyCode: input.currencyCode ?? 'AED',
    }),
  });
}

/**
 * Creates a vendor contact.
 */
export async function createVendorViaApi(
  apiBase: string,
  auth: ApiAuth,
  input: ContactSeedInput,
): Promise<any> {
  return send(apiBase, auth, `${API_PREFIX}/vendors`, {
    method: 'POST',
    body: JSON.stringify({
      displayName: input.displayName,
      currencyCode: input.currencyCode ?? 'AED',
    }),
  });
}

/**
 * Creates an item. Resolves the sell/cost/inventory accounts from the chart
 * of accounts so the item can be sold and purchased.
 */
export async function createItemViaApi(
  apiBase: string,
  auth: ApiAuth,
  input: ItemSeedInput,
): Promise<any> {
  const [sellAccount, costAccount, inventoryAccount] = await Promise.all([
    resolveAccount(apiBase, auth, {
      name: 'Sales of Product Income',
      accountType: 'income',
    }),
    resolveAccount(apiBase, auth, {
      name: 'Cost of Goods Sold',
      accountType: 'cost-of-goods-sold',
    }),
    resolveAccount(apiBase, auth, {
      name: 'Inventory Asset',
      accountType: 'inventory',
    }),
  ]);

  return send(apiBase, auth, `${API_PREFIX}/items`, {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      type: input.type,
      sellable: true,
      purchasable: true,
      sellPrice: input.sellPrice ?? 100,
      costPrice: input.costPrice ?? 50,
      sellAccountId: sellAccount.id,
      costAccountId: costAccount.id,
      ...(input.type === 'inventory'
        ? { inventoryAccountId: inventoryAccount.id }
        : {}),
    }),
  });
}

/**
 * Creates a tax rate with a non-zero rate (the seeded tax rates are all 0%).
 */
export async function createTaxRateViaApi(
  apiBase: string,
  auth: ApiAuth,
  input: { name: string; code: string; rate: number },
): Promise<any> {
  return send(apiBase, auth, `${API_PREFIX}/tax-rates`, {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      code: input.code,
      rate: input.rate,
    }),
  });
}

/**
 * Creates a delivered sale invoice. Delivering the invoice writes the GL
 * entries (receivable, income, tax payable), which feeds the A/R aging,
 * customers balance/transactions, sales-by-items and sales-tax reports.
 */
export async function createDeliveredInvoiceViaApi(
  apiBase: string,
  auth: ApiAuth,
  input: InvoiceSeedInput,
): Promise<any> {
  return send(apiBase, auth, `${API_PREFIX}/sale-invoices`, {
    method: 'POST',
    body: JSON.stringify({
      customerId: input.customerId,
      invoiceDate: input.date ?? today(),
      dueDate: input.date ?? today(),
      delivered: true,
      entries: [
        {
          index: 1,
          itemId: input.itemId,
          rate: input.rate,
          quantity: input.quantity ?? 1,
          ...(input.taxRateId ? { taxRateId: input.taxRateId } : {}),
        },
      ],
    }),
  });
}

/**
 * Creates an opened bill. Opening the bill writes the GL entries (payable,
 * income/expense, inventory IN lot), which feeds the A/P aging, vendors
 * balance/transactions, purchases-by-items and inventory valuation reports.
 *
 * A `billNumber` is required: the bill GL write (and its ledger commit)
 * depends on it, and bills without one fail server-side.
 */
export async function createOpenedBillViaApi(
  apiBase: string,
  auth: ApiAuth,
  input: BillSeedInput,
): Promise<any> {
  return send(apiBase, auth, `${API_PREFIX}/bills`, {
    method: 'POST',
    body: JSON.stringify({
      vendorId: input.vendorId,
      billDate: input.date ?? today(),
      dueDate: input.date ?? today(),
      billNumber: `E2E-BILL-${Date.now()}`,
      referenceNo: `E2E-BILL-REF-${Date.now()}`,
      exchangeRate: 1,
      open: true,
      entries: [
        {
          index: 1,
          itemId: input.itemId,
          rate: input.rate,
          quantity: input.quantity ?? 1,
          description: 'e2e report seed',
        },
      ],
    }),
  });
}

/**
 * Creates a published inventory adjustment (increment). This records an IN
 * cost lot for the item, which feeds the inventory valuation and inventory
 * item details reports (no bill required).
 */
export async function createQuickInventoryAdjustmentViaApi(
  apiBase: string,
  auth: ApiAuth,
  input: InventoryAdjustmentSeedInput,
): Promise<any> {
  const accounts = await fetchAccounts(apiBase, auth);
  const adjustmentAccount = accounts.find(
    (account) => account.name === 'Opening Balance Equity',
  );
  if (!adjustmentAccount) {
    throw new Error('[e2e] Could not resolve "Opening Balance Equity" account.');
  }

  return send(apiBase, auth, `${API_PREFIX}/inventory-adjustments/quick`, {
    method: 'POST',
    body: JSON.stringify({
      date: input.date ?? today(),
      type: 'increment',
      adjustmentAccountId: adjustmentAccount.id,
      reason: 'e2e report seed',
      itemId: input.itemId,
      quantity: input.quantity ?? 10,
      cost: input.cost ?? 50,
      publish: true,
    }),
  });
}

/**
 * Resolves a customer id by display name.
 */
export async function findCustomerIdByName(
  apiBase: string,
  auth: ApiAuth,
  displayName: string,
): Promise<number> {
  const body = await send(
    apiBase,
    auth,
    `${API_PREFIX}/customers?page=1&pageSize=100`,
    { method: 'GET' },
  );
  const customers = Array.isArray(body) ? body : body?.data ?? [];
  const customer = customers.find((c: any) => c.displayName === displayName);
  if (!customer) {
    throw new Error(`[e2e] Could not find customer "${displayName}".`);
  }
  return customer.id;
}

/**
 * Resolves a vendor id by display name.
 */
export async function findVendorIdByName(
  apiBase: string,
  auth: ApiAuth,
  displayName: string,
): Promise<number> {
  const body = await send(
    apiBase,
    auth,
    `${API_PREFIX}/vendors?page=1&pageSize=100`,
    { method: 'GET' },
  );
  const vendors = Array.isArray(body) ? body : body?.data ?? [];
  const vendor = vendors.find((v: any) => v.displayName === displayName);
  if (!vendor) {
    throw new Error(`[e2e] Could not find vendor "${displayName}".`);
  }
  return vendor.id;
}

/**
 * Resolves an item id by name.
 */
export async function findItemIdByName(
  apiBase: string,
  auth: ApiAuth,
  name: string,
): Promise<number> {
  const body = await send(
    apiBase,
    auth,
    `${API_PREFIX}/items?page=1&pageSize=100`,
    { method: 'GET' },
  );
  const items = Array.isArray(body) ? body : body?.data ?? [];
  const item = items.find((i: any) => i.name === name);
  if (!item) {
    throw new Error(`[e2e] Could not find item "${name}".`);
  }
  return item.id;
}
