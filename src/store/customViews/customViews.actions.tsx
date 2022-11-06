// @ts-nocheck
import ApiService from "services/ApiService";
import t from '@/store/types';

export const submitView = ({ form }) => {
  return (dispatch) => ApiService.post('views', form);
};

export const editView = ({ id, form }) => {
  return (dispatch) => ApiService.post(`views/${id}`, form);
};

export const deleteView = ({ id }) => {
  return (dispatch) => ApiService.delete(`views/${id}`);
};

export const fetchView = ({ id }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`views/${id}`).then((response) => {
      dispatch({
        type: t.VIEW_META_SET,
        view: response.data.view,
      });
      resolve(response);
    }).catch(error => { reject(error); });
  });
};

export const fetchResourceViews = ({ resourceSlug }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`views/resource/${resourceSlug}`)
      .then((response) => {
        dispatch({
          type: t.RESOURCE_VIEWS_SET,
          resource: resourceSlug,
          views: response.data.views,
        });
        dispatch({
          type: t.VIEW_ITEMS_SET,
          views: response.data.views,
        });
        resolve(response);
      })
      .catch((error) => { reject(error); });
  });
};

export const fetchViewResource = ({ id }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`views/${id}/resource`).then((response) => {
      dispatch({
        type: t.RESOURCE_COLUMNS_SET,
        columns: response.data.resource_columns,
        resource_slug: response.data.resource_slug
      });
      dispatch({
        type: t.RESOURCE_FIELDS_SET,
        fields: response.data.resource_fields, 
        resource_slug: response.data.resource_slug,
      });
      resolve(response);
    }).catch((error) => { reject(error); });
  });
}