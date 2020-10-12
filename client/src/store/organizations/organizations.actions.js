import ApiService from 'services/ApiService';
import t from 'store/types';

export const fetchOrganizations = () => (dispatch) => new Promise((resolve, reject) => {
  ApiService.get('organization/all').then((response) => {
    dispatch({
      type: t.ORGANIZATIONS_LIST_SET,
      payload: {
        organizations: response.data.organizations,
      },
    });
    resolve(response)
  }).catch(error => { reject(error); });
});

export const buildTenant = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const organizationId = getState().authentication.organizationId;

  dispatch({
    type: t.SET_ORGANIZATION_INITIALIZING,
    payload: { organizationId }
  });
  ApiService.post(`organization/build`).then((response) => {
    resolve(response);
    dispatch({
      type: t.SET_ORGANIZATION_INITIALIZED,
      payload: { organizationId }
    });
  })
  .catch((error) => {
    reject(error.response.data.errors || []);
  });
});

export const seedTenant = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const organizationId = getState().authentication.organizationId;

  dispatch({
    type: t.SET_ORGANIZATION_INITIALIZING,
    payload: { organizationId }
  });
  ApiService.post(`organization/seed/`).then((response) => {
    resolve(response);
    dispatch({
      type: t.SET_ORGANIZATION_INITIALIZED,
      payload: { organizationId }
    });
  })
  .catch((error) => {
    reject(error.response.data.errors || []);
  });
});