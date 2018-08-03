<template>
  <base-box :name="widget.name" @open-widget="handeOpen">
    <div class="map-wrapper" :style="boxHeight">
      <div ref="map"></div>      
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

let options = {
  name: 'MapContent',
  props: {
    widget: {
      type: Object
    },
    height: {
      type: String
    },
    filters: {
      type: Array,
      default: []
    }
  },
  components: {
    BaseBox
  },
  mounted() {
    this.init();
  },
  watch: {
    widget() {
      this.init();
    },
    filters() {
      this.$emit('load-complete');
    },
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
    init() {
      this.$emit('load-complete');
      this.$nextTick(()=>{
        let mapEl = this.$refs['map'];
        const map = new Map({
          target: mapEl,
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
    handeOpen() {
      let data = {
        componentOptions: options,
        name: this.widget.name,
        widget: this.widget,
        filters: this.filters
      }
      this.$store.commit('widget/openWidget', data);
    },
  }
}

export default options;
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
