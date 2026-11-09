export interface UsersState {
  items: Record<string, unknown>;
  userById: Record<string, unknown>;
  loading: boolean;
}

export const USERS_LIST_SET = 'USERS_LIST_SET' as const;
export const USERS_TABLE_LOADING = 'USERS_TABLE_LOADING' as const;
export const USER_DETAILS_SET = 'USER_DETAILS_SET' as const;
export const USER_DELETE = 'USER_DELETE' as const;
