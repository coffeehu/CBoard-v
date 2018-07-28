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
		
	},
	data() {
	  return {
	    value: ''
	  }
	},
	computed: {
		options() {
			return this.param.selects;
		}
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
