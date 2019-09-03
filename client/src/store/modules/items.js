import ApiService from '@/plugins/api-service';

const state = {
  list: {},
  details: [],
};

const getters = {
  getItems: s => s.list,
  getItem: s => id => s.details.find(i => i.id === id),
};

const actions = {
  /**
   * Fetches the products/services list.
   */
  async fetchItems({ commit }, { query } = {}) {
    const response = await ApiService.post('items', { params: query });
    const { data } = response;
    const { count } = data.pagination;

    commit('setItems', data);

    if (count) {
      commit('setSidebarItemCount', {
        name: 'items', count,
      });
    }
    return data;
  },

  /**
   * Fetch the given product/service details.
   */
  async fetchItem({ commit }, { id }) {
    const response = await ApiService.get(`${id}`);
    const { data } = response;

    commit('setItem', data);
    return data;
  },

  /**
   * Delete the given product/service.
   */
  async deleteItem({ commit }, { id }) {
    return ApiService.delete(`items/${id}`);
  },

  async newItem({}, { form }) {
    return ApiService.post('items', form);
  },

  async updateItem({}, { form, id }) {
    return ApiService.post(`items/${id}`, form);
  },
};

const mutations = {

  setItems(s, items) {
    s.list = items;
  },

  setItem(s, item) {
    s.details = s.details.filter(i => i.id !== item.id);
    s.details.push(item);
  },
};

export default { state, actions, mutations, getters };
