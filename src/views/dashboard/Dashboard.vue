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
    this.getBoardData();
  },
  watch: {
    '$route' (to, from) {
      const id = to.params.id;
      this.getBoardData(id);
    }
  },
  computed: {
  	currentComponent: function() {
      if(this.type === 'timeline') {
        return Timeline;
      }
  		return Grid;
  	}
  },
  data () {
    return {
   		type: ''
    }
  },
  methods: {
    getBoardData(id) {
      id = id ? id : this.$route.params.id;
      console.log('id', id)
      req.get(api.getBoardData + '?id=' + id)
        .then((response) => {
          console.log("getBoardData",response);
          if(response.statusText === 'OK') {
            this.type = response.data.layout.type || '';
          }
        });
    }
  }
}
</script>

<style scoped>

</style>
