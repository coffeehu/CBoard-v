<template>
  <div>
    <el-tabs tab-position="left">

      <el-tab-pane label="Legend">
        <div class="option-wrapper">
          <div class="option-item row">
            <div class="col-md-6">
              <label>Align:</label>
              <el-select v-model="option.legend.align" size="small" placeholder="请选择">
                <el-option
                  v-for="item in alignOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>           
            </div>
            <div class="col-md-6">
              <label>Orient:</label>
              <el-select v-model="option.legend.orient" size="small" placeholder="请选择">
                <el-option
                  v-for="item in orientOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="option-item row">
            <div class="col-md-6">
              <label>Top:</label>
              <el-input v-model="option.legend.top" size="small" placeholder="输入 n%/number/string"></el-input>              
            </div>
            <div class="col-md-6">
              <label>Bottom:</label>
              <el-input v-model="option.legend.bottom" size="small" placeholder="输入 n%/number/string"></el-input>
            </div>
          </div>
          <div class="option-item row">
            <div class="col-md-6">
              <label>Left:</label>
              <el-input v-model="option.legend.left" size="small" placeholder="输入 n%/number/string"></el-input>              
            </div>
            <div class="col-md-6">
              <label>Right:</label>
              <el-input v-model="option.legend.right" size="small" placeholder="输入 n%/number/string"></el-input>
            </div>
          </div>
          <div class="option-item">
            <el-button type="primary" size="mini" @click="applyOption('legend')">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Size">
        <div class="option-wrapper">
          <div class="option-item row">
            <div class="col-md-6">
              <label>Radius:</label>
              <el-input v-model="option.size.radius" size="small" placeholder="输入n% 或 x%,y%"></el-input>              
            </div>
            <div class="col-md-6">
              <label>Center:</label>
              <el-input v-model="option.size.center" size="small" placeholder="输入x%,y% - 逗号分隔"></el-input>              
            </div>
          </div>
          <div class="option-item row">
            <div class="col-md-12">
              <label>Color:</label>
              <el-input style="width: 300px" v-model="option.size.color" size="small" placeholder="输入颜色代码，英文逗号隔开"></el-input>
            </div>
          </div>
          <div class="option-item">
            <el-button type="primary" size="mini" @click="applyOption('size')">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'PieOption',
  data() {
    return {
      option: {
        legend: {
          align: '',
          orient: '',
          top: '',
          bottom: '',
          left: '',
          right: ''
        },
        size: {
          radius: '',
          center: '',
          color: ''
        }
      },
      orientOptions: ['horizontal', 'vertical'],
      alignOptions: ['auto', 'left', 'right'],
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
      }
      this.$emit('apply-option', obj);
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
