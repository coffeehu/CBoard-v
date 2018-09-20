<template>
  <div>
    
    <dashboard-loading v-if="loading" :name="widget.name"></dashboard-loading>

    <div v-else 
         :style="{'background-color': mBackground+'!important'}"
         :class="['small-box', style]">
      <div class="inner">
        <h3 :style="contentStyle">{{ value }}</h3>
        <p>{{ widget.name }}</p>
      </div>
      <div class="icon"></div>
      <div class="small-box-footer">
        <span @click="refresh">
          Refresh
          <i class="fa fa-refresh"></i>
        </span>
        <span>
          Edit
          <i class="fa fa-wrench"></i>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import DashboardLoading from '@/components/dashboard/DashboardLoading';
export default {
  name: 'KpiContent',
  props: {
  	widget: {
  		type: Object,
  		required: true
  	},
    filters: {
      type: Array,
      default() {
        return []
      }
    },
    mBackground: {
      type: String
    }
  },
  components: {
    DashboardLoading
  },
  mounted() {
    this.initByWidget();
  },
  watch: {
    filters() {
      this.initByWidget(true);
    }
  },
  data() {
  	return {
      loading: true,
      widgetData: {},
  		value: '',
  		style: '',
      contentStyle: {
        fontSize: '',
        color: '',
        textAlign: '',
        lineHeight: ''
      }
  	}
  },
  methods: {
    initByWidget(reload) {
      this.widgetData = this.widget.widget.data;
      const format = this.widgetData.config.values[0].format;
      const style = this.style = this.widgetData.config.values[0].style || 'bg-aqua';

      /*----------获得 option，用于调整图表样式----------*/
      let styleOption = this.widget.widget.data.config.option || {};

      if(typeof styleOption === 'object' && typeof styleOption.font === 'object') {
        if(styleOption.font.size) this.contentStyle.fontSize = parseFloat(styleOption.font.size) + 'px';
        if(styleOption.font.align) this.contentStyle.textAlign = styleOption.font.align;
        if(styleOption.font.color) this.contentStyle.color = styleOption.font.color;
        if(styleOption.font.lineHeight) this.contentStyle.lineHeight = parseFloat(styleOption.font.lineHeight) + 'px';
      }

      this.loading = true;
      this.$store.dispatch('dashboard/getWidgetData', {widgetData: this.widgetData, filters: this.filters, reload: reload})
        .then(() => {
          let data = this.$store.state.dashboard.widgetInfoData;
          this.value = this.$numbro(data.data[0][0]).format(format);
          this.loading = false;
        })
    },
    refresh() {
      this.initByWidget(true);
    }
  }
}
</script>

<style>
.small-box-footer span {
  margin-right: 8px;
  cursor: pointer;
}
</style>
