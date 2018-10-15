<!-- 看板分类页面 -->
<template>
    <div class="content">
        <div class="row">
            <!-- 目录面板 -->
            <div class="col-md-3">
                <div class="box box-solid">
                    <div class="box-header with-border">
                        <i class="fa fa-folder-open"></i><h3 class="box-title">Category</h3>
                        <div class="box-tools pull-right">
                            <i class="fa fa-plus toolbar-icon" @click="addCategory"></i>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div v-for="category in categoryList"
                        	 :key="category.id"
                        	 class="category-item">
                        	<span>{{ category.name }}</span>
                        	<span class="pull-right">
                        		<i class="fa fa-edit" @click="editCategory(category)"></i>
								<i class="fa fa-trash-o" @click="deleteCategory(category)"></i>
                        	</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 配置面板 -->
            <div class="col-md-9" v-show="configVisible">
              <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title" style="font-weight: bold">{{ title }}</h3>
                </div>
                <div class="box-body">
                	<div class="form-group" :class="isError ? 'is-error' : ''">
                      <label>Category Name：</label>
                      <el-input v-model="categoryName" placeholder="请输入分类名称" class="board-config--input" @change="isError = false"></el-input>
                      <div v-if="isError" class="error-tag">请输入分类名称</div>
                  </div>
                </div>
                <div class="box-footer">
                    <button @click="cancel" class="btn btn-default pull-right">取消</button>
                    <button @click="save" class="btn btn-primary pull-right">保存</button>
                </div>
              </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
  name: 'CategoryConfig',
  mounted() {

  },
  data() {
  	return {
  		title: '',
  		categoryName: '',
  		configVisible: false,
  		isError: false,
  		currentCategory: {}
  	}
  },
  computed: {
  	categoryList() {
      return this.$store.state.menu.categoryList;
    }
  },
  methods: {
  	addCategory() {
  		this.currentCategory = null;
  		this.title = "Add Category";
  		this.resetConfig();
  		this.configVisible = true;
  	},
  	editCategory(category) {
  		this.currentCategory = category;
  		this.title = "Edit Category";
  		this.categoryName = category.name;
  		this.configVisible = true;
  	},
  	deleteCategory(category) {
		this.$confirm('确定删除吗?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
      customClass: 'preview-config-modal',
			closeOnClickModal: false
		})
		.then(() => {
      //-----线上预览，禁用----
      this.$message({
          type: 'warning',
          message: '该功能已禁用'
      }); 
      return;
      //-----线上预览END----
			let param = {
				id: category.id
			}
			this.$req.post(this.$api.deleteCategory, param)
			.then(response => {
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
				this.$store.dispatch('menu/getCategoryList');
			})
			.catch(error => {
				console.log(error)
			})
		})
		.catch(() => {});
  	},
  	save() {
  		if(this.categoryName === '') {
  			this.isError = true;
  			return;
  		}
  		if(this.currentCategory === null) {
  			this.saveAdd();
  		}else {
  			this.saveUpdate();
  		}
  	},
  	saveAdd() {
  		let param = {
  			json: JSON.stringify( {name: this.categoryName} )
  		}
  		this.$req.post(this.$api.saveNewCategory, param)
  		.then(response => {
  			this.$message({
	          message: '保存成功!',
	          type: 'success'
	        });
	        this.$store.dispatch('menu/getCategoryList');
	        this.resetConfig();
  		})
  		.catch(error => {
  			console.log(error)
  		})
  	},
  	saveUpdate() {
  		let obj = {
  			id: this.currentCategory.id,
  			name: this.categoryName,
  			userId: this.currentCategory.userId
  		}
  		let param = {
  			json: JSON.stringify(obj)
  		}
  		this.$req.post(this.$api.updateCategory, param)
  		.then(response => {
  			this.$message({
	          message: '修改成功!',
	          type: 'success'
	        });
	        this.$store.dispatch('menu/getCategoryList');
	        this.resetConfig();
  		})
  		.catch(error => {
  			console.log(error)
  		})
  	},
  	cancel() {
  		this.resetConfig();
  		this.configVisible = false;
  	},
  	resetConfig() {
  		this.categoryName = '';
  		this.isError = false;
  	}
  }
}
</script>

<style scoped>
.box-header > .box-tools {
    top: 11px!important;
}
.box-primary .box-header > .box-tools {
    top: 5px!important;
}
.box-tools i {
	font-size: 16px;
	cursor: pointer;
}
.box-body label {
	font-size: 16px;
}
.category-item {
	padding: 10px 15px;
	font-size: 14px;
  border-bottom: 1px solid #f4f4f4;
  color: #333;
}
.category-item:hover {
	background-color: #f7f7f7;
}
.category-item i {
	margin-right: 5px;
	cursor: pointer;
	color: #3c8dbc;
}
.box-footer button {
	margin-left: 20px;
}
</style>
