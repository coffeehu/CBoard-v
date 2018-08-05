<template>
    <div class="box box-solid" style="z-index: 99;">
        <div class="box-header">
            <h3 class="box-title">{{ name }}</h3>
            <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" @click="refresh">
                	<i class="fa fa-refresh"></i>
                </button>
                <button type="button" class="btn btn-box-tool">
                	<i class="fa fa-wrench"></i>
                </button>
                <button type="button" class="btn btn-box-tool">
                	<i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-box-tool" @click="open">
                	<i class="fa fa-square-o"></i>
                </button>
            </div>
        </div>

        <slot></slot>
    </div>
</template>


<script>
export default {
  name: 'DashboardBox',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  methods: {
    refresh() {
        this.$emit('refresh-widget');
    },
    open() {
        this.$emit('open-widget');
    }
  }
}
</script>


<style>

</style>
