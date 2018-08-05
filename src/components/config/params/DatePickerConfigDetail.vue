<template>
    <div>
    <div class="row param-detail-config">
        <div class="col-md-4">
            <label>width:</label>
            <el-input :value="value.width" @input="handleValue($event, 'width')" placeholder="请输入宽度" size="mini" ></el-input>
        </div>
        <div class="col-md-4">
            <label>max:</label>
            <el-input :value="value.max" @input="handleValue($event, 'max')" placeholder="请输入最大值" size="mini" ></el-input>
        </div>
        <div class="col-md-4">
            <label>min:</label>
            <el-input :value="value.min" @input="handleValue($event, 'min')" placeholder="请输入最小值" size="mini" ></el-input>
        </div>
    </div>
    <div class="row param-detail-config">
        <div class="col-md-4">
            <label>default:</label>
            <el-input :value="value.default" @input="handleValue($event, 'default')" placeholder="请输入默认值" size="mini" ></el-input>
        </div>
        <div class="col-md-4">
            <label>format:</label>
            <el-input :value="value.format" @input="handleValue($event, 'format')" placeholder="请选择格式" size="mini" ></el-input>
        </div>
    </div>
    </div>
</template>


<script>
export default {
  name: 'DatePickerConfigDetail',
  props: {
    value: {
        type: Object
    }
  },
  data() {
    return {
        
    }
  },
  methods: {
    handleValue(value, type) {
        this.value[type] = value;
    }
  }
}
</script>


<style>

</style>

