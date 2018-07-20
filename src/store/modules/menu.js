/*
  首页菜单栏数据
*/
import req from '@/utils/http/request';
import api from '@/utils/http/api';

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

const state = {
  categoryList: [],
  boardList: [],
  menuList: []
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
    req.get(api.getBoardList)
    .then((response) => {
      if(response.statusText === 'OK') {
        context.commit('setBoardList', response.data);
      }
    })
    .catch((error) => {
      console.log(error)
    });
  },

  // 【配置】和【管理】菜单栏的菜单数据
  getMenuList(context) {
    req.get(api.getMenuList)
    .then((response) => {
      if(response.statusText === 'OK') {
        const menuList = formatMenuList(response.data);
        context.commit('setMenuList', menuList);
      }
    })
    .catch((error) => {
      console.log(error)
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
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}