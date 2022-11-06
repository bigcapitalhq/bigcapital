// @ts-nocheck


export const setGlobalErrors = (errors) => {
  return {
    type: 'GLOBAL_ERRORS_SET',
    payload: {
      errors,
    },
  };
}