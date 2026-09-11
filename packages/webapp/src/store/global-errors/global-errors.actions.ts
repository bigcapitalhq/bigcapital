import type { GlobalErrorsData } from './global-errors.reducer';

export const setGlobalErrors = (errors: Partial<GlobalErrorsData>) => {
  return {
    type: 'GLOBAL_ERRORS_SET',
    payload: {
      errors,
    },
  };
};
