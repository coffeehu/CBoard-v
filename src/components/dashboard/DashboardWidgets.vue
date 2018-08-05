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
import KpiContent from '@/components/dashboard/widgets/KpiContent';
import ChartContent from '@/components/dashboard/widgets/ChartContent';
import TableContent from '@/components/dashboard/widgets/TableContent';
import MapContent from '@/components/dashboard/widgets/MapContent';

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
  },
  components: {
    KpiContent,
    ChartContent,
    TableContent,
    MapContent
  }
}
</script>

<style>

</style>
