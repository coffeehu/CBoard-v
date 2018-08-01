<template>
  <div :class="['small-box', style]">
    <div class="inner">
    	<h3>{{ value }}</h3>
    	<p>{{ widget.name }}</p>
    </div>
    <div class="icon"></div>
    <a href="#" class="small-box-footer">
    	<span>Refresh
    		<i class="fa fa-refresh"></i>
    	</span>
    	<span>Edit
    		<i class="fa fa-wrench"></i>
    	</span>
    </a>
  </div>
</template>

<script>
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
  mounted() {
  	//console.log('-------KpiContent, this.data-----------', this.widget);
  	this.widgetData = this.widget.widget.data;
  	const format = this.widgetData.config.values[0].format;
  	const style = this.style = this.widgetData.config.values[0].style;

    this.$store.dispatch('dashboard/getWidgetData', {widgetData: this.widgetData, filters: this.filters})
      .then(() => {
        let data = this.$store.state.dashboard.widgetInfoData;
        this.value = this.$numbro(data.data[0][0]).format(format);
        this.$emit('load-complete');
      })
  },
  watch: {
    filters() {
      const format = this.widgetData.config.values[0].format;
      this.$store.dispatch('dashboard/getWidgetData', {widgetData: this.widgetData, filters: this.filters})
      .then(() => {
        let data = this.$store.state.dashboard.widgetInfoData;
        this.value = this.$numbro(data.data[0][0]).format(format);
        this.$emit('load-complete');
      })
    }
  },
  data() {
  	return {
      widgetData: {},
  		value: '',
  		style: ''
  	}
  },
  methods: {

  }
}
</script>

<style>

</style>
