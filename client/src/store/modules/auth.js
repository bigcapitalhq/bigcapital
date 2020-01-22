import ApiService from '@/plugins/api-service';

const state = {
  token: localStorage.getItem('token') || '',
  errors: {},
  role: {},
};

const getters = {
  authCheck: s => s.token,
  authToken: s => s.token,
  authorizedUserRole: s => s.role,
};

const actions = {
  /**
   * User login login authentication request.
   */
  async login({ commit }, { form }) {
    const response = await ApiService.post('auth/login', form);
    const { data } = response;

    if (data.token) {
      commit('setToken', data.token);
    }
    return data;
  },

  /**
   * Send reset password via email or SMS.
   */
  sendResetPassword({}, { email }) {
    return ApiService.post('auth/send_reset_password', { email });
  },

  newPassword({}, { form }) {
    return ApiService.post('auth/new_password', form);
  },
};

const mutations = {

  setToken(s, token) {
    localStorage.setItem('token', token);
    s.token = token;
  },

  removeToken(s) {
    localStorage.removeItem('token');
    s.token = '';
  },
};

export default { state, actions, mutations, getters };

