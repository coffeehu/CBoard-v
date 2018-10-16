<template>
  <div>
    <el-form :model="datasourceForm" :rules="rules" ref="datasourceForm">
      <el-form-item label="Data Source Name" prop="name">
          <el-input v-model="datasourceForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Kylin Server" prop="server">
          <el-input v-model="datasourceForm.server"></el-input>
      </el-form-item>
      <el-form-item label="User Name (for Kylin Server)" prop="username">
        <el-input v-model="datasourceForm.username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
          <el-input v-model="datasourceForm.password" type="password"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'KylinForm',
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
        server: '',
        username: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        server: [
          { required: true, message: '请输入server', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
}
</script>

<style scoped>

</style>