import type { ApiFetcher } from "./fetch-utils";
import { paths } from "./schema";
import {
  OpForPath,
  OpQueryParams,
  OpRequestBody,
  OpResponseBody,
} from "./utils";

export const SALE_INVOICES_ROUTES = {
  LIST: "/api/sale-invoices",
  BY_ID: "/api/sale-invoices/{id}",
  STATE: "/api/sale-invoices/state",
  RECEIVABLE: "/api/sale-invoices/receivable",
  MAIL: "/api/sale-invoices/{id}/mail",
  DELIVER: "/api/sale-invoices/{id}/deliver",
  WRITEOFF: "/api/sale-invoices/{id}/writeoff",
  CANCEL_WRITEOFF: "/api/sale-invoices/{id}/cancel-writeoff",
  PAYMENTS: "/api/sale-invoices/{id}/payments",
  HTML: "/api/sale-invoices/{id}/html",
  GENERATE_LINK: "/api/sale-invoices/{id}/generate-link",
  VALIDATE_BULK_DELETE: "/api/sale-invoices/validate-bulk-delete",
  BULK_DELETE: "/api/sale-invoices/bulk-delete",
  NOTIFY_BY_SMS: "/api/sale-invoices/{id}/notify-by-sms",
  SMS_DETAILS: "/api/sale-invoices/{id}/sms-details",
} as const satisfies Record<string, keyof paths>;

export type SaleInvoicesListResponse = OpResponseBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.LIST, "get">
>;
export type SaleInvoice = OpResponseBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.BY_ID, "get">
>;
export type CreateSaleInvoiceBody = OpRequestBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.LIST, "post">
>;
export type EditSaleInvoiceBody = OpRequestBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.BY_ID, "put">
>;
export type BulkDeleteSaleInvoicesBody = OpRequestBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.BULK_DELETE, "post">
>;
export type ValidateBulkDeleteSaleInvoicesResponse = OpResponseBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.VALIDATE_BULK_DELETE, "post">
>;
export type SaleInvoiceStateResponse = OpResponseBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.STATE, "get">
>;
export type GetSaleInvoicesQuery = OpQueryParams<
  OpForPath<typeof SALE_INVOICES_ROUTES.LIST, "get">
>;
export type SaleInvoiceHtmlContentResponse = OpResponseBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.HTML, "get">
>;
export type InvoicePaymentTransactionsResponse = OpResponseBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.PAYMENTS, "get">
>;
export type SaleInvoiceSmsDetailsResponse = OpResponseBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.SMS_DETAILS, "get">
>;
export type NotifySaleInvoiceBySmsBody = OpRequestBody<
  OpForPath<typeof SALE_INVOICES_ROUTES.NOTIFY_BY_SMS, "post">
>;
export type GetSaleInvoiceSmsDetailsQuery = OpQueryParams<
  OpForPath<typeof SALE_INVOICES_ROUTES.SMS_DETAILS, "get">
>;

export async function fetchSaleInvoices(
  fetcher: ApiFetcher,
  query?: GetSaleInvoicesQuery,
): Promise<SaleInvoicesListResponse> {
  const get = fetcher.path(SALE_INVOICES_ROUTES.LIST).method("get").create();
  const { data } = await (
    get as (
      params?: GetSaleInvoicesQuery,
    ) => Promise<{ data: SaleInvoicesListResponse }>
  )(query ?? {});
  return data;
}

export async function fetchSaleInvoice(
  fetcher: ApiFetcher,
  id: number,
): Promise<SaleInvoice> {
  const get = fetcher.path(SALE_INVOICES_ROUTES.BY_ID).method("get").create();
  const { data } = await get({ id });
  return data;
}

export async function createSaleInvoice(
  fetcher: ApiFetcher,
  values: CreateSaleInvoiceBody,
): Promise<void> {
  const post = fetcher.path(SALE_INVOICES_ROUTES.LIST).method("post").create();
  await post(values);
}

export async function editSaleInvoice(
  fetcher: ApiFetcher,
  id: number,
  values: EditSaleInvoiceBody,
): Promise<void> {
  const put = fetcher.path(SALE_INVOICES_ROUTES.BY_ID).method("put").create();
  await put({ id, ...values });
}

export async function deleteSaleInvoice(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const del = fetcher
    .path(SALE_INVOICES_ROUTES.BY_ID)
    .method("delete")
    .create();
  await del({ id });
}

export async function bulkDeleteSaleInvoices(
  fetcher: ApiFetcher,
  body: BulkDeleteSaleInvoicesBody,
): Promise<void> {
  const post = fetcher
    .path(SALE_INVOICES_ROUTES.BULK_DELETE)
    .method("post")
    .create();
  await post({
    ids: body.ids,
    skipUndeletable: body.skipUndeletable ?? false,
  } as never);
}

export async function validateBulkDeleteSaleInvoices(
  fetcher: ApiFetcher,
  ids: number[],
): Promise<ValidateBulkDeleteSaleInvoicesResponse> {
  const post = fetcher
    .path(SALE_INVOICES_ROUTES.VALIDATE_BULK_DELETE)
    .method("post")
    .create();
  const { data } = await post({ ids, skipUndeletable: false } as never);
  return data as ValidateBulkDeleteSaleInvoicesResponse;
}

export async function deliverSaleInvoice(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const put = fetcher.path(SALE_INVOICES_ROUTES.DELIVER).method("put").create();
  await put({ id });
}

export async function writeOffSaleInvoice(
  fetcher: ApiFetcher,
  id: number,
  body?: Record<string, unknown>,
): Promise<void> {
  const post = fetcher
    .path(SALE_INVOICES_ROUTES.WRITEOFF)
    .method("post")
    .create();
  await post({ id, ...(body ?? {}) } as never);
}

export async function cancelWrittenOffSaleInvoice(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const post = fetcher
    .path(SALE_INVOICES_ROUTES.CANCEL_WRITEOFF)
    .method("post")
    .create();
  await post({ id });
}

export async function fetchReceivableSaleInvoices(
  fetcher: ApiFetcher,
  customerId?: number | string,
): Promise<unknown> {
  const get = fetcher
    .path(SALE_INVOICES_ROUTES.RECEIVABLE)
    .method("get")
    .create();
  const { data } = await (
    get as (params?: {
      customerId?: number | string;
    }) => Promise<{ data: unknown }>
  )(customerId != null && customerId !== "" ? { customerId } : {});
  return data;
}

export async function fetchSaleInvoiceMailState(
  fetcher: ApiFetcher,
  id: number,
): Promise<unknown> {
  const get = fetcher.path(SALE_INVOICES_ROUTES.MAIL).method("get").create();
  const { data } = await get({ id });
  return data;
}

export async function sendSaleInvoiceMail(
  fetcher: ApiFetcher,
  id: number,
  body?: Record<string, unknown>,
): Promise<void> {
  const post = fetcher.path(SALE_INVOICES_ROUTES.MAIL).method("post").create();
  await post({ id, ...(body ?? {}) } as never);
}

export async function fetchSaleInvoiceState(
  fetcher: ApiFetcher,
): Promise<SaleInvoiceStateResponse> {
  const get = fetcher.path(SALE_INVOICES_ROUTES.STATE).method("get").create();
  const { data } = await (
    get as (params?: object) => Promise<{ data: SaleInvoiceStateResponse }>
  )({});
  return data;
}

export async function fetchInvoicePayments(
  fetcher: ApiFetcher,
  id: number,
): Promise<InvoicePaymentTransactionsResponse> {
  const get = fetcher
    .path(SALE_INVOICES_ROUTES.PAYMENTS)
    .method("get")
    .create();
  const { data } = await get({ id });
  return data;
}

export async function fetchSaleInvoiceHtml(
  fetcher: ApiFetcher,
  id: number,
): Promise<SaleInvoiceHtmlContentResponse> {
  const get = fetcher.path(SALE_INVOICES_ROUTES.HTML).method("get").create();
  const { data } = await get({ id });
  return data;
}

export async function generateSaleInvoiceSharableLink(
  fetcher: ApiFetcher,
  id: number,
): Promise<{ link: string }> {
  const post = fetcher
    .path(SALE_INVOICES_ROUTES.GENERATE_LINK)
    .method("post")
    .create();
  const { data } = await (
    post as (params: { id: number }) => Promise<{ data: { link: string } }>
  )({ id });
  return data as { link: string };
}

export async function notifySaleInvoiceBySms(
  fetcher: ApiFetcher,
  id: number,
  notificationKey?: "details" | "reminder",
): Promise<void> {
  const post = fetcher
    .path(SALE_INVOICES_ROUTES.NOTIFY_BY_SMS)
    .method("post")
    .create();
  await post({ id, notification_key: notificationKey ?? "details" } as never);
}

export async function fetchSaleInvoiceSmsDetails(
  fetcher: ApiFetcher,
  id: number,
  notificationKey?: "details" | "reminder",
): Promise<SaleInvoiceSmsDetailsResponse> {
  const get = fetcher
    .path(SALE_INVOICES_ROUTES.SMS_DETAILS)
    .method("get")
    .create();
  const { data } = await (
    get as (params: {
      id: number;
      notification_key?: "details" | "reminder";
    }) => Promise<{ data: SaleInvoiceSmsDetailsResponse }>
  )({
    id,
    notification_key: notificationKey,
  });
  return data;
}
