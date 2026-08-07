import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const ITEMS_CATEGORIES_ROUTES = {
  LIST: '/api/item-categories',
  BY_ID: '/api/item-categories/{id}',
} as const satisfies Record<string, keyof paths>;

export type ItemCategoriesListResponse = OpResponseBody<OpForPath<typeof ITEMS_CATEGORIES_ROUTES.LIST, 'get'>>;
export type ItemCategory = OpResponseBody<OpForPath<typeof ITEMS_CATEGORIES_ROUTES.BY_ID, 'get'>>;
export type CreateItemCategoryBody = OpRequestBody<OpForPath<typeof ITEMS_CATEGORIES_ROUTES.LIST, 'post'>>;
export type EditItemCategoryBody = OpRequestBody<OpForPath<typeof ITEMS_CATEGORIES_ROUTES.BY_ID, 'put'>>;

export type GetItemCategoriesQuery = OpQueryParams<OpForPath<typeof ITEMS_CATEGORIES_ROUTES.LIST, 'get'>>;

export async function fetchItemCategories(fetcher: ApiFetcher, query?: GetItemCategoriesQuery): Promise<ItemCategoriesListResponse> {
  const get = fetcher.path(ITEMS_CATEGORIES_ROUTES.LIST).method('get').create();
  const { data } = await get(query ?? {});
  return data;
}

export async function fetchItemCategory(fetcher: ApiFetcher, id: number): Promise<ItemCategory> {
  const get = fetcher.path(ITEMS_CATEGORIES_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function createItemCategory(
  fetcher: ApiFetcher,
  values: CreateItemCategoryBody
): Promise<void> {
  const post = fetcher.path(ITEMS_CATEGORIES_ROUTES.LIST).method('post').create();
  await post(values);
}

export async function editItemCategory(
  fetcher: ApiFetcher,
  id: number,
  values: EditItemCategoryBody
): Promise<void> {
  const put = fetcher.path(ITEMS_CATEGORIES_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values });
}

export async function deleteItemCategory(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(ITEMS_CATEGORIES_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}
