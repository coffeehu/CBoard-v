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
		},
		filterId: String,
		currentValue: String
	},
	watch: {
		param() {
			console.log('watch param')
			this.init();
		}
	},
	created() {
		this.init();
	    /*this.options = this.param.selects;*/
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
		init() {
			this.options = [];
			this.value = this.currentValue;
			this.param.col.forEach(col => {
				let params = {
			      datasetId: col.datasetId,
			      colmunName: col.column
			    };
			    this.$store.dispatch('params/getDimensionValues', params)
			    	.then((data) => {
			    		this.options = this.options.concat(data);
			    		if(this.currentValue !== undefined && this.currentValue !== null) {
			    			this.selectChangeHandler();
			    		}
			    	})
			    	.catch(() => {});
			});
		},
		selectChangeHandler() {
			let selectorFilter = {
	            col: this.param.col[0].column,
	            type: '=',
	            filterId: this.filterId,
	            paramType: 'ParamSelector',
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
