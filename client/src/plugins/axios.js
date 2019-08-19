import axios from 'axios';
import store from '~/store';
import swal from 'sweetalert2'
import Vue from 'vue';
import VueAxios from 'vue-axios';
import router from '~/routes';

// Set config defaults when creating the instance
const http = axios.create();

// request interceptor.
http.interceptors.request.use((request) => {
  const token = store.getters.authToken;
  const locale = Vue.i18n.locale();

  if (token) {
    request.headers.common['x-access-token'] = token;
  }
  if (locale) {
    request.headers.common['Accept-Language'] = locale;
  }
  return request;
});

// response interceptor
http.interceptors.response.use(response => response, (error) => {
  const { status } = error.response;

  if (status >= 500) {
    swal({
      type: 'error',
      title: Vue.i18n.translate('error_alert_title'),
      text: Vue.i18n.translate('error_alert_text'),
      reverseButtons: true,
      confirmButtonText: Vue.i18n.translate('ok'),
      cancelButtonText: Vue.i18n.translate('cancel')
    });
  }

  if (status === 401) {
    swal({
      type: 'warning',
      title: Vue.i18n.translate('token_expired_alert_title'),
      text: Vue.i18n.translate('token_expired_alert_text'),
      reverseButtons: true,
      confirmButtonText: Vue.i18n.translate('ok'),
      cancelButtonText: Vue.i18n.translate('cancel')
    }).then(() => {
      store.commit('removeToken');
      router.push({ name: 'login' });
    });
  }

  return Promise.reject(error)
});

Vue.use(VueAxios, http);

export default http;
