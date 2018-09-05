<template>
  <div class="layout-wrapper" :class="isCollapse ? 'is-collapse' : ''">
    <!-- 头部 -->
    <main-header @sider-collapse="siderCollapse"></main-header>

    <!-- 左侧菜单栏 -->
    <main-sider :collapse="isCollapse"></main-sider>

    <!-- 内容主体 -->
    <main-content></main-content>

  </div>
</template>

<script>
import MainHeader from '@/components/MainHeader';
import MainSider from '@/components/MainSider';
import MainContent from '@/components/MainContent';

export default {
  name: 'Layout',
  components: {
    MainHeader,
    MainSider,
    MainContent
  },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    siderCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout-wrapper {
  position: relative;
  min-height: 100%;
}
</style>
