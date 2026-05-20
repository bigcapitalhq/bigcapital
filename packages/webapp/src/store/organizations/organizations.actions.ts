import ApiService from '@/services/ApiService';
import { ORGANIZATIONS_LIST_SET, SET_ORGANIZATION_CONGRATS } from '@/store/types';;
import type { RootState } from '@/store/reducers';

export const setOrganizations = (organizations: Array<Record<string, unknown>>) => ({
  type: ORGANIZATIONS_LIST_SET,
  payload: { organizations },
});

export const fetchOrganizations = () => (dispatch: any) =>
  new Promise((resolve, reject) => {
    ApiService.get('organization/all')
      .then((response) => {
        dispatch({
          type: ORGANIZATIONS_LIST_SET,
          payload: { organizations: response.data.organizations },
        });
        resolve(response);
      })
      .catch((error) => reject(error));
  });

export const setOrganizationSetupCompleted =
  (congrats: boolean) => (dispatch: any, getState: () => RootState) => {
    const state = getState();
    const organizationId = state.authentication.organizationId as string;
    const tenantId = getState().organizations.byOrganizationId?.[organizationId];

    dispatch({
      type: SET_ORGANIZATION_CONGRATS,
      payload: { tenantId, congrats },
    });
  };
