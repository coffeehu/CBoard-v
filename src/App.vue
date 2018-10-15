<template>
  <div id="app" class="wrapper skin-blue">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('menu/getCategoryList');
    this.$store.dispatch('menu/getBoardList');
    this.$store.dispatch('menu/getMenuList')
      .then(() => {
        //console.log('-----routes----', this.$store.state.menu.routes)
        this.$router.addRoutes(this.routes);
        this.$router.beforeEach((to, from, next) => {
          this.$req.abort();
          next();
        })
      })
      .catch(() => {})
  },
  mounted() {
    
  },
  computed: {
    routes() {
      return this.$store.state.menu.routes;
    }
  }
}
</script>

<style>
a:hover {
  text-decoration: none;
}
body {
  font-size: 13px;
}
#app {
  /*position: relative;
  height: 100%;*/
  min-height: 100%;
}
/*公共样式*/
.dashed-box {
  border: 2px dashed #d2d6de;
  min-height: 200px;
  padding: 0;
}


.el-select .el-input.is-focus .el-input__inner,
.el-input.is-active .el-input__inner, .el-input__inner:focus {
  /*border-color: #3c8dbc;*/
}
/*配置界面--preview 弹框*/
.preview-config-modal {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
}
.preview-config-modal .el-button--primary{
    background-color: #3c8dbc;
    border-color: #367fa9;
}
.preview-config-modal .el-button--primary:active,
.preview-config-modal .el-button--primary:hover,
.preview-config-modal .el-button--primary:focus {
    background-color: #3c8dbc;
    border-color: ##367fa9; 
}
/*配置界面--Add Param 弹框*/
.param-config-dialog .el-transfer-panel {
  width: 40%;
}
.param-config-dialog .el-transfer__buttons {
  width: 20%;
}
@media (max-width: 767px) {
  .param-config-dialog .el-transfer-panel,
  .param-config-dialog .el-transfer__buttons {
    width: 100%;
  }
  .param-config-dialog .el-transfer__buttons {
    margin-top: 10px;
  }
}
.param-config-dialog .el-transfer__buttons .el-transfer__button {
  margin: 0 auto!important;
  margin-bottom: 10px!important;
}
.param-config-dialog .el-transfer-panel__header {
  background: #3c8dbc;
}
.param-config-dialog .el-transfer-panel__header .el-checkbox__label,
.param-config-dialog .el-transfer-panel__header .el-checkbox__label > span {
  color: #fff!important;
}
.param-config-dialog .el-transfer-panel__body {
  height: 300px;
}
.param-config-dialog .el-transfer-panel__list {
  height: 248px;
}
.param-config-dialog .el-transfer__button,
.param-config-dialog .el-checkbox__input.is-indeterminate .el-checkbox__inner,
.param-config-dialog .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #3c8dbc;
  border-color: #367fa9;
}
.param-config-dialog .el-transfer__button.is-disabled {
  background-color: #f5f7fa;
  border-color: #dcdfe6;
}
.param-config-dialog .el-checkbox__input.is-checked+.el-checkbox__label,
.param-config-dialog .el-transfer-panel__item:hover {
  color: #3c8dbc;
}
.form-group.is-error .board-config--input input {
    border-color: #f56c6c!important;
}
/*config-Add Layout--Name 输入框的提示*/
.error-tag {
  padding-top: 4px;
  line-height: 1;
  font-size: 12px;
  color: #f56c6c;
}
/*dashboard widget 放大弹出的 Dialog 样式*/
.el-dialog__body .box-body {
  min-height: 500px!important;
}
.param-detail-config label {
  float: left;
}
/*dashboard 页面--param--DatePicker的样式*/
.dashboard-param .el-date-editor {
  width: 100%;
}
/* gridster 布局中的 box 样式*/
.widget-item .box {
  margin-bottom: 0!important;
}
.content {
  box-sizing: border-box;
}
/*Gridster Layout config: Row BackgroundColor Picker*/ 
.row-color-picker .el-color-picker__trigger {
  width: 30px!important;
  height: 30px;
}
/*图表设计页面 -- Filter 框 -- Date Picker 样式调整*/
.filter-param .el-date-editor {
  height: 28px;
  line-height: 28px;
}
/*数据源管理页面*/
.datasource .el-tree-node__content {
  border-bottom: 1px solid #f4f4f4;
  padding: 20px 0;
}
.datasource-form label {
  margin-bottom: 0;
}
.datasource-form .el-form-item {
  margin-bottom: 10px; 
}
</style>
