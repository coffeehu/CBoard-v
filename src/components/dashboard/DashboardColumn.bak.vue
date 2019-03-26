<template>
  <div class="content">
    <div v-for="(row,index) in rows">
      <div v-if="row.type === 'param'" class="row">
        <dashboard-param :params="row.params"></dashboard-param>
      </div> 
      <div v-if="row.type === 'widget'">
        <dashboard-widgets :widgets="row.widgets" :height="row.height" class="row"></dashboard-widgets>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardColumn',
  props: {
    rows: {
      type: Array,
      default() {
        return []
      }
    },
    widgets: {
      type: Array,
    },
    height: {
      type: String
    },
    width: {
      type: String
    }
  },
  components: {
    DashboardWidgets: () => import('@/components/dashboard/DashboardWidgets'),
    DashboardParam: () => import('@/components/dashboard/DashboardParam'),
  },
  created() {
    console.log('=====dashboard column=====', this.rows)
  },
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
