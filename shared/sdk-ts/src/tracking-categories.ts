import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpRequestBody, OpResponseBody } from './utils';

export const TRACKING_CATEGORIES_ROUTES = {
  LIST: '/api/tracking-categories',
  BY_ID: '/api/tracking-categories/{id}',
} as const satisfies Record<string, keyof paths>;

export type TrackingCategoriesList = OpResponseBody<
  OpForPath<typeof TRACKING_CATEGORIES_ROUTES.LIST, 'get'>
>;
export type TrackingCategory = OpResponseBody<
  OpForPath<typeof TRACKING_CATEGORIES_ROUTES.BY_ID, 'get'>
>;
export type CreateTrackingCategoryBody = OpRequestBody<
  OpForPath<typeof TRACKING_CATEGORIES_ROUTES.LIST, 'post'>
>;
export type EditTrackingCategoryBody = OpRequestBody<
  OpForPath<typeof TRACKING_CATEGORIES_ROUTES.BY_ID, 'put'>
>;

export async function fetchTrackingCategories(
  fetcher: ApiFetcher,
): Promise<TrackingCategoriesList> {
  const get = fetcher
    .path(TRACKING_CATEGORIES_ROUTES.LIST)
    .method('get')
    .create();
  const { data } = await get({});
  return data;
}

export async function fetchTrackingCategory(
  fetcher: ApiFetcher,
  id: number,
): Promise<TrackingCategory> {
  const get = fetcher
    .path(TRACKING_CATEGORIES_ROUTES.BY_ID)
    .method('get')
    .create();
  const { data } = await get({ id });
  return data;
}

export async function createTrackingCategory(
  fetcher: ApiFetcher,
  values: CreateTrackingCategoryBody,
): Promise<TrackingCategory> {
  const post = fetcher
    .path(TRACKING_CATEGORIES_ROUTES.LIST)
    .method('post')
    .create();
  const { data } = await post(values);
  return data;
}

export async function editTrackingCategory(
  fetcher: ApiFetcher,
  id: number,
  values: EditTrackingCategoryBody,
): Promise<TrackingCategory> {
  const put = fetcher
    .path(TRACKING_CATEGORIES_ROUTES.BY_ID)
    .method('put')
    .create();
  const { data } = await put({ id, ...values });
  return data;
}

export async function deleteTrackingCategory(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const del = fetcher
    .path(TRACKING_CATEGORIES_ROUTES.BY_ID)
    .method('delete')
    .create();
  await del({ id });
}
