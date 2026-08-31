import type { ApiFetcher } from "./fetch-utils";
import { rawRequest } from "./fetch-utils";
import { paths } from "./schema";
import { OpForPath, OpRequestBody, OpResponseBody } from "./utils";

export const PAYMENTS_RECEIVED_ROUTES = {
  LIST: "/api/payments-received",
  BY_ID: "/api/payments-received/{id}",
  STATE: "/api/payments-received/state",
  VALIDATE_BULK_DELETE: "/api/payments-received/validate-bulk-delete",
  BULK_DELETE: "/api/payments-received/bulk-delete",
  EDIT_PAGE: "/api/payments-received/{id}/edit-page",
  MAIL: "/api/payments-received/{id}/mail",
  NOTIFY_BY_SMS: "/api/payments-received/{id}/notify-by-sms",
  SMS_DETAILS: "/api/payments-received/{id}/sms-details",
} as const satisfies Record<string, keyof paths>;

export type PaymentsReceivedListResponse = OpResponseBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.LIST, "get">
>;
export type PaymentReceived = OpResponseBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.BY_ID, "get">
>;
export type CreatePaymentReceivedBody = OpRequestBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.LIST, "post">
>;
export type EditPaymentReceivedBody = OpRequestBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.BY_ID, "put">
>;
export type PaymentReceivedStateResponse = OpResponseBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.STATE, "get">
>;
export type PaymentReceiveEditPageResponse = OpResponseBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.EDIT_PAGE, "get">
>;
export type PaymentReceiveMailStateResponse = OpResponseBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.MAIL, "get">
>;
export type SendPaymentReceiveMailBody = OpRequestBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.MAIL, "post">
>;
export type SendPaymentReceiveMailResponse = OpResponseBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.MAIL, "post">
>;
export type PaymentReceiveSmsDetailsResponse = OpResponseBody<
  OpForPath<typeof PAYMENTS_RECEIVED_ROUTES.SMS_DETAILS, "get">
>;
export type PaymentReceivedHtmlContentResponse = { htmlContent: string };

export async function fetchPaymentsReceived(
  fetcher: ApiFetcher,
): Promise<PaymentsReceivedListResponse> {
  const get = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.LIST)
    .method("get")
    .create();
  const { data } = await get({});
  return data;
}

export async function fetchPaymentReceived(
  fetcher: ApiFetcher,
  id: number,
): Promise<PaymentReceived> {
  const get = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.BY_ID)
    .method("get")
    .create();
  const { data } = await get({ id });
  return data;
}

export async function createPaymentReceived(
  fetcher: ApiFetcher,
  values: CreatePaymentReceivedBody,
): Promise<void> {
  const post = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.LIST)
    .method("post")
    .create();
  await post(values);
}

export async function editPaymentReceived(
  fetcher: ApiFetcher,
  id: number,
  values: EditPaymentReceivedBody,
): Promise<void> {
  const put = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.BY_ID)
    .method("put")
    .create();
  await put({ id, ...values });
}

export async function deletePaymentReceived(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const del = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.BY_ID)
    .method("delete")
    .create();
  await del({ id });
}

export type BulkDeletePaymentsReceivedBody = {
  ids: number[];
  skipUndeletable?: boolean;
};
export type ValidateBulkDeletePaymentsReceivedResponse = {
  deletableCount: number;
  nonDeletableCount: number;
  deletableIds: number[];
  nonDeletableIds: number[];
};

export async function bulkDeletePaymentsReceived(
  fetcher: ApiFetcher,
  body: BulkDeletePaymentsReceivedBody,
): Promise<void> {
  const post = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.BULK_DELETE)
    .method("post")
    .create();
  await post({
    ids: body.ids,
    skipUndeletable: body.skipUndeletable ?? false,
  } as never);
}

export async function validateBulkDeletePaymentsReceived(
  fetcher: ApiFetcher,
  ids: number[],
): Promise<ValidateBulkDeletePaymentsReceivedResponse> {
  const post = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.VALIDATE_BULK_DELETE)
    .method("post")
    .create();
  const { data } = await post({ ids, skipUndeletable: false } as never);
  return data as ValidateBulkDeletePaymentsReceivedResponse;
}

export async function fetchPaymentReceiveEditPage(
  fetcher: ApiFetcher,
  id: number,
): Promise<PaymentReceiveEditPageResponse> {
  const get = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.EDIT_PAGE)
    .method("get")
    .create();
  const { data } = await get({ id });
  return data;
}

export async function fetchPaymentReceiveMail(
  fetcher: ApiFetcher,
  id: number,
): Promise<PaymentReceiveMailStateResponse> {
  const get = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.MAIL)
    .method("get")
    .create();
  const { data } = await get({ id });
  return data as PaymentReceiveMailStateResponse;
}

export async function sendPaymentReceiveMail(
  fetcher: ApiFetcher,
  id: number,
  body: SendPaymentReceiveMailBody,
): Promise<SendPaymentReceiveMailResponse> {
  const post = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.MAIL)
    .method("post")
    .create();
  const { data } = await post({ id, ...body });
  return data as SendPaymentReceiveMailResponse;
}

export async function fetchPaymentReceivedState(
  fetcher: ApiFetcher,
): Promise<PaymentReceivedStateResponse> {
  const get = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.STATE)
    .method("get")
    .create();
  const { data } = await get({});
  return data as PaymentReceivedStateResponse;
}

export async function fetchPaymentReceiveHtmlContent(
  fetcher: ApiFetcher,
  id: number,
): Promise<PaymentReceivedHtmlContentResponse> {
  return rawRequest<PaymentReceivedHtmlContentResponse>(
    fetcher,
    "GET",
    `/api/payments-received/${id}`,
    undefined,
    { Accept: "application/json+html" },
  );
}

export async function notifyPaymentReceiveBySms(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const post = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.NOTIFY_BY_SMS)
    .method("post")
    .create();
  await post({ id });
}

export async function fetchPaymentReceiveSmsDetails(
  fetcher: ApiFetcher,
  id: number,
): Promise<PaymentReceiveSmsDetailsResponse> {
  const get = fetcher
    .path(PAYMENTS_RECEIVED_ROUTES.SMS_DETAILS)
    .method("get")
    .create();
  const { data } = await get({ id });
  return data;
}
