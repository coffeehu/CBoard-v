<template>
  <div>
    <el-form :model="datasourceForm" :rules="rules" ref="datasourceForm">
      <el-form-item label="Data Source Name" prop="name">
          <el-input v-model="datasourceForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Solr Servers" prop="servers">
          <el-input v-model="datasourceForm.servers" placeholder="<ip>:<port>,[<ip>:<port>]..."></el-input>
      </el-form-item>
      <el-form-item label="Pooled Connection" prop="pooled">
          <el-checkbox v-model="datasourceForm.pooled"></el-checkbox>
      </el-form-item>
      <el-form-item label="Aggregatable DataProvider(Must Solr5.0+)" prop="aggregateProvider">
          <el-checkbox v-model="datasourceForm.aggregateProvider"></el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SolrForm',
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
        servers: '',
        pooled: false,
        aggregateProvider: false
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        servers: [
          { required: true, message: '请输入servers', trigger: 'blur' }
        ],
      }
    }
  },
}
</script>

<style scoped>

</style>