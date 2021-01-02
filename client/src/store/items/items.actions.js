import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitItem = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('items', form)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;

          reject(data?.errors);
        });
    });
};

export const editItem = (id, form) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post(`items/${id}`, form)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;

          reject(data?.errors);
        });
    });
};

export const fetchItems = ({ query }) => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      let pageQuery = getState().items.tableQuery;

      dispatch({
        type: t.ITEMS_TABLE_LOADING,
        payload: { loading: true },
      });

      ApiService.get(`items`, { params: { ...pageQuery, ...query } })
        .then((response) => {
          dispatch({
            type: t.ITEMS_SET,
            items: response.data.items,
          });
          dispatch({
            type: t.ITEMS_PAGE_SET,
            items: response.data.items,
            customViewId:
              response.data?.filter_meta?.view?.custom_view_id || -1,
            paginationMeta: response.data.pagination,
          });
          dispatch({
            type: t.ITEMS_PAGINATION_SET,
            payload: {
              pagination: response.data.pagination,
              customViewId:
                response.data?.filter_meta?.view?.custom_view_id || -1,
            },
          });
          dispatch({
            type: t.ITEMS_TABLE_LOADING,
            payload: { loading: false },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const fetchItem = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`items/${id}`)
        .then((response) => {
          dispatch({
            type: t.ITEM_SET,
            payload: {
              id,
              item: response.data.item,
            },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

export const deleteItem = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`items/${id}`)
        .then((response) => {
          dispatch({
            type: t.ITEM_DELETE,
            payload: { id },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error?.response?.data);
        });
    });
};

export const deleteBulkItems = ({ ids }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete('items', { params: { ids } })
        .then((response) => {
          dispatch({
            type: t.ITEMS_BULK_DELETE,
            payload: { ids },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const activateItem = ({ id }) => {
  return (dispatch) => ApiService.post(`items/${id}/activate`);
};

export const inactiveItem = ({ id }) => {
  return (dispatch) => ApiService.post(`items/${id}/inactivate`);
};
