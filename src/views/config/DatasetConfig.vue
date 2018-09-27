<!-- 数据集管理页面 -->
<template>
    <div class="content">
       <div class="row">
        
          	<!-- 目录面板 -->
			<div class="col-md-3">
			    <div class="box box-solid">
			        <div class="box-header with-border">
			            <i class="fa fa-dashboard"></i><h3 class="box-title">Dataset</h3>
			            <div class="box-tools pull-right">
			                <i class="el-icon-circle-plus-outline"></i>
			            </div>
			        </div>
			        <div class="panel-body">
			            <el-tree 
			              :data="mainTreeData" 
			              :props="defaultProps"
			              @node-click="handleNodeClick"></el-tree>
			        </div>
			    </div>
			</div>

			<div class="col-md-9">
				<div class="box">
	                <div class="box-header with-border">
	                  <h3 class="box-title" style="font-weight: bold">title</h3>
	                </div>
	            </div>
			</div>

        </div>
    </div>
</template>

<script>
export default {
  name: 'DatasetConfig',
  created() {
  	this.$store.dispatch('config/getDatasetList');
  },
  data() {
  	return {
  		defaultProps: {
	    	//label: 'name'
	    },
  	}
  },
  computed: {
  	datasetList() {
      return this.$store.state.config.datasetList;
    },
    mainTreeData() {
    	let treeData = [];
    	this.datasetList.forEach(dataset => {
    		let item = categoryInArray(dataset.categoryName, treeData);
    		if(item === null) {
    			item = {
	    			label: dataset.categoryName,
	    			children: []
	    		}
	    		item.children.push({
	    			label: dataset.name
	    		})
	    		treeData.push(item);
    		}else {
    			item.children.push({
    				label: dataset.name
    			})
    		}

    	})

    	function categoryInArray(categoryName, array) {
    		let result = null;
    		array.forEach(item => {
    			if(item.label === categoryName) result = item;
    		})
    		return result;
    	}

    	return treeData;
    }
  },
  methods: {
  	handleNodeClick(node) {
  		console.log(node)
  	}
  }
}
</script>

<style scoped>

</style>
