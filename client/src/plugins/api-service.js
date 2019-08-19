import Vue from 'vue';

export default {

  get(resource, params) {
    return Vue.axios.get(`api/${resource}`, params).catch((error) => {
      throw new Error(`[Moosher] ApiService ${error}`);
    });
  },

  post(resource, params) {
    return Vue.axios.post(`api/${resource}`, params);
  },

  update(resource, slug, params) {
    return Vue.axios.put(`api/${resource}/${slug}`, params);
  },

  put(resource, params) {
    return Vue.axios.put(`api/${resource}`, params);
  },

  delete(resource) {
    return Vue.axios.delete(`api/${resource}`).catch((error) => {
      throw new Error(`[Moosher] ApiService ${error}`);
    });
  }
};
