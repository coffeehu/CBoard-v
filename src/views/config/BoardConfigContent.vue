<!-- 看板设计页面-详情页面 -->
<template>
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">{{ name }}</h3>
        </div>
        <div class="box-body">
            <!-- 按钮栏 -->
            <div class="row">
                <div class="col-md-12">
                     <div class="form-group">
                        <button type="submit" class="btn btn-danger pull-right">Cancel</button>
                        <a class="btn btn-success pull-right" target="_blank"
                                style="margin-right: 5px; color: #fff"
                                @click="previewConfig">Preview
                        </a>
                        <button type="submit" class="btn btn-success pull-right"
                                style="margin-right: 5px"
                                @click="saveConfig">Save
                        </button>
                    </div>
                </div>
            </div>

            <!-- Category 下拉框 -->
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label>Category</label>
                        <el-select v-model="board.categoryId" placeholder="请选择" class="board-config--select">
                            <el-option
                              v-for="item in categoryList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                              :value-key="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <!-- Name 输入框 -->
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group" :class="isError ? 'is-error' : ''">
                        <label>Name</label>
                        <el-input v-model="board.name" placeholder="请输入名称" class="board-config--input" @change="isError = false"></el-input>
                        <div v-if="isError" class="error-tag">请输入名称</div>
                    </div>
                </div>
            </div>

            <!-- 新增行按钮栏 -->
            <div class="row">
                <div v-if="boardType === 'timeline'" class="form-group" style="margin: 5px 15px;">
                    <button type="submit" class="btn btn-success" @click="addNode('parent')">
                        Add Main Node
                    </button>
                    <button type="submit" class="btn btn-success" @click="addNode('leaf')">
                        Add Sub Node
                    </button>
                    <button type="submit" class="btn btn-danger" @click="addParamRow">
                        Add Param Row
                    </button>
                </div>
                <div v-if="boardType === 'gridster'" class="form-group" style="margin: 5px 15px;">
                    <button type="submit" class="btn btn-success" @click="addRow">
                        Add Row
                    </button>
                    <button type="submit" class="btn btn-danger" @click="addParamRow">
                        Add Param Row
                    </button>
                </div>
                <div v-if="!boardType" class="form-group" style="margin: 5px 15px;">
                    <button type="submit" class="btn btn-success" @click="addRow">
                        Add Row
                    </button>
                    <button type="submit" class="btn btn-danger" @click="addParamRow">
                        Add Param Row
                    </button>
                </div>
            </div>


            <!-- widget 配置栏 -->
            <div v-if="boardType === 'gridster'">
                <div v-for="(row, index) in rows" :key="row.flag">
                        <widget-config-gridster-row v-if="row.type === 'widget'" :index="index" 
                                           :rowData="row"
                                           @open-widget-config="widgetConfigHandler"
                                           @remove-row="removeRow"></widget-config-gridster-row>
                        <widget-config-param v-if="row.type === 'param'" :index="index" 
                                           :rowData="row"
                                           @remove-row="removeRow"
                                           @add-param="addParamHandler"
                                           @edit-param="editParamHandler"></widget-config-param>
                    </div>
            </div>
            <draggable v-else v-model="rows" @end="rowDragEnd">
                <transition-group type="transition" name="flip-list" tag="div">
                    <div v-for="(row, index) in rows" :key="row.flag">
                        <widget-config-row v-if="row.type === 'widget'" :index="index" 
                        				   :rowData="row" 
                        				   @remove-row="removeRow"></widget-config-row>
                        <widget-config-param v-if="row.type === 'param'" :index="index" 
                                           :rowData="row"
                                           @remove-row="removeRow"
                                           @add-param="addParamHandler"
                                           @edit-param="editParamHandler"></widget-config-param>
                    </div>
                </transition-group>
            </draggable>

            <!-- Add Param 配置面板 -->
            <el-dialog title="Param" 
                       :visible.sync="isParamConfigShow" 
                       custom-class="param-config-dialog">
                <div class="row">
                    <div class="col-md-12">
                        <el-input v-model="paramName" placeholder="请输入名称"></el-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <el-transfer
                            :titles="['数据源', '参数数据']"
                            filterable
                            filter-placeholder="请输入关键字"
                            v-model="paramCol"
                            :data="paramColumns">
                        </el-transfer>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <label class="param-type-label">Param Type :</label>
                        <el-select v-model="paramTypeValue" placeholder="请选择">
                            <el-option
                            v-for="item in paramTypes"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <!-- param property config -->
                <component :is="currentParamDetail" v-model="configDetail"></component>
                <!-- param property config END -->
                <div class="row">
                    <div class="col-md-12">
                        <button type="button" class="btn btn-default pull-left" @click="cancelParamConfig">取消</button>
                        <button type="button" class="btn btn-primary pull-right" @click="submitParamConfig">确定</button>
                    </div>
                </div>
            </el-dialog>


            <!-- Widget 配置面板（Gridster Layout 下使用） -->
            <el-dialog title="Param" 
                       :visible.sync="isWidgetConfigShow" 
                       custom-class="widget-config-dialog">
                       <gridster-widget-config
                            :widgetData="currentWidgetConfigData" type="gridster" :key="currentWidgetConfigData.i"></gridster-widget-config> 
            </el-dialog>


        </div>
    </div>
</template>

<script>
export default {
	name: 'BoardConfigContent',
	components: {
        draggable: () => import('vuedraggable'),
        WidgetConfig: () => import('@/components/config/WidgetConfig'),
        GridsterWidgetConfig: () => import('@/components/config/GridsterWidgetConfig'),
        WidgetConfigParam: () => import('@/components/config/WidgetConfigParam'),
        WidgetConfigRow: () => import('@/components/config/WidgetConfigRow'),
        WidgetConfigGridsterRow: () => import('@/components/config/WidgetConfigGridsterRow'),
        DatePickerConfigDetail: () => import('@/components/config/params/DatePickerConfigDetail'),
        SliderConfigDetail: () => import('@/components/config/params/SliderConfigDetail'),
        SelectorConfigDetail: () => import('@/components/config/params/SelectorConfigDetail')
    },
    created() {
        this.$store.dispatch('menu/getBoardList')
            .then(() => {
                const id = this.$route.params.id;
                const categoryId = this.$route.query.categoryId;
                this.initData(id, categoryId);
            })
            .catch(() => {})
    },
    beforeRouteUpdate (to, from, next) {
        const id = to.params.id;
        const categoryId = to.query.categoryId;
        this.initData(id, categoryId);
        next();
    },
	computed: {
		categoryList() {
			return this.$store.state.menu.categoryList;
		},
        widgetList() {
            return this.$store.state.config.widgetList;
        },
        datasetList() {
            return this.$store.state.config.datasetList;
        },
        currentParamDetail() {
            switch(this.paramTypeValue) {
                case 'datePicker':
                    return 'DatePickerConfigDetail';
                case 'slider':
                    return 'SliderConfigDetail';
                default:
                    return 'SelectorConfigDetail';
            }
        },
        currentCategory() {
            let obj = { name:'', id:-1 };
            this.categoryList.forEach(category => {
                if(category.id == this.board.categoryId) {
                    obj.name = category.name;
                    obj.id = category.id;
                }
            })
            return obj;
        }
	},
	data() {
        return {
            name: '',
            rows: [],
            boardList: [],
            board: {},
            boardType: '',
            //--------- Add Param 配置数据 -----------
            isParamConfigShow: false,
            isWidgetConfigShow: false,
            paramConfigFlag: 'add', // "add"、"edit"(新增和编辑两种)
            paramName: '', //param 名称
            isError: false, //名称输入框的校验值
            paramCol: [], //穿梭框的选中值
            paramColumns: [], //穿梭框列表数据
            paramTypeValue: 'selector', //param type 值
            paramTypes: ['selector', 'slider', 'datePicker'], //param type 列表
            currentParamRowData: [], // 当前操作的 param row 的数据
            currentParamData: [], // 当前操作的 param 的数据
            configDetail: {},
            currentWidgetConfigData: {}
        }
    },
    methods: {
        initData(id, categoryId) {
            this.isError = false;
            // 新增 Grid Layout
            if(id === 'grid') {
                this.board = {
                    categoryId: categoryId,
                    name: '',
                    layout: {
                        rows: []
                    }
                }
                this.rows = this.board.layout.rows;
                this.boardType = '';
            }
            // 新增 Timelline Layout
            else if(id === 'timeline') {
                this.board = {
                    categoryId: categoryId,
                    name: '',
                    layout: {
                        rows: [],
                        type: 'timeline'
                    }
                }
                this.rows = this.board.layout.rows;
                this.boardType = 'timeline'; 
            }
            // 新增 Timelline Layout
            else if(id === 'gridster') {
                this.board = {
                    categoryId: categoryId,
                    name: '',
                    layout: {
                        rows: [],
                        type: 'gridster'
                    }
                }
                this.rows = this.board.layout.rows;
                this.boardType = 'gridster'; 
            }
            // 点击 tree item 切换配置页面
            else {
                this.setBoardById(parseInt(id));
                this.rows = this.board.layout.rows;
                this.boardType = this.board.layout.type;
            }
            this.paramColumns = [];
        },
        setBoardById(id) {
            this.boardList = this.$store.state.menu.boardList;
            for(let i=0,l=this.boardList.length; i<l; i++) {
              if(this.boardList[i].id === id) {
                  this.board = this.boardList[i];
                  break;
              }
            }
            for(let i=0,l=this.board.layout.rows.length; i<l; i++) {
                this.board.layout.rows[i].flag = 'hehe' + i;
            }
        },
    	//添加行
    	addRow() {
    		const row = {type: 'widget', widgets: []};
            if(this.board.layout) {
                row.flag = 'config-row-' + this.board.layout.rows.length;
                this.board.layout.rows.push(row);
            }
    	},
        //添加 param 行
        addParamRow() {
            if(this.$route.params.id === 'timeline' && this.board.layout) {
                for(let i=0,l=this.board.layout.rows.length; i<l; i++) {
                    if(this.board.layout.rows[i].type === 'param') {
                        this.$message({
                            type: 'warning',
                            message: 'timeline 类型的布局，只有能一个 param！'
                        });
                        return;
                    }
                }
            }
            const paramRow = {type: 'param', params: []};
            if(this.board.layout) {
                paramRow.flag = 'config-row-' + this.board.layout.rows.length;
                this.board.layout.rows.unshift(paramRow);
            }
        },
        //添加node（用于 timeline 类型的布局）
        addNode(nodeType) {
            const row = {type: 'widget', widgets: [], node: nodeType};
            row.flag = 'config-row-' + this.board.layout.rows.length;
            this.board.layout.rows.push(row);
        },
    	//删除行
    	removeRow(index) {
    		this.board.layout.rows.splice(index, 1);
    	},
    	//保存
    	saveConfig(callback) {
            if(this.board.name === '') {
                this.isError = true;
                return;
            }
            if(!this.board.categoryId) {
                return;
            }
            this.board.categoryName = this.currentCategory.name;
            let id = this.$route.params.id;

            const params = {
                json: JSON.stringify(this.board)
            };
            if(id === 'grid' || id === 'timeline' || id === 'gridster') {  // 新增布局的时候，使用不同的接口
                this.$req.post(this.$api.saveNewBoard, params)
                .then(response => {
                    console.log('response', response);
                    if(response.data.status === '1') {
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                        let id = response.data.id;
                        this.$store.dispatch('menu/getBoardList')
                        .then(() => {
                          this.$router.push({path: `/config/board/${id}`});
                        })
                        .catch(() => {})
                    }
                })
            }else {
                this.$req.post(this.$api.updateBoard, params)
                .then(response => {
                    console.log('response', response);
                    if(response.data.status === '1') {
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                        if(typeof callback === 'function') {
                            callback();
                        }
                    }
                })
            }
    		
    		
    	},
        // 预览--即跳的对应的 dashboard 页面
        previewConfig() {
            let id = this.$route.params.id;
            if(id === 'grid' || id === 'timeline') {
                this.$message({
                    type: 'warning',
                    message: '新增布局状态，请保存后再预览!'
                });
                return;
            }
            this.$confirm('保存后才能预览，是否保存并预览?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              customClass: 'preview-config-modal'
            }).then(() => {
                this.saveConfig(() => {
                    const id = this.$route.params.id;
                    let name = '';
                    for(let i=0,l=this.categoryList.length; i<l; i++) {
                        if(this.categoryList[i].id === this.board.categoryId) {
                            name = this.categoryList[i].name;
                            break;
                        }
                    }
                    this.$router.push({path: `/dashboard/${name}/${id}`});
                })
            }).catch(() => {
                      
            });
        },
        rowDragEnd(evt) {
            this.board.layout.rows = this.rows;
        },
        // 获得 params 数据源列表，储存到 this.paramColumns
        getParamColumns(callback) {
            // 获得当前页面拥有的 widgetId
            let widgetIdList = [];
            let rows = this.board.layout.rows;
            for(let i=0,l=rows.length; i<l; i++) {
                let row = rows[i];
                if(row.type === 'widget') {
                    for(let j=0,len=row.widgets.length; j<len; j++) {
                        let widget = row.widgets[j];
                        if(widgetIdList.indexOf(widget.widgetId) === -1) widgetIdList.push(widget.widgetId);
                    }
                }
            }

            // 根据当前页面的 widgetId 找到对应的 datasetId
            let datasetIdList = [];
            let datasetNameList = '';
            for(let i=0,l=this.widgetList.length; i<l; i++) {
                for(let j=0,len=widgetIdList.length; j<len; j++) {
                    let datasetId = this.widgetList[i].data.datasetId;
                    if(this.widgetList[i].id === widgetIdList[j]) {
                        if(datasetIdList.indexOf(datasetId) === -1) {
                            datasetIdList.push(datasetId);
                        }
                    }
                }
            }

            if(datasetIdList.length === 0) {
                this.$message({
                  message: '添加了 Column 面板后，参数数据源才会有数据',
                  type: 'warning'
                });
                return;
            }

            // 请求接口，获得对应的数据库字段列表
            this.paramColumns = [];
            for(let i=0,l=datasetIdList.length; i<l; i++) {
                this.$store.dispatch('config/getColumns', {datasetId: datasetIdList[i]})
                    .then((data) => {
                        let len = this.paramColumns.length;
                        data.forEach((value, index) => {
                            this.paramColumns.push({
                                label: value,
                                key: len + index,
                                datasetId: datasetIdList[i]
                            });
                        });
                        if(typeof callback === 'function') {
                            callback();
                        }
                    })
                    .catch(() => {});
            }
        },
        // Param Row 中点击 Add Param 的回调
        // 参数 params 为对应 Param Row 的值
        addParamHandler(params) {
            this.paramConfigFlag = 'add';
            this.currentParamRowData = params;
            if( this.paramColumns.length === 0 ) {
                this.getParamColumns();   
            }
            this.isParamConfigShow = true;
            this.paramCol = [];
        },
        // 编辑 param 的回调
        editParamHandler(param) {
            this.paramConfigFlag = 'edit';
            this.currentParamData = param;
            if( this.paramColumns.length === 0 ) { // 若无 columns 数据，则请求
                this.getParamColumns(() => {
                    this.setDefaultColumns(param);
                });
            }else {
                this.setDefaultColumns(param);
            }
            this.paramName = param.name;
            this.paramTypeValue = param.paramType;
            if(param.cfg) {
                this.configDetail = param.cfg;    
            }else {
                this.configDetail = {}
            }
            this.isParamConfigShow = true;
        },
        // edit param 时，穿梭框中展示该 param 之前已选中的数据
        setDefaultColumns(param) {
            let indexArr = [];
            param.col.forEach(col => {
                this.paramColumns.forEach((paramColumn, index) => {
                    if(paramColumn.label === col.column) {
                        indexArr.push(index);
                    }
                })
            })
            this.paramCol = indexArr;
        },
        cancelParamConfig() {
            this.isParamConfigShow = false;
        },
        submitParamConfig() {
            if(this.paramName === '') {
                this.$message({
                  message: '请输入名称',
                  type: 'warning'
                });
                return false;
            }
            if(this.paramConfigFlag === 'add') {
                this.submitParamConfigAdd();
            }else if(this.paramConfigFlag === 'edit') {
                this.submitParamConfigEdit();
            }
            this.isParamConfigShow = false;
        },
        submitParamConfigAdd() {
            /*
                构建请求 param 对象，结构如：
                {
                    col: [{
                        column: 'SALES_COUNTRY',
                        datasetId: 2,
                        name: 'FoodMart_Sample'
                    }],
                    name: 'test',
                    paramType: "selector",
                    selects: [],
                    type: '=',
                    values: []
                }
            */
            let param = {
                name: this.paramName,
                type: '=',
                values: [],
                paramType: this.paramTypeValue
            }
            let col = [];
            this.paramCol.forEach(value => {
                let datasetId = this.paramColumns[value].datasetId;
                let column = this.paramColumns[value].label;
                let colItem = { datasetId: datasetId, column: column };
                this.datasetList.forEach(value => {
                    if(value.id === datasetId) {
                        colItem.name = value.name;
                    }
                })
                col.push(colItem);
            })
            param.col = col;
            param.cfg = this.configDetail;
            this.currentParamRowData.push(param);
        },
        submitParamConfigEdit() {
            let col = [];
            this.paramCol.forEach(value => {
                let datasetId = this.paramColumns[value].datasetId;
                let column = this.paramColumns[value].label;
                let colItem = { datasetId: datasetId, column: column };
                this.datasetList.forEach(value => {
                    if(value.id === datasetId) {
                        colItem.name = value.name;
                    }
                })
                col.push(colItem);
            })
            this.currentParamData.name = this.paramName;
            this.currentParamData.paramType = this.paramTypeValue;
            this.currentParamData.col = col;
            this.currentParamData.cfg = this.configDetail;
        },
        widgetConfigHandler(widget) {
            this.isWidgetConfigShow = true;
            this.currentWidgetConfigData = widget;
        }
    }
}
</script>

<style scoped>
.board-config--input,
.board-config--select {
    display: block;
}
.flip-list-move {
  transition: transform 0.5s;
}
.param-config-dialog .row {
    margin-bottom: 10px;
}
.param-type-label {
    margin-right: 10px;
    font-weight: bold;
}
</style>
