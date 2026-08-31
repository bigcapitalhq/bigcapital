import type { ApiFetcher } from "./fetch-utils";
import { rawRequest } from "./fetch-utils";
import { paths } from "./schema";
import {
  OpForPath,
  OpQueryParams,
  OpRequestBody,
  OpResponseBody,
} from "./utils";

export const SALE_RECEIPTS_ROUTES = {
  LIST: "/api/sale-receipts",
  BY_ID: "/api/sale-receipts/{id}",
  STATE: "/api/sale-receipts/state",
  VALIDATE_BULK_DELETE: "/api/sale-receipts/validate-bulk-delete",
  BULK_DELETE: "/api/sale-receipts/bulk-delete",
  CLOSE: "/api/sale-receipts/{id}/close",
  MAIL: "/api/sale-receipts/{id}/mail",
  NOTIFY_BY_SMS: "/api/sale-receipts/{id}/notify-by-sms",
  SMS_DETAILS: "/api/sale-receipts/{id}/sms-details",
} as const satisfies Record<string, keyof paths>;

export type SaleReceiptsListResponse = OpResponseBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.LIST, "get">
>;
export type SaleReceipt = OpResponseBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.BY_ID, "get">
>;
export type CreateSaleReceiptBody = OpRequestBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.LIST, "post">
>;
export type EditSaleReceiptBody = OpRequestBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.BY_ID, "put">
>;
export type BulkDeleteReceiptsBody = OpRequestBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.BULK_DELETE, "post">
>;
export type ValidateBulkDeleteReceiptsResponse = OpResponseBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.VALIDATE_BULK_DELETE, "post">
>;
export type SaleReceiptStateResponse = OpResponseBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.STATE, "get">
>;
export type GetSaleReceiptsQuery = OpQueryParams<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.LIST, "get">
>;
export type SaleReceiptMailResponse = OpResponseBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.MAIL, "get">
>;
export type SaleReceiptSendMailBody = OpRequestBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.MAIL, "post">
>;
export type SaleReceiptSmsDetailsResponse = OpResponseBody<
  OpForPath<typeof SALE_RECEIPTS_ROUTES.SMS_DETAILS, "get">
>;
export type SaleReceiptHtmlContentResponse = {
  htmlContent: string;
};

export async function fetchSaleReceipts(
  fetcher: ApiFetcher,
  query?: GetSaleReceiptsQuery,
): Promise<SaleReceiptsListResponse> {
  const get = fetcher.path(SALE_RECEIPTS_ROUTES.LIST).method("get").create();
  const { data } = await (
    get as (
      params?: GetSaleReceiptsQuery,
    ) => Promise<{ data: SaleReceiptsListResponse }>
  )(query ?? {});
  return data;
}

export async function fetchSaleReceipt(
  fetcher: ApiFetcher,
  id: number,
): Promise<SaleReceipt> {
  const get = fetcher.path(SALE_RECEIPTS_ROUTES.BY_ID).method("get").create();
  const { data } = await get({ id });
  return data;
}

export async function createSaleReceipt(
  fetcher: ApiFetcher,
  values: CreateSaleReceiptBody,
): Promise<void> {
  const post = fetcher.path(SALE_RECEIPTS_ROUTES.LIST).method("post").create();
  await post(values);
}

export async function editSaleReceipt(
  fetcher: ApiFetcher,
  id: number,
  values: EditSaleReceiptBody,
): Promise<void> {
  const put = fetcher.path(SALE_RECEIPTS_ROUTES.BY_ID).method("put").create();
  await put({ id, ...values });
}

export async function deleteSaleReceipt(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const del = fetcher
    .path(SALE_RECEIPTS_ROUTES.BY_ID)
    .method("delete")
    .create();
  await del({ id });
}

export async function bulkDeleteSaleReceipts(
  fetcher: ApiFetcher,
  body: BulkDeleteReceiptsBody,
): Promise<void> {
  const post = fetcher
    .path(SALE_RECEIPTS_ROUTES.BULK_DELETE)
    .method("post")
    .create();
  await post({
    ids: body.ids,
    skipUndeletable: body.skipUndeletable ?? false,
  } as never);
}

export async function validateBulkDeleteSaleReceipts(
  fetcher: ApiFetcher,
  ids: number[],
): Promise<ValidateBulkDeleteReceiptsResponse> {
  const post = fetcher
    .path(SALE_RECEIPTS_ROUTES.VALIDATE_BULK_DELETE)
    .method("post")
    .create();
  const { data } = await post({ ids, skipUndeletable: false } as never);
  return data as ValidateBulkDeleteReceiptsResponse;
}

export async function closeSaleReceipt(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const post = fetcher.path(SALE_RECEIPTS_ROUTES.CLOSE).method("post").create();
  await post({ id });
}

export async function fetchSaleReceiptMail(
  fetcher: ApiFetcher,
  id: number,
): Promise<SaleReceiptMailResponse> {
  const get = fetcher.path(SALE_RECEIPTS_ROUTES.MAIL).method("get").create();
  const { data } = await get({ id });
  return data as SaleReceiptMailResponse;
}

export async function sendSaleReceiptMail(
  fetcher: ApiFetcher,
  id: number,
  body?: SaleReceiptSendMailBody,
): Promise<void> {
  const post = fetcher.path(SALE_RECEIPTS_ROUTES.MAIL).method("post").create();
  await post({ id, ...(body ?? {}) } as never);
}

export async function fetchSaleReceiptState(
  fetcher: ApiFetcher,
): Promise<SaleReceiptStateResponse> {
  const get = fetcher.path(SALE_RECEIPTS_ROUTES.STATE).method("get").create();
  const { data } = await (
    get as (params?: object) => Promise<{ data: SaleReceiptStateResponse }>
  )({});
  return data;
}

export async function fetchSaleReceiptHtmlContent(
  fetcher: ApiFetcher,
  id: number,
): Promise<SaleReceiptHtmlContentResponse> {
  return rawRequest<SaleReceiptHtmlContentResponse>(
    fetcher,
    "GET",
    `/api/sale-receipts/${id}`,
    undefined,
    { Accept: "application/json+html" },
  );
}

export async function notifySaleReceiptBySms(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const post = fetcher
    .path(SALE_RECEIPTS_ROUTES.NOTIFY_BY_SMS)
    .method("post")
    .create();
  await post({ id });
}

export async function fetchSaleReceiptSmsDetails(
  fetcher: ApiFetcher,
  id: number,
): Promise<SaleReceiptSmsDetailsResponse> {
  const get = fetcher
    .path(SALE_RECEIPTS_ROUTES.SMS_DETAILS)
    .method("get")
    .create();
  const { data } = await get({ id });
  return data;
}
