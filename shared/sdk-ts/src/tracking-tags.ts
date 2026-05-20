import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const TRACKING_TAGS_ROUTES = {
  LIST: '/api/tracking-tags',
  BY_ID: '/api/tracking-tags/{id}',
} as const satisfies Record<string, keyof paths>;

export type TrackingTagsList = OpResponseBody<OpForPath<typeof TRACKING_TAGS_ROUTES.LIST, 'get'>>;
export type TrackingTag = OpResponseBody<OpForPath<typeof TRACKING_TAGS_ROUTES.BY_ID, 'get'>>;
export type CreateTrackingTagBody = OpRequestBody<OpForPath<typeof TRACKING_TAGS_ROUTES.LIST, 'post'>>;
export type EditTrackingTagBody = OpRequestBody<OpForPath<typeof TRACKING_TAGS_ROUTES.BY_ID, 'put'>>;

export async function fetchTrackingTags(
  fetcher: ApiFetcher,
): Promise<TrackingTagsList> {
  const get = fetcher.path(TRACKING_TAGS_ROUTES.LIST).method('get').create();
  const { data } = await get({});
  return data;
}

export async function fetchTrackingTag(
  fetcher: ApiFetcher,
  id: number,
): Promise<TrackingTag> {
  const get = fetcher.path(TRACKING_TAGS_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function createTrackingTag(
  fetcher: ApiFetcher,
  values: CreateTrackingTagBody,
): Promise<TrackingTag> {
  const post = fetcher.path(TRACKING_TAGS_ROUTES.LIST).method('post').create();
  const { data } = await post(values);
  return data;
}

export async function editTrackingTag(
  fetcher: ApiFetcher,
  id: number,
  values: EditTrackingTagBody,
): Promise<TrackingTag> {
  const put = fetcher.path(TRACKING_TAGS_ROUTES.BY_ID).method('put').create();
  const { data } = await put({ id, ...values });
  return data;
}

export async function deleteTrackingTag(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const del = fetcher.path(TRACKING_TAGS_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}
