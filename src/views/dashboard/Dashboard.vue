<template>
  <div>
    <component :is="currentComponent" ></component>
  </div>
</template>

<script>
import Grid from './Grid';
import Timeline from './Timeline';
import req from '@/utils/http/request';
import api from '@/utils/http/api';

export default {
  name: 'Dashboard',
  mounted() {
  	req.get(api.getBoardData)
  		.then((response) => {
  			console.log("getBoardData",response);
  		});
  },
  computed: {
  	currentComponent: function() {
  		return Grid;
  	}
  },
  data () {
    return {
   		
    }
  }
}
</script>

<style scoped>

</style>
