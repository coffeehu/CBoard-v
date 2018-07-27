<template>
  <base-box :name="widget.name">
    <div class="map-wrapper" :style="boxHeight">
      <div id="map"></div>      
    </div>
  </base-box>
</template>

<script>
/*import req from '@/utils/http/request';
import api from '@/utils/http/api';
import { injectFilter, formatConfig } from '@/utils/dashboardConfig.js';*/
import BaseBox from '@/components/BaseBox';
import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';


export default {
  name: 'MapContent',
  props: {
  	widget: {
  		type: Object
  	},
    height: {
      type: String
    }
  },
  components: {
    BaseBox
  },
  mounted() {
  	/*const widgetData = this.widget.widget.data;
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
  			if(response.statusText === 'OK') {
  				this.value = this.$numbro(response.data.data[0][0]).format(format);
  				this.$emit('load-complete');
  			}
  		})
  		.catch(error => {

  		})*/
    this.$emit('load-complete');
    this.$nextTick(()=>{
      const map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: [0,0],
          zoom: 4
        })
      });
    }) 

  },
  data() {
  	return {

  	}
  },
  computed: {
    boxHeight() {
      if(this.height) {
        let height = parseFloat(this.height)+'px';
        return {height: height}
      }else {
        return {'min-height': '300px'}
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.map-wrapper {
  padding: 10px 30px 30px 30px;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
