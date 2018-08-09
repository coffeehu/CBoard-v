<template>

  <div style="height:100%">
    <dashboard-loading v-if="loading" :name="widget.name"></dashboard-loading>

    <dashboard-box v-else :name="widget.name" @open-widget="handeOpen">
      <div class="map-wrapper" :style="boxHeight">
        <div ref="map" style="width:100%;height:100%"></div>      
      </div>
    </dashboard-box>
  </div>

</template>

<script>
//import { injectFilter, formatConfig } from '@/utils/dashboardConfig.js';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardBox from '@/components/dashboard/DashboardBox';
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
    DashboardBox,
    DashboardLoading
  },
  mounted() {
    this.init();
  },
  watch: {
    widget() {
      this.init();
    },
    filters() {
    },
  },
  data() {
    return {
      loading: true
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
      setTimeout(() => {
        this.loading = false;
        this.$nextTick(()=>{
          this.renderMap();
        }) 
      });
    },
    renderMap() {
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
