<template>

    <div class="col-sm-12 dashboard-param">
        <div class="box box-solid" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de">

            <div class="box-header">
                <!-- TODO:信息栏，暂时没发现有什么功能 -->
                <div class="box-tools pull-right">
                    <div class="paramTemplate btn btn-box-tool">hehe</div>
                    <button type="button" class="btn btn-box-tool">
                        <i class="fa fa-info-circle"></i>
                    </button>
                </div>
            </div>

            <div class="box-body">
                <div class="col-sm-12">
                    <div style="min-height: 35px;height: auto;padding: 0px">
                          <div v-for="(param, index) in params" :key="index" class="dashboard-param">
                              <component v-if="!param.cfg || !param.cfg.oneRow" :is="currentParam(param.paramType)" :param="param"></component>
                          </div>
                    </div>
                </div>
                <div class="col-sm-12" v-for="p in oneRowParams">
                  <component :is="currentParam(p.paramType)" :param="p"></component>
                </div>
            </div>
          </div>
    </div>

</template>

<script>
export default {
  name: 'DashboardParam',
  props: {
    params: {
      type: Array,
      require: true,
      default: []
    }
  },
  components: {
    ParamSelector: () => import('@/components/dashboard/params/ParamSelector'),
    ParamSlider: () => import('@/components/dashboard/params/ParamSlider'),
    DatePicker: () => import('@/components/dashboard/params/DatePicker')
  },
  created() {
    this.params.forEach(p => {
      if(p.cfg && p.cfg.oneRow) {
        this.oneRowParams.push(p);
      }
    })
  },
  data() {
    return {
      oneRowParams: [], // 占据一行
    }
  },
  methods: {
    currentParam(type) {
      switch(type) {
        case 'slider':
          return 'ParamSlider';
        case 'selector':
          return 'ParamSelector';
        case 'datePicker':
          return 'DatePicker';
        default:
          return 'ParamSelector';
      }
    }
  }
}
</script>

<style scoped>
.dashboard-param {
  float: left;
  box-sizing: border-box;
  margin-right: 5px;
  width: 100%;
}
</style>
