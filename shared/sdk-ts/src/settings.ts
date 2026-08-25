import type { ApiFetcher } from './fetch-utils';
import { rawRequest } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';
import { snakeToCamelCase } from './utils/case-transform';

export const SETTINGS_ROUTES = {
  GET_SAVE: '/api/settings',
} as const satisfies Record<string, keyof paths>;

export type SettingsResponse = OpResponseBody<OpForPath<typeof SETTINGS_ROUTES.GET_SAVE, 'get'>>;
export type SaveSettingsBody = OpRequestBody<OpForPath<typeof SETTINGS_ROUTES.GET_SAVE, 'put'>>;
export type GetSettingsQuery = OpQueryParams<OpForPath<typeof SETTINGS_ROUTES.GET_SAVE, 'get'>>;

/**
 * A single settings group: camelCased keys to their values.
 */
export type SettingsGroup = Record<string, unknown>;

/**
 * All settings groups keyed by camelCased group name.
 */
export type AllSettings = Record<string, SettingsGroup>;

/**
 * Reshape the flat `[{ key, value, group }]` array from the API into the
 * `{ [camelCase(group)]: { [camelCase(key)]: value } }` shape consumers expect.
 */
export function transformSettingsResponse(items: SettingsResponse): AllSettings {
  return items.reduce((acc, { key, value, group }) => {
    const g = snakeToCamelCase(group);
    const k = snakeToCamelCase(key);
    if (!acc[g]) acc[g] = {};
    acc[g][k] = value;
    return acc;
  }, {} as AllSettings);
}

export async function fetchSettings(
  fetcher: ApiFetcher,
  query?: GetSettingsQuery
): Promise<SettingsResponse> {
  const get = fetcher.path(SETTINGS_ROUTES.GET_SAVE).method('get').create();
  const { data } = await (get as (params?: GetSettingsQuery) => Promise<{ data: SettingsResponse }>)(
    query ?? {}
  );
  return data;
}

/**
 * Fetches all settings, reshaped into the grouped camelCased object.
 */
export async function fetchSettingsGrouped(fetcher: ApiFetcher): Promise<AllSettings> {
  const items = await fetchSettings(fetcher);
  return transformSettingsResponse(items);
}

export async function saveSettings(
  fetcher: ApiFetcher,
  values: SaveSettingsBody
): Promise<void> {
  const put = fetcher.path(SETTINGS_ROUTES.GET_SAVE).method('put').create();
  await put(values);
}

export const editSettings = saveSettings;

// Settings group fetchers.
//
// The server does not filter `/api/settings` by group — every fetcher below
// retrieves the full blob and the response is filtered + reshaped client-side
// to return just the requested group. Group names are the snake_case values
// saved by the form submissions (e.g. `sales_invoices`, not `sale_invoices`).

export async function fetchSettingsGroup(
  fetcher: ApiFetcher,
  group: string
): Promise<SettingsGroup> {
  const all = await fetchSettingsGrouped(fetcher);
  return all[snakeToCamelCase(group)] ?? {};
}

export async function fetchSettingsInvoices(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'sales_invoices');
}

export async function fetchSettingsEstimates(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'sales_estimates');
}

export async function fetchSettingsPaymentReceives(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'payment_receives');
}

export async function fetchSettingsReceipts(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'sales_receipts');
}

export async function fetchSettingsManualJournals(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'manual_journals');
}

export async function fetchSettingsItems(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'items');
}

export async function fetchSettingsItemCategories(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'item_categories');
}

export async function fetchSettingCashFlow(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'cashflow');
}

export async function fetchSettingsCreditNotes(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'credit_note');
}

export async function fetchSettingsVendorCredits(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'vendor_credit');
}

export async function fetchSettingsWarehouseTransfers(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'warehouse_transfers');
}

// Additional group fetchers for groups previously only reachable via Redux.

export async function fetchSettingsBills(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'bills');
}

export async function fetchSettingsBillPayments(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'bill_payments');
}

export async function fetchSettingsOrganization(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'organization');
}

export async function fetchSettingsExpenses(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'expenses');
}

export async function fetchSettingsAccounts(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'accounts');
}

export async function fetchSettingsCustomers(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'customers');
}

export async function fetchSettingsVendors(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'vendors');
}

export async function fetchSettingsCashflowTransactions(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'cashflow_transactions');
}

export async function fetchSettingsProjects(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'projects');
}

export async function fetchSettingsProjectTasks(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'project_tasks');
}

export async function fetchSettingsTimesheets(
  fetcher: ApiFetcher
): Promise<SettingsGroup> {
  return fetchSettingsGroup(fetcher, 'timesheets');
}

// SMS Notification settings (using raw fetch since endpoints are not in OpenAPI schema)

export async function fetchSettingSMSNotifications(fetcher: ApiFetcher): Promise<unknown> {
  return rawRequest(fetcher, 'GET', '/api/settings/sms-notifications');
}

export async function fetchSettingSMSNotification(
  fetcher: ApiFetcher,
  key: string
): Promise<unknown> {
  return rawRequest(fetcher, 'GET', `/api/settings/sms-notification/${encodeURIComponent(key)}`);
}

export async function editSettingSMSNotification(
  fetcher: ApiFetcher,
  key: string,
  values: Record<string, unknown>
): Promise<unknown> {
  return rawRequest(fetcher, 'POST', '/api/settings/sms-notification', { key, ...values });
}
