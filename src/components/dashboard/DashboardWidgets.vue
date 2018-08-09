<template>
  <div>

    <div v-for="widget in widgets" :class="'col-md-'+widget.width">
      <div v-if="widget.type === 'column'">
        <div v-for="(row,index) in widget.rows">
          <div v-if="row.type === 'widget'">
            <dashboard-widgets :widgets="row.widgets" :height="row.height" class="row"></dashboard-widgets>
          </div>
        </div>
      </div>
      <component v-else
                 :is="currentComponent(widget)" 
                 :widget="widget" 
                 :filters="filters" 
                 :height="height"></component>
    </div>


  </div>
</template>

<script>
export default {
  name: 'DashboardWidgets',
  props: {
    widgets: {
      type: Array,
      required: true
    },
    height: {
      type: String
    }
  },
  components: {
    KpiContent: () => import('./widgets/KpiContent'),
    ChartContent: () => import('./widgets/ChartContent'),
    TableContent: () => import('./widgets/TableContent'),
    MapContent: () => import('./widgets/MapContent')
  },
  created() {
    
  },
  data() {
    return {
    }
  },
  methods: {
    currentComponent(widget) {
      switch(widget.widget.data.config.chart_type) {
        case 'kpi':
          return 'KpiContent';
        case 'table':
          return 'TableContent';
        case 'map':
          return 'MapContent';
        default:
          return 'ChartContent';
      }
    }
  },
  computed: {
    filters() {
      this.loadComplete = false;
      return this.$store.state.params.filters;
    }
  }
}
</script>

<style>

</style>
