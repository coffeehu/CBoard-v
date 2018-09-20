<template>
  <div class="content">
    
    <dashboard-header :dashboardTitle="dashboardTitle"></dashboard-header>

    <!-- <div v-for="(row,index) in layoutData.rows">
      <div v-if="row.type === 'param'" class="row">
        <dashboard-param :params="row.params"></dashboard-param>
      </div> 
      <div v-if="row.type === 'widget'">
        <dashboard-widgets :widgets="row.widgets" :height="row.height" class="row"></dashboard-widgets>
      </div>
    </div> -->

    <div v-for="(row,index) in layoutData.rows">
      <div v-if="row.type === 'param'" class="row">
        <dashboard-param :params="row.params"></dashboard-param>
      </div> 
      <div v-if="row.type === 'widget'">
          <grid-layout
            :style="{'background-color': row.background}"
            :layout="row.widgets"
            :col-num="parseInt(row.columnsNumber) || 12"
            :row-height="60"
            :is-draggable="false"
            :is-resizable="false"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true">
            <grid-item 
               v-for="(widget, index) in row.widgets"
               :key="widget.i"
               :x="widget.x"
               :y="widget.y"
               :w="widget.w"
               :h="widget.h"
               :i="widget.i">
                <div class="widget-item">
                    <component
                     :is="currentComponent(widget)" 
                     :widget="widget" 
                     :filters="filters" 
                     :height="(widget.h*60)+'px'"
                     :mBackground="widget.background || row.columnsBackground"></component>
                </div>
            </grid-item>
          </grid-layout>
      </div>
    </div>


  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout';
const GridLayout = VueGridLayout.GridLayout;
const GridItem = VueGridLayout.GridItem;

export default {
  name: 'Gridster',
  components: {
    DashboardWidgets: () => import('@/components/dashboard/DashboardWidgets'),
    DashboardHeader: () => import('@/components/dashboard/DashboardHeader'),
    DashboardParam: () => import('@/components/dashboard/DashboardParam'),
    GridLayout,
    GridItem,
    KpiContent: () => import('@/components/dashboard/widgets/KpiContent'),
    ChartContent: () => import('@/components/dashboard/widgets/ChartContent'),
    TableContent: () => import('@/components/dashboard/widgets/TableContent'),
    MapContent: () => import('@/components/dashboard/widgets/MapContent'),
    RadarContent: () => import('@/components/dashboard/widgets/RadarContent'), //雷达图
    FunnelContent: () => import('@/components/dashboard/widgets/FunnelContent'), //漏斗图
    ScatterContent: () => import('@/components/dashboard/widgets/ScatterContent'),
    ChinaMapContent: () => import('@/components/dashboard/widgets/ChinaMapContent'),
  },
  created() {
      this.dashboardTitle = this.$store.state.dashboard.boardData.name;
  },
  computed: {
    layoutData() {
      let data = this.$store.state.dashboard.boardData.layout || {};
      return data;
    },
    filters() {
      this.loadComplete = false;
      return this.$store.state.params.filters;
    }
  },
  data () {
    return {
      dashboardTitle: '',
      height: ''
    }
  },
  methods: {
    currentComponent(widget) {
      switch(widget.widget.data.config.chart_type) {
        case 'line':
        case 'pie':
        case 'contrast':
          return 'ChartContent';
        case 'kpi':
          return 'KpiContent';
        case 'table':
          return 'TableContent';
        case 'map':
          return 'MapContent';
        case 'radar':
          return 'RadarContent';
        case 'funnel':
          return 'FunnelContent';
        case 'chinaMap':
          return 'ChinaMapContent';
        case 'scatter':
          return 'ScatterContent';
        default:
          return 'ChartContent';
      }
    }
  }
}
</script>

<style scoped>
.widget-item {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.box {
  margin-bottom: 0!important;
}
.box-header {
  background-color: red!important;
}
</style>
