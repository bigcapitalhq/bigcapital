import Vue from 'vue';
import ElementUI from 'element-ui';
import App from '@/App';
import router from '@/router';
import store from '@/store';

// Plugins
import '@/plugins/i18n';

Vue.config.productionTip = false;

Vue.use(ElementUI);

const app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});

export default app;
