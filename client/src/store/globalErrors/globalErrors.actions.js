

export const setGlobalErrors = (errors) => {
  return dispatch => {
    dispatch({
      type: 'GLOBAL_ERRORS_SET',
      payload: {
        errors,
      },
    });
  }
}