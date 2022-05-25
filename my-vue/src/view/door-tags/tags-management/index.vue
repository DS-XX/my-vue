<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      active-text-color="#EB6C00"
      @select="handleSelect">
      <el-menu-item index="1">门店标签</el-menu-item>
      <el-menu-item index="2">商品标签</el-menu-item>
      <el-menu-item index="3">物品标签</el-menu-item>
    </el-menu>
    <div class="main">
      <div class="grayDiv"/>
      <door-tags v-if="activeIndex==1"/>
      <door-tags v-else/>
    </div>
  </div>
</template>
<script>
import doorTags from './door-tags/index'
export default {
    name: 'TagsManagement',
    components:{
        doorTags
    },
    data(){
        return{
            activeIndex: '1',
        }
    },
    methods:{
        handleSelect(index){
            if(index!=1){
                this.$message.info('功能即将上线')
            }
            this.activeIndex = '1'
        },
    }
}
</script>
<style lang="less" scoped>
.main{
    .grayDiv{
        background: rgba(235, 235, 235, 0.65);
        width: 100%;
        height: 20px;
    }
}
</style>
