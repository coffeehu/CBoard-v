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
                                style="margin-right: 5px; color: #fff">Preview
                        </a>
                        <button type="submit" class="btn btn-success pull-right"
                                style="margin-right: 5px"
                                @click="save">Save
                        </button>
                    </div>
                </div>
            </div>

            <!-- Category 下拉框 -->
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label>Category</label>
                        <el-select v-model="category" placeholder="请选择" class="board-config--select">
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
                    <div class="form-group" ng-class="{'has-error': !(verify.boardName || curBoard.name.length)}">
                        <label>Name</label>
                        <el-input v-model="name" placeholder="请输入名称" class="board-config--input"></el-input>
                    </div>
                </div>
            </div>

            <!-- 新增行按钮栏 -->
            <div class="row">
                <div class="form-group" style="margin: 5px 15px;">
                    <button type="submit" class="btn btn-success" @click="addRow">
                        Add Row
                    </button>
                    <button type="submit" class="btn btn-danger">
                        Add Param Row
                    </button>
                </div>
            </div>


            <!-- widget 配置栏 -->
            <widget-config-row v-for="(row, index) in board.layout.rows" 
            				   :key="index" 
            				   :index="index" 
            				   :rowData="row" 
            				   @remove-row="removeRow"></widget-config-row>

        </div>
    </div>
</template>

<script>
import WidgetConfigRow from '@/components/config/WidgetConfigRow';

export default {
	name: 'BoardConfigContent',
	props: {
		boardList: {
			type: Array,
			require: true
		}
	},
	components: {
        WidgetConfigRow
    },
    created() {
    	const id = parseInt(this.$route.params.id);
		for(let i=0,l=this.boardList.length; i<l; i++) {
		  if(this.boardList[i].id === id) {
		      this.board = this.boardList[i];
		      break;
		  }
		}
		this.name = this.board.name;
		this.category = this.board.categoryId;
    },
	computed: {
		categoryList() {
			return this.$store.state.menu.categoryList;
		}
	},
	data() {
        return {
            category: '',
            name: '',
            board: {}
        }
    },
    methods: {
    	//添加行
    	addRow() {
    		const row = {type: 'widget', widgets: []};
        	this.board.layout.rows.push(row);
    	},
    	//删除行
    	removeRow(index) {
    		this.board.layout.rows.splice(index, 1);
    	},
    	//保存
    	save() {
    		const params = {
    			json: JSON.stringify(this.board)
    		};
    		this.$req.post(this.$api.updateBoard, params)
    			.then(response => {
    				console.log('response', response);
    				if(response.data.status === '1') {
    					alert('保存成功！');
    				}
    			})
    	}
    }
}
</script>

<style scoped>
.board-config--input,
.board-config--select {
    display: block;
}
</style>
