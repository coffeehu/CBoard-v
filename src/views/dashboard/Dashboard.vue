<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
import Grid from './Grid';
import Timeline from './Timeline';
import req from '@/utils/http/request';
import api from '@/utils/http/api';

export default {
  name: 'Dashboard',
  created() {
      this.$store.dispatch('dashboard/getBoardData', this.$route.params.id);
  },
  watch: {
    '$route' (to, from) {
      this.$store.dispatch('dashboard/getBoardData', this.$route.params.id);
    }
  },
  computed: {
  	currentComponent: function() {
      if(!this.$store.state.dashboard.complete) return null;
      const type = this.$store.state.dashboard.type;
      if(type === 'timeline') {
        return Timeline;
      }
  		return Grid;
  	},
    type() {
      return this.$store.state.dashboard.type;
    }
  },
  methods: {
    test() {
      return Timeline;
    },
  },
  data () {
    return {
      loading: true
    }
  },
  destroyed() {
    this.$store.commit('dashboard/reset');  // 将 complete 置为 false，不这样做的话 vuex 会缓存数据，也就是说会一直保持 true
  }
}
</script>

<style scoped>

</style>
