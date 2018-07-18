<template>
	<header class="main-header">
		<a href="#/" class="logo">
			<span class="logo-lg">CBoard-Vue</span>
			<span class="logo-mini">CBoard-Vue</span>
		</a>

		<nav class="navbar navbar-static-top" role="navigation">
			<a href="javascript:void(0);" class="sidebar-toggle" data-toggle="push-menu" role="button"><span class="sr-only">Toggle navigation</span></a>

			<!--  -->
			<div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
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

</style>