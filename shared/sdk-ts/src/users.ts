import type { ApiFetcher } from './fetch-utils';
import { paths, components } from './schema';
import { OpForPath, OpQueryParams, OpRequestBody, OpResponseBody } from './utils';

/**
 * Error types returned by the users and invitations API endpoints.
 * Derived from the server OpenAPI schema.
 */
export type UsersErrorType =
  components['schemas']['UsersApiErrorResponseDto']['errors'][number]['type'];

/**
 * Users and invitations API error response shape.
 */
export type UsersApiErrorResponse =
  components['schemas']['UsersApiErrorResponseDto'];

/**
 * Users and invitations API error type constants.
 * Typed against the generated OpenAPI schema so a server-side change that is
 * not reflected here fails the SDK typecheck.
 */
export const USERS_ERROR_TYPES = {
  CannotDeleteLastUser: 'CANNOT_DELETE_LAST_USER',
  UserAlreadyActive: 'USER_ALREADY_ACTIVE',
  UserAlreadyInactive: 'USER_ALREADY_INACTIVE',
  EmailAlreadyExists: 'EMAIL_ALREADY_EXISTS',
  PhoneNumberAlreadyExist: 'PHONE_NUMBER_ALREADY_EXIST',
  UserNotFound: 'USER_NOT_FOUND',
  UserSameTheAuthorizedUser: 'USER_SAME_THE_AUTHORIZED_USER',
  CannotAuthorizedUserMutateRole: 'CANNOT_AUTHORIZED_USER_MUTATE_ROLE',
  EmailAlreadyInvited: 'EMAIL_ALREADY_INVITED',
  InviteTokenInvalid: 'INVITE_TOKEN_INVALID',
  PhoneNumberExists: 'PHONE_NUMBER_EXISTS',
  EmailExists: 'EMAIL_EXISTS',
  EmailNotExists: 'EMAIL_NOT_EXISTS',
  UserRecentlyInvited: 'USER_RECENTLY_INVITED',
  CannotGrantRole: 'CANNOT_GRANT_ROLE',
  CannotRemoveLastAdmin: 'CANNOT_REMOVE_LAST_ADMIN',
  RoleNotFound: 'ROLE_NOT_FOUND',
} as const satisfies Record<string, UsersErrorType>;

export const USERS_ROUTES = {
  LIST: '/api/users',
  BY_ID: '/api/users/{id}',
  ACTIVATE: '/api/users/{id}/activate',
  INACTIVATE: '/api/users/{id}/inactivate',
} as const satisfies Record<string, keyof paths>;

export type UsersListResponse = OpResponseBody<OpForPath<typeof USERS_ROUTES.LIST, 'get'>>;
export type User = OpResponseBody<OpForPath<typeof USERS_ROUTES.BY_ID, 'get'>>;
export type EditUserBody = OpRequestBody<OpForPath<typeof USERS_ROUTES.BY_ID, 'put'>>;
export type GetUsersQuery = OpQueryParams<OpForPath<typeof USERS_ROUTES.LIST, 'get'>>;

export async function fetchUsers(
  fetcher: ApiFetcher,
  query: GetUsersQuery = { page: 1, page_size: 20 }
): Promise<UsersListResponse> {
  const get = fetcher.path(USERS_ROUTES.LIST).method('get').create();
  const { data } = await get(query);
  return data;
}

export async function fetchUser(fetcher: ApiFetcher, id: number): Promise<User> {
  const get = fetcher.path(USERS_ROUTES.BY_ID).method('get').create();
  const { data } = await get({ id });
  return data;
}

export async function editUser(
  fetcher: ApiFetcher,
  id: number,
  values: EditUserBody
): Promise<void> {
  const put = fetcher.path(USERS_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values });
}

export async function deleteUser(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(USERS_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export async function activateUser(fetcher: ApiFetcher, id: number): Promise<void> {
  const put = fetcher.path(USERS_ROUTES.ACTIVATE).method('put').create();
  await (put as (params: { id: number }) => ReturnType<typeof put>)({ id });
}

export async function inactivateUser(fetcher: ApiFetcher, id: number): Promise<void> {
  const put = fetcher.path(USERS_ROUTES.INACTIVATE).method('put').create();
  await (put as (params: { id: number }) => ReturnType<typeof put>)({ id });
}
