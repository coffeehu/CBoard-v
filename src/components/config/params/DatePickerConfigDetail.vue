<template>
    <div style="margin-bottom: 10px">
        <div class="row param-detail-config">
            <div class="col-md-4">
                <label>width:</label>
                <el-input :value="value.width" @input="handleValue($event, 'width')" placeholder="请输入宽度(1-12)" size="mini" ></el-input>
            </div>
            <div class="col-md-4">
                <label>format:</label>
                <el-select v-model="value.format" @change="handleValue($event, 'format')" size="mini" placeholder="请选择格式" style="display:inline-block">
                    <el-option
                      v-for="item in formatOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="col-md-4">
                <label>default:</label>
                <el-input :value="value.default" @input="handleValue($event, 'default')" placeholder="请输入默认值" size="mini" ></el-input>
            </div>
        </div>
        <div class="row param-detail-config">
            <div class="col-md-4">
                <label style="width:auto;margin-right:8px">占据一行:</label>
                <el-switch
                  v-model="value.oneRow"
                  active-color="#3c8dbc">
                </el-switch>
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
        formatOptions: ['yyyy-MM-dd', 'yyyy-MM', 'yyyy-MM-dd HH:mm:ss']
    }
  },
  methods: {
    handleValue(value, type) {
        if(type === 'width') {
            if(value <= 0 ) {
                value = 1;
            }else if(value > 12) {
                value = 12;
            }
        }
        this.value[type] = value;
    }
  }
}
</script>


<style>
.param-detail-config label,
.param-detail-config el-switch {
    margin-top: 0;
    width: 50px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
}
.param-detail-config .el-input,
.param-detail-config .el-select {
  width: auto;
  overflow: hidden;
}
</style>

