<template>
  <!-- 雷达图 -->
  <!-- TODO: 目前仅做了 row 和 value 的维度，后续要加上 column 的维度 -->
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
  name: 'RadarContent',
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

    	let data = parseSeriesData(seriesData.data, seriesData.values, seriesData.keys);
    	let indicator = parseIndicator(seriesData.keys);

    	//---计算 max 的值---
		let maxArray = [];
		data.forEach(item => {
			console.log(item.value)
			let max = getMax(item.value);
			maxArray.push(max);
		})
		let max = getMax(maxArray) * 1.05;

    	indicator.forEach(item => {
    		item.max = max;
    	})
    	//---计算 max END---

    	let option = {
		    tooltip: {
		    	trigger: 'item'
		    },
		    grid: {
		    	containLabel: false,
		    	top: '15%',
		    	bottom: '15%',
		    	left: '50',
		    	right: '20'
		    },
		    legend: {
		    	left: 'left',
		    	orient: 'vertical',
		        data: parseLegendData(seriesData.values)
		    },
		    radar: {
		        // shape: 'circle',
		        name: {
		            textStyle: {
		                color: '#fff',
		                backgroundColor: '#999',
		                borderRadius: 3,
		                padding: [3, 5]
		           }
		        },
		        indicator: indicator
		    },
		    series: [{
		        name: 'radar',
		        type: 'radar',
		        itemStyle: {
		        	areaStyle: {
		        		color: 'rgba(0,250,0,0.3)'
		        	}
		        },
		        // areaStyle: {normal: {}},
		        data: data
		    }]
		}

		function parseLegendData(values) {
			let legendData = [];
			values.forEach(v => {
				legendData.push(v.name);
			})
			return legendData;
		}

		function parseIndicator(keys) {
			let indicator = [];
			keys.forEach(key => {
				let item = { name: key.join('-') };
				indicator.push(item);
			})
			return indicator;
		}

		function parseSeriesData(data, values, keys) {
			let arr = [];
			values.forEach(value => {
				let item = {
					name: value.name,
					value: []
				};

				keys.forEach(key => {
					let itemValue = data[''][value.name][value.aggType][key.join('-')];
					item.value.push(itemValue);
				})

				arr.push(item);
			})
			return arr;
		}

		function getMax(arr) {
			let _arr = arr.slice();
			_arr.sort((a, b) => {
				if(Number(a) > Number(b)) {
					return -1;
				}
				return 1;
			})
			return _arr[0];
		}

		console.log('----option-----', option)

		return option;
    }
  }
}
export default options;
</script>

<style>

</style>
