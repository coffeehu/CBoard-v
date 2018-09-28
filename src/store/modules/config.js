/*
  配置页面数据
*/
import req from '@/utils/http/request';
import api from '@/utils/http/api';


const state = {
  widgetList: [],
  datasetList: [],
  datasourceList: []
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
  },
  // 获得数据源列表，数据集管理页面用到
  getDatasourceList(context) {
    req.get(api.getDatasourceList)
    .then(response => {
      if(response.statusText === 'OK') {
        context.commit('setDatasourceList', response.data);
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

}


const mutations = {
  setWidgetList(state, widgetList) {
    state.widgetList = widgetList;
  },
  setDatasetList(state, datasetList) {
    state.datasetList = datasetList;
  },
  setDatasourceList(state, datasourceList) {
    state.datasourceList = datasourceList;
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}