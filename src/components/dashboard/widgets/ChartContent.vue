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
      console.log('----seriesData---', seriesData)
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

      /*------
        根据 this.widget.widget.data.config.values, 重新构造 data.values 数组
        1、主要是为了在每个 item 中，添加 series_type 字段
        2、valueCount 决定有几个 category 轴（只会有1个或2个的情况）
      -----*/
      let configValues = this.widget.widget.data.config.values;
      let configValuesArr = [];
      let valueCount = 0; // 用于计算有几个 category 轴（只会有1个或2个的情况）
      configValues.forEach((v, index) => {
        v.cols.forEach(c => {
          let item = {
            aggType: c.aggregate_type,
            series_type: v.series_type,
            name: c.col,
            col: c.col,
            categoryIndex: valueCount
          };
          configValuesArr.push(item);
        })

        if(v.cols.length > 0) valueCount++;
      })
      data.values = configValuesArr;
      //------构造END-----


      /*----------获得 option，用于调整图表样式----------*/
      let styleOption = this.widget.widget.data.config.option || {};

      /*-----判断水平or垂直展示----*/
      let isHorizon = this.widget.widget.data.config.valueAxis === 'horizontal' ? true : false;
      if(styleOption) {
        if(styleOption.value) {
          isHorizon = styleOption.value.orient === 'horizontal' ? true : false;
        }  
      }      

      /*
        默认情况下：
        对于bar图以及对于bar+line图，boundaryGap = false；
        对于line图，boundaryGap = true；
      */
      let hasBar = false;
      data.values.forEach(value => {
        if(value.series_type === 'bar') hasBar = true;
      })

      /*-----水平、垂直时分别对应的 xAxis、yAxis 的配置------*/
      let xAxis = [];
      let yAxis = [];
      let axisCategory = {
        type: 'category',
        boundaryGap: hasBar,
        data: parseCategory(data.keys)
      };
      /*----设置 boundaryGap----*/
      if(styleOption.line && typeof styleOption.line.boundaryGap === 'boolean') {
        axisCategory.boundaryGap = styleOption.line.boundaryGap;
      }

      let axisValue = [];
      for(let i=0; i<valueCount; i++) {
        axisValue.push({type: 'value'});
      }

      /*----设置 axisLabel.rotate----*/
      if(styleOption.category) {
        if(styleOption.category.rotate !== '') axisCategory.axisLabel = { rotate: styleOption.category.rotate };
      }

      if(isHorizon) { // 水平时
        xAxis = axisValue;
        yAxis = axisCategory;
        if(hasBar) {
          axisCategory.axisPointer = {
            type: 'shadow'
          }
        }
      }else { // 垂直时
        xAxis = axisCategory;
        yAxis = axisValue;
        if(hasBar) {
          axisCategory.axisPointer = {
            type: 'shadow'
          }
        }
      }

      function parseCategory(keys) {
        let arr = [];
        for(let i=0; i<keys.length; i++) {
          arr.push( keys[i].join('-') );
        }
        return arr;
      }

      console.log('----styleOption---', styleOption)
      /*-----构造图表的 option----*/
      let option = {
        tooltip: {
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            }
          },
          trigger: 'axis'
        },
        grid: parseGrid(styleOption),
        legend: parseLegend(styleOption, data),
        xAxis: xAxis,
        yAxis: yAxis,
        series: parseSeries(data.values, data.groups, data.keys, data.data)
      };

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

      /*----设置 grid----*/
      function parseGrid(styleOption) {
        if(styleOption.grid) {
          return {
            top: styleOption.grid.top === '' ? '15%' : styleOption.grid.top,
            left: styleOption.grid.left === '' ? '20' : styleOption.grid.left,
            right: styleOption.grid.right === '' ? '20' : styleOption.grid.right,
            bottom: styleOption.grid.bottom === '' ? '5%' : styleOption.grid.bottom,
            containLabel: true
          }
        }else {
          return {
            top: '15%',
            left: '50',
            right: '50',
            bottom: '15%',
            containLabel: true
          }
        }
      }

      /*----设置 legend----*/
      function parseLegend(styleOption, data) {
        let legend = {};
        if(styleOption.legend) {
          for(let prop in styleOption.legend) {
            if(styleOption.legend[prop] !== '') legend[prop] = styleOption.legend[prop];
          }
        }
        legend.data = parseLegendData(data.values, data.groups);
        return legend;
      }

      function parseLegendData(values, groups) {
        let arr = [];
        for(let i=0; i<groups.length; i++) {
          for(let j=0; j<values.length; j++) {
            let name = groups[i].join('-') ? (groups[i].join('-') + '-' + values[j].name) : values[j].name;
            arr.push(name);
          }
        }
        return arr;
      }

      /*----设置 series----*/
      function parseSeries(values, groups, keys, data) {
        let arr = [];
        for(let i=0; i<groups.length; i++) {
          for(let j=0; j<values.length; j++) {
            let name = groups[i].join('-') ? (groups[i].join('-') + '-' + values[j].name) : values[j].name;
            //------ tmp：有些 series_type 为 percentbar，将其转为 bar ------            
            if(values[j].series_type.indexOf('bar') !== -1) values[j].series_type = 'bar';
            //------tmp end-----
            let seriesItem = {
              type: values[j].series_type,
              name: name,
              barMaxWidth: 40,
              data: []
            };
            //根据 option 设置 bar 的样式
            if(styleOption.bar) {
              if(styleOption.bar.width !== '') seriesItem.barWidth = styleOption.bar.width;
              if(styleOption.bar.maxWidth !== '') seriesItem.barMaxWidth = styleOption.bar.maxWidth;
              if(styleOption.bar.minHeight !== '') seriesItem.barMinHeight = styleOption.bar.minHeight;
            }
            //设置 smooth 
            if(styleOption.line && typeof styleOption.line.smooth === 'boolean') {
              seriesItem.smooth = styleOption.line.smooth;
            }
            //水平布局时的处理
            if(isHorizon) {
              seriesItem.xAxisIndex = values[j].categoryIndex;
            }else {
              seriesItem.yAxisIndex = values[j].categoryIndex;
            }

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

      console.log('-----------option-----------', option);

      return option;
      
    },
    createPieOption(seriesData) {
      /*-------------------------------
        当 values 为 n 个时，pieChart 为 n 个；
        当 columns（groups） 为 m 时，pieChart 为 m 个；
        当 values 为 n 个，columns 为 m 个，pieChart 个数为 n*m 个
      */

      /*------
        根据 this.widget.widget.data.config.values, 重新构造 data.values 数组
        主要是为了在每个 item 中，添加 series_type 字段
      -----*/
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
      seriesData.values = configValuesArr;
      //------构造END-----

      /*----------获得 option，用于调整图表样式----------*/
      let styleOption = this.widget.widget.data.config.option || {};

      let option = {
        toolbox: false,
        tooltip: {
          trigger: 'item',
          format: '{a} <br/>{b} : {c} ({d}%)'
        },
        title: parseTitle(seriesData.values),
        legend: {
          data: parseLegendData(seriesData.keys),
          left: seriesData.values.length === 1 ? 'left' : 'top',
          orient: seriesData.values.length === 1 ? 'vertical' : 'horizontal'
        },
        series: parsePieSeries(seriesData.data, seriesData.groups, seriesData.keys, seriesData.values)
      };

      /*----设置 color----*/
      if(styleOption.size && styleOption.size.color) {
        if(styleOption.size.color === '') {
          /*option.color = null;
          delete option.color;*/
        }else {
          let colorString = styleOption.size.color;
          let colorArray = colorString.trim().split(',');
          option.color = colorArray;
        }
      }

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

      /*----设置 legend----*/
      if(styleOption.legend) {
        for(let prop in styleOption.legend) {
          if(styleOption.legend[prop] !== '') option.legend[prop] = styleOption.legend[prop];
        }
      }

      function parseLegendData(keys) {
        let arr = [];
        for(let i=0; i<keys.length; i++) {
          arr.push( keys[i].join('-') );
        }
        return arr;
      }

      /*----设置 series----*/
      function parsePieSeries(data, groups, keys, values) {
        let arr = [];
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

            //---设置 center----
            // TODO: 目前仅针对第一个 pie 图表设置，需要能够对多个设置
            if(styleOption.size && styleOption.size.center) {
              if(styleOption.size.center !== '' && i === 0 && j === 0 ) {
                let centerString = styleOption.size.center;
                let centerArray = centerString.trim().split(',');
                seriesItem.center = centerArray;
              }
            }

            //---设置为环形图---
            if(values[j].series_type === 'doughnut') {
              seriesItem.radius = ['50%', '70%'];
            }
            //---设置为南丁格尔图---
            else if(values[j].series_type === 'coxcomb') {
              seriesItem.roseType = 'radius';
            }

            //---设置 radius----
            if(styleOption.size && styleOption.size.radius) {
              let radiusString = styleOption.size.radius;
              let radiusArray = radiusString.trim().split(',');
              if(radiusArray.length === 1) {
                seriesItem.radius = radiusArray[0];
              }else {
                seriesItem.radius = radiusArray;  
              }
            }

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

      /*----------获得 option，用于调整图表样式----------*/
      let styleOption = this.widget.widget.data.config.option || {};

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

      //----- 设置 category 和 value-----
      let axisCategory = [
        {
            type : 'category',
            axisTick : {show: false},
            data: parseYData(seriesData.keys),
            axisPointer : {
              type : 'shadow'
            }
        }
      ];
      let axisValue = [
        {
            type : 'value',
            min: min,
        }
      ];

      let option = {
          tooltip: {
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
              }
            },
            trigger: 'axis'
          },
          legend: {
              data: parseLegendData(seriesData.values)
          },
          grid: parseGrid(styleOption),
          xAxis : axisValue,
          yAxis : axisCategory,
          series: series
      };

      /*----设置 水平\垂直----*/
      if(styleOption.value && styleOption.value.orient !== '') {
        if(styleOption.value.orient === 'vertical') {
          option.xAxis = axisCategory;
          option.yAxis = axisValue;
        }
      }

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

      /*----设置 grid----*/
      function parseGrid(styleOption) {
        if(styleOption.grid) {
          return {
            top: styleOption.grid.top === '' ? '15%' : styleOption.grid.top,
            left: styleOption.grid.left === '' ? '20' : styleOption.grid.left,
            right: styleOption.grid.right === '' ? '20' : styleOption.grid.right,
            bottom: styleOption.grid.bottom === '' ? '5%' : styleOption.grid.bottom,
            containLabel: true
          }
        }else {
          return {
            top: '15%',
            left: '50',
            right: '50',
            bottom: '15%',
            containLabel: true
          }
        }
      }

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

          //设置 bar 的高宽
          if(styleOption.value) {
            if(styleOption.value.width !== '') seriesItem.barWidth = styleOption.value.width;
            if(styleOption.value.maxWidth !== '') seriesItem.barMaxWidth = styleOption.value.maxWidth;
            if(styleOption.value.minHeight !== '') seriesItem.barMinHeight = styleOption.value.minHeight;
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
