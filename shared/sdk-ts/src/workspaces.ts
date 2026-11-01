import type { ApiFetcher } from './fetch-utils';
import { paths, components } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

export const WORKSPACES_ROUTES = {
  LIST: '/api/workspaces',
  BY_ID: '/api/workspaces/{organizationId}',
  BUILD_JOB: '/api/workspaces/build/{buildJobId}',
  DEFAULT: '/api/workspaces/default',
  INACTIVATE: '/api/workspaces/{organizationId}/inactivate',
  ACTIVATE: '/api/workspaces/{organizationId}/activate',
} as const satisfies Record<string, keyof paths>;

export type Workspace = components['schemas']['WorkspaceDto'];
export type WorkspaceMetadata = components['schemas']['WorkspaceMetadataDto'];
export type WorkspacesListResponse = OpResponseBody<OpForPath<typeof WORKSPACES_ROUTES.LIST, 'get'>>;
export type GetWorkspacesQuery = OpQueryParams<OpForPath<typeof WORKSPACES_ROUTES.LIST, 'get'>>;
export type CreateWorkspaceBody = OpRequestBody<OpForPath<typeof WORKSPACES_ROUTES.LIST, 'post'>>;
export type CreateWorkspaceResponse = OpResponseBody<OpForPath<typeof WORKSPACES_ROUTES.LIST, 'post'>>;
export type SetDefaultWorkspaceBody = OpRequestBody<OpForPath<typeof WORKSPACES_ROUTES.DEFAULT, 'put'>>;
export type WorkspaceBuildJob = OpResponseBody<OpForPath<typeof WORKSPACES_ROUTES.BUILD_JOB, 'get'>>;

export async function fetchWorkspaces(
  fetcher: ApiFetcher,
  query?: Partial<GetWorkspacesQuery>,
): Promise<WorkspacesListResponse> {
  const get = fetcher.path(WORKSPACES_ROUTES.LIST).method('get').create();
  const { data } = await (get as (params: Partial<GetWorkspacesQuery>) => Promise<{ data: WorkspacesListResponse }>)(
    query ?? {},
  );
  return data;
}

export async function createWorkspace(
  fetcher: ApiFetcher,
  body: CreateWorkspaceBody,
): Promise<CreateWorkspaceResponse> {
  const post = fetcher.path(WORKSPACES_ROUTES.LIST).method('post').create();
  const { data } = await post(body);
  return data;
}

export async function deleteWorkspace(
  fetcher: ApiFetcher,
  organizationId: string,
): Promise<void> {
  const del = fetcher.path(WORKSPACES_ROUTES.BY_ID).method('delete').create();
  await del({ organizationId });
}

export async function setDefaultWorkspace(
  fetcher: ApiFetcher,
  body: SetDefaultWorkspaceBody,
): Promise<void> {
  const put = fetcher.path(WORKSPACES_ROUTES.DEFAULT).method('put').create();
  await put(body);
}

export async function inactivateWorkspace(
  fetcher: ApiFetcher,
  organizationId: string,
): Promise<void> {
  const put = fetcher.path(WORKSPACES_ROUTES.INACTIVATE).method('put').create();
  await put({ organizationId });
}

export async function activateWorkspace(
  fetcher: ApiFetcher,
  organizationId: string,
): Promise<void> {
  const put = fetcher.path(WORKSPACES_ROUTES.ACTIVATE).method('put').create();
  await put({ organizationId });
}

export async function fetchWorkspaceBuildJob(
  fetcher: ApiFetcher,
  buildJobId: string,
): Promise<WorkspaceBuildJob> {
  const get = fetcher.path(WORKSPACES_ROUTES.BUILD_JOB).method('get').create();
  const { data } = await get({ buildJobId });
  return data;
}
