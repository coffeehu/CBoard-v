<template>
  <div id="app" class="wrapper skin-blue">
    <router-view/>
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
</style>
