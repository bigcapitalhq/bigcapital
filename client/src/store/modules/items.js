import ApiService from '@/plugins/api-service';

const state = {
  list: {},
  details: [],
  categories: {},
  categoriesDetails: [],
};

const getters = {
  getItems: s => s.list,
  getItem: s => id => s.details.find(i => i.id === id),
  getItemsCategories: s => s.categories,
  getItemCategory: s => id => s.categoriesDetails.find(i => i.id === id),
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

  /**
   * Fetches items categories paged list.
   */
  async fetchItemsCategories({}, { query }) {
    return ApiService.get('/items_categories', { params: query });
  },

  /**
   * Fetch details of the given item category.
   */
  async fetchItemCategory({}, { id }) {
    return ApiService.get(`/item/${id}`);
  },

  /**
   * Delete the given item category.
   */
  async deleteItemCategory({}, { id }) {
    return ApiService.delete(`/items_categories/${id}`);
  },

  /**
   * Post a new item category.
   */
  async newItemCategory({}, { form }) {
    return ApiService.post('/items_categories', form);
  },

  /**
   * Update details of the given item category.
   */
  async updateItemCategory({}, { id, form }) {
    return ApiService.post(`/items_categories/${id}`, form);
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

  setItemCategories(s, categories) {
    s.categories = categories;
  },

  setItemCategory(s, category) {
    s.categoriesDetails = s.categoriesDetails.filter(i => i.id !== category.id);
    s.categoriesDetails.push(category);
  },
};

export default { state, actions, mutations, getters };
