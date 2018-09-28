<!-- 数据集管理页面 -->
<template>
    <div class="content">
      <div class="row">
        
        <!-- 目录面板 -->
  			<div class="col-md-3">
  			    <div class="box box-solid">
  			        <div class="box-header with-border">
  			            <i class="fa fa-dashboard"></i><h3 class="box-title">Dataset</h3>
  			            <!-- <div class="box-tools pull-right">
  			                <i class="el-icon-circle-plus-outline"></i>
  			            </div> -->
  			        </div>
  			        <div class="panel-body">
  			            <el-tree 
  			              :data="mainTreeData" 
  			              :props="mainTreeProps"
  			              @node-click="handleNodeClick"></el-tree>
  			        </div>
  			    </div>
  			</div>

  			<div class="col-md-9" v-if="datasetConfigVisible">
  				<div class="box">
              <div class="box-header with-border">
                <h3 class="box-title" style="font-weight: bold">{{ currentDataset.name }}</h3>
              </div>

              <div class="box-body">
                <!-- Name -->
                <div class="el-form-item">
                  <label class="el-form-item__label">Name:</label>
                  <div class="el-form-item__content">
                    <el-input v-model="currentDataset.name" placeholder="Dataset Name"></el-input>
                  </div>
                </div>

                <!-- Category Name -->
                <div class="el-form-item">
                  <label class="el-form-item__label">Category Name:</label>
                  <div class="el-form-item__content">
                    <el-input v-model="currentDataset.categoryName" placeholder="Category Name"></el-input>
                  </div>
                </div>

                <!-- Datasource -->
                <div class="el-form-item">
                  <label class="el-form-item__label">Datasource:</label>
                  <div class="el-form-item__content">
                    <el-select v-model="currentDataset.data.datasource" placeholder="请选择">
                      <el-option
                        v-for="datasource in datasourceList"
                        :key="datasource.id"
                        :label="datasource.name + ' (' + datasource.type + ')'"
                        :value="datasource.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>

                <!-- SQL Text -->
                <div class="el-form-item">
                  <label class="el-form-item__label">SQL Text:</label>
                  <div class="el-form-item__content">
                    <el-input v-model="currentDataset.data.query.sql" type="textarea" :rows="8" placeholder="input SQL Text"></el-input>
                    <el-button type="primary" size="small" @click="loadData">Load Data</el-button>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="dashed-box dataset-collection">
                      <span v-for="item in datasetCollection" :key="item">{{ item }}</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="dashed-box dataset-tree"></div>
                  </div>
                </div>

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
    this.$store.dispatch('config/getDatasourceList');
  },
  data() {
  	return {
  		mainTreeProps: {
	    	label: 'name'
	    },
      datasetConfigVisible: false,
      currentDataset: null, //当前的 dataset，点击左侧目录node获得
      datasetCollection: null, //点击 Load Data 加载后，虚线框内获得的字段
  	}
  },
  computed: {
  	datasetList() {
      return this.$store.state.config.datasetList;
    },
    datasourceList() {
      return this.$store.state.config.datasourceList;
    },
    /*右侧主目录数据*/
    mainTreeData() {
    	let treeData = [];
    	this.datasetList.forEach(dataset => {
    		let item = categoryInArray(dataset.categoryName, treeData);
    		if(item === null) {
    			item = {
	    			name: dataset.categoryName,
	    			children: []
	    		}
	    		item.children.push(dataset)
	    		treeData.push(item);
    		}else {
    			item.children.push(dataset)
    		}

    	})

    	function categoryInArray(categoryName, array) {
    		let result = null;
    		array.forEach(item => {
    			if(item.name === categoryName) result = item;
    		})
    		return result;
    	}

    	return treeData;
    },
    datasetSelected() {
      let schema = this.currentDataset.data.schema;
      let selects = [];
      selects = selects.concat(schema.measure);
      schema.dimension.forEach(e => {
        if (e.type == 'level') {
            e.columns.forEach(c => {
              selects.push(c);
            })
        } else {
            selects.push(e);
        }
      })
      return selects;
    }
  },
  methods: {
  	handleNodeClick(node) {
      if(node.children) {
        return;
      }
      this.datasetConfigVisible = true;
      this.currentDataset = node;
  		console.log(node)
  	},
    loadData() {
      let params = {
        datasourceId: this.currentDataset.data.datasource,
        query: JSON.stringify( {sql: this.currentDataset.data.query.sql} )
      };
      this.$store.dispatch('config/getColumns', params)
      .then(data => {
        console.log(1111, data)
        console.log(22222, this.datasetSelected)
        this.datasetCollection = data;
      })
    }
  }
}
</script>

<style scoped>
.panel-body {
  padding: 10px 20px;
}
/*表单样式*/
.el-form-item__label {
  font-weight: bold;
  width: 130px;
}
.el-form-item__content {
  overflow: hidden;
}
.dataset-collection span {
  display: inline-block;
  font-size: 12px;
  vertical-align: middle;
  margin: 3px 3px;
  padding: 5px 10px;
  background-color: #fbfcfd;
  color: #333;
  border: 1px solid #d9e3ec;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}
.dataset-collection span.selected {
  background-color: #3497db;
  color: #fff;
}
</style>
