/*
  配置页面数据
*/
import req from '@/utils/http/request';
import api from '@/utils/http/api';


const state = {
  widgetList: [],
  datasetList: []
}


const getters = {}


const actions = {

  //这两个获得的是 dashboard 菜单栏的菜单数据
  getWidgetList(context) {
    req.get(api.getWidgetList)
    .then((response) => {
      if(response.statusText === 'OK') {
        context.commit('setWidgetList', response.data);
      }
    })
    .catch((error) => {
      console.log(error)
    });
  },
  getDatasetList(context) {
    req.get(api.getDatasetList)
    .then((response) => {
      if(response.statusText === 'OK') {
        context.commit('setDatasetList', response.data);
      }
    })
    .catch((error) => {
      console.log(error)
    });
  },
  getColumns(context, params) {
    return new Promise((resolve, reject) => {
      req.post(api.getColumns, params)
        .then((response) => {
          resolve(response.data.columns);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        })
    });
  }

}


const mutations = {
  setWidgetList(state, widgetList) {
    state.widgetList = widgetList;
  },
  setDatasetList(state, datasetList) {
    state.datasetList = datasetList;
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}