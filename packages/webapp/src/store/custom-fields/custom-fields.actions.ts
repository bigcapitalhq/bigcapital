import type { RootState } from '@/store/reducers';
import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import ApiService from '@/services/ApiService';
import { CUSTOM_FIELDS_RESOURCE_SET } from '@/store/types';

export const fetchResourceFields = ({
  resourceSlug,
}: {
  resourceSlug: string;
}): ThunkAction<Promise<unknown>, RootState, unknown, AnyAction> => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`fields/resource/${resourceSlug}`)
        .then((response) => {
          dispatch({
            type: CUSTOM_FIELDS_RESOURCE_SET,
            resourceSlug,
            fields: response.data.fields,
          });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};
