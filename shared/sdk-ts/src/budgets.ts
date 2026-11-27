import type { ApiFetcher } from "./fetch-utils";
import { rawRequest } from "./fetch-utils";
import { paths } from "./schema";
import { OpForPath, OpQueryParams, OpResponseBody } from "./utils";

const BUDGETS_SCHEMA_ROUTES = {
  LIST: "/api/budgets",
  BY_ID: "/api/budgets/{id}",
} as const satisfies Record<string, keyof paths>;

export const BUDGETS_ROUTES = {
  ...BUDGETS_SCHEMA_ROUTES,
  PREFILL: "/api/budgets/prefill",
} as const;

export type BudgetsListResponse = OpResponseBody<
  OpForPath<typeof BUDGETS_SCHEMA_ROUTES.LIST, "get">
>;
export type Budget = OpResponseBody<
  OpForPath<typeof BUDGETS_SCHEMA_ROUTES.BY_ID, "get">
>;
export type GetBudgetsQuery = OpQueryParams<
  OpForPath<typeof BUDGETS_SCHEMA_ROUTES.LIST, "get">
>;

/**
 * A single budget entry as accepted by the create/edit endpoints.
 */
export interface BudgetEntryInput {
  accountId: number;
  date: string;
  amount: number;
}

/**
 * The create budget request body.
 *
 * The generated OpenAPI schema types date fields as `Record<string, never>`.
 * These explicit request types keep the SDK ergonomic for callers.
 */
export interface CreateBudgetBody {
  name: string;
  description?: string;
  fromDate: string;
  toDate: string;
  entries: BudgetEntryInput[];
}

export type EditBudgetBody = CreateBudgetBody;

export interface GetBudgetPrefillQuery {
  fromDate: string;
  toDate: string;
  sourceYear?: number;
}

export interface BudgetPrefillEntry {
  accountId: number;
  date: string;
  amount: number;
}

export interface BudgetPrefillResponse {
  sourceYear: number;
  fromDate: string;
  toDate: string;
  entries: BudgetPrefillEntry[];
}

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
  await post(values as never);
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

/**
 * Retrieves the budget entries prefilled from the previous years' actuals.
 *
 * The prefill endpoint is newer than the checked-in OpenAPI schema, so this
 * function uses the SDK's raw request helper until the schema is regenerated.
 */
export async function fetchBudgetPrefill(
  fetcher: ApiFetcher,
  query: GetBudgetPrefillQuery,
): Promise<BudgetPrefillResponse> {
  const params = new URLSearchParams({
    fromDate: query.fromDate,
    toDate: query.toDate,
  });
  if (query.sourceYear != null) {
    params.set("sourceYear", String(query.sourceYear));
  }
  return rawRequest<BudgetPrefillResponse>(
    fetcher,
    "GET",
    `${BUDGETS_ROUTES.PREFILL}?${params.toString()}`,
  );
}
