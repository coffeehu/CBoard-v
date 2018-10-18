<template>
  <ul style="padding-left: 5px" class="schema-tree">
    <li>
      <span>
        <i class="schema-tree-icon measure-icon"></i>
        <b>Measure</b>
      </span>

      <draggable v-model="value" :options="options" element="ul" style="min-height: 20px">
        <li v-for="(item, index) in value" :key="item.column" class="moveable">
          <span>
            <i class="schema-tree-icon red-icon"></i>
            {{ item.column || item.col }}
          </span>
        </li>
      </draggable>

    </li>
  </ul>

</template>

<script>
export default {
  name: 'MeasureTree',
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
    }
  },
  components: {
    draggable: () => import('vuedraggable')
  },
  created() {
    this.value = this.treeData
  },
  watch: {
    value(value) {
      this.$emit('input', value);
    },
    treeData() {
      this.value = this.treeData;
    }
  },
  data() {
    return {
      value: []
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

.measure-icon {
  background: url(../../assets/imgs/schema/measure.gif);
}
.red-icon {
  background: url(../../assets/imgs/schema/bullet_red.png);
}
</style>
