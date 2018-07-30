<template>

  <div class="box box-danger" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de; margin-top:20px">

    <div class="box-header" style="cursor: move">Param Row
        <div class="box-tools pull-right">
            <div class="input-group input-group-sm" style="width: 300px;">
                <input type="text" name="table_search" class="form-control pull-right">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-xs btn-primary" @click="addParam">Add Param</button>
                    <button type="button" class="btn btn-box-tool"><i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-box-tool" @click="removeParamRow"><i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="box-body">
      <div class="col-sm-12">
        <div class="form-control" style="min-height: 35px;height: auto;padding: 0px">

          <draggable v-model="params"  @start="drag=true" @end="dragEndHandler">
              <div v-for="(param, index) in params" :key="param.paramType + param.name + index" class="btn-group" style="cursor: move;margin: 3px 3px;">
                <button type="button" class="btn btn-default btn-sm" style="cursor: move;">{{ param.name}}</button>
                <button type="button" class="btn btn-default btn-sm" @click="editParam(param)">
                    <span class="fa fa-edit"></span>
                </button>
                <!-- <button type="button" class="btn btn-default btn-sm">
                    <span class="fa fa-pencil-square"></span>
                </button> -->
                <button type="button" class="btn btn-default btn-sm" @click="removeParam(index)">
                    <span class="fa fa-trash-o"></span>
                </button>
              </div>
          </draggable>

        </div>
      </div>
    </div>

  </div>

</template>

<script>
import draggable from 'vuedraggable';
export default {
  name: 'WidgetConfigParam',
  props: {
    rowData: {
      type: Object,
      require: true
    },
    index: {
      type: Number
    }
  },
  created() {
    this.params = this.rowData.params;
  },
  components: {
    draggable
  },
  computed: {

  },
  data() {
    return {
      params: []
    }
  },
  methods: {
    // 添加 param
    addParam() {
      this.$emit('add-param', this.params);
    },
    // 修改 param
    editParam(param) {
      this.$emit('edit-param', param);
    },
    // 移除 param
    removeParam(index) {
      this.params.splice(index, 1);
    },
    // 移除 Param Row
    removeParamRow() {
      this.$emit('remove-row', this.index);
    },
    // 拖动完成的回调
    dragEndHandler() {
      this.rowData.params = this.params;
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
