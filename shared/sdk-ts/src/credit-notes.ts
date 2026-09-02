import type { ApiFetcher, PdfDocument } from './fetch-utils';
import { toPdfDocument } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const CREDIT_NOTES_ROUTES = {
  LIST: '/api/credit-notes',
  BY_ID: '/api/credit-notes/{id}',
  STATE: '/api/credit-notes/state',
  OPEN: '/api/credit-notes/{id}/open',
  VALIDATE_BULK_DELETE: '/api/credit-notes/validate-bulk-delete',
  BULK_DELETE: '/api/credit-notes/bulk-delete',
  REFUNDS: '/api/credit-notes/{creditNoteId}/refunds',
  REFUND_BY_ID: '/api/credit-notes/refunds/{refundCreditId}',
  APPLIED_INVOICES: '/api/credit-notes/{creditNoteId}/applied-invoices',
  APPLY_INVOICES: '/api/credit-notes/{creditNoteId}/apply-invoices',
  APPLIED_INVOICE_BY_ID: '/api/credit-notes/applied-invoices/{applyCreditToInvoicesId}',
} as const satisfies Record<string, keyof paths>;

export type CreditNotesListResponse = OpResponseBody<OpForPath<typeof CREDIT_NOTES_ROUTES.LIST, 'get'>>;
export type CreditNote = OpResponseBody<OpForPath<typeof CREDIT_NOTES_ROUTES.BY_ID, 'get'>>;
export type CreateCreditNoteBody = OpRequestBody<OpForPath<typeof CREDIT_NOTES_ROUTES.LIST, 'post'>>;
export type EditCreditNoteBody = OpRequestBody<OpForPath<typeof CREDIT_NOTES_ROUTES.BY_ID, 'put'>>;
export type ValidateBulkDeleteCreditNotesBody = OpRequestBody<OpForPath<typeof CREDIT_NOTES_ROUTES.VALIDATE_BULK_DELETE, 'post'>>;
export type ValidateBulkDeleteCreditNotesResponse = OpResponseBody<OpForPath<typeof CREDIT_NOTES_ROUTES.VALIDATE_BULK_DELETE, 'post'>>;
export type BulkDeleteCreditNotesBody = OpRequestBody<OpForPath<typeof CREDIT_NOTES_ROUTES.BULK_DELETE, 'post'>>;
export type CreateRefundCreditNoteBody = OpRequestBody<OpForPath<typeof CREDIT_NOTES_ROUTES.REFUNDS, 'post'>>;
export type CreditNoteRefundsResponse = OpResponseBody<OpForPath<typeof CREDIT_NOTES_ROUTES.REFUNDS, 'get'>>;
export type RefundCreditNoteTransaction = OpResponseBody<OpForPath<typeof CREDIT_NOTES_ROUTES.REFUND_BY_ID, 'get'>>;
export type AppliedCreditNoteInvoicesResponse = OpResponseBody<OpForPath<typeof CREDIT_NOTES_ROUTES.APPLIED_INVOICES, 'get'>>;
export type CreditNoteInvoicesToApplyResponse = OpResponseBody<OpForPath<typeof CREDIT_NOTES_ROUTES.APPLY_INVOICES, 'get'>>;
export type ApplyCreditNoteToInvoicesBody = OpRequestBody<OpForPath<typeof CREDIT_NOTES_ROUTES.APPLY_INVOICES, 'post'>>;
export type GetCreditNotesQuery = OpQueryParams<OpForPath<typeof CREDIT_NOTES_ROUTES.LIST, 'get'>>;

export async function fetchCreditNotes(
  fetcher: ApiFetcher,
  query?: GetCreditNotesQuery
): Promise<CreditNotesListResponse> {
  const getCreditNotes = fetcher.path(CREDIT_NOTES_ROUTES.LIST).method('get').create();
  const { data } = await (
    getCreditNotes as (params: GetCreditNotesQuery) => Promise<{ data: CreditNotesListResponse }>
  )(query ?? {});
  return data;
}

export async function fetchCreditNote(fetcher: ApiFetcher, id: number): Promise<CreditNote> {
  const getCreditNote = fetcher.path(CREDIT_NOTES_ROUTES.BY_ID).method('get').create();
  const { data } = await getCreditNote({ id });
  return data;
}

/**
 * Downloads the given credit note as a PDF document. The server picks the
 * output format from the `Accept` header; the raw-response middleware returns
 * the body as a Blob and the filename is read from Content-Disposition.
 */
export async function fetchCreditNotePdf(
  fetcher: ApiFetcher,
  id: number
): Promise<PdfDocument> {
  const getCreditNote = fetcher.path(CREDIT_NOTES_ROUTES.BY_ID).method('get').create();
  const response = await getCreditNote({ id }, { headers: { Accept: 'application/pdf' } });
  return toPdfDocument(response);
}

/** Credit note state (default template etc.). Defined in controller DTO when not in schema. */
export interface CreditNoteStateResponse {
  defaultTemplateId: number;
}

export async function fetchCreditNoteState(
  fetcher: ApiFetcher
): Promise<CreditNoteStateResponse> {
  const getState = fetcher.path(CREDIT_NOTES_ROUTES.STATE).method('get').create();
  const { data } = await getState({});
  return (data ?? { defaultTemplateId: 0 }) as CreditNoteStateResponse;
}

export async function createCreditNote(
  fetcher: ApiFetcher,
  values: CreateCreditNoteBody
): Promise<void> {
  const create = fetcher.path(CREDIT_NOTES_ROUTES.LIST).method('post').create();
  await create(values);
}

export async function editCreditNote(
  fetcher: ApiFetcher,
  id: number,
  values: EditCreditNoteBody
): Promise<void> {
  const put = fetcher.path(CREDIT_NOTES_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values });
}

export async function deleteCreditNote(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(CREDIT_NOTES_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export async function openCreditNote(fetcher: ApiFetcher, id: number): Promise<void> {
  const open = fetcher.path(CREDIT_NOTES_ROUTES.OPEN).method('put').create();
  await open({ id });
}

export async function validateBulkDeleteCreditNotes(
  fetcher: ApiFetcher,
  body: ValidateBulkDeleteCreditNotesBody
): Promise<ValidateBulkDeleteCreditNotesResponse> {
  const validate = fetcher.path(CREDIT_NOTES_ROUTES.VALIDATE_BULK_DELETE).method('post').create();
  const { data } = await validate(body);
  return data;
}

export async function bulkDeleteCreditNotes(
  fetcher: ApiFetcher,
  body: BulkDeleteCreditNotesBody
): Promise<void> {
  const bulkDelete = fetcher.path(CREDIT_NOTES_ROUTES.BULK_DELETE).method('post').create();
  await bulkDelete(body);
}

export async function fetchCreditNoteRefunds(
  fetcher: ApiFetcher,
  creditNoteId: number
): Promise<CreditNoteRefundsResponse> {
  const getRefunds = fetcher.path(CREDIT_NOTES_ROUTES.REFUNDS).method('get').create();
  const { data } = await getRefunds({ creditNoteId });
  return data;
}

export async function createRefundCreditNote(
  fetcher: ApiFetcher,
  creditNoteId: number,
  values: CreateRefundCreditNoteBody
): Promise<void> {
  const create = fetcher.path(CREDIT_NOTES_ROUTES.REFUNDS).method('post').create();
  await create({ creditNoteId, ...values });
}

export async function deleteRefundCreditNote(
  fetcher: ApiFetcher,
  refundCreditId: number
): Promise<void> {
  const del = fetcher.path(CREDIT_NOTES_ROUTES.REFUND_BY_ID).method('delete').create();
  await del({ refundCreditId });
}

export async function fetchAppliedInvoices(
  fetcher: ApiFetcher,
  creditNoteId: number
): Promise<AppliedCreditNoteInvoicesResponse> {
  const getApplied = fetcher.path(CREDIT_NOTES_ROUTES.APPLIED_INVOICES).method('get').create();
  const { data } = await getApplied({ creditNoteId });
  return data;
}

export async function fetchCreditNoteAssociatedInvoicesToApply(
  fetcher: ApiFetcher,
  creditNoteId: number
): Promise<CreditNoteInvoicesToApplyResponse> {
  const get = fetcher.path(CREDIT_NOTES_ROUTES.APPLY_INVOICES).method('get').create();
  const { data } = await get({ creditNoteId });
  return data;
}

export async function fetchRefundCreditNoteTransaction(
  fetcher: ApiFetcher,
  refundCreditId: number
): Promise<RefundCreditNoteTransaction> {
  const get = fetcher.path(CREDIT_NOTES_ROUTES.REFUND_BY_ID).method('get').create();
  const { data } = await get({ refundCreditId: String(refundCreditId) } as never);
  return data;
}

export async function applyCreditNoteToInvoices(
  fetcher: ApiFetcher,
  creditNoteId: number,
  values: ApplyCreditNoteToInvoicesBody
): Promise<void> {
  const apply = fetcher.path(CREDIT_NOTES_ROUTES.APPLY_INVOICES).method('post').create();
  await apply({ creditNoteId, ...values });
}

export async function deleteApplyCreditNoteToInvoices(
  fetcher: ApiFetcher,
  applyCreditToInvoicesId: number
): Promise<void> {
  const del = fetcher.path(CREDIT_NOTES_ROUTES.APPLIED_INVOICE_BY_ID).method('delete').create();
  await del({ applyCreditToInvoicesId });
}
