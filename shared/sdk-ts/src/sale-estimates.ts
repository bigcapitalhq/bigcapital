import type { ApiFetcher, PdfDocument } from './fetch-utils';
import { rawRequest, toPdfDocument } from './fetch-utils';
import { paths, components } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const SALE_ESTIMATES_ROUTES = {
  LIST: '/api/sale-estimates',
  BY_ID: '/api/sale-estimates/{id}',
  STATE: '/api/sale-estimates/state',
  VALIDATE_BULK_DELETE: '/api/sale-estimates/validate-bulk-delete',
  BULK_DELETE: '/api/sale-estimates/bulk-delete',
  DELIVER: '/api/sale-estimates/{id}/deliver',
  APPROVE: '/api/sale-estimates/{id}/approve',
  REJECT: '/api/sale-estimates/{id}/reject',
  NOTIFY_SMS: '/api/sale-estimates/{id}/notify-sms',
  SMS_DETAILS: '/api/sale-estimates/{id}/sms-details',
  MAIL: '/api/sale-estimates/{id}/mail',
} as const satisfies Record<string, keyof paths>;

export type SaleEstimatesListResponse = OpResponseBody<OpForPath<typeof SALE_ESTIMATES_ROUTES.LIST, 'get'>>;
export type SaleEstimate = OpResponseBody<OpForPath<typeof SALE_ESTIMATES_ROUTES.BY_ID, 'get'>>;
export type CreateSaleEstimateBody = OpRequestBody<OpForPath<typeof SALE_ESTIMATES_ROUTES.LIST, 'post'>>;
export type EditSaleEstimateBody = OpRequestBody<OpForPath<typeof SALE_ESTIMATES_ROUTES.BY_ID, 'put'>>;
export type GetSaleEstimatesQuery = OpQueryParams<OpForPath<typeof SALE_ESTIMATES_ROUTES.LIST, 'get'>>;
export type SaleEstimateHtmlContentResponse = { htmlContent: string };
export type SaleEstimatesStateResponse = components['schemas']['SaleEstiamteStateResponseDto'];
export type BulkDeleteEstimatesBody = { ids: number[]; skipUndeletable?: boolean };
export type ValidateBulkDeleteEstimatesResponse = {
  deletableCount: number;
  nonDeletableCount: number;
  deletableIds: number[];
  nonDeletableIds: number[];
};

export async function fetchSaleEstimates(
  fetcher: ApiFetcher,
  query?: GetSaleEstimatesQuery
): Promise<SaleEstimatesListResponse> {
  const get = fetcher.path(SALE_ESTIMATES_ROUTES.LIST).method('get').create();
  const { data } = await get(query || {});
  return data;
}

export async function fetchSaleEstimate(fetcher: ApiFetcher, id: number): Promise<SaleEstimate> {
  const get = fetcher.path(SALE_ESTIMATES_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

/**
 * Downloads the given sale estimate as a PDF document. The server picks the
 * output format from the `Accept` header; the raw-response middleware returns
 * the body as a Blob and the filename is read from Content-Disposition.
 */
export async function fetchSaleEstimatePdf(
  fetcher: ApiFetcher,
  id: number
): Promise<PdfDocument> {
  const get = fetcher.path(SALE_ESTIMATES_ROUTES.BY_ID).method('get').create();
  const response = await get({ id }, { headers: { Accept: 'application/pdf' } });
  return toPdfDocument(response);
}

export async function createSaleEstimate(
  fetcher: ApiFetcher,
  values: CreateSaleEstimateBody
): Promise<void> {
  const post = fetcher.path(SALE_ESTIMATES_ROUTES.LIST).method('post').create();
  await post(values);
}

export async function editSaleEstimate(
  fetcher: ApiFetcher,
  id: number,
  values: EditSaleEstimateBody
): Promise<void> {
  const put = fetcher.path(SALE_ESTIMATES_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values });
}

export async function deleteSaleEstimate(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(SALE_ESTIMATES_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export interface SaleEstimateMailStateResponse {
  from: string[];
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  message: string;
  formatArgs?: { customerName: string; estimateAmount: string };
  toOptions: Array<{ label: string; mail: string; primary?: boolean }>;
  fromOptions: Array<{ label: string; mail: string; primary?: boolean }>;
  attachEstimate?: boolean;
  estimateDate: string;
  estimateDateFormatted: string;
  expirationDate: string;
  expirationDateFormatted: string;
  total: number;
  totalFormatted: string;
  subtotal: number;
  subtotalFormatted: string;
  discountAmount: number;
  discountAmountFormatted: string;
  discountPercentage: number | null;
  discountPercentageFormatted: string;
  discountLabel: string;
  adjustment: number;
  adjustmentFormatted: string;
  estimateNumber: string;
  entries: Array<{ name: string; quantity: number; unitPrice: number; unitPriceFormatted: string; total: number; totalFormatted: string }>;
  companyName: string;
  companyLogoUri: string | null;
  primaryColor: string | null;
  customerName: string;
}

export async function bulkDeleteSaleEstimates(
  fetcher: ApiFetcher,
  body: BulkDeleteEstimatesBody
): Promise<void> {
  const post = fetcher.path(SALE_ESTIMATES_ROUTES.BULK_DELETE).method('post').create();
  await post({ ids: body.ids, skipUndeletable: body.skipUndeletable ?? false } as never);
}

export async function validateBulkDeleteSaleEstimates(
  fetcher: ApiFetcher,
  ids: number[]
): Promise<ValidateBulkDeleteEstimatesResponse> {
  const post = fetcher.path(SALE_ESTIMATES_ROUTES.VALIDATE_BULK_DELETE).method('post').create();
  const { data } = await post({ ids, skipUndeletable: false } as never);
  return data as ValidateBulkDeleteEstimatesResponse;
}

export async function deliverSaleEstimate(fetcher: ApiFetcher, id: number): Promise<void> {
  const post = fetcher.path(SALE_ESTIMATES_ROUTES.DELIVER).method('post').create();
  await post({ id });
}

export async function approveSaleEstimate(fetcher: ApiFetcher, id: number): Promise<void> {
  const put = fetcher.path(SALE_ESTIMATES_ROUTES.APPROVE).method('put').create();
  await put({ id });
}

export async function rejectSaleEstimate(fetcher: ApiFetcher, id: number): Promise<void> {
  const put = fetcher.path(SALE_ESTIMATES_ROUTES.REJECT).method('put').create();
  await put({ id });
}

export async function notifySaleEstimateBySms(
  fetcher: ApiFetcher,
  id: number,
  body?: Record<string, unknown>
): Promise<void> {
  const post = fetcher.path(SALE_ESTIMATES_ROUTES.NOTIFY_SMS).method('post').create();
  await post({ id, ...(body ?? {}) } as never);
}

export async function fetchSaleEstimateSmsDetails(
  fetcher: ApiFetcher,
  id: number
): Promise<unknown> {
  const get = fetcher.path(SALE_ESTIMATES_ROUTES.SMS_DETAILS).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function fetchSaleEstimateMail(fetcher: ApiFetcher, id: number): Promise<SaleEstimateMailStateResponse> {
  const get = fetcher.path(SALE_ESTIMATES_ROUTES.MAIL).method('get').create();
  const { data } = await get({ id });
  return data as SaleEstimateMailStateResponse;
}

export async function sendSaleEstimateMail(
  fetcher: ApiFetcher,
  id: number,
  body?: Record<string, unknown>
): Promise<void> {
  const post = fetcher.path(SALE_ESTIMATES_ROUTES.MAIL).method('post').create();
  await post({ id, ...(body ?? {}) } as never);
}

export async function fetchSaleEstimatesState(fetcher: ApiFetcher): Promise<SaleEstimatesStateResponse> {
  const get = fetcher.path(SALE_ESTIMATES_ROUTES.STATE).method('get').create();
  const { data } = await get({});
  return data as SaleEstimatesStateResponse;
}

export async function fetchSaleEstimateHtmlContent(
  fetcher: ApiFetcher,
  id: number
): Promise<SaleEstimateHtmlContentResponse> {
  return rawRequest<SaleEstimateHtmlContentResponse>(
    fetcher,
    'GET',
    `/api/sale-estimates/${id}`,
    undefined,
    { Accept: 'application/json+html' }
  );
}
