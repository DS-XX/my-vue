<template>
  <el-container :direction="vertical">
    <el-header height="50px">
      firstVuecli
    </el-header>
    <el-aside width="200px">
      <SideMenu :menus="routerData"/>
    </el-aside>
    <el-main height="">
      <slot name="main-content"/>
    </el-main>
  </el-container>
</template>
<script>
import SideMenu from './SideMenu'
import routerData from '../const/routerData'
export default{
  name: 'DefaultLayout',
  components: {
    SideMenu
  },
  data () {
    return {
      routerData
    }
  }
}
</script>
