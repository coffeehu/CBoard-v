<template>
    <div class="content">
       <div class="row">
       	
       		<!-- 目录面板 -->
            <div class="col-md-3">
                <div class="box box-solid">
                    <div class="box-header with-border">
                        <i class="fa fa-dashboard"></i><h3 class="box-title">Widget</h3>
                        <div class="box-tools pull-right">
                            <i class="el-icon-circle-plus-outline" @click="addWidget"></i>
                        </div>
                    </div>
                    <div class="panel-body">
                        <el-tree 
                          :data="treeData" 
                          :props="defaultProps"
                          @node-click="handleNodeClick"></el-tree>
                    </div>
                </div>

                <div class="box box-solid">
                    <div class="box-header with-border">
                        <i class="fa fa-cube"></i><h3 class="box-title">Cube</h3>
                        <div class="box-tools pull-right">
                            
                        </div>
                    </div>
                    <div class="panel-body">
                        <!-- <el-tree 
                          ng-show="false"
                          :data="cubeTreeData" 
                          draggable
                          :allow-drag="isAllowDrag"
                          @node-drag-start="handleTreeDragStart"></el-tree> -->
                          <dimension-tree v-if="currentSchema.dimension" :treeData="currentDimension"></dimension-tree>
                          <measure-tree v-if="currentSchema.measure" :treeData="currentMeasure"></measure-tree>
                    </div>
                </div>
            </div>
            <!-- 目录面板 END -->


            <!-- 配置面板 -->
            <div class="col-md-9" v-if="widgetConfigVisible">
              <div class="box">
                <div class="box-header with-border">
                  <h3 class="box-title" style="font-weight: bold">{{ currentWidget.name }}</h3>
                  <i class="pull-right el-icon-delete" @click="delWidget"></i>
                </div>

  	            <div class="box-body">
                  <!-- Cube 数据源 -->
                  <div class="el-form-item">
                  	<label class="el-form-item__label">Cube:</label>
                  	<div class="el-form-item__content">
                      <el-select v-model="currentWidget.data.datasetId" placeholder="请选择">
                        <el-option
                        v-for="item in datasetList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                      </el-select>
                  	</div>
                  </div>

                  <!-- Category Name -->
                  <div class="el-form-item">
                    <label class="el-form-item__label">Widget Category:</label>
                    <div class="el-form-item__content">
                      <el-input v-model="currentWidget.categoryName" placeholder="Widget Category"></el-input>
                    </div>
                  </div>

                  <!-- Widget Name -->
                	<div class="el-form-item">
                    <label class="el-form-item__label">Widget Name:</label>
                    <div class="el-form-item__content">
                      <el-input v-model="currentWidget.name" placeholder="Widget Name"></el-input>
                    </div>
                	</div>

                  <!-- Widget Type -->
                  <div class="el-form-item">
                    <label class="el-form-item__label">Widget Type:</label>
                    <div class="el-form-item__content">
                      <ul class="widget-type-list">
                        <li v-for="(type, index) in widgetTypes" @click.prevent="handleTypeClick(type, index)">
                          <el-popover
                            placement="bottom"
                            trigger="hover">
                          	<div>
                          		<p><b>{{ type.row }} {{ $t('CONFIG.WIDGET.TIPS_ROW_DIM') }}</b></p>
                          		<p><b>{{ type.column }} {{ $t('CONFIG.WIDGET.TIPS_COLUMN_DIM') }}</b></p>
                          		<p><b>{{ type.measure }} {{ $t('CONFIG.WIDGET.TIPS_MEASURE') }}</b></p>
                          	</div>
                            <i slot="reference" :class="[type.class, chartTypesStatus[type.value]?'':'disabled', index===activeTypeIndex?'active':'']" class="widget-type-item"></i>
                          </el-popover>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Row: 对应 Widget.data.config.keys 的值 -->
                  <div class="el-form-item">
                    <label class="el-form-item__label">Row:</label>
                    <div class="el-form-item__content">
                      <draggable class="drop-input"
                                     v-model="row" 
                                     :options="dragOptions" 
                                     element="ul">
                        <li v-for="(col, index) in row" 
                            :key="col.id"
                            @click="removeDimension(index, 'row')"
                            class="moveable">
                          <span>
                            <i class="schema-tree-icon blue-icon"></i>
                            {{ col.alias || col.column || col.col }}
                          </span>
                        </li>
                      </draggable>
                    </div>
                  </div>

                  <!-- Column: 对应 Widget.data.config.groups 的值 -->
                  <div class="el-form-item">
                    <label class="el-form-item__label">Column:</label>
                    <div class="el-form-item__content">
                        <draggable class="drop-input"
                                   v-model="column" 
                                   :options="dragOptions" 
                                   element="ul">
                          <li v-for="(col, index) in column" 
                              :key="col.id"
                              @click="removeDimension(index, 'col')"
                              class="moveable">
                            <span>
                              <i class="schema-tree-icon blue-icon"></i>
                              {{ col.alias || col.column || col.col }}
                            </span>
                          </li>
                        </draggable>
                    </div>
                  </div>

                  <!-- Filter -->
                  <div class="el-form-item">
                    <label class="el-form-item__label">Filter:</label>
                    <div class="el-form-item__content">
                      <!-- <draggable class="drop-input"
                                 v-model="filter" 
                                 :options="dragOptions" 
                                 element="ul">
                        <li v-for="(col, index) in filter" :key="col.id" class="moveable">
                          <span>
                            <i class="schema-tree-icon blue-icon"></i>
                            {{ col.alias || col.column || col.col }}
                          </span>
                        </li>
                      </draggable> -->
                    </div>
                  </div>

                  <!-- Value: 对应 Widget.data.config.values 的值 -->
                  <div class="el-form-item">
                    <label class="el-form-item__label">Value:</label>
                    <div class="el-form-item__content">
                      <draggable class="drop-input"
                                 v-model="value"
                                 :options="dragValueOptions"
                                 element="ul">
                        <li v-for="(col, index) in value" 
                            :key="col.col"
                            @click="removeMeasure(index)"
                            class="moveable">
                          <span>
                            <i class="schema-tree-icon blue-icon"></i>
                            {{ col.col || col.column }}
                          </span>
                        </li>
                      </draggable>
                    </div>
                  </div>

                  <div class="el-form-item">
                  	<!-- <button @click="save" class="pull-right">save</button> -->
                    <el-button type="primary" @click="save" size="small" class="pull-right" style="margin-right: 10px">Save</el-button>
                  </div>
  	            </div>

                <!-- 底部面板内容，包含 Preview 等 -->
                <div class="widget-config-tab">
                  <div class="col-md-12">
                    <el-tabs type="border-card">
                      <el-tab-pane label="Preview" >
                        <component
                           :is="currentPreview" 
                           :widget="currentPreviewWidget"
                           :key="currentPreviewWidget.widget.id+currentPreviewWidget.widget.data.chart_type"></component>
                      </el-tab-pane>
                      <el-tab-pane label="Query" >Query</el-tab-pane>
                      <el-tab-pane label="Option" >Option</el-tab-pane>
                    </el-tabs>
                  </div>
                </div>
                
            	</div>
            </div>
            <!-- 配置面板 END -->

       </div>
    </div>
</template>

<script>
 /***************************************
 Widget Type 对应的规则
 *  0:  None items
 *  1:  only 1 item
 * -1:  None Restrict
 *  2:  1 or more
 ***************************************/
const configRule = {
    line: {keys: 2, groups: -1, filters: -1, values: 2},
    pie: {keys: 2, groups: -1, filters: -1, values: 2},
    kpi: {keys: 0, groups: 0, filters: -1, values: 1},
    table: {keys: -1, groups: -1, filters: -1, values: -1},
    funnel: {keys: -1, groups: 0, filters: -1, values: 2},
    sankey: {keys: 2, groups: 2, filters: -1, values: 1},
    radar: {keys: 2, groups: -1, filters: -1, values: 2},
    map: {keys: 2, groups: -1, filters: -1, values: 2},
    scatter: {keys: 2, groups: -1, filters: -1, values: 2},
    gauge: {keys: 0, groups: 0, filters: -1, values: 1},
    wordCloud: {keys: 2, groups: 0, filters: -1, values: 1},
    treeMap: {keys: 2, groups: 0, filters: -1, values: 1},
    areaMap: {keys: 2, groups: -1, filters: -1, values: 1},
    heatMapCalendar: {keys: 1, groups: 0, filters: -1, values: 1},
    heatMapTable: {keys: 2, groups: 2, filters: -1, values: 1},
    liquidFill: {keys: 0, groups: 0, filters: -1, values: 1},
    contrast: {keys: 1, groups: 0, filters: -1, values: 2},
    chinaMap:{keys: 2, groups: -1, filters: -1, values: 2},
    chinaMapBmap:{keys: 2, groups: -1, filters: -1, values: 2},
    relation: {keys: 2, groups: 2, filters: -1, values: 1}
};

const widgetTypeMap = {
  table: 'TableContent',
  line: 'ChartContent',
  pie: 'ChartContent',
  kpi: 'KpiContent',
  map: 'MapContent'
}

export default {
  name: 'WidgetConfig',
  components: {
    DimensionTree: () => import('@/components/widgetConfig/DimensionTree.vue'),
    MeasureTree: () => import('@/components/widgetConfig/MeasureTree.vue'),
    draggable: () => import('vuedraggable'),
    KpiContent: () => import('@/components/dashboard/widgets/KpiContent'),
    ChartContent: () => import('@/components/dashboard/widgets/ChartContent'),
    TableContent: () => import('@/components/dashboard/widgets/TableContent'),
    MapContent: () => import('@/components/dashboard/widgets/MapContent')
  },
  created() {
  	this.$store.dispatch('config/getWidgetList');
  	this.$store.dispatch('config/getDatasetList');
  },
  beforeRouteUpdate(to, from, next) {
  	let id = to.query.id;
  	next();
  },
  data() {
  	return {
  		defaultProps: {
  			label: 'name'
  		},
  		dataSource: '',
  		widgetCategory: '',
  		widgetName: '',
  		currentWidget: {}, //当前选中的 Widget 对象
      activeTypeIndex: 0, // 当前选中的 Widget Type 索引
      widgetConfigVisible: false,
      column: [], // Column 的值
      row: [], // Row 的值
      filter: [],
      value: [],
      values: [],
      widget: {},
  		// widget Type 列表
  		widgetTypes: [
            {
                name: this.$t('CONFIG.WIDGET.TABLE'), value: 'table', class: 'cTable',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE')
            },
            {
                name: this.$t('CONFIG.WIDGET.LINE_BAR'), value: 'line', class: 'cLine',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            },
            {
                name: this.$t('CONFIG.WIDGET.CONTRAST'), value: 'contrast', class: 'cContrast',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_2')
            },
            {
                name: this.$t('CONFIG.WIDGET.SCATTER'), value: 'scatter', class: 'cScatter',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            },
            {
                name: this.$t('CONFIG.WIDGET.PIE'), value: 'pie', class: 'cPie',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            },
            {
                name: this.$t('CONFIG.WIDGET.KPI'), value: 'kpi', class: 'cKpi',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            },
            {
                name: this.$t('CONFIG.WIDGET.FUNNEL'), value: 'funnel', class: 'cFunnel',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            },
            {
                name: this.$t('CONFIG.WIDGET.SANKEY'), value: 'sankey', class: 'cSankey',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            },
            {
                name: this.$t('CONFIG.WIDGET.RADAR'), value: 'radar', class: 'cRadar',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            },
            {
                name: this.$t('CONFIG.WIDGET.MAP'), value: 'map', class: 'cMap',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            },
            {
                name: this.$t('CONFIG.WIDGET.GAUGE'), value: 'gauge', class: 'cGauge',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            },
            {
                name: this.$t('CONFIG.WIDGET.WORD_CLOUD'), value: 'wordCloud', class: 'cWordCloud',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            },
            {
                name: this.$t('CONFIG.WIDGET.TREE_MAP'), value: 'treeMap', class: 'cTreeMap',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            },
            {
                name: this.$t('CONFIG.WIDGET.HEAT_MAP_CALENDER'), value: 'heatMapCalendar', class: 'cHeatMapCalendar',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            },
            {
                name: this.$t('CONFIG.WIDGET.HEAT_MAP_TABLE'), value: 'heatMapTable', class: 'cHeatMapTable',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            },
            {
                name: this.$t('CONFIG.WIDGET.LIQUID_FILL'), value: 'liquidFill', class: 'cLiquidFill',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            },
            {
                name: this.$t('CONFIG.WIDGET.AREA_MAP'), value: 'areaMap', class: 'cAreaMap',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            },
            {
                name: this.$t('CONFIG.WIDGET.CHINA_MAP'), value: 'chinaMap', class: 'cChinaMap',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            },
            {
                name: this.$t('CONFIG.WIDGET.CHINA_MAP_BMAP'), value: 'chinaMapBmap', class: 'cChinaMapBmap',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
            },
            {
                name: this.$t('CONFIG.WIDGET.RELATION'), value: 'relation', class: 'cRelation',
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_2'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_2'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1')
            }
        ],
        //用于判断哪些 Widget Type 可选（Base值）
        baseChartTypesStatus: {
  		    "line": true, "pie": true, "kpi": true, "table": true,
  		    "funnel": true, "sankey": true, "radar": true, "map": true,
  		    "scatter": true, "gauge": true, "wordCloud": true, "treeMap": true,
  		    "heatMapCalendar": true, "heatMapTable": true, "liquidFill": true,
  		    "areaMap": true, "contrast": true,"chinaMap":true,"chinaMapBmap":true,"relation":true
  		  }
  	}
  },
  watch: {
    column() {
      this.currentWidget.data.config.groups = this.column;
    },
    row() {
      this.currentWidget.data.config.keys = this.row;
    }
  },
  computed: {
  	widgetList() {
      return this.$store.state.config.widgetList;
    },
    datasetList() {
      return this.$store.state.config.datasetList;
    },
    /*
      将 widgetList 转换成 Widget el-tree 需要的数据格式
    */
    treeData() {
    	let widgetList = this.widgetList;
    	let treeData = [];
    	for(let i=0,l=widgetList.length; i<l; i++) {
    		let widget = widgetList[i];
    		addToTree(widget.categoryName, widget)
    	}

    	function addToTree(categoryName, widget) {
    		let nameArr = categoryName.split('/');
    		let name;
    		let i = 0;
    		let arr = treeData;
    		while( i < nameArr.length ) {
    			name = nameArr[i];
    			let result = existInArr(name, arr);
    			if(result) {
    				arr = result.children;
    				if(i === nameArr.length - 1) {
    					result.children.push(widget);
    				}
	    		}else {
	    			let treeItem = { name: name, children: [] };
	    			arr.push(treeItem);
	    			arr = treeItem.children;
	    			if(i === nameArr.length - 1) {
	    				treeItem.children.push(widget);
    				}
	    		}
	    		i++;
    		}
    	}

    	function existInArr(name, arr) {
    		for(let i=0,l=arr.length; i<l; i++) {
    			if(arr[i].name === name) {
    				return arr[i];
    			}
    		}
    		return false;
    	}

    	return treeData;
    },
    /*
      根据当前选中的 widget 的 datasetId，找到对应的 dataset 数据
    */
    currentDataset() {
      if(!this.currentWidget.data) return null;
      let datasetId = this.currentWidget.data.datasetId;
      let dataset;
      for(let i=0,l=this.datasetList.length; i<l; i++) {
        if(this.datasetList[i].id === datasetId) {
          dataset = this.datasetList[i];
          break;
        }
      }
      return dataset;
    },
    currentSchema() {
      if(!this.currentDataset) return [];
      return this.currentDataset.data.schema;
    },
    /*
      过滤 Dimension Tree 的数据
    */
    currentDimension() {
      // 当前 Widget 的 Column、Row 框中已有的 dimension 数据
      //let currentArray = this.currentWidget.data.config.groups.concat(this.currentWidget.data.config.keys);
      let currentArray = this.column.concat(this.row);
      // 所有的 dimension 数据
      let dimension = this.currentSchema.dimension;
      // 过滤后的 dimension 数据
      let currentDimension = [];

      for(let i=0,l=dimension.length; i<l; i++) {
        let item = copyObj(dimension[i]);
        if( !inCurrentArray(item) ) currentDimension.push(item);

        if(dimension[i].columns) {
          item.columns = [];
          let columns = dimension[i].columns;
          for(let j=0,len=columns.length; j<len; j++) {
            if( !inCurrentArray(columns[j]) ) {
              let o = copyObj(columns[j]);

              if(item.type === 'level') { // 设置 level 字段
                o.level = item.alias; 
              }

              // 设置一些必须字段的默认值
              o.col = o.column;
              o.type = 'eq';
              o.values = [];
              o.sort = 'asc';

              item.columns.push(o);
            }
          }
        }
      }

      function copyObj(obj) {
        let newObj = {};
        for(let p in obj) {
          newObj[p] = obj[p];
        }
        return newObj;
      }

      function inCurrentArray(obj) {
        for(let i=0,l=currentArray.length; i<l; i++) {
          if(currentArray[i].id === obj.id) {
            return true;
          }
        }
        return false;
      }

      return currentDimension;
    },
    /*
      过滤 Measure Tree 的数据
    */
    currentMeasure() {
      let currentArray = this.value;
      let measure = this.currentSchema.measure;
      let currentMeasure = [];

      for(let i=0,l=measure.length; i<l; i++) {
        let item = copyObj(measure[i]);
        if( !inCurrentArray(item) ) currentMeasure.push(item);
      }

      function copyObj(obj) {
        let newObj = {};
        for(let p in obj) {
          newObj[p] = obj[p];
        }
        return newObj;
      }

      function inCurrentArray(obj) {
        for(let i=0,l=currentArray.length; i<l; i++) {
          if(currentArray[i].col === obj.column) {
            return true;
          }
        }
        return false;
      }

      return currentMeasure;
    },
    /*
    	根据选中的 widget 数据，
    	判断哪些 Widget Type 可选
    */
    chartTypesStatus() {
    	if(!this.currentWidget.data) {
    		return {};
    	}
    	let result;
	  	let tempConfig = {
	  		keys: this.row.length,
	  		groups: this.column.length,
	  		values: 0
	  	}
	  	for(let type in this.baseChartTypesStatus) {
	  		let rule = configRule[type];

	  		let flattenValues = [];
        flattenValues = flattenValues.concat(this.value);
        tempConfig.values = flattenValues.length;

      	for(let p in rule) {
      		if(rule[p] === 2) {
      			result = (tempConfig[p] >= 1);
      		}else if(rule[p] === -1) {
      			result = true;
      		}else {
      			result = (rule[p] === tempConfig[p]);
      		}
      		if(!result) break;
      	}

	      this.baseChartTypesStatus[type] = result;
	  	}

	  	return this.baseChartTypesStatus;
    },
    currentPreview() {
      let type = this.widgetTypes[this.activeTypeIndex].value;
      return widgetTypeMap[type] ? widgetTypeMap[type] : 'ChartContent';
    },
    currentPreviewWidget() {
      let widget = {
        name: ''
      }
      widget.widget = this.currentWidget;
      return widget;
    },
    dragOptions () {
      return  {
        animation: 0,
        group: 'dimensionConfig',
      };
    },
    dragValueOptions () {
      return  {
        animation: 0,
        group: 'measureConfig',
      };
    }
  },
  methods: {
  	handleNodeClick(node) {
  		if(node.children && node.children.length > 0) {
  			return;
  		}else {
        console.log('-----node-------', node)
        this.column = node.data.config.groups;
        this.row = node.data.config.keys;
        this.values = node.data.config.values; 
        this.value = node.data.config.values[0].cols;
  			this.widgetConfigVisible = true;
  			this.currentWidget = node;
        let index = this.getIndexByType(node.data.config.chart_type);
        this.activeTypeIndex = index;
  			this.$router.push({ path: '/config/widget', query: { id: node.id }});
  		}
  	},
    getIndexByType(type) {
      for(let i=0,l=this.widgetTypes.length; i<l; i++) {
        if(this.widgetTypes[i].value === type) {
          return i;
        }
      }
      return 0;
    },
  	addWidget() {
      this.widgetConfigVisible = true;
      this.activeTypeIndex = 0;
  		this.currentWidget = {
  			name: '',
  			categoryName: '',
  			data: {
          config: {},
          datasetId: '',
          expressions: [],
          filterGroups: []
        }
  		};
  		this.currentWidget.data.config = {
    			"option": {},
    			"chart_type": "",
    			"keys": [],
    			"groups": [],
    			"values": [{
    				"name": "",
    				"cols": []
    			}],
    			"filters": []
  		}
  	},
    handleTypeClick(type, index) {
      let value = type.value;
      if(!this.chartTypesStatus[value]) {
        return false;
      }
      this.activeTypeIndex = index;
      this.createCurrentWidget();
    },
    delWidget() {
      this.$confirm('是否删除该 Widget?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        customClass: 'preview-config-modal'
      }).then(() => {
        let params = {
          id: this.currentWidget.id
        }
        this.$req.post(this.$api.deleteWidget, params)
          .then(response => {
            if(response.statusText === 'OK') {
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              });
              this.widgetConfigVisible = false;
              this.$store.dispatch('config/getWidgetList');
            }
          })
          .catch(error => {})
      }).catch(() => {
                
      });
    },
    removeDimension(index, type) {
      if(type === 'col') {
        this.column.splice(index, 1);
      }else if(type === 'row') {
        this.row.splice(index, 1);
      }
    },
    removeMeasure(index) {
      this.value.splice(index, 1);
    },
    createCurrentWidget() {
      // 设置 widgetType
      let type = this.widgetTypes[this.activeTypeIndex];
      this.currentWidget.data.config.chart_type = type.value;

      // 设置 keys（对应 Row 的值）
      this.currentWidget.data.config.keys = this.row;

      // 设置 groups（对应 Column 的值）
      this.currentWidget.data.config.groups = this.column;

      // 设置 values（对应 value 的值）
      this.value.forEach(v => {
        if(!v.aggregate_type) v.aggregate_type = 'sum';
      })
      this.currentWidget.data.config.values[0].cols = this.value;
      if(this.currentWidget.data.config.values[0].series_type) {
        this.currentWidget.data.config.values[0].series_type = type.value;
      }
    },
  	save() {
      
      if(!this.currentWidget.data.datasetId) return;  //防止未选择 Cube 就提交

      if(!this.categoryName) { // 给 categoryName 设置默认值
        this.currentWidget.categoryName = 'Default Category';
      }

      this.createCurrentWidget();
      
      let url;
      if(this.currentWidget.id) { //更新
        url = this.$api.updateWidget;
      }else { //新增
        url = this.$api.saveNewWidget;
      }

      let params = {
        json: JSON.stringify(this.currentWidget)
      }
      this.$req.post(url, params)
        .then(response => {
          if(response.statusText === 'OK') {
            this.$message({
                type: 'success',
                message: '保存成功!'
            });
            this.$store.dispatch('config/getWidgetList');
          }
        })
        .catch(error => {

        })
  	}
  }
}
</script>

<style scoped>
.box-header > .box-tools {
    top: 11px!important;
}
.box-primary .box-header > .box-tools {
    top: 5px!important;
}
.panel-body {
    padding: 10px 20px;
}
.box-tools > i {
	font-size: 18px;
	font-weight: bold;
	cursor: pointer;
}
.box-header .el-icon-delete {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
/*表单样式*/
.el-form-item__label {
	font-weight: bold;
	width: 130px;
}
.el-form-item__content {
	overflow: hidden;
}

.widget-type-list {
	padding: 0;
	margin: 0;
}
.widget-type-list > li {
	display: inline-block;
	padding-right: 5px;
	padding-left: 5px;
}
.widget-type-list > li .widget-type-item {
	display: block;
	width: 40px;
	height: 40px;
	cursor: pointer;
}
.widget-type-list > li .widget-type-item.active {
	border: 1px solid #97b6f7;
}
li:focus,
i:focus,
span:focus {
  outline: none;
}
/*######### Widget Type Icon 样式 ##############*/
.cLine{  background-image: url(../../assets/imgs/widgets/line-active.png);  }
.cLine.disabled{background-image: url(../../assets/imgs/widgets/line.png);}
.cContrast{  background-image: url(../../assets/imgs/widgets/contrast-active.png);  }
.cContrast.disabled{background-image: url(../../assets/imgs/widgets/contrast.png); }
/*.cBar{  background-image: url(../imgs/bar-active.png);  }*/
/*.cBar.disabled{background-image: url(../imgs/bar.png);  }*/
.cScatter{  background-image: url(../../assets/imgs/widgets/scatter-active.png);  }
.cScatter.disabled{  background-image: url(../../assets/imgs/widgets/scatter.png);  }
.cPie{  background-image: url(../../assets/imgs/widgets/pie-active.png);  }
.cPie.disabled{  background-image: url(../../assets/imgs/widgets/pie.png);  }
.cFunnel{  background-image: url(../../assets/imgs/widgets/funnel-active.png);  }
.cFunnel.disabled{  background-image: url(../../assets/imgs/widgets/funnel.png);  }

.cKpi{  background-image: url(../../assets/imgs/widgets/kpi-active.png);  }
.cKpi.disabled{  background-image: url(../../assets/imgs/widgets/kpi.png);  }
.cSankey{  background-image: url(../../assets/imgs/widgets/sankey-active.png);  }
.cSankey.disabled{  background-image: url(../../assets/imgs/widgets/sankey.png);  }
.cRadar{  background-image: url(../../assets/imgs/widgets/radar-active.png);  }
.cRadar.disabled{  background-image: url(../../assets/imgs/widgets/radar.png);  }
.cTable{  background-image: url(../../assets/imgs/widgets/table-active.png);  }
.cTable.disabled{  background-image: url(../../assets/imgs/widgets/table.png);  }
.cMap{  background-image: url(../../assets/imgs/widgets/map-active.png);  }
.cMap.disabled{  background-image: url(../../assets/imgs/widgets/map.png);  }
.cGauge{ background-image: url(../../assets/imgs/widgets/gauge-active.png); }
.cGauge.disabled{ background-image: url(../../assets/imgs/widgets/gauge.png); }
.cWordCloud{ background-image: url(../../assets/imgs/widgets/wordCloud-active.png); }
.cWordCloud.disabled{ background-image: url(../../assets/imgs/widgets/wordCloud.png); }
.cTreeMap{ background-image: url(../../assets/imgs/widgets/treeMap-active.png); }
.cTreeMap.disabled{ background-image: url(../../assets/imgs/widgets/treeMap.png); }
.cAreaMap{ background-image: url(../../assets/imgs/widgets/areaMap-active.png);}
.cAreaMap.disabled{ background-image: url(../../assets/imgs/widgets/areaMap.png);}
.cHeatMapCalendar{ background-image: url(../../assets/imgs/widgets/heatMapCalendar-active.png); }
.cHeatMapCalendar.disabled{ background-image: url(../../assets/imgs/widgets/heatMapCalendar.png); }
.cHeatMapTable{ background-image: url(../../assets/imgs/widgets/heatMapTable-active.png); }
.cHeatMapTable.disabled{ background-image: url(../../assets/imgs/widgets/heatMapTable.png); }
.cLiquidFill{ background-image: url(../../assets/imgs/widgets/liquidFill-active.png); }
.cLiquidFill.disabled{ background-image: url(../../assets/imgs/widgets/liquidFill.png); }
.cChinaMap{ background-image: url(../../assets/imgs/widgets/chinaMap-active.png); }
.cChinaMap.disabled{ background-image: url(../../assets/imgs/widgets/chinaMap.png); }
.cChinaMapBmap{ background-image: url(../../assets/imgs/widgets/chinaMapBmap-active.png); }
.cChinaMapBmap.disabled{ background-image: url(../../assets/imgs/widgets/chinaMapBmap.png); }
.cRelation{ background-image: url(../../assets/imgs/widgets/relation-active.png); }
.cRelation.disabled{ background-image: url(../../assets/imgs/widgets/relation.png); }

.el-form-item {
  margin-bottom: 5px;
}
.drop-input {
  display: inline-block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin: 0;
  padding: 0 10px;
  box-sizing: border-box;
}
.drop-input.active {
  border-color: #3c8dbc;
}

.drop-input li {
  display: inline-block;
  height: 28px;
  line-height: 28px;
  margin: 0 5px;
  padding: 0 8px;
  border: 1px solid #d9e3ec;
  border-radius: 2px;
  list-style-type: none;
  box-sizing: border-box;
  background-color: #fbfcfd;
  cursor: pointer;
}

.widget-config-tab .el-tabs {
  box-shadow: none;
  border: none;
  border-top: 1px solid #dcdfe6;
}
</style>
