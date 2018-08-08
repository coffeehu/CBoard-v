<template>
  <div class="content">

    <dashboard-header :dashboardTitle="dashboardTitle"></dashboard-header>

    <!-- Timeline 页面只能有一个 param，且只能在最上 -->
    <div v-if="paramRow.type === 'param'" class="row">
      <dashboard-param :params="paramRow.params"></dashboard-param>
    </div> 

    <div class="timeline-wrapper">
      <div v-for="(row, index) in layoutData.rows" v-if="row.type==='widget'" class="timeline-item-wrapper">
        <div class="timeline-item">
          <span class="timeline-info">{{ row.nodeName }}</span>
          <i :class="row.node === 'parent' ? 'timeline-tag' : 'timeline-tag-sm'" @click="toggleNode(index, row)"></i>
          <i class="arrow-left"></i>
          <div class="timeline-content">
            <h3 class="timeline-content--header">{{ row.title }}</h3>
            <div class="timeline-content--body" :ref="'timeline-body-'+index">
              <dashboard-widgets :widgets="row.widgets" :height="row.height" class="row"></dashboard-widgets>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import domUtils from '@/utils/dom.js';

export default {
  name: 'TimeLine',
  components: {
    DashboardWidgets: () => import('@/components/dashboard/DashboardWidgets'),
    DashboardHeader: () => import('@/components/dashboard/DashboardHeader'),
    DashboardParam: () => import('@/components/dashboard/DashboardParam')
  },
  created() {
      this.dashboardTitle = this.$store.state.dashboard.boardData.name;
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
  },
  methods: {
    //时间轴折叠/展开过渡效果
    toggleNode(index, row) {
      let body = this.$refs['timeline-body-'+index][0];
      if(row.collapse === undefined) {
        row.bodyHeight = domUtils.outHeight(body, true);
        domUtils.css(body, 'maxHeight', row.bodyHeight);
        setTimeout(function() {
          if(row.collapse) {
            domUtils.css(body, 'maxHeight', row.bodyHeight);
          }else {
            domUtils.css(body, 'maxHeight', 0);
          }
          row.collapse = !row.collapse;  
        })
      }else {
        if(row.collapse) {
          domUtils.css(body, 'maxHeight', row.bodyHeight);
        }else {
          domUtils.css(body, 'maxHeight', 0);
        }
        row.collapse = !row.collapse; 
      } 
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
  font-size: 16px;
  font-weight: 600;
  font-family: "Microsoft YaHei";
  color: #555;
}
.timeline-tag {
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 20px;
  font-size: 15px;
  text-overflow: ellipsis;
  border-radius: 50%;
  background-color: #dd4b39;
  cursor: pointer;
}
.timeline-tag-sm {
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 20px;
  font-size: 15px;
  text-align: center;
}
.timeline-tag-sm:before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #00c0ef;
  cursor: pointer;
}
.timeline-content {
  position: relative;
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
  overflow: hidden;
  -webkit-transition: max-height .3s;
     -moz-transition: max-height .3s;
       -o-transition: max-height .3s;
          transition: max-height .3s;
/*  -webkit-animation-duration: .3s;
          animation-duration: .3s;
  -webkit-animation-fill-mode: both;
          animation-fill-mode: both;*/
}
.collapse-panel {
  -webkit-animation-name: anime-collapse;
          animation-name: anime-collapse;
}
@keyframes anime-collapse {
  0% {
    max-height: 1500px;
  }
  100% {
    max-height: 0px;
  }
}
</style>
