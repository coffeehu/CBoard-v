<template>
  <!-- 漏斗图 -->
  <!-- TODO: column 的处理。目前加上 column 会报错  -->
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
	value 决定层数
	row 决定个数
*/
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardBox from '@/components/dashboard/DashboardBox';

let options = {
  name: 'FunnelContent',
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

      let option = {
        grid: {
          bottom: '15%',
          containLabel: false,
          left: 50,
          right: 20,
          top: '15%'
        },
        tooltip: {
            trigger: 'item',
            formatter(params) {
              return params.seriesName + '<br/>' + params.name + ':' +params.value + '<br/>'  +params.data.percent + '%';
            }
        },
        toolbox: {
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        title: parseTitle(seriesData.keys),
        legend: {
            data: parseLegend(seriesData.values)
        },
        calculable: true,
        series: parseSeries(seriesData.keys, seriesData.values, seriesData.data)
      };

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

      function parseTitle(keys) {
        let title = [];
        let count = keys.length;
        keys.forEach( (key, index) => {
          let item = {
            left: ( (100 / count ) * index + (100 / count) / 2 ) + '%',
            text: key.join('-'),
            textAlign: 'center',
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal'
            },
            top: '90%'
          }
          title.push(item);
        })
        return title;
      }


      function parseLegend(values) {
        let legend = [];
        values.forEach(v => {
          legend.push(v.name);
        })
        return legend;
      }


      function parseSeries(keys, values, data) {
        if(keys.length === 0) keys = [ [''] ]; // 无 row 的情况

        let series = [];
        let count = keys.length;
        keys.forEach((key, index) => {
          let left =  ( (100/count) * index ) + '%';
          let seriesItem = {
            name: key.join('-'),
            type:'funnel',
            left: left,
            width: (100 / count) + '%',
            minSize: '0%',
            maxSize: '100%',
            //sort: 'descending',
            top: '20%',
            gap: 2,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter(params) {
                      return params.value + '\n' +params.data.percent + '%'
                    }
                },
                emphasis: {
                    textStyle: {
                        fontSize: 20
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            data: []
          };
          seriesItem.data = parseSeriesData(values, data, key.join('-'));

          if(styleOption.value) {
            //----设置排序---
            if(styleOption.value.sort) {
              seriesItem.sort = styleOption.value.sort;
            }

            //----设置width宽度---
            if(styleOption.value.width) {
              seriesItem.width = styleOption.value.width;
            }

            //----设置left左边距---
            if(styleOption.value.left) {
              seriesItem.left = ( parseFloat(seriesItem.left) +  parseFloat(styleOption.value.left) ) + '%';
            }

            //----设置top上边距---
            if(styleOption.value.top) {
              seriesItem.top = ( parseFloat(seriesItem.top) +  parseFloat(styleOption.value.top) ) + '%';
            }

          }

          series.push(seriesItem);
        })
        return series;
      }


      function parseSeriesData(values, data, key) {
        key = key || '';
      	let arr = [];
      	values.forEach(value => {
      		let item = {
      			name: value.name,
      			value: data[''][value.name][value.aggType][key]
      		};
      		arr.push(item);
      	})

        // 取最大的值为 100%，其他根据这个最大值设置百分比
        let max = getMax(arr);
        arr.forEach(item => {
          item.percent = ( Number(item.value) / max * 100 ).toFixed(2) + '';
        })

      	return arr;
      }


      function getMax(data) {
        let max = Number(data[0].value);
        data.forEach(item => {
          let value = Number(item.value);
          if( value > max ) max = value;
        })
        return max;
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
