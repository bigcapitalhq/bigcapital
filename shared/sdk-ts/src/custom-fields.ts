import type { ApiFetcher } from "./fetch-utils";
import { paths } from "./schema";
import {
  OpForPath,
  OpQueryParams,
  OpRequestBody,
  OpResponseBody,
} from "./utils";

export const CUSTOM_FIELDS_ROUTES = {
  LIST: "/api/custom-fields",
  BY_ID: "/api/custom-fields/{id}",
  STATUS: "/api/custom-fields/{id}/status",
  REORDER: "/api/custom-fields/reorder",
} as const satisfies Record<string, keyof paths>;

export type CustomFieldsList = OpResponseBody<
  OpForPath<typeof CUSTOM_FIELDS_ROUTES.LIST, "get">
>;
export type CustomField = OpResponseBody<
  OpForPath<typeof CUSTOM_FIELDS_ROUTES.BY_ID, "get">
>;
export type CreateCustomFieldBody = OpRequestBody<
  OpForPath<typeof CUSTOM_FIELDS_ROUTES.LIST, "post">
>;
export type EditCustomFieldBody = OpRequestBody<
  OpForPath<typeof CUSTOM_FIELDS_ROUTES.BY_ID, "put">
>;
export type UpdateCustomFieldStatusBody = OpRequestBody<
  OpForPath<typeof CUSTOM_FIELDS_ROUTES.STATUS, "put">
>;
export type ReorderCustomFieldsBody = OpRequestBody<
  OpForPath<typeof CUSTOM_FIELDS_ROUTES.REORDER, "post">
>;
export type GetCustomFieldsQuery = OpQueryParams<
  OpForPath<typeof CUSTOM_FIELDS_ROUTES.LIST, "get">
>;
export type DeleteCustomFieldQuery = OpQueryParams<
  OpForPath<typeof CUSTOM_FIELDS_ROUTES.BY_ID, "delete">
>;

export async function fetchCustomFields(
  fetcher: ApiFetcher,
  query?: GetCustomFieldsQuery,
): Promise<CustomFieldsList> {
  const get = fetcher.path(CUSTOM_FIELDS_ROUTES.LIST).method("get").create();
  const { data } = await get(query ?? {});
  return data;
}

export async function fetchCustomField(
  fetcher: ApiFetcher,
  id: number,
): Promise<CustomField> {
  const get = fetcher.path(CUSTOM_FIELDS_ROUTES.BY_ID).method("get").create();
  const { data } = await get({ id });
  return data;
}

export async function createCustomField(
  fetcher: ApiFetcher,
  values: CreateCustomFieldBody,
): Promise<CustomField> {
  const post = fetcher.path(CUSTOM_FIELDS_ROUTES.LIST).method("post").create();
  const { data } = await post(values);
  return data;
}

export async function editCustomField(
  fetcher: ApiFetcher,
  id: number,
  values: EditCustomFieldBody,
): Promise<CustomField> {
  const put = fetcher.path(CUSTOM_FIELDS_ROUTES.BY_ID).method("put").create();
  const { data } = await put({ id, ...values });
  return data;
}

export async function deleteCustomField(
  fetcher: ApiFetcher,
  id: number,
  query?: DeleteCustomFieldQuery,
): Promise<void> {
  const del = fetcher
    .path(CUSTOM_FIELDS_ROUTES.BY_ID)
    .method("delete")
    .create();
  await del({ id, ...(query ?? {}) });
}

export async function updateCustomFieldStatus(
  fetcher: ApiFetcher,
  id: number,
  values: UpdateCustomFieldStatusBody,
): Promise<CustomField> {
  const put = fetcher.path(CUSTOM_FIELDS_ROUTES.STATUS).method("put").create();
  const { data } = await put({ id, ...values });
  return data;
}

export async function reorderCustomFields(
  fetcher: ApiFetcher,
  values: ReorderCustomFieldsBody,
): Promise<CustomField[]> {
  const post = fetcher
    .path(CUSTOM_FIELDS_ROUTES.REORDER)
    .method("post")
    .create();
  const { data } = await post(values);
  return data as CustomField[];
}
