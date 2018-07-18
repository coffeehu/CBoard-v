<template>
  <div class="content">
    <header>temp header</header>

    <div v-for="(row,index) in layoutData.rows">
      <div v-if="row.type === 'param'" class="row">param</div> 
      <div v-else>
        <dashboard-widget :widgetData="row.widgets" class="row"></dashboard-widget>
      </div>
    </div>

  </div>
</template>

<script>
import DashboardWidget from '@/components/DashboardWidget';

export default {
  name: 'Grid',
  components: {
    DashboardWidget
  },
  mounted() {
  	console.log('==========grid============', this.$store.state.dashboard)
  },
  computed: {
    layoutData() {
      let data = this.$store.state.dashboard.boardData.layout || {};
      return data;
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
