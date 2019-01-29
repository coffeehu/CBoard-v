<template>

  <div style="min-width:150px">
    <div class="box box-primary" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de">

        <div class="box-header" style="cursor: move">
          <div class="box-header-name">Column</div>
          <div class="box-tools pull-right">
              <div class="input-group input-group-sm" style="width: 300px;">
                  <input v-model="widgetData.width" type="text" name="table_search" class="form-control pull-right">
                  <div class="input-group-btn">
                      <button type="button" class="btn btn-xs btn-success" @click="addRow">Add Row</button>
                      <button type="button" class="btn btn-box-tool"><i class="fa fa-minus"></i>
                      </button>
                      <button type="button" class="btn btn-box-tool" @click="removeColumn"><i class="fa fa-times"></i>
                      </button>
                  </div>
              </div>
          </div>
        </div>

        <div class="box-body">
          <div v-for="(row, index) in widgetData.rows" :key="row.flag">
              <widget-config-row v-if="row.type === 'widget'" 
                                 :index="index" 
                                 :rowData="row"
                                 @remove-row="removeRow"></widget-config-row>
          </div>
        </div>

    </div>
  </div>

</template>

<script>


export default {
  name: 'WidgetConfigColumn',
  props: {
    widgetData: {
      type: Object,
      required: true,
      default: {}
    },
    index: {
      type: Number,
      default: -1
    }
  },
  components: {
    WidgetConfigRow: () => import('@/components/config/board/WidgetConfigRow')
  },
  created() {
    
  },
  computed: {
    // 列宽度样式，如 'col-md-6'
    colClass() {
      /*if(this.widget.width < 0) {
        this.widget.width = 0;
      }else if(this.widget.width > 12) {
        this.widget.width = 12;
      }
      return 'col-md-' + this.widget.width;*/
    },
    // 所有的 wdget 类型，用于展示下拉框数据
    widgetList() {
      return this.$store.state.config.widgetList;
    },
    // 所有的 dataset 类型，用于展示下拉框数据
    datasetList() {
      return this.$store.state.config.datasetList;
    },
  
  },
  data() {
    return {
      widget: {},
      mWidth: '3' // 行的宽度
    }
  },
  methods: {
    addRow() {
      const row = {type: 'widget', widgets: []};
      row.flag = 'config-row-' + this.widgetData.rows.length;
      this.widgetData.rows.push(row);
    },
    removeColumn() {
      this.$emit('remove-col', this.index);
    },
    removeRow(index) {
      this.widgetData.rows.splice(index, 1);
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

</style>
