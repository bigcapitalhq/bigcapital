import { createReducer } from '@reduxjs/toolkit';

export interface TransactionsLockedError {
  formattedLockedToDate?: string;
  [key: string]: unknown;
}

export interface GlobalErrorsData {
  something_wrong?: boolean;
  session_expired?: boolean;
  too_many_requests?: boolean;
  access_denied?: { message?: string };
  transactionsLocked?: TransactionsLockedError;
  subscriptionInactive?: boolean;
  userInactive?: boolean;
}

interface GlobalErrorsState {
  data: GlobalErrorsData;
}

const initialState: GlobalErrorsState = {
  data: {},
};

export const globalErrorsReducer = createReducer(initialState, {
  GLOBAL_ERRORS_SET: (
    state,
    action: { payload: { errors: Partial<GlobalErrorsData> } },
  ) => {
    const { errors } = action.payload;

    state.data = {
      ...state.data,
      ...errors,
    };
  },
});
