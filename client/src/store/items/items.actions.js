import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitItem = ({ form }) => {
  return dispatch => ApiService.post(`items`, form);
};

export const editItem = ({ id, form }) => {
  return dispatch => ApiService.post(`items/${id}`, form);
};

export const fetchItems = ({ query }) => {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    const pageQuery = getState().accounts.tableQuery;

    dispatch({
      type: t.ITEMS_TABLE_LOADING,
      payload: { loading: true },
    });
    ApiService.get(`items`, { params: { ...pageQuery, ...query } }).then(response => {    
      dispatch({
        type: t.ITEMS_SET,
        items: response.data.items.results,
      });
      dispatch({
        type: t.ITEMS_PAGE_SET,
        items: response.data.items.results,
        customViewId: response.data.customViewId,
        paginationMeta: response.data.items.pagination,
      });
      dispatch({
        type: t.ITEMS_TABLE_LOADING,
        payload: { loading: false },
      });
      resolve(response);
    }).catch(error => { reject(error); });
  });
};

export const fetchItem = ({ id }) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      ApiService.get(`items/${id}`)
        .then(response => {
          dispatch({
            type: t.ITEM_SET,
            item: response.data.item
          });
        })
        .catch(error => {
          reject(error);
        });
    });
};

export const deleteItem = ({ id }) => {
  return dispatch => ApiService.delete(`items/${id}`);
};
