<template>
	<div style="max-width: 120px">
		<el-select v-model="value" size="mini" :placeholder="param.name" :clearable="true" @change="selectChangeHandler">
			<el-option
			  v-for="item in options"
			  :key="item"
			  :label="item"
			  :value="item">
			</el-option>
		</el-select>
	</div>
</template>


<script>
export default {
	name: 'ParamSelector',
	props: {
		param: {
			type: Object,
			required: true
		}
	},
	created() {
		let params = {
	      datasetId: this.param.col[0].datasetId,
	      colmunName: this.param.col[0].column
	    };
	    this.$store.dispatch('params/getDimensionValues', params)
	    	.then((data) => {
	    		this.options = data;
	    	})
	    	.catch(() => {});
	},
	data() {
	  return {
	    value: '',
	    options: []
	  }
	},
	computed: {

	},
	methods: {
		selectChangeHandler() {
			let selectorFilter = {
	            col: this.param.col[0].column,
	            type: '=',
	            values: [this.value]
	        };
	        this.$store.commit('params/setFilter', selectorFilter);
		}
	}
}
</script>


<style scoped>
.param-selector {

}
</style>
