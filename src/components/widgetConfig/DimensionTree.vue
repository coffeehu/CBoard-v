<template>
  <ul style="padding-left: 5px" class="schema-tree">
    <li>

      <span>
        <i class="schema-tree-icon dimension-icon"></i>
        <b>Dimension</b>
      </span>

      <draggable v-model="value" :options="dragOptions" element="ul">
        <li v-for="(item, index) in treeData" :key="item.id" :class="{'moveable': !item.columns}">
          <span>
            <i v-if="item.columns" class="fa fa-caret-down"></i>
            <i v-if="item.columns" class="schema-tree-icon hierarchy-icon"></i>
            <i v-else class="schema-tree-icon blue-icon"></i>
            {{ item.alias || item.column }}
          </span>

          <draggable v-if="item.columns" v-model="item.columns" :options="dragOptions" element="ul">
            <li v-for="(col, index) in item.columns" :key="col.id" class="moveable">
              <span>
                <i class="schema-tree-icon blue-icon"></i>
                {{ col.alias || col.column }}
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
    }
  },
  components: {
    draggable: () => import('vuedraggable')
  },
  created() {
    this.value = this.treeData;
  },
  data() {
    return {
      value: []
    }
  },
  computed: {
    dragOptions () {
      return  {
        animation: 0,
        group: 'dimensionConfig',
      };
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

</style>
