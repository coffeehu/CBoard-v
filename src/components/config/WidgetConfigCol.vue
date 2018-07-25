<template>

  <!-- <div :class="'col-md-' + mWidth" style="min-width:150px"> -->
  <div style="min-width:150px">
    <div class="box box-primary" style="border-left: 1px solid #d2d6de; border-right: 1px solid #d2d6de">
        <div class="box-header" style="cursor:move">
            {{ widget.name }}
            <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool"><i class="fa fa-link"></i></button>
                <button type="button" class="btn btn-box-tool"><i class="fa fa-unlink"></i></button>
                <button type="button" class="btn btn-box-tool"><i class="fa fa-wrench"></i></button>
                <button type="button" class="btn btn-box-tool" @click="removeCol"><i class="fa fa-times"></i></button>
            </div>
        </div>
        <div class="box-body">
            <div class="form-group">
                <label>Name</label>
                <el-input v-model="widget.name" placeholder="请输入内容" class="board-config--input"></el-input>
            </div>
            <div class="form-group">
                <label>Width(1-12)</label>
                <el-input 
                  v-model="widget.width" 
                  @blur="widthBlurHandler"
                  placeholder="请输入内容" 
                  class="board-config--input"></el-input>
            </div>
            <div class="form-group">
                <label>Widget</label>
                <el-select 
                  v-model="widget.widgetId" 
                  @change="selectChangeHandler" 
                  placeholder="请选择" 
                  class="board-config--select">
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
    },
    index: {
      type: Number
    }
  },
  created() {
    this.widget = this.widgetData;
    // 宽度 this.widget.width
    // Name: this.widget.name
    // widgetId: this.widget.widgetId
    this.mWidth = this.widget.width;
  },
  computed: {
    // 列宽度样式，如 'col-md-6'
    colClass() {
      if(this.widget.width < 0) {
        this.widget.width = 0;
      }else if(this.widget.width > 12) {
        this.widget.width = 12;
      }
      return 'col-md-' + this.widget.width;
    },
    // 所有的 wdget 类型，用于展示下拉框数据
    widgetList() {
      return this.$store.state.config.widgetList;
    },
    // 所有的 dataset 类型，用于展示下拉框数据
    datasetList() {
      return this.$store.state.config.datasetList;
    },
   /*
      注意1、下拉框显示的值如： KPI1(foodmart_sample)，需要手动拼接；
      KPI1 为 widget.name,
      括号里的值 (foodmart_sample) 为改 widget 对应的 dataset.name，
      getWidgetList.do 中得到 widget.data.datasetId，
      getDatasetList.do 获得所有的 dataset 类型

      注意2、selectData 的格式如下：
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
          label: '冷门城市',
          options: [
            {
              value: 'Chengdu',
              label: '成都'
            }, 
            {
              value: 'Shenzhen',
              label: '深圳'
            }
          ]
        }
      ]
    */
    selectData() {
      let selectData = [];
      for(let i=0,l=this.widgetList.length; i<l; i++) {
        let widget = this.widgetList[i];

        for(let k=0,leng=this.datasetList.length; k<leng; k++) {
          let dataset = this.datasetList[k];
          if(dataset.id === widget.data.datasetId) {
            widget.showName = widget.name + '('+ dataset.name +')';
          }
        }

        // 没有 datasetId 的时候
        if(!widget.data.datasetId) {
          widget.showName = widget.name + '(Query)';          
        }

        let isExist = false;
        for(let j=0,len=selectData.length; j<len; j++) {
          if(selectData[j].label === widget.categoryName) {
            isExist = true;
            selectData[j].options.push({
              label: widget.showName,
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
            label: widget.showName,
            value: widget.id
          });
          selectData.push(item);
        }

      }
      return selectData;
    }
  },
  data() {
    return {
      widget: {},
      mWidth: '3' // 行的宽度
    }
  },
  methods: {
    //删除列
    removeCol() {
      this.$emit('remove-col', this.index);
    },
    selectChangeHandler(value) {
      console.log(value)
      for(let i=0,l=this.widgetList.length; i<l; i++) {
        let widget = this.widgetList[i];
        if(widget.id === value) {
          this.widget.name = widget.name;
          this.widgetId = this.widget.widgetId = widget.id;
          break;
        }
      }
    },
    widthBlurHandler() {
      if(this.widget.width < 1) this.widget.width = 1;
      if(this.widget.width > 12) this.widget.width = 12;
      this.mWidth = this.widget.width;
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
