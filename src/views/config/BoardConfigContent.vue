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
            <draggable v-model="rows" @end="rowDragEnd">
                <transition-group type="transition" name="flip-list" tag="div">
                    <div v-for="(row, index) in rows" :key="row.flag">
                        <widget-config-row v-if="row.type === 'widget'" :index="index" 
                        				   :rowData="row" 
                        				   @remove-row="removeRow"></widget-config-row>
                        <widget-config-param v-if="row.type === 'param'" :index="index" 
                                           :rowData="row"
                                           @remove-row="removeRow"></widget-config-param>
                    </div>
                </transition-group>
            </draggable>

        </div>
    </div>
</template>

<script>
import WidgetConfigParam from '@/components/config/WidgetConfigParam';
import WidgetConfigRow from '@/components/config/WidgetConfigRow';
import draggable from 'vuedraggable';

export default {
	name: 'BoardConfigContent',
	components: {
        WidgetConfigParam,
        WidgetConfigRow,
        draggable
    },
    created() {
        this.$store.dispatch('menu/getBoardList')
            .then(() => {
                const id = parseInt(this.$route.params.id);
                this.setBoardById(id);
            })
            .catch(() => {})
    },
    beforeRouteUpdate (to, from, next) {
        const id = parseInt(to.params.id);
        this.setBoardById(id);
        next();
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
            rows: [],
            boardList: [],
            board: {}
        }
    },
    methods: {
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
            this.rows = this.board.layout.rows;
            this.name = this.board.name;
            this.category = this.board.categoryId;
            console.log('rows', this.rows)
        },
    	//添加行
    	addRow() {
    		const row = {type: 'widget', widgets: []};
            row.flag = 'config-row-' + this.board.layout.rows.length;
        	this.board.layout.rows.push(row);
    	},
    	//删除行
    	removeRow(index) {
    		this.board.layout.rows.splice(index, 1);
    	},
    	//保存
    	saveConfig(callback) {
    		const params = {
    			json: JSON.stringify(this.board)
    		};
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
    	},
        // 预览--即跳的对应的 dashboard 页面
        previewConfig() {
            this.$confirm('保存后才能预览，是否保存并预览?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              customClass: 'previewConfigModal'
            }).then(() => {
                this.saveConfig(() => {
                    const id = this.$route.params.id;
                    let name = '';
                    for(let i=0,l=this.categoryList.length; i<l; i++) {
                        if(this.categoryList[i].id === this.category) {
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
            /*const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;
            if(oldIndex === newIndex) return;
            this.changeRow(oldIndex, newIndex);
            console.log(this.board.layout.rows);*/
            this.board.layout.rows = this.rows;
        },
        /*changeRow(oldIndex, newIndex) {
            let temp = this.board.layout.rows[oldIndex];
            this.board.layout.rows[oldIndex] = this.board.layout.rows[newIndex];
            this.board.layout.rows[newIndex] = temp;
        }*/
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
</style>
