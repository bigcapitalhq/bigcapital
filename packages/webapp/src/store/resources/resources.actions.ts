import type { RootState } from '@/store/reducers';
import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import ApiService from '@/services/ApiService';
import { RESOURCE_DATA_SET, RESOURCE_FIELDS_SET } from '@/store/types';

type Thunk = ThunkAction<Promise<unknown>, RootState, unknown, AnyAction>;

export const fetchResourceColumns = ({
  resourceSlug,
}: {
  resourceSlug: string;
}): Thunk => {
  return (_dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`resources/${resourceSlug}/columns`)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
};

export const fetchResourceFields = ({
  resourceSlug,
}: {
  resourceSlug: string;
}): Thunk => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`resources/${resourceSlug}/fields`)
        .then((response) => {
          dispatch({
            type: RESOURCE_FIELDS_SET,
            fields: response.data.resource_fields,
            resource_slug: resourceSlug,
          });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};

export const fetchResourceData = ({
  resourceSlug,
}: {
  resourceSlug: string;
}): Thunk => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`/resources/${resourceSlug}/data`)
        .then((response) => {
          dispatch({
            type: RESOURCE_DATA_SET,
            payload: {
              data: response.data.resource_data,
              resourceKey: resourceSlug,
            },
          });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};
