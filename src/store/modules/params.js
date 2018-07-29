import req from '@/utils/http/request';
import api from '@/utils/http/api';

const state = {
  filters: []
}


const getters = {}


const actions = {
  getDimensionValues(context, params) {
    return new Promise((resolve, reject) => {
      req.post(api.getDimensionValues, params)
        .then((response) => {
          if(response.statusText === 'OK') {
            resolve(response.data);
          }
        })
        .catch((error) => {
          console.log(error)
        });
    });
  }
}


const mutations = {
  setFilter(state, payload) {
    let isExist = false;
    for(let i=state.filters.length-1; i>=0; i--) {
      if(state.filters[i].col === payload.col) { // 用 col 字段来判断是否是来自同一个 param
        isExist = true;
        if(payload.values[0] === '') { // 为 '' 表明取消了筛选
          state.filters.splice(i, 1);
        }else {
          //state.filters[i].values = payload.values;
          state.filters.splice(i, 1, payload);
        }
        break;
      }
    }
    if(!isExist && payload.values[0] !== '') {
      state.filters.push(payload);
    }
  },
  resetFilters(state, payload) {
    state.filters = [];
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}