import ApiService from '@/services/ApiService';
import { RESOURCE_DATA_SET, RESOURCE_FIELDS_SET } from '@/store/types';;

export const fetchResourceColumns = ({ resourceSlug }: { resourceSlug: string }) => {
  return (_dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.get(`resources/${resourceSlug}/columns`)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
};

export const fetchResourceFields = ({ resourceSlug }: { resourceSlug: string }) => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.get(`resources/${resourceSlug}/fields`)
        .then((response) => {
          dispatch({ type: RESOURCE_FIELDS_SET, fields: response.data.resource_fields, resource_slug: resourceSlug });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};

export const fetchResourceData = ({ resourceSlug }: { resourceSlug: string }) => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.get(`/resources/${resourceSlug}/data`)
        .then((response) => {
          dispatch({ type: RESOURCE_DATA_SET, payload: { data: response.data.resource_data, resourceKey: resourceSlug } });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};
