import ApiService from '@/services/ApiService';
import { RESOURCE_COLUMNS_SET, RESOURCE_FIELDS_SET, RESOURCE_VIEWS_SET, VIEW_ITEMS_SET, VIEW_META_SET } from '@/store/types';;

export const submitView = ({ form }: { form: unknown }) => {
  return (_dispatch: any) => ApiService.post('views', form);
};

export const editView = ({ id, form }: { id: string | number; form: unknown }) => {
  return (_dispatch: any) => ApiService.post(`views/${id}`, form);
};

export const deleteView = ({ id }: { id: string | number }) => {
  return (_dispatch: any) => ApiService.delete(`views/${id}`);
};

export const fetchView = ({ id }: { id: string | number }) => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.get(`views/${id}`)
        .then((response) => {
          dispatch({ type: VIEW_META_SET, view: response.data.view });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};

export const fetchResourceViews = ({ resourceSlug }: { resourceSlug: string }) => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.get(`views/resource/${resourceSlug}`)
        .then((response) => {
          dispatch({ type: RESOURCE_VIEWS_SET, resource: resourceSlug, views: response.data.views });
          dispatch({ type: VIEW_ITEMS_SET, views: response.data.views });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};

export const fetchViewResource = ({ id }: { id: string | number }) => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.get(`views/${id}/resource`)
        .then((response) => {
          dispatch({ type: RESOURCE_COLUMNS_SET, columns: response.data.resource_columns, resource_slug: response.data.resource_slug });
          dispatch({ type: RESOURCE_FIELDS_SET, fields: response.data.resource_fields, resource_slug: response.data.resource_slug });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};
