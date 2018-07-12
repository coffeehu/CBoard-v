import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/layout/Layout';
import Dashboard from '@/views/dashboard/Dashboard';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      component: Layout,
      redirect: 'dashboard',
      children: [{
      	path: 'dashboard',
      	name: 'Dashboard',
      	component: Dashboard,
      }]
    }
  ]
})
