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
      })
      .catch(error => {
        console.log(error)
      })
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

            let seriesData = null;
            if(data.config) {
              seriesData = parseData(response.data, data.config);
            }

            resolve(seriesData);
          }
        })
        .catch(error => {
          reject();
        })
    });
  }
}

// 处理数据
function parseData(data, config) {
  //获得keys、groups 对应的 index ，以及 valueSeries 数组
  let keysIndexArr = [];
  let groupsIndexArr = [];
  let valueSeries = [];
  for(let i=0,l=data.columnList.length; i<l; i++) {
    let col = data.columnList[i];
    for(let j=0; j<config.keys.length; j++) {
      if(config.keys[j].col === col.name) {
        keysIndexArr.push(col.index);
      }
    }

    for(let k=0; k<config.groups.length; k++) {
      if(config.groups[k].col === col.name) {
        groupsIndexArr.push(col.index);
      }
    }

    if(col.aggType) {
      valueSeries.push(col);
    }
  }

  //构建 newdata
  var newData = {};
  var joinedKeys = {};
  var keysData = [];
  var joinedGroups = {};
  var groupsData = [];
  for(let i=0,l=data.data.length; i<l; i++) {
    let item = data.data[i];

    // 获得 keys 的内容
    let keyArr = [];
    for(let j=0; j<keysIndexArr.length; j++) {
      keyArr.push( item[ keysIndexArr[j] ] );
    }

    let KeyArrStr = keyArr.join('-');
    if(!joinedKeys[KeyArrStr]) {
      joinedKeys[KeyArrStr] = true;
      keysData.push(keyArr);
    }

    // 获得 groups 的内容
    let groupArr = [];
    for(let j=0; j<groupsIndexArr.length; j++) {
      groupArr.push( item[ groupsIndexArr[j] ] );
    }

    let groupArrStr = groupArr.join('-');
    if(!joinedGroups[groupArrStr]) {
      joinedGroups[groupArrStr] = true;
      groupsData.push(groupArr);
    }

    //构建 newData
    for(let j=0; j<valueSeries.length; j++) {
      let series = valueSeries[j];
      if(typeof newData[groupArrStr] === 'undefined') {
        newData[groupArrStr] = {};
      }

      if(typeof newData[groupArrStr][series.name]  === 'undefined') {
        newData[groupArrStr][series.name] = {};
      }

      if(typeof newData[groupArrStr][series.name][series.aggType]  === 'undefined') {
        newData[groupArrStr][series.name][series.aggType] = {};
      }

      newData[groupArrStr][series.name][series.aggType][KeyArrStr] = item[series.index];
    }

  }

  //排序
  keysData.sort(mSort);

  function mSort(a, b) {
    var r = 0;
    for(let i=0; i<a.length; i++) {
      if(a[i] === b[i]) {
        r = 0;
        continue;
      }
      r = (toNumber(a[i]) > toNumber(b[i])) ? 1 : -1;
      break;
    }
    return r;
  }

  function toNumber(value) {
    let result = Number(value);
    if(isNaN(result)) return value;
    return result;
  }

  return {
    keys: keysData,
    groups: groupsData,
    values: valueSeries,
    data: newData
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