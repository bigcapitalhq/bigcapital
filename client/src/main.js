import Vue from 'vue';
import {Form, FormItem, Input, Tabs, TabPane, Button, Alert} from 'element-ui';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import '@/plugins/icons';

// Plugins
import '@/plugins/i18n';

Vue.config.productionTip = false;

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Button);
Vue.use(Alert);

const app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});

export default app;
