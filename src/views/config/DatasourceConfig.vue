<template>
	<div class="content datasource">
		<div class="row">
			<!-- 目录面板 -->
  			<div class="col-md-3">
  			    <div class="box box-solid">
  			        <div class="box-header with-border">
  			            <i class="fa fa-dashboard"></i><h3 class="box-title">Data Source</h3>
  			            <div class="box-tools pull-right">
  			                <i class="fa fa-plus toolbar-icon" @click="add"></i>
  			            </div>
  			        </div>
  			        <div class="panel-body">
                        <div v-for="datasource in datasourceList"
                        	 :key="datasource.id"
                        	 class="datasource-item">
                        	<span>{{ datasource.name }}</span>
                        	<span class="pull-right">
                        		<i class="fa fa-edit" @click="edit(datasource)"></i>
								<i class="fa fa-trash-o" @click="del(datasource)"></i>
                        	</span>
                        </div>
                    </div>
  			    </div>
  			</div>

  			<div class="col-md-9" v-if="visible">
  				<div class="box">
	         		<div class="box-header with-border">
	            		<h3 class="box-title" style="font-weight: bold">{{ datasourceForm.name }}</h3>
	        		</div>
	        		<div class="box-body datasource-form">
	        			<div class="el-form-item">
	        				<label class="el-form-item__label">Data Source Type</label>
	        				<div class="el-form-item__content">
	        					<el-select v-model="type" :disabled="!eidtable" style="width: 100%">
	        						<el-option 
	        							v-for="provider in providerList"
	        							:key="provider"
	        							:label="provider"
	        							:value="provider"></el-option>
	        					</el-select>
	        				</div>
	        			</div>
	        			<!-- <jdbc-form v-model="datasourceForm" ref="datasourceForm"></jdbc-form> -->
	        			<component v-show="type !== ''" :is="currentForm" v-model="datasourceForm" ref="datasourceForm"></component>
	        			<div class="el-form-item">
	        				<el-button @click="save" style="float:right;margin-left:10px;" type="primary">Save</el-button>
	        				<el-button style="float:right">Test</el-button>
	        			</div>
	        		</div>
	        	</div>
	        </div>

		</div>
	</div>
</template>

<script>
export default {
  name: 'DatasourceConfig',
  created() {
  	this.$store.dispatch('config/getDatasourceList');
  	this.$store.dispatch('config/getProviderList');
  },
	components: {
	  JdbcForm: () => import('@/components/config/datasource/JdbcForm'),
	  SolrForm: () => import('@/components/config/datasource/SolrForm'),
	  ElasticsearchForm: () => import('@/components/config/datasource/ElasticsearchForm'),
	  SaikuForm: () => import('@/components/config/datasource/SaikuForm'),
	  TextfileForm: () => import('@/components/config/datasource/TextfileForm'),
	  KylinForm: () => import('@/components/config/datasource/KylinForm')
	},
  data() {
  	return {
  		visible: false,
  		eidtable: false,
  		type: '',
  		datasourceForm: {},
  		flag: 'edit' // 用于判断 save 按钮执行的是【添加】还是【更新】
  	}
  },
  computed: {
  	datasourceList() {
  		return this.$store.state.config.datasourceList;
  	},
  	providerList() {
  		return this.$store.state.config.providerList;
  	},
  	currentForm() {
  		switch(this.type) {
  			case 'Elasticsearch':
  				return 'ElasticsearchForm';
  			case 'Solr':
  				return 'SolrForm';
  			case 'saiku':
  				return 'SaikuForm';
  			case 'TextFile':
  				return 'TextfileForm';
  			case 'jdbc':
  				return 'JdbcForm';
  			case 'kylin':
  				return 'KylinForm';
  			default:
  				return 'JdbcForm';
  		}
  	}
  },
  methods: {
  	add() {
  		this.visible = true;
  		this.eidtable = true;
  		this.type = '';
  		this.flag = 'add';
  		this.currentDatasource = {};
  		this.datasourceForm = {};
  	},
  	edit(datasource) {
  		console.log(datasource)
  		this.visible = true;
  		this.eidtable = false;
  		this.flag = 'edit';
  		this.type = datasource.type;
  		this.currentDatasource = datasource;

  		// 给 datasourceForm 赋值
  		let _temp = {};
  		for(let prop in datasource.config) {
  			_temp[prop] = datasource.config[prop];
  		}
  		_temp.name = datasource.name;
  		this.datasourceForm = _temp;
  	},
  	del(datasource) {
  		this.$confirm('是否删除该数据源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        customClass: 'preview-config-modal'
      })
      .then(res => {
      	this.$req.post(this.$api.deleteDatasource, {id: datasource.id})
      		.then(value => {
      			if(value.status === 200) {
      				this.$message({
	                type: 'success',
	                message: '删除成功'
	            });
	            this.$store.dispatch('config/getDatasourceList');
      			}else {
      				this.$message({
	                type: 'error',
	                message: '删除失败'
	            });
      			}
      		})
      		.catch(err => {
      			this.$message({
                type: 'error',
                message: '删除失败'
            });
      		})
      })
      .catch(err => {})
  	},
  	save() {
  		if(this.type === '') return;
  		let url = this.$api.updateDatasource;
  		let message = {
  			success: '保存成功',
  			error: '保存失败'
  		}
  		if(this.flag === 'add') { // 新增接口
  			url = this.$api.addDatasource;
  			message = {
	  			success: '新增成功',
	  			error: '新增失败'
	  		}
  		}
  		this.$refs['datasourceForm'].$children[0].validate(valid => {
  			if(valid) {
  				this.datasourceForm.type = this.type;
  				this.currentDatasource.config = this.datasourceForm;
  				this.currentDatasource.name = this.datasourceForm.name;
  				this.currentDatasource.type = this.datasourceForm.type;
  				let params = {
  					json: JSON.stringify(this.currentDatasource)
  				}
  				this.$req.post(url, params)
  					.then(value => {
  						if(value.status === 200) {
  							this.$message({
		                type: 'success',
		                message: message.success
		            });
		            this.$store.dispatch('config/getDatasourceList');
  						}else {
  							this.$message({
		                type: 'error',
		                message: message.error
		            });
  						}
  					})
  					.catch(error => {
  						this.$message({
	                type: 'error',
	                message: message.error
	            });
  					})
  			}
  		})
  	}
  }
}
</script>

<style scoped>
.panel-body {
	min-height: 30px;
}
.box-tools {
	top: 11px!important;
}
.box-tools i {
	font-size: 16px;
	cursor: pointer;
}
.datasource-item {
	padding: 10px 15px;
	font-size: 14px;
	border-bottom: 1px solid #f4f4f4;
	min-height: 20px;
	color: #333;
}
.datasource-item:hover {
	background-color: #f7f7f7;
}
.datasource-item i {
	margin-right: 5px;
	cursor: pointer;
	color: #3c8dbc;
}
</style>
