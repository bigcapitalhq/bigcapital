
import ApiService from 'services/ApiService';

export const submitInvite = ({ form, token }) => {
  return (dispatch) => {
    return ApiService.post(`/invite/accept/${token}`, { ...form });
  };
};

export const submitSendInvite = ({ form }) => {
  return (dispatch) => {
    return ApiService.post('invite', { form });
  };
};
