<template>

  <!-- <div :style="{'background-color': mBackground}"> -->
    <dashboard-loading v-if="loading" :name="widget.name"></dashboard-loading>

    <dashboard-box v-else 
                   :name="widget.name" 
                   :mBackground="mBackground"
                   @open-widget="handeOpen"
                   @refresh-widget="handeRefresh">
      <div class="box-body" ref="table-body" :style="boxHeight" style="padding: 5px 20px 20px 20px;overflow-y: auto">

        <div class="mTable-wrapper">
          <table cellspacing="0" cellpadding="0" border="0" class="mTable">
            <thead>
              <tr v-for="tableTr in headTableData">
                <th v-for="tableTh in tableTr" :colspan="tableTh.colspan" :class="tableTh.property === 'head-empty' ? 'head-empty' : ''">
                  <div class="cell">{{ tableTh.data }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tableTr, index) in realTableData">
                <template v-for="(tableTd, childIndex) in tableTr">
                  <td v-if="tableTd.property === 'column-key'"
                      :class="['mTable-head', temp(realTableData, index, childIndex, tableTd.data)]">
                    <div class="cell">{{ temp(realTableData, index, childIndex, tableTd.data) === 'is-null' ? '' : tableTd.data }}</div>
                  </td>
                  <td v-else>
                    <div class="cell">{{ tableTd.data }}</div>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage2"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="sizes, prev, pager, next"
                :total="1000">
              </el-pagination>
        </div>

      </div>
    </dashboard-box>
  <!-- </div> -->

</template>

<script>
import { injectFilter, formatConfig } from '@/utils/dashboardConfig.js';
import DashboardBox from '@/components/dashboard/DashboardBox';
import DashboardLoading from '@/components/dashboard/DashboardLoading';

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
    DashboardLoading
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
      mTableData: [],
      realTableData: [],
      headTableData: [],
      currentPage2: 1
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
    temp(realTableData, index, childIndex, currentValue) {
      if(realTableData[index-1]) {
        let value = realTableData[index-1][childIndex].data;
        if(currentValue === value) {
          return 'is-null';
        }
      }

      return null;
    },
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


          // 构建表格内容数据
          let realTableData = [];
          const keysLength = keysData[0].length;
          for(let i=0; i<keysData.length; i++) {
            let colArr = [];

            for(let j=0; j<keysLength; j++) {
              colArr[j] = {
                property: 'column-key',
                data: keysData[i][j]
              };
            }

            for(let j=0; j<groupsData.length; j++) {
              for(let k=0; k<valueSeries.length; k++) {
                let obj = {
                  property: 'data',
                  data: newData[groupsData[j].join('-')][valueSeries[k].name][valueSeries[k].aggType][keysData[i].join('-')]
                };
                colArr.push(obj);
              }
            } 

            realTableData[i] = colArr;
          }
          console.log('----------realTableData----------', realTableData)
          this.realTableData = realTableData;

          //构建表头数据
          let headTableData = [];
          const groupsLength = groupsData[0].length;
          for(let i=0; i<groupsLength+1; i++) {
            let colArr = [];

            //填充
            for(let j=0; j<keysLength; j++) {
              if(i === groupsLength) {
                colArr.push({
                  property: 'head-key',
                  data: config.keys[j].alias || config.keys[j].col
                });
              }

              else {
                colArr.push({
                  property: 'head-empty',
                  data: null
                });
              }
            }

            for(let j=0; j<groupsData.length; j++) {
              for(let k=0; k<valueSeries.length; k++) {
                if(i === groupsLength) {
                  colArr.push({
                    property: 'head-key',
                    data: valueSeries[k].name
                  });
                }

                else {
                  // 合并相同 col
                  if(colArr[colArr.length-1] && groupsData[j][i] === colArr[colArr.length-1].data) {
                    colArr[colArr.length-1].colspan = colArr[colArr.length-1].colspan ? colArr[colArr.length-1].colspan+1 : 2;
                  }else {
                    colArr.push({
                      property: 'head-key',
                      data: groupsData[j][i]
                    });
                  }

                }

              }
            }

            headTableData[i] = colArr;
          }

          console.log('----------headTableData----------', headTableData)
          this.headTableData = headTableData;


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
    },
    handleSizeChange() {},
    handleCurrentChange() {},

  }
}

export default options;
</script>

<style scoped>
.box {
  
}
.box .box-body {
  max-height: 800px;
}


.mTable-wrapper {

}
.mTable {
  width: 100%;
  min-width: 900px;
  table-layout: fixed;
  border: 1px solid #ebeef5;
  color: #606266;
}
.mTable .mTable-head {
  background: #f5f7fa;
  font-weight: bold;
}
.mTable .head-empty {
  border: none;
  background-color: transparent;
}
.mTable td,
.mTable th {
  line-height: 23px;
  min-width: 80px;
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: normal;
}
.mTable th {
  background: #f5f7fa;
}
.mTable .cell {
  padding: 0 10px;
}
.is-null {
  border-top: none!important;
}
</style>
