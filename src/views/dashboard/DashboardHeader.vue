<template>
    <section class="content-header clearfix">
        <h1 class="content-header-titile">{{ dashboardTitle }}</h1>
        <div class="breadcrumb" style="cursor: pointer" >
            <div class="m-breadcrumb-item" style="display: inline-block" >
                <button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown"><i class="fa fa-filter"></i>&nbsp;parmas
                    <!-- <span class="fa fa-caret-down"></span> -->
                </button>

            </div>
            <div class="m-breadcrumb-item" style="display: inline-block">
                <button class="btn btn-primary btn-sm">
                    <span><i class="fa fa-refresh"></i>&nbsp;refresh</span>
                </button>
            </div>
            <div class="m-breadcrumb-item" style="display: inline-block" >
                <button class="btn btn-primary btn-sm">
                    <span><i class="fa fa-download" ></i>&nbsp;export</span>
                    <!-- <span><i class="fa fa-spinner fa-spin"></i> Loading</span> -->
                </button>
            </div>
            <div class="m-breadcrumb-item" style="display: inline-block">
                <button class="btn btn-primary btn-sm" @click="editDashBorad">
                    <span><i class="fa fa-edit"></i>&nbsp;edit</span>
                </button>
            </div>
        </div>
    </section>
</template>

<script>
export default {
  name: 'DashboardHeader',
  props: {
    dashboardTitle: {
        type: String
    }
  },
  mounted() {
    
  },
  data () {
    return {

    }
  },
  methods: {
    //跳转到配置页面
    editDashBorad() {
        let id = this.$route.params.id;
        this.$router.push({ path: `/config/board/${id}` }) 
    }
  }
}
</script>

<style scoped>
.content-header {
    padding: 0!important;
}
.content-header-titile {
    display: inline-block;
}
.content-header > .breadcrumb {
    position: static!important;
    padding-right: 0px!important;
}
.m-breadcrumb-item {
    margin-right: 5px;
}
</style>
