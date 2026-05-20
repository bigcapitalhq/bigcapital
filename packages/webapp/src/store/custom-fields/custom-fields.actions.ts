import ApiService from '@/services/ApiService';
import { CUSTOM_FIELDS_RESOURCE_SET } from '@/store/types';;

export const fetchResourceFields = ({ resourceSlug }: { resourceSlug: string }) => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.get(`fields/resource/${resourceSlug}`)
        .then((response) => {
          dispatch({ type: CUSTOM_FIELDS_RESOURCE_SET, resourceSlug, fields: response.data.fields });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};
