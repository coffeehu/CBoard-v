<template>
  <div class="box box-success" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de; margin-top:20px">

    <div class="box-header" style="cursor: move">
      <div class="box-header-name">{{ rowName }}</div>
      <div v-if="rowData.node" class="node-info">
        <div v-if="rowData.node === 'parent'"><label>Node Name:</label><el-input v-model="rowData.nodeName" size="mini" class="node-title"></el-input></div>
        <div><label>Title:</label><el-input v-model="rowData.title" size="mini" class="node-title"></el-input></div>
      </div>
      <div class="box-tools pull-right">
          <div class="input-group input-group-sm">
              <input v-model="columnsNumber" type="text" class="form-control pull-right" placeholder="列数">
              <div class="pull-right row-color-picker">
                <el-color-picker v-model="rowData.background"
                                 @active-change="handleRowAcitveColorChange"
                                 @change="handleRowColorChange"></el-color-picker>
              </div>
              <div class="pull-right row-color-picker">
                <el-color-picker v-model="rowData.columnsBackground"
                                 @active-change="handleColumnsAcitveColorChange"
                                 @change="handleColumnsColorChange"></el-color-picker>
              </div>
              <!-- <input v-model="heightUnit" type="text" name="table_search" class="form-control pull-right" placeholder="Widget 高度单位"> -->
              <!-- <input v-model="rowData.height" type="text" name="table_search" class="form-control pull-right" placeholder="Row 的高度"> -->
              <div class="input-group-btn">
                  <button type="button" class="btn btn-xs btn-primary" @click="addWidget">Add Widget</button>
                  <button type="button" class="btn btn-box-tool"><i class="fa fa-minus"></i>
                  </button>
                  <button type="button" class="btn btn-box-tool" @click="removeRow"><i class="fa fa-times"></i>
                  </button>
              </div>
          </div>
      </div>
    </div>

    <div class="box-body" :style="{'background': rowPreviewBackground}">

      <grid-layout
        :layout="widgets"
        :col-num="parseInt(columnsNumber)"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true">
        <grid-item 
           v-for="(widget, index) in widgets"
           :key="widget.i"
           :x="widget.x"
           :y="widget.y"
           :w="widget.w"
           :h="widget.h"
           :i="widget.i">
            <div class="box box-solid widget-item"
                 :style="{'background-color': widget.background || columnsPreviewBackground}"
                 @dblclick.prevent = "handleDblclick(widget)">
                <i @click="removeWidget(index)" class="el-icon-close"></i>
                <div>{{widget.name}}</div>
             </div>
        </grid-item>
      </grid-layout>

        
    </div>

  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout';
const GridLayout = VueGridLayout.GridLayout;
const GridItem = VueGridLayout.GridItem;

export default {
  name: 'WidgetConfigGridsterRow',
  props: {
    rowData: {
      type: Object,
      require: true
    },
    index: {
      type: Number
    }
  },
  components: {
    WidgetConfig: () => import('@/components/config/WidgetConfig'),
    GridLayout,
    GridItem
  },
  created() {
    this.setWidgets();
    this.rowPreviewBackground = this.rowData.background;
    this.columnsPreviewBackground = this.rowData.columnsBackground;
    this.columnsNumber = this.rowData.columnsNumber || 12;
    console.log(111111111, this.rowData)
  },
  watch: {
    rowData() {
      this.setWidgets();
    },
    widgets() {
      this.rowData.widgets = this.widgets;
    },
    columnsNumber() {
      this.rowData.columnsNumber = this.columnsNumber;
    }
  },
  computed: {
    rowName() {
      if(this.rowData.node) {
        if(this.rowData.node === 'parent') {
          return 'Main Node';
        }
        return 'Sub Node';
      }else {
        return 'Row';
      }
    },
    // 所有的 wdget 类型
    widgetList() {
      return this.$store.state.config.widgetList;
    }
  },
  data() {
    return {
      nodeName: '',
      nodeTitle: '',
      widgets: [],
      editable: true,
      heightUnit: 100,
      rowPreviewBackground: '',
      columnsPreviewBackground: '',
      columnsNumber: 12, //定义一行的列数
    }
  },
  methods: {
    setWidgets() {
      if(this.rowData.type === 'widget') {
        this.widgets = this.rowData.widgets;
        for(let i=0,l=this.widgets.length; i<l; i++) {
          this.widgets[i].flag = this.widgets[i].name + this.widgets[i].widgetId + i; // 设置一个唯一标识用于 key
        }
      }
    },
    //删除行
    removeRow() {
      this.$emit('remove-row', this.index);
    },
    //添加列
    addWidget() {
      var widget = {};
      // 新增的默认显示 widgetList 中第一个
      widget.name = this.widgetList[0].name;
      widget.width = 12;
      widget.widgetId = this.widgetList[0].id;
      widget.flag = 'col-' + this.widgets.length;
      widget.x = 0;
      widget.y = 0;
      widget.w = 2;
      widget.h = 2;
      if(this.widgets.length > 0) {
        widget.i = (this.widgets[this.widgets.length-1].i | 0) + 1 + '' ;
      }else {
        widget.i = '0';
      }
      this.widgets.push(widget);
    },
    handleDblclick(widget) {
      this.$emit('open-widget-config', widget);
    },
    removeWidget(index) {
      this.widgets.splice(index, 1);
    },
    //Row 的颜色
    handleRowAcitveColorChange(color) {
      this.rowPreviewBackground = color;
    },
    handleRowColorChange(color) {
      this.rowPreviewBackground = color;
    },
    //Row 中所有 Columns 的颜色
    handleColumnsAcitveColorChange(color) {
      this.columnsPreviewBackground = color;
    },
    handleColumnsColorChange(color) {
      this.columnsPreviewBackground = color;
    }
  }
}
</script>

<style scoped>
.box-header-name {
  font-size: 18px;
}
.node-info {
  margin-top: 10px;
}
.node-info > div {
  display: inline-block;
  margin-right: 15px;
}
.node-info > div >label {
  margin-right: 4px;
}
.input-group-sm > .input-group-btn > .btn {
  height: 30px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
}
.input-group-sm > input {
    height: 30px;
}
.board-config--input,
.board-config--select {
    display: block;
}
.widget-item {
  position: relative;
  width:100%;
  height:100%;
  border-left: 1px solid rgb(210, 214, 222);
  border-right: 1px solid rgb(210, 214, 222);
  border-top: 2px solid #3c8dbc;
}
.widget-item > div {
     position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    height: 50px;
    line-height: 50px;
}
.widget-item > i {
  display: none;
  position: absolute;
  right: 2px;
  top: 2px;
  font-size: 14px;
}
.widget-item:hover > i {
  display: block;
}
.row-color-picker {
  margin-right: 20px;
}
</style>
