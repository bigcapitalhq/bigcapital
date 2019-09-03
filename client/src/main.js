import Vue from 'vue';
import {Form, FormItem, Input} from 'element-ui';
import App from '@/App';
import router from '@/router';
import store from '@/store';

// Plugins
import '@/plugins/i18n';

Vue.config.productionTip = false;

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

const app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});

export default app;
