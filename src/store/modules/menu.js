/*
  首页菜单栏数据
*/
import req from '@/utils/http/request';
import api from '@/utils/http/api';
import Layout from '@/views/layout/Layout';

function formatMenuList(data) {
  let menuData = [];
  for(let i=0,l=data.length; i<l; i++) {
    let itemData = data[i];
    if(itemData.parentId === -1) {
      itemData.children = [];
      menuData.push(itemData);
    }else {
      for(let j=0,len=data.length; j<len; j++) {
        if(itemData.parentId === data[j].menuId) {
          data[j].children.push(itemData);
          break;
        }
      }
    }
  }
  return menuData;
}

function formatRoutes(menuList) {
  let routes = [];
  for(let i=0,l=menuList.length; i<l; i++) {
    let menu = menuList[i];
    let route = {
      path: '/' + menu.menuCode,
      component: Layout,
      children: []
    };
    routes.push(route);
    for(let j=0,len=menu.children.length; j<len; j++) {
      let menuItem = menu.children[j];
      let path = menuItem.menuCode.split('.')[1];
      let _path = path.substring(0,1).toUpperCase() + path.substring(1);
      let _code = menu.menuCode.substring(0,1).toUpperCase() + menu.menuCode.substring(1);
      let fileName = _path + _code + '.vue';
      const mRoute = () => import(`@/views/${menu.menuCode}/${fileName}`);
      let childRoute = {
        path: path,
        component: mRoute
      };
      route.children.push(childRoute);
    }
  }
  return routes;
}

const state = {
  categoryList: [],
  boardList: [],
  menuList: [],
  routes: []
}


const getters = {}


const actions = {

  //这两个获得的是 dashboard 菜单栏的菜单数据
  getCategoryList(context) {

      req.get(api.getCategoryList)
        .then((response) => {
          if(response.statusText === 'OK') {
            context.commit('setCategoryList', response.data);
          }
        })
        .catch((error) => {
          console.log(error)
        });

  },
  getBoardList(context) {
    return new Promise((resolve, reject) => {
      req.get(api.getBoardList)
        .then((response) => {
          if(response.statusText === 'OK') {
            context.commit('setBoardList', response.data);
            resolve();
          }
        })
        .catch((error) => {
          console.log(error)
          reject(error);
        });
    });
  },

  // 【配置】和【管理】菜单栏的菜单数据
  getMenuList(context) {
    return new Promise((resolve, reject) => {
      req.get(api.getMenuList)
        .then((response) => {
          if(response.statusText === 'OK') {
            const menuList = formatMenuList(response.data);
            const routes = formatRoutes(menuList);
            context.commit('setMenuList', menuList);
            context.commit('setRoutes', routes);
            resolve();
          }
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  },

}


const mutations = {
  setCategoryList(state, categoryList) {
    state.categoryList = categoryList;
  },
  setBoardList(state, boardList) {
    state.boardList = boardList;
  },
  setMenuList(state, menuList) {
    state.menuList = menuList;
  },
  setRoutes(state, routes) {
    state.routes = routes;
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}