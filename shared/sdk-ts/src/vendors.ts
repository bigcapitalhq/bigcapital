import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const VENDORS_ROUTES = {
  LIST: '/api/vendors',
  BY_ID: '/api/vendors/{id}',
  OPENING_BALANCE: '/api/vendors/{id}/opening-balance',
  VALIDATE_BULK_DELETE: '/api/vendors/validate-bulk-delete',
  BULK_DELETE: '/api/vendors/bulk-delete',
} as const satisfies Record<string, keyof paths>;

export type VendorsListResponse = OpResponseBody<OpForPath<typeof VENDORS_ROUTES.LIST, 'get'>>;
export type Vendor = OpResponseBody<OpForPath<typeof VENDORS_ROUTES.BY_ID, 'get'>>;
export type CreateVendorBody = OpRequestBody<OpForPath<typeof VENDORS_ROUTES.LIST, 'post'>>;
export type EditVendorBody = OpRequestBody<OpForPath<typeof VENDORS_ROUTES.BY_ID, 'put'>>;
export type ValidateBulkDeleteVendorsResponse = OpResponseBody<OpForPath<typeof VENDORS_ROUTES.VALIDATE_BULK_DELETE, 'post'>>;
export type BulkDeleteVendorsBody = OpRequestBody<OpForPath<typeof VENDORS_ROUTES.BULK_DELETE, 'post'>>;
export type GetVendorsQuery = OpQueryParams<OpForPath<typeof VENDORS_ROUTES.LIST, 'get'>>;
export type EditVendorOpeningBalanceBody = OpRequestBody<OpForPath<typeof VENDORS_ROUTES.OPENING_BALANCE, 'put'>>;
export type EditVendorOpeningBalanceResponse = OpResponseBody<OpForPath<typeof VENDORS_ROUTES.OPENING_BALANCE, 'put'>>;

export async function fetchVendors(
  fetcher: ApiFetcher,
  query?: GetVendorsQuery
): Promise<VendorsListResponse> {
  const get = fetcher.path(VENDORS_ROUTES.LIST).method('get').create();
  const { data } = await get(query ?? ({} as GetVendorsQuery));
  return data as VendorsListResponse;
}

export async function fetchVendor(fetcher: ApiFetcher, id: number): Promise<Vendor> {
  const get = fetcher.path(VENDORS_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function createVendor(
  fetcher: ApiFetcher,
  values: CreateVendorBody
): Promise<void> {
  const post = fetcher.path(VENDORS_ROUTES.LIST).method('post').create();
  await post(values);
}

export async function editVendor(
  fetcher: ApiFetcher,
  id: number,
  values: EditVendorBody
): Promise<void> {
  const put = fetcher.path(VENDORS_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values });
}

export async function deleteVendor(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(VENDORS_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export async function validateBulkDeleteVendors(
  fetcher: ApiFetcher,
  body: BulkDeleteVendorsBody
): Promise<ValidateBulkDeleteVendorsResponse> {
  const validate = fetcher.path(VENDORS_ROUTES.VALIDATE_BULK_DELETE).method('post').create();
  const { data } = await validate(body);
  return data;
}

export async function bulkDeleteVendors(
  fetcher: ApiFetcher,
  body: BulkDeleteVendorsBody
): Promise<void> {
  const post = fetcher.path(VENDORS_ROUTES.BULK_DELETE).method('post').create();
  await post(body);
}

export async function editVendorOpeningBalance(
  fetcher: ApiFetcher,
  id: number,
  values: EditVendorOpeningBalanceBody
): Promise<EditVendorOpeningBalanceResponse> {
  const put = fetcher.path(VENDORS_ROUTES.OPENING_BALANCE).method('put').create();
  const { data } = await put({ id, ...values });
  return data;
}
