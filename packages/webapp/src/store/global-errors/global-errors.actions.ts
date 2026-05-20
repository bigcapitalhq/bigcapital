export const setGlobalErrors = (errors: Record<string, unknown>) => {
  return {
    type: 'GLOBAL_ERRORS_SET',
    payload: {
      errors,
    },
  };
}