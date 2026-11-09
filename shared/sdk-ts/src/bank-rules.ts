import type { ApiFetcher } from './fetch-utils';
import { withNestedQuery } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const BANK_RULES_ROUTES = {
  RULES: '/api/banking/rules',
  RULE_BY_ID: '/api/banking/rules/{id}',
  ACCOUNTS_DISCONNECT: '/api/banking/accounts/{id}/disconnect',
  ACCOUNTS_REFRESH: '/api/banking/accounts/{id}/refresh',
  ACCOUNTS_PAUSE: '/api/banking/accounts/{id}/pause',
  ACCOUNTS_RESUME: '/api/banking/accounts/{id}/resume',
  MATCHING_MATCHED: '/api/banking/matching/matched',
  MATCHING_MATCH: '/api/banking/matching/match',
  MATCHING_UNMATCH: '/api/banking/matching/unmatch/{uncategorizedTransactionId}',
  EXCLUDE: '/api/banking/exclude/{id}',
  EXCLUDE_BULK: '/api/banking/exclude/bulk',
  EXCLUDED_LIST: '/api/banking/exclude',
  RECOGNIZED: '/api/banking/recognized/{recognizedTransactionId}',
  RECOGNIZED_LIST: '/api/banking/recognized',
  PENDING: '/api/banking/pending',
  UNCATEGORIZED_AUTOFILL: '/api/banking/uncategorized/autofill',
  CATEGORIZE_BULK: '/api/banking/categorize/bulk',
} as const satisfies Record<string, keyof paths>;

export type BankRulesListResponse = OpResponseBody<OpForPath<typeof BANK_RULES_ROUTES.RULES, 'get'>>;
export type BankRuleResponse = OpResponseBody<OpForPath<typeof BANK_RULES_ROUTES.RULE_BY_ID, 'get'>>;
export type CreateBankRuleBody = OpRequestBody<OpForPath<typeof BANK_RULES_ROUTES.RULES, 'post'>>;
export type EditBankRuleBody = OpRequestBody<OpForPath<typeof BANK_RULES_ROUTES.RULE_BY_ID, 'put'>>;
export type CreateBankRuleResponse = OpResponseBody<OpForPath<typeof BANK_RULES_ROUTES.RULES, 'post'>>;

/** Path params for pause/resume/disconnect/refresh bank account (id = bankAccountId). */
export type PauseBankAccountParams = OpForPath<typeof BANK_RULES_ROUTES.ACCOUNTS_PAUSE, 'post'> extends { parameters: { path: infer P } } ? P : never;
export type ResumeBankAccountParams = OpForPath<typeof BANK_RULES_ROUTES.ACCOUNTS_RESUME, 'post'> extends { parameters: { path: infer P } } ? P : never;
export type DisconnectBankAccountParams = OpForPath<typeof BANK_RULES_ROUTES.ACCOUNTS_DISCONNECT, 'post'> extends { parameters: { path: infer P } } ? P : never;
export type RefreshBankAccountParams = OpForPath<typeof BANK_RULES_ROUTES.ACCOUNTS_REFRESH, 'post'> extends { parameters: { path: infer P } } ? P : never;
export type UnmatchMatchedTransactionParams = OpForPath<typeof BANK_RULES_ROUTES.MATCHING_UNMATCH, 'patch'> extends { parameters: { path: infer P } } ? P : never;

/** Response for GET /api/banking/matching/matched (from server GetMatchedTransactionsResponseDto). */
export type MatchedTransactionsResponse = OpResponseBody<OpForPath<typeof BANK_RULES_ROUTES.MATCHING_MATCHED, 'get'>>;

/** Query params for GET /api/banking/matching/matched. */
export type GetMatchedTransactionsQuery = OpQueryParams<OpForPath<typeof BANK_RULES_ROUTES.MATCHING_MATCHED, 'get'>>;

/** Body for POST /api/banking/matching/match (use referenceType, referenceId - camelCase). */
export type MatchTransactionBody = OpRequestBody<OpForPath<typeof BANK_RULES_ROUTES.MATCHING_MATCH, 'post'>>;

/** Body for PUT/DELETE /api/banking/exclude/bulk (from server ExcludeBankTransactionsBulkDto). */
export type ExcludeBankTransactionsBulkBody = OpRequestBody<OpForPath<typeof BANK_RULES_ROUTES.EXCLUDE_BULK, 'put'>>;

/** Query params for GET /api/banking/exclude. */
export type GetExcludedBankTransactionsQuery = OpQueryParams<OpForPath<typeof BANK_RULES_ROUTES.EXCLUDED_LIST, 'get'>>;

/** Query params for GET /api/banking/pending. */
export type GetPendingTransactionsQuery = OpQueryParams<OpForPath<typeof BANK_RULES_ROUTES.PENDING, 'get'>>;

/** Response for GET /api/banking/uncategorized/autofill (from server GetAutofillCategorizeTransactionResponseDto). */
export type AutofillCategorizeTransactionResponse = OpResponseBody<OpForPath<typeof BANK_RULES_ROUTES.UNCATEGORIZED_AUTOFILL, 'get'>>;

/** Response for GET /api/banking/recognized (single). */
export type RecognizedTransactionResponse = OpResponseBody<OpForPath<typeof BANK_RULES_ROUTES.RECOGNIZED, 'get'>>;

/** Paginated list response for GET /api/banking/recognized (from OpenAPI schema). */
export type BankTransactionsListPage = OpResponseBody<OpForPath<typeof BANK_RULES_ROUTES.RECOGNIZED_LIST, 'get'>>;

/** Paginated list response for GET /api/banking/exclude (from OpenAPI schema). */
export type ExcludedBankTransactionsListPage = OpResponseBody<OpForPath<typeof BANK_RULES_ROUTES.EXCLUDED_LIST, 'get'>>;

/** Paginated list response for GET /api/banking/pending (from OpenAPI schema). */
export type PendingBankTransactionsListPage = OpResponseBody<OpForPath<typeof BANK_RULES_ROUTES.PENDING, 'get'>>;

export async function fetchBankRules(fetcher: ApiFetcher): Promise<BankRulesListResponse> {
  const get = fetcher.path(BANK_RULES_ROUTES.RULES).method('get').create();
  const { data } = await get({});
  return data;
}

export async function fetchBankRule(
  fetcher: ApiFetcher,
  id: number
): Promise<BankRuleResponse> {
  const get = fetcher.path(BANK_RULES_ROUTES.RULE_BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function createBankRule(
  fetcher: ApiFetcher,
  body: CreateBankRuleBody
): Promise<CreateBankRuleResponse> {
  const post = fetcher.path(BANK_RULES_ROUTES.RULES).method('post').create();
  const { data } = await post(body);
  return data as CreateBankRuleResponse;
}

export async function editBankRule(
  fetcher: ApiFetcher,
  id: number,
  body: EditBankRuleBody
): Promise<void> {
  const put = fetcher.path(BANK_RULES_ROUTES.RULE_BY_ID).method('put').create();
  await put({ id, ...body });
}

export async function deleteBankRule(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(BANK_RULES_ROUTES.RULE_BY_ID).method('delete').create();
  await del({ id });
}

export async function disconnectBankAccount(
  fetcher: ApiFetcher,
  id: number
): Promise<void> {
  const post = fetcher
    .path(BANK_RULES_ROUTES.ACCOUNTS_DISCONNECT)
    .method('post')
    .create();
  await post({ id });
}

export async function refreshBankAccount(
  fetcher: ApiFetcher,
  id: number
): Promise<void> {
  const post = fetcher
    .path(BANK_RULES_ROUTES.ACCOUNTS_REFRESH)
    .method('post')
    .create();
  await post({ id });
}

export async function pauseBankAccount(
  fetcher: ApiFetcher,
  id: number
): Promise<void> {
  const post = fetcher
    .path(BANK_RULES_ROUTES.ACCOUNTS_PAUSE)
    .method('post')
    .create();
  await post({ id });
}

export async function resumeBankAccount(
  fetcher: ApiFetcher,
  id: number
): Promise<void> {
  const post = fetcher
    .path(BANK_RULES_ROUTES.ACCOUNTS_RESUME)
    .method('post')
    .create();
  await post({ id });
}

export async function fetchMatchedTransactions(
  fetcher: ApiFetcher,
  uncategorizedTransactionIds: number[],
  query?: GetMatchedTransactionsQuery
): Promise<MatchedTransactionsResponse> {
  const get = fetcher
    .path(BANK_RULES_ROUTES.MATCHING_MATCHED)
    .method('get')
    .create();
  const ids = uncategorizedTransactionIds.map(String);
  const { payload, init } = withNestedQuery({
    uncategorizedTransactionIds: ids,
    ...query,
  });
  const { data } = await get(payload, init);
  return data;
}

export async function matchTransaction(
  fetcher: ApiFetcher,
  body: MatchTransactionBody
): Promise<void> {
  const post = fetcher.path(BANK_RULES_ROUTES.MATCHING_MATCH).method('post').create();
  await post(body);
}

export async function unmatchMatchedTransaction(
  fetcher: ApiFetcher,
  uncategorizedTransactionId: number
): Promise<void> {
  const patch = fetcher
    .path(BANK_RULES_ROUTES.MATCHING_UNMATCH)
    .method('patch')
    .create();
  await patch({ uncategorizedTransactionId });
}

export async function excludeBankTransaction(
  fetcher: ApiFetcher,
  id: number | string
): Promise<void> {
  const put = fetcher.path(BANK_RULES_ROUTES.EXCLUDE).method('put').create();
  await put({ id: String(id) });
}

export async function unexcludeBankTransaction(
  fetcher: ApiFetcher,
  id: number | string
): Promise<void> {
  const del = fetcher.path(BANK_RULES_ROUTES.EXCLUDE).method('delete').create();
  await del({ id: String(id) });
}

export async function excludeBankTransactionsBulk(
  fetcher: ApiFetcher,
  body: ExcludeBankTransactionsBulkBody
): Promise<void> {
  const put = fetcher.path(BANK_RULES_ROUTES.EXCLUDE_BULK).method('put').create();
  await (put as (params: ExcludeBankTransactionsBulkBody) => Promise<unknown>)(body);
}

export async function unexcludeBankTransactionsBulk(
  fetcher: ApiFetcher,
  body: ExcludeBankTransactionsBulkBody
): Promise<void> {
  const del = fetcher.path(BANK_RULES_ROUTES.EXCLUDE_BULK).method('delete').create();
  await (del as (params: ExcludeBankTransactionsBulkBody) => Promise<unknown>)(body);
}

export async function fetchRecognizedTransaction(
  fetcher: ApiFetcher,
  recognizedTransactionId: number
): Promise<RecognizedTransactionResponse> {
  const get = fetcher.path(BANK_RULES_ROUTES.RECOGNIZED).method('get').create();
  const { data } = await get({ recognizedTransactionId });
  return data;
}

export async function fetchRecognizedTransactions(
  fetcher: ApiFetcher,
  params?: Record<string, unknown>
): Promise<BankTransactionsListPage> {
  const get = fetcher.path(BANK_RULES_ROUTES.RECOGNIZED_LIST).method('get').create();
  const { data } = await get(params ?? {});
  return data;
}

export async function fetchExcludedBankTransactions(
  fetcher: ApiFetcher,
  params?: GetExcludedBankTransactionsQuery
): Promise<ExcludedBankTransactionsListPage> {
  const get = fetcher.path(BANK_RULES_ROUTES.EXCLUDED_LIST).method('get').create();
  const { data } = await get(params ?? {});
  return data;
}

export async function fetchPendingTransactions(
  fetcher: ApiFetcher,
  params?: GetPendingTransactionsQuery
): Promise<PendingBankTransactionsListPage> {
  const get = fetcher.path(BANK_RULES_ROUTES.PENDING).method('get').create();
  const { data } = await get(params ?? {});
  return data;
}

export async function fetchAutofillCategorizeTransaction(
  fetcher: ApiFetcher,
  uncategorizedTransactionIds: number[]
): Promise<AutofillCategorizeTransactionResponse> {
  const get = fetcher
    .path(BANK_RULES_ROUTES.UNCATEGORIZED_AUTOFILL)
    .method('get')
    .create();
  // Server expects uncategorizedTransactionIds (array). Schema types update after openapi regen.
  const { data } = await get({
    uncategorizedTransactionIds,
  } as never);
  return data as AutofillCategorizeTransactionResponse;
}

export async function uncategorizeTransactionsBulk(
  fetcher: ApiFetcher,
  uncategorizedTransactionIds: number[],
): Promise<void> {
  const del = fetcher
    .path(BANK_RULES_ROUTES.CATEGORIZE_BULK)
    .method('delete')
    .create({ uncategorizedTransactionIds: 1 });
  await del({ uncategorizedTransactionIds: uncategorizedTransactionIds.map(String) });
}
