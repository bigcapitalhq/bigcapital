import type { ApiFetcher } from "../fetch-utils";
import { paths } from "../schema";
import {
  OpForPath,
  OpQueryParams,
  OpRequestBody,
  OpResponseBody,
} from "../utils";

export const RECURRING_JOURNALS_ROUTES = {
  LIST: "/api/recurring-journals",
  BY_ID: "/api/recurring-journals/{id}",
  PAUSE: "/api/recurring-journals/{id}/pause",
  RESUME: "/api/recurring-journals/{id}/resume",
  GENERATE: "/api/recurring-journals/{id}/generate",
  JOURNALS: "/api/recurring-journals/{id}/journals",
} as const satisfies Record<string, keyof paths>;

export type RecurringJournalsListResponse = OpResponseBody<
  OpForPath<typeof RECURRING_JOURNALS_ROUTES.LIST, "get">
>;
export type RecurringJournal = OpResponseBody<
  OpForPath<typeof RECURRING_JOURNALS_ROUTES.BY_ID, "get">
>;
export type CreateRecurringJournalBody = OpRequestBody<
  OpForPath<typeof RECURRING_JOURNALS_ROUTES.LIST, "post">
>;
export type EditRecurringJournalBody = OpRequestBody<
  OpForPath<typeof RECURRING_JOURNALS_ROUTES.BY_ID, "put">
>;
export type GetRecurringJournalsQuery = OpQueryParams<
  OpForPath<typeof RECURRING_JOURNALS_ROUTES.LIST, "get">
>;
export type GenerateRecurringJournalResponse = OpResponseBody<
  OpForPath<typeof RECURRING_JOURNALS_ROUTES.GENERATE, "post">
>;
export type RecurringJournalJournalsResponse = OpResponseBody<
  OpForPath<typeof RECURRING_JOURNALS_ROUTES.JOURNALS, "get">
>;
export type GetRecurringJournalJournalsQuery = OpQueryParams<
  OpForPath<typeof RECURRING_JOURNALS_ROUTES.JOURNALS, "get">
>;

export async function fetchRecurringJournals(
  fetcher: ApiFetcher,
  query?: GetRecurringJournalsQuery,
): Promise<RecurringJournalsListResponse> {
  const get = fetcher
    .path(RECURRING_JOURNALS_ROUTES.LIST)
    .method("get")
    .create();
  const { data } = await (get as any)(query ?? {});
  return data;
}

export async function fetchRecurringJournal(
  fetcher: ApiFetcher,
  id: number,
): Promise<RecurringJournal> {
  const get = fetcher
    .path(RECURRING_JOURNALS_ROUTES.BY_ID)
    .method("get")
    .create();
  const { data } = await get({ id });
  return data;
}

export async function createRecurringJournal(
  fetcher: ApiFetcher,
  values: CreateRecurringJournalBody,
): Promise<RecurringJournal> {
  const post = fetcher
    .path(RECURRING_JOURNALS_ROUTES.LIST)
    .method("post")
    .create();
  const { data } = await post(values);
  return data;
}

export async function editRecurringJournal(
  fetcher: ApiFetcher,
  id: number,
  values: EditRecurringJournalBody,
): Promise<RecurringJournal> {
  const put = fetcher
    .path(RECURRING_JOURNALS_ROUTES.BY_ID)
    .method("put")
    .create();
  const { data } = await put({ id, ...values });
  return data;
}

export async function deleteRecurringJournal(
  fetcher: ApiFetcher,
  id: number,
): Promise<void> {
  const del = fetcher
    .path(RECURRING_JOURNALS_ROUTES.BY_ID)
    .method("delete")
    .create();
  await del({ id });
}

export async function pauseRecurringJournal(
  fetcher: ApiFetcher,
  id: number,
): Promise<RecurringJournal> {
  const post = fetcher
    .path(RECURRING_JOURNALS_ROUTES.PAUSE)
    .method("post")
    .create();
  const { data } = await post({ id });
  return data;
}

export async function resumeRecurringJournal(
  fetcher: ApiFetcher,
  id: number,
): Promise<RecurringJournal> {
  const post = fetcher
    .path(RECURRING_JOURNALS_ROUTES.RESUME)
    .method("post")
    .create();
  const { data } = await post({ id });
  return data;
}

export async function generateRecurringJournalNow(
  fetcher: ApiFetcher,
  id: number,
): Promise<GenerateRecurringJournalResponse> {
  const post = fetcher
    .path(RECURRING_JOURNALS_ROUTES.GENERATE)
    .method("post")
    .create();
  const { data } = await post({ id });
  return data;
}

export async function fetchRecurringJournalJournals(
  fetcher: ApiFetcher,
  id: number,
  query?: GetRecurringJournalJournalsQuery,
): Promise<RecurringJournalJournalsResponse> {
  const get = fetcher
    .path(RECURRING_JOURNALS_ROUTES.JOURNALS)
    .method("get")
    .create();
  const { data } = await (get as any)({ id, ...(query ?? {}) });
  return data;
}
