<template>
	<aside class="main-sidebar">
      <div class="user-panel clearfix">
        <div class="pull-left image">
            <img src="../assets/user-male-circle-blue-128.png" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info">
            <p>admin</p>
        </div>
      </div>

      <div class="tip-menu">MENU</div>

      <el-menu
        router
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#222d32"
        text-color="#b8c7ce"
        active-text-color="#fff">

        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>Dashboard</span>
          </template>

          <template v-for="category in categoryList">
      			<el-submenu v-if="hasChildren(category)" :index="'/dashboard/'+category.name" :key="category.id">
      				<template slot="title"><i class="el-icon-document"></i>{{ category.name }}</template>
      				<el-menu-item v-for="(board, index) in boardList" v-if="inTheCategory(category.id, board)" :index="'/dashboard/'+category.name+'/'+board.id" :key="board.id">
      					<i class="el-icon-menu"></i>
      					<span slot="title">{{ board.name }}</span>
      				</el-menu-item>
      			</el-submenu>
            <el-menu-item v-else :index="'1-'+category.id" :key="category.id">
  	           <i class="el-icon-document"></i>
  	           <span slot="title">{{ category.name }}</span>
  	        </el-menu-item>
          </template>
        </el-submenu>

        <el-submenu :index="'/'+menuItem.menuCode" v-for="(menuItem, index) in menuList" :key="menuItem.menuId">
    			<template slot="title">
    				<i class="el-icon-location"></i>
    				<span>{{ $t(menuItem.menuName) }}</span>
    			</template>
    			<el-menu-item :index="formatRouteByMenuCode(childItem.menuCode)" v-for="childItem in menuItem.children" :key="childItem.menuId">
    				<i class="el-icon-document"></i>
    				<span slot="title">{{$t(childItem.menuName)}}</span>
    			</el-menu-item>
  		  </el-submenu>

      </el-menu>
    </aside>
</template>

<script>
import req from '@/utils/http/request';
import api from '@/utils/http/api';

export default {
	name: 'MainSider',
	mounted() {
		this.getMenuList();
		this.getCategoryList();
		this.getBoardList();
	},
	data() {
		return {
			menuList: [],
			categoryList: [],
			boardList: []
		};
	},
	methods: {
		getMenuList() {
			req.get(api.getMenuList)
			.then((response) => {
				if(response.statusText === 'OK') {
					console.log('menuList', response.data);
					this.menuList = this.formatMenuList(response.data);
					console.log(1111111, this.menuList);
				}
			})
			.catch((error) => {
				console.log(error)
			});
		},
		getCategoryList() {
			req.get(api.getCategoryList)
			.then((response) => {
				if(response.statusText === 'OK') {
					console.log('catgoryList',response.data);
					this.categoryList = response.data;
				}
			})
			.catch((error) => {
				console.log(error)
			});
		},
		getBoardList() {
			req.get(api.getBoardList)
			.then((response) => {
				if(response.statusText === 'OK') {
					console.log('boardList',response.data);
					this.boardList = response.data;
				}
			})
			.catch((error) => {
				console.log(error)
			});
		},
		hasChildren(category) {
			for(let i=0,l=this.boardList.length; i<l; i++){
				if(category.id === this.boardList[i].categoryId) return true;
			}
			return false;
		},
		inTheCategory(categoryId, board) {
			return categoryId === board.categoryId;
		},
		formatMenuList(data) {
			let menuData = [];
			for(let i=0,l=data.length; i<l; i++) {
				let itemData = data[i];
				if(itemData.parentId === -1) {
					itemData.children = [];
					menuData.push(itemData);
				}else {
					for(let j=0,len=data.length; j<len; j++) {
						if(itemData.parentId === data[j].menuId) {
							data[j].children.push(itemData);
							break;
						}
					}
				}
			}
			return menuData;
		},
    formatRouteByMenuCode(menuCode) {
      const menuCodeArr = menuCode.split('.');
      return '/' + menuCodeArr[0] + '/' +menuCodeArr[1];
    }
	}
}
</script>


<style scoped>
.user-panel{
  position: relative;
  width: 100%;
  padding: 10px;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
}
.user-panel > .image > img {
  width: 100%;
  max-width: 45px;
  height: auto;
}
.img-circle {
  border-radius: 50%;
}
.user-panel .info {
  padding: 5px 5px 5px 15px;
  line-height: 1;
  position: absolute;
  left: 55px;
  color: #fff;
  margin: 4px 0 0 5px;
}
.user-panel > .info > p {
  font-weight: 600;
  margin-bottom: 9px;
}
.tip-menu {
  position: relative;
  margin: 0;
  cursor: pointer;
  white-space: nowrap;
  padding: 10px 25px 10px 15px;
  font-size: 12px;
  background: #1a2226;
  color: #4b646f;
}
.el-menu {
  border-right: none;
}
.main-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 50px;
  min-height: 100%;
  width: 230px;
  z-index: 810;
  background-color: #222d32;
  -webkit-transition: -webkit-transform 0.3s ease-in-out, width 0.3s ease-in-out;
  -moz-transition: -moz-transform 0.3s ease-in-out, width 0.3s ease-in-out;
  -o-transition: -o-transform 0.3s ease-in-out, width 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
}
</style>