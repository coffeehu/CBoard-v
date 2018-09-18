<template>
  <div>
    <el-tabs tab-position="left">
      <el-tab-pane label="Grid">
        <div class="option-wrapper">
          <div class="option-item row">
            <div class="col-md-6">
              <label>Top:</label>
              <el-input v-model="option.grid.top" size="small" placeholder="输入 n% 或 数字"></el-input>              
            </div>
            <div class="col-md-6">
              <label>Bottom:</label>
              <el-input v-model="option.grid.bottom" size="small" placeholder="输入 n% 或 数字"></el-input>
            </div>
          </div>
          <div class="option-item row">
            <div class="col-md-6">
              <label>Left:</label>
              <el-input v-model="option.grid.left" size="small" placeholder="输入 n% 或 数字"></el-input>              
            </div>
            <div class="col-md-6">
              <label>Right:</label>
              <el-input v-model="option.grid.right" size="small" placeholder="输入 n% 或 数字"></el-input>
            </div>
          </div>
          <div class="option-item">
            <el-button type="primary" size="mini" @click="applyOption('grid')">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

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
              <el-input v-model="option.legend.top" size="small" placeholder="输入 n% 或 数字"></el-input>              
            </div>
            <div class="col-md-6">
              <label>Bottom:</label>
              <el-input v-model="option.legend.bottom" size="small" placeholder="输入 n% 或 数字"></el-input>
            </div>
          </div>
          <div class="option-item row">
            <div class="col-md-6">
              <label>Left:</label>
              <el-input v-model="option.legend.left" size="small" placeholder="输入 n% 或 数字"></el-input>              
            </div>
            <div class="col-md-6">
              <label>Right:</label>
              <el-input v-model="option.legend.right" size="small" placeholder="输入 n% 或 数字"></el-input>
            </div>
          </div>
          <div class="option-item">
            <el-button type="primary" size="mini" @click="applyOption('legend')">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Category">
        <div class="option-wrapper">
          <div class="option-item row">
            <div class="col-md-6">
              <label>Rotate:</label>
              <el-input v-model="option.category.rotate" size="small" placeholder="范围 90 至 -90"></el-input>
            </div>
          </div>
          <div class="option-item">
            <el-button type="primary" size="mini" @click="applyOption('category')">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Value">
        <div class="option-wrapper">
          <div class="option-item">
            <label>Orient:</label>
            <el-select v-model="option.value.orient" size="small" placeholder="请选择">
              <el-option
                v-for="item in orientOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>                              
          </div>
          <div class="option-item">
            <label>Color:</label>
            <el-input style="width: 300px" v-model="option.value.color" size="small" placeholder="输入颜色代码，英文逗号隔开"></el-input>
          </div>
          <div class="option-item">
            <el-button type="primary" size="mini" @click="applyOption('value')">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Bar">
        <div class="option-wrapper">
          <div class="option-item row">
            <div class="col-md-6">
              <label>Width:</label>
              <el-input v-model="option.bar.width" size="small" placeholder="输入数字"></el-input>
            </div>
            <div class="col-md-6">
              <label style="width: 80px">Max Width:</label>
              <el-input v-model="option.bar.maxWidth" size="small" placeholder="输入数字"></el-input>
            </div>
          </div>
          <div class="option-item row">
            <div class="col-md-6">
              <label style="width:80px">Min Height:</label>
              <el-input v-model="option.bar.minHeight" size="small" placeholder="输入数字"></el-input>
            </div>        
          </div>
          <div class="option-item">
            <el-button type="primary" size="mini" @click="applyOption('bar')">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Line">
        <div class="option-wrapper">
          <div class="option-item row">
            <div class="col-md-6">
              <label style="width: auto">BoundaryGap:</label>
              <el-switch
                v-model="option.line.boundaryGap"
                active-color="#409eff"
                inactive-color="#dcdfe6">
              </el-switch>
            </div>
          </div>
          <div class="option-item row">
            <div class="col-md-6">
              <label style="width: auto">Smooth:</label>
              <el-switch
                v-model="option.line.smooth"
                active-color="#409eff"
                inactive-color="#dcdfe6">
              </el-switch>
            </div>
          </div>
          <div class="option-item">
            <el-button size="mini" @click="clearOption('line')">清除</el-button>
            <el-button type="primary" size="mini" @click="applyOption('line')">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'BarOption',
  data() {
    return {
      option: {
        grid: {
          top: '',
          bottom: '',
          left: '',
          right: ''
        },
        legend: {
          align: '',
          orient: '',
          top: '',
          bottom: '',
          left: '',
          right: ''
        },
        category: {
          rotate: ''
        },
        value: {
          orient: ''
        },
        bar: {
          width: '',
          maxWidth: '',
          minHeight: ''
        },
        line: {
          boundaryGap: '',
          smooth: ''
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
