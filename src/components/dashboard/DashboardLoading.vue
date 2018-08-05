<template>
    <div class="box box-solid">
      <div class="box-header">
        <h3 class="box-header">{{ name }}</h3>
      </div>
      <div class="box-body" style="height:100px">
          <div class="overlay">
              <i class="fa fa-refresh fa-spin"></i>
          </div>
      </div>
    </div>
</template>


<script>
export default {
  name: 'DashboardLoading',
  props: {
    name: {
      type: String,
      default: ''
    }
  }
}
</script>


<style>

</style>
