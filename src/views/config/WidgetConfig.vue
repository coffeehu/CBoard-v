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
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                    <div class="panel-body">
                        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" @node-contextmenu="handleContextmenu"></el-tree>
                    </div>
                </div>
            </div>

            <div class="col-md-9" v-if="widgetConfigVisible">
            	<div class="box">
            		<div class="box-header with-border">
	                    <h3 class="box-title" style="font-weight: bold">{{ name }}</h3>
	                </div>
	                <div class="box-body">
	                	<div class="el-form-item">
	                		<label class="el-form-item__label">Cube:</label>
	                		<div class="el-form-item__content">
								<el-select v-model="currentWidget.datasetId" placeholder="请选择">
									<el-option
									  v-for="item in datasetList"
									  :key="item.id"
									  :label="item.name"
									  :value="item.id">
									</el-option>
								</el-select>
	                		</div>
	                	</div>

	                	<div class="el-form-item">
	                		<label class="el-form-item__label">Widget Category:</label>
	                		<div class="el-form-item__content">
								<el-input v-model="currentWidget.categoryName" placeholder="Widget Category"></el-input>
	                		</div>
	                	</div>

	                	<div class="el-form-item">
	                		<label class="el-form-item__label">Widget Name:</label>
	                		<div class="el-form-item__content">
								<el-input v-model="currentWidget.name" placeholder="Widget Name"></el-input>
	                		</div>
	                	</div>

	                	<div class="el-form-item">
	                		<label class="el-form-item__label">Widget Type:</label>
	                		<div class="el-form-item__content">
								<ul class="widget-type-list">
									<li v-for="type in widgetTypes">
										<el-popover
										  placement="bottom"
										  trigger="hover">
										  	<div>
										  		<p><b>{{ type.row }} {{ $t('CONFIG.WIDGET.TIPS_ROW_DIM') }}</b></p>
										  		<p><b>{{ type.column }} {{ $t('CONFIG.WIDGET.TIPS_COLUMN_DIM') }}</b></p>
										  		<p><b>{{ type.measure }} {{ $t('CONFIG.WIDGET.TIPS_MEASURE') }}</b></p>
										  	</div>
											<span slot="reference" :class="[type.class, chartTypesStatus[type.value]?'':'disabled']" class="widget-type-item"></span>
										</el-popover>
									</li>
								</ul>
	                		</div>
	                	</div>

	                	<div class="el-form-item">
	                		<button @click="save">save</button>
	                	</div>


	                </div>
            	</div>
            </div>

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

export default {
  name: 'WidgetConfig',
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
  		name: 'name',
  		defaultProps: {
  			label: 'name'
  		},
  		dataSource: '',
  		widgetCategory: '',
  		widgetName: '',
  		currentWidget: {},
  		widgetConfigVisible: false,
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
  computed: {
  	widgetList() {
      return this.$store.state.config.widgetList;
    },
    datasetList() {
      return this.$store.state.config.datasetList;
    },
    /*将 widgetList 转换成 el-tree 需要的数据格式*/
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
    	根据选中的 widget 数据，
    	判断哪些 Widget Type 可选
    */
    chartTypesStatus() {
    	if(!this.currentWidget.data) {
    		return {};
    	}
    	let result;
	  	let config = this.currentWidget.data.config;
	  	let tempConfig = {
	  		keys: config.keys.length,
	  		groups: config.groups.length,
	  		values: 0
	  	}
	  	for(let type in this.baseChartTypesStatus) {
	  		let rule = configRule[type];

	  		let flattenValues = [];
	        for(let i=0,l=config.values.length; i<l; i++) {
	        	let value = config.values[i];
	        	flattenValues = flattenValues.concat(value.cols);
	        }
	        tempConfig.values = flattenValues.length;

	        /*if (tempConfig.keys == 0 && tempConfig.groups == 0 && tempConfig.values == 0) {
	            result = false;
	        }else {*/
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
	        //}
	        this.baseChartTypesStatus[type] = result;
	  	}

	  	return this.baseChartTypesStatus;
    }
  },
  methods: {
  	handleNodeClick(node) {
  		console.log(node)
  		if(node.children && node.children.length > 0) {
  			return;
  		}else {
  			this.widgetConfigVisible = true;
  			this.currentWidget = node;
  			let id = node.id;
  			this.$router.push({ path: '/config/widget', query: { id: id }})
  		}
  	},
  	handleContextmenu() {

  	},
  	addWidget() {
  		this.currentWidget = {
  			name: '',
  			categoryName: '',
  			data: {},
  			datasetId: '',
			expressions: [],
			filterGroups: []
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
		//console.log(this.currentWidget)
		/*this.currentWidget.name = this.widgetName;
  		this.currentWidget.categoryName = this.widgetCategory;
  		this.currentWidget.datasetId = this.dataSource;*/
  	},
  	save() {
  		console.log(this.currentWidget)
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
/*######### Widget Type Icon 样式 ##############*/
.chart-type-icon {
    display: inline-block;
    width: 40px;
    height: 40px;
    background-repeat: no-repeat;
    background-position: 0 0;
}
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

.chart-type a.active{
    background-color: #FFF;
    box-shadow: 0 0 0 2px rgba(81,130,227,.06),inset 0 0 0 2px rgba(81,129,228,.6);
}
.chart-type a {
    display: block;
    width: 40px;
    height: 40px;
    margin: 0 4px 4px 0;
    cursor: pointer;
}
.chart-type a.active:hover {
    background-color: rgba(179, 180, 182, 0.64);
}
</style>
