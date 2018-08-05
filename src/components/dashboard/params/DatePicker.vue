<template>
    <div>
      <el-date-picker
          v-model="value"
          :default-value="defaultValue"
          @change="handleChange"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
    </div>
</template>


<script>
export default {
  name: 'DatePicker',
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log('datepicker param', this.param)
  },
  created() {
    this.options = [];
    this.param.col.forEach(col => {
      let params = {
          datasetId: col.datasetId,
          colmunName: col.column
        };
        this.$store.dispatch('params/getDimensionValues', params)
          .then((data) => {
            this.options = this.options.concat(data);
            this.defaultValue = this.options[0];
          })
          .catch(() => {});
    });

  },
  data() {
  	return {
  		value: '',
      defaultValue: '',
      options: []
  	}
  },
  methods: {
    handleChange(value) {
      let filter;
      if(value) {
        filter = {
            col: this.param.col[0].column,
            type: '[a,b]',
            values: value
        };
      }else {
        filter = {
            col: this.param.col[0].column,
            type: '[a,b]',
            values: ''
        };
      }
      this.$store.commit('params/setFilter', filter);
    }
  }
}
</script>


<style>

</style>
