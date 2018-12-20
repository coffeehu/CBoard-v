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
                      :class="['mTable-head', parse2null(realTableData, index, childIndex, tableTd.data)]">
                    <div class="cell">{{ parse2null(realTableData, index, childIndex, tableTd.data) === 'is-null' ? '' : tableTd.data }}</div>
                  </td>
                  <td v-else>
                    <div class="cell">{{ tableTd.data }}</div>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
            <!-- <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage2"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="sizes, prev, pager, next"
              :total="1000">
            </el-pagination> -->
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
    //对于行的表头，用于合并行
    parse2null(realTableData, index, childIndex, currentValue) {
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
      if(this.widgetData.config.values.length === 0) return;
      const format = this.widgetData.config.values[0].format;
      const style = this.style = this.widgetData.config.values[0].style;

      this.loading = true;
      this.$store.dispatch('dashboard/getWidgetData', {widgetData: this.widgetData, filters: this.filters, reload: reload, config: this.widget.widget.data.config})
        .then((seriesData) => {
          let keysData = seriesData.keys;
          let groupsData = seriesData.groups;
          let valueSeries = seriesData.values;
          let newData = seriesData.data;
          let config = this.widget.widget.data.config;

          // 构建表格内容数据
          let realTableData = [];
          const keysLength = keysData[0] ? keysData[0].length : 0;
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
          const groupsLength = groupsData[0] ? groupsData[0].length : 0;
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

          this.loading = false;
        })
        .catch(() => {});
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
