import ApiService from '@/plugins/api-service';

const state = {
  list: {},
  details: [],
};

const getters = {
  getCustomers: s => s.list,
  getCustomer: s => id => s.details.find(i => i.id === id),
};

const actions = {
  /**
   * Fetches customers with current page.
   */
  async fetchCustomers({ commit }, { query } = {}) {
    const response = await ApiService.post('customers', { params: query });
    const { data } = response;
    const { count } = data.pagination;

    commit('setItems', data);

    if (count) {
      commit('setSidebarItemCount', { name: 'customers', count });
    }
    return data;
  },

  /**
   * Fetch the given customer details.
   */
  async fetchCustomer({ commit }, { id }) {
    const response = await ApiService.get(`customers/${id}`);
    const { data } = response;

    commit('setItem', data);
    return data;
  },

  /**
   * Delete the given customer.
   */
  async deleteCustomer({}, { id }) {
    return ApiService.delete(`customers/${id}`);
  },

  /**
   * Submit the new customer.
   */
  async newCustomer({}, { form }) {
    return ApiService.post('customers', form);
  },

  /**
   * Update details the given customer.
   */
  async updateCustomer({}, { form, id }) {
    return ApiService.post(`customers/${id}`, form);
  },
};

const mutations = {

  setCustomers(s, items) {
    s.list = items;
  },

  setCustomer(s, item) {
    s.details = s.details.filter(i => i.id !== item.id);
    s.details.push(item);
  },
};

export default { state, actions, mutations, getters };
