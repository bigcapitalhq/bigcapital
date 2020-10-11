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

export const buildTenant = () => (dispatch) => new Promise((resolve, reject) => {
  ApiService.post(`organization/build`).then((response) => {
    resolve(response);
  })
  .catch((error) => {
    reject(error.response.data.errors || []);
  });
});

export const seedTenant = () => (dispatch) => new Promise((resolve, reject) => {
  ApiService.post(`organization/seed/`).then((response) => {
    resolve(response);
  })
  .catch((error) => {
    reject(error.response.data.errors || []);
  });
});