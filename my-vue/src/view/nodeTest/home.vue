<template>
    <div class="block">
        <el-carousel height="150px">
            <el-carousel-item v-for="item in homePicture" :key="item">
                <h3 class="small">{{ item }}</h3>
            </el-carousel-item>
        </el-carousel>
  </div>
</template>
<script>
export default {
    name: 'home',
    data(){
        return {
            homePicture: []
        }
    },
    mounted(){
        this.$api.nodeApi.homePicture().then(()=>{
            
        })
    }
}
</script>