<!-- 看板设计页面 -->
<template>
    <div class="content">
        <div class="row">
            <!-- 目录面板 -->
            <div class="col-md-3">
                <div class="box box-solid">
                    <div class="box-header with-border">
                        <i class="fa fa-dashboard"></i><h3 class="box-title">Dashboard</h3>
                    </div>
                    <div class="panel-body">
                        <el-tree :data="treeData" @node-click="handleNodeClick" @node-contextmenu="handleContextmenu"></el-tree>
                    </div>
                </div>
            </div>

            <!-- 目录的添加操作（只有一级目录弹出） -->
            <div class="config-tree-operation" 
                 :style="{top: treeOperationTop, left: treeOperationLeft}" 
                 v-show="showTreeAdd">
              <div class="config-tree-operation-item"
                   @click="addLayout('grid')">
                <i class="fa fa-plus toolbar-icon"></i>
                <span>New Grid Layout</span>
              </div>
              <div class="config-tree-operation-item"
                   @click="addLayout('timeline')">
                <i class="fa fa-plus toolbar-icon"></i>
                <span>New Timeline Layout</span>
              </div>
              <div class="config-tree-operation-item"
                   @click="addLayout('gridster')">
                <i class="fa fa-plus toolbar-icon"></i>
                <span>New Gridster Layout</span>
              </div>
            </div>

            <!-- 目录的删除操作（只有二级目录弹出） -->
            <div class="config-tree-operation" 
                 :style="{top: treeOperationTop, left: treeOperationLeft}"
                 v-show="showTreeDel">
              <div class="config-tree-operation-item"
                   @click="delLayout('grid')">
                <i class="fa fa-trash-o toolbar-icon"></i><span>Delete this Layout</span>
              </div>
            </div>

            <!-- 配置面板 -->
            <div class="col-md-9">
                <router-view />
            </div>

        </div>
    </div>
</template>

<script>
import domUtils from '@/utils/dom.js';

export default {
    name: 'BoardConfig',
    components: {
      BoardConfigContent: () => import('@/views/config/board/BoardConfigContent')
    },
    created() {
      /*
        获取所有 board 列表数据。

        之后需要根据当前页面的id（url上如：#/dashboard/Demo/3，即 id 为 3）与 board.id 对应，来确定当前页面对应的 board
      */
      this.$store.dispatch('menu/getBoardList')
        .then(() => {
          //this.boardList = this.$store.state.menu.boardList;
        })
        .catch(() => {})

      // category 数据，左侧目录的一级目录也是这个数据得来。
      this.$store.dispatch('menu/getCategoryList');

      // 获取所有 widget 列表数据
      this.$store.dispatch('config/getWidgetList');
      // 获取所有 dataset 列表数据
      this.$store.dispatch('config/getDatasetList');
    },
    computed: {
      boardList() {
        return this.$store.state.menu.boardList;
      },
      categoryList() {
        return this.$store.state.menu.categoryList;
      },
      //构造目录数据
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
    },
    data() {
        return {
            //boardList: [],
            contentVisble: false,
            showTreeAdd: false,
            showTreeDel: false,
            treeOperationTop: '',
            treeOperationLeft: '',
            currentTreeItem: null
        }
    },
    methods: {
      // 点击目录节点
      handleNodeClick(data) {
        this.showTreeAdd = false;
        this.showTreeDel = false;
        if(!data.children) {
          this.$router.push({path: `/config/board/${data.id}`});
        }
      },
      // 鼠标右键点击目录节点
      handleContextmenu(evt, data, node, instance) {
        //console.log(evt, data, node)
        this.currentTreeItem = data; // 当前 tree 选中的 item 数据
        this.treeOperationTop = (evt.clientY + 12) + 'px';
        this.treeOperationLeft = (evt.clientX + 18) + 'px';
        if(data.children) { // 弹出添加操作
          this.showTreeAdd = true;
          this.showTreeDel = false;
        }else { //弹出删除操作
          this.showTreeDel = true;
          this.showTreeAdd = false;
        }

        domUtils.one(document, 'click', () => {
          this.showTreeAdd = false;
          this.showTreeDel = false;
        })
      },
      addLayout(type) {
        this.$router.push({path: `/config/board/${type}`, query: { categoryId: this.currentTreeItem.id }});
      },
      delLayout() {
        this.$confirm('是否确认删除？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          customClass: 'preview-config-modal'
        }).then(() => {
          let id = this.currentTreeItem.id;
          let params = { id: id };
          this.$req.post(this.$api.deleteBoard, params)
          .then(response => {
              if(response.data.status === '1') {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.$store.dispatch('menu/getBoardList')
                .then(() => {
                  this.$router.push({path: '/config/board'});
                })
                .catch(() => {})
              }
          })
        }).catch(() => {});
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
.toolbar-icon {
  margin-right: 8px;
  cursor: pointer;
}
.board-config--input,
.board-config--select {
    display: block;
}
.config-tree-operation {
  position: fixed;
  box-shadow: 1px 1px 5px #ccc;
  background-color: #fff;
  z-index: 9;
}
.config-tree-operation-item {
  padding: 10px 15px;
}
.config-tree-operation-item:hover {
  background-color: #f5f7fa;
}
.config-tree-operation-item span {
  display: inline-block;
  margin-left: 3px;
  vertical-align: middle;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
