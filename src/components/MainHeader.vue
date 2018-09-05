<template>
    <header class="main-header">
        <a href="#/" class="logo">
            <span class="logo-lg">CBoard-Vue</span>
            <span class="logo-mini">CBoard-Vue</span>
        </a>

        <nav class="navbar navbar-static-top" role="navigation">
            <a @click="collapseSider"
                href="javascript:void(0);" 
                class="sidebar-toggle"
                role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>

            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                  <li class="dropdown user user-menu">
                    <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">
                        <img src="../assets/user-male-circle-blue-128.png" class="user-image">
                        <span class="hidden-xs">admin</span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="user-header">
                            <img src="" class="img-circle">
                            <p>
                                
                                <small></small>
                            </p>
                        </li>
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

        </nav>
    </header>
</template>

<script>
export default {
    name: 'MainHeader',
    methods: {
        collapseSider() {
            this.$emit('sider-collapse');
        }
    }
}
</script>

<style scoped>
.layout-wrapper.is-collapse .logo {
  width: 70px!important;
}
.layout-wrapper.is-collapse .navbar {
  margin-left: 70px!important;
}
</style>