<template>
  <div>
    <div v-for="widget in widgetData" :class="'col-md-'+widget.width">
      <component v-show="loadComplete" @load-complete="handlerComplete" :is="currentComponent(widget)" :widget="widget" :height="height"></component>

      <!-- loading 动画框 -->
      <div v-if="!loadComplete" class="box box-solid">
        <div class="box-header">
          <h3 class="box-header">{{ widget.name }}</h3>
        </div>
        <div class="box-body" style="height:100px">
            <div class="overlay">
                <i class="fa fa-refresh fa-spin"></i>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import KpiContent from '@/components/dashboard/KpiContent';
import ChartContent from '@/components/dashboard/ChartContent';
import TableContent from '@/components/dashboard/TableContent';
import MapContent from '@/components/dashboard/MapContent';

export default {
  name: 'DashboardWidget',
  props: {
    widgetData: {
      type: Array,
      required: true
    },
    height: {
      type: String
    }
  },
  mounted() {
    //console.log('==============================DashboardWidget data', this.widgetData);
  },
  data() {
    return {
      loadComplete: false
    }
  },
  methods: {
    currentComponent(widget) {
      switch(widget.widget.data.config.chart_type) {
        case 'kpi':
          return KpiContent;
        case 'table':
          return TableContent;
        case 'map':
          return MapContent;
        default: 
          return ChartContent;
      }
    },
    handlerComplete() {
      this.loadComplete = true;
    }
  },
  components: {
    KpiContent
  }
}
</script>

<style>

</style>
