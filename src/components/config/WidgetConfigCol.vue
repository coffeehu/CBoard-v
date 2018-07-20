<template>

  <div :class="'col-md-' + colWidth">
    <div class="box box-primary" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de">
        <div class="box-header" style="cursor:move">
            {{ widgetData.name }}
            <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool"><i class="fa fa-link"></i></button>
                <button type="button" class="btn btn-box-tool"><i class="fa fa-unlink"></i></button>
                <button type="button" class="btn btn-box-tool"><i class="fa fa-wrench"></i></button>
                <button type="button" class="btn btn-box-tool"><i class="fa fa-times"></i></button>
            </div>
        </div>
        <div class="box-body">
            <div class="form-group">
                <label>Name</label>
                <el-input v-model="colName" placeholder="请输入内容" class="board-config--input"></el-input>
            </div>
            <div class="form-group">
                <label>Width(1-12)</label>
                <el-input v-model="colWidth" placeholder="请输入内容" class="board-config--input"></el-input>
            </div>
            <div class="form-group">
                <label>Widget</label>
                <!-- <ui-select ng-model="widget.widgetId" ng-init="changeSourceCol(widget, widget.widgetId)" ng-change="changeSourceCol(widget, $select.selected.id)" on-select="widget.name = $item.name">
                    <ui-select-match>
                        {{$select.selected.name}} ({{$select.selected.dataset}})
                    </ui-select-match>
                    <ui-select-choices group-by="widgetGroup"
                                       repeat="w.id as w in widgetList | filter:{name : $select.search}">
                        {{w.name + "(" + w.dataset + ")"}}
                    </ui-select-choices>
                </ui-select> -->
                <el-select v-model="value7" placeholder="请选择" class="board-config--select">
                  <el-option-group
                    v-for="group in selectData"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
            </div>
        </div>
    </div>
  </div>

</template>

<script>


export default {
  name: 'WidgetConfigCol',
  props: {
    widgetData: {
      type: Object,
      required: true
    }
  },
  created() {
    //console.log('-----widgetData----', this.widgetData);
    console.log('--------col------------', this.$store.state.config);
    this.colWidth = this.widgetData.width;
    this.colName = this.widgetData.name;
  },
  computed: {
    widgetList() {
      return this.$store.state.config.widgetList;
    },
    datasetList() {
      return this.$store.state.config.datasetList;
    },
    selectData() {

      let selectData = [];
      for(let i=0,l=this.widgetList.length; i<l; i++) {
        let widget = this.widgetList[i];

        for(let k=0,leng=this.datasetList.length; k<leng; k++) {
          let dataset = this.datasetList[k];
          if(dataset.id === widget.data.datasetId) {
            widget.name = widget.name + '('+ dataset.name +')';
          }
        }

        let isExist = false;
        for(let j=0,len=selectData.length; j<len; j++) {
          if(selectData[j].label === widget.categoryName) {
            isExist = true;
            selectData[j].options.push({
              label: widget.name,
              value: widget.id
            });
          }
        }

        if(!isExist) {
          let item = {
            label: widget.categoryName,
            options: []
          };
          item.options.push({
            label: widget.name,
            value: widget.id
          });
          selectData.push(item);
        }

      }
      console.log('selectData', selectData);
      return selectData;
    }
  },
  data() {
    return {
      colName: '',
      colWidth: 0,
      options3: [
        {
          label: '热门城市',
          options: [
            {
              value: 'Shanghai',
              label: '上海'
            }, 
            {
              value: 'Beijing',
              label: '北京'
            }
          ]
        }, 
        {
          label: '城市名',
          options: [
            {
              value: 'Chengdu',
              label: '成都'
            }, 
            {
              value: 'Shenzhen',
              label: '深圳'
            }, 
            {
              value: 'Guangzhou',
              label: '广州'
            }, 
            {
              value: 'Dalian',
              label: '大连'
            }
          ]
        }
      ],
      value7: '',
      input: ''
    }
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
.board-config--input,
.board-config--select {
    display: block;
}
</style>
