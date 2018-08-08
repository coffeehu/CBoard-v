<template>
  <div>

    <div v-for="widget in widgets" :class="'col-md-'+widget.width">
      <component :is="currentComponent(widget)" 
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
