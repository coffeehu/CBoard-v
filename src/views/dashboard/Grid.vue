<template>
  <div class="content">
    
    <dashboard-header :dashboardTitle="dashboardTitle"></dashboard-header>

    <div v-for="(row,index) in layoutData.rows">
      <div v-if="row.type === 'param'" class="row">param</div> 
      <div v-else>
        <dashboard-widget :widgetData="row.widgets" :height="row.height" class="row"></dashboard-widget>
      </div>
    </div>

  </div>
</template>

<script>
import DashboardHeader from '@/views/dashboard/DashboardHeader';
import DashboardWidget from '@/components/DashboardWidget';

export default {
  name: 'Grid',
  components: {
    DashboardWidget,
    DashboardHeader
  },
  mounted() {
  	console.log('==========grid============', this.$store.state.dashboard)
    this.dashboardTitle = this.$store.state.dashboard.boardData.name;
  },
  computed: {
    layoutData() {
      let data = this.$store.state.dashboard.boardData.layout || {};
      return data;
    }
  },
  data () {
    return {
      dashboardTitle: ''
    }
  }
}
</script>

<style scoped>

</style>
