// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'; // In Dev
import App from './App';
import router from './router';
import i18n from './i18n/';
import ElementUI from 'element-ui'; // In Dev
import 'element-ui/lib/theme-chalk/index.css'; // In Dev
import './styles/bootstrap.css';
import 'admin-lte/dist/css/AdminLTE.min.css';
import 'admin-lte/dist/css/skins/skin-blue.min.css';
import 'font-awesome/css/font-awesome.min.css';
import store from './store';
import numbro from 'numbro';
import './utils/initEcharts.js';
import req from '@/utils/http/request';
import api from '@/utils/http/api';
/*import { Menu, Submenu, MenuItem, Dialog, 
		 Slider, Select, Option, Table, 
		 TableColumn, DatePicker, Input, Tree,
		 OptionGroup, Transfer, Switch } from 'element-ui';*/

Vue.config.productionTip = false;
Vue.prototype.$numbro = numbro;

Vue.use(ElementUI); // In Dev
//Vue.use(ELEMENT); // In Production
/*Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Dialog);
Vue.use(Slider);
Vue.use(Select);
Vue.use(Option);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Input);
Vue.use(Tree);
Vue.use(OptionGroup);
Vue.use(Transfer);
Vue.use(Switch)*/

Vue.prototype.$req = req;
Vue.prototype.$api = api;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
