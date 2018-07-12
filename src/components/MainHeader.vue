<template>
	<header class="main-header">
		<a href="#/" class="logo">
			<span class="logo-lg">CBoard-Vue</span>
			<span class="logo-mini">CBoard-Vue</span>
		</a>

		<nav class="navbar clearfix">
			<a href="javascript:void(0);" class="sidebar-toggle clearfix"><i class="el-icon-menu"></i></a>

			<!--  -->
			<div class="navbar-custom-menu">
			  <ul class="nav navbar-nav">
			      <!-- User Account Menu -->
			      <li class="dropdown user user-menu">
			          <!-- Menu Toggle Button -->
			          <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">
			              <!-- The user image in the navbar-->
			              <img src="../assets/user-male-circle-blue-128.png" class="user-image">
			              <!-- hidden-xs hides the username on small devices so only the image appears. -->
			              <span class="hidden-xs">admin</span>
			          </a>
			          <ul class="dropdown-menu">
			              <!-- The user image in the menu -->
			              <li class="user-header">
			                  <img src="" class="img-circle">
			                  <p>
			                      
			                      <small></small>
			                  </p>
			              </li>
			              <!-- Menu Footer-->
			              <li class="user-footer">
			                  <div class="pull-left">
			                      <div class="btn btn-default btn-flat"></div>
			                  </div>
			                  <div class="pull-right">
			                      <a href="j_spring_cas_security_logout" class="btn btn-default btn-flat"></a>
			                  </div>
			              </li>
			          </ul>
			      </li>
			  </ul>
			</div>
			<!--  -->

		</nav>
	</header>
</template>

<script>
export default {
	name: 'MainHeader',
}
</script>

<style scoped>
.main-header {
  position: relative;
  max-height: 100px;
  z-index: 1030;
  box-sizing: border-box;
}
.main-header .logo {
  -webkit-transition: width 0.3s ease-in-out;
  -o-transition: width 0.3s ease-in-out;
  transition: width 0.3s ease-in-out;
  display: block;
  float: left;
  height: 50px;
  font-size: 20px;
  line-height: 50px;
  text-align: center;
  width: 230px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  padding: 0 15px;
  font-weight: 300;
  overflow: hidden;
  background-color: #367fa9;
  color: #fff;
  border-bottom: 0 solid transparent;
}
.main-header .logo .logo-lg {
  display: block;
}
.main-header .logo .logo-mini {
  display: none;
}
.main-header .navbar {
  -webkit-transition: margin-left 0.3s ease-in-out;
  -o-transition: margin-left 0.3s ease-in-out;
  transition: margin-left 0.3s ease-in-out;
  margin-bottom: 0;
  margin-left: 230px;
  border: none;
  min-height: 50px;
  border-radius: 0;
  background-color: #3c8dbc;
  z-index: 1000;
}

.main-header .sidebar-toggle {
  float: left;
  background-color: transparent;
  background-image: none;
  padding: 15px 15px;
  font-family: fontAwesome;
}
.sidebar-toggle i {
  color: #fff;
}

.nav {
  padding-left: 0;
  list-style: none;
}
.nav > li {
  position: relative;
  display: block;
}
.nav > li > a {
  position: relative;
  display: block;
  padding: 10px 15px;
}
.main-header .navbar .nav>li>a {
  color: #fff;
}
.navbar-custom-menu {
  float: right;
}
@media (min-width: 768px) {
  .navbar-nav {
    float: left;
    margin: 0;
  }
  .navbar-nav > li {
    float: left;
  }
  .navbar-nav > li > a {
    padding-top: 15px;
    padding-bottom: 15px;
  }
}
.navbar-custom-menu > .navbar-nav > li {
  position: relative;
}
.open > a {
  background: rgba(0,0,0,0.1);
  color: #f6f6f6;
}
.navbar-nav > .user-menu .user-image {
  float: left;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: -2px;
}
@media (max-width: 767px) {
  .navbar-nav > .user-menu .user-image {
    float: none;
    margin-right: 0;
    margin-top: -8px;
    line-height: 10px;
  }
}

.dropdown-menu {
  display: none;
}
.hidden-xs {
  display: block !important;
}

</style>