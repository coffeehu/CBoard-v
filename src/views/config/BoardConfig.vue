<template>
    <div class="content">
        <div class="row">
            <!-- 目录面板 -->
            <div class="col-md-3">
                <div class="box box-solid">
                    <div class="box-header with-border">
                        <i class="fa fa-dashboard"></i><h3 class="box-title">test</h3>
                        <div class="box-tools pull-right operateBox">
                            <i class="fa fa-info toolbar-icon"></i>&nbsp;&nbsp;
                            <i class="fa fa-copy toolbar-icon"></i>&nbsp;&nbsp;
                            <i class="fa fa-edit toolbar-icon"></i>&nbsp;&nbsp;
                            <i class="fa fa-trash-o toolbar-icon"></i>&nbsp;&nbsp;
                            <i class="fa fa-plus toolbar-icon"></i>
                            <!-- <div class="newBoard hideOperate">
                                <span class="newGridLayout">{{'CONFIG.DASHBOARD.NEW_GRID_LAYOUT'|translate}}</span>
                                <span class="newGridLayout">{{'CONFIG.DASHBOARD.NEW_TIMELINE_LAYOUT'|translate}}</span>
                            </div> -->
                        </div>
                    </div>
                    <div class="panel-body">
                        <el-tree :data="treeData" @node-click="handleNodeClick"></el-tree>
                    </div>
                </div>
            </div>

            <!-- 配置面板 -->
            <div class="col-md-9">
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
                                            style="margin-right: 5px">Save
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
                                    <!-- <input id="BoardName" ng-model="curBoard.name" class="form-control"/> -->
                                    <el-input v-model="name" placeholder="请输入内容" class="board-config--input"></el-input>
                                </div>
                            </div>
                        </div>

                        <!-- 新增行按钮栏 -->
                        <div class="row">
                            <div class="form-group" style="margin: 5px 15px;">
                                <button type="submit" class="btn btn-success">
                                    Add Row
                                </button>
                                <button type="submit" class="btn btn-danger">
                                    Add Param Row
                                </button>
                            </div>
                        </div>


                        <!-- widget 配置栏 -->
                        <widget-config-row v-for="(row, index) in rows" :key="index" :rowData="row"></widget-config-row>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import WidgetConfigRow from '@/components/config/WidgetConfigRow';

export default {
    name: 'BoardConfig',
    components: {
        WidgetConfigRow
    },
    created() {
      this.$store.dispatch('menu/getCategoryList');
      this.$store.dispatch('menu/getBoardList');
      this.$store.dispatch('config/getWidgetList');
      this.$store.dispatch('config/getDatasetList');
    },
    mounted() {
    },
    computed: {
      categoryList() {
        return this.$store.state.menu.categoryList;
      },
      boardList() {
        return this.$store.state.menu.boardList;
      },
      treeData() {
          let treeData = [];
          for(let i=0,l=this.categoryList.length; i<l; i++) {
              let category = this.categoryList[i];
              let item = {
                  label: category.name,
                  id: category.id,
                  children: []
              };
              treeData.push(item);
              for(let j=0,len=this.boardList.length; j<len; j++) {
                  let board = this.boardList[j];
                  if(item.id === board.categoryId) {
                      let childItem = {
                          label: board.name,
                          id: board.id
                      }
                      item.children.push(childItem);
                  }
              }
          }
          return treeData;
      },
      board() {
          const id = parseInt(this.$route.params.id);
          for(let i=0,l=this.boardList.length; i<l; i++) {
              if(this.boardList[i].id === id) {
                  return this.boardList[i];
              }
          }
          return null;
      },
      rows() {
        if(this.board) {
          return this.board.layout.rows;
        }
        return [];
      },
      category: {
        get() {
          if(this.categoryId) {
            return this.categoryId;
          }
          if(this.board) {
            return this.board.categoryId;
          }
          return '';
        },
        set(value) {
          this.categoryId = value;
        }
      },
      name: {
        get() {
          if(this.mName) {
            return this.mName;
          } else if(this.board) {
            return this.board.name;
          } else {
            return '';
          }
        },
        set(value) {
          this.mName = value;
        }
      }
    },
    data() {
        return {
            categoryId: '',
            mName: '',
        }
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
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
.label {
  display: inline;
  padding: .3em .6em;
  font-size: 75%;
  font-weight: bold;
  line-height: 1;
  color: white;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
}
.btn {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 200;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 6px;
  font-size: 13px;
  line-height: 1.42857;
  border-radius: 3px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.board-config--input,
.board-config--select {
    display: block;
}
</style>
