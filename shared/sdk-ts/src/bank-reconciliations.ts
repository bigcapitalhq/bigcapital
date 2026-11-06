import type { ApiFetcher } from "./fetch-utils";
import { paths } from "./schema";
import {
  OpForPath,
  OpQueryParams,
  OpRequestBody,
  OpResponseBody,
} from "./utils";

export const BANK_RECONCILIATION_ROUTES = {
  LIST: "/api/banking/reconciliations",
  BY_ID: "/api/banking/reconciliations/{id}",
  FINISH: "/api/banking/reconciliations/{id}/finish",
  UNDO: "/api/banking/reconciliations/{id}/undo",
} as const satisfies Record<string, keyof paths>;

export type BankReconciliationsListResponse = OpResponseBody<
  OpForPath<typeof BANK_RECONCILIATION_ROUTES.LIST, "get">
>;

export type BankReconciliationDetailResponse = OpResponseBody<
  OpForPath<typeof BANK_RECONCILIATION_ROUTES.BY_ID, "get">
>;

export type BankReconciliationResponse =
  BankReconciliationDetailResponse["reconciliation"];

export type BankReconciliationTransactionResponse =
  BankReconciliationDetailResponse["transactions"][number];

export type GetBankReconciliationsQuery = OpQueryParams<
  OpForPath<typeof BANK_RECONCILIATION_ROUTES.LIST, "get">
>;

export type CreateBankReconciliationBody = OpRequestBody<
  OpForPath<typeof BANK_RECONCILIATION_ROUTES.LIST, "post">
>;

export type UpdateBankReconciliationBody = OpRequestBody<
  OpForPath<typeof BANK_RECONCILIATION_ROUTES.BY_ID, "put">
>;

export type FinishBankReconciliationBody = OpRequestBody<
  OpForPath<typeof BANK_RECONCILIATION_ROUTES.FINISH, "post">
>;

export type UndoBankReconciliationBody = OpRequestBody<
  OpForPath<typeof BANK_RECONCILIATION_ROUTES.UNDO, "post">
>;

export async function fetchBankReconciliations(
  fetcher: ApiFetcher,
  query: GetBankReconciliationsQuery,
): Promise<BankReconciliationsListResponse> {
  const get = fetcher
    .path(BANK_RECONCILIATION_ROUTES.LIST)
    .method("get")
    .create();
  const { data } = await get(query);
  return data;
}

export async function fetchBankReconciliation(
  fetcher: ApiFetcher,
  id: number,
): Promise<BankReconciliationDetailResponse> {
  const get = fetcher
    .path(BANK_RECONCILIATION_ROUTES.BY_ID)
    .method("get")
    .create();
  const { data } = await get({ id });
  return data;
}

export async function createBankReconciliation(
  fetcher: ApiFetcher,
  body: CreateBankReconciliationBody,
): Promise<BankReconciliationDetailResponse> {
  const post = fetcher
    .path(BANK_RECONCILIATION_ROUTES.LIST)
    .method("post")
    .create();
  const { data } = await post(body);
  return data;
}

export async function updateBankReconciliation(
  fetcher: ApiFetcher,
  id: number,
  body: UpdateBankReconciliationBody,
): Promise<BankReconciliationDetailResponse> {
  const put = fetcher
    .path(BANK_RECONCILIATION_ROUTES.BY_ID)
    .method("put")
    .create();
  const { data } = await put({ id, ...body });
  return data;
}

export async function finishBankReconciliation(
  fetcher: ApiFetcher,
  id: number,
  body: FinishBankReconciliationBody,
): Promise<BankReconciliationDetailResponse> {
  const post = fetcher
    .path(BANK_RECONCILIATION_ROUTES.FINISH)
    .method("post")
    .create();
  const { data } = await post({ id, ...body });
  return data;
}

export async function undoBankReconciliation(
  fetcher: ApiFetcher,
  id: number,
  body: UndoBankReconciliationBody,
): Promise<BankReconciliationDetailResponse> {
  const post = fetcher
    .path(BANK_RECONCILIATION_ROUTES.UNDO)
    .method("post")
    .create();
  const { data } = await post({ id, ...body });
  return data;
}

export async function deleteBankReconciliation(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const del = fetcher
    .path(BANK_RECONCILIATION_ROUTES.BY_ID)
    .method("delete")
    .create();
  await del({ id });
}
