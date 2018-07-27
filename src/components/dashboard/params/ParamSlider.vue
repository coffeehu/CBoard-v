<template>
    <div>
        <el-slider v-model="value1"></el-slider>
    </div>
</template>


<script>
export default {
  name: 'ParamSlider',
  props: {

  },
  data() {
  	return {
  		value1: 0
  	}
  }
}
</script>


<style>

</style>
