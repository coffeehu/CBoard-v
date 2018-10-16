<template>
  <div>
    <el-form :model="datasourceForm" :rules="rules" ref="datasourceForm">
      <el-form-item label="Data Source Name" prop="name">
          <el-input v-model="datasourceForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Base Path" prop="path">
          <el-input v-model="datasourceForm.path"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'TextfileForm',
  props: {
    value: Object
  },
  watch: {
    value(val) {
      this.datasourceForm = val;
    },
    datasourceForm: {
      handler(val, oldVal) {
        this.$emit('input', val);
      },
      deep: true
    }
  },
  created() {
    this.datasourceForm = this.value;
  },
  data() {
    return {
      datasourceForm: {
        name: '',
        path: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入路径', trigger: 'blur' }
        ],
      }
    }
  },
}
</script>

<style scoped>

</style>