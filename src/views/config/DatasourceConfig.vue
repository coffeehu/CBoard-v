<template>
	<div class="content datasource">
		<div class="row">
			<!-- 目录面板 -->
  			<div class="col-md-3">
  			    <div class="box box-solid">
  			        <div class="box-header with-border">
  			            <i class="fa fa-dashboard"></i><h3 class="box-title">Data Source</h3>
  			            <div class="box-tools pull-right">
  			                <i class="fa fa-plus toolbar-icon"></i>
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
            		<div class="box-body">
            			<el-form :model="datasourceForm" :rules="rules" ref="datasourceForm" class="datasource-form" >
            				<el-form-item label="Data Source Type" prop="type">
            					<el-input v-model="datasourceForm.type" :disabled="true"></el-input>
            				</el-form-item>
            				<el-form-item label="Data Source Name" prop="name">
            					<el-input v-model="datasourceForm.name"></el-input>
            				</el-form-item>
            				<el-form-item label="Driver (eg: com.mysql.jdbc.Driver)" prop="driver">
            					<el-input v-model="datasourceForm.driver"></el-input>
            				</el-form-item>
            				<el-form-item label="JDBC Url (eg: jdbc:mysql://hostname:port/db)" prop="jdbcurl">
            					<el-input v-model="datasourceForm.jdbcurl"></el-input>
            				</el-form-item>
            				<el-form-item label="UserName" prop="username">
            					<el-input v-model="datasourceForm.username"></el-input>
            				</el-form-item>
            				<el-form-item label="Password" prop="password">
            					<el-input v-model="datasourceForm.password" type="password"></el-input>
            				</el-form-item>
            				<el-form-item label="Pooled Connection" prop="pooled">
            					<el-checkbox v-model="datasourceForm.pooled"></el-checkbox>
            				</el-form-item>
            				<el-form-item label="Aggregatable DataProvider" prop="aggregateProvider">
            					<el-checkbox v-model="datasourceForm.aggregateProvider"></el-checkbox>
            				</el-form-item>
            				<el-form-item>
            					<el-button @click="save" style="float:right;margin-left:10px;" type="primary">Save</el-button>
            					<el-button style="float:right">Test</el-button>
            				</el-form-item>
            			</el-form>
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
  },
  data() {
  	return {
  		visible: false,
  		datasourceForm: {
  			type: '',
  			name: '',
  			driver: '',
  			jdbcurl: '',
  			username: '',
  			password: '',
  			pooled: false,
  			aggregateProvider: false
  		},
  		rules: {
  			name: [
  				{ required: true, message: '请输入名称', trigger: 'blur' }
  			],
  			driver: [
  				{ required: true, message: '请输入driver', trigger: 'blur' }
  			],
  			jdbcurl: [
  				{ required: true, message: '请输入URL', trigger: 'blur' }
  			],
  			username: [
  				{ required: true, message: '请输入用户名', trigger: 'blur' }
  			]
  		}
  	}
  },
  computed: {
  	datasourceList() {
  		return this.$store.state.config.datasourceList;
  	}
  },
  methods: {
  	edit(datasource) {
  		console.log(datasource)
  		this.currentDatasource = datasource;
  		this.visible = true;
  		for(let prop in datasource.config) {
  			this.datasourceForm[prop] = datasource.config[prop];
  		}
  		this.datasourceForm.type = datasource.type;
  		this.datasourceForm.name = datasource.name;
  	},
  	del() {

  	},
  	save() {
  		this.$refs['datasourceForm'].validate(valid => {
  			if(valid) {
  				console.log(this.datasourceForm);
  				for(var prop in this.datasourceForm) {
  					if(prop !== 'type' && prop !== 'name') {
  						this.currentDatasource.config[prop] = this.datasourceForm[prop];
  					}
  				}
  				this.currentDatasource.name = this.datasourceForm.name;
  				this.currentDatasource.type = this.datasourceForm.type;
  				let params = {
  					json: JSON.stringify(this.currentDatasource)
  				}
  				this.$req.post(this.$api.updateDatasource, params)
  					.then(value => {
  						if(value.status === 200) {
  							this.$message({
				                type: 'success',
				                message: '保存成功!'
				            });	
  						}else {
  							this.$message({
				                type: 'error',
				                message: '保存失败!'
				            });
  						}
  					})
  					.catch(error => {
  						this.$message({
			                type: 'error',
			                message: '保存失败!'
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
