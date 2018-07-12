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

.main-content {
  min-height: 837px;
  background-color: #ecf0f5;
  margin-left: 230px;
  z-index: 800;
  -webkit-transition: -webkit-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
  -moz-transition: -moz-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
  -o-transition: -o-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
}

.main-footer {
  background: #fff;
  padding: 15px;
  color: #444;
  border-top: 1px solid #d2d6de;
}
</style>
