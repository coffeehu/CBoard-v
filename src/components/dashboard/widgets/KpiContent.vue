<template>
  <div>
    
    <dashboard-loading v-if="loading" :name="widget.name"></dashboard-loading>

    <div v-else :class="['small-box', style]">
      <div class="inner">
        <h3>{{ value }}</h3>
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
      default: []
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
  		style: ''
  	}
  },
  methods: {
    initByWidget(reload) {
      this.widgetData = this.widget.widget.data;
      const format = this.widgetData.config.values[0].format;
      const style = this.style = this.widgetData.config.values[0].style;

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
