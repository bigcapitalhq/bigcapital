import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpRequestBody, OpResponseBody } from './utils';

export const PAYMENT_SERVICES_ROUTES = {
  LIST: '/api/payment-services',
  STATE: '/api/payment-services/state',
  BY_ID: '/api/payment-services/{paymentServiceId}',
  UPDATE_METHOD: '/api/payment-services/{paymentMethodId}',
  DELETE_METHOD: '/api/payment-services/{paymentMethodId}',
} as const satisfies Record<string, keyof paths>;

export type GetPaymentServicesResponse = OpResponseBody<
  OpForPath<typeof PAYMENT_SERVICES_ROUTES.LIST, 'get'>
>;
export type GetPaymentServicesStateResponse = OpResponseBody<
  OpForPath<typeof PAYMENT_SERVICES_ROUTES.STATE, 'get'>
>;
export type GetPaymentServiceResponse = OpResponseBody<
  OpForPath<typeof PAYMENT_SERVICES_ROUTES.BY_ID, 'get'>
>;
export type UpdatePaymentMethodBody = OpRequestBody<
  OpForPath<typeof PAYMENT_SERVICES_ROUTES.UPDATE_METHOD, 'post'>
>;
export type UpdatePaymentMethodResponse = OpResponseBody<
  OpForPath<typeof PAYMENT_SERVICES_ROUTES.UPDATE_METHOD, 'post'>
>;
export type DeletePaymentMethodResponse = OpResponseBody<
  OpForPath<typeof PAYMENT_SERVICES_ROUTES.DELETE_METHOD, 'delete'>
>;

export async function fetchGetPaymentServices(
  fetcher: ApiFetcher,
): Promise<GetPaymentServicesResponse> {
  const get = fetcher
    .path(PAYMENT_SERVICES_ROUTES.LIST)
    .method('get')
    .create();
  const { data } = await get({});
  return data;
}

export async function fetchGetPaymentServicesState(
  fetcher: ApiFetcher,
): Promise<GetPaymentServicesStateResponse> {
  const get = fetcher
    .path(PAYMENT_SERVICES_ROUTES.STATE)
    .method('get')
    .create();
  const { data } = await get({});
  return data;
}

export async function fetchGetPaymentService(
  fetcher: ApiFetcher,
  paymentServiceId: number,
): Promise<GetPaymentServiceResponse> {
  const get = fetcher
    .path(PAYMENT_SERVICES_ROUTES.BY_ID)
    .method('get')
    .create();
  const { data } = await get({ paymentServiceId });
  return data;
}

export async function fetchUpdatePaymentMethod(
  fetcher: ApiFetcher,
  paymentMethodId: number,
  body: UpdatePaymentMethodBody,
): Promise<UpdatePaymentMethodResponse> {
  const post = fetcher
    .path(PAYMENT_SERVICES_ROUTES.UPDATE_METHOD)
    .method('post')
    .create();
  const { data } = await post({ paymentMethodId, ...body });
  return data;
}

export async function fetchDeletePaymentMethod(
  fetcher: ApiFetcher,
  paymentMethodId: number,
): Promise<DeletePaymentMethodResponse> {
  const del = fetcher
    .path(PAYMENT_SERVICES_ROUTES.DELETE_METHOD)
    .method('delete')
    .create();
  const { data } = await del({ paymentMethodId });
  return data;
}
