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
import req from '@/utils/http/request';
import api from '@/utils/http/api';
import { injectFilter, formatConfig } from '@/utils/dashboardConfig.js';

export default {
  name: 'KpiContent',
  props: {
  	widget: {
  		type: Object,
  		required: true
  	}
  },
  mounted() {
  	//console.log('-------KpiContent, this.data-----------', this.widget);
  	const widgetData = this.widget.widget.data;
  	const format = widgetData.config.values[0].format;
  	const style = this.style = widgetData.config.values[0].style;

  	injectFilter(widgetData);
  	const config = formatConfig(widgetData.config);
  	const params = {
  		datasourceId: widgetData.datasource,
        query: JSON.stringify(widgetData.query),
        datasetId: widgetData.datasetId,
        cfg: JSON.stringify(config),
        reload: false
  	};

  	req.post(api.getAggregateData, params)
  		.then(response => {
  			//console.log('response-------------', response);
  			if(response.statusText === 'OK') {
  				this.value = this.$numbro(response.data.data[0][0]).format(format);
  				this.$emit('load-complete');
  			}
  		})
  		.catch(error => {

  		})
  },
  data() {
  	return {
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
