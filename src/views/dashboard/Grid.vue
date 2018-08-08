<template>
  <div class="content">
    
    <dashboard-header :dashboardTitle="dashboardTitle"></dashboard-header>

    <div v-for="(row,index) in layoutData.rows">
      <div v-if="row.type === 'param'" class="row">
        <dashboard-param :params="row.params"></dashboard-param>
      </div> 
      <div v-else>
        <dashboard-widgets :widgets="row.widgets" :height="row.height" class="row"></dashboard-widgets>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Grid',
  components: {
    DashboardWidgets: () => import('@/components/dashboard/DashboardWidgets'),
    DashboardHeader: () => import('@/components/dashboard/DashboardHeader'),
    DashboardParam: () => import('@/components/dashboard/DashboardParam')
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
