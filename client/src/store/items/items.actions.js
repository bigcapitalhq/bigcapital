import ApiService from "services/ApiService"
import t from 'store/types';

export const submitItem = ({ form }) => {
  return (dispatch) => ApiService.post(`items`, form);
};

export const editItem = ({ id, form }) => {
  return (dispatch) => ApiService.post(`items/${id}`, form);
};

export const fetchItems = ({ query }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`items`, query).then(response => {
      dispatch({
        type: t.ITEMS_LIST_SET,
        items: response.data.items,
      });
      resolve(response);
    }).catch(error => { reject(error); });
  });
};

export const fetchItem = ({ id }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`items/${id}`).then((response) => {
      dispatch({
        type: t.ITEM_SET,
        item: response.data.item,
      });
    }).catch(error => { reject(error); });
  });
};

export const deleteItem = ({ id }) => {
  return (dispatch) => ApiService.delete(`items/${id}`);
};