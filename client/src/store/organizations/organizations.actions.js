import ApiService from 'services/ApiService';
import t from 'store/types';

export const fetchOrganizations = () => {
  return (dispatch) => new Promise((resolve, reject) => {
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
};