<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
.clearfix:before, .clearfix:after {
  content: " ";
  display: table;
}
.clearfix:after {
  clear: both;
}
p {
  margin: 0 0 10px;
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
