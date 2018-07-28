<template>
  <div class="content">
    
    <dashboard-header :dashboardTitle="dashboardTitle"></dashboard-header>

    <div v-for="(row,index) in layoutData.rows">
      <div v-if="row.type === 'param'" class="row">
        <dashboard-param :params="row.params"></dashboard-param>
      </div> 
      <div v-else>
        <dashboard-widget :widgets="row.widgets" :height="row.height" class="row"></dashboard-widget>
      </div>
    </div>

  </div>
</template>

<script>
import DashboardHeader from '@/views/dashboard/DashboardHeader';
import DashboardWidget from '@/components/dashboard/DashboardWidget';
import DashboardParam from '@/components/dashboard/DashboardParam';

export default {
  name: 'Grid',
  components: {
    DashboardWidget,
    DashboardHeader,
    DashboardParam
  },
  created() {
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
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
