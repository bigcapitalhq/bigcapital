import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitCategory = ({ form }) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      ApiService.post('item_categories', form)
        .then(response => {
          dispatch({ type: t.ITEMS_CATEGORY_LIST_SET });
          resolve(response);
        })
        .catch(error => {
          const { response } = error;
          const { data } = response;
          const { errors } = data;

          dispatch({ type: t.ITEMS_CATEGORY_LIST_SET });
          if (errors) {
            dispatch({ type: t.ITEMS_CATEGORY_LIST_SET, errors });
          }
          reject(error);
        });
    });
};

export const submitItemCategory = ({ form }) => {
  return dispatch => {
    return ApiService.post('item_categories', { ...form });
  };
};

export const fetchCategory = () => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      ApiService.get('item_categories')
        .then(response => {
          dispatch({
            type: t.ITEMS_CATEGORY_DATA_TABLE,
            data: response.data
          });
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
};
