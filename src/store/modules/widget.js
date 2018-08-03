/*
  widget 数据, 放大弹出时使用
*/

const state = {
  open: false,
  componentOptions: {},
  widget: {},
  filters: [],
  name: ''
}


const getters = {}


const actions = {

}


const mutations = {
  openWidget(state, data) {
    state.open = true;
    state.componentOptions = data.componentOptions;
    state.widget = data.widget;
    state.filters = data.filters;
    state.name = data.name;
  },
  closeWidget(state) {
    state.open = false;
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}