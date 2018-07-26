// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import i18n from './i18n/';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/bootstrap.css';
import 'admin-lte/dist/css/AdminLTE.min.css';
import 'admin-lte/dist/css/skins/skin-blue.min.css';
import 'font-awesome/css/font-awesome.min.css';
import store from './store';
import numbro from 'numbro';
import './utils/initEcharts.js';
import req from '@/utils/http/request';
import api from '@/utils/http/api';

Vue.config.productionTip = false;
Vue.prototype.$numbro = numbro;

Vue.use(ElementUI);
Vue.prototype.$req = req;
Vue.prototype.$api = api;

router.beforeEach((to, from, next) => {
  req.abort();
  next();
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
