import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import {
  OpForPath,
  OpQueryParams,
  OpRequestBody,
  OpResponseBody,
} from './utils';

export const VENDOR_CREDITS_ROUTES = {
  LIST: '/api/vendor-credits',
  BY_ID: '/api/vendor-credits/{id}',
  OPEN: '/api/vendor-credits/{id}/open',
  VALIDATE_BULK_DELETE: '/api/vendor-credits/validate-bulk-delete',
  BULK_DELETE: '/api/vendor-credits/bulk-delete',
  REFUND: '/api/vendor-credits/{vendorCreditId}/refund',
  REFUND_BY_ID: '/api/vendor-credits/refunds/{refundCreditId}',
  BILLS_TO_APPLY: '/api/vendor-credits/{vendorCreditId}/bills-to-apply',
  APPLY_TO_BILLS: '/api/vendor-credits/{vendorCreditId}/apply-to-bills',
  APPLIED_BILLS: '/api/vendor-credits/{vendorCreditId}/applied-bills',
  DELETE_APPLIED_BILL: '/api/vendor-credits/applied-bills/{vendorCreditAppliedBillId}',
} as const satisfies Record<string, keyof paths>;

export type VendorCreditsListResponse = OpResponseBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.LIST, 'get'>
>;
export type VendorCredit = OpResponseBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.BY_ID, 'get'>
>;
export type VendorCreditRefund = OpResponseBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.REFUND, 'get'>
>[number];
export type VendorCreditAppliedBill = OpResponseBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.APPLIED_BILLS, 'get'>
>[number];
export type VendorCreditBillToApply = OpResponseBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.BILLS_TO_APPLY, 'get'>
>[number];
export type CreateVendorCreditBody = OpRequestBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.LIST, 'post'>
>;
export type EditVendorCreditBody = OpRequestBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.BY_ID, 'put'>
>;
export type GetVendorCreditsQuery = OpQueryParams<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.LIST, 'get'>
>;
export type BulkDeleteVendorCreditsBody = OpRequestBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.BULK_DELETE, 'post'>
>;
export type ValidateBulkDeleteVendorCreditsResponse = OpResponseBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.VALIDATE_BULK_DELETE, 'post'>
>;
export type CreateRefundVendorCreditBody = OpRequestBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.REFUND, 'post'>
>;
export type ApplyVendorCreditToBillsBody = OpRequestBody<
  OpForPath<typeof VENDOR_CREDITS_ROUTES.APPLY_TO_BILLS, 'post'>
>;

export async function fetchVendorCredits(
  fetcher: ApiFetcher,
  query?: GetVendorCreditsQuery
): Promise<VendorCreditsListResponse> {
  const get = fetcher.path(VENDOR_CREDITS_ROUTES.LIST).method('get').create();
  const { data } = await (
    get as (params?: GetVendorCreditsQuery) => Promise<{
      data: VendorCreditsListResponse;
    }>
  )(query ?? {});
  return data;
}

export async function fetchVendorCredit(
  fetcher: ApiFetcher,
  id: number
): Promise<VendorCredit> {
  const get = fetcher.path(VENDOR_CREDITS_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function createVendorCredit(
  fetcher: ApiFetcher,
  values: CreateVendorCreditBody
): Promise<void> {
  const post = fetcher.path(VENDOR_CREDITS_ROUTES.LIST).method('post').create();
  await post(values);
}

export async function editVendorCredit(
  fetcher: ApiFetcher,
  id: number,
  values: EditVendorCreditBody
): Promise<void> {
  const put = fetcher.path(VENDOR_CREDITS_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values });
}

export async function deleteVendorCredit(
  fetcher: ApiFetcher,
  id: number
): Promise<void> {
  const del = fetcher.path(VENDOR_CREDITS_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export async function openVendorCredit(
  fetcher: ApiFetcher,
  id: number
): Promise<void> {
  const put = fetcher.path(VENDOR_CREDITS_ROUTES.OPEN).method('put').create();
  await put({ id });
}

export async function bulkDeleteVendorCredits(
  fetcher: ApiFetcher,
  body: BulkDeleteVendorCreditsBody
): Promise<void> {
  const post = fetcher
    .path(VENDOR_CREDITS_ROUTES.BULK_DELETE)
    .method('post')
    .create();
  await post(body);
}

export async function validateBulkDeleteVendorCredits(
  fetcher: ApiFetcher,
  body: BulkDeleteVendorCreditsBody
): Promise<ValidateBulkDeleteVendorCreditsResponse> {
  const post = fetcher
    .path(VENDOR_CREDITS_ROUTES.VALIDATE_BULK_DELETE)
    .method('post')
    .create();
  const { data } = await post(body);
  return data;
}

// Refunds (path param vendorCreditId is string in OpenAPI)
export async function fetchVendorCreditRefunds(
  fetcher: ApiFetcher,
  vendorCreditId: number
): Promise<VendorCreditRefund[]> {
  const get = fetcher.path(VENDOR_CREDITS_ROUTES.REFUND).method('get').create();
  const { data } = await get({ vendorCreditId: String(vendorCreditId) });
  return data;
}

export async function createRefundVendorCredit(
  fetcher: ApiFetcher,
  vendorCreditId: number,
  values: CreateRefundVendorCreditBody
): Promise<void> {
  const post = fetcher.path(VENDOR_CREDITS_ROUTES.REFUND).method('post').create();
  await post({ vendorCreditId: String(vendorCreditId), ...values });
}

export async function fetchRefundVendorCreditTransaction(
  fetcher: ApiFetcher,
  refundCreditId: number
): Promise<unknown> {
  const get = fetcher
    .path(VENDOR_CREDITS_ROUTES.REFUND_BY_ID)
    .method('get')
    .create();
  const { data } = await get({ refundCreditId: String(refundCreditId) });
  return data;
}

export async function deleteRefundVendorCredit(
  fetcher: ApiFetcher,
  refundCreditId: number
): Promise<void> {
  const del = fetcher
    .path(VENDOR_CREDITS_ROUTES.REFUND_BY_ID)
    .method('delete')
    .create();
  await del({ refundCreditId: String(refundCreditId) });
}

// Apply to bills
export async function fetchVendorCreditToApplyBills(
  fetcher: ApiFetcher,
  vendorCreditId: number
): Promise<VendorCreditBillToApply[]> {
  const get = fetcher
    .path(VENDOR_CREDITS_ROUTES.BILLS_TO_APPLY)
    .method('get')
    .create();
  const { data } = await get({ vendorCreditId });
  return data;
}

export async function applyVendorCreditToBills(
  fetcher: ApiFetcher,
  vendorCreditId: number,
  body: ApplyVendorCreditToBillsBody
): Promise<void> {
  const post = fetcher
    .path(VENDOR_CREDITS_ROUTES.APPLY_TO_BILLS)
    .method('post')
    .create();
  await post({ vendorCreditId, ...body });
}

export async function fetchAppliedBillsToVendorCredit(
  fetcher: ApiFetcher,
  vendorCreditId: number
): Promise<VendorCreditAppliedBill[]> {
  const get = fetcher
    .path(VENDOR_CREDITS_ROUTES.APPLIED_BILLS)
    .method('get')
    .create();
  const { data } = await get({ vendorCreditId });
  return data;
}

export async function deleteAppliedBillToVendorCredit(
  fetcher: ApiFetcher,
  vendorCreditAppliedBillId: number
): Promise<void> {
  const del = fetcher
    .path(VENDOR_CREDITS_ROUTES.DELETE_APPLIED_BILL)
    .method('delete')
    .create();
  await del({ vendorCreditAppliedBillId });
}
