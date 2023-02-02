// @ts-nocheck
import ApiService from '@/services/ApiService';
import t from '@/store/types';

export const submitBilling = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.post('subscription/license/payment', form)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          const { response } = error;
          const { data } = response;

          reject(data?.errors);
        });
    });
};
