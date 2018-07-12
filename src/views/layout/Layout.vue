<template>
  <div>
    <!-- 头部 -->
    <main-header></main-header>

    <!-- 左侧菜单栏 -->
    <main-sider></main-sider>

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
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
