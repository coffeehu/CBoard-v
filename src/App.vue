<template>
  <div id="app" class="wrapper skin-blue">
    <router-view />
  </div>
</template>

<script>
import req from '@/utils/http/request';
import api from '@/utils/http/api';

export default {
  name: 'App',
  mounted() {
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

/*配置界面--preview 弹框*/
.previewConfigModal {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
}
.previewConfigModal .el-button--primary{
    background-color: #3c8dbc;
    border-color: #367fa9;
}
.previewConfigModal .el-button--primary:active,
.previewConfigModal .el-button--primary:hover,
.previewConfigModal .el-button--primary:focus {
    background-color: #3c8dbc;
    border-color: ##367fa9; 
}
</style>
