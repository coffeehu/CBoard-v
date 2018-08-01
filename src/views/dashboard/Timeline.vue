<template>
  <div class="content">

    <dashboard-header :dashboardTitle="dashboardTitle"></dashboard-header>

    <!-- Timeline 页面只能有一个 param，且只能在最上 -->
    <div v-if="paramRow.type === 'param'" class="row">
      <dashboard-param :params="paramRow.params"></dashboard-param>
    </div> 

    <div class="timeline-wrapper">
      <div v-for="row in layoutData.rows" v-if="row.type==='widget'" class="timeline-item-wrapper">
        <div class="timeline-item">
          <span class="timeline-info">hehe</span>
          <i class="timeline-tag"></i>
          <i class="arrow-left"></i>
          <div class="timeline-content">
            <h3 class="timeline-content--header">title</h3>
            <div class="timeline-content--body">
              <dashboard-widgets :widgets="row.widgets" :height="row.height" class="row"></dashboard-widgets>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardWidgets from '@/components/dashboard/DashboardWidgets';
import DashboardParam from '@/components/dashboard/DashboardParam';

export default {
  name: 'TimeLine',
  components: {
    DashboardHeader,
    DashboardWidgets,
    DashboardParam
  },
  created() {
      this.dashboardTitle = this.$store.state.dashboard.boardData.name;
      console.log(this.layoutData.rows)
      console.log(this.paramRow)
  },
  computed: {
    layoutData() {
      let data = this.$store.state.dashboard.boardData.layout || {};
      return data;
    },
    paramRow() {
      let paramRow = {};
      for(let i=0,l=this.layoutData.rows.length; i<l; i++) {
        if(this.layoutData.rows[i].type === 'param') {
          paramRow = this.layoutData.rows[i];
          break;
        }
      }
      return paramRow;
    }
  },
  data () {
    return {
      dashboardTitle: ''
    }
  }
}
</script>

<style scoped>
.timeline-wrapper {
  position: relative;
}
.timeline-wrapper:before {
  content: '';
  position: absolute;
  top: 30px;
  bottom: 0;
  width: 4px;
  background-color: #ddd;
  left: 63px;
}
.timeline-item {
  position: relative;
  margin-top: 15px;
}
.timeline-info {
  float: left;
  width: 50px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  overflow: hidden;
}
.timeline-tag {
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 20px;
  font-size: 15px;
  border-radius: 50%;
  background-color: #dd4b39;
}
.timeline-content {
  position: relative;
  min-height: 60px;
  border-radius: 0 3px 3px 3px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  background-color: #fff;
  color: #444;
  overflow: hidden;
}
i.arrow-left{
  position: absolute;
  top: 0;
  left: 90px;
  z-index: 2;
  width: 0px;
  height: 0px;
  border-bottom: 10px solid transparent;
  border-top: 10px solid transparent;
  border-right: 10px solid #fff;
  font-size: 0;
}
.timeline-content--header {
  margin: 0;
  line-height: 1.1;
  border-bottom: 1px solid #f4f4f4;
  padding: 10px;
  font-size: 16px;
  color: #555;
}
.timeline-content--body {
  padding: 10px 10px 0 10px;
}
</style>
