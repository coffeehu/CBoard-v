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
                  <h3 class="box-title" style="font-weight: bold">{{ currentNode.name }}</h3>
                  <i class="pull-right el-icon-delete" @click="delWidget"></i>
                </div>

                <div class="box-body">
                  <!-- Cube 数据源 -->
                  <div class="el-form-item">
                    <label class="el-form-item__label">Cube:</label>
                    <div class="el-form-item__content">
                      <el-select v-model="currentNode.data.datasetId" placeholder="请选择" class="select-axis">
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
                      <el-input v-model="currentNode.categoryName" placeholder="Widget Category"></el-input>
                    </div>
                  </div>

                  <!-- Widget Name -->
                  <div class="el-form-item">
                    <label class="el-form-item__label">Widget Name:</label>
                    <div class="el-form-item__content">
                      <el-input v-model="currentNode.name" placeholder="Widget Name"></el-input>
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
                            <i slot="reference" 
                               :class="[type.class, chartTypesStatus[type.value]?'':'disabled', index===activeTypeIndex?'active':'']" 
                               class="widget-type-item"></i>
                          </el-popover>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Row: 对应 Widget.data.config.keys 的值 -->
                  <div class="el-form-item">
                    <label class="el-form-item__label">Row:</label>
                    <div class="el-form-item__content" style="height: 42px;">
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
                    <div class="el-form-item__content" style="height: 42px;">
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
                  <!-- value -->
                  <div class="el-form-item" v-if="axisValueType === 'normal'">
                    <label class="el-form-item__label">Value:</label>
                    <div class="el-form-item__content" style="height: 42px;">
                      <draggable class="drop-input"
                                 v-model="value[0].cols" 
                                 :options="dragValueOptions"
                                 element="ul">
                        <li v-for="(col, index) in value[0].cols" 
                            :key="col.column"
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

                  <!-- value axis -->
                  <div class="el-form-item" v-if="axisValueType === 'axis'">
                    <label class="el-form-item__label">
                      Value Axis
                      <i class="el-icon-circle-plus" style="cursor:pointer;margin-left:2px;" @click="addValueAxis"></i>
                    </label>
                    <div class="el-form-item__content">

                      <div v-for="(axisValue, index) in value" :key="index">
                        <el-select v-model="axisValue.series_type" :class="['select-axis']">
                          <el-option 
                            v-for="item in valueAxisOption"
                            :label="item"
                            :value="item"
                            :key="item"
                          ></el-option>
                        </el-select>
                        <div class="drop-input drop-input-axis">
                          <draggable
                                 v-model="axisValue.cols" 
                                 :options="dragValueOptions"
                                 element="ul">
                            <li v-for="(col, index) in axisValue.cols" 
                                :key="col.column"
                                @click="removeAxisMeasure(index, axisValue.cols)"
                                class="moveable">
                              <span>
                                <i class="schema-tree-icon blue-icon"></i>
                                {{ col.col || col.column }}
                              </span>
                            </li>
                          </draggable>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div class="el-form-item">
                    <!-- <button @click="save" class="pull-right">save</button> -->
                    <el-button type="primary" @click="save" size="small" class="pull-right" style="margin-right: 10px">Save</el-button>
                    <el-button type="primary" @click="preview" size="small" class="pull-right" style="margin-right: 10px">Preview</el-button>
                  </div>
                </div>

                <!-- 底部面板内容，包含 Preview 等 -->
                <div class="widget-config-tab">
                  <div class="col-md-12">
                    <el-tabs type="border-card">
                      <el-tab-pane label="Preview" >
                        <component
                           v-if="isPreview"
                           :is="currentPreview" 
                           :widget="currentPreviewWidget"
                           :key="currentPreviewWidget.widget.id + currentPreviewWidget.widget.data.chart_type"></component>
                      </el-tab-pane>
                      <el-tab-pane label="Query">Query</el-tab-pane>
                      <el-tab-pane label="Option">
                        <component
                           :is="currentOptionComponent"
                           @apply-option="applyOption"
                           @clear-option="clearOption"></component>
                        <!-- <bar-option @apply-option="applyOption"></bar-option> -->
                      </el-tab-pane>
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
    contrast: {keys: 2, groups: 0, filters: -1, values: 2},
    chinaMap:{keys: 2, groups: -1, filters: -1, values: 2},
    chinaMapBmap:{keys: 2, groups: -1, filters: -1, values: 2},
    relation: {keys: 2, groups: 2, filters: -1, values: 1}
};

const widgetTypeMap = {
  table: 'TableContent',
  line: 'ChartContent',
  pie: 'ChartContent',
  contrast: 'ChartContent',
  kpi: 'KpiContent',
  map: 'MapContent',
  radar: 'RadarContent',
  funnel: 'FunnelContent',
  chinaMap: 'ChinaMapContent'
}

const optionMap = {
  line: 'BarOption',
  pie: 'PieOption',
  radar: 'RadarOption',
  contrast: 'ContrastOption',
  funnel: 'FunnelOption',
  kpi: 'KpiOption',
}

const valueAxisOptionMap = {
  'line': [ 'line', 'bar'],
  'pie': ['pie', 'doughnut', 'coxcomb']
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
    MapContent: () => import('@/components/dashboard/widgets/MapContent'),
    RadarContent: () => import('@/components/dashboard/widgets/RadarContent'), //雷达图
    FunnelContent: () => import('@/components/dashboard/widgets/FunnelContent'), //漏斗图
    ChinaMapContent: () => import('@/components/dashboard/widgets/ChinaMapContent'),
    //---option---
    BarOption: () => import('@/components/config/options/BarOption'),
    PieOption: () => import('@/components/config/options/PieOption'),
    RadarOption: () => import('@/components/config/options/RadarOption'),
    ContrastOption: () => import('@/components/config/options/ContrastOption'),
    FunnelOption: () => import('@/components/config/options/FunnelOption'),
    KpiOption: () => import('@/components/config/options/KpiOption'),
  },
  created() {
    this.$store.dispatch('config/getWidgetList');
    this.$store.dispatch('config/getDatasetList');
  },
  data() {
    return {
      defaultProps: {  // widget 目录配置
        label: 'name'
      },
      currentNode: {}, // 点击 widget 目录，选中的 node（即当前选中的 Widget 对象）
      currentOption: {}, // option-样式配置
      activeTypeIndex: 0, // 当前选中的 Widget Type 索引
      widgetConfigVisible: false, // 配置面板是否显示
      column: [], // Column 的值
      row: [], // Row 的值
      filter: [], // Filter 的值
      value: [], // Value 的值
      isPreview: false, // 是否显示预览
      option: {
        value: {
          orient: ''
        }
      },
      orientOptions: ['horizontal', 'vertical'],
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
                row: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
                column: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
                measure: this.$t('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
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
      if(!this.currentNode.data) return null;
      let datasetId = this.currentNode.data.datasetId;
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
      //过滤 Measure Tree 的数据
      (Measure Tree 不过滤，因为 value 值有时可以重复，如 line+bar 图的情况)
    */
    currentMeasure() {
      let measure = this.currentSchema.measure;

      return measure;
    },
    /*
      根据选中的 widget 数据，
      判断哪些 Widget Type 可选
    */
    chartTypesStatus() {
      if(!this.currentNode.data) {
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

        // 计算 value 的长度
        let length = 0;
        this.value.forEach(v => {
          v.cols.forEach(c => {
            length++;
          });
        });
        tempConfig.values = length;

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
    // 当前选中的 widget 配置数据
    currentWidgetConfig() {
      //this.isPreview = false;
      let config = {};

      // 图表水平or垂直显示，用于 bar 图
      if(this.currentNode.data.config.valueAxis !== undefined) config.valueAxis = this.currentNode.data.config.valueAxis;

      // 设置 widgetType
      let type = this.widgetTypes[this.activeTypeIndex];
      config.chart_type = type.value;

      // 设置 keys（对应 Row 的值）
      config.keys = this.row;

      // 设置 groups（对应 Column 的值）
      config.groups = this.column;

      // 设置 option
      config.option = this.currentOption;

      // 设置 values（对应 value 的值）
      for(let i=this.value.length-1; i>=0; i--) {
        this.value[i].cols.forEach(c => {
          if(!c.aggregate_type) c.aggregate_type = 'sum'; // 必须要有字段 aggregate_type，默认 'sum'
          if(!c.col) c.col = c.column;  //必须要有个 col 字段记录名称，否则返回回的数据 columnList 中对应的 name 为 null
        })
      }

      config.values = this.value;

      console.log('-----config----', config)

      return config;
    },
    // 当前预览的组件名
    currentPreview() {
      let type = this.widgetTypes[this.activeTypeIndex].value;
      console.log(11111, type)
      return widgetTypeMap[type] ? widgetTypeMap[type] : 'ChartContent';
    },
    // 当前预览的组件数据
    currentPreviewWidget() {
      let widget = {
        name: ''
      }

      let widgetData = {
        name: this.currentNode.name,
        categoryName: this.currentNode.categoryName,
        data: this.currentNode.data,
        id: this.currentNode.id
      };
      widgetData.data.config = this.currentWidgetConfig;

      widget.widget = widgetData;

      return widget;
    },
    // value 输入框的类型
    axisValueType() {
      let type = this.widgetTypes[this.activeTypeIndex];
      switch(type.value) {
        case 'line':
        case 'pie':
          return 'axis';
        default:
          return 'normal';
      }
    },
    // 当为 value axis 类型的输入框时，对应下拉框的内容
    valueAxisOption() {
      let type = this.widgetTypes[this.activeTypeIndex];
      return valueAxisOptionMap[type.value];
    },
    currentOptionComponent() {
      let type = this.widgetTypes[this.activeTypeIndex].value;
      return optionMap[type] ? optionMap[type] : '';
    },
    // 拖拽配置
    dragOptions () {
      return  {
        animation: 0,
        group: 'dimensionConfig',
      };
    },
    dragValueOptions () {
      return  {
        animation: 0,
        group: {
          name: 'measureConfig',
        }
      };
    }
  },
  methods: {
    handleNodeClick(node) {
      if(node.children && node.children.length > 0) {
        return;
      }else {
        this.widgetConfigVisible = true;

        this.currentNode = node;
        this.currentOption = node.data.config.option || {};
        this.column = node.data.config.groups;
        this.row = node.data.config.keys;
        this.value = node.data.config.values;

        // 根据图表类型获得索引，根据索引展示 widget type
        let index = this.getIndexByType(node.data.config.chart_type);
        this.activeTypeIndex = index;
        let type = this.widgetTypes[this.activeTypeIndex];
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
      this.currentNode = {
        name: '',
        categoryName: '',
        data: {
          config: {
            
          },
          datasetId: '',
          expressions: [],
          filterGroups: []
        }
      };
      this.currentNode.data.config = {
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

      this.column = this.currentNode.data.config.groups;
      this.row = this.currentNode.data.config.keys;
      //this.value = this.currentNode.data.config.values;
      this.value = [{
        cols: [],
        name: '',
        series_type: ''
      }]
    },
    handleTypeClick(type, index) {
      let typeValue = type.value;
      if(!this.chartTypesStatus[typeValue]) {
        return false;
      }
      this.activeTypeIndex = index;

      // value axis 切换到 value 时，currentValue 数据格式的处理
      if(this.axisValueType === 'normal') {
        for(let i=this.value.length-1; i>=0; i--) {
          let item = this.value[i];
          if(i>0) {
            this.value[0].cols = this.value[0].cols.concat(item.cols);
            this.value.splice(i, 1);
          }
        }
      }

      /*
        切换 widgetType，碰到有 Value Axis 的表单时，初始化下拉框的默认值
      */
      this.value.forEach(v => {
        if(this.valueAxisOption) {
          let inArr = false;
          this.valueAxisOption.forEach(option => {
            if(option === v.series_type) inArr = true;
          })
          if(!inArr) v.series_type = this.valueAxisOption[0];
        }
      })

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
          id: this.currentNode.id
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
      this.value[0].cols.splice(index, 1);
    },
    removeAxisMeasure(index, data) {
      data.splice(index, 1);
    },
    addValueAxis() {
      if(this.value.length >= this.valueAxisOption.length) return;
      let valueAxisItem = {
        cols: [],
        name: '',
        series_type: this.valueAxisOption[0]
      }
      this.value.push(valueAxisItem);
    },
    save() {
      if(!this.currentNode.data.datasetId) return;  //防止未选择 Cube 就提交

      let widgetData = {
        name: this.currentNode.name,
        categoryName: this.currentNode.categoryName,
        data: this.currentNode.data,
        id: this.currentNode.id
      };
      widgetData.data.config = this.currentWidgetConfig; 
      if(widgetData.categoryName === '') widgetData.categoryName = 'Default Category';
      if(widgetData.data.datasetId === '') widgetData.data.datasetId = this.currentDataset.id;
      
      let url;
      if(widgetData.id) { //更新
        url = this.$api.updateWidget;
      }else { //新增
        url = this.$api.saveNewWidget;
      }

      // values 的成员中，cols 没有值则删去该 values 成员
      let values = widgetData.data.config.values;
      for(let i=values.length-1; i>=0; i--) {
        if(values[i].cols.length === 0) values.splice(i, 1);
      }

      let params = {
        json: JSON.stringify(widgetData)
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
    },
    preview() {
      this.isPreview = !this.isPreview;
    },
    applyOption(option) {
      for(let prop in option) {
        //this.currentOption[prop] = option[prop];
        if(!this.currentOption[prop]) this.currentOption[prop] = {};
        if(typeof option[prop] === 'object') {
          for(let p in option[prop]) {
            if(option[prop][p] !== '') this.currentOption[prop][p] = option[prop][p];
          }
        }
      }
      this.$message({
          type: 'success',
          message: '应用成功！可切换到预览查看'
      });
    },
    clearOption(option) {
      for(let prop in option) {
        this.currentOption[prop] = option[prop];
      }
      this.$message({
          type: 'success',
          message: '清除成功！可切换到预览查看'
      });
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
.drop-input-axis {
  display: block;
  overflow: hidden;
  width: auto;
}
.drop-input-axis ul {
  height: 100%;
  margin: 0;
  padding: 0;
}
.select-axis {
  float: left;
  width: 150px;
}

.widget-config-tab .el-tabs {
  box-shadow: none;
  border: none;
  border-top: 1px solid #dcdfe6;
}

</style>
