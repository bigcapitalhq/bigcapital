import ApiService from '~/plugins/api-service';

let state = {
  token: localStorage.getItem('token') || '',
  errors: {},
  role: {}
};

const getters = {
  authCheck: s => s.token,
  authToken: s => s.token,
  authorizedUserRole: s => s.role,
};

const actions = {
  /**
   * User login authentication request.
   */
  async authRequest({ commit }, { form }) {
    const response = await ApiService.post('auth/login', form);
    const { data } = response;

    if (data.token) {
      commit('setToken', data.token);
    }
    return data;
  },

  /**
   * Send reset password email or SMS.
   */
  sendResetPassword({}, { email }) {
    return ApiService.post('auth/send_reset_password', { email });
  },

  /**
   * Verify reset password verification code.
   */
  verifyResetPasswordToken({ commit, dispatch }, { token }) {
    return ApiService.post(`reset/${token}`);
  }
};


const mutations = {
  
  setToken(state, token) {
    localStorage.setItem('token', token);
    state.token = token;
  },

  removeToken(state) {
    localStorage.removeItem('token');
    state.token = '';
  },
};

export default {state, actions, mutations, getters};
