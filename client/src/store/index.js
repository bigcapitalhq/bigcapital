import Vue from 'vue';
import Vuex from 'vuex';
import vuexI18n from 'vuex-i18n';
import sidebar from '@/store/modules/sidebar';
import app from '@/store/modules/app';
import items from '@/store/modules/items';
import customers from '@/store/modules/customers';

const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    sidebar,
    items,
    customers,
  },
  strict: debug,
});

Vue.use(vuexI18n.plugin, store);

export default store;
