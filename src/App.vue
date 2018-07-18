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
.pull-left {
  float: left !important;
}

.main-footer {
  background: #fff;
  padding: 15px;
  color: #444;
  border-top: 1px solid #d2d6de;
}
</style>
