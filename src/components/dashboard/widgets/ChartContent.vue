<template>
  <!-- Pie图 与 line、bar图 -->
  <dashboard-loading v-if="loading" :name="widget.name"></dashboard-loading>

	<dashboard-box v-else :name="chartName"
            :mBackground="mBackground"
            @open-widget="handeOpen"
            @refresh-widget="handeRefresh">
		<div class="box-body" ref="chart-body" :style="boxHeight" style="padding: 3px 0px 3px 13px;"></div>
	</dashboard-box>

</template>

<script>
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardBox from '@/components/dashboard/DashboardBox';

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
    //console.log('----chartContent----', this.widget)
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
      console.log(123123, this.chartType)
      switch(this.chartType) {
        case 'line':
          return this.createLineOption(seriesData);
        case 'pie':
          return this.createPieOption(seriesData);
        case 'contrast':  // 正负轴图
          return this.createContrastOption(seriesData);
        default:
          return {};
      }
    },
    /*
      row(即 keys) 为 axis 值
      value 和 column(groups) 决定有多少条线

      TODO: 1、添加 bar 类型；2、添加 horizontal bar
    */
    createLineOption(data) {
      //-------------------------------------------------------------
      //console.log('-----------------data--------', data);
      //console.log('--------this.valuesConfig-------------', this.valuesConfig)
      //console.log('--------this.valuesConfig-------------', this.widget.widget.data.config)

      //------根据 this.widget.widget.data.config.values, 重新构造 data.values 数组-----
      let configValues = this.widget.widget.data.config.values;
      let configValuesArr = [];
      configValues.forEach(v => {
        v.cols.forEach(c => {
          let item = {
            aggType: c.aggregate_type,
            series_type: v.series_type,
            name: c.col,
            col: c.col,
          };
          configValuesArr.push(item);
        })
      })
      data.values = configValuesArr;
      //------构造END-----

      let isHorizon = this.widget.widget.data.config.valueAxis === 'horizontal' ? true : false;

      let xAxis;
      let yAxis;
      if(isHorizon) { //水平
        xAxis = [
          {
            type: 'value'
          }
        ];
        yAxis = {
          type: 'category',
          //boundaryGap: false,
          data: parseCategory(data.keys)
        }
      }else {
        xAxis = {
          type: 'category',
          //boundaryGap: false,
          data: parseCategory(data.keys)
        };
        yAxis = [
          {
            type: 'value'
          }
        ]
      }

      let option = {
        tooltip: {
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          }
        },
        grid: {
          bottom: '15%',
          left: '50',
          right: '20',
          top: '15%'
        },
        legend: {
          data: parseLegend(data.values, data.groups)
        },
        xAxis: xAxis,
        yAxis: yAxis,
        series: parseSeries(data.values, data.groups, data.keys, data.data)
      };

      function parseCategory(keys) {
        let arr = [];
        for(var i=0; i<keys.length; i++) {
          arr.push( keys[i].join('-') );
        }
        return arr;
      }

      function parseLegend(values, groups) {
        let arr = [];
        for(let i=0; i<groups.length; i++) {
          for(let j=0; j<values.length; j++) {
            let name = groups[i].join('-') + '-' + values[j].name;
            arr.push(name);
          }
        }
        return arr;
      }

      function parseSeries(values, groups, keys, data) {
        let arr = [];
        for(let i=0; i<groups.length; i++) {
          for(let j=0; j<values.length; j++) {
            let name = groups[i].join('-') + '-' + values[j].name;
            //------tmp------
            //if(values[j].series_type === 'percentbar') values[j].series_type = 'bar';
            if(values[j].series_type.indexOf('bar') !== -1) values[j].series_type = 'bar';
            //------tmp end-----
            let seriesItem = {
              type: values[j].series_type,
              name: name,
              barMaxWidth: 40,
              data: []
            };

            //parse seriesItemData
            let seriesItemData = [];
            for(let k=0; k<keys.length; k++) {
              let value = data[groups[i].join('-')][values[j].name][values[j].aggType][keys[k].join('-')] || '0';
              seriesItemData.push(value);
            }
            seriesItem.data = seriesItemData;
            
            arr.push(seriesItem);
          }
        }
        return arr;
      }

      //console.log('-----------option-----------', option);

      return option;
      
    },
    createPieOption(seriesData) {
      /*-------------------------------
        当 values 为 n 个时，pieChart 为 n 个；
        当 columns（groups） 为 m 时，pieChart 为 m 个；
        当 values 为 n 个，columns 为 m 个，pieChart 个数为 n*m 个
      */
      let option = {
        toolbox: false,
        tooltip: {
          trigger: 'item',
          format: '{a} <br/>{b} : {c} ({d}%)'
        },
        title: parseTitle(seriesData.values),
        legend: {
          data: parsePieLegend(seriesData.keys),
          left: seriesData.values.length === 1 ? 'left' : 'top',
          orient: seriesData.values.length === 1 ? 'vertical' : 'horizontal'
        },
        series: parsePieSeries(seriesData.data, seriesData.groups, seriesData.keys, seriesData.values)
      };

      function parseTitle(values) {
        let arr = [];
        for(let i=0; i<values.length; i++) {
          let titleObj = {
            top: '90%',
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal'
            },
            textAlign: 'center',
            text: values[i].name,
            left: (100/values.length*i) + (100/values.length/2) +'%'
          };
          arr.push(titleObj);
        }
        return arr;
      }

      function parsePieLegend(keys) {
        var arr = [];
        for(let i=0; i<keys.length; i++) {
          arr.push( keys[i].join('-') );
        }
        return arr;
      }

      function parsePieSeries(data, groups, keys, values) {
        var arr = [];
        for(let i=0; i<groups.length; i++) {
          for(let j=0; j<values.length; j++) {
            let chartNum = groups.length * values.length;
            let currIndex = values.length*i+j;

            //---构造 seriesItem----
            let name = groups[i].join('-') === '' ? values[j].name : groups[i].join('-') + '-' + values[j].name;
            let seriesItem = {
              name: name,
              type: 'pie',
              data: null,
              center: [(100/chartNum*currIndex) + (100/chartNum/2) +'%', '50%']
            };
            let seriesItemData = [];
            let seriesObj = data[groups[i].join('-')][values[j].name][values[j].aggType];
            for(let prop in seriesObj) {
              let obj = {
                name: prop,
                value: seriesObj[prop]
              };
              seriesItemData.push(obj);
            }
            seriesItem.data = seriesItemData;
            //---构造 seriesItem END----
            arr.push(seriesItem);
          }
        }
        return arr;
      }

      console.log('-------option----------', option)
      return option;
    },
    createContrastOption(seriesData) {
      console.log('----seriesData----', seriesData);

      let series = parseSeries(seriesData.values, seriesData.keys, seriesData.data);

      //-----设置 min 的值-----
      let min = undefined;
      if(series[1]) {
        let _data = series[1].data.slice();
        _data.sort((a, b) => {
          if( Number(a) < Number(b) ) {
            return -1;
          }
          return 1;
        })
        min = _data[0] * 1.3;
      }
      //----设置 min END----

      let option = {
          tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          legend: {
              data: parseLegendData(seriesData.values)
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'value',
                  //max: '1234',
                  min: min,
              }
          ],
          yAxis : [
              {
                  type : 'category',
                  axisTick : {show: false},
                  data: parseYData(seriesData.keys)
              }
          ],
          series: series
      };

      function parseLegendData(values) {
        let legendData = [];
        values.forEach(value => {
          legendData.push(value.name);
        })
        return legendData;
      }

      function parseYData(keys) {
        let yData = [];
        keys.forEach(key => {
          yData.push(key.join('-'));
        })
        return yData;
      }

      function parseSeries(values, keys, data) {
        let series = [];
        values.forEach( (value, index) => {
          let seriesItem = {
              name: value.name,
              type:'bar',
              stack: 'sum',
              barWidth: 40,
              label: {
                  normal: {
                      show: true,
                      position: index === 1 ? 'left' : ''
                  },
                  fontSize: 12,
              },
              data: []
          }

          keys.forEach(key => {
            let v = data[''][value.name][value.aggType][key.join('-')];
            if(index === 1) v = '-' + v;
            seriesItem.data.push(v);
          });

          series.push(seriesItem);
        });
        return series;
      }

      console.log('----option----', option);
      return option;
    }
  }
}
export default options;
</script>

<style>

</style>
