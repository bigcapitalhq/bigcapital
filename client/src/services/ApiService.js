import axios from 'services/axios';

export default {

  get(resource, params) {
    return axios.get(`/api/${resource}`, params);
  },

  post(resource, params) {
    return axios.post(`/api/${resource}`, params);
  },

  update(resource, slug, params) {
    return axios.put(`/api/${resource}/${slug}`, params);
  },

  put(resource, params) {
    return axios.put(`/api/${resource}`, params);
  },

  delete(resource, params) {
    return axios.delete(`/api/${resource}`, params);
  }
};
