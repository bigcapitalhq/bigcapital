import type { ApiFetcher } from "./fetch-utils";
import { paths } from "./schema";
import {
  OpForPath,
  OpQueryParams,
  OpRequestBody,
  OpResponseBody,
} from "./utils";

export const RECURRING_INVOICES_ROUTES = {
  LIST: "/api/recurring-invoices",
  BY_ID: "/api/recurring-invoices/{id}",
  STATE: "/api/recurring-invoices/state",
  PAUSE: "/api/recurring-invoices/{id}/pause",
  RESUME: "/api/recurring-invoices/{id}/resume",
  GENERATE: "/api/recurring-invoices/{id}/generate",
  INVOICES: "/api/recurring-invoices/{id}/invoices",
} as const satisfies Record<string, keyof paths>;

export type RecurringInvoicesListResponse = OpResponseBody<
  OpForPath<typeof RECURRING_INVOICES_ROUTES.LIST, "get">
>;
export type RecurringInvoice = OpResponseBody<
  OpForPath<typeof RECURRING_INVOICES_ROUTES.BY_ID, "get">
>;
export type CreateRecurringInvoiceBody = OpRequestBody<
  OpForPath<typeof RECURRING_INVOICES_ROUTES.LIST, "post">
>;
export type EditRecurringInvoiceBody = OpRequestBody<
  OpForPath<typeof RECURRING_INVOICES_ROUTES.BY_ID, "put">
>;
export type GetRecurringInvoicesQuery = OpQueryParams<
  OpForPath<typeof RECURRING_INVOICES_ROUTES.LIST, "get">
>;
export type RecurringInvoiceStateResponse = OpResponseBody<
  OpForPath<typeof RECURRING_INVOICES_ROUTES.STATE, "get">
>;
export type GenerateRecurringInvoiceResponse = OpResponseBody<
  OpForPath<typeof RECURRING_INVOICES_ROUTES.GENERATE, "post">
>;
export type RecurringInvoiceInvoicesResponse = OpResponseBody<
  OpForPath<typeof RECURRING_INVOICES_ROUTES.INVOICES, "get">
>;
export type GetRecurringInvoiceInvoicesQuery = OpQueryParams<
  OpForPath<typeof RECURRING_INVOICES_ROUTES.INVOICES, "get">
>;

export async function fetchRecurringInvoices(
  fetcher: ApiFetcher,
  query?: GetRecurringInvoicesQuery,
): Promise<RecurringInvoicesListResponse> {
  const get = fetcher
    .path(RECURRING_INVOICES_ROUTES.LIST)
    .method("get")
    .create();
  const { data } = await (get as any)(query ?? {});
  return data;
}

export async function fetchRecurringInvoice(
  fetcher: ApiFetcher,
  id: number,
): Promise<RecurringInvoice> {
  const get = fetcher
    .path(RECURRING_INVOICES_ROUTES.BY_ID)
    .method("get")
    .create();
  const { data } = await get({ id });
  return data;
}

export async function createRecurringInvoice(
  fetcher: ApiFetcher,
  values: CreateRecurringInvoiceBody,
): Promise<RecurringInvoice> {
  const post = fetcher
    .path(RECURRING_INVOICES_ROUTES.LIST)
    .method("post")
    .create();
  const { data } = await post(values);
  return data;
}

export async function editRecurringInvoice(
  fetcher: ApiFetcher,
  id: number,
  values: EditRecurringInvoiceBody,
): Promise<RecurringInvoice> {
  const put = fetcher
    .path(RECURRING_INVOICES_ROUTES.BY_ID)
    .method("put")
    .create();
  const { data } = await put({ id, ...values });
  return data;
}

export async function deleteRecurringInvoice(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const del = fetcher
    .path(RECURRING_INVOICES_ROUTES.BY_ID)
    .method("delete")
    .create();
  await del({ id });
}

export async function pauseRecurringInvoice(
  fetcher: ApiFetcher,
  id: number,
): Promise<RecurringInvoice> {
  const post = fetcher
    .path(RECURRING_INVOICES_ROUTES.PAUSE)
    .method("post")
    .create();
  const { data } = await post({ id });
  return data;
}

export async function resumeRecurringInvoice(
  fetcher: ApiFetcher,
  id: number,
): Promise<RecurringInvoice> {
  const post = fetcher
    .path(RECURRING_INVOICES_ROUTES.RESUME)
    .method("post")
    .create();
  const { data } = await post({ id });
  return data;
}

export async function generateRecurringInvoiceNow(
  fetcher: ApiFetcher,
  id: number,
): Promise<GenerateRecurringInvoiceResponse> {
  const post = fetcher
    .path(RECURRING_INVOICES_ROUTES.GENERATE)
    .method("post")
    .create();
  const { data } = await post({ id });
  return data;
}

export async function fetchRecurringInvoiceInvoices(
  fetcher: ApiFetcher,
  id: number,
  query?: GetRecurringInvoiceInvoicesQuery,
): Promise<RecurringInvoiceInvoicesResponse> {
  const get = fetcher
    .path(RECURRING_INVOICES_ROUTES.INVOICES)
    .method("get")
    .create();
  const { data } = await (get as any)({ id, ...(query ?? {}) });
  return data;
}

export async function fetchRecurringInvoiceState(
  fetcher: ApiFetcher,
): Promise<RecurringInvoiceStateResponse> {
  const get = fetcher
    .path(RECURRING_INVOICES_ROUTES.STATE)
    .method("get")
    .create();
  const { data } = await get({});
  return data;
}
