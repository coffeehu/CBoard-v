import req from '@/utils/http/request';
import api from '@/utils/http/api';
import { injectFilter, formatConfig } from '@/utils/dashboardConfig.js';


const state = {
  type: '',
  boardData: [],
  widgetInfoData: {},
  complete: false //请求状态，true 表示请求完成
}


const getters = {}


const actions = {
  getBoardData(context, id) {
    req.get(api.getBoardData + '?id=' + id)
      .then((response) => {
        if(response.statusText === 'OK') {
          const payload = {
            type: response.data.layout.type,
            boardData: response.data
          }
          context.commit('setBoardData', payload);
          //this.type = response.data.layout.type || '';
          //this.$store.commit('dashboard/getBoardData', { data: response.data });
          //this.$store.dispatch('dashboard/test', 123)
        }
      });
  },
  // data = { widgetData:Objec, filters: Object }
  getWidgetData(context, data) {
    return new Promise((resolve, reject) => {
      let widgetData = data.widgetData;
      let filters = data.filters;

      injectFilter(widgetData, filters);

      const config = formatConfig(widgetData.config);

      const params = {
        datasourceId: widgetData.datasource,
        query: JSON.stringify(widgetData.query),
        datasetId: widgetData.datasetId,
        cfg: JSON.stringify(config),
        reload: data.reload
      };
      req.post(api.getAggregateData, params)
        .then(response => {
          if(response.statusText === 'OK') {
            context.commit('setWidgetInfoData', response.data);
            resolve();
          }
        })
        .catch(error => {
          reject();
        })
    });
  }
}


const mutations = {
  setBoardData(state, payload) {
    state.type = payload.type;
    state.boardData = payload.boardData;
    state.complete = true;
  },
  setWidgetInfoData(state, payload) {
    state.widgetInfoData = payload;
  },
  reset(state) {
    state.complete = false;
    state.widgetInfoData = {};
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}