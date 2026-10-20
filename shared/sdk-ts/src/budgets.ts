import type { ApiFetcher } from "./fetch-utils";
import { paths } from "./schema";
import {
  OpForPath,
  OpQueryParams,
  OpRequestBody,
  OpResponseBody,
} from "./utils";

export const BUDGETS_ROUTES = {
  LIST: "/api/budgets",
  BY_ID: "/api/budgets/{id}",
} as const satisfies Record<string, keyof paths>;

export type BudgetsListResponse = OpResponseBody<
  OpForPath<typeof BUDGETS_ROUTES.LIST, "get">
>;
export type Budget = OpResponseBody<
  OpForPath<typeof BUDGETS_ROUTES.BY_ID, "get">
>;
export type CreateBudgetBody = OpRequestBody<
  OpForPath<typeof BUDGETS_ROUTES.LIST, "post">
>;
export type EditBudgetBody = OpRequestBody<
  OpForPath<typeof BUDGETS_ROUTES.BY_ID, "put">
>;
export type GetBudgetsQuery = OpQueryParams<
  OpForPath<typeof BUDGETS_ROUTES.LIST, "get">
>;

export async function fetchBudgets(
  fetcher: ApiFetcher,
  query?: GetBudgetsQuery,
): Promise<BudgetsListResponse> {
  const get = fetcher.path(BUDGETS_ROUTES.LIST).method("get").create();
  const { data } = await (
    get as (params: GetBudgetsQuery) => Promise<{ data: BudgetsListResponse }>
  )(query ?? {});
  return data;
}

export async function fetchBudget(
  fetcher: ApiFetcher,
  id: number,
): Promise<Budget> {
  const get = fetcher.path(BUDGETS_ROUTES.BY_ID).method("get").create();
  const { data } = await get({ id });
  return data;
}

export async function createBudget(
  fetcher: ApiFetcher,
  values: CreateBudgetBody,
): Promise<void> {
  const post = fetcher.path(BUDGETS_ROUTES.LIST).method("post").create();
  await post(values);
}

export async function editBudget(
  fetcher: ApiFetcher,
  id: number,
  values: EditBudgetBody,
): Promise<void> {
  const put = fetcher.path(BUDGETS_ROUTES.BY_ID).method("put").create();
  await put({ id, ...(values as object) } as never);
}

export async function deleteBudget(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const del = fetcher.path(BUDGETS_ROUTES.BY_ID).method("delete").create();
  await (del as unknown as (params: { id: number }) => Promise<void>)({ id });
}
