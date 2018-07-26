<template>
  <base-box :name="widget.name">
    <div class="box-body" ref="table-body" :style="boxHeight" style="padding: 5px 20px 20px 20px;overflow-y: auto">

      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <data-table :columnList="columnList"></data-table>
      </el-table>   

    </div>
  </base-box>
</template>

<script>
import req from '@/utils/http/request';
import api from '@/utils/http/api';
import { injectFilter, formatConfig } from '@/utils/dashboardConfig.js';
import BaseBox from '@/components/BaseBox';

const DataTable = {
  name: 'DataTable',
  props: ['columnList'],
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

export default {
  name: 'TableContent',
  props: {
    widget: {
      type: Object,
      required: true
    },
    height: {
      type: String
    }
  },
  components: {
    BaseBox,
    DataTable
  },
  mounted() {
  	//console.log('-------KpiContent, this.data-----------', this.widget);
  	const widgetData = this.widget.widget.data;
  	const format = widgetData.config.values[0].format;
  	const style = this.style = widgetData.config.values[0].style;

  	injectFilter(widgetData);
  	const config = formatConfig(widgetData.config);
  	const params = {
  		datasourceId: widgetData.datasource,
        query: JSON.stringify(widgetData.query),
        datasetId: widgetData.datasetId,
        cfg: JSON.stringify(config),
        reload: false
  	};

  	req.post(api.getAggregateData, params)
  		.then(response => {
  			if(response.statusText === 'OK') {
          const columnList = this.columnList = response.data.columnList;
          const mTableData = this.mTableData = response.data.data;
          this.tableData = this.formatTableData(columnList, mTableData);
  				this.$emit('load-complete');
  			}
  		})
  		.catch(error => {

  		})
  },
  data() {
  	return {
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
    }

  }
}
</script>

<style scoped>

</style>
