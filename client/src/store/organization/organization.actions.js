import ApiService from 'services/ApiService';

export const buildTenant = ({ id, token }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      ApiService.post(`organization/build${token}`, id)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
  };
};
export const seedTenant = ({ id, token }) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      ApiService.post(`organization/seed/${token}`, id)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.errors || []);
        });
    });
  };
};
