<template>
  <div class="box box-success" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de; margin-top:20px">
    <div v-if="rowData.type === 'widget'">

    <div class="box-header" style="cursor: move">Row
        <div class="box-tools pull-right">
            <div class="input-group input-group-sm" style="width: 300px;">
                <input type="text" name="table_search" class="form-control pull-right" v-model="rowData.height">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-xs btn-primary" @click="addCol">Add Column</button>
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-box-tool" data-widget="remove" @click="removeRow"><i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="box-body">
      <draggable v-model="widgets"  @start="drag=true" :options="dragOptions">
        <transition-group type="transition" name="flip-list" tag="div" class="row" style="min=height:50px">
          <widget-config-col v-for="(widget, index) in widgets"
            :class="'col-md-' + widget.width"
            :key="widget.flag"
            :index="index"
            :widgetData="widget"
            @remove-col="removeCol"></widget-config-col>
        </transition-group>
      </draggable>
    </div>

    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import WidgetConfigCol from '@/components/config/WidgetConfigCol';

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
    WidgetConfigCol,
    draggable
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
      }else if(this.rowData.type === 'param') {

      }
    },
    //删除行
    removeRow() {
      this.$emit('remove-row', this.index);
    },
    //添加列
    addCol() {
      var widget = {};
      // 新增的默认显示 widgetList 中第一个
      widget.name = this.widgetList[0].name;
      widget.width = 12;
      widget.widgetId = this.widgetList[0].id;
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
