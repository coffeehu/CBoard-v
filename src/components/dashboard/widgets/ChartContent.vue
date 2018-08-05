<template>

  <dashboard-loading v-if="loading" :name="widget.name"></dashboard-loading>

	<dashboard-box v-else :name="chartName"
            @open-widget="handeOpen"
            @refresh-widget="handeRefresh">
		<div class="box-body" ref="chart-body" :style="boxHeight" style="padding: 3px 0px 3px 13px;"></div>
	</dashboard-box>

</template>

<script>
import DashboardBox from '@/components/dashboard/DashboardBox';
import DashboardLoading from '@/components/dashboard/DashboardLoading';

let options = {
  name: 'ChartContent',
  props: {
    widget: {
      type: Object,
      required: true
    },
    height: {
      type: String
    },
    filters: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    DashboardBox,
    DashboardLoading
  },
  mounted() {
    this.initByWidget();
    this.chartName = this.widget.name;
    this.chartType = this.widgetData.config.chart_type;  // 图表类型，如：line
    this.valueAxis = this.widgetData.config.valueAxis;  // 显示方式，如 vertical--垂直，horizontal --水平
    /*
      this.valuesConfig 为数组，如 
      [{
        series_type: 'bar',
        type: 'value',
        cols: [
          {aggregate_type: 'sum', col: 'store_cost', ...}, 
          ...
        ],
        ...
      }]
    */
    this.valuesConfig = this.widgetData.config.values;

    const style = this.style = this.widgetData.config.values[0].style;
  },
  watch: {
    widget() {
      this.initByWidget();
    },
    filters() {
      this.initByWidget();
    },
  },
  data() {
    return {
      loading: true,
      widgetData: {},
      chartName: '',
      chartType: '',
      valueAxis: '',
      valuesConfig: ''
    }
  },
  computed: {
    boxHeight() {
      if(this.height) {
        let height = parseFloat(this.height)+'px';
        return {height: height}
      }else {
        return {'min-height': '250px'}
      }     
    }
  },
  methods: {
    initByWidget(reload) {
      this.widgetData = this.widget.widget.data;
      this.loading = true;
      this.$store.dispatch('dashboard/getWidgetData', {widgetData: this.widgetData, filters: this.filters, reload: reload})
        .then(() => {
          let data = this.$store.state.dashboard.widgetInfoData;
          this.loading = false;
          this.$nextTick(()=>{
            this.renderChart(data);
          }) 
        })
    },
    handeOpen() {
      let data = {
        componentOptions: options,
        name: this.chartName,
        widget: this.widget,
        filters: this.filters
      }
      this.$store.commit('widget/openWidget', data);
    },
    handeRefresh() {
      this.initByWidget(true);
    },
    addHandler(element, type, handler) {
      if (element.addEventListener) {
        element.addEventListener(type, handler, false);
      }else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
      }else {
        element["on" + type] = handler;
      }
    },
    renderChart(data) {
      const chartBody = this.$refs['chart-body'];
      const chart = this.$echarts.init(chartBody, 'theme-fin1');

      const option = this.createOption(data);

      chart.setOption(option);
      chartBody.name = this.widget.name;
      /*chartBody.onresize = function() {
        chart.resize();
      }*/
      this.addHandler(window, 'resize', function() {
        chart.resize();
      })
    },
    createOption(data) {
      switch(this.chartType) {
        case 'line':
          return this.createLineOption(data);
        case 'pie':
          return this.createPieOption(data);
        default:
          return {};
      }
    },
    createLineOption(data) {
      const aggType = this.valuesConfig[0].cols[0].aggregate_type;
      const dataArr = data.data;
      const columnList = data.columnList;
      let nameData = [];
      let seriesData = [];
      let seriesDataIndex = -1;
      let nameDataIndex = [];
      for(let i=0,l=columnList.length; i<l; i++) {
        if(columnList[i].aggType === aggType) {
          seriesDataIndex = columnList[i].index;
        }else if(columnList[i].aggType === null) {
          nameDataIndex.push(columnList[i].index);
        }
      }

      for(let i=0,l=dataArr.length; i<l; i++) {
        let nameDataItem = [];
        for(let j=0,l=nameDataIndex.length; j<l; j++) {
          let nameDataItemIndex = nameDataIndex[j];
          nameDataItem.push( dataArr[i][nameDataItemIndex] );
        }
        nameData.push( nameDataItem.join('-') );

        seriesData.push(dataArr[i][seriesDataIndex]);
      }

      const xAxis = {};
      const yAxis = {};
      if(this.valueAxis === 'vertical') {
        yAxis.type = 'value';
        xAxis.type = 'category';
        xAxis.data = nameData;
      } else if(this.valueAxis === 'horizontal') {
        xAxis.type = 'value';
        yAxis.type = 'category';
        yAxis.data = nameData;
      }

      const legend = [];
      const series = [];
      for(let i=0,l=this.valuesConfig.length; i<l; i++) {
        let type = this.valuesConfig[i].series_type;
        type = type || this.chartType;
        if(type === 'percentbar') {
          type = 'bar';
        }
        const seriesItem = {
          name: this.valuesConfig[i].cols[0].col,
                  type: type,
          barMaxWidth: 40,
                  valueAxisIndex: 0,
                  yAxisIndex: 0,
                  data: []
        }
        series.push(seriesItem);
        legend.push(this.valuesConfig[i].cols[0].col);
      }

      for(let i=0,l=series.length; i<l; i++) {
        series[i].data = seriesData;
      }

      const option = {
            title: {
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: {
            left: '0',
            right: '20',
            bottom: '15%',
            top: '15%',
            containLabel: true
        },
            legend: {
                data: legend
            },
            /*xAxis: {
                data: xAxisData,
                boundaryGap: true,
                type: 'category'
            },*/
            xAxis: xAxis,
            yAxis: yAxis,
            series: series
        };

        return option;
    },
    createPieOption(data) {
      const aggType = this.valuesConfig[0].cols[0].aggregate_type;
      const dataArr = data.data;
      const columnList = data.columnList;
      let nameData = [];
      let seriesData = [];
      let seriesDataIndex = -1;
      let nameDataIndex = [];
      for(let i=0,l=columnList.length; i<l; i++) {
        if(columnList[i].aggType === aggType) {
          seriesDataIndex = columnList[i].index;
        }else if(columnList[i].aggType === null) {
          nameDataIndex.push(columnList[i].index);
        }
      }

      for(let i=0,l=dataArr.length; i<l; i++) {
        let nameDataItem = [];
        for(let j=0,l=nameDataIndex.length; j<l; j++) {
          let nameDataItemIndex = nameDataIndex[j];
          nameDataItem.push( dataArr[i][nameDataItemIndex] );
        }
        nameData.push( nameDataItem.join('-') );

        seriesData.push({
          name: nameDataItem.join('-'),
          value: dataArr[i][seriesDataIndex]
        });
      }

      const series = [];
      for(let i=0,l=this.valuesConfig.length; i<l; i++) {
        let type = this.valuesConfig[i].series_type;
        type = type || this.chartType;

        const seriesItem = {
          name: nameData[i],
                  type: type,
          center: ['50%', '50%'],
            itemStyle: {},
                  data: []
        }
        series.push(seriesItem);
      }

      for(let i=0,l=series.length; i<l; i++) {
        series[i].data = seriesData;
      }

      const option = {
        toolbox: false,
        tooltip: {
          trigger: 'item',
          format: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: nameData
        },
        series: series
      };
      return option;
    }
  }
}
export default options;
</script>

<style>

</style>
