<template>

  <!-- <div :style="{'background-color': mBackground}"> -->
    <dashboard-loading v-if="loading" :name="widget.name"></dashboard-loading>

    <dashboard-box v-else 
                   :name="widget.name" 
                   :mBackground="mBackground"
                   @open-widget="handeOpen"
                   @refresh-widget="handeRefresh">
      <div class="box-body" ref="table-body" :style="boxHeight" style="padding: 5px 20px 20px 20px;overflow-y: auto">

        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%">
          <data-table :columnList="columnList"></data-table>
        </el-table>   

      </div>
    </dashboard-box>
  <!-- </div> -->

</template>

<script>
import { injectFilter, formatConfig } from '@/utils/dashboardConfig.js';
import DashboardBox from '@/components/dashboard/DashboardBox';
import DashboardLoading from '@/components/dashboard/DashboardLoading';

const DataTable = {
  name: 'DataTable',
  props: {
    columnList: {
      type: Array
    }
  },
  render(h) {
    let columnListArr = [];
    if(this.columnList.length > 0){
      for(let i=0,l=this.columnList.length; i<l; i++) {
        let column = this.columnList[i];
        let col = <el-table-column prop={column.name} label={column.name}></el-table-column>;
        columnListArr.push(col);
      }
    }
    return (
      <template>
        {columnListArr}
      </template>
    )
  }
}

let options = {
  name: 'TableContent',
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
    DashboardLoading,
    DataTable
  },
  mounted() {
    this.initByWidget();
  },
  watch: {
    widget() {
      this.initByWidget();
    },
    filters() {
      this.initByWidget(true);
    }
  },
  data() {
    return {
      loading: true,
      widgetData: {},
      tableData: [],
      columnList: [],
      mTableData: []
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
      const format = this.widgetData.config.values[0].format;
      const style = this.style = this.widgetData.config.values[0].style;

      this.loading = true;
      this.$store.dispatch('dashboard/getWidgetData', {widgetData: this.widgetData, filters: this.filters, reload: reload})
        .then(() => {
          let data = this.$store.state.dashboard.widgetInfoData;
          console.log('-------data config-----------', this.widget.widget.data.config);
          console.log('------http get data-----', data);


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
          console.log(keysIndexArr, groupsIndexArr, valueSeries)

          
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
            /*for(let j=0; j<valueSeries.length; j++) {
              let value = valueSeries[j];
              item[value.index];
            }*/
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
          console.log('111111111111', newData)


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

          console.log(keysData, groupsData)


          for(let i=0; i<groupsData.length; i++) {
            
          }


          //----------------TMP END------------------------



          const columnList = this.columnList = data.columnList;
          const mTableData = this.mTableData = data.data;
          this.tableData = this.formatTableData(columnList, mTableData);
          this.loading = false;
        })
        .catch(() => {});
    },
    formatTableData(columnList, data) {
      let tableData = [];
      for(let i=0,l=data.length; i<l; i++) {
        let tableDataItem = {};
        for(let j=0,len=columnList.length; j<len; j++) {
          tableDataItem[ columnList[j].name ] = data[i][j];
        }
        tableData.push(tableDataItem);
      }
      return tableData;
    },
    // 表格--合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //console.log(row)
         /*if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }*/
        return {
              rowspan: 1,
              colspan: 1
            };
    },
    handeOpen() {
      let data = {
        componentOptions: options,
        name: this.widget.name,
        widget: this.widget,
        filters: this.filters
      }
      this.$store.commit('widget/openWidget', data);
    },
    handeRefresh() {
      this.initByWidget(true);
    }

  }
}

export default options;
</script>

<style scoped>
.box {
  
}
.box .box-body {
  max-height: 700px;
}
</style>
