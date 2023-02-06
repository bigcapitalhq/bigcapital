// @ts-nocheck
import ApiService from '@/services/ApiService';

export const submitResetPassword = (password) => {
  return (dispatch) => {
    return ApiService.post('auth/reset_password', password);
  };
};
