<template>
  <div class="box box-success" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de; margin-top:20px">

    <div class="box-header" style="cursor: move">
      <div class="box-header-name">{{ rowName }}</div>
      <div v-if="rowData.node" class="node-info">
        <div v-if="rowData.node === 'parent'"><label>Node Name:</label><el-input v-model="rowData.nodeName" size="mini" class="node-title"></el-input></div>
        <div><label>Title:</label><el-input v-model="rowData.title" size="mini" class="node-title"></el-input></div>
      </div>
      <div class="box-tools pull-right">
          <div class="input-group input-group-sm" style="width: 300px;">
              <input type="text" name="table_search" class="form-control pull-right" v-model="rowData.height">
              <div class="input-group-btn">
                  <button type="button" class="btn btn-xs btn-primary" @click="addWidget">Add Widget</button>
                  <button type="button" class="btn btn-xs btn-primary" @click="addColumn">Add Column</button>
                  <button type="button" class="btn btn-box-tool"><i class="fa fa-minus"></i>
                  </button>
                  <button type="button" class="btn btn-box-tool" @click="removeRow"><i class="fa fa-times"></i>
                  </button>
              </div>
          </div>
      </div>
    </div>

    <div class="box-body">
      <draggable v-model="widgets"  @start="drag=true" :options="dragOptions">
        <transition-group type="transition" name="flip-list" tag="div" class="row" style="min-height:50px">
          
          <div v-for="(widget, index) in widgets" :class="'col-md-' + widget.width" :key="widget.flag">
            <widget-config-column v-if="widget.type === 'column'"
                                  :index="index"
                                  :widgetData="widget"
                                  @remove-col="removeCol"></widget-config-column>
            <widget-config v-else
                        :index="index"
                        :widgetData="widget"
                        @remove-col="removeCol"></widget-config>  
          </div>
          
        </transition-group>
      </draggable>
    </div>

  </div>
</template>

<script>
export default {
  name: 'WidgetConfigRow',
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
    WidgetConfigColumn: () => import('@/components/config/WidgetConfigColumn'),
    draggable: () => import('vuedraggable')
  },
  created() {
    this.setWidgets();
  },
  watch: {
    rowData() {
      this.setWidgets();
    },
    widgets() {
      this.rowData.widgets = this.widgets;
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
    dragOptions () {
      return  {
        animation: 0,
        group: 'widgetConfig',
      };
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
      widgets: '',
      editable: true
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
      this.widgets.push(widget);
    },
    addColumn() {
      var widget = {};
      // 新增的默认显示 widgetList 中第一个
      widget.name = this.widgetList[0].name;
      widget.width = 12;
      widget.widgetId = this.widgetList[0].id;
      widget.type = 'column';
      widget.rows = [];
      widget.flag = 'col-' + this.widgets.length;
      this.widgets.push(widget);
    },
    //删除列
    removeCol(index) {
      this.widgets.splice(index, 1);
    },
    // 拖动完成的回调 
    /*colDragEnd(evt) {
      this.rowData.widgets = this.widgets;
    }*/
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
.flip-list-move {
  transition: transform 0.5s;
}

</style>
