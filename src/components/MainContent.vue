<template>
  <div class="content-wrapper">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'MainContent'
}
</script>

<style>
.content-wrapper {
  position: relative;
  background-color: #ecf0f5;
  min-height: 837px!important;
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

.layout-wrapper.is-collapse .content-wrapper {
  margin-left: 70px!important;
}
</style>
