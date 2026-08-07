import { createReducer } from '@reduxjs/toolkit';

interface GlobalErrorsState {
  data: Record<string, unknown>;
}

const initialState: GlobalErrorsState = {
  data: {},
};

export const globalErrorsReducer = createReducer(initialState, {
  GLOBAL_ERRORS_SET: (
    state,
    action: { payload: { errors: Record<string, unknown> } },
  ) => {
    const { errors } = action.payload;

    state.data = {
      ...state.data,
      ...errors,
    };
  },
});
