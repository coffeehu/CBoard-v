import Vue from 'vue';
import Vuex from 'vuex';
import dashboard from './modules/dashboard';
import menu from './modules/menu';
import config from './modules/config';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		dashboard,
		menu,
		config
	}
});