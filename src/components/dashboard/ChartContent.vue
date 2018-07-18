<template>

    <div class="box box-solid" style="z-index: 99;">
        <div class="box-header">
            <h3 class="box-title">{{ widget.name }}</h3>
            <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool">
                	<i class="fa fa-refresh"></i>
                </button>
                <button type="button" class="btn btn-box-tool">
                	<i class="fa fa-wrench"></i>
                </button>
                <button type="button" class="btn btn-box-tool">
                	<i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-box-tool">
                	<i class="fa fa-square-o"></i>
                </button>
            </div>
        </div>

        <div class="box-body" ref="chart-body" style="padding: 3px 0px 3px 13px;height: 500px">
        </div>

    </div>

</template>

<script>
import req from '@/utils/http/request';
import api from '@/utils/http/api';
import { injectFilter, formatConfig } from '@/utils/dashboardConfig.js';

export default {
  name: 'ChartContent',
  props: {
  	widget: {
  		type: Object,
  		required: true
  	}
  },
  mounted() {
  	//console.log('-------ChartContent, this.data-----------', this.widget);
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
  			//console.log('ChartContent response-------------', response);
  			if(response.statusText === 'OK') {
  				//this.value = this.$numbro(response.data.data[0][0]).format(format);
  				
  				this.$emit('load-complete');
  				this.$nextTick(()=>{
  					this.renderChart(response.data);	
  				}) 
  				
  			}
  		})
  		.catch(error => {

  		})
  },
  methods: {
  	renderChart(data) {
  		//console.log('ChartContent data-------------', data);
  		const chartBody = this.$refs['chart-body'];
  		const chart = this.$echarts.init(chartBody, 'theme-fin1');
  		//const chart = this.$echarts.init(chartBody);

  		const echartsBasicOption = {
		    title: {},
		    grid: {
		        left: '50',
		        right: '20',
		        bottom: '15%',
		        top: '15%',
		        containLabel: false
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        x: 'left',
		        itemWidth: 15,
		        itemHeight: 10,
		        data: ['test']
		    },
		    xAxis: {

		    },
		    yAxis: {

		    },
		    series: [{
		    	name: 'test',
				type: 'bar'
		    }]
		};

		const dataArr = data.data;
		let xAxisData = [];
		let seriesData = [];
		for(let i=0,l=dataArr.length; i<l; i++) {
			xAxisData.push(dataArr[i][0]);
			seriesData.push(dataArr[i][1]);
		}
		echartsBasicOption.xAxis.data = xAxisData;
		echartsBasicOption.series[0].data = seriesData;
		//console.log('-----------echartsBasicOption-----------', echartsBasicOption)

		 var option = {
            title: {
            },
            tooltip: {
            	trigger: 'axis'
            },
            grid: {
		        left: '50',
		        right: '20',
		        bottom: '15%',
		        top: '15%',
		        containLabel: false
		    },
            legend: {
                data:['test']
            },
            xAxis: {
                data: xAxisData,
                boundaryGap: true,
                type: 'category'
            },
            yAxis: {},
            series: [{
                name: 'test',
                type: 'bar',
				barMaxWidth: 40,
                valueAxisIndex: 0,
                yAxisIndex: 0,
                data: seriesData
            }]
        };

		chart.setOption(option);
  	}
  }
}
</script>

<style>

</style>
