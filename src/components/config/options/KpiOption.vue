<template>
  <div>
    <el-tabs tab-position="left">

      <el-tab-pane label="Font">
        <div class="option-wrapper">
          <div class="option-item row">
            <div class="col-md-6">
              <label>Size:</label>
              <el-input v-model="option.font.size" size="small" placeholder="输入 number"></el-input>
            </div>
            <div class="col-md-6">
              <label style="width:auto;margin-right:10px">Line-Height:</label>
              <el-input v-model="option.font.lineHeight" size="small" placeholder="输入 number"></el-input>          
            </div>
          </div>
          <div class="option-item row">
            <div class="col-md-6">
              <label>Color:</label>
              <el-input v-model="option.font.color" size="small" placeholder="输入颜色代码"></el-input>          
            </div>
            <div class="col-md-6">
              <label>Align:</label>
              <el-select v-model="option.font.align" size="small" placeholder="请选择">
                <el-option
                  v-for="item in alignOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>           
            </div>
          </div>
          <div class="option-item">
            <el-button size="mini" @click="clearOption('font')">清除</el-button>
            <el-button type="primary" size="mini" @click="applyOption('font')">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'KpiOption',
  data() {
    return {
      option: {
        font: {
          size: '',
          align: '',
          lineHeight: '',
          color: ''
        }
      },
      alignOptions: ['left', 'center', 'right'],
    }
  },
  methods: {
    applyOption(type) {
      let obj = {};
      obj[type] = this.option[type];
      this.$emit('apply-option', obj);
    },
    clearOption(type) {
      let obj = {};
      obj[type] = {};
      for(let prop in this.option[type]) {
        obj[type][prop] = '';
        this.option[type][prop] = '';
      }
      this.$emit('clear-option', obj);
    }
  }
}
</script>

<style scoped>
.option-wrapper {
  padding: 10px;
}
.option-item {
  margin-right: 0px;
  margin-left: 0px;
  margin-bottom: 20px;
}
.option-item label {
  width: 55px;
}
.option-item .el-input {
  width: 180px;
}
.option-item .el-button {
  float: right;
  margin-right: 30px;
  margin-top: 10px;
}

</style>
