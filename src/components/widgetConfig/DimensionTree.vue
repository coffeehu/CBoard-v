<template>
  <ul style="padding-left: 5px" class="schema-tree">
    <li>

      <span>
        <i class="schema-tree-icon dimension-icon"></i>
        <b>Dimension</b>
      </span>

      <draggable v-model="value" :options="options" element="ul">
        <li v-for="(item, index) in value" :key="item.id" :class="{'moveable': !item.columns}">
          <span>
            <i v-if="item.columns" class="fa fa-caret-down"></i>
            <i v-if="item.columns" class="schema-tree-icon hierarchy-icon"></i>
            <i v-else class="schema-tree-icon blue-icon"></i>
            {{ item.alias || item.column }}
            <i v-if="edit" class="fa fa-trash-o" @click="del(index, value)"></i>
          </span>

          <draggable v-if="item.columns" v-model="item.columns" :options="options" element="ul">
            <li v-for="(col, index) in item.columns" :key="col.id" class="moveable">
              <span>
                <i class="schema-tree-icon blue-icon"></i>
                {{ col.alias || col.column }}
                <i v-if="edit" class="fa fa-trash-o" @click="del(index, item.columns)"></i>
              </span>
            </li>
          </draggable>
        </li>
      </draggable>

    </li>
  </ul>

</template>

<script>
export default {
  name: 'DimensionTree',
  props: {
    treeData: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    edit: {  //开启编辑（可以删除结构）
      type: Boolean,
      default: false
    }
  },
  components: {
    draggable: () => import('vuedraggable')
  },
  watch: {
    value(value) {
      this.$emit('input', value);
    },
    treeData() {
      this.value = this.treeData;
    }
  },
  created() {
    this.value = this.treeData;
  },
  data() {
    return {
      value: []
    }
  },
  methods: {
    del(index, arr) {
      arr.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.schema-tree {
  overflow: hidden;
}
.schema-tree li {
  position: relative;
  list-style-type: none;
  margin: 0;
  white-space: nowrap;
}
.schema-tree li:before,
.schema-tree li:after {
  content: '';
  position: absolute;
}
.schema-tree li:before {
  top: 0;
  left: -20px;
  height: 100%;
  width: 1px;
  border-left: 1px dotted black;
}
.schema-tree li:after {
  top: 9px;
  left: -20px;
  height: 100%;
  width: 15px;
  border-top: 1px dotted black; 
}
.schema-tree li:last-child:before {
  height: 11px;
}
.moveable {
  cursor: move;
}

.schema-tree-icon {
  display: inline-block;
  vertical-align: middle;
  width: 15px;
  height: 15px;
}
.dimension-icon {
  background: url(../../assets/imgs/schema/dimension.gif);
}
.hierarchy-icon {
  background: url(../../assets/imgs/schema/hierarchy.gif);
}
.blue-icon {
  background: url(../../assets/imgs/schema/bullet_blue.png);
}

.fa-trash-o {
  cursor: pointer;
}

</style>
