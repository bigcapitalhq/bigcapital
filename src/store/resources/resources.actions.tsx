// @ts-nocheck
import ApiService from "services/ApiService";
import t from '@/store/types';

export const fetchResourceColumns = ({ resourceSlug }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`resources/${resourceSlug}/columns`).then((response) => {
      // dispatch({
      //   type: t.RESOURCE_COLUMNS_SET,
      //   columns: response.data.resource_columns,
      //   resource_slug: resourceSlug,
      // });
      // dispatch({
      //   type: t.SET_DASHBOARD_REQUEST_COMPLETED,
      // });
      resolve(response);
    }).catch((error) => { reject(error); });
  });
};

export const fetchResourceFields = ({ resourceSlug }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`resources/${resourceSlug}/fields`).then((response) => {
      dispatch({
        type: t.RESOURCE_FIELDS_SET,
        fields: response.data.resource_fields,
        resource_slug: resourceSlug,
      });
      resolve(response);
    }).catch((error) => { reject(error); });
  });
};

export const fetchResourceData = ({ resourceSlug }) => {
  return (dispatch) => new Promise((resolve, reject) => {
    ApiService.get(`/resources/${resourceSlug}/data`).then((response) => {
      dispatch({
        type: t.RESOURCE_DATA_SET,
        payload: {
          data: response.data.resource_data,
          resourceKey: resourceSlug,
        },
      });
      resolve(response);    
    }).catch(error => { reject(error); });
  });
};