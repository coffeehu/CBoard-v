<template>
  <dashboard-loading v-if="loading" :name="widget.name"></dashboard-loading>

	<dashboard-box v-else :name="chartName"
            :mBackground="mBackground"
            @open-widget="handeOpen"
            @refresh-widget="handeRefresh">
		<div class="box-body" ref="chart-body" :style="boxHeight" style="padding: 3px 0px 3px 13px;"></div>
	</dashboard-box>

</template>

<script>
/*
	Row 决定维度
	value、column 决定个数
*/
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardBox from '@/components/dashboard/DashboardBox';

let options = {
  name: 'ScatterContent',
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
    },
    mBackground: {
      type: String
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

    this.valuesConfig = this.widgetData.config.values;
  },
  watch: {
    widget() {
      this.initByWidget();
      this.chartName = this.widget.name;
      this.chartType = this.widgetData.config.chart_type;
      this.valueAxis = this.widgetData.config.valueAxis;
    },
    'widget.widget.data.config.chart_type': function() {
      this.initByWidget();
      this.chartName = this.widget.name;
      this.chartType = this.widgetData.config.chart_type;
      this.valueAxis = this.widgetData.config.valueAxis;
    },
    filters() {
      this.initByWidget();
      this.chartName = this.widget.name;
      this.chartType = this.widgetData.config.chart_type;
      this.valueAxis = this.widgetData.config.valueAxis;
    }
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
      this.$store.dispatch('dashboard/getWidgetData', {widgetData: this.widgetData, filters: this.filters, reload: reload, config: this.widget.widget.data.config})
        .then((seriesData) => {
          this.loading = false;
          this.$nextTick(()=>{
            this.renderChart(seriesData);
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
    renderChart(seriesData) {
      const chartBody = this.$refs['chart-body'];
      if(!chartBody) return;
      const chart = this.$echarts.init(chartBody, 'theme-fin1');

      const option = this.createOption(seriesData);

      chart.setOption(option);
      chartBody.name = this.widget.name;
      /*chartBody.onresize = function() {
        chart.resize();
      }*/
      this.addHandler(window, 'resize', function() {
        chart.resize();
      })
    },
    createOption(seriesData) {
    	console.log('----seriesData-----', seriesData)

      /*----------获得 option，用于调整图表样式----------*/
      let styleOption = this.widget.widget.data.config.option || {};

      /*let op = {
        "legend": {
          "data": ["2016", "2017"]
        },
        "tooltip": {
          "trigger": "item"
        },
        "xAxis": {
          "data": ["Canada", "Mexico", "USA"],
          "splitLine": {
            "lineStyle": {
              "type": "dashed"
            }
          },
          "axisLabel": {}
        },
        "yAxis": {
          "axisLabel": {},
          "splitLine": {
            "lineStyle": {
              "type": "dashed"
            }
          },
          "scale": true
        },
        "visualMap": [{
          "dimension": 2,
          "show": false,
          "min": 0.8,
          "max": 179706.945,
          "calculable": true,
          "precision": 0.1,
          "textStyle": {
            "color": "white"
          },
          "inRange": {
            "symbolSize": [5, 70]
          }
        }, {
          "dimension": 3,
          "show": false,
          "min": 1,
          "max": 1,
          "inRange": {
            "opacity": [0.2, 1]
          }
        }],
        "series": [{
          "name": "2016",
          "data": [{
            "name": "Canada",
            "value": ["Canada", null, 1, 1]
          }, {
            "name": "Mexico",
            "value": ["Mexico", null, 1, 1]
          }, {
            "name": "USA",
            "value": ["USA", "44232.8073", "111103.4", 1]
          }],
          "type": "scatter"
        }, {
          "name": "2017",
          "data": [{
            "name": "Canada",
            "value": ["Canada", "7669.0232", "19051.18", 1]
          }, {
            "name": "Mexico",
            "value": ["Mexico", "30231.3687", "75243.61", 1]
          }, {
            "name": "USA",
            "value": ["USA", "47895.5982", "119804.63", 1]
          }],
          "type": "scatter"
        }],
        "grid": {
          "left": "50",
          "right": "20",
          "bottom": "15%",
          "top": "15%",
          "containLabel": false
        }
      }*/
      let valueArray = [];

      let option = {
        grid: {
          left: "50",
          right: "20",
          bottom: "15%",
          top: "15%",
          containLabel: false
        },
        legend: {
          data: parseLegendData(seriesData.groups)
        },
        tooltip: {
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          },
          trigger: 'axis'
        },
        visualMap: [{
          show: false,
          min: 0.8,
          max: 71843.3973,
          inRange: {
            symbolSize: [5, 70]
          }
        }],
        xAxis: {
          data: parseXData(seriesData.keys),
        },
        yAxis: {
          /*axisLabel: {},
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          scale: true*/
        },
        series: parseSeries(seriesData.groups, seriesData.keys, seriesData.values, seriesData.data)
      };

      /*----计算 value 的最大值----*/
      let sortValueArray = valueArray.filter(Boolean).sort((a, b) => {
        if(Number(a) > Number(b)) {
          return -1;
        }
        return 1;
      })
      let max = sortValueArray[0];
      option.visualMap.max = Number(max) * 1.5;

      /*----设置 legend----*/
      if(styleOption.legend) {
        for(let prop in styleOption.legend) {
          if(styleOption.legend[prop] !== '') option.legend[prop] = styleOption.legend[prop];
        }
      }

      /*----设置 color----*/
      if(styleOption.value && styleOption.value.color) {
        if(styleOption.value.color === '') {
          /*option.color = null;
          delete option.color;*/
        }else {
          let colorString = styleOption.value.color;
          let colorArray = colorString.trim().split(',');
          option.color = colorArray;
        }
      }

      function parseLegendData(groups) {
        let legendData = [];
        groups.forEach(group => {
          legendData.push(group.join('-'));
        })
        return legendData;
      }

      function parseXData(keys) {
        let xData = [];
        keys.forEach(key => {
          xData.push(key.join('-'));
        })
        return xData;
      }

      function parseSeries(groups, keys, values, data) {
        let series = [];
        groups.forEach(group => {
          let item = {
            name: group.join('-'),
            type: 'scatter',
            data: parseSeriesData(keys, group, values, data)
          }
          series.push(item);
        })
        return series;
      }

      function parseSeriesData(keys, group, values, data) {
        let seriesData = [];
        let value = values[0];
        keys.forEach(key => {
          let _key = key.join('-');
          let _value = data[group.join('-')][value.name][value.aggType][_key];
          valueArray.push(_value); //记录所有的 value 值，用来计算最大值
          let item = {
            name: _key,
            value: [_key, _value]
          }
          seriesData.push(item);
        })
        return seriesData;
      }

      console.log('-----option------', option)

      return option;

    }
  }
}
export default options;
</script>

<style>

</style>
