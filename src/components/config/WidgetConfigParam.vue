<template>

  <div class="box box-danger" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de; margin-top:20px">

    <div class="box-header" style="cursor: move">Param Row
        <div class="box-tools pull-right">
            <div class="input-group input-group-sm" style="width: 300px;">
                <input type="text" name="table_search" class="form-control pull-right">
                <div class="input-group-btn">
                    <button type="button" class="btn btn-xs btn-primary" >Add Param</button>
                    <button type="button" class="btn btn-box-tool"><i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-box-tool"><i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="box-body">
      <div class="col-sm-12">
        <div class="form-control" style="min-height: 35px;height: auto;padding: 0px">
          <div class="btn-group" style="cursor: move;margin: 3px 3px;">
            <button type="button" class="btn btn-default btn-sm" style="cursor: move;">
                test
            </button>
            <button type="button" class="btn btn-default btn-sm">
                <span class="fa fa-edit"></span>
            </button>
            <button type="button" class="btn btn-default btn-sm">
                <span class="fa fa-pencil-square"></span>
            </button>
            <button type="button"
                    class="btn btn-default btn-sm">
                <span class="fa fa-trash-o"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>


export default {
  name: 'WidgetConfigParam',
  props: {
    
  },
  created() {
    
  },
  computed: {

  },
  data() {
    return {
     
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.input-group-sm > .input-group-btn > .btn {
  height: 30px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
}
.input-group-sm > input {
    height: 30px;
}
</style>
