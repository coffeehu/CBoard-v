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
      this.$store.dispatch('dashboard/getWidgetData', {widgetData: this.widgetData, filters: this.filters, reload: reload})
        .then(() => {
          let data = this.$store.state.dashboard.widgetInfoData;


          //----------------TMP------------------------
          const config = this.widget.widget.data.config;

          //获得keys、groups 对应的 index ，以及 valueSeries 数组
          let keysIndexArr = [];
          let groupsIndexArr = [];
          let valueSeries = [];
          for(let i=0,l=data.columnList.length; i<l; i++) {
            let col = data.columnList[i];
            for(let j=0; j<config.keys.length; j++) {
              if(config.keys[j].col === col.name) {
                keysIndexArr.push(col.index);
              }
            }

            for(let k=0; k<config.groups.length; k++) {
              if(config.groups[k].col === col.name) {
                groupsIndexArr.push(col.index);
              }
            }

            if(col.aggType) {
              valueSeries.push(col);
            }
          }

          
          //构建 newdata
          var newData = {};
          var joinedKeys = {};
          var keysData = [];
          var joinedGroups = {};
          var groupsData = [];
          for(let i=0,l=data.data.length; i<l; i++) {
            let item = data.data[i];

            // 获得 keys 的内容
            let keyArr = [];
            for(let j=0; j<keysIndexArr.length; j++) {
              keyArr.push( item[ keysIndexArr[j] ] );
            }

            let KeyArrStr = keyArr.join('-');
            if(!joinedKeys[KeyArrStr]) {
              joinedKeys[KeyArrStr] = true;
              keysData.push(keyArr);
            }

            // 获得 groups 的内容
            let groupArr = [];
            for(let j=0; j<groupsIndexArr.length; j++) {
              groupArr.push( item[ groupsIndexArr[j] ] );
            }

            let groupArrStr = groupArr.join('-');
            if(!joinedGroups[groupArrStr]) {
              joinedGroups[groupArrStr] = true;
              groupsData.push(groupArr);
            }

            //构建 newData
            for(let j=0; j<valueSeries.length; j++) {
              let series = valueSeries[j];
              if(typeof newData[groupArrStr] === 'undefined') {
                newData[groupArrStr] = {};
              }

              if(typeof newData[groupArrStr][series.name]  === 'undefined') {
                newData[groupArrStr][series.name] = {};
              }

              if(typeof newData[groupArrStr][series.name][series.aggType]  === 'undefined') {
                newData[groupArrStr][series.name][series.aggType] = {};
              }

              newData[groupArrStr][series.name][series.aggType][KeyArrStr] = item[series.index];
            }

          }
          console.log('---------newData-------------', newData)


          //排序
          keysData.sort(mSort);

          function mSort(a, b) {
            var r = 0;
            for(let i=0; i<a.length; i++) {
              if(a[i] === b[i]) {
                r = 0;
                continue;
              }
              r = (toNumber(a[i]) > toNumber(b[i])) ? 1 : -1;
              break;
            }
            return r;
          }

          function toNumber(value) {
            let result = Number(value);
            if(isNaN(result)) return value;
            return result;
          }

          /*console.log('--------keysData---------', keysData)
          console.log('--------groupsData---------', groupsData)
          console.log('--------valueSeries---------', valueSeries)*/

          let mData = {
            keys: keysData,
            groups: groupsData,
            values: valueSeries,
            data: newData
          }


          /*let tableData = [];
          let seriesArr = [];
          let index = 0;
          for(let i=0; i<groupsData.length; i++) {
            for(let j=0; j<valueSeries.length; j++) {

              let seriesItemArr = [].concat(groupsData[i]);
              seriesItemArr.push(valueSeries[j].name);
              seriesArr[index] = seriesItemArr;

              let colArr = [];
              for(let k=0; k<keysData.length; k++) {
                colArr[k] = newData[groupsData[i].join('-')][valueSeries[j].name][valueSeries[j].aggType][keysData[k].join('-')];
              }
              tableData[index] = colArr;
              index++;
            }
          }
          console.log('----tableData----', tableData, seriesArr)*/

          


          //----------------TMP END------------------------







          this.loading = false;
          this.$nextTick(()=>{
            this.renderChart(data, mData);
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
    renderChart(data, mData) {
      const chartBody = this.$refs['chart-body'];
      if(!chartBody) return;
      const chart = this.$echarts.init(chartBody, 'theme-fin1');

      const option = this.createOption(data, mData);

      chart.setOption(option);
      chartBody.name = this.widget.name;
      /*chartBody.onresize = function() {
        chart.resize();
      }*/
      this.addHandler(window, 'resize', function() {
        chart.resize();
      })
    },
    createOption(data, mData) {
      switch(this.chartType) {
        case 'line':
          return this.createLineOption(data, mData);
        case 'pie':
          return this.createPieOption(data, mData);
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
    createPieOption(data, mData) {
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
          name: this.valuesConfig[i].cols[0].col,
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

      /*let option = {
        toolbox: false,
        tooltip: {
          trigger: 'item',
          format: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: nameData,
          left: 'left',
          orient: 'vertical'
        },
        series: series
      };*/



      //------------tmp-------------------
      console.log('--------mData------------', mData)
      let option = {
        toolbox: false,
        tooltip: {
          trigger: 'item',
          format: '{a} <br/>{b} : {c} ({d}%)'
        },
        title: parseTitle(mData.values),
        legend: {
          data: parseLegend(mData.keys),
          left: mData.values.length === 1 ? 'left' : 'top',
          orient: mData.values.length === 1 ? 'vertical' : 'horizontal'
        },
        series: parseSeries(mData.data, mData.groups, mData.keys, mData.values)
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

      function parseLegend(keys) {
        var arr = [];
        for(let i=0; i<keys.length; i++) {
          arr.push( keys[i].join('-') );
        }
        return arr;
      }

      function parseSeries(data, groups, keys, values) {
        var arr = [];
        for(let i=0; i<groups.length; i++) {
          for(let j=0; j<values.length; j++) {
            //---构造 seriesItem----
            let seriesItem = {
              name: values[j].name,
              type: 'pie',
              data: null,
              center: [(100/values.length*j) + (100/values.length/2) +'%', '50%']
            };
            let seriesItemData = [];
            let seriesObj = data[groups[i]][values[j].name][values[j].aggType];
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
      //------------tmp END-------------------


      console.log('-------option----------', option)
      return option;
    }
  }
}
export default options;
</script>

<style>

</style>
