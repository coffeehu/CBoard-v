import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/layout/Layout';

Vue.use(Router)

const Dashboard = () => import('@/views/dashboard/Dashboard');
const BoardConfig = () => import('@/views/config/board/BoardConfig');
const BoardConfigContent = () => import('@/views/config/board/BoardConfigContent');

export default new Router({
  routes: [
    {
      path: '',
      component: Layout,
      redirect: 'dashboard'
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: Layout,
      children: [{
        path: ':name/:id',
        component: Dashboard
      }]
    },
    

    /*{
      path: '/config',
      component: Layout,
      children: [
        {
          path: 'board/:id',
          component: BoardConfig,
        },
        {
          path: 'board',
          component: BoardConfig
        }
      ]
    },*/
    /*{
      path: '/config',
      name: 'config',
      component: Layout,
      children: [
        {
          path: 'board',
          name: 'BoardConfig',
          component: BoardConfig,
          children: [
            {
              path: ':id',
              component: BoardConfigContent
            }
          ]
        }
      ]
    },*/
    {
      path: '/config',
      name: 'config',
      component: Layout,
      children: [
        {
          path: 'board',
          name: 'BoardConfig',
          component: BoardConfig
        }
      ]
    },


  ]
})
