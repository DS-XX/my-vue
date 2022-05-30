<template>
  <el-menu
    mode="horizontal"
    default-active=""
    @select="selectMenuItem">
    <el-submenu
      v-for="(submenus, index) in menus"
      :index="index + 1"
      :key="submenus.pathUrl">
      <template slot="title">{{ submenus.name }}</template>
      <el-menu-item
        v-for="(item) in submenus.children"
        :index="item.pathUrl"
        :key="item.pathUrl">
        {{ item.name }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
export default{
  name: 'SideMenu',
  props: {
    menus: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    selectMenuItem (path) {
      this.$router.push({path})
    }
  }
}
</script>
