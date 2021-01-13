import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitInventoryAdjustment = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('inventory_adjustments/quick', form)
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

export const deleteInventoryAdjustment = ({ id }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.delete(`inventory_adjustments/${id}`)
        .then((response) => {
          dispatch({
            type: t.INVENTORY_ADJUSTMENT_DELETE,
            payload: { id },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
};

export const fetchInventoryAdjustmentsTable = ({ query } = {}) => {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      const pageQuery = getState().inventoryAdjustments.tableQuery;
      dispatch({
        type: t.INVENTORY_ADJUSTMENTS_LOADING,
        payload: {
          loading: true,
        },
      });

      ApiService.get('inventory_adjustments', {
        params: { ...pageQuery, ...query },
      })
        .then((response) => {
          dispatch({
            type: t.INVENTORY_ADJUSTMENTS_PAGE_SET,
            payload: {
              inventory_adjustments: response.data.inventoy_adjustments,
              pagination: response.data.pagination,
              customViewId:
                response.data?.filter_meta?.view?.custom_view_id || -1,
            },
          });
          dispatch({
            type: t.INVENTORY_ADJUSTMENT_ITEMS_SET,
            payload: {
              inventory_adjustment: response.data.inventoy_adjustments,
            },
          });
          dispatch({
            type: t.INVENTORY_ADJUSTMENTS_PAGINATION_SET,
            payload: {
              pagination: response.data.pagination,
              customViewId:
                response.data?.filter_meta?.view?.custom_view_id || -1,
            },
          });
          dispatch({
            type: t.INVENTORY_ADJUSTMENTS_LOADING,
            payload: {
              loading: false,
            },
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};
