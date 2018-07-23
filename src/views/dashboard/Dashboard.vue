<template>
  <div>
    <component :is="currentComponent" @test="handlerTest" v-show="!loading" ></component>
    <div v-if="loading">Loading...{{loading}}</div>
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
    this.loading = true;
    //alert('mounted set loading')
    this.$store.dispatch('dashboard/getBoardData', this.$route.params.id);
  },
  watch: {
    '$route' (to, from) {
      /*const id = to.params.id;
      this.getBoardData(id);*/
      this.$store.dispatch('dashboard/getBoardData', this.$route.params.id);
    }
  },
  computed: {
  	currentComponent: function() {
      this.loading = true;
      //alert('is component set loading')
      const type = this.$store.state.dashboard.type;
      if(type === 'timeline') {
        return Timeline;
      }
  		return Grid;
  	}
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
    handlerTest() {
      this.loading = false;
      //alert('complete loading')
    }
  }
}
</script>

<style scoped>

</style>
