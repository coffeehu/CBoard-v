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
      const type = this.$store.state.dashboard.type;
      if(type === 'timeline') {
        return Timeline;
      }
  		return Grid;
  	}
  },
  data () {
    return {

    }
  },
  methods: {
    
  }
}
</script>

<style scoped>

</style>
