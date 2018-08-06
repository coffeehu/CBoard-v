<template>
    <div style="margin-bottom: 10px">
        <div class="row param-detail-config">
            <div class="col-md-4">
                <label style="width:auto;margin-right:8px">占据一行:</label>
                <el-switch
                  v-model="value.oneRow"
                  active-color="#3c8dbc">
                </el-switch>
            </div>
        </div>
    </div>
</template>


<script>
export default {
  name: 'SelectorConfigDetail',
  props: {
    value: {
        type: Object,
        required: true
    }
  }

}
</script>


<style>

</style>

