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
            <div class="col-md-9" v-if="!loading">
                <board-config-content :boardList="boardList"></board-config-content>
            </div>

        </div>
    </div>
</template>

<script>
import BoardConfigContent from '@/views/config/BoardConfigContent';

export default {
    name: 'BoardConfig',
    components: {
      BoardConfigContent
    },
    created() {
      /*
        获取所有 board 列表数据。

        之后需要根据当前页面的id（url上如：#/dashboard/Demo/3，即 id 为 3）与 board.id 对应，来确定当前页面对应的 board
      */
      this.$store.dispatch('menu/getBoardList')
        .then(() => {
          this.boardList = this.$store.state.menu.boardList;
          this.loading = false;
        })
        .catch(() => {})

      // category 数据，左侧目录的一级目录也是这个数据得来。
      this.$store.dispatch('menu/getCategoryList');

      // 获取所有 widget 列表数据
      this.$store.dispatch('config/getWidgetList');
      // 获取所有 dataset 列表数据
      this.$store.dispatch('config/getDatasetList');
    },
    mounted() {
    },
    computed: {
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
            loading: true,
            boardList: []
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
