import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/layout/Layout';
import Dashboard from '@/views/dashboard/Dashboard';
import BoardConfig from '@/views/config/BoardConfig';
import Test from '@/views/config/Test';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      component: Layout,
      redirect: 'dashboard'
    },

    {
      path: '/dashboard',
      component: Layout,
      children: [{
        path: ':name/:id',
        component: Dashboard
      }]
    },

    {
      path: '/config',
      component: Layout,

      children: [
        {
          path: 'board',
          component: BoardConfig,
          children: [
            {
              path: ':id',
              component: Test
            }
          ]
        }
      ]
      
    }


  ]
})
