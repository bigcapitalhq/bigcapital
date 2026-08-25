import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpRequestBody, OpResponseBody } from './utils';

export const BILL_PAYMENTS_ROUTES = {
  LIST: '/api/bill-payments',
  BY_ID: '/api/bill-payments/{billPaymentId}',
  NEW_PAGE_ENTRIES: '/api/bill-payments/new-page/entries',
  BILLS: '/api/bill-payments/{billPaymentId}/bills',
  EDIT_PAGE: '/api/bill-payments/{billPaymentId}/edit-page',
  VALIDATE_BULK_DELETE: '/api/bill-payments/validate-bulk-delete',
  BULK_DELETE: '/api/bill-payments/bulk-delete',
} as const satisfies Record<string, keyof paths>;

export type BillPaymentsListResponse = OpResponseBody<OpForPath<typeof BILL_PAYMENTS_ROUTES.LIST, 'get'>>;
export type BillPayment = OpResponseBody<OpForPath<typeof BILL_PAYMENTS_ROUTES.BY_ID, 'get'>>;
export type CreateBillPaymentBody = OpRequestBody<OpForPath<typeof BILL_PAYMENTS_ROUTES.LIST, 'post'>>;
export type EditBillPaymentBody = OpRequestBody<OpForPath<typeof BILL_PAYMENTS_ROUTES.BY_ID, 'put'>>;
export type BillPaymentEditPageResponse = OpResponseBody<OpForPath<typeof BILL_PAYMENTS_ROUTES.EDIT_PAGE, 'get'>>;
export type BillPaymentNewPageEntriesResponse = OpResponseBody<OpForPath<typeof BILL_PAYMENTS_ROUTES.NEW_PAGE_ENTRIES, 'get'>>;

export async function fetchBillPayments(fetcher: ApiFetcher): Promise<BillPaymentsListResponse> {
  const get = fetcher.path(BILL_PAYMENTS_ROUTES.LIST).method('get').create();
  const { data } = await get({});
  return data;
}

export async function fetchBillPayment(fetcher: ApiFetcher, billPaymentId: number): Promise<BillPayment> {
  const get = fetcher.path(BILL_PAYMENTS_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ billPaymentId });
  return data;
}

export async function createBillPayment(
  fetcher: ApiFetcher,
  values: CreateBillPaymentBody
): Promise<void> {
  const post = fetcher.path(BILL_PAYMENTS_ROUTES.LIST).method('post').create();
  await post(values);
}

export async function editBillPayment(
  fetcher: ApiFetcher,
  billPaymentId: number,
  values: EditBillPaymentBody
): Promise<void> {
  const put = fetcher.path(BILL_PAYMENTS_ROUTES.BY_ID).method('put').create();
  await put({ billPaymentId, ...values });
}

export async function deleteBillPayment(fetcher: ApiFetcher, billPaymentId: number): Promise<void> {
  const del = fetcher.path(BILL_PAYMENTS_ROUTES.BY_ID).method('delete').create();
  await del({ billPaymentId });
}

export type BulkDeleteBillPaymentsBody = { ids: number[]; skipUndeletable?: boolean };
export type ValidateBulkDeleteBillPaymentsResponse = {
  deletableCount: number;
  nonDeletableCount: number;
  deletableIds: number[];
  nonDeletableIds: number[];
};

export async function bulkDeleteBillPayments(
  fetcher: ApiFetcher,
  body: BulkDeleteBillPaymentsBody
): Promise<void> {
  const post = fetcher.path(BILL_PAYMENTS_ROUTES.BULK_DELETE).method('post').create();
  await post({ ids: body.ids, skipUndeletable: body.skipUndeletable ?? false } as never);
}

export async function validateBulkDeleteBillPayments(
  fetcher: ApiFetcher,
  ids: number[]
): Promise<ValidateBulkDeleteBillPaymentsResponse> {
  const post = fetcher.path(BILL_PAYMENTS_ROUTES.VALIDATE_BULK_DELETE).method('post').create();
  const { data } = await post({ ids, skipUndeletable: false } as never);
  return data as ValidateBulkDeleteBillPaymentsResponse;
}

export async function fetchBillPaymentEditPage(
  fetcher: ApiFetcher,
  billPaymentId: number
): Promise<BillPaymentEditPageResponse> {
  const get = fetcher.path(BILL_PAYMENTS_ROUTES.EDIT_PAGE).method('get').create();
  const { data } = await get({ billPaymentId });
  return data;
}


export async function fetchBillPaymentNewPageEntries(
  fetcher: ApiFetcher,
  vendorId: number
): Promise<BillPaymentNewPageEntriesResponse> {
  const get = fetcher
    .path(BILL_PAYMENTS_ROUTES.NEW_PAGE_ENTRIES)
    .method('get')
    .create();
  const { data } = await (get as (params: { vendorId: number }) => Promise<{ data: BillPaymentNewPageEntriesResponse }>)(
    { vendorId }
  );
  return data;
}
