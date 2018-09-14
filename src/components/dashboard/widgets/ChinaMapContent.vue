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
  name: 'ChinaMapContent',
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
      //this.loading = true;
      this.loading = false;
      this.$nextTick(()=>{
        this.renderChart();
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
    renderChart() {
      const chartBody = this.$refs['chart-body'];
      if(!chartBody) return;
      const chart = this.$echarts.init(chartBody, 'theme-fin1');

      this.$req.get('./static/china.json')
          .then(response => {
            console.log(response.data)
            this.$echarts.registerMap('china', response.data);
            let geojson = response.data;


            let series = [
              {
                
                type: 'map',
                mapType: 'china', // 自定义扩展图表类型
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[],
                // 自定义名称映射
                /*nameMap: {
                    'Central and Western': '中西区',
                    'Eastern': '东区',
                    'Islands': '离岛',
                    'Kowloon City': '九龙城',
                    'Kwai Tsing': '葵青',
                    'Kwun Tong': '观塘',
                    'North': '北区',
                    'Sai Kung': '西贡',
                    'Sha Tin': '沙田',
                    'Sham Shui Po': '深水埗',
                    'Southern': '南区',
                    'Tai Po': '大埔',
                    'Tsuen Wan': '荃湾',
                    'Tuen Mun': '屯门',
                    'Wan Chai': '湾仔',
                    'Wong Tai Sin': '黄大仙',
                    'Yau Tsim Mong': '油尖旺',
                    'Yuen Long': '元朗'
                }*/
              }
            ]


            geojson.features.forEach(geo => {
              let item = {
                name: geo.properties.name,
                value: geo.properties.size
              }
              series[0].data.push(item);
            })


            let mapOption = {
                legend: {
                    orient: 'vertical',
                    top: 'top',
                    left: 'left',
                    selectedMode: 'multiple',
                    data: ['123', '456'] //TODO
                },
                visualMap: {
                    //min: min,
                    max: 2000,
                    left: 'right',
                    top: 'bottom',
                    //text: ['High', 'Low'],
                    inRange: {
                        //color: ['#d94e5d','#eac736','#50a3ba'].reverse()
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    calculable : true,
                    textStyle: {
                        color: '#d94e5d'
                    }
                },
                /*geo: {
                    map: 'china',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#EFF0F0',
                            borderColor: '#B5B5B5',
                            borderWidth: 1
                        }
                    }
                },*/
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c}'
                },
                series: series
            }

            console.log('----mapOption---', mapOption)

            chart.setOption(mapOption)

            this.addHandler(window, 'resize', function() {
              chart.resize();
            })
          })
    }

  }
}
export default options;
</script>

<style>

</style>
