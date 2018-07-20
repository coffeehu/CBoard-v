<template>
  <div class="box box-success" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de; margin-top:20px">

    <div class="box-header">Row
        <div class="box-tools pull-right">
            <div class="input-group input-group-sm" style="width: 300px;">
                <input type="text" name="table_search" class="form-control pull-right" :value="rowHeight">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-xs btn-primary">Add Column</button>
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="box-body row">
      <widget-config-col v-for="widget in rowData.widgets" :key="widget.widgetId" :widgetData="widget"></widget-config-col>
    </div>

  </div>
</template>

<script>
import WidgetConfigCol from '@/components/config/WidgetConfigCol';

export default {
  name: 'WidgetConfigRow',
  props: {
    rowData: {
      type: Object,
      require: true
    }
  },
  components: {
    WidgetConfigCol
  },
  created() {
    this.rowHeight = this.rowData.height;
  },
  data() {
    return {
      rowHeight: ''
    }
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
</style>
